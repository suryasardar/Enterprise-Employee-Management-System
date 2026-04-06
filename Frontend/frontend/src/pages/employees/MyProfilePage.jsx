// pages/employee/MyProfilePage.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/* ─── tiny helpers ─────────────────────────────────────── */
const initials = name =>
  name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'ME';

function ProgressBar({ pct }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 5 }}>
        <span>Leave Used</span>
        <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{pct}%</span>
      </div>
      <div style={{ height: 7, background: '#e8f0fe', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#1d4ed8,#60a5fa)', borderRadius: 10 }} />
      </div>
    </div>
  );
}

function AttendanceBar({ pct }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 5 }}>
        <span>Attendance Rate</span>
        <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{pct}%</span>
      </div>
      <div style={{ height: 7, background: '#e8f0fe', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#1d4ed8,#60a5fa)', borderRadius: 10 }} />
      </div>
    </div>
  );
}

function StatCard({ children, style }) {
  return (
    <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #e8f0fe', padding: 20, ...style }}>
      {children}
    </div>
  );
}

function StatTitle({ icon, children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontSize: 15 }}>{icon}</span>{children}
    </div>
  );
}

function StatRow({ label, value, color }) {
  const colors = { green: '#16a34a', amber: '#d97706', red: '#dc2626', default: '#1e293b' };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: colors[color] || colors.default }}>{value}</span>
    </div>
  );
}

const PANELS = {
  leave:      { title: '🌴 Leave Management',   body: 'You have <strong>2 pending leave requests</strong>. Apply for new leaves, track approvals, and view your leave balance here.' },
  payroll:    { title: '💰 Payroll',             body: 'Your <strong>March 2026 salary (₹75,800)</strong> has been credited. Next payroll date is <strong>April 30, 2026</strong>.' },
  holidays:   { title: '🎉 Holiday Calendar',    body: 'Upcoming holidays: <strong>Dr. Ambedkar Jayanti (Apr 14)</strong>, Good Friday (Apr 18), Maharashtra Day (May 1). 3 more in Q2 2026.' },
  attendance: { title: '📅 Attendance',          body: 'Present for <strong>3 days</strong> in April 2026 with <strong>100% attendance rate</strong>. 1 late check-in on Apr 02.' },
};

export default function MyProfilePage() {
  const { user } = useAuth();

  // Check-in state
  const [checkedIn, setCheckedIn]     = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInLabel, setCheckInLabel]   = useState('Check In');
  const [checkInSub, setCheckInSub]       = useState('Not checked in');
  const [checkInIcon, setCheckInIcon]     = useState('🟢');
  const [checkOutLabel, setCheckOutLabel] = useState('Check Out');
  const [checkOutSub, setCheckOutSub]     = useState('—');
  const [checkOutIcon, setCheckOutIcon]   = useState('🔴');

  // Info panel
  const [panel, setPanel] = useState(null);

  const handleCheckIn = () => {
    if (checkedIn) return;
    const now = new Date();
    setCheckedIn(true);
    setCheckInTime(now);
    setCheckInIcon('✅');
    setCheckInLabel('Checked In');
    setCheckInSub(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setPanel('attendance');
  };

  const handleCheckOut = () => {
    if (!checkedIn || !checkInTime) return;
    const now = new Date();
    const diff = Math.round((now - checkInTime) / 60000);
    const h = Math.floor(diff / 60), m = diff % 60;
    setCheckOutIcon('👋');
    setCheckOutLabel('Checked Out');
    setCheckOutSub(`${h}h ${m}m worked`);
    setCheckedIn(false);
    setPanel(null);
  };

  // Merge real user data with demo fallback
  const emp = {
    name:        user?.username        || 'Alice Babu',
    email:       user?.email       || 'alice@company.com',
    phone:       user?.phone       || '+91 9123456780',
    designation: user?.designation || 'Software Engineer',
    department:  user?.department  || 'Engineering',
    manager:     user?.manager     || 'Rahul Mehta',
    empId:       user?.empId       || 'EMP-00142',
    joined:      user?.joined      || '12 Jan 2022',
    username:    user?.username    || 'alice_dev',
    service:     user?.service     || '4 years 2 months',
    status:      user?.status      || 'Active',
  };

  const av = initials(emp.name);

  /* ─── styles ─────────────────────────────────────────── */
  const card = { background: '#fff', borderRadius: 18, border: '1.5px solid #e8f0fe', overflow: 'hidden' };
  const cardHeader = { padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
  const fieldLabel = { fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 };
  const fieldValue = { fontSize: 14, fontWeight: 500, color: '#1e293b' };
  const fieldMono  = { ...fieldValue, fontFamily: "'DM Mono', monospace", fontSize: 13 };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* ── Topbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
            Employee <span style={{ color: '#1d4ed8' }}>Profile</span>
          </div>
          <div style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 2 }}>Dashboard / {emp.name}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={btnOutline}>✏️ Edit Profile</button>
          <button style={btnPrimary}>📤 Export</button>
        </div>
      </div>

      {/* ── Profile Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%)',
        borderRadius: 20, padding: '32px 36px', display: 'flex', alignItems: 'center', gap: 28,
        marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -80, right: 80, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{
          width: 88, height: 88, borderRadius: 20,
          background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>{av}</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{emp.name}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{emp.designation} · {emp.department} Department</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
            {[emp.email, emp.phone, `Reports to: ${emp.manager}`].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#93c5fd', flexShrink: 0, display: 'inline-block' }} />
                {t}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              {emp.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, position: 'relative', zIndex: 1 }}>
          {[['Employee ID', emp.empId], ['Joined', emp.joined]].map(([label, value]) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12, padding: '10px 16px', textAlign: 'right', backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 500, color: '#fff', marginTop: 2 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
        Quick Actions
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginBottom: panel ? 0 : 24 }}>
        <QACard icon="🌴" label="Leave"      sub="Apply / View"   badge={2}   onClick={() => setPanel(p => p === 'leave'      ? null : 'leave')}      />
        <QACard icon="💰" label="Payroll"    sub="Slips & Pay"               onClick={() => setPanel(p => p === 'payroll'    ? null : 'payroll')}    />
        <QACard icon="🎉" label="Holidays"   sub="2026 Calendar"             onClick={() => setPanel(p => p === 'holidays'   ? null : 'holidays')}   />
        <QACard icon="📅" label="Attendance" sub="This Month"                onClick={() => setPanel(p => p === 'attendance' ? null : 'attendance')} />
        <QACard icon={checkInIcon}  label={checkInLabel}  sub={checkInSub}  onClick={handleCheckIn}  />
        <QACard icon={checkOutIcon} label={checkOutLabel} sub={checkOutSub} onClick={handleCheckOut} />
      </div>

      {/* ── Info Panel ── */}
      {panel && (
        <div style={{
          background: '#fff', border: '1.5px solid #bfdbfe', borderRadius: 16,
          padding: '20px 24px', marginBottom: 20, marginTop: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{PANELS[panel].title}</div>
            <button onClick={() => setPanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
          </div>
          <div
            style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: PANELS[panel].body }}
          />
        </div>
      )}

      {/* ── Two-col ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Personal Info */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Personal Information</span>
              <span style={{ fontSize: 12.5, color: '#1d4ed8', fontWeight: 600, cursor: 'pointer' }}>Edit ✏️</span>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                {[
                  ['Full Name',  emp.name,     false],
                  ['Username',   emp.username,  true ],
                  ['Email',      emp.email,     false],
                  ['Phone',      emp.phone,     false],
                  ['Role',       'Employee',    false],
                  ['Status',     emp.status,    false, '#16a34a'],
                ].map(([lbl, val, mono, color]) => (
                  <div key={lbl}>
                    <div style={fieldLabel}>{lbl}</div>
                    <div style={{ ...(mono ? fieldMono : fieldValue), ...(color ? { color, fontWeight: 600 } : {}) }}>
                      {color ? `● ${val}` : val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Work Details</span>
              <span style={{ fontSize: 12.5, color: '#1d4ed8', fontWeight: 600, cursor: 'pointer' }}>Edit ✏️</span>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                {[
                  ['Employee ID',       emp.empId,      true ],
                  ['Department',        emp.department,  false],
                  ['Designation',       emp.designation, false],
                  ['Joining Date',      emp.joined,      false],
                  ['Reporting Manager', emp.manager,     false],
                  ['Years of Service',  emp.service,     false],
                ].map(([lbl, val, mono]) => (
                  <div key={lbl}>
                    <div style={fieldLabel}>{lbl}</div>
                    <div style={mono ? fieldMono : fieldValue}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={card}>
            <div style={cardHeader}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Recent Activity</span>
            </div>
            <div style={{ padding: '8px 24px' }}>
              {[
                { dot: '#1d4ed8', title: 'Leave request approved — Casual Leave (2 days)', time: 'Today, 10:15 AM' },
                { dot: '#f59e0b', title: 'Payslip for March 2026 generated',               time: 'Apr 01, 9:00 AM' },
                { dot: '#10b981', title: 'Checked in at 9:02 AM · 8h 45m worked',          time: 'Apr 02, 9:02 AM' },
                { dot: '#6366f1', title: 'Holiday added: Dr. Ambedkar Jayanti — Apr 14',   time: 'Mar 30'          },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: a.dot, marginTop: 4, flexShrink: 0 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{a.title}</div>
                    <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Leave Summary */}
          <StatCard>
            <StatTitle icon="🌴">Leave Summary</StatTitle>
            <StatRow label="Casual Leave"     value="8 / 12" color="green" />
            <StatRow label="Sick Leave"       value="5 / 7"  color="green" />
            <StatRow label="Earned Leave"     value="2 / 10" color="amber" />
            <StatRow label="Pending Requests" value="2"      color="red"   />
            <ProgressBar pct={50} />
          </StatCard>

          {/* Attendance */}
          <StatCard>
            <StatTitle icon="📅">Attendance — April 2026</StatTitle>
            <StatRow label="Present Days"   value="3"      color="green" />
            <StatRow label="Absent Days"    value="0"      color="red"   />
            <StatRow label="Late Check-ins" value="1"      color="amber" />
            <StatRow label="Avg Hours/Day"  value="8h 32m"              />
            <AttendanceBar pct={100} />
          </StatCard>

          {/* Payroll */}
          <StatCard>
            <StatTitle icon="💰">Payroll — March 2026</StatTitle>
            <StatRow label="Gross Salary" value="₹85,000"    />
            <StatRow label="Deductions"   value="–₹9,200"  color="red"   />
            <StatRow label="Net Pay"      value="₹75,800"  color="green" />
            <StatRow label="Status"       value="Credited ✓" color="green" />
            <button style={{ ...btnOutline, width: '100%', marginTop: 14, justifyContent: 'center', fontSize: 12.5 }}>
              📥 Download Payslip
            </button>
          </StatCard>

          {/* Holidays */}
          <StatCard>
            <StatTitle icon="🎉">Upcoming Holidays</StatTitle>
            <StatRow label="Dr. Ambedkar Jayanti" value="Apr 14" />
            <StatRow label="Good Friday"           value="Apr 18" />
            <StatRow label="Maharashtra Day"       value="May 1"  />
          </StatCard>
        </div>
      </div>
    </div>
  );
}

/* ─── Quick-Action Card ─────────────────────────────────── */
function QACard({ icon, label, sub, badge, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 16, padding: '18px 12px 16px',
        textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        border: hovered ? '1.5px solid #1d4ed8' : '1.5px solid #e8f0fe',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(29,78,216,0.12)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      {badge && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700,
          width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</div>
      )}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: hovered ? '#1d4ed8' : '#eff6ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, margin: '0 auto 10px', transition: 'all 0.2s',
      }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{label}</div>
      <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* ─── Shared button styles ──────────────────────────────── */
const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px',
  borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
  border: 'none', background: '#1d4ed8', color: '#fff', fontFamily: 'inherit',
};
const btnOutline = {
  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px',
  borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
  border: '1.5px solid #bfdbfe', background: '#fff', color: '#1d4ed8', fontFamily: 'inherit',
};