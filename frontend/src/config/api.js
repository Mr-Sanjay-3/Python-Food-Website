// Central API configuration for frontend with intelligent fallback
const rawEnvUrl = (
  import.meta.env.VITE_API_URI ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.API_URI ||
  import.meta.env.API_URL ||
  ''
).trim().replace(/\/+$/, '');

// Detect if running locally
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Primary URL
export const API_BASE_URL = rawEnvUrl
  ? rawEnvUrl
  : (isLocalhost ? 'http://localhost:8000' : 'https://foodweb-aaoi.onrender.com');

// Fallback candidates
export const API_URL_CANDIDATES = [
  API_BASE_URL,
  'http://localhost:8000',
  'https://foodweb-aaoi.onrender.com',
].filter((url, idx, self) => url && self.indexOf(url) === idx);

// Safe fetch helper with automatic retry on alternative endpoints
export async function fetchWithFallback(endpoint, options = {}) {
  let lastError = null;

  for (const baseUrl of API_URL_CANDIDATES) {
    try {
      const cleanBase = baseUrl.replace(/\/+$/, '');
      const cleanEndpoint = endpoint.replace(/^\/+/, '');
      const fullUrl = `${cleanBase}/${cleanEndpoint}`;
      
      const response = await fetch(fullUrl, options);
      if (response.ok) {
        return response;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to fetch ${endpoint} from backend`);
}

export default API_BASE_URL;
