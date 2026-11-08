---
name: innovus-floorplan-assist
description: Plan, geometrically check, and propose bounded macro-floorplan candidates for an Innovus project using verified inventory and explicit constraints; never treats proxy metrics as signoff.
---

# Innovus Macro Floorplan Assistant

Use this skill when asked to review or propose hard-macro placement changes for an EDA project. This is a candidate-planning aid, not a P&R, routing, timing, power-integrity or signoff tool.

## Safe workflow

1. Read the current project with `eda_project_get`. Confirm project ID, root/workspace, enabled Innovus backend, and exact registered netlist, LEF, MMMC and floorplan DEF inputs. If another project is intended, discover it with `eda_project_list`, bind it with `eda_project_bind`, then read it again.
2. Generate the configured backend bundle using `eda_project_generate_flow({backendOnly:true})`. Do not start the full backend flow just to inspect macros.
3. From the returned `runRequests`, select only the Innovus request whose arguments include `inspect_macro_instances.tcl`; execute it through `mcp__eda__run` with its returned exact args and bundle directory. Read `reports/macro_instances.rpt` using `mcp__eda__read`.
4. Obtain the core rectangle, units, LEF-derived macro dimensions, legal orientations, current placements, halo/blockage/keepout constraints and any connectivity weights from the actual project/DEF/design owner. Preserve the exact full instance paths. Do not infer missing facts or copy fictional demo values.
5. Call `eda_project_floorplan_assist` with `operation:"check"` first. Use `units:"um"`; provide the candidate plan from trusted reports. Review all errors, warnings and their stated scope.
6. If the baseline is valid and the user wants candidates, call `operation:"optimize"` with a bounded iteration budget, deterministic seed, explicit grid/max step and a verified `ui` (`legacy` or `stylus`). The search moves only macros not marked `locked`; it never changes orientation. The weighted-center Manhattan score is an explicitly declared geometry proxy, not HPWL or Innovus QoR. Compare the output plan and warnings with the baseline.
7. Treat `tclPreview` as a proposal only. Check the commands against the installed Innovus release (`help` for each command) and confirm LEF symmetry, sites/grid, pin/PG access, blockages and coordinate conventions. Legacy and Stylus scripts are distinct; never mix their commands.
8. Do not persist or run a candidate automatically. Only after the human explicitly selects it, use `eda_project_backend_layout({action:"update", ...})` to replace the project's placement list, then `action:"generate"` to produce `manual_floorplan.tcl`. Review the generated bundle and diff; run Innovus checks from the exact generated request, then inspect logs, reports and database read-back.

## Data and validation limits

- The helper checks finite micrometer rectangles, unique Tcl-safe names, supported proxy orientations (`R0`, `R180`, `MX`, `MY`), core containment, macro overlap, declared keepouts, halo and simple channel warnings. It does not read LEF/DEF or validate that caller-supplied facts match the database.
- Dimensions must match the actual orientation from LEF/Innovus. Geometry-valid does not prove site/grid legality or symmetry support.
- `weightedCenterL1` uses user-supplied anchors and connection weights. It is not pin-based HPWL and does not model routing capacity, pin access, congestion, PG/IR, DFT, STA or multi-mode/multi-corner behavior.
- Never infer that proxy improvement means better WNS/TNS, power, area, routability, DRC/LVS or manufacturability. The preview generator does not execute Tcl or alter project settings.
- Every candidate must start from the same baseline checkpoint for a fair Innovus experiment. Validate placement status and real reports after execution. Escalate missing data or tool-version uncertainty instead of guessing.
