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
  const compHex = '#' + 
    compR.toString(16).padStart(2, '0') +
    compG.toString(16).padStart(2, '0') +
    compB.toString(16).padStart(2, '0');
  
  return compHex;
};

// Function to convert RGB to HSL
export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Function to convert HSL to RGB
export const hslToRgb = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
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
  // Generate 4 tetradic colors (90° apart)
  for (let i = 0; i < 4; i++) {
    const newH = (h + i * 90) % 360;
    const [r, g, b] = hslToRgb(newH, s, l);
    colors.push(rgbToHex(r, g, b));
  }
  
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
export const isValidHexColor = (hex) => {
  return /^#[0-9A-F]{6}$/i.test(hex);
};

// Function to convert RGB to Hex
export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Function to convert Hex to RGB
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
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