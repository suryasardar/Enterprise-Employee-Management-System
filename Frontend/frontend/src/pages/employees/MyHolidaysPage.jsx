// pages/employee/MyHolidaysPage.jsx
const C = {
  blue:'#1d4ed8', blueSoft:'#eff6ff', border:'#e8f0fe',
  text:'#1e293b', muted:'#64748b', faint:'#94a3b8',
  green:'#16a34a', amber:'#d97706', red:'#dc2626', white:'#fff',
};
const card = { background:C.white, borderRadius:18, border:`1.5px solid ${C.border}`, overflow:'hidden' };

const HOLIDAYS = [
  { date:'Jan 26', day:'Sunday',    name:'Republic Day',              type:'National', past:true  },
  { date:'Mar 17', day:'Monday',    name:'Holi',                      type:'National', past:true  },
  { date:'Apr 14', day:'Monday',    name:'Dr. Ambedkar Jayanti',      type:'National', past:false },
  { date:'Apr 18', day:'Friday',    name:'Good Friday',               type:'National', past:false },
  { date:'May 01', day:'Thursday',  name:'Maharashtra Day',           type:'State',    past:false },
  { date:'Aug 15', day:'Friday',    name:'Independence Day',          type:'National', past:false },
  { date:'Oct 02', day:'Thursday',  name:'Gandhi Jayanti',            type:'National', past:false },
  { date:'Oct 24', day:'Friday',    name:'Dussehra',                  type:'Optional', past:false },
  { date:'Nov 05', day:'Wednesday', name:'Diwali',                    type:'National', past:false },
  { date:'Dec 25', day:'Thursday',  name:'Christmas Day',             type:'National', past:false },
];

const TYPE_META = {
  National: { color:'#1d4ed8', bg:'#eff6ff' },
  State:    { color:'#7c3aed', bg:'#f5f3ff' },
  Optional: { color:'#d97706', bg:'#fef3c7' },
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MyHolidaysPage() {
  const upcoming = HOLIDAYS.filter(h => !h.past);
  const past     = HOLIDAYS.filter(h => h.past);

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Topbar */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:'-0.5px' }}>
          Holiday <span style={{ color:C.blue }}>Calendar</span>
        </div>
        <div style={{ fontSize:12.5, color:C.faint, marginTop:2 }}>Dashboard / Holidays · 2026</div>
      </div>

      {/* Stat strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { icon:'🗓️', label:'Total Holidays', value:HOLIDAYS.length, color:C.blue, bg:C.blueSoft },
          { icon:'✅', label:'Completed',       value:past.length,     color:C.green, bg:'#f0fdf4' },
          { icon:'🔜', label:'Upcoming',        value:upcoming.length, color:C.amber, bg:'#fef3c7' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding:20, display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:50, height:50, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:C.muted, fontWeight:500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Next holiday banner */}
      {upcoming[0] && (
        <div style={{
          background:`linear-gradient(135deg,#1d4ed8,#3b82f6)`,
          borderRadius:18, padding:'22px 28px', marginBottom:24,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Next Holiday</div>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff', marginTop:4 }}>{upcoming[0].name}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:4 }}>{upcoming[0].day}, {upcoming[0].date} 2026</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:14, padding:'14px 24px', textAlign:'center' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Days Away</div>
            <div style={{ fontSize:36, fontWeight:800, color:'#fff', marginTop:2 }}>
              {Math.max(0, Math.ceil((new Date(`2026 ${upcoming[0].date}`) - new Date()) / 86400000))}
            </div>
          </div>
        </div>
      )}

      {/* Holiday list */}
      <div style={card}>
        <div style={{ padding:'18px 24px', borderBottom:`1px solid #f1f5f9`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.text }}>All Holidays — 2026</span>
          <div style={{ display:'flex', gap:10 }}>
            {Object.entries(TYPE_META).map(([k,v]) => (
              <span key={k} style={{ fontSize:11, fontWeight:700, background:v.bg, color:v.color, padding:'3px 10px', borderRadius:20 }}>{k}</span>
            ))}
          </div>
        </div>
        <div>
          {HOLIDAYS.map((h, i) => {
            const meta = TYPE_META[h.type];
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:20, padding:'16px 24px',
                borderBottom: i<HOLIDAYS.length-1 ? '1px solid #f1f5f9' : 'none',
                opacity: h.past ? 0.5 : 1,
                background: !h.past && i === past.length ? C.blueSoft : 'transparent',
              }}>
                {/* Date box */}
                <div style={{
                  width:52, height:52, borderRadius:14, flexShrink:0, textAlign:'center',
                  background: h.past ? '#f1f5f9' : meta.bg,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                }}>
                  <div style={{ fontSize:18, fontWeight:800, color: h.past ? C.faint : meta.color, lineHeight:1 }}>
                    {h.date.split(' ')[1]}
                  </div>
                  <div style={{ fontSize:9, fontWeight:700, color: h.past ? C.faint : meta.color, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:2 }}>
                    {h.date.split(' ')[0]}
                  </div>
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color: h.past ? C.muted : C.text }}>{h.name}</div>
                  <div style={{ fontSize:12, color:C.faint, marginTop:2 }}>{h.day}</div>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:11, fontWeight:700, background:meta.bg, color:meta.color, padding:'3px 10px', borderRadius:20 }}>{h.type}</span>
                  {h.past && <span style={{ fontSize:11, fontWeight:600, color:C.faint }}>Past</span>}
                  {!h.past && <span style={{ fontSize:11, fontWeight:600, background:'#dcfce7', color:C.green, padding:'3px 10px', borderRadius:20 }}>Upcoming</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}