# Timedoor CMS — V3.1 flow specification & 14-frame mapping

This document revises the supplied export guide. Static frame numbering is reading order, not one mandatory sequential journey. All 14 supplied frames are represented by working local-demo states. Existing Create Event, single-schedule Trial/PTM rules, stable purchase Session references, import and registration remain separate flows.

## 1. Two independent operations
**Reschedule** changes one occurrence's date/time/room/teacher. Its identity and assignments are retained. Only students assigned to that occurrence follow; other occurrences and assignments do not change. Event memberships, original orders and payments are untouched.

**Move Participants** transfers selected student registrations to a compatible destination event/occurrence. It releases source seats and reserves destination seats. A batch has one source schedule and one destination schedule. Original order/payment references remain in the source history; the same purchase Session reference accompanies the transfer, not a new purchase Session. Attendance history is preserved at the source.

Never chain these operations or call participant transfer a reschedule of the whole event.

## 2. Confirmed rules from user
- Include both operations and all fourteen frames/variants.
- Reschedule cutoff: strictly before **2 hours ahead of the current/original schedule start**, for all five event types. At exactly the cutoff, editing is blocked.
- Only the selected occurrence's assigned students follow a reschedule.
- Replace the old direct Edit action with the reviewed Reschedule flow; do not retain a bypass.
- V3.1: allow Trial ↔ Workshop ↔ Bootcamp, including different books/languages; exclude PTM/Internal Meeting; require the same branch/currency. Manual demo students may use explicitly labeled simulated applied amounts.
- Correct inconsistent guide/frame identities and flows instead of reproducing contradictions.

Additional protective rule shown in the supplied design: any recorded attendance/benefit blocks reschedule, even before cutoff. Upcoming status is required. New start must be future, end later than start, reason present, room capacity sufficient. Revalidate on final commit.

## 3. Exact frame mapping and entry routes
| Frame | Implemented state | Route / interaction |
|---|---|---|
| 01 Event List | Existing events + movement scenarios | `#/events` |
| 02 Participants Upcoming | Five students, three selectable for sample batch | `#/events/EV-MOVE/participants` |
| 03 Participants Ended | No-record eligible; Absent conditional; Present/Late blocked | `#/events/EV-ENDED/participants` |
| 04 Absent Confirmation | Overlay retaining source Participants context | Move selected absent participants |
| 05 Destination No Attendance | Destination selection, no attendance branch | Upcoming/no-record batch |
| 06 Destination Verified | Same destination step after absence confirmation | Ended/Absent branch |
| 07 Review & Confirm | Source→destination + individual financial outcomes | Continue to Review |
| 08 Batch Result | Counts, destination quota, matched per-student details, real CSV export | Final successful commit |
| 09 Additional Invoice Pending | Bella, delta100000, reserved seat | View Transfer on Bella's result |
| 10 Remaining Event Value | Kevin, remaining150000, active seat | View Transfer on Kevin's result |
| 11 Schedule Actions | Contextual menu: attendance/reschedule/history/assign/cancel | `#/events/EV-MOVE/schedule` |
| 12 Attendance Detail | Same selected occurrence, return to originating Schedule | View Attendance |
| 13 Reschedule Step1 | Original summary + proposed inputs + cutoff/conflict/impact | Reschedule |
| 14 Reschedule Step2 | Comparison, reason/edit, notifications, reviewed gate | Continue |

Additional working states: updated Schedule, committed History, clock cutoff error, conflict error, source transfer history, invoice detail, authorized demo payment verification, remaining-value record, one-student variant, and responsive mobile states.

## 4. Wiring
### Upcoming / no attendance
01 → source Participants02 → select participants → Move → Destination05 → reason + destination → Review07(upcoming variant) → reviewed checkbox → final revalidation + atomic commit → Result08(upcoming variant).
No absent allowance is consumed in this branch. An ended source with no attendance may also use the no-record branch. Do not imply Upcoming must become Ended first.

### Ended / absence
01 → Participants03 → select no-record + Absent participants → Confirmation04 → reason + explicit non-attendance confirmation for every absent student → Destination06 → Review07 → final revalidation + commit → Result08.
Present, late, or recorded benefit participants cannot be selected. Removing an absent student returns to source selection with that student deselected. Counts, capacity and outcomes are recomputed, never copied from the three-person sample.
The absence allowance is consumed **only at final commit**, not by opening/checking a draft. Cancel leaves all records unchanged.

### Details
08 → View Transfer for the actual row → matching09 OR10. These are parallel outcomes, not sequential pages. Unique transfer/invoice/value IDs are generated. Same-price detail also works but is not a required extra source frame.
Back to Participants returns to the source. View Destination Event returns to the actual destination. Batch summary download produces CSV, not a fake navigation.

### Reschedule
11 → selected occurrence Reschedule →13 → valid inputs/reason →14 → reviewed checkbox → final revalidation → update the same occurrence → Schedule updated.
Back/Edit reason →13 retains draft. Cancel/Close → originating Schedule with no writes. Both steps retain the same Schedule backdrop.
History records original/proposed fields, reason, author, timestamp, notification choice and assigned participant IDs. This is distinct from Drop/Cancel and replacement creation.

## 5. Validation and outcome rules
### Reschedule
Check cutoff and attendance at open/continue/final save. Block same-event overlapping schedules, other room/teacher overlap and assigned-student overlap across local demo schedules. Dropped schedules do not block. New schedule must fit the selected room capacity.
The reference's28Sep→5Oct example conflicts with the existing5Oct schedule; the demo deliberately shows this error. Use6Oct13:00–15:00 for the successful sample. Do not claim no conflict without checks.
Review badge = **Proposed**, not Rescheduled. Only the saved occurrence/history displays Rescheduled.

### Move
A destination may cross Trial, Workshop and Bootcamp and need not match book or language. PTM and Internal Meeting are excluded as both source and destination. Branch and currency must match; the destination must be active/upcoming/future; and have capacity for the entire batch. Already-registered students and assignment conflicts are blocked. Future compatible destinations that fail quota, duplicate-registration or assignment checks remain visible with explanations. Inactive, ended and past occurrences are excluded and the remaining choices are sorted by start time. Reserved participants consume capacity.
Revalidate current attendance, eligibility, duplicate registration, quota, room capacity and applied amounts on final confirmation. Any error blocks the entire batch; no partial transfer/invoice/value/allowance writes.
Applied amounts must be known: verified fixture payment or explicitly marked Manual demo simulation. Add Demo Students uses the source event price by default (Rp 0 is valid); legacy manual rows can use Set Demo Applied Amount without reset. Unverified imported/form registrations are not assumed paid or simulated. Program type/book/language differences are displayed at review, not silently treated as equivalent. Multiple-source-schedule entitlements are blocked for staff review rather than copying paid value across several sessions.

For each student: destination fee minus verified or explicitly simulated amount applied:
- zero → Active, no adjustment;
- positive → Reserved Pending Payment, adjustment invoice only for the difference;
- negative → Active, Remaining Event Value record for eligible future event use.
Original orders and payments are retained. Remaining value is not cash balance or wallet. Redemption and expiry are not invented.

The supplied conditional sample is now coherent:
- Axel350000→350000: Active, no adjustment.
- Bella250000→350000: Reserved, invoice100000, confirmed Absent allowance used.
- Kevin500000→350000: Active, remaining value150000.
Destination5Oct Session2 has5available seats before the three-person move and2remaining after. Detail09/10 match these students, amounts and destination IDs, not unrelated Axel examples.

## 6. Financial verification and notifications
The unrestricted Mark as Paid shortcut is replaced by **Verify Demo Payment**: explicit Demo Finance authorization checkbox plus evidence/reference. It appends a local verification record, activates the reservation, and prevents repeat verification. This is not real payment processing or production authorization.
Invoice and remaining-value detail actions open the matching records. No wallet conversion/withdrawal action is exposed.
Notification choices produce local demo outbox records. Text says **Demo queued**, not falsely Sent. No email/SMS/WhatsApp service is connected.

## 7. Identity, design, and navigation corrections
- Consistent HQ Training / Asia/Jakarta throughout each scenario.
- Same event/schedule/teacher/room flows through Schedule→Attendance or Schedule→Reschedule.
- No12Oct row routed to28Sep attendance.
- Two-step reschedule shares one backdrop, modal shell and stepper.
- Source/destination summaries use live identities, not fixed frame labels.
- Batch headline = Batch Transfer Processed, explicit Active vs Reserved counts.
- Remaining Event Value terminology replaces customer balance credit.
- Add reason/internal note inputs before read-only review.
- Correct long/clipped names with wrapping and responsive layouts; tables scroll internally on mobile.

## 8. Demonstration environment & provisional decisions
The visible **Demo clock** defaults to28Sep2026,10:00WIB so the supplied pre-cutoff scenario is reproducible. At11:00 the28Sep13:00 occurrence is blocked. This clock is simulation, not the user's current date and not a production override. Runtime checks use that clock consistently.

Seed room capacities: Bill Gates25, Leon Musk20, Jeff Bezos15. Destination event capacities are separate; the sample Session2 has capacity8 with3existing registrations, hence5free seats. These are fixture data, not a universal quota rule.

Conservative provisional policies not specified in the source: one-time absence move tracked per student across local events; multi-schedule entitlement/unverified import or form payment needs review. Cross-type Trial/Workshop/Bootcamp and same-branch/currency policy were approved for V3.1. Production should confirm these, reservation expiry/cancellation, value redemption/expiry, finance roles and concurrent inventory locking.

V3.1 retains the V3 localStorage key without resetting or rewriting stored data. V3 originally used a new key; V2 data is left untouched, not silently migrated/deleted. Local same-browser/origin persistence is not a backend and cannot enforce production security or cross-device sharing.

V3.1 instructions and legacy demo repair: see `V3_1_CHANGES.md`.
