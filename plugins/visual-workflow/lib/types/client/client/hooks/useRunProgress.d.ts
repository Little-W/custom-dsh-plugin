import type { Dispatch } from 'react';
import type { StudioAction } from '../studio/studio-state.js';
import type { RemoteFace } from './useRemote.js';
export declare function useRunProgress(flow: {
    id: string;
    sessionId: string;
} | null, trackedRunId: string | null, dispatch: Dispatch<StudioAction>, remote: RemoteFace): void;
