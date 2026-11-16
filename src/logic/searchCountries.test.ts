import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchCountries, HttpError } from './searchCountries';

const mockSuccessResponse = [
  {
    name: 'Spain',
    flags: { svg: 'https://flagcdn.com/es.svg' },
    capital: ['Madrid'],
    region: 'Europe',
    population: 47351567,
    languages: [{ name: 'Spanish' }],
    area: 505990,
    borders: ['AND', 'FRA', 'GIB', 'PRT', 'MAR'],
    currencies: [{ name: 'Euro', code: 'EUR' }],
  },
];

describe('searchCountries', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('возвращает массив стран при успешном запросе', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockSuccessResponse,
    });

    const signal = new AbortController().signal;
    const result = await searchCountries('spain', signal);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://countries.dev/name/spain',
      expect.objectContaining({ signal })
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Spain');
  });

  it('возвращает пустой массив при статусе 404 (нет совпадений)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    const signal = new AbortController().signal;
    const result = await searchCountries('unknown', signal);

    expect(result).toEqual([]);
  });

  it('бросает HttpError при реальных ошибках сервера (например, 500)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const signal = new AbortController().signal;
    const promise = searchCountries('error', signal);

    await expect(promise).rejects.toThrow(HttpError);
    await expect(promise).rejects.toMatchObject({ status: 500 });
  });
});
