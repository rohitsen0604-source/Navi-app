import React, { useState } from 'react';
import { Compass, UserCheck, RefreshCw, X, ShieldAlert } from 'lucide-react';
import api from '../services/api';

export default function BookingsView({ bookings, drivers, onRefresh }) {
  const [filter, setFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reassignDriverId, setReassignDriverId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  const handleReassignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !reassignDriverId) return;

    try {
      setSubmitting(true);
      await api.post('/admin/reassign', {
        bookingId: selectedBooking._id,
        newDriverId: reassignDriverId,
        reason: reassignReason || 'Operations manual reassignment from dashboard'
      });
      alert('Driver reassigned successfully. Customer and driver apps notified!');
      setSelectedBooking(null);
      setReassignDriverId('');
      setReassignReason('');
      onRefresh();
    } catch (err) {
      alert(`Reassign failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RIDE_STARTED':
        return <span className="badge badge-info">Ride Underway</span>;
      case 'DRIVER_ASSIGNED':
        return <span className="badge badge-success">Assigned</span>;
      case 'SEARCHING_DRIVER':
      case 'DRIVER_REQUESTED':
        return <span className="badge badge-warning">Searching Boatman</span>;
      case 'RIDE_COMPLETED':
      case 'PAYMENT_COMPLETED':
        return <span className="badge badge-success">Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Booking Stream & Dispatch Control</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Real-time single source of truth across all channels</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'SEARCHING_DRIVER', 'DRIVER_ASSIGNED', 'RIDE_STARTED', 'RIDE_COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className="btn btn-outline"
              style={{
                fontSize: 12,
                padding: '6px 12px',
                background: filter === st ? 'var(--primary-light)' : '#fff',
                borderColor: filter === st ? 'var(--primary)' : 'var(--border)',
                color: filter === st ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: filter === st ? 700 : 500
              }}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>BOOKING REF</th>
              <th>CUSTOMER</th>
              <th>GHAT / SECTOR</th>
              <th>VESSEL TYPE</th>
              <th>SEATS</th>
              <th>PAYMENT & FARE</th>
              <th>STATUS</th>
              <th>BOATMAN ASSIGNED</th>
              <th>OPERATIONS ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No bookings found for selected filter.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b._id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {b.bookingCode}
                    {b.bookingType === 'BOOK_LATER' && (
                      <span style={{ display: 'block', fontSize: 10, color: '#f59e0b', fontWeight: 600 }}>T+2 SCHEDULED</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.customerId?.firstName ? `${b.customerId.firstName} ${b.customerId.lastName}` : 'Walk-in Guest'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.customerId?.phone || 'N/A'}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.boardingPointId?.name || `Zone ${b.zoneNumber}`}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Zone {b.zoneNumber}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.boatCategory?.replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.tripType?.replace(/_/g, ' ')}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{b.seatsBooked} Pax</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>₹{b.finalPayableAmount}</div>
                    <div style={{ fontSize: 11, color: b.paymentMode === 'ONLINE_PREPAID' ? '#059669' : '#d97706', fontWeight: 600 }}>
                      {b.paymentMode?.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    {b.driverId ? (
                      <div>
                        <div style={{ fontWeight: 600 }}>{b.driverId.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.boatId?.customBoatId || b.driverId.phone}</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="btn btn-outline"
                      style={{ fontSize: 12, padding: '6px 12px' }}
                    >
                      <UserCheck size={14} /> Reassign
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Driver Reassignment Modal */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Manual Driver Reassignment</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Booking {selectedBooking.bookingCode} • Zone {selectedBooking.zoneNumber}
                </p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="btn btn-outline" style={{ padding: '6px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Select Replacement Driver
                </label>
                <select
                  required
                  value={reassignDriverId}
                  onChange={(e) => setReassignDriverId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}
                >
                  <option value="">-- Choose Boatman / Driver --</option>
                  {drivers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.driverCode}) • Zone {d.operationalZoneNumber} • {d.isDutyOn ? '🟢 On Duty' : '⚪ Off Duty'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Operational Reason (Recorded in Audit Log)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Current boat experiencing mechanical delay"
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={() => setSelectedBooking(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Applying Change...' : 'Confirm Reassignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
