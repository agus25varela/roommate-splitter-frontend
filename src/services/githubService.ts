import { env } from '@/config/env'
import type {
    ActivityEvent,
    DashboardData,
    GithubCommit,
    GithubPull,
    GithubRun,
    GithubRunStatus,
} from '@/types/dashboard'

const GITHUB_API = 'https://api.github.com'
const PER_PAGE = 30

/** Payload crudo de commits de la API REST de GitHub. */
interface CommitRaw {
    sha: string
    commit: {
        message: string
        author?: { name?: string; date?: string }
    }
    author: { login?: string } | null
    html_url: string
}

/** Payload crudo de pull requests de la API REST de GitHub. */
interface PullRaw {
    id: number
    number: number
    title: string
    state: string
    user: { login?: string } | null
    created_at: string
    merged_at: string | null
    html_url: string
}

/** Payload crudo de runs de GitHub Actions. */
interface RunRaw {
    id: number
    name: string | null
    status: string
    conclusion: string | null
    head_sha: string
    created_at: string
    updated_at: string
    html_url: string
}

/** Perfil del repo: nombre dueño y default_branch. */
interface RepoRaw {
    html_url: string
    default_branch: string
}

/**
 * Ejecuta un GET contra la API REST pública de GitHub.
 *
 * Si hay token configurado se envía `Authorization: Bearer` (modo público
 * sin token con límite de 60 req/h por IP).
 *
 * @param path ruta relativa (ej. `/repos/owner/repo/commits`).
 * @returns respuesta JSON tipada.
 * @throws Error si la petición falla o GitHub responde con error.
 */
async function obtenerJson<T>(path: string): Promise<T> {
    const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    }
    if (env.githubToken) {
        headers.Authorization = `Bearer ${env.githubToken}`
    }
    const response = await fetch(`${GITHUB_API}${path}`, { headers })
    if (!response.ok) {
        throw new Error(`GitHub API ${response.status} en ${path}`)
    }
    return (await response.json()) as T
}

/** @returns préfijo de repo codificado: `/repos/{owner}/{repo}`. */
function repoPath(): string {
    return `/repos/${encodeURIComponent(env.githubOwner)}/${encodeURIComponent(env.githubRepo)}`
}

/** Normaliza el estado de una PR considerando merges. */
function mapearEstadoPull(state: string, mergedAt: string | null): GithubPull['state'] {
    if (mergedAt !== null) {
        return 'merged'
    }
    return state === 'closed' ? 'closed' : 'open'
}

/** `'completed'` | `'in_progress'` | `'queued'` | ... */
function mapearEstadoRun(status: string): GithubRunStatus {
    if (status === 'queued' || status === 'requested' || status === 'waiting' || status === 'pending') {
        return 'queued'
    }
    if (status === 'in_progress') {
        return 'in_progress'
    }
    return 'completed'
}

/**
 * Normaliza un commit crudo a `GithubCommit`.
 *
 * @param raw payload del endpoint de commits.
 * @returns commit normalizado.
 */
function mapearCommit(raw: CommitRaw): GithubCommit {
    return {
        sha: raw.sha,
        message: raw.commit.message.split('\n')[0],
        author: raw.author?.login ?? raw.commit.author?.name ?? 'desconocido',
        date: raw.commit.author?.date ?? new Date().toISOString(),
        url: raw.html_url,
    }
}

/**
 * Normaliza una PR cruda a `GithubPull`.
 *
 * @param raw payload del endpoint de pulls.
 * @returns pull request normalizada.
 */
function mapearPull(raw: PullRaw): GithubPull {
    return {
        id: raw.id,
        number: raw.number,
        title: raw.title,
        state: mapearEstadoPull(raw.state, raw.merged_at),
        user: raw.user?.login ?? 'desconocido',
        createdAt: raw.created_at,
        mergedAt: raw.merged_at,
        url: raw.html_url,
    }
}

/**
 * Normaliza un run crudo a `GithubRun`.
 *
 * @param raw payload del endpoint de actions/runs.
 * @returns run normalizado.
 */
function mapearRun(raw: RunRaw): GithubRun {
    return {
        id: raw.id,
        name: raw.name ?? `workflow-${raw.id}`,
        status: mapearEstadoRun(raw.status),
        conclusion: raw.conclusion,
        headSha: raw.head_sha.slice(0, 7),
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
        url: raw.html_url,
    }
}

/**
 * Combina commits, PRs y runs en una timeline unificada ordenada por fecha.
 *
 * @param commits commits normalizados.
 * @param pulls pull requests normalizadas.
 * @param runs runs normalizados.
 * @returns eventos ordenados de más reciente a más antiguo.
 */
function construirActividad(
    commits: GithubCommit[],
    pulls: GithubPull[],
    runs: GithubRun[],
): ActivityEvent[] {
    const eventos: ActivityEvent[] = [
        ...commits.map((c: GithubCommit): ActivityEvent => ({
            id: `commit-${c.sha}`,
            type: 'commit',
            title: c.message,
            subtitle: c.author,
            date: c.date,
            meta: c.sha.slice(0, 7),
        })),
        ...pulls.map((p: GithubPull): ActivityEvent => ({
            id: `pull-${p.id}`,
            type: 'pull',
            title: p.title,
            subtitle: `#${p.number} · ${p.user}`,
            date: p.createdAt,
            meta: p.state,
        })),
        ...runs.map((r: GithubRun): ActivityEvent => ({
            id: `run-${r.id}`,
            type: 'run',
            title: r.name,
            subtitle: r.status === 'completed' ? (r.conclusion ?? 'sin conclusión') : 'en ejecución',
            date: r.createdAt,
            meta: r.headSha,
        })),
    ]
    eventos.sort((a: ActivityEvent, b: ActivityEvent) => b.date.localeCompare(a.date))
    return eventos
}

/**
 * Construye el `DashboardData` completo a partir de los payloads crudos.
 *
 * @param rawCommits respuesta del endpoint de commits.
 * @param rawPulls respuesta del endpoint de pulls.
 * @param rawRuns respuesta del endpoint de actions/runs.
 * @param rawRepo respuesta del endpoint del repo.
 * @param isDemo si los datos son de ejemplo.
 * @param warning mensaje asociado (causa del demo).
 * @returns datos del dashboard.
 */
function construirDashboard(
    rawCommits: CommitRaw[],
    rawPulls: PullRaw[],
    rawRuns: RunRaw[],
    rawRepo: RepoRaw,
    isDemo: boolean,
    warning: string | null,
): DashboardData {
    const commits = rawCommits.map(mapearCommit)
    const pulls = rawPulls.map(mapearPull)
    const runs = rawRuns.map(mapearRun)
    return {
        repo: `${env.githubOwner}/${env.githubRepo}`,
        defaultBranch: rawRepo.default_branch,
        repoUrl: rawRepo.html_url,
        commits,
        pulls,
        runs,
        activity: construirActividad(commits, pulls, runs),
        commitsCount: commits.length,
        pullsCount: pulls.length,
        openPullsCount: pulls.filter((p: GithubPull) => p.state === 'open').length,
        runsCount: runs.length,
        lastUpdated: new Date().toISOString(),
        isDemo,
        warning,
    }
}

/**
 * Genera un `DashboardData` de ejemplo cuando no hay repo configurado o la
 * red falla. Los datos quedan claramente marcados como demo.
 *
 * @param warning motivo por el cual se usa el fallback.
 * @returns datos de ejemplo.
 */
function demoDashboard(warning: string): DashboardData {
    const demoCommits = [
        { sha: 'a1b2c3d4', message: 'fix: no duplicar usuarioId en el dashboard', author: 'agus25varela', date: '2026-09-13T18:10:00.000Z', url: '#' },
        { sha: 'e5f6a7b8', message: 'feat: endpoint de balances (BalanceDTO)', author: 'agus25varela', date: '2026-09-12T14:20:00.000Z', url: '#' },
        { sha: 'c0d1e2f3', message: 'refactor: controlador de gastos', author: 'agus25varela', date: '2026-09-11T09:05:00.000Z', url: '#' },
        { sha: '9a8b7c6d', message: 'docs: leer README de la API', author: 'agus25varela', date: '2026-09-09T20:45:00.000Z', url: '#' },
    ]
    const demoPulls = [
        { id: 12, number: 12, title: 'feat: dashboard del proyecto', state: 'open' as const, user: 'agus25varela', createdAt: '2026-09-13T15:00:00.000Z', mergedAt: null, url: '#' },
        { id: 11, number: 11, title: 'fix: contrato de GastoResponseDTO', state: 'merged' as const, user: 'agus25varela', createdAt: '2026-09-10T11:30:00.000Z', mergedAt: '2026-09-10T13:00:00.000Z', url: '#' },
        { id: 10, number: 10, title: 'chore: configurar CORS local', state: 'closed' as const, user: 'agus25varela', createdAt: '2026-09-05T08:00:00.000Z', mergedAt: null, url: '#' },
    ]
    const demoRuns = [
        { id: 401, name: 'CI', status: 'completed' as const, conclusion: 'success', headSha: 'a1b2c3d', createdAt: '2026-09-13T18:12:00.000Z', updatedAt: '2026-09-13T18:20:00.000Z', url: '#' },
        { id: 400, name: 'CI', status: 'completed' as const, conclusion: 'success', headSha: 'e5f6a7b', createdAt: '2026-09-12T14:22:00.000Z', updatedAt: '2026-09-12T14:31:00.000Z', url: '#' },
        { id: 399, name: 'CI', status: 'completed' as const, conclusion: 'failure', headSha: 'c0d1e2f', createdAt: '2026-09-11T09:06:00.000Z', updatedAt: '2026-09-11T09:15:00.000Z', url: '#' },
    ]

    const commits = demoCommits.map((c) => ({
        sha: c.sha,
        message: c.message,
        author: c.author,
        date: c.date,
        url: c.url,
    }))
    const pulls = demoPulls.map((p) => ({ ...p }))
    const runs = demoRuns.map((r) => ({ ...r }))

    return {
        repo: env.hasGithubRepo ? `${env.githubOwner}/${env.githubRepo}` : 'agus25varela/roommate-splitter-backend',
        defaultBranch: 'main',
        repoUrl: '#',
        commits,
        pulls,
        runs,
        activity: construirActividad(commits, pulls, runs),
        commitsCount: commits.length,
        pullsCount: pulls.length,
        openPullsCount: pulls.filter((p: GithubPull) => p.state === 'open').length,
        runsCount: runs.length,
        lastUpdated: new Date().toISOString(),
        isDemo: true,
        warning,
    }
}

/**
 * Obtiene los datos del dashboard.
 *
 * Si no hay repo configurado, la API falla o el límite de rate se agota:
 * devuelve datos de ejemplo marcados como `isDemo: true`.
 *
 * @returns datos del dashboard (frescos o demo).
 */
export async function obtenerDashboard(): Promise<DashboardData> {
    if (!env.hasGithubRepo) {
        return demoDashboard('No hay repositorio configurado. Verificá VITE_GITHUB_REPO_OWNER y VITE_GITHUB_REPO_NAME.')
    }
    try {
        const [rawCommits, rawPulls, rawRuns, rawRepo] = await Promise.all([
            obtenerJson<CommitRaw[]>(`${repoPath()}/commits?per_page=${PER_PAGE}`),
            obtenerJson<PullRaw[]>(`${repoPath()}/pulls?state=all&per_page=${PER_PAGE}`),
            obtenerJson<RunRaw[]>(`${repoPath()}/actions/runs?per_page=${PER_PAGE}`),
            obtenerJson<RepoRaw>(repoPath()),
        ])
        return construirDashboard(rawCommits, rawPulls, rawRuns, rawRepo, false, null)
    } catch {
        return demoDashboard('GitHub no responde (¿sin token o sin límite de rate?). Mostrando datos de ejemplo.')
    }
}