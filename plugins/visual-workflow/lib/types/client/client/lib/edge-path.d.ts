import type { RoutePoint } from './orthogonal-routing.js';
/** One continuous path: remove duplicate/reversing collinear points before rounding corners. */
export declare function edgeDisplayPath(raw: RoutePoint[], type?: 'rounded' | 'bezier'): string;
