import type { Handle, LineAppearance, PortSide } from '../../host/shared/graph-model.js';
import type { CanvasEdge, CanvasNode } from './canvas-model.js';
export type ConnectionChannel = Handle extends `${infer Channel}-${'in' | 'out'}` ? Channel : never;
export declare function channelHandles(channel: ConnectionChannel): {
    sourceHandle: Handle;
    targetHandle: Handle;
};
/** Unsupported purposes stay visible but disabled in the inspector. Duplicates are checked on apply. */
export declare function availableConnectionChannels(nodes: CanvasNode[], edge: CanvasEdge): ConnectionChannel[];
export interface ConnectionPort {
    nodeId: string;
    handles: string[];
    side?: PortSide;
}
/** Physical sockets may carry several channels. Resolve direction and a shared semantic channel. */
export declare function connectPorts(first: ConnectionPort, second: ConnectionPort, type: LineAppearance['type'], channel?: ConnectionChannel): {
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
    appearance: LineAppearance;
} | null;
