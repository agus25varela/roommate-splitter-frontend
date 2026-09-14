import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'rs-theme'

/**
 * Preferencia de tema guardada, o `null` si el usuario nunca la definió.
 */
function savedPreference(): ThemeMode | null {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' || value === 'system' ? value : null
}

/**
 * Resuelve el modo real observando la preferencia del sistema operativo.
 */
function resolveSystem(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Aplica la clase `.dark` en `<html>` según el modo resuelto.
 */
function applyToDocument(theme: ThemeMode): void {
    const resolved = theme === 'system' ? resolveSystem() : theme
    document.documentElement.classList.toggle('dark', resolved === 'dark')
}

/**
 * Composable de tema (dark mode).
 *
 * - `theme`: modo elegido (light | dark | system).
 * - `resolved`: modo efectivo para mostrar el estado actual.
 * - `setTheme`: persiste y aplica el modo.
 * - `toggleTheme`: alterna light/dark (ignora system).
 *
 * @returns API del composable de tema.
 */
export function useTheme() {
    const theme = ref<ThemeMode>(savedPreference() ?? 'system')
    const resolved = ref<'light' | 'dark'>(
        theme.value === 'system' ? resolveSystem() : theme.value,
    )

    const apply = (mode: ThemeMode): void => {
        applyToDocument(mode)
        resolved.value = mode === 'system' ? resolveSystem() : mode
    }

    /**
     * Inicializa el tema aplicando la preferencia guardada o la del sistema.
     * Debe llamarse al arrancar la aplicación (main.ts).
     */
    const initTheme = (): void => {
        apply(theme.value)
    }

    /**
     * Guarda y aplica un modo de tema nuevo.
     *
     * @param mode modo a persistir.
     */
    const setTheme = (mode: ThemeMode): void => {
        theme.value = mode
        localStorage.setItem(STORAGE_KEY, mode)
        apply(mode)
    }

    /**
     * Alterna entre light y dark partiendo del modo resuelto actual.
     */
    const toggleTheme = (): void => {
        setTheme(resolved.value === 'dark' ? 'light' : 'dark')
    }

    return { theme, resolved, initTheme, setTheme, toggleTheme }
}