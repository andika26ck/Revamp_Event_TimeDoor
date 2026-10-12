// Pure local-demo transactions. Production authorization/payment is NOT simulated as real.
export const DEMO_NOW='2026-09-28T03:00:00.000Z'; // 10:00 Asia/Jakarta
export const ROOM_CAPACITY={'Bill Gates':25,'Leon Musk':20,'Jeff Bezos':15};
export const nowOf=db=>Date.parse(db.demoNow||DEMO_NOW);
export const startOf=s=>Date.parse(`${s.date}T${s.start}:00+07:00`);
export const endOf=s=>Date.parse(`${s.date}T${s.end}:00+07:00`);
export const recorded=a=>!!a&&((a.presence&&a.presence!=='Not Recorded')||Number(a.late)>0||!!a.note?.trim()||!!a.journal?.trim());
export const liveMember=m=>m.state!=='Transferred Out';
export const TRANSFER_TYPES=['Trial','Workshop','Bootcamp'];
export const currencyOf=e=>e.currency||'IDR';
export const canSetDemoAmount=m=>m.origin==='Manual demo'&&liveMember(m)&&m.state!=='Reserved'&&!m.transferId&&!m.session&&m.paymentStatus!=='Paid';
export function simulatedMember(student,event){
 const amount=Number(event.price??0);
 if(!Number.isFinite(amount)||amount<0)throw new Error('A valid event price is required for the simulation.');
 return {...student,session:null,origin:'Manual demo',state:'Active',paidAmount:amount,paymentStatus:'Simulated',demoPayment:true};
}
export function setDemoAppliedAmount(db,eventId,studentId,amount){
 const e=db.events.find(e=>e.id===eventId),m=e?.members.find(m=>m.id===studentId);
 if(!m||!canSetDemoAmount(m))throw new Error('Only an unlinked manual demo registration can use this simulation action.');
 if(typeof amount!=='number'||!Number.isFinite(amount)||amount<0)throw new Error('Enter a non-negative simulated amount.');
 return {...db,events:db.events.map(v=>v.id!==eventId?v:{...v,members:v.members.map(n=>n.id!==studentId?n:{...n,state:'Active',paidAmount:amount,paymentStatus:'Simulated',demoPayment:true})}),audit:[...(db.audit||[]),{action:'Simulated applied amount set — no real payment',event:eventId,studentId,amount,at:db.demoNow||DEMO_NOW}]};
}
export const seatCount=e=>e.members.filter(liveMember).length;
export const overlaps=(a,b)=>startOf(a)<endOf(b)&&startOf(b)<endOf(a);
export const formatMoment=ms=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'}).format(new Date(ms));
export function rescheduleEligibility(db,e,s){
 if(!s||s.status!=='Upcoming')return 'Only an upcoming schedule can be rescheduled.';
 if(Object.values(s.attendance||{}).some(recorded))return 'Attendance has already been recorded for this schedule.';
 if(nowOf(db)>=startOf(s)-2*3600000)return 'The reschedule cutoff has passed (2 hours before the original start).';
 return '';
}
export function rescheduleErrors(db,eventId,scheduleId,draft){
 const e=db.events.find(e=>e.id===eventId),s=e?.schedules.find(s=>s.id===scheduleId);if(!s)return ['Schedule not found.'];
 const errors=[];const eligible=rescheduleEligibility(db,e,s);if(eligible)errors.push(eligible);
 if(!draft.date||!draft.start||!draft.end||!Number.isFinite(startOf(draft))||endOf(draft)<=startOf(draft))errors.push('Enter a valid date and an end time after the start time.');
 if(!draft.room||!draft.teacher)errors.push('Room and main teacher are required.');
 if(!draft.reason?.trim())errors.push('A reschedule reason is required.');
 if(startOf(draft)<=nowOf(db))errors.push('The new schedule must start in the future.');
 if(['date','start','end','room','teacher'].every(k=>s[k]===draft[k]))errors.push('Change at least one schedule field before continuing.');
 const count=(s.assigned||[]).length;if(count>(ROOM_CAPACITY[draft.room]||0))errors.push(`The room cannot accommodate ${count} assigned participants.`);
 if(Number.isFinite(startOf(draft))&&endOf(draft)>startOf(draft))for(const other of db.events){for(const t of other.schedules){
  if(t.id===s.id||t.status==='Dropped'||!overlaps(draft,t))continue;
  const context=`${other.name} · ${t.date} ${t.start}–${t.end}`;
  if(other.id===e.id)errors.push('Event schedule overlaps: '+context);
  else if(t.room===draft.room)errors.push('Room is occupied: '+context);
  else if(t.teacher===draft.teacher)errors.push('Teacher is occupied: '+context);
  else if(t.assigned?.some(id=>s.assigned?.includes(id)))errors.push('An assigned student has another schedule: '+context);
 }}
 return [...new Set(errors)];
}
export function commitReschedule(db,eventId,scheduleId,draft){
 const errors=rescheduleErrors(db,eventId,scheduleId,draft);if(errors.length)throw new Error(errors.join(' '));
 const e=db.events.find(e=>e.id===eventId),s=e.schedules.find(s=>s.id===scheduleId);const id='RSC-'+Date.now();
 const record={id,eventId,scheduleId,at:db.demoNow||DEMO_NOW,author:'Demo Admin',before:Object.fromEntries(['date','start','end','room','teacher'].map(k=>[k,s[k]])),after:Object.fromEntries(['date','start','end','room','teacher'].map(k=>[k,draft[k]])),reason:draft.reason.trim(),notify:!!draft.notify,participants:[...s.assigned]};
 return {...db,events:db.events.map(v=>v.id!==eventId?v:{...v,schedules:v.schedules.map(t=>t.id!==scheduleId?t:{...t,...record.after,rescheduleCount:(t.rescheduleCount||0)+1,history:[...(t.history||[]),record]})}),audit:[...(db.audit||[]),{action:'Reschedule committed',event:eventId,schedule:scheduleId,at:record.at}],notifications:[...(db.notifications||[]),...(draft.notify?[{id:'NTF-'+id,type:'Reschedule',recordId:id,status:'Demo queued',recipients:[...s.assigned],at:record.at}]:[])]};
}
export function memberEligibility(db,e,m){
 if(!liveMember(m))return {kind:'blocked',reason:'Already transferred out.'};
 if(m.state==='Reserved')return {kind:'blocked',reason:'Additional payment is still pending.'};
 if(!TRANSFER_TYPES.includes(e.type))return {kind:'blocked',reason:'Student transfers are available only for Trial, Workshop and Bootcamp. PTM and Internal Meeting are excluded.'};
 const schedules=e.schedules.filter(s=>s.status!=='Dropped'&&s.assigned.includes(m.id));
 if(schedules.length!==1)return {kind:'blocked',reason:schedules.length?'Assigned to multiple schedules; entitlement review is needed.':'Assign this participant to one source schedule first.'};
 const s=schedules[0],a=s.attendance?.[m.id];
 if(a?.presence==='Present'||a?.presence==='Late'||Number(a?.late)>0||a?.journal?.trim())return {kind:'blocked',reason:'Present, late, or received the event benefit.',schedule:s};
 if(!Number.isFinite(m.paidAmount)||m.paidAmount<0||!(m.paymentStatus==='Paid'||(m.paymentStatus==='Simulated'&&m.demoPayment===true&&m.origin==='Manual demo')))return {kind:'blocked',reason:'A verified applied payment amount is required.',schedule:s};
 if(a?.presence==='Absent')return (db.oneTimeMoves||[]).includes(m.id)?{kind:'blocked',reason:'The one-time absence allowance has already been used.',schedule:s}:{kind:'conditional',reason:'Absent · confirmation required',schedule:s};
 if(recorded(a))return {kind:'blocked',reason:'Attendance record requires staff review.',schedule:s};
 return {kind:'eligible',reason:'No attendance recorded',schedule:s};
}
export function sourceFor(db,eventId,ids){
 const e=db.events.find(e=>e.id===eventId);if(!e)return {errors:['Source event not found.']};
 const members=ids.map(id=>e.members.find(m=>m.id===id));const checks=members.map(m=>m?memberEligibility(db,e,m):{kind:'blocked',reason:'Participant no longer registered.'});
 const errors=[];if(!ids.length)errors.push('Select at least one participant.');if(new Set(ids).size!==ids.length)errors.push('Duplicate participant selection.');
 checks.forEach((c,i)=>{if(c.kind==='blocked')errors.push(`${members[i]?.name||ids[i]}: ${c.reason}`)});
 const scheduleIds=[...new Set(checks.map(c=>c.schedule?.id).filter(Boolean))];if(scheduleIds.length!==1)errors.push('A batch must use one source schedule.');
 return {e,members,checks,schedule:e.schedules.find(s=>s.id===scheduleIds[0]),errors};
}
export function destinations(db,sourceId,ids){
 const src=sourceFor(db,sourceId,ids);if(!src.e||!TRANSFER_TYPES.includes(src.e.type))return [];
 return db.events.filter(e=>e.id!==sourceId&&TRANSFER_TYPES.includes(e.type)&&(e.branch||'HQ Training')===(src.e.branch||'HQ Training')&&currencyOf(e)===currencyOf(src.e)).flatMap(e=>e.schedules.filter(s=>e.active&&s.status==='Upcoming'&&startOf(s)>nowOf(db)).map(s=>{
  const reasons=[];const seats=(e.capacity??25)-seatCount(e);
  if(!e.active||s.status!=='Upcoming'||startOf(s)<=nowOf(db))reasons.push('Not an available upcoming destination.');
  if(seats<ids.length)reasons.push(`Only ${Math.max(0,seats)} seats; requires ${ids.length}.`);
  if(e.members.some(m=>liveMember(m)&&ids.includes(m.id)))reasons.push('A selected participant is already registered here.');
  if(!Number.isFinite(e.price)||e.price<0)reasons.push('Destination price is not defined.');
  if(ids.length+s.assigned.length>(ROOM_CAPACITY[s.room]||0))reasons.push('Room capacity is insufficient.');
  for(const other of db.events)for(const t of other.schedules){if(t.id===src.schedule?.id||t.id===s.id||t.status==='Dropped')continue;if(t.assigned.some(id=>ids.includes(id))&&overlaps(s,t))reasons.push('A selected student has a conflicting assignment.');}
  return {event:e,schedule:s,seats,reasons:[...new Set(reasons)],key:e.id+'/'+s.id};
 })).sort((a,b)=>startOf(a.schedule)-startOf(b.schedule));
}
export function moveErrors(db,draft){
 const src=sourceFor(db,draft.sourceId,draft.ids);const errors=[...src.errors];
 for(let i=0;i<(src.checks||[]).length;i++)if(src.checks[i].kind==='conditional'){
  const confirmation=draft.absent?.[src.members[i].id];if(!confirmation?.confirmed||!confirmation.reason?.trim())errors.push(`Confirm non-attendance and enter a reason for ${src.members[i].name}.`);
 }
 const dest=destinations(db,draft.sourceId,draft.ids).find(x=>x.key===draft.destination);if(!dest)errors.push('Choose a compatible destination.');else errors.push(...dest.reasons);
 if(!draft.reason?.trim())errors.push('A transfer reason is required.');return [...new Set(errors)];
}
export function outcomes(db,draft){const src=sourceFor(db,draft.sourceId,draft.ids),dest=destinations(db,draft.sourceId,draft.ids).find(x=>x.key===draft.destination);if(!dest)return [];
 return src.members.filter(Boolean).map(m=>({member:m,applied:m.paidAmount,price:dest.event.price,delta:dest.event.price-m.paidAmount,status:dest.event.price>m.paidAmount?'Reserved':'Active',conditional:src.checks[src.members.indexOf(m)]?.kind==='conditional'}));}
export function commitMove(db,draft){
 const errors=moveErrors(db,draft);if(errors.length)throw new Error(errors.join(' '));
 const src=sourceFor(db,draft.sourceId,draft.ids),dest=destinations(db,draft.sourceId,draft.ids).find(x=>x.key===draft.destination),rows=outcomes(db,draft),stamp=Date.now(),batchId='BATCH-'+stamp;
 const at=db.demoNow||DEMO_NOW,copy=s=>Object.fromEntries(['id','date','start','end','room','teacher'].map(k=>[k,s[k]]));
 const transfers=rows.map((o,i)=>({id:`TRF-${stamp}-${i+1}`,batchId,student:{...o.member},sourceId:src.e.id,sourceName:src.e.name,sourceType:src.e.type,sourceBook:src.e.book,sourceLanguage:src.e.language,sourceSchedule:copy(src.schedule),destinationId:dest.event.id,destinationName:dest.event.name,destinationType:dest.event.type,destinationBook:dest.event.book,destinationLanguage:dest.event.language,destinationSchedule:copy(dest.schedule),applied:o.applied,price:o.price,delta:o.delta,status:o.status,reason:draft.reason.trim(),note:draft.note||'',absent:o.conditional?draft.absent[o.member.id]:null,oneTimeUsed:o.conditional,notify:!!draft.notify,at,author:'Demo Admin',invoiceId:o.delta>0?`INV-ADJ-${stamp}-${i+1}`:null,valueId:o.delta<0?`EVV-${stamp}-${i+1}`:null}));
 const next={...db,events:db.events.map(e=>{
  if(e.id===src.e.id)return {...e,members:e.members.map(m=>draft.ids.includes(m.id)?{...m,state:'Transferred Out',transferId:transfers.find(t=>t.student.id===m.id).id}:m),schedules:e.schedules.map(s=>s.id===src.schedule.id?{...s,assigned:s.assigned.filter(id=>!draft.ids.includes(id))}:s)};
  if(e.id===dest.event.id)return {...e,members:[...e.members,...transfers.map(t=>({...t.student,state:t.status,origin:'Transfer',transferId:t.id,paymentStatus:t.delta>0?'Adjustment Pending':'Paid',paidAmount:Math.min(t.applied,t.price)}))],schedules:e.schedules.map(s=>s.id===dest.schedule.id?{...s,assigned:[...s.assigned,...draft.ids]}:s)};return e;
 }),transfers:[...(db.transfers||[]),...transfers],batches:[...(db.batches||[]),{id:batchId,sourceId:src.e.id,destinationId:dest.event.id,destinationName:dest.event.name,destinationType:dest.event.type,destinationBook:dest.event.book,destinationLanguage:dest.event.language,destinationSchedule:copy(dest.schedule),beforeSeats:dest.seats,afterSeats:dest.seats-draft.ids.length,ids:transfers.map(t=>t.id),at,notify:!!draft.notify}],invoices:[...(db.invoices||[]),...transfers.filter(t=>t.invoiceId).map(t=>({id:t.invoiceId,transferId:t.id,amount:t.delta,status:'Pending',at}))],eventValues:[...(db.eventValues||[]),...transfers.filter(t=>t.valueId).map(t=>({id:t.valueId,transferId:t.id,studentId:t.student.id,amount:-t.delta,status:'Available for eligible future event',at}))],oneTimeMoves:[...new Set([...(db.oneTimeMoves||[]),...transfers.filter(t=>t.oneTimeUsed).map(t=>t.student.id)])],audit:[...(db.audit||[]),{action:'Participant batch committed',batchId,at}],notifications:[...(db.notifications||[]),...(draft.notify?[{id:'NTF-'+batchId,type:'Transfer',recordId:batchId,recipients:draft.ids,status:'Demo queued',at}]:[])]};
 return {db:next,batchId};
}
export function verifyDemoPayment(db,invoiceId,reference,authorized){
 if(!authorized)throw new Error('Demo finance authorization is required.');if(!reference.trim())throw new Error('Enter a demo verification reference.');const invoice=db.invoices.find(i=>i.id===invoiceId);if(!invoice||invoice.status!=='Pending')throw new Error('This invoice is no longer pending.');
 const t=db.transfers.find(t=>t.id===invoice.transferId);const at=db.demoNow||DEMO_NOW;
 return {...db,invoices:db.invoices.map(i=>i.id===invoiceId?{...i,status:'Paid (demo)',reference,verifiedBy:'Demo Finance',verifiedAt:at}:i),transfers:db.transfers.map(v=>v.id===t.id?{...v,status:'Active'}:v),events:db.events.map(e=>e.id===t.destinationId?{...e,members:e.members.map(m=>m.transferId===t.id?{...m,state:'Active',paymentStatus:'Paid',paidAmount:t.price}:m)}:e),audit:[...(db.audit||[]),{action:'Demo adjustment payment verified',invoiceId,at}]};
}
export function csvDownload(filename,rows){const text=rows.map(r=>r.map(v=>{let s=String(v??'');if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
