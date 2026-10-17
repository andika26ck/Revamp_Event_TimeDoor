# V3.2 QA — mentor revisions

Final static build: Next.js 16.4.0 / webpack, successful. Source includes original Next.js build script; build output is included for direct local demonstration.

| Suite | Passed |
| --- | ---: |
| Movement transactions (existing) | 37 |
| Import parser / validation (existing) | 9 |
| Workshop registration transactions (new) | 21 |
| Trial browser regression | 5 |
| V3.1 browser regression | 10 |
| Updated browser behavioral smoke | 32 |
| Mentor-revision browser regression (new) | 12 |
| **Total** | **126** |

Browser suites completed without page errors. Tests used isolated local browser contexts, fictional fixtures and the demo clock. No user production data, payment, remote deployment or notifications were changed.

## New coverage
- Teacher-only Internal Meeting, no student summary/table/actions.
- Teacher changes via Schedule reflected in Participants and unique teacher count.
- Real public-form submit creates Pending only; duplicate Pending blocked.
- Pending excluded from student count, assignment and seat consumption.
- Select one/many/all Pending; Cancel leaves data unchanged.
- Bulk confirmation preserves unselected drafts and Confirmed history.
- No automatic payment, invoice, purchase Session, assignment or notifications.
- Whole-batch capacity rejection, Reserved seat consumption and exact-capacity acceptance.
- Duplicate validation within a batch, against current membership and after another path adds a participant.
- Final transaction revalidation; repeat/missing/cross-event confirmation rejected.
- Data persistence and legacy linked/unlinked migration without dropping member/assignment/attendance/financial data.

## Visual inspection
Ten new screenshots were rendered and individually inspected: teacher-only Internal Meeting desktop/mobile, Pending desktop/mobile, bulk review desktop/mobile, Confirmed history desktop/mobile, capacity-block error, legacy Confirmed history. Desktop 1440px, mobile 390px. No page-level horizontal overflow in these checks. Wide tables intentionally scroll within their own containers. Review modal title/body/footer remain usable on mobile. Existing typography, branding and green semantic accent are retained.

These are prototype checks, not proof of production readiness. LocalStorage does not enforce multi-user capacity locking, authorization or payment security. Unknown payment/entitlement remains subject to existing transfer guards.
