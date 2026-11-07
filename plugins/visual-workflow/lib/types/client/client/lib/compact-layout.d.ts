import type { LayoutBoxNode, LayoutLineLike } from './layout-fit.js';
/** Keep clear authored hierarchies; arrange unfinished graphs left-to-right with vertical parallel branches. */
export declare function compactLayout<T extends LayoutBoxNode>(nodes: T[], lines: LayoutLineLike[]): T[];
