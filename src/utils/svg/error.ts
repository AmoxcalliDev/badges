const FONT = "Verdana,Geneva,DejaVu Sans,sans-serif";
const HEIGHT = 28;
const LEFT_BG = '#555';
const ERROR_BG = '#e05d44';
const CHAR_WIDTH = 7;
const PAD = 8;

/**
 * Generates a flat SVG error badge matching the project's badge design system.
 * @param label  - Left panel text (e.g. "followers", "AmoxcalliDev")
 * @param message - Right panel text (e.g. "error", "unavailable"). Defaults to "error".
 */
export const getErrorSvg = (label: string, message: string = 'error'): string => {
    const labelTextWidth = Math.max(label.length * CHAR_WIDTH, 30);
    const leftWidth = PAD + labelTextWidth + PAD;

    const msgTextWidth = Math.max(message.length * CHAR_WIDTH, 30);
    const rightWidth = PAD + msgTextWidth + PAD;

    const totalWidth = leftWidth + rightWidth;
    const labelX = Math.round(leftWidth / 2);
    const msgX = leftWidth + Math.round(rightWidth / 2);
    const textY = Math.round(HEIGHT / 2) + 4;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${HEIGHT}" role="img" aria-label="${label}: ${message}">
        <title>${label}: ${message}</title>
        <rect width="${leftWidth}" height="${HEIGHT}" fill="${LEFT_BG}"/>
        <rect x="${leftWidth}" width="${rightWidth}" height="${HEIGHT}" fill="${ERROR_BG}"/>
        <g fill="#fff" font-family="${FONT}" font-size="11" text-anchor="middle">
            <text x="${labelX}" y="${textY - 1}" fill="#010101" fill-opacity=".3">${label}</text>
            <text x="${labelX}" y="${textY}">${label}</text>
            <text x="${msgX}" y="${textY - 1}" fill="#010101" fill-opacity=".3" font-weight="bold">${message}</text>
            <text x="${msgX}" y="${textY}" font-weight="bold">${message}</text>
        </g>
    </svg>`;
};
