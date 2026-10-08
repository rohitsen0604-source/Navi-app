import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Headphones,
  AlertTriangle,
  Users,
  Anchor,
  Sailboat,
  Waves,
  MapPin,
  Compass,
  Tag,
  DollarSign,
  CreditCard,
  Percent,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, user, onLogout }) {
  const userPermissions = user?.permissions || ['*'];
  const hasPermission = (tabId) => {
    if (userPermissions.includes('*') || user?.role === 'SUPER_ADMIN') return true;
    return userPermissions.includes(tabId);
  };

  const navSections = [
    {
      title: 'OPERATIONS & DISPATCH',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings & Dispatch', icon: CalendarCheck },
        { id: 'call_center', label: 'Call-Center Booking', icon: Headphones },
        { id: 'sos', label: 'Emergency SOS Desk', icon: AlertTriangle, badge: 'Live' }
      ]
    },
    {
      title: 'FLEET & PEOPLE',
      items: [
        { id: 'customers', label: 'Customer Directory', icon: Users },
        { id: 'drivers', label: 'Boatmen & Drivers', icon: Anchor },
        { id: 'boats', label: 'Boat Fleet Registry', icon: Sailboat }
      ]
    },
    {
      title: 'WATERWAYS MASTER DATA',
      items: [
        { id: 'rivers', label: 'Rivers & Lakes', icon: Waves },
        { id: 'zones', label: 'Corridor Zones', icon: MapPin },
        { id: 'ghats', label: 'Ghats & Boarding Points', icon: Compass },
        { id: 'rides', label: 'Ride Setup & Types', icon: Tag }
      ]
    },
    {
      title: 'FINANCE & PROMOTIONS',
      items: [
        { id: 'pricing', label: 'Pricing & Fare Config', icon: DollarSign },
        { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
        { id: 'coupons', label: 'Promo Codes & Coupons', icon: Percent }
      ]
    },
    {
      title: 'GOVERNANCE & SYSTEM',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'audit', label: 'Activity & Audit Log', icon: FileText },
        { id: 'settings', label: 'System Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="admin-sidebar" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#121418',
      borderRight: '1px solid #23262D'
    }}>
      {/* Brand Header with Circular Naavi Logo */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid #23262D',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        {/* Circular Naavi Logo Badge */}
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'var(--primary)',
          boxShadow: '0 3px 12px rgba(235,77,55,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '2px solid rgba(255,255,255,0.18)'
        }}>
          <img
            src="/assets/naavi_logo.png"
            alt="Naavi Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
        <div>
          <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: 18, letterSpacing: -0.3 }}>NAAVI</div>
          <div style={{ color: 'var(--primary-hover)', fontSize: 10.5, fontWeight: 800, letterSpacing: 0.8 }}>ADMIN COMMAND</div>
        </div>
      </div>

      {/* Nav Items List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px 12px'
      }}>
        {navSections.map((sec, idx) => {
          const visibleItems = sec.items.filter(item => hasPermission(item.id));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} style={{ marginBottom: 16 }}>
              <div style={{
                color: '#828792',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 0.8,
                padding: '4px 12px 6px',
                textTransform: 'uppercase'
              }}>
                {sec.title}
              </div>

              {visibleItems.map(item => {
                const IconComponent = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: 3,
                      background: isActive ? 'var(--primary)' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#C0C4CC',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: 13,
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      boxShadow: isActive ? '0 4px 14px rgba(235,77,55,0.35)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#1E222A';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#C0C4CC';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <IconComponent
                        size={17}
                        color={isActive ? '#FFFFFF' : '#A0A5AF'}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span style={{
                        background: isActive ? '#FFFFFF' : 'rgba(235,77,55,0.2)',
                        color: isActive ? 'var(--primary)' : 'var(--primary-hover)',
                        fontSize: 10,
                        padding: '2px 7px',
                        borderRadius: 6,
                        fontWeight: 800
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* User Profile & Logout Bottom Bar */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid #23262D',
        background: '#0E0F12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 13,
            flexShrink: 0
          }}>
            {user?.name?.[0] || 'A'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Administrator'}
            </div>
            <div style={{ color: '#8E939E', fontSize: 11, fontWeight: 600 }}>
              {user?.role?.replace('_', ' ') || 'Super Admin'}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sign Out"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#A0A5AF',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.background = '#1E222A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#A0A5AF';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}

