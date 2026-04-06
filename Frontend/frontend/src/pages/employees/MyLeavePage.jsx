// pages/employee/MyLeavePage.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const C = {
  blue:'#1d4ed8', blueSoft:'#eff6ff', border:'#e8f0fe',
  text:'#1e293b', muted:'#64748b', faint:'#94a3b8',
  green:'#16a34a', amber:'#d97706', red:'#dc2626', white:'#fff',
};
const card   = { background:C.white, borderRadius:18, border:`1.5px solid ${C.border}`, overflow:'hidden' };
const cardH  = { padding:'18px 24px', borderBottom:`1px solid #f1f5f9`, display:'flex', alignItems:'center', justifyContent:'space-between' };
const cardP  = { padding:'20px 24px' };
const lbl    = { fontSize:11, fontWeight:600, color:C.faint, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6, display:'block' };
const input  = {
  width:'100%', padding:'10px 14px', borderRadius:10, fontSize:13.5,
  border:`1.5px solid ${C.border}`, outline:'none', fontFamily:'inherit',
  color:C.text, background:'#fff', boxSizing:'border-box',
};

const LEAVE_TYPES = [
  { key:'casual',  label:'Casual Leave',  used:4,  total:12, color:C.blue,  bg:C.blueSoft },
  { key:'sick',    label:'Sick Leave',    used:2,  total:7,  color:C.green, bg:'#f0fdf4'  },
  { key:'earned',  label:'Earned Leave',  used:8,  total:10, color:C.amber, bg:'#fef3c7'  },
  { key:'comp',    label:'Comp Off',      used:0,  total:3,  color:'#7c3aed',bg:'#f5f3ff' },
];

const INIT_REQUESTS = [
  { id:1, type:'Casual Leave',  from:'Apr 07', to:'Apr 08', days:2, reason:'Personal work',         status:'pending',  applied:'Apr 03' },
  { id:2, type:'Sick Leave',    from:'Mar 20', to:'Mar 20', days:1, reason:'Fever',                  status:'approved', applied:'Mar 19' },
  { id:3, type:'Earned Leave',  from:'Feb 14', to:'Feb 16', days:3, reason:'Family function',        status:'approved', applied:'Feb 10' },
  { id:4, type:'Casual Leave',  from:'Jan 25', to:'Jan 25', days:1, reason:'Bank work',              status:'rejected', applied:'Jan 24' },
];

const STATUS = {
  pending:  { label:'Pending',  color:C.amber, bg:'#fef3c7' },
  approved: { label:'Approved', color:C.green, bg:'#dcfce7' },
  rejected: { label:'Rejected', color:C.red,   bg:'#fee2e2' },
};

export default function MyLeavePage() {
  const { user } = useAuth();
  const [showForm, setShowForm]   = useState(false);
  const [requests, setRequests]   = useState(INIT_REQUESTS);
  const [form, setForm]           = useState({ type:'casual', from:'', to:'', reason:'' });
  const [toast, setToast]         = useState(null);

  const balances = { casual:8, sick:5, earned:2, comp:3 };

  const handleApply = () => {
    if (!form.from || !form.to || !form.reason.trim()) {
      setToast({ msg:'Please fill all fields.', ok:false }); setTimeout(()=>setToast(null),3000); return;
    }
    const typeLabel = LEAVE_TYPES.find(t => t.key === form.type)?.label || form.type;
    const from = new Date(form.from), to = new Date(form.to);
    const days = Math.max(1, Math.round((to - from)/(1000*60*60*24)) + 1);
    const newReq = {
      id: Date.now(), type:typeLabel,
      from: from.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}),
      to:   to.toLocaleDateString('en-IN',{day:'2-digit',month:'short'}),
      days, reason:form.reason, status:'pending',
      applied: new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short'}),
    };
    setRequests(prev => [newReq, ...prev]);
    setForm({ type:'casual', from:'', to:'', reason:'' });
    setShowForm(false);
    setToast({ msg:'Leave request submitted successfully!', ok:true });
    setTimeout(()=>setToast(null),3500);
  };

  const handleCancel = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id || r.status !== 'pending'));
    setToast({ msg:'Leave request cancelled.', ok:false }); setTimeout(()=>setToast(null),2500);
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed', top:24, right:28, zIndex:999,
          background: toast.ok ? C.green : C.red,
          color:'#fff', fontSize:13.5, fontWeight:600,
          padding:'12px 20px', borderRadius:12,
          boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
          animation:'fadeIn 0.2s ease',
        }}>{toast.ok ? '✅ ' : '⚠️ '}{toast.msg}</div>
      )}

      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:'-0.5px' }}>
            Leave <span style={{ color:C.blue }}>Management</span>
          </div>
          <div style={{ fontSize:12.5, color:C.faint, marginTop:2 }}>Dashboard / Leave</div>
        </div>
        <button onClick={()=>setShowForm(v=>!v)} style={btnPrimary}>
          {showForm ? '✕ Close' : '＋ Apply for Leave'}
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {LEAVE_TYPES.map(lt => {
          const used = lt.total - balances[lt.key];
          const pct  = Math.round((used / lt.total) * 100);
          return (
            <div key={lt.key} style={{ ...card, padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{lt.label}</div>
                  <div style={{ fontSize:28, fontWeight:800, color:lt.color, marginTop:4 }}>
                    {balances[lt.key]}
                    <span style={{ fontSize:14, color:C.faint, fontWeight:500 }}> / {lt.total}</span>
                  </div>
                </div>
                <div style={{ width:40, height:40, borderRadius:12, background:lt.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                  {lt.key==='casual'?'🌴':lt.key==='sick'?'🏥':lt.key==='earned'?'⭐':'🔄'}
                </div>
              </div>
              <div style={{ fontSize:11, color:C.faint, marginBottom:5 }}>Available</div>
              <div style={{ height:6, background:C.border, borderRadius:10, overflow:'hidden' }}>
                <div style={{ width:`${pct}%`, height:'100%', background:lt.color, borderRadius:10, transition:'width 0.6s ease' }} />
              </div>
              <div style={{ fontSize:11, color:C.faint, marginTop:5 }}>{used} used of {lt.total}</div>
            </div>
          );
        })}
      </div>

      {/* Apply Form */}
      {showForm && (
        <div style={{ ...card, marginBottom:24 }}>
          <div style={cardH}>
            <span style={{ fontSize:14, fontWeight:700, color:C.text }}>🌴 New Leave Request</span>
          </div>
          <div style={cardP}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:16 }}>
              <div>
                <label style={lbl}>Leave Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={input}>
                  {LEAVE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>From Date</label>
                <input type="date" value={form.from} onChange={e=>setForm(f=>({...f,from:e.target.value}))} style={input} />
              </div>
              <div>
                <label style={lbl}>To Date</label>
                <input type="date" value={form.to} onChange={e=>setForm(f=>({...f,to:e.target.value}))} style={input} />
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>Reason</label>
              <textarea
                value={form.reason}
                onChange={e=>setForm(f=>({...f,reason:e.target.value}))}
                placeholder="Briefly describe the reason for leave..."
                rows={3}
                style={{ ...input, resize:'vertical', lineHeight:1.6 }}
              />
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={handleApply} style={btnPrimary}>Submit Request</button>
              <button onClick={()=>setShowForm(false)} style={btnOutline}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div style={card}>
        <div style={cardH}>
          <span style={{ fontSize:14, fontWeight:700, color:C.text }}>Leave Requests</span>
          <span style={{ fontSize:12, color:C.faint }}>
            {requests.filter(r=>r.status==='pending').length} pending
          </span>
        </div>
        <div>
          {/* Header row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 60px 1fr 100px 80px', gap:8, padding:'10px 24px', background:'#f8fafc', fontSize:11, fontWeight:700, color:C.faint, textTransform:'uppercase', letterSpacing:'0.05em' }}>
            <span>Type</span><span>Dates</span><span>Days</span><span>Reason</span><span>Status</span><span></span>
          </div>
          {requests.map((r,i) => {
            const s = STATUS[r.status];
            return (
              <div key={r.id} style={{
                display:'grid', gridTemplateColumns:'1fr 1fr 60px 1fr 100px 80px', gap:8,
                padding:'14px 24px', borderBottom: i<requests.length-1 ? '1px solid #f1f5f9' : 'none',
                alignItems:'center',
              }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.type}</div>
                  <div style={{ fontSize:11, color:C.faint }}>Applied {r.applied}</div>
                </div>
                <div style={{ fontSize:13, color:C.text }}>{r.from} – {r.to}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.blue }}>{r.days}d</div>
                <div style={{ fontSize:12.5, color:C.muted }}>{r.reason}</div>
                <div>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:s.bg, color:s.color, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, display:'inline-block' }} />
                    {s.label}
                  </span>
                </div>
                <div>
                  {r.status === 'pending' && (
                    <button onClick={()=>handleCancel(r.id)} style={{ background:'#fee2e2', color:C.red, border:'none', borderRadius:8, fontSize:11, fontWeight:700, padding:'5px 10px', cursor:'pointer', fontFamily:'inherit' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {requests.length === 0 && (
            <div style={{ padding:40, textAlign:'center', color:C.faint, fontSize:14 }}>No leave requests yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnPrimary = { display:'inline-flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, fontSize:13.5, fontWeight:600, cursor:'pointer', border:'none', background:C.blue, color:'#fff', fontFamily:'inherit' };
const btnOutline = { display:'inline-flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, fontSize:13.5, fontWeight:600, cursor:'pointer', border:`1.5px solid ${C.border}`, background:'#fff', color:C.blue, fontFamily:'inherit' };