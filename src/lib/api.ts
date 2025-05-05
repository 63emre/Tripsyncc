/**
 * API isteklerini yönetmek için yardımcı fonksiyonlar
 */

const API_BASE_URL = '/api';

// Token'ı localStorage'dan al
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Ortak fetch fonksiyonu
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Eğer token varsa, Authorization header'ını ekle
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Eğer oturum süresi dolmuşsa (401) ve token varsa, kullanıcıyı çıkış yap
  if (response.status === 401 && token) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response;
};

// GET isteği
export async function get<T>(url: string): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`API isteği başarısız: ${response.statusText}`);
  }

  return response.json();
}

// POST isteği
export async function post<T>(url: string, data: any): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API isteği başarısız: ${response.statusText}`);
  }

  return response.json();
}

// PUT isteği
export async function put<T>(url: string, data: any): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API isteği başarısız: ${response.statusText}`);
  }

  return response.json();
}

// DELETE isteği
export async function del<T>(url: string): Promise<T> {
  const response = await fetchWithAuth(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`API isteği başarısız: ${response.statusText}`);
  }

  return response.json();
}

// Dosya yükleme
export async function uploadFile<T>(url: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {};

  // Token varsa ekle
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Dosya yükleme başarısız: ${response.statusText}`);
  }

  return response.json();
}