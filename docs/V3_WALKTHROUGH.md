# V3.1 demo walkthrough

Run `node scripts/serve.mjs` from the extracted project, open localhost:3000. No install/build needed for the included demo build. Keep default Demo clock28Sep2026 10:00WIB. Reset using the topbar reset action for a fresh scenario.

## Reschedule / frames11–14
1. Events → Digital Literacy Workshop — Upcoming → Schedule.
2.28Sep row actions → View Attendance; Back returns to the same Schedule.
3.28Sep actions → Reschedule. Enter5Oct13:00–15:00 and choose Teacher unavailable: existing5Oct overlap blocks Continue.
4. Change date to6Oct. Continue opens review with Proposed badge. Back/Edit reason retain values. Cancel never saves.
5. Check reviewed impact → Confirm Reschedule. Same occurrence ID and assigned students remain; other rows unchanged.
6. Row actions → View History for original/new values, reason, timestamp and demo notifications.
7. Reset, expand Demo clock, set28Sep11:00. The28Sep13:00 reschedule action is blocked exactly at the cutoff.

## Upcoming move / frames02→05→07→08
1. Upcoming event → Participants. Select Axel, Bella, Kevin → Move3Participants.
2. No attendance branch goes straight to destination selection. Choose Digital Literacy Workshop — Session2, enter a transfer reason.
3. Introduction to Digital Art is disabled for a3-person batch (only2seats).
4. Review outcomes, check reviewed checkbox, confirm. Result contains2Active/1Reserved; no one-time absence allowance was consumed.

## Ended/Absent / frames03→04→06→07→08→09/10
Reset before this path to restore source/destination quota.
1. Digital Literacy Workshop — Ended → Participants. Siti(Present) and Dimas(Late) are blocked. Select Axel/Bella/Kevin.
2. Move3Participants → confirm Bella did not attend, enter absence reason. The draft does not consume her allowance. Remove Bella returns with only2selected.
3. Allow Move & Continue → select Session2 → enter transfer reason/note → review.
4. Confirm reviewed outcomes → processed batch. Axel350000→350000, Bella250000→350000 invoice100000, Kevin500000→350000 remaining value150000. Original Session references and payments stay recorded.
5. Download Batch Summary gives a CSV. View Transfer on Bella opens matching pending invoice detail; Kevin opens matching remaining-event-value detail.
6. Bella → View Additional Invoice. Verify Demo Payment requires explicit demo finance authorization + reference. Once verified her destination registration becomes Active. No real payment is processed.
7. Kevin → View Remaining Event Value. This is restricted event value, not customer cash/wallet.
8. Back to Participants shows source roster updated and transfer history; destination includes active/reserved seats. Notifications are only local queue records.

## One participant
Participant row actions → Move to Another Event uses a one-person flow with recalculated quota/amounts. It does not reuse a static three-person result.

## Existing behavior
Create Trial still permits exactly one row and locks all addition fields. PTM single/multi-type limits, Drop/replacement, Workshop import/form and attendance viewing remain available. Direct Edit schedule is intentionally removed; changes must go through Reschedule.

## Added demo student and cross-type transfer
1. Open Trial EV-001 → Participants → Add Demo Students → Kevin → Add.
2. Schedule → Assign Students → include Kevin → Assign.
3. Participants: Kevin shows Demo / Simulated · Rp 0 and is selectable.
4. Move → choose a future Workshop/Bootcamp, even with a different book. Review program differences and exact fee adjustment before confirmation.
5. For a pre-V3.1 manual row with missing value, click Set Demo Applied Amount; save a simulation without reset. Imports/forms do not get this shortcut.

See `V3_1_CHANGES.md` for same-origin storage retention and detailed steps.
