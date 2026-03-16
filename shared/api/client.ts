// shared/api/client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  console.log("FETCHING", url);

  const res = await fetch(url, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR", res.status, text);
    throw new Error("API 실패");
  }

  return res.json();
}
