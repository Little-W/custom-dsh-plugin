import type { LayoutLineLike } from './layout-fit.js';
/** Follow the success path first; review/recovery edges must not collapse a whole cycle into one column. */
export declare function forwardLayoutLines<T extends LayoutLineLike>(nodes: Array<{
    id: string;
    kind: string;
}>, lines: T[], owner: (id: string) => string): T[];
