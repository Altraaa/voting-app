// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/";

export async function ApiRequest<T>({
  url,
  method = "GET",
  body,
  headers = {},
  isFormData = false,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
}): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method,
      headers: isFormData
        ? headers
        : {
            "Content-Type": "application/json",
            ...headers,
          },
      body: body
        ? isFormData
          ? (body as FormData)
          : JSON.stringify(body)
        : undefined,
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
      throw new Error(
        data.error || data.message || data.details || "Something went wrong"
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Network error occurred");
  }
}