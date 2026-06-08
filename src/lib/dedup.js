// deduplicate

export function battleId(tag, battleTime) {
    return String(tag + '_' + battleTime)
}