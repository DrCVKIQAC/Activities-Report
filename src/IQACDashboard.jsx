import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from "recharts";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const COLLEGE = {
  name:        "SKR & SKR Government College for Women (Autonomous), Kadapa",
  nameShort:   "SKR & SKR GCW (A), Kadapa",
  principal:   "Dr. V. Saleem Basha",
  coordinator: "Dr. C.V. Krishnaveni",
  coordDept:   "Department of Computer Science",
  iqacEmail:   "iqac.nirf.gdcw.kdp@gmail.com",
  naacGrade:   "B",
  naacScore:   "2.46",
  naacValidity:"07/07/2028",
  established: "1973",
  googleForm:  "https://docs.google.com/forms/d/e/1FAIpQLSe5br0NYK4GdWst_aWypuBckpiuCar8AwyD-APEegMjPLoEcg/viewform",
};

const DEPARTMENTS = [
  "Chemistry","Physics","Mathematics","Botany","Zoology","Biotechnology",
  "Computer Science","Commerce","Economics","History","Telugu","Hindi",
  "English","Urdu","Political Science","Library & Information Science",
  "Physical Education","IQAC / Administration",
];

const ACTIVITY_TYPES = [
  "Workshop / Seminar","Guest Lecture","NSS / NCC Activity","Certificate Course",
  "Placement Drive","Sports / Cultural Event","Research Publication",
  "Faculty Development Programme","Industry / Educational Visit",
  "Community Service Project","Webinar","Alumni Activity","Skill Development",
  "Extension Activity","Gender Awareness","Environmental Activity",
  "Career Guidance","Induction Programme","NAAC / NIRF Activity",
];

const ACADEMIC_YEARS = ["2020-21","2021-22","2022-23","2023-24","2024-25","2025-26"];
const LEVELS = ["Institution","Department","State","National","International"];

const C = {
  navy:"#1A3A5C", gold:"#C8860A", crimson:"#8B1A1A",
  green:"#166534", teal:"#0E7490", purple:"#6B21A8",
  bg:"#F4F0E6", card:"#FFFFFF", border:"#E8E0CC", muted:"#64748B",
};

const PIE_COLORS = [
  "#C8860A","#1A3A5C","#8B1A1A","#166534","#6B21A8","#0E7490",
  "#9D5A00","#1E40AF","#BE123C","#065F46","#92400E","#1D4ED8",
  "#9F1239","#064E3B","#581C87","#7C2D12","#134E4A","#312E81",
];

// ─── SEED DATA ──────────────────────────────────────────────────────────────
const SEED = [
  {id:1,faculty:"IQAC Cell",department:"IQAC / Administration",inchargeEmail:"",type:"Webinar",title:"National Webinar on PO-CO Mapping",date:"2023-10-06",academicYear:"2023-24",level:"National",participants:120,facultyCount:8,venue:"Online",description:"National webinar on PO-CO mapping conducted for all departments",outcome:"Faculty awareness on OBE significantly improved",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-10-06T10:00:00"},
  {id:2,faculty:"Dr. A. Padmavathi",department:"Chemistry",inchargeEmail:"",type:"Webinar",title:"Chemistry in Daily Life – Breakfast to Bed",date:"2023-12-02",academicYear:"2023-24",level:"Institution",participants:85,facultyCount:5,venue:"Chemistry Lab",description:"Webinar on Chemistry in daily life applications",outcome:"Student awareness about applied chemistry enhanced",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-12-02T10:00:00"},
  {id:3,faculty:"IQAC Cell",department:"IQAC / Administration",inchargeEmail:"",type:"Workshop / Seminar",title:"Research Management System Workshop",date:"2023-09-29",academicYear:"2023-24",level:"Institution",participants:57,facultyCount:57,venue:"Seminar Hall",description:"Workshop on research management system for all staff",outcome:"Research documentation skills improved",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-09-29T10:00:00"},
  {id:4,faculty:"IQAC Cell",department:"IQAC / Administration",inchargeEmail:"",type:"Faculty Development Programme",title:"FDP with ACT Academy Kerala",date:"2023-12-27",academicYear:"2023-24",level:"National",participants:45,facultyCount:45,venue:"Online",description:"One week online FDP on Pedagogical Innovations in Higher Education",outcome:"Teaching pedagogy enhanced",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-12-27T10:00:00"},
  {id:5,faculty:"NSS Unit",department:"Physical Education",inchargeEmail:"",type:"NSS / NCC Activity",title:"NSS Special Camp – Ramana Palli Village",date:"2024-02-01",academicYear:"2023-24",level:"Institution",participants:120,facultyCount:10,venue:"Ramana Palli",description:"7-day NSS special camp: plantation, health camp, literacy survey",outcome:"120 students developed social responsibility",photo1:"",photo2:"",lat:"14.4673","lng":"78.8242",reportSent:false,submittedAt:"2024-02-01T10:00:00"},
  {id:6,faculty:"IQAC Cell",department:"IQAC / Administration",inchargeEmail:"",type:"Induction Programme",title:"Student Induction Programme 2023",date:"2023-08-16",academicYear:"2023-24",level:"Institution",participants:500,facultyCount:30,venue:"College Auditorium",description:"Student induction from 16-08-2023 to 07-09-2023",outcome:"500+ students oriented to college culture",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-08-16T10:00:00"},
  {id:7,faculty:"NCC Unit",department:"Physical Education",inchargeEmail:"",type:"NSS / NCC Activity",title:"Blood Donation Camp",date:"2023-11-29",academicYear:"2023-24",level:"Institution",participants:50,facultyCount:10,venue:"College Campus",description:"NCC-organised blood donation camp on campus",outcome:"Community health supported",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-11-29T10:00:00"},
  {id:8,faculty:"IQAC Cell",department:"IQAC / Administration",inchargeEmail:"",type:"Webinar",title:"AI Tools for Research Paper Writing",date:"2024-01-15",academicYear:"2023-24",level:"National",participants:80,facultyCount:25,venue:"Online – IETE Hyderabad",description:"Webinar on AI tools for research conducted by IETE Hyderabad",outcome:"Faculty equipped with AI-assisted research writing skills",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2024-01-15T10:00:00"},
  {id:9,faculty:"Placement Cell",department:"Computer Science",inchargeEmail:"",type:"Placement Drive",title:"Campus Placement Drives – 11 Companies",date:"2024-01-20",academicYear:"2023-24",level:"Institution",participants:349,facultyCount:5,venue:"Placement Cell",description:"11 on/off campus drives conducted throughout the year",outcome:"349 students secured employment",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2024-01-20T10:00:00"},
  {id:10,faculty:"Women Empowerment Cell",department:"Political Science",inchargeEmail:"",type:"Gender Awareness",title:"Rally on Girl Child Education",date:"2023-12-13",academicYear:"2023-24",level:"Institution",participants:30,facultyCount:15,venue:"Campus & Surroundings",description:"Rally to raise awareness about girl child education",outcome:"Community sensitization",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-12-13T10:00:00"},
  {id:11,faculty:"Dr. S. Nagamani",department:"Zoology",inchargeEmail:"",type:"NSS / NCC Activity",title:"World AIDS Day Celebration",date:"2023-12-01",academicYear:"2023-24",level:"Institution",participants:70,facultyCount:20,venue:"Seminar Hall",description:"World AIDS Day awareness programme",outcome:"Students sensitized on HIV/AIDS prevention",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-12-01T10:00:00"},
  {id:12,faculty:"Dr. T. Kavitha",department:"Biotechnology",inchargeEmail:"",type:"Certificate Course",title:"Certificate Course in Biotechnology",date:"2023-08-01",academicYear:"2023-24",level:"Institution",participants:45,facultyCount:4,venue:"Biotechnology Lab",description:"Semester-long certificate course in Biotechnology",outcome:"45 students gained additional skill certification",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-08-01T10:00:00"},
  {id:13,faculty:"Dr. R. Hymavathi",department:"Mathematics",inchargeEmail:"",type:"Certificate Course",title:"Certificate Course in Mathematics",date:"2023-08-01",academicYear:"2023-24",level:"Institution",participants:55,facultyCount:3,venue:"Mathematics Department",description:"Certificate course in advanced Mathematics",outcome:"Mathematical skills improved",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-08-01T10:00:00"},
  {id:14,faculty:"Mathematics Dept",department:"Mathematics",inchargeEmail:"",type:"Sports / Cultural Event",title:"National Mathematics Day Celebration",date:"2023-12-22",academicYear:"2023-24",level:"Institution",participants:80,facultyCount:30,venue:"College Auditorium",description:"National Mathematics Day celebration with competitions",outcome:"Math enthusiasm increased",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-12-22T10:00:00"},
  {id:15,faculty:"Dr. P. Sunitha",department:"Botany",inchargeEmail:"",type:"Environmental Activity",title:"Swachh Bharat Campus Cleanliness Drive",date:"2023-11-18",academicYear:"2023-24",level:"Institution",participants:30,facultyCount:3,venue:"Campus",description:"Swachh Bharat programme – campus cleanliness",outcome:"Clean campus; environmental responsibility",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-11-18T10:00:00"},
  {id:16,faculty:"Dr. K. Vimala",department:"Commerce",inchargeEmail:"",type:"Certificate Course",title:"Certificate Course in Tally & Accounting",date:"2023-09-01",academicYear:"2023-24",level:"Institution",participants:60,facultyCount:3,venue:"Commerce Department",description:"Certificate course in Tally ERP and accounting",outcome:"60 students gained accounting skills",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-09-01T10:00:00"},
  {id:17,faculty:"Dr. M. Rajani",department:"English",inchargeEmail:"",type:"Workshop / Seminar",title:"Communication Skills Enhancement Workshop",date:"2023-10-15",academicYear:"2023-24",level:"Institution",participants:100,facultyCount:6,venue:"English Department",description:"Workshop on professional communication skills",outcome:"English communication confidence improved",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-10-15T10:00:00"},
  {id:18,faculty:"NSS Unit",department:"Physical Education",inchargeEmail:"",type:"Environmental Activity",title:"Tree Plantation Drive – Vanam Manam",date:"2023-07-24",academicYear:"2023-24",level:"Institution",participants:150,facultyCount:12,venue:"Campus & Surroundings",description:"Plantation programme as part of Vanam Manam initiative",outcome:"150+ trees planted",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2023-07-24T10:00:00"},
  {id:19,faculty:"Dr. S. Khadar Basha",department:"Urdu",inchargeEmail:"",type:"Workshop / Seminar",title:"National Seminar on Urdu",date:"2024-11-11",academicYear:"2024-25",level:"National",participants:80,facultyCount:20,venue:"Seminar Hall",description:"National level seminar promoting Urdu literature",outcome:"National-level academic exchange",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2024-11-11T10:00:00"},
  {id:20,faculty:"IQAC Cell",department:"IQAC / Administration",inchargeEmail:"",type:"Faculty Development Programme",title:"SEL and SEEK Programme – NRC Activities",date:"2024-08-09",academicYear:"2024-25",level:"Institution",participants:40,facultyCount:40,venue:"Seminar Hall",description:"Five-day programme on Social Emotional Learning",outcome:"Faculty empowered with socio-emotional learning strategies",photo1:"",photo2:"",lat:"",lng:"",reportSent:false,submittedAt:"2024-08-09T10:00:00"},
];

// ─── STORAGE ────────────────────────────────────────────────────────────────
async function loadData() {
  try { const r = await window.storage.get("iqac_v3"); if(r) return JSON.parse(r.value); } catch{}
  return SEED;
}
async function persist(d) {
  try { await window.storage.set("iqac_v3", JSON.stringify(d)); } catch{}
}

// ─── PDF REPORT GENERATOR ───────────────────────────────────────────────────
async function generateActivityReport(activity) {
  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
    const W = 210, M = 18;

    // Header band
    doc.setFillColor(26,58,92);
    doc.rect(0,0,W,38,`F`);
    doc.setFillColor(200,134,10);
    doc.rect(0,38,W,4,`F`);

    // College name
    doc.setTextColor(255,255,255);
    doc.setFont("helvetica","bold");
    doc.setFontSize(11);
    doc.text(COLLEGE.name.toUpperCase(), W/2, 12, {align:"center"});
    doc.setFontSize(9);
    doc.setFont("helvetica","normal");
    doc.text(`Principal: ${COLLEGE.principal}   |   IQAC Coordinator: ${COLLEGE.coordinator}`, W/2, 19, {align:"center"});
    doc.setFontSize(10);
    doc.setFont("helvetica","bold");
    doc.text("IQAC ACTIVITY REPORT", W/2, 28, {align:"center"});
    doc.setFontSize(8);
    doc.setFont("helvetica","normal");
    doc.text(`NAAC Grade: ${COLLEGE.naacGrade} (${COLLEGE.naacScore}) | Valid till: ${COLLEGE.naacValidity} | Est. ${COLLEGE.established}`, W/2, 34, {align:"center"});

    let y = 52;

    // Title box
    doc.setFillColor(248,244,234);
    doc.setDrawColor(200,134,10);
    doc.roundedRect(M,y,W-2*M,22,3,3,"FD");
    doc.setTextColor(26,58,92);
    doc.setFont("helvetica","bold");
    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(activity.title, W-2*M-8);
    doc.text(titleLines, W/2, y+8, {align:"center"});
    y += 28;

    // Info grid
    const fields = [
      ["Faculty / Staff", activity.faculty],
      ["Department", activity.department],
      ["Activity Type", activity.type],
      ["Date", activity.date],
      ["Academic Year", activity.academicYear],
      ["Level", activity.level],
      ["Venue", activity.venue || "—"],
      ["No. of Participants", String(activity.participants)],
      ["No. of Faculty Involved", String(activity.facultyCount)],
    ];

    doc.setFontSize(9);
    const col1 = M, col2 = M+42, col3 = W/2+2, col4 = W/2+44;
    const half = Math.ceil(fields.length/2);

    for(let i=0;i<half;i++){
      const row = i;
      if(i%2===0){ doc.setFillColor(248,244,234); doc.rect(M,y+row*8,W/2-M-2,8,"F"); }
      doc.setTextColor(100,116,139); doc.setFont("helvetica","bold");
      doc.text(fields[i][0]+":", col1, y+row*8+5.5);
      doc.setTextColor(26,58,92); doc.setFont("helvetica","normal");
      doc.text(String(fields[i][1]), col2, y+row*8+5.5);
    }
    for(let i=half;i<fields.length;i++){
      const row = i-half;
      if(row%2===0){ doc.setFillColor(248,244,234); doc.rect(W/2+2,y+row*8,W/2-M-2,8,"F"); }
      doc.setTextColor(100,116,139); doc.setFont("helvetica","bold");
      doc.text(fields[i][0]+":", col3, y+row*8+5.5);
      doc.setTextColor(26,58,92); doc.setFont("helvetica","normal");
      doc.text(String(fields[i][1]), col4, y+row*8+5.5);
    }
    y += half*8+10;

    // Geo-tag
    if(activity.lat && activity.lng){
      doc.setFillColor(240,253,244);
      doc.setDrawColor(22,101,52);
      doc.roundedRect(M,y,W-2*M,10,2,2,"FD");
      doc.setTextColor(22,101,52); doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.text(`📍 Geo-Tagged Location: Lat ${activity.lat}, Long ${activity.lng}`, M+4, y+6.5);
      y += 16;
    }

    // Description
    if(activity.description){
      doc.setFillColor(26,58,92);
      doc.rect(M,y,W-2*M,7,"F");
      doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.text("DESCRIPTION / DETAILS", M+4, y+4.8);
      y += 9;
      doc.setFillColor(250,248,242);
      const dLines = doc.splitTextToSize(activity.description, W-2*M-8);
      doc.rect(M,y,W-2*M,dLines.length*5+6,"F");
      doc.setTextColor(55,65,81); doc.setFont("helvetica","normal"); doc.setFontSize(9);
      doc.text(dLines, M+4, y+5);
      y += dLines.length*5+12;
    }

    // Outcome
    if(activity.outcome){
      doc.setFillColor(22,101,52);
      doc.rect(M,y,W-2*M,7,"F");
      doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.text("OUTCOME / IMPACT ACHIEVED", M+4, y+4.8);
      y += 9;
      doc.setFillColor(240,253,244);
      doc.setDrawColor(134,239,172);
      const oLines = doc.splitTextToSize(activity.outcome, W-2*M-8);
      doc.roundedRect(M,y,W-2*M,oLines.length*5+6,2,2,"FD");
      doc.setTextColor(20,83,45); doc.setFont("helvetica","normal"); doc.setFontSize(9);
      doc.text(oLines, M+4, y+5);
      y += oLines.length*5+12;
    }

    // Photos
    const photos = [activity.photo1, activity.photo2].filter(Boolean);
    if(photos.length>0){
      doc.setFillColor(26,58,92);
      doc.rect(M,y,W-2*M,7,"F");
      doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(9);
      doc.text("ACTIVITY PHOTOGRAPHS (Geo-Tagged)", M+4, y+4.8);
      y += 11;
      const pw = photos.length===1 ? (W-2*M) : (W-2*M-6)/2;
      for(let pi=0; pi<photos.length; pi++){
        try {
          const px = M + pi*(pw+6);
          doc.addImage(photos[pi], "JPEG", px, y, pw, 60);
          doc.setDrawColor(200,134,10);
          doc.rect(px, y, pw, 60);
          if(activity.lat && activity.lng){
            doc.setFillColor(0,0,0,180);
            doc.rect(px, y+52, pw, 8,"F");
            doc.setTextColor(255,220,50); doc.setFont("helvetica","bold"); doc.setFontSize(7);
            doc.text(`📍 ${activity.lat}, ${activity.lng} | ${activity.date}`, px+2, y+57.5);
          }
        } catch(e){}
      }
      y += 68;
    }

    // Signatures
    if(y > 240){ doc.addPage(); y = 20; }
    y = Math.max(y, 220);
    doc.setDrawColor(200,134,10);
    doc.line(M, y, M+50, y);
    doc.line(W-M-50, y, W-M, y);
    doc.setTextColor(26,58,92); doc.setFont("helvetica","bold"); doc.setFontSize(8);
    doc.text("Faculty In-charge", M+25, y+5, {align:"center"});
    doc.text("IQAC Coordinator", W-M-25, y+5, {align:"center"});
    doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(100,116,139);
    doc.text(activity.faculty, M+25, y+10, {align:"center"});
    doc.text(COLLEGE.coordinator, W-M-25, y+10, {align:"center"});
    doc.text(COLLEGE.coordDept, W-M-25, y+14.5, {align:"center"});

    // Footer
    doc.setFillColor(26,58,92);
    doc.rect(0,282,W,15,"F");
    doc.setFillColor(200,134,10);
    doc.rect(0,282,W,2,"F");
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(7);
    doc.text(`Developed by ${COLLEGE.coordinator}, ${COLLEGE.coordDept}, IQAC Coordinator`, W/2, 288, {align:"center"});
    doc.setFont("helvetica","normal");
    doc.text(`${COLLEGE.name} | IQAC Email: ${COLLEGE.iqacEmail}`, W/2, 293, {align:"center"});
    doc.setTextColor(200,134,10);
    doc.text(`© ${new Date().getFullYear()} Dr. C.V. Krishnaveni. All rights reserved.`, W/2, 297, {align:"center"});

    return doc;
  } catch(e) {
    console.error("PDF error:", e);
    return null;
  }
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
const fmt   = n => (+n||0).toLocaleString("en-IN");
const today = () => new Date().toISOString().slice(0,10);
const toB64 = file => new Promise(res => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.readAsDataURL(file);
});

// ─── UI PRIMITIVES ──────────────────────────────────────────────────────────
const INP = {width:"100%",padding:"9px 13px",border:`1.5px solid ${C.border}`,
  borderRadius:8,fontSize:13.5,outline:"none",boxSizing:"border-box",
  fontFamily:"'Lora',Georgia,serif",background:"#FDFBF7",color:"#1e293b"};
const SEL = {...INP,cursor:"pointer"};

function Card({children,style={}}) {
  return <div style={{background:C.card,borderRadius:14,padding:22,
    boxShadow:"0 1px 8px rgba(26,58,92,0.08)",border:`1px solid ${C.border}`,...style}}>{children}</div>;
}
function STitle({children,sub}) {
  return <div style={{marginBottom:18}}>
    <h3 style={{margin:0,fontSize:16,fontFamily:"'Playfair Display',serif",color:C.navy,
      borderLeft:`4px solid ${C.gold}`,paddingLeft:12,lineHeight:1.3}}>{children}</h3>
    {sub && <p style={{margin:"4px 0 0 16px",fontSize:12,color:C.muted}}>{sub}</p>}
  </div>;
}
function Badge({label,color=C.gold}) {
  return <span style={{background:`${color}18`,color,padding:"3px 10px",borderRadius:20,
    fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>;
}
function KPI({icon,label,value,sub,accent}) {
  return <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",
    borderLeft:`4px solid ${accent}`,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",
    border:`1px solid ${C.border}`,borderLeftColor:accent}}>
    <div style={{fontSize:26,marginBottom:4}}>{icon}</div>
    <div style={{fontSize:11,color:C.muted,letterSpacing:.5,textTransform:"uppercase",marginBottom:2}}>{label}</div>
    <div style={{fontSize:30,fontWeight:800,color:C.navy,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{value}</div>
    {sub && <div style={{fontSize:11,color:C.muted,marginTop:3}}>{sub}</div>}
  </div>;
}
function Overlay({onClose,children,wide}) {
  return <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.6)",
    zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:"#fff",borderRadius:18,padding:32,width:"100%",
      maxWidth:wide?900:680,maxHeight:"94vh",overflowY:"auto",
      boxShadow:"0 24px 80px rgba(0,0,0,0.4)"}}>{children}</div>
  </div>;
}
function ModalHead({children,onClose}) {
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
    marginBottom:20,paddingBottom:14,borderBottom:`2px solid ${C.gold}40`}}>
    <h2 style={{margin:0,fontFamily:"'Playfair Display',serif",color:C.navy,fontSize:19}}>{children}</h2>
    <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,
      cursor:"pointer",color:C.muted,padding:4}}>✕</button>
  </div>;
}
function FF({label,req,hint,children}) {
  return <div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:12.5,fontWeight:700,color:"#374151",marginBottom:5}}>
      {label}{req&&<span style={{color:"#ef4444"}}> *</span>}
      {hint&&<span style={{fontWeight:400,color:C.muted,marginLeft:6}}>{hint}</span>}
    </label>
    {children}
  </div>;
}

const TABS = [
  {id:"overview",    icon:"📊", label:"Overview"},
  {id:"submit",      icon:"📤", label:"Submit Activity"},
  {id:"register",    icon:"📋", label:"Activity Register"},
  {id:"analytics",   icon:"📈", label:"Analytics"},
  {id:"departments", icon:"🏛️", label:"Departments"},
  {id:"yearwise",    icon:"📅", label:"Year Wise"},
  {id:"naac",        icon:"🏆", label:"NAAC Snapshot"},
  {id:"setup",       icon:"⚙️", label:"Setup Guide"},
];

// ─── BLANK FORM ─────────────────────────────────────────────────────────────
const BLANK = {
  faculty:"",department:"Chemistry",inchargeEmail:"",type:"Workshop / Seminar",
  title:"",date:today(),academicYear:"2024-25",level:"Institution",
  participants:"",facultyCount:"",venue:"",description:"",outcome:"",
  photo1:"",photo2:"",lat:"",lng:"",reportSent:false,
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function IQACDashboard() {
  const [acts,    setActs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("overview");

  // filters
  const [fYear,setFYear]=useState("All");
  const [fDept,setFDept]=useState("All");
  const [fType,setFType]=useState("All");
  const [fLvl, setFLvl] =useState("All");
  const [fQ,   setFQ]   =useState("");

  // modals
  const [showAdd,  setShowAdd]  = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showView, setShowView] = useState(null);
  const [showCSV,  setShowCSV]  = useState(false);
  const [csvText,  setCsvText]  = useState("");
  const [csvStatus,setCsvStatus]= useState("");

  const [form,    setForm]    = useState(BLANK);
  const [formErr, setFormErr] = useState({});
  const [pdfBusy, setPdfBusy] = useState(false);
  const [geoStatus,setGeoStatus]=useState("");

  const photo1Ref = useRef(); const photo2Ref = useRef();

  useEffect(()=>{ loadData().then(d=>{ setActs(d); setLoading(false); }); },[]);

  const save = useCallback(async list => { setActs(list); await persist(list); },[]);

  // ── filtered ──
  const filtered = acts.filter(a=>
    (fYear==="All"||a.academicYear===fYear)&&
    (fDept==="All"||a.department===fDept)&&
    (fType==="All"||a.type===fType)&&
    (fLvl==="All"||a.level===fLvl)&&
    (!fQ||[a.title,a.department,a.faculty,a.type,a.description].join(" ").toLowerCase().includes(fQ.toLowerCase()))
  ).sort((a,b)=>b.date>a.date?1:-1);

  // ── analytics ──
  const totalP  = filtered.reduce((s,a)=>s+(+a.participants||0),0);
  const totalF  = filtered.reduce((s,a)=>s+(+a.facultyCount||0),0);
  const natIntl = filtered.filter(a=>a.level==="National"||a.level==="International").length;

  const byType = Object.entries(filtered.reduce((acc,a)=>{acc[a.type]=(acc[a.type]||0)+1;return acc;},{}))
    .map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  const byDept = Object.entries(filtered.reduce((acc,a)=>{acc[a.department]=(acc[a.department]||0)+1;return acc;},{}))
    .map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,10);
  const byYear = ACADEMIC_YEARS.map(yr=>({
    year:yr, acts:acts.filter(a=>a.academicYear===yr).length,
    participants:acts.filter(a=>a.academicYear===yr).reduce((s,a)=>s+(+a.participants||0),0),
  }));
  const byLevel= Object.entries(filtered.reduce((acc,a)=>{acc[a.level]=(acc[a.level]||0)+1;return acc;},{}))
    .map(([name,value])=>({name,value}));
  const monthly= ()=>{
    const m={};
    filtered.forEach(a=>{if(!a.date)return; const k=a.date.slice(0,7);
      if(!m[k])m[k]={month:k,count:0,participants:0};
      m[k].count++;m[k].participants+=(+a.participants||0);});
    return Object.values(m).sort((a,b)=>a.month>b.month?1:-1).slice(-12);
  };

  // ── geo-tag ──
  const getGeo = () => {
    if(!navigator.geolocation){setGeoStatus("Geolocation not supported");return;}
    setGeoStatus("Getting location…");
    navigator.geolocation.getCurrentPosition(pos=>{
      setForm(f=>({...f,lat:pos.coords.latitude.toFixed(6),lng:pos.coords.longitude.toFixed(6)}));
      setGeoStatus(`✅ Captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
    },()=>setGeoStatus("❌ Location denied. Please allow location access."),
    {enableHighAccuracy:true,timeout:10000});
  };

  // ── photos ──
  const handlePhoto = async (e, which) => {
    const file = e.target.files[0]; if(!file) return;
    const b64 = await toB64(file);
    setForm(f=>({...f,[which]:b64}));
  };

  // ── validate ──
  const validate = f => {
    const e={};
    if(!f.title.trim())   e.title="Required";
    if(!f.date)           e.date="Required";
    if(!f.faculty.trim()) e.faculty="Required";
    if(!f.participants)   e.participants="Required";
    return e;
  };

  // ── save activity ──
 const handleSave = async () => {
  const e = validate(form);
  if (Object.keys(e).length) {
    setFormErr(e);
    return;
  }

  const entry = {
    ...form,
    id: showEdit?.id || Date.now(),
    participants: +form.participants,
    facultyCount: +form.facultyCount,
    submittedAt: showEdit?.submittedAt || new Date().toISOString(),
    reportSent: false
  };

  const list = showEdit
    ? acts.map(a => a.id === showEdit.id ? entry : a)
    : [entry, ...acts];

  await save(list);

  // 🔥 SEND DATA TO GOOGLE SHEET
  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbwz-j_XaWNPTGWWSA36sRjDs3I-u3DN17DlPSUkf7aijICSP9Op2eHdSwqI8fHfliN89g/exec",
      {
        method: "POST",
        body: JSON.stringify({
          facultyName: form.faculty,
          activityTitle: form.title,
          department: form.department,
          email: form.email,
          activityType: form.type,
          date: form.date,
          academicYear: form.year,
          level: form.level,
          venue: form.venue,
          students: form.participants,
          facultyCount: form.facultyCount,
          description: form.description,
          outcomes: form.outcomes,
          latitude: form.latitude,
          longitude: form.longitude
        })
      }
    );
  } catch (err) {
    console.error("Sheet Error:", err);
  }

  setShowAdd(false);
  setShowEdit(null);
  setForm(BLANK);
  setFormErr({});
  setGeoStatus("");
};

  const handleDelete = async id => {
    if(!confirm("Delete this activity record?")) return;
    await save(acts.filter(a=>a.id!==id));
  };

  // ── generate PDF & email prompt ──
  const handleGenerateReport = async (activity) => {
    setPdfBusy(true);
    try {
      const doc = await generateActivityReport(activity);
      if(!doc){alert("PDF generation failed. Please try again.");setPdfBusy(false);return;}

      const filename = `IQAC_Report_${activity.department.replace(/[^a-z0-9]/gi,"_")}_${activity.date}.pdf`;
      doc.save(filename);

      // Mark report as sent
      const updated = {...activity, reportSent:true};
      await save(acts.map(a=>a.id===activity.id?updated:a));

      // Email prompt
      const subject = encodeURIComponent(`IQAC Activity Report: ${activity.title}`);
      const body = encodeURIComponent(
        `Dear ${activity.faculty},\n\nPlease find attached the IQAC Activity Report for:\n\nTitle: ${activity.title}\nDepartment: ${activity.department}\nDate: ${activity.date}\nParticipants: ${activity.participants}\n\nKindly review and confirm receipt.\n\nWith regards,\n${COLLEGE.coordinator}\nIQAC Coordinator\n${COLLEGE.nameShort}`
      );

      const emails = [COLLEGE.iqacEmail];
      if(activity.inchargeEmail) emails.push(activity.inchargeEmail);

      // Open default mail client
      window.open(`mailto:${emails.join(",")}?subject=${subject}&body=${body}`);

      alert(`✅ PDF downloaded!\n\nEmail draft opened to:\n• ${emails.join("\n• ")}\n\nPlease attach the downloaded PDF and send.`);
    } catch(err){
      console.error(err);
      alert("Error generating report.");
    }
    setPdfBusy(false);
  };

  // ── CSV import ──
  const handleCSV = async () => {
    setCsvStatus("Parsing…");
    try {
      const lines=csvText.trim().split("\n");
      const headers=lines[0].split(",").map(h=>h.trim().replace(/"/g,""));
      const imported=lines.slice(1).map((line,i)=>{
        const vals=line.match(/(".*?"|[^,]+)/g)?.map(v=>v.replace(/"/g,"").trim())||[];
        const obj={}; headers.forEach((h,j)=>{obj[h]=vals[j]||"";});
        return {
          id:Date.now()+i,
          faculty:obj["Faculty Name"]||obj["faculty"]||"",
          department:obj["Department"]||obj["department"]||"Chemistry",
          inchargeEmail:obj["inchargeEmail"]||"",
          type:obj["Activity Type"]||obj["type"]||"Workshop / Seminar",
          title:obj["Activity Title"]||obj["title"]||`Imported Activity ${i+1}`,
          date:obj["Date"]||obj["date"]||today(),
          academicYear:obj["Academic Year"]||obj["academicYear"]||"2023-24",
          level:obj["Level"]||obj["level"]||"Institution",
          participants:+(obj["No. of Participants (Students)"]||obj["participants"]||0),
          facultyCount:+(obj["No. of Faculty Involved"]||obj["facultyCount"]||0),
          venue:obj["Venue"]||"",
          description:obj["Description / Details of Activity"]||obj["description"]||"",
          outcome:obj["Outcome / Impact Achieved"]||obj["outcome"]||"",
          photo1:"",photo2:"",lat:"",lng:"",reportSent:false,
          submittedAt:new Date().toISOString(),
        };
      }).filter(r=>r.title);
      await save([...imported,...acts]);
      setCsvStatus(`✅ Imported ${imported.length} activities!`);
      setCsvText(""); setTimeout(()=>{setShowCSV(false);setCsvStatus("");},2000);
    } catch(err){setCsvStatus("❌ Error parsing CSV. Check format.");}
  };

  if(loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      height:"100vh",background:C.bg,fontFamily:"'Playfair Display',serif",
      flexDirection:"column",gap:16}}>
      <div style={{fontSize:48}}>🎓</div>
      <div style={{fontSize:20,color:C.navy,fontWeight:700}}>Loading IQAC Dashboard…</div>
      <div style={{fontSize:13,color:C.muted}}>{COLLEGE.nameShort}</div>
    </div>
  );

  // ════════════════ RENDER ════════════════
  return (
    <div style={{fontFamily:"'Lora',Georgia,serif",background:C.bg,minHeight:"100vh",color:"#1e293b"}}>

      {/* ══ HEADER ══ */}
      <div style={{background:`linear-gradient(160deg,${C.navy} 0%,#0D2035 70%,#142B47 100%)`,
        color:"#fff",position:"sticky",top:0,zIndex:500,boxShadow:"0 4px 24px rgba(0,0,0,0.35)"}}>
        <div style={{background:`linear-gradient(90deg,#B07200,${C.gold},#E9A820,${C.gold},#B07200)`,
          padding:"5px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:800,letterSpacing:1.8,textTransform:"uppercase",color:C.navy}}>
            {COLLEGE.name}
          </span>
          <span style={{fontSize:11,color:C.navy,fontWeight:700}}>
            NAAC {COLLEGE.naacGrade} ({COLLEGE.naacScore}) · Autonomous · Est. {COLLEGE.established}
          </span>
        </div>
        <div style={{padding:"12px 24px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <div style={{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#E9A820)`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>🎓</div>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>
              IQAC Activity & Quality Management Dashboard
            </div>
            <div style={{fontSize:12.5,marginTop:4,display:"flex",gap:16,flexWrap:"wrap"}}>
              <span><span style={{color:C.gold,fontWeight:700}}>Principal: </span>
                <span style={{color:"#E2C97E",fontWeight:600}}>{COLLEGE.principal}</span></span>
              <span style={{color:"rgba(255,255,255,0.3)"}}>|</span>
              <span><span style={{color:C.gold,fontWeight:700}}>IQAC Coordinator: </span>
                <span style={{color:"#E2C97E",fontWeight:600}}>{COLLEGE.coordinator}</span></span>
              <span style={{color:"rgba(255,255,255,0.3)"}}>|</span>
              <span style={{color:"rgba(255,255,255,0.55)",fontSize:11}}>{COLLEGE.coordDept}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0,flexWrap:"wrap"}}>
            <button onClick={()=>setShowCSV(true)}
              style={{padding:"7px 13px",border:`1px solid rgba(255,255,255,0.25)`,borderRadius:8,
                background:"rgba(255,255,255,0.1)",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>
              📥 Import CSV
            </button>
            <button onClick={()=>{setForm(BLANK);setFormErr({});setGeoStatus("");setShowAdd(true);}}
              style={{padding:"7px 16px",border:"none",borderRadius:8,
                background:`linear-gradient(135deg,${C.gold},#E9A820)`,
                color:C.navy,cursor:"pointer",fontSize:12.5,fontWeight:800,
                boxShadow:`0 2px 10px ${C.gold}50`}}>
              + Add Activity
            </button>
          </div>
        </div>
        {/* TABS */}
        <div style={{display:"flex",gap:0,paddingLeft:12,paddingRight:12,
          overflowX:"auto",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"9px 15px",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                borderRadius:"8px 8px 0 0",whiteSpace:"nowrap",fontFamily:"inherit",
                background:tab===t.id?C.bg:"transparent",
                color:tab===t.id?C.navy:"rgba(255,255,255,0.65)",
                borderBottom:tab===t.id?`3px solid ${C.gold}`:"3px solid transparent"}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ FILTERS BAR ══ */}
      <div style={{background:"#fff",borderBottom:`1px solid ${C.border}`,
        padding:"10px 24px",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",
        position:"sticky",top:126,zIndex:400,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
        <input placeholder="🔍  Search activities…" value={fQ} onChange={e=>setFQ(e.target.value)}
          style={{...INP,width:260,flex:"0 0 auto"}} />
        {[[fYear,setFYear,"All Years",ACADEMIC_YEARS],[fDept,setFDept,"All Departments",DEPARTMENTS],
          [fType,setFType,"All Types",ACTIVITY_TYPES],[fLvl,setFLvl,"All Levels",LEVELS]].map(([val,setter,ph,opts],i)=>(
          <select key={i} value={val} onChange={e=>setter(e.target.value)}
            style={{...SEL,width:i===1?185:155,flex:"0 0 auto"}}>
            <option value="All">{ph}</option>
            {opts.map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
        <button onClick={()=>{setFQ("");setFYear("All");setFDept("All");setFType("All");setFLvl("All");}}
          style={{padding:"8px 14px",border:`1px solid ${C.border}`,borderRadius:8,
            background:"#fff",cursor:"pointer",fontSize:12,color:C.muted}}>Clear</button>
        <span style={{marginLeft:"auto",fontSize:12.5,color:C.muted,fontWeight:600}}>
          <strong style={{color:C.navy}}>{filtered.length}</strong> / {acts.length} activities
        </span>
      </div>

      {/* ══ BODY ══ */}
      <div style={{padding:"24px",maxWidth:1440,margin:"0 auto"}}>

        {/* ─── OVERVIEW ─── */}
        {tab==="overview" && <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:14,marginBottom:22}}>
            <KPI icon="🎯" label="Total Activities"    value={fmt(filtered.length)} sub={`${acts.length} all-time`}  accent={C.navy}/>
            <KPI icon="👩‍🎓" label="Total Participants" value={fmt(totalP)} sub="Students & Staff" accent={C.gold}/>
            <KPI icon="👩‍🏫" label="Faculty Involved"   value={fmt(totalF)} sub="Across departments" accent={C.crimson}/>
            <KPI icon="🏛️" label="Active Departments"  value={new Set(filtered.map(a=>a.department)).size} sub={`of ${DEPARTMENTS.length}`} accent={C.green}/>
            <KPI icon="🌐" label="National / Intl"     value={natIntl} sub="Outreach events" accent={C.teal}/>
            <KPI icon="📄" label="Reports Generated"   value={acts.filter(a=>a.reportSent).length} sub="PDF reports sent" accent={C.purple}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18,marginBottom:18}}>
            <Card>
              <STitle sub="Monthly activity count">Monthly Trend</STitle>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthly()}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.gold} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                  <XAxis dataKey="month" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/>
                  <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                  <Area type="monotone" dataKey="count" stroke={C.gold} strokeWidth={2.5} fill="url(#ag)" name="Activities"/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <STitle sub="By geographic level">Level Distribution</STitle>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byLevel} cx="50%" cy="50%" outerRadius={85} innerRadius={42}
                    dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine fontSize={9}>
                    {byLevel.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <Card>
              <STitle sub="Top activity categories">Activities by Type</STitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byType.slice(0,8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                  <XAxis type="number" tick={{fontSize:10}}/><YAxis type="category" dataKey="name" tick={{fontSize:9}} width={140}/>
                  <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                  <Bar dataKey="count" fill={C.gold} radius={[0,5,5,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <STitle sub="Year-over-year comparison">Annual Growth</STitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                  <XAxis dataKey="year" tick={{fontSize:10}}/>
                  <YAxis yAxisId="l" tick={{fontSize:10}}/><YAxis yAxisId="r" orientation="right" tick={{fontSize:10}}/>
                  <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/><Legend/>
                  <Bar yAxisId="l" dataKey="acts" fill={C.navy} name="Activities" radius={[4,4,0,0]}/>
                  <Bar yAxisId="r" dataKey="participants" fill={C.gold} name="Participants" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card>
            <STitle sub="Click any row to view full details & generate PDF report">Recent Activities</STitle>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{background:"#F9F5EE"}}>
                  {["Title","Dept","Type","Date","Level","👥","Report"].map(h=>(
                    <th key={h} style={{padding:"10px 12px",textAlign:"left",color:C.navy,fontWeight:700,fontSize:12,borderBottom:`2px solid ${C.gold}40`}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{filtered.slice(0,8).map((a,i)=>(
                  <tr key={a.id} style={{background:i%2===0?"#fff":"#FDFBF7",cursor:"pointer",transition:"background .12s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#FFF8E8"}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#FDFBF7"}>
                    <td style={{padding:"8px 12px",color:C.navy,fontWeight:600,maxWidth:220}} onClick={()=>setShowView(a)}>
                      <span style={{color:C.gold}}>›</span> {a.title}
                    </td>
                    <td style={{padding:"8px 12px"}} onClick={()=>setShowView(a)}>{a.department}</td>
                    <td style={{padding:"8px 12px"}} onClick={()=>setShowView(a)}><Badge label={a.type.split("/")[0].trim()}/></td>
                    <td style={{padding:"8px 12px",color:C.muted}} onClick={()=>setShowView(a)}>{a.date}</td>
                    <td style={{padding:"8px 12px"}} onClick={()=>setShowView(a)}>
                      <Badge label={a.level} color={a.level==="National"||a.level==="International"?C.green:C.teal}/>
                    </td>
                    <td style={{padding:"8px 12px",fontWeight:800,color:C.crimson}} onClick={()=>setShowView(a)}>{fmt(a.participants)}</td>
                    <td style={{padding:"8px 12px"}}>
                      <button onClick={()=>handleGenerateReport(a)} disabled={pdfBusy}
                        style={{padding:"4px 10px",background:a.reportSent?"#DCFCE7":"#FEF9EC",
                          color:a.reportSent?C.green:C.gold,border:`1px solid ${a.reportSent?"#86EFAC":C.gold+"60"}`,
                          borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700}}>
                        {a.reportSent?"✅ PDF":"📄 PDF"}
                      </button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>}

        {/* ─── SUBMIT / GOOGLE FORM ─── */}
        {tab==="submit" && <div style={{maxWidth:820,margin:"0 auto"}}>
          <div style={{background:`linear-gradient(135deg,${C.navy},#0D2035)`,borderRadius:16,
            padding:28,color:"#fff",marginBottom:22,display:"flex",alignItems:"center",gap:20}}>
            <div style={{fontSize:52}}>📤</div>
            <div>
              <h2 style={{margin:"0 0 6px",fontFamily:"'Playfair Display',serif",fontSize:22}}>Faculty Activity Submission</h2>
              <p style={{margin:0,opacity:.8,fontSize:13.5,lineHeight:1.7}}>
                Each faculty fills the Google Form below. Responses auto-save to Google Sheet.
                IQAC Coordinator imports CSV monthly into this dashboard.
              </p>
            </div>
          </div>
          <Card style={{textAlign:"center",padding:40,marginBottom:20}}>
            <div style={{fontSize:48,marginBottom:12}}>📋</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",color:C.navy,margin:"0 0 8px",fontSize:20}}>
              Faculty Activity Submission Form
            </h3>
            <p style={{color:C.muted,fontSize:14,margin:"0 0 24px",lineHeight:1.7}}>
              Click to open the Google Form. Share this with all faculty so they can submit activities anytime.
            </p>
            <a href={COLLEGE.googleForm} target="_blank" rel="noopener noreferrer"
              style={{display:"inline-block",padding:"16px 40px",
                background:`linear-gradient(135deg,${C.gold},#E9A820)`,
                color:C.navy,borderRadius:12,fontWeight:800,fontSize:16,
                textDecoration:"none",boxShadow:`0 4px 20px ${C.gold}40`,
                fontFamily:"'Playfair Display',serif"}}>
              📋 Open Faculty Submission Form
            </a>
            <p style={{marginTop:12,fontSize:12,color:C.muted}}>
              Share link: <code style={{background:"#f1ebe0",padding:"2px 8px",borderRadius:4,fontSize:11}}>{COLLEGE.googleForm}</code>
            </p>
            <div style={{marginTop:16,padding:"12px 16px",background:"#F0F9FF",borderRadius:8,
              border:"1px solid #BAE6FD",textAlign:"left",fontSize:12.5,color:"#0369A1"}}>
              <strong>📌 Share with faculty:</strong> Copy the URL above → paste in department WhatsApp groups.
              Each submission lands instantly in the linked Google Sheet.
            </div>
          </Card>
          <Card>
            <STitle>WhatsApp Message — Send to All Faculty</STitle>
            <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:10,
              padding:18,fontSize:13.5,lineHeight:2,fontFamily:"monospace",
              whiteSpace:"pre-wrap",color:"#14532D"}}>
{`📢 *IQAC – Activity Submission Request*

Dear Faculty,

Please submit your departmental activities using the form below.
Submit each activity separately within 3 days.

📋 *Activity Form:*
${COLLEGE.googleForm}

📊 *IQAC Dashboard:*
https://drcvkiqac.github.io/iqac-skr-kdp/

✅ Submit after EVERY activity
✅ Takes only 2 minutes

For queries: ${COLLEGE.coordinator}, IQAC Coordinator
📧 ${COLLEGE.iqacEmail}

— *${COLLEGE.principal}*
  Principal, ${COLLEGE.nameShort}`}
            </div>
          </Card>
        </div>}

        {/* ─── ACTIVITY REGISTER ─── */}
        {tab==="register" && <>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
            <h2 style={{margin:0,fontSize:18,fontFamily:"'Playfair Display',serif",color:C.navy,flex:1}}>
              📋 Activity Register — {filtered.length} Records
            </h2>
            <button onClick={()=>setShowCSV(true)}
              style={{padding:"8px 14px",border:`1.5px solid ${C.border}`,borderRadius:8,
                background:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,color:C.navy}}>
              📥 Import CSV
            </button>
            <button onClick={()=>{setForm(BLANK);setFormErr({});setGeoStatus("");setShowAdd(true);}}
              style={{padding:"8px 18px",border:"none",borderRadius:8,
                background:`linear-gradient(135deg,${C.gold},#E9A820)`,
                color:C.navy,cursor:"pointer",fontSize:13,fontWeight:800}}>
              + Add Activity
            </button>
          </div>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
                <thead><tr style={{background:`linear-gradient(135deg,${C.navy},#0D2035)`,color:"#fff"}}>
                  {["#","Faculty","Title","Dept","Type","Date","Yr","Level","👥","Report","Actions"].map(h=>(
                    <th key={h} style={{padding:"10px 11px",textAlign:"left",fontWeight:700,fontSize:11,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{filtered.map((a,i)=>(
                  <tr key={a.id}
                    style={{background:i%2===0?"#fff":"#FDFBF7",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#FFF8E8"}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#FDFBF7"}>
                    <td style={{padding:"8px 11px",color:C.muted,fontWeight:600}}>{i+1}</td>
                    <td style={{padding:"8px 11px",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.faculty}</td>
                    <td style={{padding:"8px 11px",color:C.navy,fontWeight:600,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}
                      onClick={()=>setShowView(a)}>
                      <span style={{color:C.gold}}>›</span> {a.title}
                    </td>
                    <td style={{padding:"8px 11px",whiteSpace:"nowrap"}}>{a.department}</td>
                    <td style={{padding:"8px 11px"}}><Badge label={a.type.split("/")[0].trim()}/></td>
                    <td style={{padding:"8px 11px",color:C.muted,whiteSpace:"nowrap"}}>{a.date}</td>
                    <td style={{padding:"8px 11px",fontWeight:600,whiteSpace:"nowrap"}}>{a.academicYear}</td>
                    <td style={{padding:"8px 11px"}}>
                      <Badge label={a.level} color={a.level==="National"||a.level==="International"?C.green:C.teal}/>
                    </td>
                    <td style={{padding:"8px 11px",fontWeight:800,color:C.crimson,textAlign:"right"}}>{fmt(a.participants)}</td>
                    <td style={{padding:"8px 11px"}}>
                      <button onClick={()=>handleGenerateReport(a)} disabled={pdfBusy}
                        title="Generate PDF Report & Email"
                        style={{padding:"3px 8px",background:a.reportSent?"#DCFCE7":"#FEF9EC",
                          color:a.reportSent?C.green:C.gold,border:`1px solid ${a.reportSent?"#86EFAC":C.gold+"50"}`,
                          borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:700}}>
                        {a.reportSent?"✅":"📄"}
                      </button>
                    </td>
                    <td style={{padding:"8px 11px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>setShowView(a)}
                          style={{padding:"3px 7px",background:"#EFF6FF",color:"#1D4ED8",
                            border:"1px solid #BFDBFE",borderRadius:5,cursor:"pointer",fontSize:11}}>View</button>
                        <button onClick={()=>{setForm({...a,participants:String(a.participants),facultyCount:String(a.facultyCount)});setFormErr({});setGeoStatus(a.lat?`✅ Geo: ${a.lat},${a.lng}`:"");setShowEdit(a);}}
                          style={{padding:"3px 7px",background:`${C.gold}18`,color:C.gold,
                            border:`1px solid ${C.gold}40`,borderRadius:5,cursor:"pointer",fontSize:11}}>Edit</button>
                        <button onClick={()=>handleDelete(a.id)}
                          style={{padding:"3px 7px",background:"#FEE2E2",color:"#EF4444",
                            border:"1px solid #FECACA",borderRadius:5,cursor:"pointer",fontSize:11}}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </Card>
        </>}

        {/* ─── ANALYTICS ─── */}
        {tab==="analytics" && <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <Card>
              <STitle sub="Year-wise comparison">Year-over-Year Trends</STitle>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={byYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                  <XAxis dataKey="year" tick={{fontSize:10}}/>
                  <YAxis yAxisId="l" tick={{fontSize:10}}/><YAxis yAxisId="r" orientation="right" tick={{fontSize:10}}/>
                  <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/><Legend/>
                  <Bar yAxisId="l" dataKey="acts" fill={C.navy} name="Activities" radius={[4,4,0,0]}/>
                  <Bar yAxisId="r" dataKey="participants" fill={C.gold} name="Participants" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <STitle sub="Type-wise share">Activity Type Breakdown</STitle>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={byType} cx="50%" cy="50%" innerRadius={50} outerRadius={95}
                    dataKey="count" label={({name,count})=>count>1?name.split("/")[0].trim().slice(0,14):""}>
                    {byType.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius:8,fontSize:12}} formatter={(v,n,p)=>[v,p.payload.name]}/>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card style={{marginBottom:18}}>
            <STitle sub="Top 10 departments">Department Activity Count</STitle>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byDept} margin={{bottom:40}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1ebe0"/>
                <XAxis dataKey="name" tick={{fontSize:9,angle:-28,textAnchor:"end"}} interval={0}/>
                <YAxis tick={{fontSize:10}}/>
                <Tooltip contentStyle={{borderRadius:8,fontSize:12}}/>
                <Bar dataKey="count" radius={[5,5,0,0]}>
                  {byDept.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <STitle>Activity Type Summary Table</STitle>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"#F9F5EE"}}>
                {["Activity Type","Count","Participants","Faculty","Avg Part.","Nat/Intl"].map(h=>(
                  <th key={h} style={{padding:"10px 12px",textAlign:h==="Activity Type"?"left":"right",color:C.navy,fontWeight:700,fontSize:12}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{ACTIVITY_TYPES.map((type,i)=>{
                const a=filtered.filter(x=>x.type===type); if(!a.length) return null;
                const tp=a.reduce((s,x)=>s+(+x.participants||0),0);
                const tf=a.reduce((s,x)=>s+(+x.facultyCount||0),0);
                const ni=a.filter(x=>x.level==="National"||x.level==="International").length;
                return <tr key={type} style={{background:i%2===0?"#fff":"#FDFBF7",borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"8px 12px",fontWeight:600}}>{type}</td>
                  <td style={{padding:"8px 12px",textAlign:"right",fontWeight:800,color:C.navy}}>{a.length}</td>
                  <td style={{padding:"8px 12px",textAlign:"right",fontWeight:700,color:C.crimson}}>{fmt(tp)}</td>
                  <td style={{padding:"8px 12px",textAlign:"right"}}>{fmt(tf)}</td>
                  <td style={{padding:"8px 12px",textAlign:"right",color:C.muted}}>{Math.round(tp/a.length)}</td>
                  <td style={{padding:"8px 12px",textAlign:"right"}}>{ni>0&&<Badge label={ni} color={C.green}/>}</td>
                </tr>;
              })}</tbody>
            </table>
          </Card>
        </>}

        {/* ─── DEPARTMENTS ─── */}
        {tab==="departments" && <>
          <h2 style={{margin:"0 0 20px",fontSize:18,fontFamily:"'Playfair Display',serif",color:C.navy}}>
            🏛️ Department-wise Summary
          </h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
            {DEPARTMENTS.map((dept,idx)=>{
              const da=filtered.filter(a=>a.department===dept);
              const acc=PIE_COLORS[idx%PIE_COLORS.length];
              if(!da.length) return <div key={dept} style={{background:"#fff",borderRadius:12,padding:18,
                border:`1px dashed ${C.border}`,opacity:.5,borderLeft:`4px solid ${C.border}`}}>
                <div style={{fontWeight:700,color:C.muted}}>{dept}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:4}}>No activities</div>
              </div>;
              const parts=da.reduce((s,a)=>s+(+a.participants||0),0);
              const ni=da.filter(a=>a.level==="National"||a.level==="International").length;
              const types=[...new Set(da.map(a=>a.type))];
              return <div key={dept} style={{background:"#fff",borderRadius:12,padding:20,
                boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:`1px solid ${C.border}`,borderLeft:`4px solid ${acc}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <h3 style={{margin:0,fontSize:14,fontFamily:"'Playfair Display',serif",color:C.navy}}>{dept}</h3>
                  <Badge label={`${da.length} activities`} color={acc}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  {[["Students",fmt(parts),C.crimson],["Nat/Intl",ni,C.green],["Types",types.length,C.teal]].map(([l,v,c])=>(
                    <div key={l} style={{background:"#F9F5EE",borderRadius:8,padding:"8px 10px"}}>
                      <div style={{fontSize:10,color:C.muted}}>{l}</div>
                      <div style={{fontSize:20,fontWeight:800,color:c,fontFamily:"'Playfair Display',serif"}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {types.slice(0,3).map(t=><Badge key={t} label={t.split("/")[0].trim().slice(0,16)} color={acc}/>)}
                  {types.length>3&&<span style={{color:C.muted,fontSize:11}}>+{types.length-3} more</span>}
                </div>
              </div>;
            })}
          </div>
        </>}

        {/* ─── YEAR WISE ─── */}
        {tab==="yearwise" && <>
          <h2 style={{margin:"0 0 20px",fontSize:18,fontFamily:"'Playfair Display',serif",color:C.navy}}>
            📅 Year-wise Activity Report
          </h2>
          {ACADEMIC_YEARS.slice().reverse().map(yr=>{
            const ya=acts.filter(a=>a.academicYear===yr); if(!ya.length) return null;
            const yp=ya.reduce((s,a)=>s+(+a.participants||0),0);
            const yn=ya.filter(a=>a.level==="National"||a.level==="International").length;
            return <Card key={yr} style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,
                paddingBottom:12,borderBottom:`2px solid ${C.gold}30`,flexWrap:"wrap"}}>
                <h3 style={{margin:0,fontSize:19,fontFamily:"'Playfair Display',serif",color:C.navy}}>
                  Academic Year {yr}
                </h3>
                <Badge label={`${ya.length} Activities`} color={C.navy}/>
                <Badge label={`${fmt(yp)} Participants`} color={C.gold}/>
                <Badge label={`${yn} National/Intl`} color={C.green}/>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
                  <thead><tr style={{background:"#F9F5EE"}}>
                    {["Faculty","Title","Dept","Type","Date","Level","👥","Report"].map(h=>(
                      <th key={h} style={{padding:"8px 11px",textAlign:"left",color:C.navy,fontWeight:700,fontSize:11}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{ya.sort((a,b)=>b.date>a.date?1:-1).map((a,i)=>(
                    <tr key={a.id} style={{background:i%2===0?"#fff":"#FDFBF7",borderBottom:`1px solid ${C.border}`}}>
                      <td style={{padding:"8px 11px",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.faculty}</td>
                      <td style={{padding:"8px 11px",color:C.navy,fontWeight:600,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}}
                        onClick={()=>setShowView(a)}>{a.title}</td>
                      <td style={{padding:"8px 11px",whiteSpace:"nowrap"}}>{a.department}</td>
                      <td style={{padding:"8px 11px"}}><Badge label={a.type.split("/")[0].trim().slice(0,16)}/></td>
                      <td style={{padding:"8px 11px",color:C.muted,whiteSpace:"nowrap"}}>{a.date}</td>
                      <td style={{padding:"8px 11px"}}><Badge label={a.level} color={a.level==="National"||a.level==="International"?C.green:C.teal}/></td>
                      <td style={{padding:"8px 11px",fontWeight:800,color:C.crimson}}>{fmt(a.participants)}</td>
                      <td style={{padding:"8px 11px"}}>
                        <button onClick={()=>handleGenerateReport(a)} disabled={pdfBusy}
                          style={{padding:"3px 8px",background:a.reportSent?"#DCFCE7":"#FEF9EC",
                            color:a.reportSent?C.green:C.gold,border:`1px solid ${a.reportSent?"#86EFAC":C.gold+"50"}`,
                            borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:700}}>
                          {a.reportSent?"✅ Sent":"📄 PDF"}
                        </button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </Card>;
          })}
        </>}

        {/* ─── NAAC SNAPSHOT ─── */}
        {tab==="naac" && <>
          <div style={{background:`linear-gradient(135deg,${C.navy},#0D2035)`,color:"#fff",
            borderRadius:16,padding:28,marginBottom:24,display:"flex",alignItems:"center",gap:20}}>
            <div style={{fontSize:52}}>🏆</div>
            <div>
              <h2 style={{margin:0,fontFamily:"'Playfair Display',serif",fontSize:22}}>
                NAAC Quality Snapshot — 2023-24
              </h2>
              <p style={{margin:"6px 0 0",opacity:.8,fontSize:13.5,lineHeight:1.6}}>
                {COLLEGE.name}<br/>
                Grade <strong style={{color:C.gold}}>{COLLEGE.naacGrade}</strong> ({COLLEGE.naacScore}) ·
                Valid till <strong style={{color:C.gold}}>{COLLEGE.naacValidity}</strong> · UGC Autonomous since 14/10/2024
              </p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[
              {v:"1,689",l:"Total Students",i:"👩‍🎓",a:C.navy},{v:"16",l:"Programmes",i:"📚",a:C.gold},
              {v:"57",l:"Full-time Teachers",i:"👩‍🏫",a:C.crimson},{v:"23",l:"PhD Holders",i:"🎓",a:C.green},
              {v:"632",l:"Final Year Passed",i:"✅",a:C.teal},{v:"169",l:"Placements",i:"💼",a:C.purple},
              {v:"118",l:"Higher Education",i:"🏛️",a:C.navy},{v:"1,363",l:"Scholarship Holders",i:"🎁",a:C.gold},
              {v:"324",l:"Total Courses",i:"📖",a:C.crimson},{v:"99",l:"New Courses Added",i:"✨",a:C.green},
              {v:"8",l:"Functional MoUs",i:"🤝",a:C.teal},{v:"61",l:"Extension Progs",i:"🌍",a:C.purple},
            ].map(({v,l,i,a})=>(
              <div key={l} style={{background:"#fff",borderRadius:12,padding:"14px 16px",
                boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:`1px solid ${C.border}`,
                borderLeft:`4px solid ${a}`,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>{i}</span>
                <div>
                  <div style={{fontSize:22,fontWeight:800,fontFamily:"'Playfair Display',serif",color:C.navy,lineHeight:1}}>{v}</div>
                  <div style={{fontSize:11,color:C.muted,fontWeight:600}}>{l}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <Card>
              <STitle>Accreditation History</STitle>
              <table style={{width:"100%",fontSize:13.5,borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#F9F5EE"}}>
                  {["Cycle","Grade","Score","Year","Validity"].map(h=>(
                    <th key={h} style={{padding:"9px 12px",textAlign:"left",color:C.navy,fontWeight:700,fontSize:12}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{[["Cycle 1","B+","78.10","2006","2006–2011"],["Cycle 2","B","2.33","2014","2014–2022"],
                  ["Cycle 3","B","2.46","2023","2023–2028"]].map(([c,g,s,y,v],i)=>(
                  <tr key={c} style={{background:i%2===0?"#fff":"#FDFBF7",borderBottom:`1px solid ${C.border}`}}>
                    <td style={{padding:"9px 12px",fontWeight:600}}>{c}</td>
                    <td style={{padding:"9px 12px"}}><Badge label={g} color={C.gold}/></td>
                    <td style={{padding:"9px 12px",fontWeight:700,color:C.crimson}}>{s}</td>
                    <td style={{padding:"9px 12px"}}>{y}</td>
                    <td style={{padding:"9px 12px",color:C.muted,fontSize:12}}>{v}</td>
                  </tr>
                ))}</tbody>
              </table>
            </Card>
            <Card>
              <STitle>IQAC Key Metrics 2023-24</STitle>
              {[["IQAC Meetings Held","6"],["Value-Added Courses","22"],["Students in VAC","740"],
                ["Students on Internships","1,689"],["Sports & Cultural Events","33"],
                ["Extension Outreach Progs","61"],["Awards Received","2"],
                ["UGC CARE Research Papers","9"],["Books / Chapters Published","24"],
                ["Scopus Citations","40"],["h-Index (Scopus)","5"],
                ["Days – Exam to Result","22"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",
                  padding:"6px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                  <span>✅ {k}</span>
                  <span style={{fontWeight:800,color:C.navy}}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
          <Card>
            <STitle sub="Live count from Activity Register">NAAC Criteria Coverage — Live Data</STitle>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
              {[
                {crit:"C1 – Curricular",color:C.navy,types:["Workshop / Seminar","Certificate Course","Induction Programme","NAAC / NIRF Activity"]},
                {crit:"C2 – Teaching",color:C.gold,types:["Guest Lecture","Faculty Development Programme","Skill Development","Career Guidance"]},
                {crit:"C3 – Research",color:C.purple,types:["Research Publication","Webinar","Industry / Educational Visit"]},
                {crit:"C3 – Extension",color:C.green,types:["NSS / NCC Activity","Community Service Project","Extension Activity"]},
                {crit:"C5 – Student Support",color:C.teal,types:["Placement Drive","Alumni Activity","Sports / Cultural Event"]},
                {crit:"C7 – Values",color:C.crimson,types:["Gender Awareness","Environmental Activity"]},
              ].map(({crit,color,types})=>{
                const cnt=acts.filter(a=>types.includes(a.type)).length;
                return <div key={crit} style={{background:`${color}08`,border:`2px solid ${color}25`,
                  borderRadius:12,padding:18}}>
                  <div style={{fontWeight:700,color,fontSize:13,marginBottom:6}}>{crit}</div>
                  <div style={{fontSize:32,fontWeight:800,color,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{cnt}</div>
                  <div style={{fontSize:11.5,color:C.muted,marginTop:4}}>supporting activities</div>
                </div>;
              })}
            </div>
          </Card>
        </>}

        {/* ─── SETUP GUIDE ─── */}
        {tab==="setup" && <div style={{maxWidth:820,margin:"0 auto"}}>
          <div style={{background:`linear-gradient(135deg,${C.navy},#0D2035)`,borderRadius:16,
            padding:28,color:"#fff",marginBottom:24,display:"flex",alignItems:"center",gap:20}}>
            <div style={{fontSize:48}}>⚙️</div>
            <div>
              <h2 style={{margin:0,fontFamily:"'Playfair Display',serif",fontSize:22}}>Setup Guide</h2>
              <p style={{margin:"6px 0 0",opacity:.8,fontSize:14}}>
                Complete workflow: Google Form → Sheet → CSV → Dashboard → PDF Report → Email
              </p>
            </div>
          </div>
          {[
            {n:"1",icon:"📋",title:"Faculty Submit via Google Form",steps:["Each faculty opens the Google Form link","Fills all 11 fields — takes 2 minutes","Clicks Submit — data auto-saved to Google Sheet","For photo evidence: upload to Google Drive, paste link in form"]},
            {n:"2",icon:"📊",title:"Google Sheet Collects All Responses",steps:["Go to Google Drive → find 'IQAC Activity Responses' sheet","All submissions appear as new rows automatically","Add a 'Status' column (Pending/Approved/Published) for HOD review","Check for incorrect entries and edit if needed"]},
            {n:"3",icon:"📥",title:"Monthly CSV Import to Dashboard",steps:["Open Google Sheet → File → Download → CSV","In this dashboard → click '📥 Import CSV' (top right)","Paste the CSV content → click Import","All activities appear instantly in dashboard"]},
            {n:"4",icon:"📄",title:"Generate Activity Reports with Photos",steps:["Go to Activity Register tab","For activities with geo-tagged photos: click 📄 PDF button","Professional PDF report auto-generated with: title, details, geo-location, two photos, description, outcomes, signatures","PDF downloads automatically to your computer","Email window opens pre-filled with subject & body","Attach the PDF and send to faculty in-charge + IQAC email"]},
            {n:"5",icon:"🏆",title:"Use for NAAC Presentations",steps:["NAAC Snapshot tab — show live quality metrics on projector","Analytics tab — criterion-wise graphs ready to screenshot","Year Wise tab — print as evidence for AQAR","Department View — HOD-wise contribution for Governing Body meetings"]},
          ].map(({n,icon,title,steps})=>(
            <Card key={n} style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:18}}>
                <div style={{width:42,height:42,borderRadius:"50%",flexShrink:0,
                  background:`linear-gradient(135deg,${C.gold},#E9A820)`,color:C.navy,
                  fontWeight:800,fontSize:17,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {n}
                </div>
                <div style={{flex:1}}>
                  <h3 style={{margin:"0 0 10px",fontFamily:"'Playfair Display',serif",color:C.navy,fontSize:16}}>
                    {icon} {title}
                  </h3>
                  <ol style={{margin:0,paddingLeft:20,color:"#374151",fontSize:13.5,lineHeight:2}}>
                    {steps.map((s,i)=><li key={i}>{s}</li>)}
                  </ol>
                </div>
              </div>
            </Card>
          ))}
        </div>}
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{background:`linear-gradient(135deg,${C.navy},#0D2035)`,color:"rgba(255,255,255,0.6)",
        textAlign:"center",padding:"20px 24px",marginTop:32,fontSize:12}}>
        <div style={{color:C.gold,fontWeight:700,fontSize:13,marginBottom:4}}>
          {COLLEGE.name} — IQAC Activity & Quality Management Dashboard
        </div>
        <div style={{marginBottom:2}}>
          Developed by&nbsp;
          <span style={{color:"#E2C97E",fontWeight:700}}>{COLLEGE.coordinator}</span>,&nbsp;
          <span style={{color:"#E2C97E"}}>{COLLEGE.coordDept}</span>,&nbsp;
          IQAC Coordinator
        </div>
        <div style={{marginBottom:4}}>
          Principal:&nbsp;<span style={{color:"#E2C97E",fontWeight:700}}>{COLLEGE.principal}</span>&nbsp;|&nbsp;
          <span style={{color:"rgba(255,255,255,0.5)"}}>{COLLEGE.nameShort}</span>
        </div>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:8,marginTop:6}}>
          © {new Date().getFullYear()} Dr. C.V. Krishnaveni. All rights reserved. |
          IQAC Email: {COLLEGE.iqacEmail}
        </div>
      </div>

      {/* ══ ADD / EDIT MODAL ══ */}
      {(showAdd||showEdit) && (
        <Overlay onClose={()=>{setShowAdd(false);setShowEdit(null);setForm(BLANK);setFormErr({});setGeoStatus("");}}>
          <ModalHead onClose={()=>{setShowAdd(false);setShowEdit(null);setForm(BLANK);setFormErr({});setGeoStatus("");}}>
            {showEdit?"✏️ Edit Activity Record":"➕ Add Activity"}
          </ModalHead>
          <div style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:8,
            padding:"10px 14px",marginBottom:16,fontSize:12.5,color:"#0369A1"}}>
            💡 For bulk entry use the Google Form (Submit Activity tab). This is for IQAC coordinator direct entry.
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
            <div style={{gridColumn:"1/-1"}}>
              <FF label="Faculty / Staff Name" req>
                <input value={form.faculty} onChange={e=>setForm({...form,faculty:e.target.value})} style={INP} placeholder="e.g. Dr. A. Padmavathi"/>
                {formErr.faculty&&<div style={{color:"#ef4444",fontSize:11,marginTop:3}}>{formErr.faculty}</div>}
              </FF>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <FF label="Activity Title" req>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={INP} placeholder="Full official title of the activity"/>
                {formErr.title&&<div style={{color:"#ef4444",fontSize:11,marginTop:3}}>{formErr.title}</div>}
              </FF>
            </div>
            <FF label="Department" req>
              <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} style={SEL}>
                {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
              </select>
            </FF>
            <FF label="Faculty In-charge Email" hint="(for report delivery)">
              <input type="email" value={form.inchargeEmail} onChange={e=>setForm({...form,inchargeEmail:e.target.value})}
                style={INP} placeholder="faculty@email.com"/>
            </FF>
            <FF label="Activity Type" req>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={SEL}>
                {ACTIVITY_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </FF>
            <FF label="Date of Activity" req>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={INP}/>
              {formErr.date&&<div style={{color:"#ef4444",fontSize:11,marginTop:3}}>{formErr.date}</div>}
            </FF>
            <FF label="Academic Year" req>
              <select value={form.academicYear} onChange={e=>setForm({...form,academicYear:e.target.value})} style={SEL}>
                {ACADEMIC_YEARS.map(y=><option key={y}>{y}</option>)}
              </select>
            </FF>
            <FF label="Level" req>
              <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} style={SEL}>
                {LEVELS.map(l=><option key={l}>{l}</option>)}
              </select>
            </FF>
            <FF label="Venue / Location">
              <input value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})}
                style={INP} placeholder="Seminar Hall / Online / College Campus"/>
            </FF>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <FF label="No. of Students" req>
                <input type="number" min="0" value={form.participants}
                  onChange={e=>setForm({...form,participants:e.target.value})} style={INP} placeholder="0"/>
                {formErr.participants&&<div style={{color:"#ef4444",fontSize:11,marginTop:3}}>{formErr.participants}</div>}
              </FF>
              <FF label="No. of Faculty">
                <input type="number" min="0" value={form.facultyCount}
                  onChange={e=>setForm({...form,facultyCount:e.target.value})} style={INP} placeholder="0"/>
              </FF>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <FF label="Description">
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  style={{...INP,height:72,resize:"vertical"}} placeholder="Brief description of the activity..."/>
              </FF>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <FF label="Outcomes / Impact">
                <textarea value={form.outcome} onChange={e=>setForm({...form,outcome:e.target.value})}
                  style={{...INP,height:60,resize:"vertical"}} placeholder="What was achieved..."/>
              </FF>
            </div>

            {/* GEO-TAG */}
            <div style={{gridColumn:"1/-1",marginBottom:14}}>
              <div style={{fontSize:12.5,fontWeight:700,color:"#374151",marginBottom:8}}>
                📍 Geo-Tag Location <span style={{fontWeight:400,color:C.muted}}>(for PDF report)</span>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap"}}>
                <button type="button" onClick={getGeo}
                  style={{padding:"9px 18px",border:`1.5px solid ${C.green}`,borderRadius:8,
                    background:"#F0FDF4",color:C.green,cursor:"pointer",fontWeight:700,fontSize:13}}>
                  📍 Capture Current Location
                </button>
                <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <input value={form.lat} onChange={e=>setForm({...form,lat:e.target.value})}
                    style={INP} placeholder="Latitude e.g. 14.4673"/>
                  <input value={form.lng} onChange={e=>setForm({...form,lng:e.target.value})}
                    style={INP} placeholder="Longitude e.g. 78.8242"/>
                </div>
              </div>
              {geoStatus&&<div style={{marginTop:8,fontSize:12.5,color:geoStatus.startsWith("✅")?C.green:geoStatus.startsWith("❌")?"#ef4444":C.muted}}>{geoStatus}</div>}
            </div>

            {/* PHOTOS */}
            <div style={{gridColumn:"1/-1",marginBottom:14}}>
              <div style={{fontSize:12.5,fontWeight:700,color:"#374151",marginBottom:8}}>
                📸 Activity Photographs <span style={{fontWeight:400,color:C.muted}}>(appear in PDF report)</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["photo1","Photo 1 (Main)"],["photo2","Photo 2 (Supporting)"]].map(([key,label])=>(
                  <div key={key}>
                    <div style={{fontSize:12,color:C.muted,marginBottom:5}}>{label}</div>
                    <input type="file" accept="image/*" ref={key==="photo1"?photo1Ref:photo2Ref}
                      onChange={e=>handlePhoto(e,key)} style={{display:"none"}}/>
                    <button type="button"
                      onClick={()=>(key==="photo1"?photo1Ref:photo2Ref).current?.click()}
                      style={{width:"100%",padding:"9px 12px",border:`1.5px dashed ${form[key]?C.green:C.border}`,
                        borderRadius:8,background:form[key]?"#F0FDF4":"#FAFAF9",cursor:"pointer",fontSize:12.5,
                        color:form[key]?C.green:C.muted,fontWeight:600}}>
                      {form[key]?"✅ Photo uploaded":"📷 Click to upload photo"}
                    </button>
                    {form[key]&&<img src={form[key]} alt={label}
                      style={{width:"100%",height:80,objectFit:"cover",borderRadius:6,marginTop:6,border:`1px solid ${C.border}`}}/>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <button onClick={()=>{setShowAdd(false);setShowEdit(null);setForm(BLANK);setFormErr({});setGeoStatus("");}}
              style={{padding:"10px 20px",border:`1.5px solid ${C.border}`,borderRadius:8,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>
              Cancel
            </button>
            <button onClick={handleSave}
              style={{padding:"10px 26px",border:"none",borderRadius:8,
                background:`linear-gradient(135deg,${C.gold},#E9A820)`,
                color:C.navy,cursor:"pointer",fontWeight:800,fontFamily:"inherit",fontSize:13}}>
              {showEdit?"Update Activity":"Save Activity"}
            </button>
          </div>
        </Overlay>
      )}

      {/* ══ VIEW MODAL ══ */}
      {showView && (
        <Overlay onClose={()=>setShowView(null)} wide>
          <ModalHead onClose={()=>setShowView(null)}>Activity Details</ModalHead>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <Badge label={showView.type} color={C.gold}/>
            <Badge label={showView.level} color={showView.level==="National"||showView.level==="International"?C.green:C.teal}/>
            <Badge label={showView.academicYear} color={C.muted}/>
            {showView.reportSent&&<Badge label="PDF Report Sent ✅" color={C.green}/>}
          </div>
          <h3 style={{margin:"0 0 16px",fontFamily:"'Playfair Display',serif",color:C.navy,fontSize:20,lineHeight:1.3}}>
            {showView.title}
          </h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[["Faculty / Submitted by",showView.faculty],["Department",showView.department],
              ["Date",showView.date],["Venue",showView.venue||"—"],
              ["Participants",fmt(showView.participants)],["Faculty Involved",fmt(showView.facultyCount)],
              ["In-charge Email",showView.inchargeEmail||"Not provided"],
              ["Geo-Location",showView.lat?`${showView.lat}, ${showView.lng}`:"Not geo-tagged"]
            ].map(([k,v])=>(
              <div key={k} style={{background:"#F9F5EE",borderRadius:8,padding:"10px 14px"}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:2}}>{k}</div>
                <div style={{fontWeight:700,color:C.navy,fontSize:13.5}}>{v}</div>
              </div>
            ))}
          </div>
          {showView.description&&<div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:5}}>Description</div>
            <div style={{fontSize:13.5,color:"#374151",lineHeight:1.7,background:"#F9F5EE",padding:"12px 16px",borderRadius:8}}>{showView.description}</div>
          </div>}
          {showView.outcome&&<div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:5}}>Outcomes / Impact</div>
            <div style={{fontSize:13.5,color:"#14532D",lineHeight:1.7,background:"#F0FDF4",padding:"12px 16px",
              borderRadius:8,borderLeft:`3px solid ${C.green}`}}>{showView.outcome}</div>
          </div>}
          {(showView.photo1||showView.photo2)&&<div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>📸 Activity Photographs</div>
            <div style={{display:"grid",gridTemplateColumns:showView.photo2?"1fr 1fr":"1fr",gap:12}}>
              {[showView.photo1,showView.photo2].filter(Boolean).map((p,i)=>(
                <img key={i} src={p} alt={`Photo ${i+1}`}
                  style={{width:"100%",borderRadius:8,border:`1px solid ${C.border}`,maxHeight:220,objectFit:"cover"}}/>
              ))}
            </div>
          </div>}
          <div style={{display:"flex",gap:10,paddingTop:14,borderTop:`1px solid ${C.border}`,flexWrap:"wrap"}}>
            <button onClick={()=>handleGenerateReport(showView)} disabled={pdfBusy}
              style={{padding:"10px 20px",background:`linear-gradient(135deg,${C.navy},#0D2035)`,color:"#fff",
                border:"none",borderRadius:8,cursor:pdfBusy?"not-allowed":"pointer",fontWeight:700,fontSize:13}}>
              {pdfBusy?"⏳ Generating…":"📄 Generate PDF Report & Email"}
            </button>
            <button onClick={()=>{setShowView(null);setForm({...showView,participants:String(showView.participants),facultyCount:String(showView.facultyCount)});setFormErr({});setGeoStatus(showView.lat?`✅ Geo: ${showView.lat},${showView.lng}`:"");setShowEdit(showView);}}
              style={{padding:"10px 18px",background:`${C.gold}18`,color:C.gold,
                border:`1px solid ${C.gold}40`,borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>
              ✏️ Edit
            </button>
            <button onClick={()=>{handleDelete(showView.id);setShowView(null);}}
              style={{padding:"10px 18px",background:"#FEE2E2",color:"#EF4444",
                border:"1px solid #FECACA",borderRadius:8,cursor:"pointer",fontSize:13}}>
              🗑️ Delete
            </button>
            <button onClick={()=>setShowView(null)}
              style={{padding:"10px 18px",border:`1.5px solid ${C.border}`,borderRadius:8,
                background:"#fff",cursor:"pointer",fontSize:13,marginLeft:"auto"}}>
              Close
            </button>
          </div>
        </Overlay>
      )}

      {/* ══ CSV IMPORT MODAL ══ */}
      {showCSV && (
        <Overlay onClose={()=>{setShowCSV(false);setCsvStatus("");}} wide>
          <ModalHead onClose={()=>{setShowCSV(false);setCsvStatus("");}}>
            📥 Import Activities from Google Sheets CSV
          </ModalHead>
          <div style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:8,
            padding:"12px 16px",marginBottom:14,fontSize:13,color:"#0369A1",lineHeight:1.7}}>
            <strong>Steps:</strong> Google Sheet → File → Download → CSV → Open in Notepad → Select All → Copy → Paste below → Import
          </div>
          <FF label="Paste CSV Content" req>
            <textarea value={csvText} onChange={e=>setCsvText(e.target.value)}
              style={{...INP,height:260,resize:"vertical",fontFamily:"'JetBrains Mono',monospace",fontSize:11.5}}
              placeholder="Timestamp,Faculty Name,Department,Activity Title,Activity Type,Date,Academic Year,Level,No. of Participants (Students),No. of Faculty Involved,Description / Details of Activity,Outcome / Impact Achieved,..."/>
          </FF>
          {csvStatus&&<div style={{padding:"10px 14px",borderRadius:8,marginBottom:12,fontSize:13,
            background:csvStatus.startsWith("✅")?"#F0FDF4":csvStatus.startsWith("❌")?"#FEF2F2":"#FFFBEB",
            color:csvStatus.startsWith("✅")?"#166534":csvStatus.startsWith("❌")?"#991B1B":"#92400E",
            border:`1px solid ${csvStatus.startsWith("✅")?"#86EFAC":csvStatus.startsWith("❌")?"#FECACA":"#FCD34D"}`}}>
            {csvStatus}
          </div>}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button onClick={()=>{setShowCSV(false);setCsvStatus("");setCsvText("");}}
              style={{padding:"10px 20px",border:`1.5px solid ${C.border}`,borderRadius:8,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>
              Cancel
            </button>
            <button onClick={handleCSV} disabled={!csvText.trim()}
              style={{padding:"10px 26px",border:"none",borderRadius:8,fontWeight:800,fontFamily:"inherit",fontSize:13,
                background:csvText.trim()?`linear-gradient(135deg,${C.gold},#E9A820)`:"#e5e7eb",
                color:csvText.trim()?C.navy:"#9ca3af",cursor:csvText.trim()?"pointer":"not-allowed"}}>
              Import Activities
            </button>
          </div>
        </Overlay>
      )}
    </div>
  );
}
