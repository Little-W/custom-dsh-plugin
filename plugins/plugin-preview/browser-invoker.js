import { randomUUID } from 'node:crypto'
import { ToolExecutionPipeline } from '@deepseek-ai/dsh-tools/pipeline'

// Go through the native pipeline, including scoped visibility, guards, approval and cancellation.
// Never call a tool definition's execute callback directly.
export function browserInvoker(ctx, caller) {
  const pipeline = new ToolExecutionPipeline(ctx)
  return async (name, args, signal) => {
    const prepared = await pipeline.prepare({
      callId: `preview-browser-${randomUUID()}`, name, arguments: args, signal,
      ...(caller?.agent ? { agent: caller.agent, toolSet: caller.toolSet, parent: caller.token, rootCallId: caller.rootCallId } : {}),
    })
    const outcome = prepared.kind === 'dispatch' ? await pipeline.dispatch(prepared.exec) : prepared
    const result = await pipeline.complete(prepared.exec, outcome)
    for (const context of result.additionalContexts ?? []) caller?.deferContext?.(context)
    if (result.isError) throw new Error(result.error?.message || result.content?.filter(part => part.type === 'text').map(part => part.text).join('\n') || 'Chrome 工具调用被拒绝')
    return result.value
  }
}
