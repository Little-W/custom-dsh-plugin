import type { RouteBox, RoutePoint } from './orthogonal-routing.js';
export interface BezierSpan {
    start: RoutePoint;
    c1: RoutePoint;
    c2: RoutePoint;
    end: RoutePoint;
}
export interface BezierRoute {
    path: string;
    anchors: RoutePoint[];
    spans: BezierSpan[];
}
/** Interpolating cubic spans run across the full connection, with only two straight terminal shafts. */
export declare function bezierRoutePath(raw: RoutePoint[], manual?: RoutePoint[], obstacles?: RouteBox[], manualMode?: boolean): BezierRoute;
export declare function sampleBezier(span: BezierSpan, t: number): RoutePoint;
