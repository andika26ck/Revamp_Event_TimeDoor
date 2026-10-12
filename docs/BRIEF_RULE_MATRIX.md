# Source-of-truth Rule Matrix

Source: user-supplied “Perbaikan Rule Event based on Type + PTM + Team Meeting”, 8-page PDF. Page references below point to that attachment. Rule text and UX proposals are deliberately separated.

## Required by brief
| ID | Type / feature | Required behavior | Source |
|---|---|---|---|
| G01 | All types | Schedule changes must not remove event participants or require reorder, duplicate purchase Session, or another payment. Use Adaptive Class scheme. | pp.1–3 |
| G02 | Details | Add Schedule tab. Schedule shown in Details is read-only; changes occur in Schedule tab. | p.2 annotated screenshot |
| G03 | Participants | Event-level participant list, no date/time schedule selector at its top. | p.3 annotated screenshot |
| G04 | Schedule | Adaptive-style rows Date, Main Teacher, Room, Time, Action; Assign Students and Add Schedule; **no Generate Schedule**. | p.3 annotated screenshot |
| G05 | Trial ongoing management | Only one active schedule; drop existing schedule before adding another. | p.3 screenshot annotation |
| G06 | Attendance | See Details opens full Adaptive/Group-style Attendance Detail, including presence, Meeting Journal, late and notes; available before Finish. | pp.3–4 |
| G07 | Attendance routing | Class Attendance → See Details AND Event Detail → Schedule → See Details reach same schedule's detail. | p.4 |
| T01 | Trial | One schedule at creation: one date, one session. Free or paid. | pp.4–5 |
| T02 | Trial name placeholder | `Trial Tanggal_Trial Sesi/Jam_Trial` | p.4 |
| W01 | Workshop | One or more schedules. Free or paid. | pp.5–6 |
| W02 | Workshop name placeholder | `Nama_Workshop : Tanggal atau Sesi` | p.5 |
| W03 | Workshop participants | Spreadsheet import; **format menyusul**. | p.6 |
| W04 | Workshop registration | Generate participant registration form with Nama, No HP, Usia. | p.6 |
| B01 | Bootcamp | One or more schedules. Free or paid. | pp.6–7 |
| B02 | Bootcamp name placeholder | `Nama_Bootcamp & Materi : Nama_Sesi atau Nama_Kelas` | p.6 |
| P01 | Parent Teacher Meeting (PTM) | New type; one schedule. Free or paid. | p.7 |
| P02 | PTM name placeholder | `Tanggal_PTM - Nama Teacher/Moderator` | p.7 |
| I01 | Internal Meeting | New type; one or more schedules. **Cannot be ordered by Student.** | p.8 |
| I02 | Internal Meeting name placeholder | `Nama Internal Meeting_Tanggal Internal Meeting` | p.8 |

## Canonical type choices
Trial / Workshop / Bootcamp / Parent Teacher Meeting (PTM) / Internal Meeting.
Add these to Create Event and existing type filters. Do not invent a separate PTM or Team Meeting sidebar menu.

## Type-specific creation
| Type | Schedule count | Free / Paid | Student ordering |
|---|---|---|---|
| Trial | Exactly 1 | Both allowed | Keep existing order eligibility |
| Workshop | At least 1, may add more | Both allowed | Keep existing order eligibility |
| Bootcamp | At least 1, may add more | Both allowed | Keep existing order eligibility |
| PTM | Exactly 1 | Both allowed | Brief allows Free/Paid; buyer/attendee model not further specified |
| Internal Meeting | At least 1, may add more | Not specified | Block all orders on behalf of Student |

Placeholders are hints, not stored default values, forced patterns, regex restrictions or automatic renaming. Preserve a user's typed Event Name when changing type; update empty-field placeholder and optional example helper only.

## Screenshot/text inconsistencies
- Bootcamp paragraph p.6 says 'pilih Event Type: Workshop' within Bootcamp. Use Bootcamp section heading + its distinct Bootcamp placeholder. Record this as apparent copy typo, not a third-party rule.
- Workshop example screenshot p.6 displays Bootcamp selected. Use Workshop text rule for Workshop.
- PTM sample value begins PTM, but stated placeholder does not. Use literal specified placeholder; filled example may include PTM.
- PDF shows Asia/Makassar/Offline Mataram; selected project may use a different branch/timezone. Preserve selected branch timezone consistently, do not change source project location blindly.
- Metadata Menu: Teacher does not override screenshot's Product → Event placement. No navigation migration requested.

## Do not infer
No custom quota consumption, entitlement calculation, pricing formulas, parent-session linkage, invitation engine, recurring schedule generator, import columns/file types, staff payroll, post-Finish edit permission, or auto-refund is defined. No configurable rule-settings menu is requested here.


## V2 implementation note
User subsequently approved a provisional three-field spreadsheet format: Nama, No HP, Usia. XLSX/CSV import is implemented in V2; this does not retroactively make the brief format final. See V2_CHANGES_AND_BRIEF_COVERAGE.md for current prototype status.


## V3 addition — user-confirmed reschedule and transfer scope
These additions come from the 14-frame reschedule/transfer prototype and subsequent user confirmations, not the original eight-page type-rule brief.

| Addition | Current rule |
|---|---|
| Reschedule cutoff | Strictly before two hours ahead of the old schedule start; same rule for all five types; recorded attendance also blocks changes |
| Assignment impact | Update the same occurrence and only its assigned participants; other occurrences, memberships and original financial references remain unchanged |
| Reviewed reschedule | Replace direct schedule editing with New Schedule → Review → Confirm; append before/after history |
| Participant transfer | Single or whole-batch selection → eligibility/conditional absence → future compatible destination → per-student financial review → revalidation/commit → matching result/details |
| Financial outcome | Equal value: Active; shortfall: Reserved + difference invoice; excess: Active + remaining event value, not wallet/cash |
| Conditional absence | Explicit reason and non-attendance acknowledgment; provisional one-time per-student allowance consumed only at final commit |
| Demo boundaries | Local-only outbox/payment verification; no real transaction, backend or production permission enforcement |

See `EVENT_PROTOTYPE_ORDER_14_FRAMES.md` for corrected frame mapping, confirmed rules and clearly separated provisional policies.

### V3.1 approved revision
Cross-type student transfer is allowed only among Trial, Workshop and Bootcamp. Books and languages may differ and are surfaced in review. Same branch/currency are retained; PTM and Internal Meeting are excluded. Manual demo additions use explicitly simulated applied amounts, including Rp 0 for free events; imports/forms are not implicitly paid. Legacy manual demo values can be completed without reset.
