/**
 * Utility functions for data processing and formatting
 */

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  /**
   * Truncate text if longer than specified length
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 15) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };
  
  /**
   * Generate a color scale from an array of colors
   * @param {Array} data - Data array
   * @param {string} key - Key for domain values
   * @param {Array} colorRange - Color range
   * @returns {Function} D3 color scale
   */
  export const generateColorScale = (data, key, colorRange) => {
    const d3 = require('d3');
    return d3.scaleOrdinal()
      .domain(data.map(d => d[key]))
      .range(colorRange || d3.schemeCategory10);
  };
  
  /**
   * Calculate percentage
   * @param {number} value - Value
   * @param {number} total - Total
   * @returns {number} Percentage
   */
  export const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return ((value / total) * 100).toFixed(1);
  };
  
  /**
   * Get contrasting text color (black or white) based on background color
   * @param {string} hexColor - Hex color code
   * @returns {string} Contrasting color ('black' or 'white')
   */
  export const getContrastColor = (hexColor) => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return black or white based on brightness
    return brightness > 125 ? 'black' : 'white';
  };
  