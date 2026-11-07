export interface CheckpointResumePromptInput {
    runId: string;
    resumedFromRunId: string;
    resumeFromNodeId?: string;
    mode: 'mode1' | 'mode2';
    systemLanguage?: string;
}
/** Supply only resume facts; the original task and conversation remain in native history. */
export declare function buildCheckpointResumePrompt(input: CheckpointResumePromptInput): string;
export declare function checkpointResumeSummaryOf(systemLanguage?: string): string;
