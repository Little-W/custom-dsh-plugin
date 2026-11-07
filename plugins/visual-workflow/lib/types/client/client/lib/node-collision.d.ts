import type { RouteBox, RoutePoint } from './orthogonal-routing.js';
/** Align near-matching flow centers instead of introducing tiny orthogonal steps. */
export declare function snapConnectedCenter(box: RouteBox, neighbors: RouteBox[], tolerance?: number): RoutePoint;
/** Project a dragged card to the nearest free boundary, preserving the previous position if surrounded. */
export declare function constrainNodePosition(box: RouteBox, obstacles: RouteBox[], previous: RoutePoint, gap?: number): RoutePoint;
/** Newly created cards have no previous safe position: search outward instead of stacking them. */
export declare function vacantNodePosition(box: RouteBox, obstacles: RouteBox[], gap?: number): RoutePoint;
