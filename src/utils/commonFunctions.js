export function normalizeNumber(value = '') {
    if (typeof value !== 'string') return ''
    
    const match = value.match(/(\d{6,15})(?=@|$)/g)
    if (!match) return ''
    
    return match.pop()
}

export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}