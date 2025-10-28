export function normalizeNumber(value) {
    if (!value) return ''
    const noSuffix = value.split(':')[0]

    return noSuffix.split('@')[0].replace(/\D/g, '')
}