// src/lib/api.ts
export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || "Invalid response from server");
    }

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data as T;
  } catch (err: any) {
    throw new Error(err.message || "Network error");
  }
}
