// src/host/orchestrator/runtime-lifecycle.ts
//
// 编排运行时终止收尾层（RuntimeLifecycle extends RuntimeObserve）：统一终止
// （中止控制器/尽力中断子代理/写终态/释放锁）、用户停止与父代理出错自动 failed。
import { terminalizeNodes } from './snapshot.js';
import { messageOf } from './errors.js';
import { RuntimeObserve } from './runtime-observe.js';
export class RuntimeLifecycle extends RuntimeObserve {
    pendingStops = new Map();
    // ---- 终止 / 停止 ------------------------------------------------------------
    /**
     * 统一终止运行：中止控制器（含阻塞中的 wait/提问）、尽力中断运行中子代理、
     * 写终态、持久化、释放锁（内存锁随状态自然释放）。幂等。
     * 终态条目随即从内存 runs 表释放（历史记录在磁盘，由 FlowStore 提供），
     * 防止长期运行内存膨胀；running/paused 条目保留（续跑/锁查询需要）。
     */
    async terminateRun(entry, options) {
        const snapshot = entry.snapshot;
        if (!snapshot || (snapshot.status !== 'running' && snapshot.status !== 'paused'))
            return false;
        // Claim termination before the first await; late tools, child events and duplicate stops see the final state.
        snapshot.status = options.status;
        snapshot.summary = options.summary;
        snapshot.endedAt = this.isoNow();
        if (options.abortReason === 'user-stop')
            snapshot.requiresExplicitResume = true;
        entry.controller.abort(options.abortReason ?? `terminate-${options.status}`);
        // Reject tools before joining Agents: a parent may be blocked inside wf_run_node(wait:true).
        terminalizeNodes(snapshot, this.now(), options.status === 'stopped' ? 'stop' : 'interrupt');
        this.rejectWaiters(entry);
        const persisted = this.persistWarn(entry);
        const childIds = new Set(entry.inflight);
        for (const [childId, meta] of this.childIndex) {
            if (meta.sessionId === snapshot.sessionId && meta.flowId === snapshot.flowId)
                childIds.add(childId);
        }
        // Issue every cancellation before awaiting any branch. Nested child teardown can depend on
        // a sibling or parent finishing, so sequential joins can leave the whole session running.
        const stopParent = async () => {
            if (this.deps.agents.interruptSessionFamily)
                await this.deps.agents.interruptSessionFamily(snapshot.sessionId);
            else if (this.deps.agents.interruptRoot)
                await this.deps.agents.interruptRoot(snapshot.sessionId);
            else if (this.deps.agents.getRootAgent(snapshot.sessionId)?.status === 'running')
                throw new Error('父代理取消能力不可用');
        };
        const cancellations = [stopParent(), ...[...childIds].map(childId => this.deps.runner.interruptChild(childId, snapshot.sessionId))];
        const results = await Promise.allSettled(cancellations);
        entry.inflight.clear();
        await persisted;
        // Durable checkpoints retain progress after the in-memory cancellation completes.
        this.releaseRunMemory(snapshot.id);
        const parentResult = results[0];
        if (parentResult.status === 'rejected')
            throw parentResult.reason;
        return true;
    }
    /**
     * 无内存 run 条目时的会话族兜底停止（宿主重启后停按钮、终态 run 的残留 child）。
     * 只中断会话根与后代，不创建/不写 run 快照。
     */
    async interruptSessionFamily(sessionId) {
        if (this.deps.agents.interruptSessionFamily)
            await this.deps.agents.interruptSessionFamily(sessionId);
        else
            await this.deps.agents.interruptRoot?.(sessionId);
    }
    /** 用户停止运行（控制栏停止按钮；幂等）。 */
    stopRun(runId) {
        const pending = this.pendingStops.get(runId);
        if (pending)
            return pending;
        const stopping = this.stopRunNow(runId).finally(() => { this.pendingStops.delete(runId); });
        this.pendingStops.set(runId, stopping);
        return stopping;
    }
    async stopRunNow(runId) {
        const entry = this.runs.get(runId);
        if (entry) {
            await this.terminateRun(entry, { status: 'stopped', summary: '运行已停止', abortReason: 'user-stop' });
            return;
        }
        const snapshot = await this.deps.store.getRun(runId);
        if (!snapshot)
            return;
        // A stop after host recovery must fence automatic adoption just like an in-memory stop.
        if (snapshot.status !== 'completed' && snapshot.status !== 'failed') {
            snapshot.status = 'stopped';
            snapshot.requiresExplicitResume = true;
            snapshot.summary = '运行已停止';
            snapshot.endedAt = this.isoNow();
            terminalizeNodes(snapshot, this.now(), 'stop');
            await this.deps.store.saveRun(snapshot);
        }
        await this.interruptSessionFamily(snapshot.sessionId);
    }
    /**
     * 外部挂起运行（定时任务执行窗口 end：新功能本阶段，见 prompt/定时任务开发.md）：
     *   - run → paused（保留运行锁，断点可续跑——与暂停节点同态）；
     *   - 不中断正在执行的子代理（「等待仍在执行的角色节点执行完毕」：paused 态下
     *     subagent/end 仍回写节点状态）；下一个角色节点由 requireActiveRootRun 的
     *     WF_PAUSED 拦下（父代理不再调度新节点）；
     *   - 续跑走现有 resumeRun（下一窗口 start 注入「继续运行」指令）。
     * 幂等：非 running 返回 false（引擎按「轮次结束」处理）。
     */
    async suspendRun(runId, options = {}) {
        const entry = this.runs.get(runId);
        if (!entry || entry.snapshot.status !== 'running')
            return false;
        const snapshot = entry.snapshot;
        snapshot.status = 'paused';
        snapshot.summary = options.summary ?? '执行窗口结束，已暂停（等待下一窗口继续）';
        await this.persistWarn(entry);
        return true;
    }
    /** 父代理回合以 error 结束（编排已死）→ 自动把运行标记为 failed。 */
    async failRunForParentError(entry, error) {
        const message = messageOf(error);
        const summary = message ? `编排父代理执行出错：${message}` : '编排父代理执行出错（未知错误）';
        await this.terminateRun(entry, { status: 'failed', summary, abortReason: 'parent-turn-error' });
    }
}
//# sourceMappingURL=runtime-lifecycle.js.map