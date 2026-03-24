const DEFAULT_LOCAL_API = "http://localhost:8000/api";

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_LOCAL_API;

export const EMPLOYEE_API = `${API_BASE}/employees`;
export const LEAVES_API = `${API_BASE}/leaves`;
