// pages/employee/EmployeePortalLayout.jsx
// Used as the layout wrapper when user.role === 'Employee'
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { icon: '👤', label: 'My Profile',  to: '/my-profile'    },
  { icon: '📅', label: 'Attendance',  to: '/my-attendance'  },
  { icon: '🌴', label: 'Leave',       to: '/my-leave'       },
  { icon: '💰', label: 'Payroll',     to: '/my-payroll'     },
  { icon: '🎉', label: 'Holidays',    to: '/my-holidays'    },
  { icon: '📄', label: 'Documents',   to: '/my-documents'   },
  { icon: '⚙️', label: 'Settings',   to: '/settings'        },
];

export default function EmployeePortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'ME';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f0f5ff' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 220,
        background: '#1d4ed8', display: 'flex', flexDirection: 'column',
        zIndex: 100, boxShadow: '4px 0 24px rgba(29,78,216,0.15)',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            HR<span style={{ color: '#93c5fd' }}>MS</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Employee Portal
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                fontSize: 13.5, fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.18s',
              })}
            >
              <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer user */}
        <div style={{ padding: '16px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, width: '100%',
              background: 'transparent', border: 'none', cursor: 'pointer',
              transition: 'background 0.18s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#60a5fa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13, color: '#1d4ed8', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user?.name || 'Employee'}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{user?.designation || 'Employee'}</div>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 220, padding: 32, flex: 1, minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}