import { mapCountryResponse } from './mapCountryResponse.js';
export class HttpError extends Error {
    status;
    constructor(status) {
        super(`HTTP Error: ${status}`);
        this.status = status;
        this.name = 'HttpError';
    }
}
export async function searchCountries(query, signal) {
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
//# sourceMappingURL=searchCountries.js.map