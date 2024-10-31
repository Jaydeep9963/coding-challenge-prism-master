// fetchUtils.ts
export interface FetchOptions {
  headers?: Record<string, string>;
}

export const fetchJson = async (url: string, options: FetchOptions = { headers: {} }): Promise<any> => {
  const response = await fetch(url, {
    method: 'GET',
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    const msg = `${response.status} ${response.statusText}: ${text}`;
    throw new Error(msg);
  }

  return response.json();
};
