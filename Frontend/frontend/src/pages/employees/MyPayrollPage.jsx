// pages/employee/MyPayrollPage.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const C = {
  blue:'#1d4ed8', blueSoft:'#eff6ff', border:'#e8f0fe',
  text:'#1e293b', muted:'#64748b', faint:'#94a3b8',
  green:'#16a34a', amber:'#d97706', red:'#dc2626', white:'#fff',
};
const card  = { background:C.white, borderRadius:18, border:`1.5px solid ${C.border}`, overflow:'hidden' };
const cardH = { padding:'18px 24px', borderBottom:`1px solid #f1f5f9`, display:'flex', alignItems:'center', justifyContent:'space-between' };
const cardP = { padding:'20px 24px' };

const PAYSLIPS = [
  { month:'March 2026',    gross:85000, deductions:9200, net:75800, status:'Credited', date:'Mar 31, 2026' },
  { month:'February 2026', gross:85000, deductions:9200, net:75800, status:'Credited', date:'Feb 28, 2026' },
  { month:'January 2026',  gross:85000, deductions:9200, net:75800, status:'Credited', date:'Jan 31, 2026' },
  { month:'December 2025', gross:85000, deductions:9200, net:75800, status:'Credited', date:'Dec 31, 2025' },
  { month:'November 2025', gross:82000, deductions:8900, net:73100, status:'Credited', date:'Nov 30, 2025' },
  { month:'October 2025',  gross:82000, deductions:8900, net:73100, status:'Credited', date:'Oct 31, 2025' },
];

const EARNINGS = [
  { label:'Basic Salary',     amount:42500 },
  { label:'House Rent Allow.', amount:17000 },
  { label:'Conveyance Allow.', amount:8500  },
  { label:'Medical Allow.',    amount:5000  },
  { label:'Special Allow.',    amount:12000 },
];
const DEDUCTIONS = [
  { label:'PF (Employee)',   amount:5100, color:C.amber },
  { label:'Professional Tax',amount:200,  color:C.amber },
  { label:'Income Tax (TDS)',amount:3900, color:C.red   },
];

const fmt = n => `₹${n.toLocaleString('en-IN')}`;

export default function MyPayrollPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(0);
  const slip = PAYSLIPS[selected];

  const handleDownload = () => {
    const content = `
PAYSLIP — ${slip.month}
======================================
Employee: ${user?.name || 'Alice Babu'}
Employee ID: ${user?.empId || 'EMP-00142'}
Department: ${user?.department || 'Engineering'}
--------------------------------------
EARNINGS
${EARNINGS.map(e=>`  ${e.label.padEnd(24)} ${fmt(e.amount)}`).join('\n')}
--------------------------------------
Gross Salary: ${fmt(slip.gross)}
DEDUCTIONS
${DEDUCTIONS.map(d=>`  ${d.label.padEnd(24)} ${fmt(d.amount)}`).join('\n')}
--------------------------------------
Total Deductions: ${fmt(slip.deductions)}
NET PAY: ${fmt(slip.net)}
======================================
Status: ${slip.status} on ${slip.date}
    `.trim();
    const blob = new Blob([content], { type:'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Payslip_${slip.month.replace(' ','_')}.txt`;
    a.click();
  };

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:'-0.5px' }}>
            My <span style={{ color:C.blue }}>Payroll</span>
          </div>
          <div style={{ fontSize:12.5, color:C.faint, marginTop:2 }}>Dashboard / Payroll</div>
        </div>
        <button onClick={handleDownload} style={btnOutline}>📥 Download Payslip</button>
      </div>

      {/* Hero stat strip */}
      <div style={{
        background:`linear-gradient(135deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%)`,
        borderRadius:20, padding:'28px 36px', marginBottom:24,
        display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute',top:-60,right:-60,width:240,height:240,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }} />
        {[
          { label:'Gross Salary',     value:fmt(slip.gross),       sub:'Before deductions'   },
          { label:'Total Deductions', value:fmt(slip.deductions),  sub:'PF + Tax + PT'       },
          { label:'Net Pay',          value:fmt(slip.net),         sub:'Take-home amount'     },
          { label:'Next Paydate',     value:'Apr 30, 2026',        sub:'Scheduled credit'    },
        ].map((s,i) => (
          <div key={i} style={{ padding:'0 24px 0', borderRight: i<3 ? '1px solid rgba(255,255,255,0.15)' : 'none', position:'relative', zIndex:1 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontWeight:500 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:800, color:'#fff', marginTop:4, letterSpacing:'-0.5px' }}>{s.value}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20 }}>

        {/* Left — Breakdown */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Earnings */}
          <div style={card}>
            <div style={cardH}>
              <span style={{ fontSize:14, fontWeight:700, color:C.text }}>💵 Earnings Breakdown</span>
              <span style={{ fontSize:13, fontWeight:700, color:C.green }}>{fmt(slip.gross)}</span>
            </div>
            <div style={cardP}>
              {EARNINGS.map((e,i) => {
                const pct = Math.round((e.amount / slip.gross) * 100);
                return (
                  <div key={i} style={{ marginBottom: i<EARNINGS.length-1 ? 16 : 0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:13, color:C.muted }}>{e.label}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{fmt(e.amount)}</span>
                    </div>
                    <div style={{ height:6, background:C.border, borderRadius:10, overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.blue},#60a5fa)`, borderRadius:10 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deductions */}
          <div style={card}>
            <div style={cardH}>
              <span style={{ fontSize:14, fontWeight:700, color:C.text }}>📉 Deductions</span>
              <span style={{ fontSize:13, fontWeight:700, color:C.red }}>–{fmt(slip.deductions)}</span>
            </div>
            <div style={cardP}>
              {DEDUCTIONS.map((d,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom: i<DEDUCTIONS.length-1 ? `1px solid #f1f5f9` : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:d.color, display:'inline-block' }} />
                    <span style={{ fontSize:13, color:C.muted }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:d.color }}>–{fmt(d.amount)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0 0', marginTop:4 }}>
                <span style={{ fontSize:14, fontWeight:700, color:C.text }}>Net Pay</span>
                <span style={{ fontSize:18, fontWeight:800, color:C.green }}>{fmt(slip.net)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — History */}
        <div style={card}>
          <div style={cardH}>
            <span style={{ fontSize:14, fontWeight:700, color:C.text }}>Payslip History</span>
          </div>
          <div>
            {PAYSLIPS.map((p,i) => (
              <div
                key={i}
                onClick={()=>setSelected(i)}
                style={{
                  padding:'14px 20px', cursor:'pointer', transition:'background 0.15s',
                  background: selected===i ? C.blueSoft : 'transparent',
                  borderBottom: i<PAYSLIPS.length-1 ? '1px solid #f1f5f9' : 'none',
                  borderLeft: selected===i ? `3px solid ${C.blue}` : '3px solid transparent',
                }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color: selected===i ? C.blue : C.text }}>{p.month}</div>
                    <div style={{ fontSize:11.5, color:C.faint, marginTop:2 }}>{p.date}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.green }}>{fmt(p.net)}</div>
                    <span style={{ fontSize:10, fontWeight:700, background:'#dcfce7', color:C.green, padding:'2px 8px', borderRadius:20 }}>✓ {p.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:16, borderTop:`1px solid #f1f5f9` }}>
            <button onClick={handleDownload} style={{ ...btnPrimary, width:'100%', justifyContent:'center' }}>
              📥 Download {slip.month} Payslip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnPrimary = { display:'inline-flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, fontSize:13.5, fontWeight:600, cursor:'pointer', border:'none', background:C.blue, color:'#fff', fontFamily:'inherit' };
const btnOutline = { display:'inline-flex', alignItems:'center', gap:7, padding:'10px 20px', borderRadius:10, fontSize:13.5, fontWeight:600, cursor:'pointer', border:`1.5px solid ${C.border}`, background:'#fff', color:C.blue, fontFamily:'inherit' };