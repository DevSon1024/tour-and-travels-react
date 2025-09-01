/**
 * Currency utility functions for Indian Rupee formatting
 */

/**
 * Format price in Indian Rupees with proper thousand separators
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatINR = (amount, showSymbol = true) => {
  if (!amount || isNaN(amount)) return showSymbol ? '₹0' : '0';
  
  const numAmount = parseFloat(amount);
  const formatted = numAmount.toLocaleString('en-IN');
  
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Format price with "per person" suffix
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with "per person"
 */
export const formatINRPerPerson = (amount) => {
  return `${formatINR(amount)} per person`;
};

/**
 * Format price range (for min-max pricing)
 * @param {number} minAmount - Minimum amount
 * @param {number} maxAmount - Maximum amount
 * @returns {string} Formatted price range
 */
export const formatINRRange = (minAmount, maxAmount) => {
  if (!maxAmount || minAmount === maxAmount) {
    return formatINR(minAmount);
  }
  return `${formatINR(minAmount)} - ${formatINR(maxAmount)}`;
};

/**
 * Convert any currency symbol to INR (for data cleanup)
 * @param {string} priceString - Price string that might contain other currency symbols
 * @returns {string} Cleaned price string with INR symbol
 */
export const convertToINR = (priceString) => {
  if (!priceString) return '₹0';
  
  // Remove common currency symbols and extract number
  const cleanedString = priceString.toString().replace(/[$£€¥₹,]/g, '');
  const amount = parseFloat(cleanedString);
  
  return formatINR(amount);
};

/**
 * Parse price from string and return number
 * @param {string|number} price - Price to parse
 * @returns {number} Parsed price as number
 */
export const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  
  const cleanedString = price.toString().replace(/[₹$£€¥,]/g, '');
  return parseFloat(cleanedString) || 0;
};

export default {
  formatINR,
  formatINRPerPerson,
  formatINRRange,
  convertToINR,
  parsePrice
};
