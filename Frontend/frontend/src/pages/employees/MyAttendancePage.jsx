// pages/employee/MyAttendancePage.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

/* ─── Palette / shared styles ─────────────────────────── */
const C = {
  blue:   '#1d4ed8',
  blueSoft:'#eff6ff',
  border: '#e8f0fe',
  text:   '#1e293b',
  muted:  '#64748b',
  faint:  '#94a3b8',
  green:  '#16a34a',
  amber:  '#d97706',
  red:    '#dc2626',
  white:  '#fff',
};
const card  = { background: C.white, borderRadius: 18, border: `1.5px solid ${C.border}`, overflow: 'hidden' };
const cardP = { padding: '20px 24px' };
const tag   = (color, bg) => ({
  display:'inline-flex', alignItems:'center', gap:5,
  background:bg, color, fontSize:11, fontWeight:700,
  padding:'3px 10px', borderRadius:20,
});

/* ─── Helpers ─────────────────────────────────────────── */
function fmt(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function elapsed(from, to) {
  const s = Math.floor((to - from) / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

/* ─── Demo monthly log ────────────────────────────────── */
const TODAY = new Date();
const YEAR  = TODAY.getFullYear();
const MONTH = TODAY.getMonth();

function buildMonthLog() {
  const days = new Date(YEAR, MONTH + 1, 0).getDate();
  const log  = {};
  for (let d = 1; d <= days; d++) {
    const date = new Date(YEAR, MONTH, d);
    const dow  = date.getDay();
    if (dow === 0 || dow === 6) { log[d] = 'weekend'; continue; }
    if (d > TODAY.getDate())    { log[d] = 'future';  continue; }
    const roll = Math.random();
    if (roll < 0.05)      log[d] = 'absent';
    else if (roll < 0.18) log[d] = 'late';
    else                  log[d] = 'present';
  }
  return log;
}
const MONTH_LOG = buildMonthLog();

const STATUS_META = {
  present: { label:'Present',  dot:'#16a34a', bg:'#dcfce7', color:'#16a34a' },
  late:    { label:'Late',     dot:'#d97706', bg:'#fef3c7', color:'#d97706' },
  absent:  { label:'Absent',   dot:'#dc2626', bg:'#fee2e2', color:'#dc2626' },
  weekend: { label:'Weekend',  dot:'#cbd5e1', bg:'#f1f5f9', color:'#94a3b8' },
  future:  { label:'—',        dot:'#e2e8f0', bg:'#f8fafc', color:'#cbd5e1' },
};

/* ─── Demo recent records ─────────────────────────────── */
const RECENT = [
  { date:'Today',    checkIn:'09:02 AM', checkOut:'06:18 PM', hours:'9h 16m', status:'present' },
  { date:'Yesterday',checkIn:'09:45 AM', checkOut:'06:30 PM', hours:'8h 45m', status:'late'    },
  { date:'Apr 01',   checkIn:'09:00 AM', checkOut:'06:00 PM', hours:'9h 00m', status:'present' },
  { date:'Mar 31',   checkIn:'09:05 AM', checkOut:'06:10 PM', hours:'9h 05m', status:'present' },
  { date:'Mar 30',   checkIn:'—',        checkOut:'—',        hours:'—',      status:'absent'  },
];

/* ─── Month name ──────────────────────────────────────── */
const MONTH_NAME = TODAY.toLocaleString('default', { month: 'long', year: 'numeric' });
const DAYS_LABEL = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function MyAttendancePage() {
  const { user } = useAuth();

  /* live clock */
  const [now, setNow]           = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  /* check-in state */
  const [checkedIn,   setCheckedIn]   = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime,setCheckOutTime]= useState(null);
  const [history,     setHistory]     = useState(RECENT);

  const handleCheckIn = () => {
    if (checkedIn) return;
    const t = new Date();
    setCheckedIn(true);
    setCheckInTime(t);
    setCheckOutTime(null);
  };

  const handleCheckOut = () => {
    if (!checkedIn) return;
    const t = new Date();
    setCheckedIn(false);
    setCheckOutTime(t);
    const hrs = elapsed(checkInTime, t);
    setHistory(prev => [{
      date: 'Today',
      checkIn:  fmt(checkInTime),
      checkOut: fmt(t),
      hours:    hrs,
      status:   'present',
    }, ...prev.slice(1)]);
  };

  /* calendar */
  const firstDow = new Date(YEAR, MONTH, 1).getDay();
  const totalDays = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells = Array(firstDow).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));
  while (cells.length % 7) cells.push(null);

  /* stats */
  const present = Object.values(MONTH_LOG).filter(v => v === 'present').length;
  const late    = Object.values(MONTH_LOG).filter(v => v === 'late').length;
  const absent  = Object.values(MONTH_LOG).filter(v => v === 'absent').length;
  const worked  = present + late;
  const workDays= Object.values(MONTH_LOG).filter(v => v !== 'weekend' && v !== 'future').length;
  const pct     = workDays ? Math.round((worked / workDays) * 100) : 0;

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* ── Topbar ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:'-0.5px' }}>
            My <span style={{ color:C.blue }}>Attendance</span>
          </div>
          <div style={{ fontSize:12.5, color:C.faint, marginTop:2 }}>Dashboard / Attendance</div>
        </div>
        <button style={btnOutline}>📥 Export Report</button>
      </div>

      {/* ── Live Clock + Check-in/out ── */}
      <div style={{
        background:`linear-gradient(135deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%)`,
        borderRadius:20, padding:'28px 36px', marginBottom:24,
        display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap:32,
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute',top:-60,right:-60,width:260,height:260,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }} />
        <div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:500, marginBottom:6 }}>
            {now.toLocaleDateString('en-IN',{ weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </div>
          <div style={{ fontSize:48, fontWeight:800, color:'#fff', letterSpacing:'-2px', fontVariantNumeric:'tabular-nums' }}>
            {fmt(now)}
          </div>
          {checkInTime && (
            <div style={{ marginTop:10, fontSize:13, color:'rgba(255,255,255,0.75)' }}>
              {checkedIn
                ? <>Checked in at <strong>{fmt(checkInTime)}</strong> · Working: <strong>{elapsed(checkInTime, now)}</strong></>
                : <>Last session: {fmt(checkInTime)} → {checkOutTime ? fmt(checkOutTime) : '—'}</>
              }
            </div>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12, position:'relative', zIndex:1 }}>
          <button
            onClick={handleCheckIn}
            disabled={checkedIn}
            style={{
              ...actionBtn,
              background: checkedIn ? 'rgba(255,255,255,0.15)' : '#fff',
              color:       checkedIn ? 'rgba(255,255,255,0.5)' : C.blue,
              cursor:      checkedIn ? 'not-allowed' : 'pointer',
            }}
          >
            {checkedIn ? '✅ Checked In' : '🟢 Check In'}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!checkedIn}
            style={{
              ...actionBtn,
              background: !checkedIn ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)',
              color:       !checkedIn ? 'rgba(255,255,255,0.35)' : '#fff',
              border:      '1.5px solid rgba(255,255,255,0.25)',
              cursor:      !checkedIn ? 'not-allowed' : 'pointer',
            }}
          >
            {!checkedIn && checkOutTime ? `👋 ${fmt(checkOutTime)}` : '🔴 Check Out'}
          </button>
        </div>
      </div>

      {/* ── Stat pills ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Present', value:present, color:C.green, bg:'#dcfce7', icon:'✅' },
          { label:'Late',    value:late,    color:C.amber, bg:'#fef3c7', icon:'⚠️' },
          { label:'Absent',  value:absent,  color:C.red,   bg:'#fee2e2', icon:'❌' },
          { label:'Rate',    value:`${pct}%`,color:C.blue, bg:C.blueSoft,icon:'📊' },
        ].map(s => (
          <div key={s.label} style={{ ...card, ...cardP, display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:C.muted, fontWeight:500 }}>{s.label} Days</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Calendar + Records ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:20 }}>

        {/* Calendar */}
        <div style={card}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid #f1f5f9`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:14, fontWeight:700, color:C.text }}>📅 {MONTH_NAME}</span>
            <div style={{ display:'flex', gap:12 }}>
              {['present','late','absent','weekend'].map(k => (
                <div key={k} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:C.muted }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:STATUS_META[k].dot, display:'inline-block' }} />
                  {STATUS_META[k].label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:20 }}>
            {/* Day headers */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:8 }}>
              {DAYS_LABEL.map(d => (
                <div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:700, color:C.faint, padding:'4px 0' }}>{d}</div>
              ))}
            </div>
            {/* Cells */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const status = MONTH_LOG[day] || 'future';
                const meta   = STATUS_META[status];
                const isToday = day === TODAY.getDate();
                return (
                  <div key={i} style={{
                    aspectRatio:'1', borderRadius:10,
                    background: isToday ? C.blue : meta.bg,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    flexDirection:'column', gap:2,
                    border: isToday ? 'none' : `1px solid ${status === 'future' ? C.border : 'transparent'}`,
                  }}>
                    <span style={{ fontSize:13, fontWeight: isToday ? 800 : 600, color: isToday ? '#fff' : (status === 'future' ? C.faint : C.text) }}>
                      {day}
                    </span>
                    {status !== 'future' && status !== 'weekend' && (
                      <span style={{ width:5, height:5, borderRadius:'50%', background: isToday ? 'rgba(255,255,255,0.6)' : meta.dot, display:'inline-block' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ padding:'0 24px 20px', display:'flex', gap:16 }}>
            <div style={{ flex:1, background:C.blueSoft, borderRadius:12, padding:'12px 16px' }}>
              <div style={{ fontSize:11, color:C.faint, fontWeight:600 }}>AVG CHECK-IN</div>
              <div style={{ fontSize:18, fontWeight:800, color:C.blue, marginTop:2 }}>09:08 AM</div>
            </div>
            <div style={{ flex:1, background:'#f0fdf4', borderRadius:12, padding:'12px 16px' }}>
              <div style={{ fontSize:11, color:C.faint, fontWeight:600 }}>AVG HOURS</div>
              <div style={{ fontSize:18, fontWeight:800, color:C.green, marginTop:2 }}>8h 52m</div>
            </div>
            <div style={{ flex:1, background:'#fef3c7', borderRadius:12, padding:'12px 16px' }}>
              <div style={{ fontSize:11, color:C.faint, fontWeight:600 }}>OVERTIME</div>
              <div style={{ fontSize:18, fontWeight:800, color:C.amber, marginTop:2 }}>4h 20m</div>
            </div>
          </div>
        </div>

        {/* Records */}
        <div style={card}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid #f1f5f9` }}>
            <span style={{ fontSize:14, fontWeight:700, color:C.text }}>Recent Records</span>
          </div>
          <div>
            {history.map((r, i) => {
              const meta = STATUS_META[r.status];
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 24px', borderBottom: i < history.length-1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ width:9, height:9, borderRadius:'50%', background:meta.dot, display:'inline-block' }} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.date}</div>
                    <div style={{ fontSize:11.5, color:C.faint, marginTop:2 }}>
                      {r.checkIn} → {r.checkOut}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{r.hours}</div>
                    <span style={tag(meta.color, meta.bg)}>{meta.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const actionBtn = {
  padding:'12px 28px', borderRadius:12, fontSize:14, fontWeight:700,
  border:'none', fontFamily:'inherit', transition:'all 0.2s', whiteSpace:'nowrap',
};
const btnOutline = {
  display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px',
  borderRadius:10, fontSize:13.5, fontWeight:600, cursor:'pointer',
  border:`1.5px solid ${C.border}`, background:'#fff', color:C.blue, fontFamily:'inherit',
};