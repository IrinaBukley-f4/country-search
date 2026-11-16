import { searchCountries } from '../logic/searchCountries.js';
import { debounce } from '../logic/debounce.js';
export class SearchController {
    onStateChange;
    controller = null;
    lastQuery = '';
    constructor(onStateChange) {
        this.onStateChange = onStateChange;
    }
    handleInput(query) {
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
        this.debouncedSearch(trimmedQuery, this.controller.signal);
    }
    debouncedSearch = debounce(async (query, signal) => {
        this.onStateChange({ status: 'loading' });
        const timeoutSignal = AbortSignal.timeout(5000);
        const combinedSignal = AbortSignal.any([signal, timeoutSignal]);
        try {
            const data = await searchCountries(query, combinedSignal);
            if (signal.aborted)
                return;
            if (data.length === 0) {
                this.onStateChange({ status: 'empty' });
            }
            else {
                this.onStateChange({ status: 'success', data });
            }
        }
        catch (error) {
            const err = error;
            if (err.name === 'AbortError')
                return;
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
    retry() {
        if (this.lastQuery) {
            this.handleInput(this.lastQuery);
        }
    }
}
//# sourceMappingURL=search.js.map