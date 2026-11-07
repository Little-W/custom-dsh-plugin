// DSH owns the canonical sandbox service. Keep its permission mode and approval
// rules, but resolve a session's writable root from DSH's working-directory
// projection instead of the immutable session header cwd.
export const name = '@agent-studio/plugin-session-workspace-settings';
export const inject = ['sandboxPolicy', 'workingDirectory'];

export function apply(ctx) {
  const resolveNativePolicy = ctx.sandboxPolicy.resolve.bind(ctx.sandboxPolicy);
  ctx.sandboxPolicy.resolve = (request = {}) => {
    const policy = resolveNativePolicy(request);
    if (!request.session) return policy;
    const workspaceRoot = ctx.workingDirectory.get(request.session);
    return workspaceRoot ? { ...policy, workspaceRoot } : policy;
  };
}
