
export function parseMoney(value) {
    const prefixes = ["", "K", "M", "B", "T", "P", "E", "Z", "Y", "R", "Q"];
    let scaledValue = value;
    if (value < 0.01){return "0";}

    for (let i = prefixes.length - 1; i >= 1; i--) {
        const scale = Math.pow(10, i * 3);
        if (scaledValue >= scale) {
            const scaled = scaledValue / scale;
            return scaled.toFixed(3) + prefixes[i];
        }
    }

    return scaledValue.toFixed(3);
}

