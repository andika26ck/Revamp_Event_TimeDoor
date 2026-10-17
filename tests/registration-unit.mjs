import assert from 'node:assert/strict';
import {seed} from '../lib/data.js';
import {enrichSeed} from '../lib/scenarios.js';
import {
  upgradeRegistrationWorkflow, submitWorkshopRegistration,
  confirmWorkshopRegistrations, registrationConfirmationErrors,
  availableRegistrationSeats,
} from '../lib/registration.js';

let checks=0;
const check=(name,fn)=>{fn();checks++;};
function fresh(){
  const db=upgradeRegistrationWorkflow(enrichSeed(seed()));
  db.events.find(e=>e.id==='EV-DEST').formEnabled=true;
  return db;
}
const applicant=(name='Applicant One',phone='08123456780')=>({name,phone,age:12});
function drafts(db=fresh(),count=2){
  for(let i=0;i<count;i++)
    db=submitWorkshopRegistration(db,'EV-DEST',applicant('Applicant '+i,'0812345678'+i));
  return db;
}
const pendingIds=db=>db.registrations.filter(r=>r.status==='Pending').map(r=>r.id);

check('Submission creates Pending only and preserves every event',()=>{
  const db=fresh(),before=structuredClone(db),next=submitWorkshopRegistration(db,'EV-DEST',applicant());
  assert.deepEqual(db,before);
  assert.deepEqual(next.events,before.events);
  assert.equal(next.registrations[0].status,'Pending');
  assert.equal(next.invoices.length,0);
});
check('Pending does not consume seats',()=>{
  const db=fresh(),next=drafts(db,6);
  assert.equal(availableRegistrationSeats(db.events.find(e=>e.id==='EV-DEST')),5);
  assert.equal(availableRegistrationSeats(next.events.find(e=>e.id==='EV-DEST')),5);
});
check('Duplicate pending normalizes name and Indonesian phone',()=>{
  let db=submitWorkshopRegistration(fresh(),'EV-DEST',applicant());
  assert.throws(()=>submitWorkshopRegistration(db,'EV-DEST',{name:'  APPLICANT   ONE ',phone:'+62 812-3456-780',age:12}),/pending/);
});
check('Existing participant cannot register again',()=>{
  const db=fresh(),m=db.events.find(e=>e.id==='EV-DEST').members[0];
  assert.throws(()=>submitWorkshopRegistration(db,'EV-DEST',m),/terdaftar/);
});
check('Reject invalid age, phone and blank name',()=>{
  for(const row of [{...applicant(),age:''},{...applicant(),age:-1},{...applicant(),age:1.5},
    {...applicant(),phone:'123'},{...applicant(),name:' '}]){
    assert.throws(()=>submitWorkshopRegistration(fresh(),'EV-DEST',row));
  }
});
check('Workshop enabled-form guard',()=>{
  const db=fresh();
  assert.throws(()=>submitWorkshopRegistration(db,'EV-001',applicant()),/not available/);
  db.events.find(e=>e.id==='EV-DEST').formEnabled=false;
  assert.throws(()=>submitWorkshopRegistration(db,'EV-DEST',applicant()),/not available/);
});
check('Bulk confirmation creates students and keeps submission history',()=>{
  const db=drafts(),before=structuredClone(db),next=confirmWorkshopRegistrations(db,'EV-DEST',pendingIds(db));
  assert.deepEqual(db,before);
  assert.equal(next.events.find(e=>e.id==='EV-DEST').members.length,5);
  assert.ok(next.registrations.every(r=>r.status==='Confirmed'&&r.confirmedBy==='Demo Admin'));
  assert.equal(next.audit.at(-1).registrationIds.length,2);
});
check('Confirmation creates no assignment, financial record or purchase session',()=>{
  const db=drafts(),next=confirmWorkshopRegistrations(db,'EV-DEST',pendingIds(db));
  assert.deepEqual(next.events.find(e=>e.id==='EV-DEST').schedules,db.events.find(e=>e.id==='EV-DEST').schedules);
  for(const key of ['invoices','eventValues','transfers','batches','notifications'])assert.deepEqual(next[key],db[key]);
  const added=next.events.find(e=>e.id==='EV-DEST').members.slice(-2);
  assert.ok(added.every(m=>m.session===null&&m.paymentStatus==='Unverified'&&m.paidAmount===undefined));
});
check('One selected submission leaves the rest pending',()=>{
  const db=drafts(),next=confirmWorkshopRegistrations(db,'EV-DEST',[pendingIds(db)[0]]);
  assert.equal(next.registrations.filter(r=>r.status==='Pending').length,1);
  assert.equal(next.registrations.filter(r=>r.status==='Confirmed').length,1);
});
check('Exact remaining capacity accepted',()=>{
  const db=drafts(fresh(),5),next=confirmWorkshopRegistrations(db,'EV-DEST',pendingIds(db));
  assert.equal(availableRegistrationSeats(next.events.find(e=>e.id==='EV-DEST')),0);
});
check('Over-capacity blocks entire batch without writes',()=>{
  const db=drafts(fresh(),6),before=structuredClone(db);
  assert.throws(()=>confirmWorkshopRegistrations(db,'EV-DEST',pendingIds(db)),/Only 5 seats/);
  assert.deepEqual(db,before);
});
check('Reserved participants count against capacity',()=>{
  const db=drafts(),event=db.events.find(e=>e.id==='EV-DEST');
  event.members.push({id:'RES',name:'Reserved',state:'Reserved'});
  event.capacity=5;
  assert.throws(()=>confirmWorkshopRegistrations(db,'EV-DEST',pendingIds(db)),/Only 1 seats/);
});
check('Capacity is revalidated at final commit',()=>{
  const db=drafts(),ids=pendingIds(db);
  assert.deepEqual(registrationConfirmationErrors(db,'EV-DEST',ids),[]);
  db.events.find(e=>e.id==='EV-DEST').capacity=3;
  assert.throws(()=>confirmWorkshopRegistrations(db,'EV-DEST',ids),/Only 0 seats/);
});
check('Duplicate added through another path blocks full batch',()=>{
  const db=drafts(),row=db.registrations[0],event=db.events.find(e=>e.id==='EV-DEST');
  event.members.push({id:'IMPORT',name:row.name,phone:row.phone,state:'Active'});
  const before=structuredClone(db);
  assert.throws(()=>confirmWorkshopRegistrations(db,'EV-DEST',pendingIds(db)),/already exists/);
  assert.deepEqual(db,before);
});
check('Cannot confirm twice',()=>{
  const db=drafts(),ids=pendingIds(db),next=confirmWorkshopRegistrations(db,'EV-DEST',ids);
  assert.throws(()=>confirmWorkshopRegistrations(next,'EV-DEST',ids),/no longer pending/);
});
check('Empty, duplicate, missing and cross-event selections rejected',()=>{
  const db=drafts(),id=pendingIds(db)[0];
  for(const ids of [[],[id,id],['MISSING']])
    assert.ok(registrationConfirmationErrors(db,'EV-DEST',ids).length);
  assert.throws(()=>confirmWorkshopRegistrations(db,'EV-MOVE',[id]),/no longer belongs/);
  assert.throws(()=>confirmWorkshopRegistrations(db,'EV-001',[id]),/Workshop only/);
});
check('Duplicate identity inside corrupted batch rejected',()=>{
  const db=drafts();
  db.registrations[1]={...db.registrations[0],id:db.registrations[1].id};
  assert.throws(()=>confirmWorkshopRegistrations(db,'EV-DEST',pendingIds(db)),/duplicate participant/);
});
check('Legacy linked submissions preserved as Confirmed without touching members',()=>{
  const db=enrichSeed(seed()),event=db.events.find(e=>e.id==='EV-DEST');
  event.members.push({id:'REG-OLD',...applicant(),origin:'Registration form',session:null});
  event.schedules[0].assigned.push('REG-OLD');
  db.registrations=[{id:'REG-OLD',eventId:event.id,...applicant(),status:'Submitted'}];
  const before=structuredClone(db),next=upgradeRegistrationWorkflow(db);
  assert.equal(next.registrations[0].status,'Confirmed');
  assert.equal(next.registrations[0].legacyConfirmed,true);
  assert.deepEqual(next.events,before.events);
  assert.deepEqual(db,before);
  assert.equal(upgradeRegistrationWorkflow(next),next);
});
check('Legacy unlinked submissions become Pending',()=>{
  const db=enrichSeed(seed());
  db.registrations=[{id:'REG-OLD',eventId:'EV-DEST',...applicant(),status:'Submitted'}];
  const next=upgradeRegistrationWorkflow(db);
  assert.equal(next.registrations[0].status,'Pending');
});
check('Confirmed history blocks repeat public submission',()=>{
  let db=submitWorkshopRegistration(fresh(),'EV-DEST',applicant());
  db=confirmWorkshopRegistrations(db,'EV-DEST',pendingIds(db));
  assert.throws(()=>submitWorkshopRegistration(db,'EV-DEST',applicant()),/terdaftar/);
});
check('Unrelated event and pending application preserved',()=>{
  const db=drafts(),other=db.events.find(e=>e.id==='EV-MOVE');
  other.formEnabled=true;
  const next=submitWorkshopRegistration(db,other.id,applicant('Other','08999999999'));
  const result=confirmWorkshopRegistrations(next,'EV-DEST',pendingIds(db));
  assert.deepEqual(result.events.find(e=>e.id===other.id),other);
  assert.equal(result.registrations.at(-1).status,'Pending');
});
console.log(`PASS: ${checks} workshop registration transaction checks`);