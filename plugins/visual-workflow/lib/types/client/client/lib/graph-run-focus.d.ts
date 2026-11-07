import type { CanvasEdge, CanvasNode } from './canvas-model.js';
/** Active references share one execution unit; an active member lights its container, never idle siblings. */
export declare function workingGraphNodeIds(nodes: CanvasNode[], runningIds: readonly string[]): Set<string>;
/** Flow animation follows work entering the active step; context/data may operate in either direction. */
export declare function isWorkingEdge(edge: CanvasEdge, activeIds: ReadonlySet<string> | undefined): boolean;
