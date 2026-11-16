interface RawCountry {
    name: string;
    flags: {
        svg: string;
    };
    capital?: string[];
    region?: string;
    population?: number;
    languages: {
        name: string;
    }[];
    area?: number;
    borders?: string[];
    currencies?: unknown[];
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
export declare function mapCountryResponse(raw: RawCountry): Country;
export {};
