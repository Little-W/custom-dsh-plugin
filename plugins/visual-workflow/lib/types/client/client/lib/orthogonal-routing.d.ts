export interface RoutePoint {
    x: number;
    y: number;
}
export interface RouteBox {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
}
export interface RouteInput {
    id: string;
    start: RoutePoint;
    end: RoutePoint;
    startDir: number;
    endDir: number;
    sourceOwner: string;
    targetOwner: string;
    labelWidth: number;
    startAxis?: number;
    endAxis?: number;
    waypoints?: RoutePoint[];
    sourceBundle?: string;
    targetBundle?: string;
    sourceTree?: string;
    targetTree?: string;
    sourceTail?: number;
    targetTail?: number;
}
export interface OrthogonalRoute {
    points: RoutePoint[];
    path: string;
    label: RoutePoint;
    labelWidth: number;
    labelAnchor?: RoutePoint;
    geometryKey?: string;
    targetBundle?: string;
}
export declare function simplifyRoute(points: RoutePoint[]): RoutePoint[];
export declare function routePath(points: RoutePoint[]): string;
/** All edges share one obstacle field and reserved lanes; selection never reroutes the graph. */
export declare function routeOrthogonalEdges(inputs: RouteInput[], boxes: RouteBox[], previousRoutes?: Map<string, OrthogonalRoute>): Map<string, OrthogonalRoute>;
