// src/host/prompts/checkpoint-resume.ts
import { isEnglishSystemLanguage } from '../system-language.js';
import { renderTemplate } from './render.js';
import { CHECKPOINT_RESUME_SUMMARY, NOTICE_CHECKPOINT_RESUME } from './texts/notice-checkpoint-resume.js';
import { CHECKPOINT_RESUME_SUMMARY_EN, NOTICE_CHECKPOINT_RESUME_EN } from './texts/en/notice-checkpoint-resume.js';
/** Supply only resume facts; the original task and conversation remain in native history. */
export function buildCheckpointResumePrompt(input) {
    return renderTemplate(isEnglishSystemLanguage(input.systemLanguage) ? NOTICE_CHECKPOINT_RESUME_EN : NOTICE_CHECKPOINT_RESUME, {
        runId: input.runId,
        resumedFromRunId: input.resumedFromRunId,
        resumeFromNodeId: input.resumeFromNodeId?.trim() ?? '',
        mode1: input.mode === 'mode1',
        mode2: input.mode === 'mode2',
    });
}
export function checkpointResumeSummaryOf(systemLanguage) {
    return isEnglishSystemLanguage(systemLanguage) ? CHECKPOINT_RESUME_SUMMARY_EN : CHECKPOINT_RESUME_SUMMARY;
}
//# sourceMappingURL=checkpoint-resume.js.map