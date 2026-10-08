import React from 'react';
import {
  CalendarCheck,
  Sailboat,
  Anchor,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export default function DashboardView({ stats, onNavigate, bookings = [], drivers = [], ghats = [] }) {
  const activeBookings = bookings.filter(b => b.status === 'DRIVER_ASSIGNED' || b.status === 'RIDE_STARTED');
  const completedBookings = bookings.filter(b => b.status === 'RIDE_COMPLETED');

  return (
    <div>
      {/* Page Hero Header with Image */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-title">
            <span>Operations & Dispatch Control Center</span>
            <span style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 20,
              background: 'rgba(16,185,129,0.25)',
              border: '1px solid #10B981',
              color: '#A7F3D0',
              fontWeight: 800
            }}>
              LIVE GPS TELEMETRY
            </span>
          </div>
          <div className="page-hero-subtitle">
            Varanasi 84 Ghat Corridor • Central Fleet Tracking, Passenger Ticketing & Emergency SOS Monitor
          </div>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-box">
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL REVENUE</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
              ₹{(stats?.totalRevenue || 14850).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--success)', fontWeight: 700, marginTop: 2 }}>
              +18.4% vs yesterday
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#FFF4EB', color: 'var(--accent)' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE RIDES</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
              {stats?.activeRides || activeBookings.length || 2}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
              Cruising on Ganga
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#ECFDF5', color: 'var(--success)' }}>
            <Sailboat size={24} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>ON-DUTY FLEET</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
              {stats?.activeBoats || 5} / {stats?.totalBoats || 5}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--success)', fontWeight: 700, marginTop: 2 }}>
              {stats?.fleetUtilizationPercentage || 78}% Utilization
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#F1F5F9', color: '#475569' }}>
            <Anchor size={24} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>ON-DUTY DRIVERS</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
              {stats?.onDutyDrivers || drivers.filter(d => d.isDutyOn).length || 4}
            </div>
            <div style={{ fontSize: 11.5, color: '#059669', fontWeight: 600, marginTop: 2 }}>
              Ready for allocation
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Dispatch Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 24 }}>
        <div
          className="card"
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--primary)', background: '#FFFDFD' }}
          onClick={() => onNavigate('call_center')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>Phone Assisted Booking</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
                Instant on-the-spot dispatch for incoming helpline calls
              </div>
            </div>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PhoneCall size={18} />
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--accent)', background: '#FFFDFD' }}
          onClick={() => onNavigate('bookings')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>Live Dispatch Console</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
                Assign & reassign boatmen across 4 river corridor zones
              </div>
            </div>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#FFF4EB',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Anchor size={18} />
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{ cursor: 'pointer', borderLeft: '4px solid #10B981', background: '#FFFDFD' }}
          onClick={() => onNavigate('pricing')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>Dynamic Pricing & Surge</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
                Adjust Subah-e-Banaras & Aarti festival surge multipliers
              </div>
            </div>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Split Section: Recent Live Bookings & Zone Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Recent Live Rides */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>Live & Recent Rides</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Latest trip allocations and passenger tickets</p>
            </div>
            <button
              onClick={() => onNavigate('bookings')}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Ghat & Vessel</th>
                  <th>Passenger</th>
                  <th>Fare</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(bookings.length > 0 ? bookings.slice(0, 5) : [
                  { bookingCode: 'NV-982134', boardingGhat: 'Dashashwamedh', boatCategory: 'MOTOR_BOAT', customerName: 'Rahul Sharma', finalPayableAmount: 1150, status: 'RIDE_COMPLETED' },
                  { bookingCode: 'NV-748921', boardingGhat: 'Assi Ghat', boatCategory: 'LUXURY_BAJRA', customerName: 'Ananya Pandey', finalPayableAmount: 1800, status: 'DRIVER_ASSIGNED' },
                  { bookingCode: 'NV-600052', boardingGhat: 'Rajghat', boatCategory: 'SPEED_BOAT', customerName: 'Vikram Singh', finalPayableAmount: 600, status: 'RIDE_COMPLETED' },
                ]).map((b, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="font-mono" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 12.5 }}>
                        {b.bookingCode}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{b.boardingGhat || 'Dashashwamedh'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.boatCategory?.replace('_', ' ')}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{b.customerName || 'Passenger'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.customerPhone || '+91 98765...'}</div>
                    </td>
                    <td style={{ fontWeight: 800 }}>₹{b.finalPayableAmount}</td>
                    <td>
                      <span className={`badge ${
                        b.status === 'RIDE_COMPLETED' ? 'badge-success' :
                        b.status === 'CANCELLED' ? 'badge-danger' :
                        b.status === 'DRIVER_ASSIGNED' ? 'badge-warning' : 'badge-primary'
                      }`}>
                        {b.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ghat Zone Utilization & Safety Monitor */}
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>Corridor Safety & Dock Status</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Varanasi Waterways Authority zone status</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              padding: '14px',
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5 }}>Zone 1: Dashashwamedh Central</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>14 Boats Docked • Peak Safety Active</div>
              </div>
              <span className="badge badge-success">Normal</span>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5 }}>Zone 2: Assi Southern Corridor</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>9 Boats Docked • Subah-e-Banaras Active</div>
              </div>
              <span className="badge badge-success">Normal</span>
            </div>

            <div style={{
              padding: '14px',
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5 }}>Zone 3: Namo Northern Ghats</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>11 Boats Docked • High Current Advisory</div>
              </div>
              <span className="badge badge-warning">Caution</span>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <div style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>
                Water Police Hotline active (112 / +91 542 2508000). All boats equipped with GPS life buoys.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
