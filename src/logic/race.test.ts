import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchCountries } from './searchCountries';

describe('Логика гонки и обработки ошибок', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('различает AbortError (наша отмена) и TimeoutError', async () => {
    const controller = new AbortController();

    controller.abort();

    await expect(searchCountries('spain', controller.signal)).rejects.toMatchObject({
      name: 'AbortError',
    });

    const timeoutSignal = AbortSignal.timeout(1);
    await new Promise((resolve) => setTimeout(resolve, 10));

    await expect(searchCountries('spain', timeoutSignal)).rejects.toMatchObject({
      name: 'TimeoutError',
    });
  });

  it('тест на гонку: старый запрос отменяется и не перезаписывает результат', async () => {
    let resolveSecond: (value: unknown) => void;

    global.fetch = vi.fn().mockImplementation((url, options) => {
      return new Promise((resolve, reject) => {
        if (options?.signal?.aborted) {
          return reject(new DOMException('Aborted', 'AbortError'));
        }

        options?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });

        if (url.includes('spain')) {
          resolveSecond = () =>
            resolve({
              ok: true,
              status: 200,
              json: async () => [{ name: { common: 'Spain (New)' } }],
            });
        }
      });
    });

    const controller1 = new AbortController();
    const promise1 = searchCountries('sp', controller1.signal);

    const controller2 = new AbortController();
    const promise2 = searchCountries('spain', controller2.signal);

    await new Promise(process.nextTick);

    controller1.abort();

    resolveSecond!();
    const result2 = await promise2;

    expect(result2[0].name).toBe('Spain (New)');

    await expect(promise1).rejects.toMatchObject({ name: 'AbortError' });
  });
});
