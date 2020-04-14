export const MAX_LINE_LENGTH = 50;

export function getDisplayedLineLength(lineLength) {
    return lineLength ? (lineLength < MAX_LINE_LENGTH ? lineLength : MAX_LINE_LENGTH + "+") : 0
}
