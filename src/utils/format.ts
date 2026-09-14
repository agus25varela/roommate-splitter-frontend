/**
 * Utilidades de formato de fechas y números para la UI.
 */

const DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
})

const DATETIME_FORMATTER = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
})

/**
 * Formatea una fecha ISO corta (ej. `14 sep 2026`).
 *
 * @param iso fecha en formato ISO.
 * @returns cadena formateada en español.
 */
export function formatearFecha(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) {
        return iso
    }
    return DATE_FORMATTER.format(date)
}

/**
 * Formatea una fecha ISO con hora (ej. `14 sep 2026, 18:10`).
 *
 * @param iso fecha en formato ISO.
 * @returns cadena formateada en español.
 */
export function formatearFechaHora(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) {
        return iso
    }
    return DATETIME_FORMATTER.format(date)
}

/**
 * Devuelve una cadena relativa corta (ej. `hace 2 h`).
 *
 * @param iso fecha en formato ISO.
 * @returns cadena relativa al presente.
 */
export function tiempoRelativo(iso: string): string {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) {
        return iso
    }
    const diffMs = Date.now() - date.getTime()
    const minutes = Math.floor(diffMs / 60_000)
    if (minutes < 1) {
        return 'ahora'
    }
    if (minutes < 60) {
        return `hace ${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `hace ${hours} h`
    }
    const days = Math.floor(hours / 24)
    if (days < 30) {
        return `hace ${days} d`
    }
    return formatearFecha(iso)
}