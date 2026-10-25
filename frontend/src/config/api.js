// Central API configuration for frontend
export const API_BASE_URL = (
  import.meta.env.VITE_API_URI ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.API_URI ||
  import.meta.env.API_URL
).replace(/\/+$/, '');

export default API_BASE_URL;
