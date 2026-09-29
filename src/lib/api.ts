const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('asp_admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await res.json().catch(() => ({
      success: false,
      message: `Server returned invalid JSON response (${res.status} ${res.statusText})`
    }));

    if (!res.ok && data && !data.message) {
      data.message = `HTTP Error ${res.status}: ${res.statusText}`;
    }

    return data;
  } catch (error: any) {
    console.error(`API Call Error (${endpoint}):`, error);
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      throw new Error(`Unable to connect to backend server (${API_BASE}). Please make sure the Express backend server is running and accessible.`);
    }
    throw error;
  }
}
