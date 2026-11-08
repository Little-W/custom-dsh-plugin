# UVM environment acceptance checklist

Use this checklist for the generated TB; a checked item needs an evidence path.

## Environment facts
- [ ] DUT top, RTL filelist, and version/hash recorded
- [ ] clock/reset names, periods, polarity, and reset sequence recorded
- [ ] bus/register protocol and handshake rules documented
- [ ] simulator + UVM version recorded
- [ ] VIP/license availability recorded; if absent, explicitly stated

## Code adaptation
- [ ] test/config_db → virtual sequence/sequencer → agent sequence/sequencer → driver → DUT layering is preserved
- [ ] sequence never directly drives DUT pins; only driver owns pin-level protocol
- [ ] monitor publishes sampled transaction via analysis port
- [ ] DUT-specific scoreboard/reference checks and functional coverage exist
- [ ] relevant interface/reset assertions are enabled and reported
- [ ] zero `__PREFIX__`/`__DUT_TOP__`/other placeholder leftovers
- [ ] DUT port map complete; unused inputs tied off deliberately
- [ ] driver has a bounded timeout and drives real handshake
- [ ] monitor samples accepted transactions with real fields
- [ ] at least one real check (readback/scoreboard/assertion) exists
- [ ] tests use one smoke test + `+SEQ`-selected sequences (or documented equivalent)

## Compile
- [ ] compile command and `logs/comp.log` archived
- [ ] elaboration log archived; zero unresolved modules/errors
- [ ] no skipped compile mistaken for pass

## Run
- [ ] smoke case command, seed, plusargs, exit code archived
- [ ] reset actually released; clock running
- [ ] UVM_FATAL=0, UVM_ERROR=0 and expected check/readback observed
- [ ] regression/case matrix status recorded (PASS/FAIL/NOT RUN)
- [ ] failing cases have reproducer and owner

## Signoff
- [ ] evidence paths are under the work directory and readable
- [ ] no fabricated or "compile-only" pass
- [ ] unresolved DUT/VIP/tool blockers listed in handoff
