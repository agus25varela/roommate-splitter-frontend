declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, unknown>
    export default component
}

interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    readonly VITE_GITHUB_REPO_OWNER?: string
    readonly VITE_GITHUB_REPO_NAME?: string
    readonly VITE_GITHUB_TOKEN?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}