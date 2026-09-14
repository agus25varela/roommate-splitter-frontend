/**
 * Configuración central del entorno.
 *
 * Centraliza la lectura de variables de entorno de Vite, con valores por
 * defecto y normalización, para que el resto de la app no dependa de
 * `import.meta.env` directamente.
 */

/** Normaliza un valor de entorno devolviendo un string o cadena vacía. */
function readEnv(value: string | undefined): string {
    return value?.trim() ?? ''
}

export interface EnvConfig {
    apiUrl: string
    githubOwner: string
    githubRepo: string
    githubToken: string
    /** Indica si el dashboard tiene un repo de GitHub configurado. */
    hasGithubRepo: boolean
}

const apiUrl = readEnv(import.meta.env.VITE_API_URL) || 'http://localhost:8080/api'
const githubOwner = readEnv(import.meta.env.VITE_GITHUB_REPO_OWNER)
const githubRepo = readEnv(import.meta.env.VITE_GITHUB_REPO_NAME)
const githubToken = readEnv(import.meta.env.VITE_GITHUB_TOKEN)

export const env: EnvConfig = {
    apiUrl,
    githubOwner,
    githubRepo,
    githubToken,
    hasGithubRepo: githubOwner.length > 0 && githubRepo.length > 0,
}