import type { InstanceNavigation, InstancePreviewRequest } from '../sidebar/instance-navigation.js';
import type { WorkflowsFace } from './useWorkflows.js';
import type { UnsavedGuardFace } from './useUnsavedGuard.js';
/** Reuse document loading and the unsaved guard, never change editor state directly. */
export declare function useInstancePreview(request: InstancePreviewRequest | null | undefined, navigation: InstanceNavigation | undefined, workflows: WorkflowsFace, guard: UnsavedGuardFace, failed: (error: unknown) => void, missingMessage: string, opened?: () => void): void;
