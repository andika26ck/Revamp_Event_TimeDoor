# V3.1 — demo students and cross-type transfers

## Confirmed scope
The user approved cross-type transfers among **Trial, Workshop and Bootcamp**, excluding **PTM and Internal Meeting**. Different books/material and languages are allowed and displayed for staff review. Branch and currency must match; no currency conversion is invented.

## New manual demo students
`Add Demo Students` now creates local manual demo registrations with:
- `paidAmount` equal to the source event price; **0 is a valid amount** for a free event;
- `paymentStatus: Simulated` and `demoPayment: true`;
- an explicit **Demo / Simulated** label, not a real verified-payment claim;
- no purchase Session, invoice, payment gateway action or automatic assignment.

Assign the added student to one source occurrence before selecting Move. Attendance, quota, duplicate, conflict and one-time absence guards still apply. Imports and public-form registrations are not automatically marked paid or simulated.

## Existing V3 data — no reset required
V3.1 retains the V3 localStorage key. No migration rewrites unknown payments.
1. Open Participants for the event where the student was manually added.
2. Click **Set Demo Applied Amount** next to an unverified manual demo student; alternatively use the student's action menu.
3. Review the explicitly labeled simulation dialog. Default = event price (or Rp 0 for free).
4. Click **Save Simulated Amount**. Existing assignments, other students and audit records are preserved.
5. The student becomes selectable if all remaining transfer eligibility checks pass.

Cancel causes no writes. The action is restricted to unlinked manual demo registrations; it cannot edit imported/form records, original paid fixtures, transferred students or pending adjustment reservations. A simulation may be edited before transfer to exercise different fee outcomes.

## Cross-type behavior
The destination list includes future active Trial, Workshop and Bootcamp occurrences in the same branch/currency. Each row shows **type, book and language**. Review displays old → new program details and asks staff to confirm suitability when they differ. The final reviewed checkbox remains required.

Per-student financial calculations are unchanged:
- destination price = applied amount → Active, no adjustment;
- destination price > applied amount → Reserved, invoice for the difference;
- destination price < applied amount → Active, remaining event value (not cash/wallet).

Example: a manually added student in free Trial has simulated Rp 0. Moving to a Workshop priced Rp 350,000 produces an **additional invoice Rp 350,000** and a Reserved seat. This is intentional, not another missing-payment error.

Attendance/eligibility, complete-batch quota, duplicate registration, room capacity, student conflicts, branch/currency and current financial values are rechecked at commit. Original order/session/payment references remain unchanged. Multi-source-schedule entitlements still require review rather than arbitrary allocation.

## Running the revision
Extract into a separate folder, stop the old local server and start this folder's `START_DEMO_WINDOWS.cmd` or `node scripts/serve.mjs`. Use the same address/port and browser profile to retain V3 local data; **do not press Reset Data**. Different ports/profiles use different browser storage.

This is a static local prototype. Payment simulations and queued notifications are not real transactions or message delivery.
