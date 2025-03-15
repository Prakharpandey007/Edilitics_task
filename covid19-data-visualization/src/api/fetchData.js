/**
 * Service for fetching COVID-19 data from disease.sh API
 */
const API_BASE_URL = 'https://disease.sh/v3/covid-19';

/**
 * Fetches country-specific COVID-19 data
 * @returns {Promise<Array>} Array of country data
 */
export const fetchCountriesData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/countries`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching countries data:", error);
    throw error;
  }
};

/**
 * Fetches global COVID-19 data
 * @returns {Promise<Object>} Global COVID-19 statistics
 */
export const fetchGlobalData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching global data:", error);
    throw error;
  }
};

/**
 * Fetches historical COVID-19 data for specific countries
 * @param {string|Array} countries - Country name or array of country names
 * @param {number} days - Number of days of historical data
 * @returns {Promise<Object>} Historical COVID-19 data
 */
export const fetchHistoricalData = async (countries, days = 30) => {
  try {
    // Handle multiple countries or single country
    const countryParam = Array.isArray(countries) ? countries.join(',') : countries;
    const response = await fetch(`${API_BASE_URL}/historical/${countryParam}?lastdays=${days}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};

export default {
  fetchCountriesData,
  fetchGlobalData,
  fetchHistoricalData
};
