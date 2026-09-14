/**
 * Tipos del dashboard de proyecto basado en GitHub.
 *
 * Normaliza las respuestas de la API REST de GitHub a estructuras propias,
 * estables para la UI. Los datos frescos vienen del repo configurado; si no
 * hay repo o la red falla se usa un fallback demo claramente marcado.
 */

/** Commit normalizado para la UI. */
export interface GithubCommit {
    sha: string
    message: string
    author: string
    date: string
    url: string
}

/** Pull request normalizada para la UI. */
export interface GithubPull {
    id: number
    number: number
    title: string
    state: 'open' | 'closed' | 'merged'
    user: string
    createdAt: string
    mergedAt: string | null
    url: string
}

/** Estado normalizado de un run de GitHub Actions. */
export type GithubRunStatus =
    | 'completed'
    | 'in_progress'
    | 'queued'
    | 'requested'
    | 'waiting'
    | 'pending'
    | 'action_required'

/** Ran de GitHub Actions normalizado. */
export interface GithubRun {
    id: number
    name: string
    status: GithubRunStatus
    conclusion: string | null
    headSha: string
    createdAt: string
    updatedAt: string
    url: string
}

/** Tipos de evento para la timeline unificada de actividad. */
export type ActivityType = 'commit' | 'pull' | 'run'

/** Evento de la timeline unificada (commits + PRs + runs). */
export interface ActivityEvent {
    id: string
    type: ActivityType
    title: string
    subtitle: string
    date: string
    meta: string
}

/** Datos completos que consume el dashboard. */
export interface DashboardData {
    /** `owner/repo` del repositorio fuente. */
    repo: string
    /** Rama por defecto del repositorio. */
    defaultBranch: string
    /** URL pública del repositorio. */
    repoUrl: string
    commits: GithubCommit[]
    pulls: GithubPull[]
    runs: GithubRun[]
    activity: ActivityEvent[]
    commitsCount: number
    pullsCount: number
    openPullsCount: number
    runsCount: number
    /** ISO timestamp de la última actualización. */
    lastUpdated: string
    /** `true` cuando los datos son de ejemplo (fallback). */
    isDemo: boolean
    /** Mensaje adicional (p. ej. causa del fallback). */
    warning: string | null
}