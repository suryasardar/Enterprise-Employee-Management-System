// pages/employee/MyDocumentsPage.jsx
import { useState } from 'react';

const C = {
  blue:'#1d4ed8', blueSoft:'#eff6ff', border:'#e8f0fe',
  text:'#1e293b', muted:'#64748b', faint:'#94a3b8',
  green:'#16a34a', amber:'#d97706', red:'#dc2626', white:'#fff',
};
const card = { background:C.white, borderRadius:18, border:`1.5px solid ${C.border}`, overflow:'hidden' };

const DOCS = [
  { name:'Offer Letter',          type:'PDF', size:'245 KB', date:'12 Jan 2022', category:'Onboarding', icon:'📄' },
  { name:'Appointment Letter',    type:'PDF', size:'189 KB', date:'12 Jan 2022', category:'Onboarding', icon:'📄' },
  { name:'PAN Card',              type:'PDF', size:'512 KB', date:'12 Jan 2022', category:'KYC',        icon:'🪪' },
  { name:'Aadhaar Card',          type:'PDF', size:'620 KB', date:'12 Jan 2022', category:'KYC',        icon:'🪪' },
  { name:'Payslip — March 2026',  type:'PDF', size:'98 KB',  date:'Apr 01 2026', category:'Payroll',    icon:'💰' },
  { name:'Payslip — Feb 2026',    type:'PDF', size:'96 KB',  date:'Mar 01 2026', category:'Payroll',    icon:'💰' },
  { name:'Form 16 — FY 2025-26',  type:'PDF', size:'320 KB', date:'Jun 15 2025', category:'Tax',        icon:'🧾' },
  { name:'Experience Letter',     type:'PDF', size:'145 KB', date:'Jan 10 2022', category:'Onboarding', icon:'📋' },
];

const CAT_META = {
  Onboarding: { color:'#1d4ed8', bg:'#eff6ff' },
  KYC:        { color:'#7c3aed', bg:'#f5f3ff' },
  Payroll:    { color:'#16a34a', bg:'#dcfce7' },
  Tax:        { color:'#d97706', bg:'#fef3c7' },
};

export default function MyDocumentsPage() {
  const [filter, setFilter] = useState('All');
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState(null);

  const categories = ['All', ...Object.keys(CAT_META)];
  const filtered = filter === 'All' ? DOCS : DOCS.filter(d => d.category === filter);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setToast('📤 File upload is not connected to a backend yet — integrate with your API to enable uploads.');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {toast && (
        <div style={{ position:'fixed', top:24, right:28, zIndex:999, background:C.blue, color:'#fff', fontSize:13, fontWeight:600, padding:'12px 20px', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.15)', maxWidth:360 }}>
          {toast}
        </div>
      )}

      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:'-0.5px' }}>
            My <span style={{ color:C.blue }}>Documents</span>
          </div>
          <div style={{ fontSize:12.5, color:C.faint, marginTop:2 }}>Dashboard / Documents</div>
        </div>
        <button onClick={() => { setToast('📤 Connect to your backend to enable upload.'); setTimeout(()=>setToast(null),3000); }} style={btnPrimary}>
          ＋ Upload Document
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? C.blue : C.border}`,
          borderRadius:18, padding:'32px', textAlign:'center', marginBottom:24,
          background: dragging ? C.blueSoft : '#f8fafc', transition:'all 0.2s', cursor:'pointer',
        }}
      >
        <div style={{ fontSize:32 }}>📁</div>
        <div style={{ fontSize:14, fontWeight:600, color: dragging ? C.blue : C.muted, marginTop:8 }}>
          {dragging ? 'Drop to upload' : 'Drag & drop files here, or click Upload above'}
        </div>
        <div style={{ fontSize:12, color:C.faint, marginTop:4 }}>Supports PDF, JPG, PNG up to 10 MB</div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding:'7px 16px', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
              background: filter === cat ? C.blue : '#fff',
              color:       filter === cat ? '#fff'  : C.muted,
              border:      filter === cat ? 'none'  : `1.5px solid ${C.border}`,
            }}
          >{cat}</button>
        ))}
      </div>

      {/* Documents grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {filtered.map((doc, i) => {
          const meta = CAT_META[doc.category];
          return (
            <div key={i} style={{ ...card, padding:20, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ width:48, height:48, borderRadius:14, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                  {doc.icon}
                </div>
                <span style={{ fontSize:10, fontWeight:700, background:meta.bg, color:meta.color, padding:'3px 10px', borderRadius:20 }}>
                  {doc.category}
                </span>
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{doc.name}</div>
                <div style={{ fontSize:11.5, color:C.faint, marginTop:3 }}>{doc.type} · {doc.size} · {doc.date}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button style={{ ...btnOutline, flex:1, justifyContent:'center', fontSize:12.5, padding:'8px 12px' }}>
                  👁 View
                </button>
                <button style={{ ...btnOutline, flex:1, justifyContent:'center', fontSize:12.5, padding:'8px 12px' }}>
                  📥 Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...card, padding:48, textAlign:'center', color:C.faint, fontSize:14 }}>
          No documents in this category.
        </div>
      )}
    </div>
  );
}

const btnPrimary = { display:'inline-flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, fontSize:13.5, fontWeight:600, cursor:'pointer', border:'none', background:C.blue, color:'#fff', fontFamily:'inherit' };
const btnOutline = { display:'inline-flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, fontSize:13.5, fontWeight:600, cursor:'pointer', border:`1.5px solid ${C.border}`, background:'#fff', color:C.blue, fontFamily:'inherit' };