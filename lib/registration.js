// Local workshop registration workflow. Confirmation is NOT payment or assignment.
import { normalizeName, normalizePhone } from './import.js';
import { seatCount } from './movement.js';

export const sameRegistration = (a, b) =>
  normalizeName(a.name) === normalizeName(b.name) &&
  (!a.phone || !b.phone || normalizePhone(a.phone) === normalizePhone(b.phone));

export const availableRegistrationSeats = event =>
  Math.max(0, (event.capacity ?? 25) - seatCount(event));

export function registrationDataErrors(data) {
  const errors = [];
  if (!String(data.name ?? '').trim()) errors.push('Nama is required.');
  const phone = String(data.phone ?? '').trim();
  if (!/^[+\d\s()-]+$/.test(phone) || normalizePhone(phone).length < 8 || normalizePhone(phone).length > 15)
    errors.push('No HP must contain 8–15 digits.');
  if (data.age === null || data.age === undefined || String(data.age).trim() === '' ||
      !Number.isInteger(Number(data.age)) || Number(data.age) < 0)
    errors.push('Usia must be a non-negative whole number.');
  return errors;
}

// Preserve legacy students, assignments, attendance and payments. Older forms
// already added members, so mark ONLY their linked submissions as confirmed.
// Never demote or delete existing students during an upgrade.
export function upgradeRegistrationWorkflow(db) {
  if (db.registrationWorkflowVersion === 2) return db;
  return {
    ...db,
    registrationWorkflowVersion: 2,
    registrations: (db.registrations ?? []).map(row => {
      if (row.status === 'Pending' || row.status === 'Confirmed') return row;
      const event = db.events.find(e => e.id === row.eventId);
      const linked = event?.members.find(m => m.id === row.id);
      return linked
        ? { ...row, status: 'Confirmed', memberId: linked.id, legacyConfirmed: true }
        : { ...row, status: 'Pending' };
    }),
  };
}

export function submitWorkshopRegistration(db, eventId, data) {
  const event = db.events.find(e => e.id === eventId);
  if (event?.type !== 'Workshop' || !event.formEnabled)
    throw new Error('This registration form is not available.');
  const errors = registrationDataErrors(data);
  if (errors.length) throw new Error(errors.join(' '));
  const normalized = {
    name: String(data.name).trim(),
    phone: String(data.phone).trim(),
    age: Number(data.age),
  };
  if (event.members.some(m => sameRegistration(m, normalized)) ||
      (db.registrations ?? []).some(r => r.eventId === eventId && sameRegistration(r, normalized)))
    throw new Error('Peserta dengan nama dan nomor HP ini sudah terdaftar atau memiliki pendaftaran pending pada event.');
  const row = {
    ...normalized,
    id: 'REG-' + crypto.randomUUID(),
    eventId,
    status: 'Pending',
    submittedAt: db.demoNow || new Date().toISOString(),
  };
  return { ...db, registrations: [...(db.registrations ?? []), row] };
}

export function registrationConfirmationErrors(db, eventId, ids) {
  const event = db.events.find(e => e.id === eventId);
  if (event?.type !== 'Workshop') return ['Confirmation is available for Workshop only.'];
  const errors = [];
  if (!ids.length) errors.push('Select at least one pending submission.');
  if (new Set(ids).size !== ids.length) errors.push('Duplicate submission selection.');
  const rows = ids.map(id => (db.registrations ?? []).find(r => r.id === id && r.eventId === eventId));
  rows.forEach((row, i) => {
    if (!row) { errors.push('A selected submission no longer belongs to this event.'); return; }
    if (row.status !== 'Pending') errors.push(`${row.name}: this submission is no longer pending.`);
    errors.push(...registrationDataErrors(row).map(error => `${row.name}: ${error}`));
    if (event.members.some(m => m.id === row.id || sameRegistration(m, row)))
      errors.push(`${row.name}: participant already exists in Student List.`);
    if (rows.slice(0, i).some(other => other && sameRegistration(other, row)))
      errors.push(`${row.name}: duplicate participant in this selection.`);
  });
  const seats = availableRegistrationSeats(event);
  if (ids.length > seats)
    errors.push(`Only ${seats} seats available; ${ids.length} selected. No submissions will be confirmed. Reduce the selection and try again.`);
  return [...new Set(errors)];
}

export function confirmWorkshopRegistrations(db, eventId, ids) {
  const errors = registrationConfirmationErrors(db, eventId, ids);
  if (errors.length) throw new Error(errors.join(' '));
  const rows = db.registrations.filter(r => ids.includes(r.id) && r.eventId === eventId);
  const at = db.demoNow || new Date().toISOString();
  return {
    ...db,
    events: db.events.map(event => event.id !== eventId ? event : {
      ...event,
      members: [...event.members, ...rows.map(row => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        age: row.age,
        parent: '—',
        session: null,
        origin: 'Registration form',
        registrationId: row.id,
        registrationStatus: 'Confirmed (demo)',
        state: 'Active',
        paymentStatus: 'Unverified',
      }))],
    }),
    registrations: db.registrations.map(row => row.eventId === eventId && ids.includes(row.id)
      ? { ...row, status: 'Confirmed', memberId: row.id, confirmedAt: at, confirmedBy: 'Demo Admin' }
      : row),
    audit: [...(db.audit ?? []), {
      action: 'Workshop submissions confirmed — no payment or assignment',
      event: eventId, registrationIds: [...ids], at,
    }],
  };
}