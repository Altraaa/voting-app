const API_URL = process.env.API_URL || "http://localhost:3000/api/";

export async function ApiRequest<T>({
  url,
  method = "GET",
  body,
  headers = {},
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
}): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    const text = await res.text();
    let data: any;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(text || "Invalid JSON response from server");
    }

    if (!res.ok) {
      const errorMessage =
        data.error || data.message || data.details || "Something went wrong";
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error occurred");
  }
}