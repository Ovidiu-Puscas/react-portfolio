// Function to calculate complementary color
export const calculateComplementary = (hexColor) => {
  // Remove the # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate complementary (255 - each component)
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;

  // Convert back to hex
  const compHex =
    '#' +
    compR.toString(16).padStart(2, '0') +
    compG.toString(16).padStart(2, '0') +
    compB.toString(16).padStart(2, '0');

  return compHex;
};

// Function to convert RGB to HSL
export const rgbToHsl = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
      default:
        h = 0;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Function to convert HSL to RGB
export const hslToRgb = (h, s, l) => {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  let r, g, b;

  if (sNorm === 0) {
    r = g = b = lNorm; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1 / 2) return q;
      if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
      return p;
    };

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Function to calculate monochromatic colors
export const calculateMonochromatic = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return [hexColor];

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colors = [];
  // Generate 5 monochromatic variations
  for (let i = 0; i < 5; i++) {
    const newL = Math.max(0, Math.min(100, l + (i - 2) * 20));
    const [r, g, b] = hslToRgb(h, s, newL);
    colors.push(rgbToHex(r, g, b));
  }

  return colors;
};

// Function to calculate analogous colors
export const calculateAnalogous = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return [hexColor];

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colors = [];
  // Generate 5 analogous colors (30° apart)
  for (let i = -2; i <= 2; i++) {
    const newH = (h + i * 30 + 360) % 360;
    const [r, g, b] = hslToRgb(newH, s, l);
    colors.push(rgbToHex(r, g, b));
  }

  return colors;
};

// Function to calculate triadic colors
export const calculateTriadic = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return [hexColor];

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colors = [];
  // Generate 3 triadic colors (120° apart)
  for (let i = 0; i < 3; i++) {
    const newH = (h + i * 120) % 360;
    const [r, g, b] = hslToRgb(newH, s, l);
    colors.push(rgbToHex(r, g, b));
  }

  return colors;
};

// Function to calculate tetradic colors
export const calculateTetradic = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return [hexColor];

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colors = [];
  // Generate 4 tetradic colors (2 pairs of complementary colors)
  // First pair: base color and its complement
  const [r1, g1, b1] = hslToRgb(h, s, l);
  const [r2, g2, b2] = hslToRgb((h + 180) % 360, s, l);

  // Second pair: offset by 30° from the first pair
  const [r3, g3, b3] = hslToRgb((h + 30) % 360, s, l);
  const [r4, g4, b4] = hslToRgb((h + 210) % 360, s, l);

  colors.push(rgbToHex(r1, g1, b1));
  colors.push(rgbToHex(r2, g2, b2));
  colors.push(rgbToHex(r3, g3, b3));
  colors.push(rgbToHex(r4, g4, b4));

  return colors;
};

// Function to calculate square colors
export const calculateSquare = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return [hexColor];

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colors = [];
  // Generate 4 square colors (90° apart, same as tetradic but different naming)
  for (let i = 0; i < 4; i++) {
    const newH = (h + i * 90) % 360;
    const [r, g, b] = hslToRgb(newH, s, l);
    colors.push(rgbToHex(r, g, b));
  }

  return colors;
};

// Function to calculate colors based on harmony type
export const calculateHarmony = (hexColor, harmonyType) => {
  switch (harmonyType) {
    case 'complementary':
      return [hexColor, calculateComplementary(hexColor)];
    case 'monochromatic':
      return calculateMonochromatic(hexColor);
    case 'analogous':
      return calculateAnalogous(hexColor);
    case 'triadic':
      return calculateTriadic(hexColor);
    case 'tetradic':
      return calculateTetradic(hexColor);
    case 'square':
      return calculateSquare(hexColor);
    default:
      return [hexColor, calculateComplementary(hexColor)];
  }
};

// Function to validate hex color
export const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

// Function to convert RGB to Hex
export const rgbToHex = (r, g, b) =>
  '#' +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');

// Function to convert Hex to RGB
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Function to calculate color brightness
export const getBrightness = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0;
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
};

// Function to determine if text should be dark or light based on background
export const getContrastColor = (hexColor) => {
  const brightness = getBrightness(hexColor);
  return brightness > 128 ? '#000000' : '#FFFFFF';
};
