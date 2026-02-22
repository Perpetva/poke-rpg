const cooldowns = {};

export function setCooldown(userId, durationMs) {
    const timeout = Date.now() + durationMs;
    cooldowns[userId] = timeout;
}

export function isOnCooldown(userId) {
    const now = Date.now();
    return cooldowns[userId] && cooldowns[userId] > now;
}

export function getRemainingTime(userId) {
    const remaining = cooldowns[userId] - Date.now();
    return Math.ceil(remaining / 1000); 
}