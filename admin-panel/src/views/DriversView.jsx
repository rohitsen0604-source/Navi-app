import React from 'react';
import { Users, CheckCircle, Clock, ShieldCheck, XCircle } from 'lucide-react';
import api from '../services/api';

export default function DriversView({ drivers, onRefresh }) {
  const handleApproval = async (driverId, approvalStatus) => {
    try {
      await api.post('/admin/driver-approval', {
        driverId,
        approvalStatus
      });
      alert(`Driver status updated to ${approvalStatus}`);
      onRefresh();
    } catch (err) {
      alert(`Update failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Boatmen & Drivers Fleet</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>KYC approvals, duty status, and vessel associations</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>DRIVER CODE</th>
              <th>NAME & CONTACT</th>
              <th>OPERATIONAL ZONE</th>
              <th>ASSIGNED VESSEL</th>
              <th>DUTY STATUS</th>
              <th>KYC STATUS</th>
              <th>RATING / TRIPS</th>
              <th>APPROVAL ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d._id}>
                <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>{d.driverCode}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.phone}</div>
                </td>
                <td style={{ fontWeight: 600 }}>Zone {d.operationalZoneNumber}</td>
                <td>
                  {d.assignedBoatId ? (
                    <div>
                      <div style={{ fontWeight: 600 }}>{d.assignedBoatId.name}</div>
                      <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {d.assignedBoatId.customBoatId}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Unlinked</span>
                  )}
                </td>
                <td>
                  {d.isDutyOn ? (
                    <span className="badge badge-success">🟢 On Duty</span>
                  ) : (
                    <span className="badge badge-warning">⚪ Off Duty</span>
                  )}
                </td>
                <td>
                  {d.approvalStatus === 'APPROVED' ? (
                    <span className="badge badge-success"><ShieldCheck size={12} /> Approved</span>
                  ) : (
                    <span className="badge badge-warning"><Clock size={12} /> {d.approvalStatus}</span>
                  )}
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>★ {d.rating}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.totalRidesCompleted} rides completed</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {d.approvalStatus !== 'APPROVED' && (
                      <button
                        onClick={() => handleApproval(d._id, 'APPROVED')}
                        className="btn btn-outline"
                        style={{ fontSize: 11, padding: '4px 8px', color: '#059669', borderColor: '#a7f3d0' }}
                      >
                        Approve
                      </button>
                    )}
                    {d.approvalStatus !== 'SUSPENDED' && (
                      <button
                        onClick={() => handleApproval(d._id, 'SUSPENDED')}
                        className="btn btn-outline"
                        style={{ fontSize: 11, padding: '4px 8px', color: '#e11d48', borderColor: '#fecdd3' }}
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
