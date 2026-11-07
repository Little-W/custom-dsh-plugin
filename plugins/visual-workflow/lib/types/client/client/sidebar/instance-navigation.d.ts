/** Navigation carries identities only; the editor loads the authoritative document. */
export interface InstancePreviewRequest {
    sessionId: string;
    flowId: string;
    sequence: number;
}
export interface InstanceNavigation {
    openInstance(target: {
        sessionId: string;
        flowId: string;
    }): void;
    pending(): InstancePreviewRequest | null;
    acknowledge(sequence: number): void;
    subscribe(listener: () => void): () => void;
}
/** Hold requests until the persistent editor mounts and acknowledges them. */
export declare function createInstanceNavigation(): InstanceNavigation;
