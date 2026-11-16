import { searchCountries } from '../logic/searchCountries.js';
import { Country } from '../logic/mapCountryResponse.js';
import { debounce } from '../logic/debounce.js';

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Country[] }
  | { status: 'empty' }
  | { status: 'error'; message: string; lastQuery: string };

export class SearchController {
  private controller: AbortController | null = null;
  private lastQuery = '';

  constructor(private onStateChange: (state: SearchState) => void) {}

  public handleInput(query: string) {
    if (this.controller) {
      this.controller.abort();
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      this.onStateChange({ status: 'idle' });
      this.lastQuery = '';
      return;
    }

    this.lastQuery = trimmedQuery;

    this.controller = new AbortController();
    this.debouncedSearch(trimmedQuery, this.controller!.signal);
  }

  private debouncedSearch = debounce(async (query: string, signal: AbortSignal) => {
    this.onStateChange({ status: 'loading' });

    const timeoutSignal = AbortSignal.timeout(5000);
    const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

    try {
      const data = await searchCountries(query, combinedSignal);

      if (signal.aborted) return;

      if (data.length === 0) {
        this.onStateChange({ status: 'empty' });
      } else {
        this.onStateChange({ status: 'success', data });
      }
    } catch (error) {
      const err = error as Error;
      if (err.name === 'AbortError') return;

      if (err.name === 'TimeoutError') {
        this.onStateChange({
          status: 'error',
          message: 'Превышено время ожидания. Проверьте сеть.',
          lastQuery: query,
        });
        return;
      }

      this.onStateChange({
        status: 'error',
        message: 'Произошла ошибка при загрузке. Попробуйте еще раз.',
        lastQuery: query,
      });
    }
  }, 300);

  public retry() {
    if (this.lastQuery) {
      this.handleInput(this.lastQuery);
    }
  }
}
