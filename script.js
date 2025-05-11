function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function generateColorPalette() {
    // Generate a base hue (0-360)
    const baseHue = Math.floor(Math.random() * 360);

    // Generate saturation and lightness values that work well together
    const saturation = Math.floor(Math.random() * 30) + 40; // 40-70%
    const lightness = Math.floor(Math.random() * 30) + 25; // 25-55%

    // Generate variations of the base color
    const colors = [];

    // Base color
    colors.push({hsl: `hsl(${baseHue}, ${saturation}%, ${lightness}%)`, hex: hslToHex(baseHue, saturation, lightness)});

    // Complementary color (180 degrees away)
    colors.push({hsl: `hsl(${(baseHue + 180) % 360}, ${saturation}%, ${lightness}%)`, hex: hslToHex((baseHue + 180) % 360, saturation, lightness)});

    // Analogous colors (30 degrees away)
    colors.push({hsl: `hsl(${(baseHue + 30) % 360}, ${saturation}%, ${lightness}%)`, hex: hslToHex((baseHue + 30) % 360, saturation, lightness)});
    colors.push({hsl: `hsl(${(baseHue - 30 + 360) % 360}, ${saturation}%, ${lightness}%)`, hex: hslToHex((baseHue - 30 + 360) % 360, saturation, lightness)});

    // Tint (lighter version)
    colors.push({hsl: `hsl(${baseHue}, ${saturation}%, ${lightness + 20}%)`, hex: hslToHex(baseHue, saturation, lightness + 20)});

    return colors;
}

function updateColors() {
    const colors = generateColorPalette();
    const divs = document.querySelectorAll('.vertical-div');
    const texts = document.querySelectorAll('.color-text');

    divs.forEach((div, index) => {
        const color = colors[index];
        div.style.backgroundColor = color.hsl;
        texts[index].textContent = color.hex;
    });
}

// Add click event listener to each color div
document.querySelectorAll('.vertical-div').forEach(div => {
    div.addEventListener('click', function() {
        // Get the hex code from the color-text element
        const hexCode = this.querySelector('.color-text').textContent;

        // Copy to clipboard
        navigator.clipboard.writeText(hexCode)
            .then(() => {
                // Add a temporary message to show it was copied
                const message = document.createElement('div');
                message.textContent = 'Copied!';
                message.style.position = 'absolute';
                message.style.top = '50%';
                message.style.left = '50%';
                message.style.transform = 'translate(-50%, -50%)';
                message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                message.style.color = 'white';
                message.style.padding = '10px 20px';
                message.style.borderRadius = '5px';
                message.style.zIndex = '1000';

                document.body.appendChild(message);

                // Remove the message after 1 second
                setTimeout(() => {
                    message.remove();
                }, 1000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    });
});

document.getElementById('generate-button').addEventListener('click', updateColors);