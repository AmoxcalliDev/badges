import { getIconData, iconToSVG } from '@iconify/utils';

/**
 * @param iconIdentifier - Format: "family:iconName" (e.g. "logos:twitch")
 * @param color - Color of the icon (default: white)
 * @param size - Size of the icon in pixels (default: 14)
 * @returns SVG string of the requested icon, or a warning icon if not found.
 */
export const getBadgeIcon = (iconIdentifier: string, color: string = '#fff', size: number = 14): string => {
    try {
        // * 1. We split the iconIdentifier into prefix and iconName. For example, "logos:twitch" becomes prefix="logos" and iconName="twitch".
        const [prefix, iconName] = iconIdentifier.split(':');

        if (!prefix || !iconName) return '';

        // * 2. Dynamic import: We only load the requested family into memory.
        // TODO: Next.js will know how to find this inside node_modules without adding 200MB to your final bundle.
        const collection = require(`@iconify/json/json/${prefix}.json`);

        // * 3. We extract only the path of the icon using getIconData, which gives us the raw data needed to render the SVG. This is more efficient than loading the entire icon set into memory.
        const iconData = getIconData(collection, iconName);
        if (!iconData) return '';

        // * 4. We convert the icon data to an SVG string using iconToSVG
        const renderData = iconToSVG(iconData, { height: size });

        // * 5. We assemble the attributes and the final string
        const svgAttributes = Object.keys(renderData.attributes)
            .map((key) => `${key}="${renderData.attributes[key as keyof typeof renderData.attributes]}"`)
            .join(' ');

        const svg = `<svg ${svgAttributes} fill="${color}">${renderData.body}</svg>`;

        // * 6. We replace any "currentColor" in the SVG with the specified color, to ensure it renders correctly regardless of the context and returns the final SVG string.
        return svg.replace(/currentColor/g, color);
    } catch (error) {
        // TODO: If anything goes wrong (icon not found, invalid format, etc.), we log the error and return an empty string.
        console.error(`Error trying to load icon "${iconIdentifier}":`, error);
        return 'material-symbols:warning-outline-rounded'; // * Fallback icon (warning)
    }
};