/**
 * Normalizes a string by removing accents, converting to lowercase, and removing spaces.
 *
 * @param {string} str - The string to normalize.
 * @returns {string} The normalized string.
 */
export function normalizeString(str: string): string {
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  str = str.toLowerCase();
  str = str.replace(/\s/g, '').trim();
  return str;
}

/**
 * Capitalizes the first character of a string.
 *
 * @param {string} s - The string to capitalize.
 * @returns {string} The string with the first character capitalized, or an empty string if the input is not a string.
 */
export const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
