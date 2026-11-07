import type { CanvasNode } from './canvas-model.js';
/** References and their source form one selection family; a Team also includes its members. */
export declare function relatedNodeIds(nodes: CanvasNode[], selectedId: string | null): Set<string>;
