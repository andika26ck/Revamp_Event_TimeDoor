> Catatan historis V1/V2. Untuk V3, Edit diganti Reschedule dan transfer sudah tersedia. Lihat EVENT_PROTOTYPE_ORDER_14_FRAMES.md dan V3_WALKTHROUGH.md.

# V2.1 — Trial creation correction

V2 only disabled the Add Schedule button after the first Trial schedule. The date/time/room/teacher inputs remained editable. This was incomplete relative to the annotated brief: disable or hide the entire addition area after one schedule has been added.

V2.1 uses a disabled fieldset around all addition inputs and the Add Schedule button for Trial (and the same single-schedule creation rule for PTM). The existing schedule table and Remove action remain enabled. Removing the schedule re-enables the addition area. Multi-schedule types remain enabled. Switching from a multi-schedule draft to Trial still preserves rows and blocks save until extra rows are removed.

The Trial placeholder remains `Trial Tanggal_Trial Sesi/Jam_Trial`. It appears in the empty name input; the hint remains visible when the user has typed a name. User-entered names are not overwritten.

Free/Paid support is unchanged: Free disables currency/base price and saves zero; Paid enables base price and saves the entered positive price. This is event configuration, not actual payment processing.

Regression: 19 existing behavioral checks and 5 targeted Trial checks passed; no page errors. Targeted checks cover placeholder, all controls disabled after add, all controls unlocked after removal, paid save, and free save. Visual inspection covers locked, unlocked and paid-locked states.
