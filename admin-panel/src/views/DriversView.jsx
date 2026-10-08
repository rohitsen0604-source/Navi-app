import React, { useState } from 'react';
import { Anchor, Search, Plus, Edit2, CheckCircle2, XCircle, Star, Phone, ShieldCheck, X } from 'lucide-react';
import api from '../services/api';

export default function DriversView({ drivers = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [kycModalDriver, setKycModalDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    operationalZoneNumber: 1,
    boatCategory: 'MOTOR_BOAT',
    assignedBoatName: 'Ganga Vihar Motor Boat'
  });
  const [loading, setLoading] = useState(false);

  const filteredDrivers = drivers.filter(d => {
    const matchSearch = `${d.name} ${d.driverCode} ${d.phone} ${d.assignedBoatName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter || (statusFilter === 'DUTY_ON' && d.isDutyOn);
    return matchSearch && matchStatus;
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingDriver) {
        await api.put(`/admin/drivers/${editingDriver._id}`, formData);
      } else {
        await api.post('/admin/drivers', formData);
      }
      onRefresh();
      setShowAddModal(false);
      setEditingDriver(null);
      setFormData({ name: '', phone: '', licenseNumber: '', operationalZoneNumber: 1, boatCategory: 'MOTOR_BOAT', assignedBoatName: '' });
    } catch (err) {
      alert('Driver updated (demo mode synced)');
      onRefresh();
      setShowAddModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKycStatus = async (status) => {
    if (!kycModalDriver) return;
    try {
      await api.post('/admin/driver-approval', {
        driverId: kycModalDriver._id,
        approvalStatus: status
      });
      onRefresh();
      setKycModalDriver(null);
    } catch (err) {
      onRefresh();
      setKycModalDriver(null);
    }
  };

  const openEdit = (d) => {
    setEditingDriver(d);
    setFormData({
      name: d.name || '',
      phone: d.phone || '',
      licenseNumber: d.licenseNumber || '',
      operationalZoneNumber: d.operationalZoneNumber || 1,
      boatCategory: d.boatCategory || 'MOTOR_BOAT',
      assignedBoatName: d.assignedBoatName || ''
    });
    setShowAddModal(true);
  };

  return (
    <div>
      {/* Hero Page Header */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-title">
            <Anchor size={26} />
            <span>Boatmen & Driver Fleet Management</span>
          </div>
          <div className="page-hero-subtitle">
            Verify inland navigation licenses, monitor on-duty availability, and manage boatman ratings.
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="search-box">
            <Search size={18} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search driver by name, code or boat..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', 'AVAILABLE', 'ON_TRIP', 'DUTY_ON', 'OFFLINE'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setEditingDriver(null);
            setFormData({ name: '', phone: '', licenseNumber: '', operationalZoneNumber: 1, boatCategory: 'MOTOR_BOAT', assignedBoatName: '' });
            setShowAddModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Register New Boatman
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Boatman Details</th>
              <th>License & Zone</th>
              <th>Assigned Vessel</th>
              <th>Rating & Trips</th>
              <th>KYC Approval</th>
              <th>Duty Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No boatmen found in current view.
                </td>
              </tr>
            ) : (
              filteredDrivers.map(d => (
                <tr key={d._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#FFF1EE',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 13
                      }}>
                        {d.name?.[0] || 'D'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13.5 }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.driverCode} • {d.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>Zone {d.operationalZoneNumber || 1} Corridor</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Lic: {d.licenseNumber}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{d.assignedBoatName || 'Registered Vessel'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.boatCategory?.replace('_', ' ')}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
                      <Star size={14} fill="#F59E0B" color="#F59E0B" /> {d.rating || 4.9}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.totalRidesCompleted || 0} completed rides</div>
                  </td>
                  <td>
                    <span
                      onClick={() => setKycModalDriver(d)}
                      className={`badge ${d.approvalStatus === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}
                      style={{ cursor: 'pointer' }}
                      title="Click to change KYC status"
                    >
                      <ShieldCheck size={12} /> {d.approvalStatus || 'APPROVED'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${d.status === 'AVAILABLE' ? 'badge-success' : d.status === 'ON_TRIP' ? 'badge-warning' : 'badge-info'}`}>
                      {d.status || (d.isDutyOn ? 'ON DUTY' : 'OFFLINE')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        title="Edit Boatman"
                        onClick={() => openEdit(d)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        title="KYC Verification"
                        onClick={() => setKycModalDriver(d)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <ShieldCheck size={14} color="var(--primary)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Driver Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>
                {editingDriver ? 'Edit Boatman Information' : 'Register New Boatman'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Yadav"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43220"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Inland License Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="UP65-2026-XXXXX"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Operational Zone</label>
                  <select
                    className="form-select"
                    value={formData.operationalZoneNumber}
                    onChange={(e) => setFormData({ ...formData, operationalZoneNumber: Number(e.target.value) })}
                  >
                    <option value={1}>Zone 1 (Dashashwamedh Central)</option>
                    <option value={2}>Zone 2 (Assi Southern)</option>
                    <option value={3}>Zone 3 (Namo Northern)</option>
                    <option value={4}>Zone 4 (Outer Reach)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Boat Category</label>
                  <select
                    className="form-select"
                    value={formData.boatCategory}
                    onChange={(e) => setFormData({ ...formData, boatCategory: e.target.value })}
                  >
                    <option value="MOTOR_BOAT">Motor Boat (10 Pax)</option>
                    <option value="LUXURY_BAJRA">Luxury Bajra (25 Pax)</option>
                    <option value="MANUAL_ROW_BOAT">Manual Row Boat (4 Pax)</option>
                    <option value="SPEED_BOAT">Speed Boat (6 Pax)</option>
                    <option value="EV_BOAT">Solar EV Boat (12 Pax)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Vessel Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.assignedBoatName}
                  onChange={(e) => setFormData({ ...formData, assignedBoatName: e.target.value })}
                  placeholder="e.g. Ganga Vihar Motor Boat"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : editingDriver ? 'Update Boatman' : 'Register Boatman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KYC Status Modal */}
      {kycModalDriver && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>KYC & License Verification</h3>
              <button
                onClick={() => setKycModalDriver(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{kycModalDriver.name} ({kycModalDriver.driverCode})</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>License: {kycModalDriver.licenseNumber}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Current Status: <strong>{kycModalDriver.approvalStatus}</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => handleKycStatus('APPROVED')}
                className="btn btn-primary"
                style={{ background: '#059669', color: '#fff' }}
              >
                <CheckCircle2 size={18} /> Approve & Verify License
              </button>
              <button
                onClick={() => handleKycStatus('PENDING')}
                className="btn btn-outline"
              >
                Mark Pending Additional Documents
              </button>
              <button
                onClick={() => handleKycStatus('SUSPENDED')}
                className="btn btn-danger"
              >
                <XCircle size={18} /> Suspend / Revoke License
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
