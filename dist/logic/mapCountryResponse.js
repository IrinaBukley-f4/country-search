export function mapCountryResponse(raw) {
    return {
        name: raw.name || 'Неизвестно',
        flag: raw.flags?.svg || '',
        capital: (Array.isArray(raw.capital) ? raw.capital[0] : raw.capital) || 'Нет данных',
        region: raw.region || 'Неизвестно',
        population: raw.population || 0,
        languages: Array.isArray(raw.languages) ? raw.languages.map((lang) => lang.name) : [],
        area: raw.area || 0,
        borders: raw.borders || [],
        currencies: Array.isArray(raw.currencies)
            ? raw.currencies
                .map((c) => c.name || c.code)
                .filter((c) => typeof c === 'string') // <-- магия здесь
            : [],
    };
}
//# sourceMappingURL=mapCountryResponse.js.map