import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a consistent color based on a string (like username or email)
 * @param str - The string to generate color from
 * @returns A hex color string
 */
export function generateColorFromString(str: string): string {
  if (!str) return "#9CA3AF"; // Default gray if no string
  
  // Create a hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Generate vibrant colors with good contrast
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 45 + (Math.abs(hash >> 8) % 15); // 45-60%
  
  return hslToHex(hue, saturation, lightness);
}

/**
 * Convert HSL to Hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Determine if a color is light or dark to choose appropriate text color
 * @param hexColor - The hex color string
 * @returns true if the color is light (needs dark text), false if dark (needs light text)
 */
export function isLightColor(hexColor: string): boolean {
  // Remove # if present
  const hex = hexColor.replace("#", "");
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance using the formula
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if light (luminance > 0.5)
  return luminance > 0.5;
}

/**
 * Get appropriate text color (black or white) based on background color
 * @param backgroundColor - The hex color string of the background
 * @returns "black" or "white"
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? "#000000" : "#FFFFFF";
}
