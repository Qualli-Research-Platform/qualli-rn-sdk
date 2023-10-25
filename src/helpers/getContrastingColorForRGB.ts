export default function getContrastingColorForRGB(mainColor: {
    r: number;
    g: number;
    b: number;
}) {
    // Assuming mainColor is an object with r, g, and b properties
    const brightness =
        0.299 * mainColor.r + 0.587 * mainColor.g + 0.114 * mainColor.b;
    return brightness > 128 ? 'black' : 'white';
}
