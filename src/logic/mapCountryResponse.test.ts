import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from './mapCountryResponse';

describe('mapCountryResponse', () => {
  it('правильно маппит сырой ответ API в данные для карточки', () => {
    const rawApiData = {
      name: 'Spain', // Теперь строка!
      flags: { svg: 'https://flagcdn.com/es.svg' },
      capital: ['Madrid'],
      region: 'Europe',
      population: 47351567,
      languages: [{ name: 'Spanish' }],
      area: 505990,
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      currencies: [{ name: 'Euro', code: 'EUR' }],
    };

    const result = mapCountryResponse(rawApiData);

    expect(result).toEqual({
      name: 'Spain',
      flag: 'https://flagcdn.com/es.svg',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: ['Spanish'],
      area: 505990,
      borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
      currencies: ['Euro'],
    });
  });

  it('корректно обрабатывает отсутствие столицы или языков', () => {
    const rawApiData = {
      name: 'Antarctica',
      flags: { svg: 'https://flagcdn.com/aq.svg' },
      capital: [],
      region: 'Antarctic',
      population: 1000,
      languages: [],
    };

    const result = mapCountryResponse(rawApiData);

    expect(result.capital).toBe('Нет данных');
    expect(result.languages).toEqual([]);
    expect(result.area).toBe(0);
    expect(result.borders).toEqual([]);
    expect(result.currencies).toEqual([]);
  });
});
