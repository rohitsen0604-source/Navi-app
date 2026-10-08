import React from 'react';
import { AlertTriangle, Phone, CheckCircle, MapPin } from 'lucide-react';

export default function SOSView({ incidents, onRefresh }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e11d48', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> SOS Emergency Incident Command Desk
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Real-time river emergency triggers from Customer & Driver mobile applications
          </p>
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
            {incidents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  ✅ No active SOS emergency alerts. All river operations normal.
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
                    <span className="badge badge-danger">CRITICAL EMERGENCY</span>
                  </td>
                  <td>
                    <button
                      onClick={() => alert(`Connecting Varanasi Water Police & Quick Rescue Team for Ghat: ${inc.coordinates?.latitude}`)}
                      className="btn"
                      style={{ background: '#e11d48', color: '#fff', fontSize: 12, padding: '6px 12px' }}
                    >
                      Alert Water Police & Rescue
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
