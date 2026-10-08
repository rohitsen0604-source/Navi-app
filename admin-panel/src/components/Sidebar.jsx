import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Ship,
  Users,
  PhoneCall,
  AlertTriangle,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Operations Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Live Bookings & Control', icon: Compass },
    { id: 'master_data', label: 'Zones & Ghats & Boats', icon: Ship },
    { id: 'drivers', label: 'Boatmen / Drivers', icon: Users },
    { id: 'call_center', label: 'Call Center Booking', icon: PhoneCall },
    { id: 'sos', label: 'SOS Emergency Desk', icon: AlertTriangle, badge: 'Active' },
    { id: 'reports', label: 'Analytics & Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  return (
    <aside className="admin-sidebar">
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0284c7, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 20 }}>
          ⚓
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>NAAVI OPS</h2>
          <p style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Command Center</p>
        </div>
      </div>

      <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                width: '100%',
                borderRadius: 10,
                border: 'none',
                background: isActive ? 'rgba(2, 132, 199, 0.18)' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 10, padding: '2px 6px', background: '#ef4444', color: '#fff', borderRadius: 99, fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: 16, borderTop: '1px solid #1e293b', background: '#0b1120' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
            SA
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600 }}>Super Admin</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>Varanasi Central Desk</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
