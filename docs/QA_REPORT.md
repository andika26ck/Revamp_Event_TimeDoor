> Historical V3.1 report. Latest V3.2 results: V3_2_QA_REPORT.md (126 checks).

# V3.1 QA Report — Reschedule and Move Participants

## Scope and result
Static Next.js prototype implementing both additions across all 14 supplied reference frames. The 14 frames include alternative branches, not a single linear journey. V3.1 additionally implements explicitly simulated manual demo amounts and user-approved Trial/Workshop/Bootcamp cross-type transfer. Build and all five final automated regression suites passed.

| Suite | Passed | Coverage |
|---|---:|---|
| Browser behavioral smoke | 31 | Upcoming/ended source, conditional absence, destination selection, batch/single transfer, review/back/cancel, records, financial detail, demo verification, reschedule/conflict/history/cutoff, import, persistence, mobile |
| V3.1 browser regression | 10 | Manual addition/assignment/selection, legacy repair/cancel/persistence, cross-type destination/review/commit, mobile simulation and transfer |
| Movement transaction unit | 37 | Strict cutoff, all event types, attendance guard, resource/student overlap, immutable assignments/payments, capacity/duplicate/attendance revalidation, atomic commit, exact deltas, allowance and verification safeguards |
| Import parser/validation unit | 9 | CSV quoting/separators, malformed input, headers, phone text preservation, duplicate identity, age and blank rows |
| Targeted Trial regression | 5 | Placeholder, single schedule, locked addition area, remove/re-enable, free/paid behavior |
| **Total** | **92** | Prototype checks, not production certification |

No browser page errors were reported by the final smoke run. Tests use a separate local browser and fixed demo time; no production data or payment service is involved.

## Visual inspection
V3.1: 13 new targeted states were rendered and individually inspected (9 desktop, 4 mobile), plus full roster/legacy-repair/destination/review documents. Simulation labeling, explicit repair controls, program differences and exact free-to-paid invoice outcomes were checked. No overlapping controls or horizontal page overflow was observed in these views.

Previous V3 coverage: 35 state snapshots were rendered and individually inspected: 29 desktop at 1440×900 and 6 mobile at 390×844. This covers every source frame plus history, cutoff, successful save, financial dialogs, single-person movement, import and retained Trial flow. Complete review/result pages were additionally inspected.

Final refinements were rebuilt, retested and the affected states re-rendered: correctly sized radio controls, date-sorted future destinations, Rp 0 financial totals instead of Free, singular confirmation wording, red removal link, amber reservation badge and active Event navigation through transfer pages. Full participant/destination/financial pages and tall reschedule forms were checked. Tables intentionally scroll within their containers on narrow screens; long modal bodies scroll independently of their footer.

These checks do not claim pixel-perfect parity with the production CMS. The reference modal hierarchy, white cards, green semantic accents, two-step comparisons and responsive stacking are preserved.

## Coherent sample data
- Clock: 28 Sep 2026, 10:00 Asia/Jakarta, visibly marked simulation.
- Old reschedule starts 13:00; cutoff is 11:00. At exactly 11:00 changes are blocked.
- Moving 28 Sep to 5 Oct in the sample collides with the existing schedule. 6 Oct is the successful example.
- Batch destination price Rp 350,000: Axel Rp 350,000 → no adjustment; Bella Rp 250,000 → invoice Rp 100,000 and Reserved; Kevin Rp 500,000 → remaining event value Rp 150,000 and Active.
- Five available seats become two after the three-person batch. Reserved seats count against quota.
- Only the changed occurrence's assigned participants follow reschedule. Other assignments and original order/payment/session references remain unchanged.

## Documentation and legacy
The supplied frame guide has been corrected and expanded in `EVENT_PROTOTYPE_ORDER_14_FRAMES.md`; actionable paths are in `V3_WALKTHROUGH.md`. Original type rules remain mapped in `BRIEF_RULE_MATRIX.md`. V2/V2.1 reports are historical references, not the current workflow definition.

V3 uses a new localStorage key. Existing V2 data is not deleted or silently migrated. Reset affects V3 demo data only.

## Deliberate limits
No backend, real financial processing, real notifications, enforceable role permissions, cross-device sharing or concurrent transaction locking. Final checks operate on the current local demo data. The Finance checkbox is an explicit simulation acknowledgment, not production authorization.

Applied values must be verified fixture values or explicitly marked manual Demo / Simulated values. Legacy manual repair does not reset data or change original payments. Unverified imports/forms and ambiguous multi-schedule entitlements remain blocked rather than inventing financial allocations. Trial/Workshop/Bootcamp cross-type transfer, book/language differences and same-branch/currency rules are user-approved. The per-student one-time absence allowance remains a conservative prototype choice, labeled in the guide. Reservation expiry, remaining-value redemption/expiry, production financial policies and staff/parent attendee models need separate specification.

Demo lifecycle controls and the simulation clock are testing tools. They must not be exposed as production attendance/time controls.

## V3.1 reported-case verification
The user-reported sequence Add Demo Students → assign → return to Participants → select now passes, including a free Trial with Rp 0. Explicit legacy repair preserves source assignments and audit records under the same V3 key. Imports/forms/paid fixtures cannot use the repair shortcut. Unit coverage verifies all nine source/destination combinations among Trial, Workshop and Bootcamp with differing books/languages; PTM/Internal Meeting, branch/currency mismatches, attendance, quota and duplicate/conflict checks remain enforced.
