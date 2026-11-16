import { Country } from './mapCountryResponse.js';
export declare class HttpError extends Error {
  status: number;
  constructor(status: number);
}
export declare function searchCountries(query: string, signal: AbortSignal): Promise<Country[]>;
