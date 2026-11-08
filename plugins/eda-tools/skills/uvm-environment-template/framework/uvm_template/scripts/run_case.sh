#!/usr/bin/env bash
# Run one .tc case: scripts/run_case.sh smoke
set -Eeuo pipefail
case_name="${1:?usage: $0 <test_lib/case> [extra plusargs]}"
tc="test_lib/${case_name}/${case_name}.tc"
[[ -f "$tc" ]] || { echo "missing $tc" >&2; exit 2; }
plusargs="$(sed -e 's/^+SIM+//' "$tc")"
[[ -x ./simv ]] || { echo "simv not found; run 'make comp' first" >&2; exit 2; }
exec ./simv $plusargs "${@:2}"
