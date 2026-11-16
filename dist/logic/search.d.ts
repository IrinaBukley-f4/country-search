import { Country } from '../logic/mapCountryResponse.js';
export type SearchState = {
    status: 'idle';
} | {
    status: 'loading';
} | {
    status: 'success';
    data: Country[];
} | {
    status: 'empty';
} | {
    status: 'error';
    message: string;
    lastQuery: string;
};
export declare class SearchController {
    private onStateChange;
    private controller;
    private lastQuery;
    constructor(onStateChange: (state: SearchState) => void);
    handleInput(query: string): void;
    private debouncedSearch;
    retry(): void;
}
