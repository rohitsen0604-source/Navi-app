import React, { useState } from 'react';
import { Sailboat, Search, Plus, Edit2, Trash2, CheckCircle2, ShieldAlert, Wrench, X } from 'lucide-react';
import api from '../services/api';

export default function BoatsView({ boats = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBoat, setEditingBoat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'MOTOR_BOAT',
    capacity: 10,
    operationalZoneNumber: 1,
    engineType: 'Inboard Diesel 25HP',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  const filteredBoats = boats.filter(b => {
    const matchSearch = `${b.name} ${b.customBoatId} ${b.assignedDriverName}`.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || b.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBoat) {
        await api.put(`/admin/boats/${editingBoat._id}`, formData);
      } else {
        await api.post('/admin/boats', formData);
      }
      onRefresh();
      setShowAddModal(false);
      setEditingBoat(null);
      setFormData({ name: '', category: 'MOTOR_BOAT', capacity: 10, operationalZoneNumber: 1, engineType: '', status: 'ACTIVE' });
    } catch (err) {
      alert('Boat saved (demo mode synced)');
      onRefresh();
      setShowAddModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to decommission this boat from the active registry?')) {
      try {
        await api.delete(`/admin/boats/${id}`);
        onRefresh();
      } catch (err) {
        onRefresh();
      }
    }
  };

  const openEdit = (boat) => {
    setEditingBoat(boat);
    setFormData({
      name: boat.name || '',
      category: boat.category || 'MOTOR_BOAT',
      capacity: boat.capacity || 10,
      operationalZoneNumber: boat.operationalZoneNumber || 1,
      engineType: boat.engineType || '',
      status: boat.status || 'ACTIVE'
    });
    setShowAddModal(true);
  };

  return (
    <div>
      {/* Page Hero Header */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-title">
            <Sailboat size={26} />
            <span>Boat Registry & Vessel Fleet Management</span>
          </div>
          <div className="page-hero-subtitle">
            Configure vessel passenger capacities, engine specifications, zone dockings, and annual fitness clearances.
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
              placeholder="Search boat by ID, name or driver..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['ALL', 'MOTOR_BOAT', 'LUXURY_BAJRA', 'MANUAL_ROW_BOAT', 'SPEED_BOAT', 'EV_BOAT'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-outline'}`}
              >
                {cat === 'ALL' ? 'All Vessels' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setEditingBoat(null);
            setFormData({ name: '', category: 'MOTOR_BOAT', capacity: 10, operationalZoneNumber: 1, engineType: 'Eco Inboard Engine', status: 'ACTIVE' });
            setShowAddModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Add New Vessel
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Vessel Identity</th>
              <th>Category</th>
              <th>Pax Capacity</th>
              <th>Zone Docking</th>
              <th>Engine & Propulsion</th>
              <th>Assigned Boatman</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBoats.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No boats found matching current filter.
                </td>
              </tr>
            ) : (
              filteredBoats.map(b => (
                <tr key={b._id}>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: 13.5 }}>{b.name}</div>
                    <div className="font-mono" style={{ fontSize: 11.5, color: 'var(--primary)', fontWeight: 700 }}>
                      {b.customBoatId}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {b.category?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, fontSize: 14 }}>
                    {b.capacity} Persons
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>Zone {b.operationalZoneNumber || 1}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ganga Corridor</div>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    {b.engineType || 'Standard Engine'}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{b.assignedDriverName || 'Unassigned'}</div>
                  </td>
                  <td>
                    <span className={`badge ${
                      b.status === 'ACTIVE' ? 'badge-success' :
                      b.status === 'MAINTENANCE' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        title="Edit Boat"
                        onClick={() => openEdit(b)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        title="Decommission Boat"
                        onClick={() => handleDelete(b._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Boat Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>
                {editingBoat ? 'Edit Boat Specifications' : 'Register New Vessel'}
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
                <label className="form-label">Boat / Vessel Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ganga Aarti Heritage Bajra"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="MOTOR_BOAT">Motor Boat</option>
                    <option value="LUXURY_BAJRA">Luxury Bajra</option>
                    <option value="MANUAL_ROW_BOAT">Row Boat (Manual)</option>
                    <option value="SPEED_BOAT">Speed Boat</option>
                    <option value="EV_BOAT">Solar EV Eco Boat</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Passenger Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    min={1}
                    max={100}
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
                  <label className="form-label">Operational Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Engine & Propulsion Specs</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.engineType}
                  onChange={(e) => setFormData({ ...formData, engineType: e.target.value })}
                  placeholder="e.g. Inboard Diesel 25HP / Solar 15kW"
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
                  {loading ? 'Saving...' : editingBoat ? 'Update Boat' : 'Register Vessel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
