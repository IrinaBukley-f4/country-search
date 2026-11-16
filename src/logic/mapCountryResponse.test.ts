import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from './mapCountryResponse';

describe('mapCountryResponse', () => {
  it('правильно маппит сырой ответ API в данные для карточки', () => {
    const rawApiData = {
      name: { common: 'Spain', official: 'Kingdom of Spain' },
      flags: { svg: 'https://flagcdn.com/es.svg', png: 'https://flagcdn.com/w320/es.png' },
      capital: ['Madrid'],
      region: 'Europe',
      population: 47351567,
      languages: [{ name: 'Spanish' }],
    };

    const result = mapCountryResponse(rawApiData);

    expect(result).toEqual({
      name: 'Spain',
      flag: 'https://flagcdn.com/es.svg',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      languages: ['Spanish'],
    });
  });

  it('корректно обрабатывает отсутствие столицы или языков', () => {
    const rawApiData = {
      name: { common: 'Antarctica' },
      flags: { svg: 'https://flagcdn.com/aq.svg' },
      capital: [],
      region: 'Antarctic',
      population: 1000,
      languages: [],
    };

    const result = mapCountryResponse(rawApiData);

    expect(result.capital).toBe('Нет данных');
    expect(result.languages).toEqual([]);
  });
});
