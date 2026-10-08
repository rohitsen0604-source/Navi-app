import React from 'react';
import {
  Compass,
  Ship,
  Users,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardView({ stats, onNavigate }) {
  const cards = [
    {
      title: 'Active Rides Now',
      val: stats?.activeRides ?? 0,
      icon: Compass,
      color: '#0284c7',
      bg: '#e0f2fe',
      desc: 'Boats underway on river'
    },
    {
      title: 'Drivers On Duty',
      val: stats?.onDutyDrivers ?? 0,
      icon: Users,
      color: '#10b981',
      bg: '#d1fae5',
      desc: 'Available for instant assignment'
    },
    {
      title: 'Total Revenue',
      val: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: IndianRupee,
      color: '#0d9488',
      bg: '#ccfbf1',
      desc: 'Prepaid + Cash on Ghat'
    },
    {
      title: 'Total Vessels Registered',
      val: stats?.totalBoats ?? 0,
      icon: Ship,
      color: '#6366f1',
      bg: '#ede9fe',
      desc: 'Varanasi Fleet'
    },
    {
      title: 'Pending Allocation',
      val: stats?.pendingRequests ?? 0,
      icon: Clock,
      color: '#f59e0b',
      bg: '#fef3c7',
      desc: 'Matching nearest boatman'
    },
    {
      title: 'Active SOS Incidents',
      val: stats?.pendingSOS ?? 0,
      icon: AlertTriangle,
      color: '#ef4444',
      bg: '#fee2e2',
      desc: 'Critical emergency alerts'
    }
  ];

  return (
    <div>
      {/* Metrics Grid */}
      <div className="stat-grid">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{c.title}</span>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{c.val}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch & Operational Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 12 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>95% Interconnection Status & Dispatch Overview</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Continuous sync across Customer App, Driver App and Central Dispatch</p>
            </div>
            <button onClick={() => onNavigate('bookings')} className="btn btn-outline" style={{ fontSize: 13 }}>
              View Bookings <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>DISPATCH ENGINE</p>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: '#059669' }}>Operational (Active)</h4>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Redis atomic locking preventing double bookings</p>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>RIVER CORRIDOR</p>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>15 Zones Connected</h4>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Assi Ghat to Sant Ravidas Ghat sectors</p>
            </div>
            <div style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>CALL CENTER ENGINE</p>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>Unified DB Ready</h4>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Single source of truth with customer app</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Operator Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => onNavigate('call_center')} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              + Create Phone Booking
            </button>
            <button onClick={() => onNavigate('bookings')} className="btn btn-outline" style={{ justifyContent: 'center' }}>
              Reassign Driver / Boat
            </button>
            <button onClick={() => onNavigate('drivers')} className="btn btn-outline" style={{ justifyContent: 'center' }}>
              Review Driver KYC Approvals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
