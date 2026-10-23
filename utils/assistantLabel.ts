/**
 * A-Z 26 个字母数组（内部使用，不导出）
 */
const ASSISTANT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const

/**
 * 根据索引获取助手字母（A-Z）
 * @param index 索引值，范围 0-25
 * @returns 对应的字母，如果索引超出范围返回空字符串
 */
export function getAssistantLetter(index: number): string {
    if (index >= 0 && index < ASSISTANT_LETTERS.length) {
        return ASSISTANT_LETTERS[index]
    }
    return ''
}
