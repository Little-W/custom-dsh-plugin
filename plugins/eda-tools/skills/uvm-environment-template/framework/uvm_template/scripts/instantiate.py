#!/usr/bin/env python3
"""Instantiate the generic UVM template for a concrete DUT.

Copies this template tree, replaces placeholders in file paths and text, and
prints the remaining manual-adaptation checklist. No simulator/DUT is run.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

TOKENS = ("__PREFIX__", "__DUT_TOP__", "__TB_TOP__", "__CLOCK__", "__RESET__", "__CLOCK_PERIOD_NS__")
SKIP_DIRS = {".git", "__pycache__", "logs", "csrc", "simv.daidir"}
SKIP_FILES = {"template.json", "instantiate.py"}


def fail(message: str) -> "NoReturn":
    print(f"[uvm-template] error: {message}", file=sys.stderr)
    raise SystemExit(2)


def replace_tokens(value: str, mapping: dict[str, str]) -> str:
    for token, replacement in mapping.items():
        value = value.replace(token, replacement)
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dest", required=True, help="destination testbench directory")
    parser.add_argument("--prefix", required=True, help="snake_case prefix, e.g. my_ip")
    parser.add_argument("--dut-top", required=True, help="DUT top module name")
    parser.add_argument("--tb-top", default="", help="testbench top (default: <prefix>_tb)")
    parser.add_argument("--clock", default="clk", help="clock port/signal name")
    parser.add_argument("--reset", default="rst_n", help="active-low reset port/signal name")
    parser.add_argument("--clock-period-ns", default="10", help="clock period in ns")
    parser.add_argument("--force", action="store_true", help="allow writing into a non-empty destination")
    args = parser.parse_args()

    prefix = args.prefix.strip()
    dut_top = args.dut_top.strip()
    clock = args.clock.strip()
    reset = args.reset.strip()
    if not re.fullmatch(r"[a-z][a-z0-9_]*", prefix):
        fail("--prefix must be lower-case snake_case starting with a letter")
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_$]*", dut_top):
        fail("--dut-top must be a valid Verilog identifier")
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_$]*", clock):
        fail("--clock must be a valid Verilog identifier")
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_$]*", reset):
        fail("--reset must be a valid Verilog identifier")
    if not re.fullmatch(r"[0-9]+(?:\.[0-9]+)?", str(args.clock_period_ns)) or float(args.clock_period_ns) <= 0:
        fail("--clock-period-ns must be a positive number")
    tb_top = args.tb_top.strip() or f"{prefix}_tb"
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_$]*", tb_top):
        fail("--tb-top must be a valid Verilog identifier")

    root = Path(__file__).resolve().parents[1]
    dest = Path(args.dest).resolve()
    if dest.exists() and any(dest.iterdir()) and not args.force:
        fail(f"destination is not empty: {dest} (use --force to overwrite files)")
    dest.mkdir(parents=True, exist_ok=True)

    mapping = {
        "__PREFIX__": prefix,
        "__DUT_TOP__": dut_top,
        "__TB_TOP__": tb_top,
        "__CLOCK__": clock,
        "__RESET__": reset,
        "__CLOCK_PERIOD_NS__": str(args.clock_period_ns),
    }

    copied: list[str] = []
    for source in sorted(root.rglob("*")):
        rel = source.relative_to(root)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue
        if source.name in SKIP_FILES:
            continue
        target_rel = Path(replace_tokens(str(rel), mapping))
        target = dest / target_rel
        if source.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            text = source.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            shutil.copy2(source, target)
            copied.append(str(target_rel))
            continue
        target.write_text(replace_tokens(text, mapping), encoding="utf-8")
        copied.append(str(target_rel))

    marker = {
        "template": "generic-uvm-environment",
        "source_template": str(root),
        "prefix": prefix,
        "dut_top": dut_top,
        "tb_top": tb_top,
        "clock": clock,
        "reset": reset,
        "clock_period_ns": str(args.clock_period_ns),
    }
    (dest / ".uvm_template.json").write_text(json.dumps(marker, indent=2) + "\n", encoding="utf-8")

    remaining = [
        f"tb/{prefix}_if.sv: replace the generic bus fields with the DUT interface",
        f"tb/{prefix}_tb.sv: complete the DUT port map and tie-offs",
        f"env/agent/{prefix}_driver.sv and _monitor.sv: implement the real bus protocol",
        f"seq_lib/{prefix}_seq/{prefix}_smoke_seq.sv: replace the example register test with the first real scenario",
        "vcs_com/rtl.f: point to the real DUT RTL filelist",
        "test_lib/smoke/smoke.tc: set real +UVM_TESTNAME/+SEQ/plusargs",
        "optional: add VIP adapter under env/vip/ and hooks in the base test",
    ]
    print(f"[uvm-template] created: {dest}")
    print(f"[uvm-template] files: {len(copied)}")
    print("[uvm-template] remaining hand edits:")
    for item in remaining:
        print(f"  - {item}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
