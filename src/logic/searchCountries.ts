import { mapCountryResponse, Country } from './mapCountryResponse.js';

export class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP Error: ${status}`);
    this.name = 'HttpError';
  }
}

export async function searchCountries(query: string, signal: AbortSignal): Promise<Country[]> {
  const url = `https://countries.dev/name/${encodeURIComponent(query)}`;

  const response = await fetch(url, { signal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const data = await response.json();
  return data.map(mapCountryResponse);
}
