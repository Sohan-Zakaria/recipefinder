import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Search meals by name
 * @param {string} query
 */
export const searchByName = async (query) => {
  const { data } = await api.get(`/search.php?s=${encodeURIComponent(query)}`);
  return data.meals || [];
};

/**
 * Lookup full meal detail by ID
 * @param {string|number} id
 */
export const lookupById = async (id) => {
  const { data } = await api.get(`/lookup.php?i=${id}`);
  return data.meals ? data.meals[0] : null;
};

/**
 * Filter meals by category
 * @param {string} category
 */
export const filterByCategory = async (category) => {
  const { data } = await api.get(`/filter.php?c=${encodeURIComponent(category)}`);
  return data.meals || [];
};

/**
 * Filter meals by area/cuisine
 * @param {string} area
 */
export const filterByArea = async (area) => {
  const { data } = await api.get(`/filter.php?a=${encodeURIComponent(area)}`);
  return data.meals || [];
};

/**
 * Filter meals by main ingredient
 * @param {string} ingredient
 */
export const filterByIngredient = async (ingredient) => {
  const { data } = await api.get(`/filter.php?i=${encodeURIComponent(ingredient)}`);
  return data.meals || [];
};

/**
 * Get a random meal
 */
export const getRandomMeal = async () => {
  const { data } = await api.get('/random.php');
  return data.meals ? data.meals[0] : null;
};

/**
 * Get all categories with images and descriptions
 */
export const getCategories = async () => {
  const { data } = await api.get('/categories.php');
  return data.categories || [];
};

/**
 * Get list of all areas/cuisines
 */
export const getAreas = async () => {
  const { data } = await api.get('/list.php?a=list');
  return data.meals || [];
};

/**
 * Parse ingredient/measure pairs from a full meal object
 * Returns array of { ingredient, measure } skipping empty entries
 * @param {object} meal
 */
export const parseIngredients = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }
  return ingredients;
};

/**
 * Convert a YouTube watch URL to an embed URL
 * @param {string} url
 */
export const toYouTubeEmbed = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};
