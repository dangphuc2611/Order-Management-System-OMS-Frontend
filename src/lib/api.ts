const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  // Handle 204 No Content or empty response
  const contentLength = response.headers.get("content-length");
  if (
    response.status === 204 ||
    contentLength === "0" ||
    response.headers.get("content-type")?.includes("application/json") === false
  ) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text);
}

export const api = {
  customers: {
    getAll: () => fetchAPI<Record<string, unknown>[]>("/api/customers"),
    getById: (id: string) =>
      fetchAPI<Record<string, unknown>>(`/api/customers/${id}`),
    create: (data: Record<string, unknown>) =>
      fetchAPI<Record<string, unknown>>("/api/customers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<undefined>(`/api/customers/${id}`, { method: "DELETE" }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchAPI<Record<string, unknown>>(`/api/customers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
  orders: {
    getAll: () => fetchAPI<Record<string, unknown>[]>("/api/orders"),
    getById: (id: string) =>
      fetchAPI<Record<string, unknown>>(`/api/orders/${id}`),
    delete: (id: string) =>
      fetchAPI<undefined>(`/api/orders/${id}`, { method: "DELETE" }),
    create: (data: Record<string, unknown>) =>
      fetchAPI<Record<string, unknown>>("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  products: {
    getAll: () => fetchAPI<Record<string, unknown>[]>("/api/products"),
    getById: (id: string) =>
      fetchAPI<Record<string, unknown>>(`/api/products/${id}`),
    create: (data: Record<string, unknown>) =>
      fetchAPI<Record<string, unknown>>("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      fetchAPI<Record<string, unknown>>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchAPI<undefined>(`/api/products/${id}`, { method: "DELETE" }),
  },
};

export const fetcher = <T = unknown>(url: string): Promise<T> =>
  fetchAPI<T>(url);
