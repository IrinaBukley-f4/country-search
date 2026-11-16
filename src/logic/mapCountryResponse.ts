interface RawCountry {
  name: string;
  flags: { svg: string };
  capital?: string[];
  region?: string;
  population?: number;
  languages: { name: string }[];
  area?: number;
  borders?: string[];
  currencies?: { name?: string; code?: string }[];
}

export interface Country {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
  area: number;
  borders: string[];
  currencies: string[];
}

export function mapCountryResponse(raw: RawCountry): Country {
  return {
    name: raw.name || 'Неизвестно',
    flag: raw.flags?.svg || '',
    capital: Array.isArray(raw.capital) ? raw.capital[0] : raw.capital || 'Нет данных',
    region: raw.region || 'Неизвестно',
    population: raw.population || 0,
    languages: Array.isArray(raw.languages) ? raw.languages.map((lang) => lang.name) : [],
    area: raw.area || 0,
    borders: raw.borders || [],
    currencies: Array.isArray(raw.currencies)
      ? raw.currencies
          .map((c) => c.name || c.code)
          .filter((c): c is string => typeof c === 'string') // <-- магия здесь
      : [],
  };
}
