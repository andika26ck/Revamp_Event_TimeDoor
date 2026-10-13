import {students} from './data.js';
import {DEMO_NOW} from './movement.js';
export function enrichSeed(db){
 db={...db,demoNow:DEMO_NOW,transfers:[],batches:[],invoices:[],eventValues:[],oneTimeMoves:[],notifications:[]};
 db.events=db.events.map(e=>({...e,capacity:25,branch:'HQ Training',members:e.members.map(m=>({...m,state:'Active',paidAmount:e.price??0,paymentStatus:'Paid'}))}));
 const pool=[...students.slice(0,3),{id:'STD-004',name:'Siti Rahmawati',parent:'Joko Rahmawati',phone:'0800000004',age:10,session:'SES-004'},{id:'STD-005',name:'Dimas Anggara',parent:'Hendra Anggara',phone:'0800000005',age:9,session:'SES-005'}];
 const make=(id,name,price,date,capacity=25,roster=[],status='Upcoming')=>({id,name,type:'Workshop',book:'Digital Literacy Workshop',language:'ID',branch:'HQ Training',price,active:true,capacity,members:roster,formEnabled:false,schedules:[{id:id+'-S1',date,start:'13:00',end:'15:00',room:'Bill Gates',teacher:'Nimas Sekararum Kinanthi',status,assigned:roster.map(m=>m.id),attendance:{}}]});
 const sourceRoster=pool.map((m,i)=>({...m,state:'Active',paidAmount:[350000,250000,500000,350000,350000][i],paymentStatus:'Paid'}));
 const up=make('EV-MOVE','Digital Literacy Workshop — Upcoming',350000,'2026-09-28',25,sourceRoster);up.schedules.push({...up.schedules[0],id:'EV-MOVE-S2',date:'2026-10-05',assigned:[]},{...up.schedules[0],id:'EV-MOVE-S3',date:'2026-10-12',room:'Jeff Bezos',teacher:'Mr. Dewa',assigned:[]});
 const ended=make('EV-ENDED','Digital Literacy Workshop — Ended',350000,'2026-09-21',25,sourceRoster.map(m=>({...m})),'Finished');ended.schedules[0].attendance={'STD-002':{presence:'Absent',late:0,note:'Unable to attend',journal:''},'STD-004':{presence:'Present',late:0,note:'',journal:''},'STD-005':{presence:'Present',late:15,note:'Arrived late',journal:''}};
 const dest=make('EV-DEST','Digital Literacy Workshop — Session 2',350000,'2026-10-05',8,Array.from({length:3},(_,i)=>({id:'STD-D'+i,name:'Demo Existing '+(i+1),parent:'Demo Guardian',phone:'080000003'+i,age:10,session:'SES-D'+i,state:'Active',paidAmount:350000,paymentStatus:'Paid'})));dest.schedules[0].room='Leon Musk';dest.schedules[0].teacher='Octa Travelian Purnomo';
 const adv=make('EV-ADV','Advanced Digital Workshop',500000,'2026-10-12',7);adv.schedules[0].room='Leon Musk';adv.schedules[0].teacher='Octa Travelian Purnomo';
 const art=make('EV-ART','Introduction to Digital Art',250000,'2026-10-19',2);art.schedules[0].room='Jeff Bezos';art.schedules[0].teacher='Mr. Dewa';
 db.events=[...db.events,up,ended,dest,adv,art];return db;
}
