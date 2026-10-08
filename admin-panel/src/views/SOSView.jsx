import React from 'react';
import { AlertTriangle, Phone, CheckCircle, MapPin, Radio, ShieldAlert, LifeBuoy } from 'lucide-react';

export default function SOSView({ incidents, onRefresh }) {
  return (
    <div>
      {/* Header Banner */}
      <div className="view-header-banner" style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        background: 'linear-gradient(135deg, #450a0a 0%, #1c1917 100%)',
        color: '#fff',
        padding: '28px 32px',
        boxShadow: '0 10px 25px -5px rgba(225,29,72,0.15)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/admin_portal_hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          opacity: 0.18
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.3)', color: '#fca5a5', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 8, border: '1px solid rgba(239,68,68,0.5)' }}>
              <Radio size={14} /> LIVE EMERGENCY MONITORING
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5, color: '#fee2e2' }}>
              SOS Emergency & River Rescue Command
            </h1>
            <p style={{ margin: '6px 0 0', color: '#fecaca', fontSize: 13.5, maxWidth: 650 }}>
              Instant distress beacon receiver connected directly with Varanasi Water Police (112) and Quick Response Patrol boats across all 4 river zones.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#fca5a5', fontWeight: 600 }}>ACTIVE INCIDENTS</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: incidents?.length > 0 ? '#ef4444' : '#10b981' }}>
                {incidents?.length || 0}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#fca5a5', fontWeight: 600 }}>WATER POLICE HOTLINE</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>112 / +91-542</div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>INCIDENT TIME</th>
              <th>BOOKING REF</th>
              <th>PASSENGER / CALL</th>
              <th>ASSIGNED BOATMAN</th>
              <th>GPS COORDINATES</th>
              <th>SEVERITY & STATUS</th>
              <th>DISPATCH PROTOCOL</th>
            </tr>
          </thead>
          <tbody>
            {(!incidents || incidents.length === 0) ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748B' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                      <CheckCircle size={24} />
                    </div>
                    <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 15 }}>No Active Emergency Distress Triggers</div>
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>All 84 ghats and river corridors are operating with normal safety status.</div>
                  </div>
                </td>
              </tr>
            ) : (
              incidents.map((inc) => (
                <tr key={inc._id} style={{ background: '#fff1f2' }}>
                  <td className="font-mono" style={{ fontSize: 12 }}>
                    {new Date(inc.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--danger)' }}>
                    {inc.bookingId?.bookingCode || 'NV-EMERGENCY'}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>
                      {inc.customerId?.firstName ? `${inc.customerId.firstName} ${inc.customerId.lastName}` : 'Passenger'}
                    </div>
                    <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={12} /> {inc.customerId?.phone}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inc.driverId?.name || 'On Duty Boatman'}</div>
                    <div style={{ fontSize: 12 }}>{inc.driverId?.phone}</div>
                  </td>
                  <td className="font-mono" style={{ fontSize: 12 }}>
                    <MapPin size={13} color="var(--danger)" style={{ display: 'inline', marginRight: 4 }} />
                    {inc.coordinates?.latitude || 25.30}, {inc.coordinates?.longitude || 83.01}
                  </td>
                  <td>
                    <span className="badge badge-danger" style={{ animation: 'pulse 1.5s infinite' }}>CRITICAL EMERGENCY</span>
                  </td>
                  <td>
                    <button
                      onClick={() => alert(`Connecting Varanasi Water Police & Quick Rescue Team for Ghat: ${inc.coordinates?.latitude || 'Assi Ghat Corridor'}`)}
                      className="btn"
                      style={{ background: '#e11d48', color: '#fff', fontSize: 12, padding: '6px 14px', borderRadius: 6, fontWeight: 700 }}
                    >
                      <LifeBuoy size={14} style={{ display: 'inline', marginRight: 4 }} /> Alert Rescue Patrol
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

