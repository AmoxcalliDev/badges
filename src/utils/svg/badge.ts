import { getBadgeIcon } from '@/utils/icons/iconHelper';

const FONT = "Verdana,Geneva,DejaVu Sans,sans-serif";
const HEIGHT = 28;
const MIN_TEXT_WIDTH = 30;

// Verdana 11px average character widths by case
const getCharWidth = (textCase?: TextCase): number => {
    switch (textCase) {
        case 'upper': return 8.5; // uppercase letters are wider
        case 'lower': return 6.5; // lowercase letters are narrower
        case 'random': return 7.5; // roughly half upper, half lower
        default: return 7;   // capitalize or mixed
    }
};

export type TextCase = 'lower' | 'upper' | 'capitalize' | 'random';

export interface BadgeOptions {
    icon?: string;
    iconColor?: string;
    iconSize?: number;
    leftBg?: string;
    rightBg?: string;
    labelCase?: TextCase;
    valueCase?: TextCase;
}

const applyCase = (text: string, textCase?: TextCase): string => {
    if (!textCase) return text;
    switch (textCase) {
        case 'lower': return text.toLowerCase();
        case 'upper': return text.toUpperCase();
        case 'capitalize': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        case 'random': return text.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
    }
};

export const getBadgeSvg = (label: string, value: string, options: BadgeOptions = {}): string => {
    const {
        icon,
        iconColor = '#ffffff',
        iconSize = 14,
        leftBg = '#555',
        rightBg = '#238636',
        labelCase,
        valueCase,
    } = options;

    const labelText = applyCase(label, labelCase);
    const valueText = applyCase(value, valueCase);

    const labelTextWidth = Math.max(labelText.length * getCharWidth(labelCase), MIN_TEXT_WIDTH);
    const valueTextWidth = Math.max(valueText.length * getCharWidth(valueCase), MIN_TEXT_WIDTH);

    // Layout: with icon uses asymmetric padding, without icon uses symmetric padding
    const iconPad = 6;
    const iconTextGap = 4;
    const labelPadRight = 6;
    const sidePad = 8;
    const valuePad = 10;

    const leftWidth = icon
        ? iconPad + iconSize + iconTextGap + labelTextWidth + labelPadRight
        : sidePad + labelTextWidth + sidePad;

    const rightWidth = valuePad + valueTextWidth + valuePad;
    const totalWidth = leftWidth + rightWidth;

    const labelTextX = icon
        ? iconPad + iconSize + iconTextGap + Math.round(labelTextWidth / 2)
        : Math.round(leftWidth / 2);
    const valueTextX = leftWidth + Math.round(rightWidth / 2);
    const textY = Math.round(HEIGHT / 2) + 4;

    const iconGroup = icon
        ? (() => {
            const iconY = Math.round((HEIGHT - iconSize) / 2);
            const iconSvg = getBadgeIcon(icon, iconColor, iconSize);
            return `\n    <g transform="translate(${iconPad}, ${iconY})">${iconSvg}</g>`;
        })()
        : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${HEIGHT}" role="img" aria-label="${labelText}: ${valueText}">
        <title>${labelText}: ${valueText}</title>
        <rect width="${leftWidth}" height="${HEIGHT}" fill="${leftBg}"/>
        <rect x="${leftWidth}" width="${rightWidth}" height="${HEIGHT}" fill="${rightBg}"/>${iconGroup}
        <g fill="#fff" font-family="${FONT}" font-size="11" text-anchor="middle">
            <text x="${labelTextX}" y="${textY - 1}" fill="#010101" fill-opacity=".3">${labelText}</text>
            <text x="${labelTextX}" y="${textY}">${labelText}</text>
            <text x="${valueTextX}" y="${textY - 1}" fill="#010101" fill-opacity=".3" font-weight="bold">${valueText}</text>
            <text x="${valueTextX}" y="${textY}" font-weight="bold">${valueText}</text>
        </g>
    </svg>`;
};
