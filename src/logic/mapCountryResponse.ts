interface RawCountry {
  name: { common: string };
  flags: { svg: string };
  capital?: string[];
  region?: string;
  population?: number;
  languages?: { name: string }[];
}

export interface Country {
  name: string;
  flag: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
}

export function mapCountryResponse(raw: RawCountry): Country {
  return {
    name: raw.name?.common || 'Неизвестно',
    flag: raw.flags?.svg || '',
    capital: raw.capital && raw.capital.length > 0 ? raw.capital[0] : 'Нет данных',
    region: raw.region || 'Неизвестно',
    population: raw.population || 0,
    languages: raw.languages ? raw.languages.map((lang) => lang.name) : [],
  };
}
