const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('asp_admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
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
    console.error(`API Call Error (${url}):`, error);
    if (error.name === 'TypeError' || error.message?.includes('fetch')) {
      throw new Error(`Unable to connect to API endpoint (${url}). Please check your server status or network connection.`);
    }
    throw error;
  }
}
