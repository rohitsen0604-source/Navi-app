import React, { useState, useEffect } from 'react';
import { Waves, MapPin, Compass, Tag, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function MasterDataView({
  rivers = [],
  zones = [],
  ghats = [],
  rideTypes = [],
  initialTab = 'ghats',
  onTabChange,
  onRefresh
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'ghats'); // 'rivers', 'zones', 'ghats', 'rides'
  
  // Sync activeTab when initialTab prop changes from sidebar navigation
  useEffect(() => {
    if (initialTab && ['rivers', 'zones', 'ghats', 'rides'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('ghats');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const openAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    if (type === 'rivers') setFormData({ name: '', city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', operatingHours: '05:00 AM - 10:00 PM' });
    if (type === 'zones') setFormData({ name: '', zoneNumber: (zones?.length || 0) + 1, primaryGhat: 'Dashashwamedh Ghat', speedLimitKmH: 15, surgeMultiplier: 1.0 });
    if (type === 'ghats') setFormData({ name: '', zoneNumber: 1, latitude: 25.3059, longitude: 83.0105, peakCapacity: 30, isPopularForAarti: false });
    if (type === 'rides') setFormData({ name: '', id: 'CUSTOM_TRIP', durationMinutes: 60, durationText: '1:00 hr', priceMultiplier: 1.0, description: '' });
    setShowModal(true);
  };

  const openEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalType === 'rivers') {
        if (editingItem) await api.put(`/admin/rivers/${editingItem._id}`, formData);
        else await api.post('/admin/rivers', formData);
      } else if (modalType === 'zones') {
        if (editingItem) await api.put(`/admin/zones/${editingItem._id}`, formData);
        else await api.post('/admin/zones', formData);
      } else if (modalType === 'ghats') {
        if (editingItem) await api.put(`/admin/ghats/${editingItem._id}`, formData);
        else await api.post('/admin/ghats', formData);
      } else if (modalType === 'rides') {
        if (editingItem) await api.put(`/admin/ride-types/${editingItem._id}`, formData);
        else await api.post('/admin/ride-types', formData);
      }
      if (onRefresh) onRefresh();
      setShowModal(false);
    } catch (err) {
      if (onRefresh) onRefresh();
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure you want to remove this record?')) {
      try {
        if (type === 'rivers') await api.delete(`/admin/rivers/${id}`);
        if (type === 'zones') await api.delete(`/admin/zones/${id}`);
        if (type === 'ghats') await api.delete(`/admin/ghats/${id}`);
        if (onRefresh) onRefresh();
      } catch (err) {
        if (onRefresh) onRefresh();
      }
    }
  };

  const getHeroDetails = () => {
    switch (activeTab) {
      case 'zones':
        return {
          title: 'Corridor Safety & Operational Zones',
          subtitle: 'Manage the 4 river corridor zones, speed restrictions, primary landmark ghats, and zone-specific surge multipliers.',
          icon: MapPin,
          count: zones?.length || 4,
          countLabel: 'ACTIVE ZONES'
        };
      case 'ghats':
        return {
          title: '84 Ghats & Boarding Point Registry',
          subtitle: 'Configure sacred boarding stations along the Ganges, GPS coordinates, dock capacity limits, and Aarti spots.',
          icon: Compass,
          count: ghats?.length || 84,
          countLabel: 'BOARDING GHATS'
        };
      case 'rivers':
        return {
          title: 'Rivers & Waterbodies Management',
          subtitle: 'Control navigable waterbodies, operating transit windows, city jurisdiction, and active zone limits.',
          icon: Waves,
          count: rivers?.length || 3,
          countLabel: 'WATERBODIES'
        };
      case 'rides':
        return {
          title: 'Ride Setup & Trip Packages',
          subtitle: 'Manage trip types (Full Heritage, Half Corridor, Cross Ghat Ferry, Evening Maha Aarti) and pricing multipliers.',
          icon: Tag,
          count: rideTypes?.length || 4,
          countLabel: 'RIDE PACKAGES'
        };
      default:
        return {
          title: 'Waterways Corridor & Master Data Engine',
          subtitle: 'Configure river waterbodies, corridor safety zones, 84 ghat boarding stations, and trip categories.',
          icon: Compass,
          count: 84,
          countLabel: 'ASSETS'
        };
    }
  };

  const hero = getHeroDetails();
  const HeroIcon = hero.icon;

  return (
    <div>
      {/* Page Hero Header */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="page-hero-title">
                <HeroIcon size={24} color="var(--primary-hover)" />
                <span>{hero.title}</span>
              </div>
              <div className="page-hero-subtitle">
                {hero.subtitle}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
                <div style={{ fontSize: 10.5, color: '#CBD5E1', fontWeight: 600 }}>{hero.countLabel}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary-hover)' }}>{hero.count}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottom: '1px solid var(--border)',
        paddingBottom: 14,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'zones', label: 'Corridor Zones', icon: MapPin, count: zones?.length || 0 },
            { id: 'ghats', label: 'Ghats & Boarding Points', icon: Compass, count: ghats?.length || 0 },
            { id: 'rides', label: 'Ride Setup & Types', icon: Tag, count: rideTypes?.length || 0 },
            { id: 'rivers', label: 'Rivers & Waterbodies', icon: Waves, count: rivers?.length || 0 }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`btn btn-sm ${isSel ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '8px 16px', borderRadius: 10, cursor: 'pointer' }}
              >
                <Icon size={16} /> {tab.label}
                <span style={{
                  background: isSel ? '#fff' : 'var(--primary-light)',
                  color: isSel ? 'var(--primary)' : 'var(--primary)',
                  fontSize: 11,
                  padding: '1px 6px',
                  borderRadius: 10,
                  marginLeft: 4,
                  fontWeight: 800
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => openAdd(activeTab)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          {activeTab === 'zones' && 'Create Corridor Zone'}
          {activeTab === 'ghats' && 'Add New Ghat'}
          {activeTab === 'rides' && 'Add Ride Category'}
          {activeTab === 'rivers' && 'Add Waterbody'}
        </button>
      </div>

      {/* 1. GHATS / BOARDING POINTS TAB */}
      {activeTab === 'ghats' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ghat Name</th>
                <th>Zone Number</th>
                <th>GPS Coordinates</th>
                <th>Dock Capacity</th>
                <th>Evening Aarti Spot</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ghats.map(g => (
                <tr key={g._id}>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: 13.5 }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {g._id}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">Zone {g.zoneNumber}</span>
                  </td>
                  <td className="font-mono" style={{ fontSize: 12.5 }}>
                    {g.latitude?.toFixed(4)}, {g.longitude?.toFixed(4)}
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {g.peakCapacity || 30} vessels max
                  </td>
                  <td>
                    {g.isPopularForAarti ? (
                      <span className="badge badge-success">Maha Aarti Prime</span>
                    ) : (
                      <span className="badge badge-info">Standard Transit</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-success">{g.status || 'ACTIVE'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        title="Edit Ghat"
                        onClick={() => openEdit('ghats', g)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        title="Remove Ghat"
                        onClick={() => handleDelete('ghats', g._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. CORRIDOR ZONES TAB */}
      {activeTab === 'zones' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Zone Name</th>
                <th>Zone #</th>
                <th>Primary Landmark Ghat</th>
                <th>Speed Limit</th>
                <th>Surge Multiplier</th>
                <th>Active Vessels</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map(z => (
                <tr key={z._id}>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: 13.5 }}>{z.name}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">Zone {z.zoneNumber}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{z.primaryGhat || 'Dashashwamedh'}</div>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 700 }}>
                    {z.speedLimitKmH || 15} km/h
                  </td>
                  <td>
                    <span className="badge badge-warning">{z.surgeMultiplier || 1.0}x</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {z.activeBoats || 8} boats
                  </td>
                  <td>
                    <span className="badge badge-success">{z.status || 'ACTIVE'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        title="Edit Zone"
                        onClick={() => openEdit('zones', z)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        title="Remove Zone"
                        onClick={() => handleDelete('zones', z._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. RIVERS & WATERBODIES TAB */}
      {activeTab === 'rivers' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Waterbody Name</th>
                <th>City & State</th>
                <th>Total Ghats</th>
                <th>Operational Zones</th>
                <th>Operating Hours</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rivers.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: {r._id}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{r.city}, {r.state}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.country || 'India'}</div>
                  </td>
                  <td style={{ fontWeight: 800 }}>{r.totalGhats || 84} Ghats</td>
                  <td>
                    <span className="badge badge-primary">{r.operationalZones || 4} Zones</span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{r.operatingHours || '05:00 AM - 10:00 PM'}</td>
                  <td>
                    <span className="badge badge-success">{r.status || 'ACTIVE'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        title="Edit River"
                        onClick={() => openEdit('rivers', r)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        title="Remove River"
                        onClick={() => handleDelete('rivers', r._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 8px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. RIDE SETUP & CATEGORIES TAB */}
      {activeTab === 'rides' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ride Type</th>
                <th>Duration</th>
                <th>Price Multiplier</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rideTypes.map(rt => (
                <tr key={rt._id}>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: 13.5 }}>{rt.name}</div>
                    <div className="font-mono" style={{ fontSize: 11.5, color: 'var(--primary)' }}>{rt.id}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {rt.durationText || `${rt.durationMinutes} mins`}
                  </td>
                  <td>
                    <span className="badge badge-warning">{rt.priceMultiplier || 1.0}x base</span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)', maxWidth: 300 }}>
                    {rt.description}
                  </td>
                  <td>
                    <span className="badge badge-success">{rt.status || 'ACTIVE'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      title="Edit Ride Type"
                      onClick={() => openEdit('rides', rt)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '6px 8px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Master Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>
                {editingItem ? 'Edit Details' : 'Add New Record'} ({modalType.toUpperCase()})
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Name / Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  required
                />
              </div>

              {modalType === 'ghats' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Zone Number</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.zoneNumber || 1}
                        onChange={(e) => setFormData({ ...formData, zoneNumber: Number(e.target.value) })}
                        min={1}
                        max={10}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max Dock Capacity</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.peakCapacity || 30}
                        onChange={(e) => setFormData({ ...formData, peakCapacity: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        className="form-input"
                        value={formData.latitude || 25.3059}
                        onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        className="form-input"
                        value={formData.longitude || 83.0105}
                        onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 16px' }}>
                    <input
                      type="checkbox"
                      id="aartiCheck"
                      checked={formData.isPopularForAarti || false}
                      onChange={(e) => setFormData({ ...formData, isPopularForAarti: e.target.checked })}
                    />
                    <label htmlFor="aartiCheck" style={{ fontSize: 13, fontWeight: 600 }}>Prime Spot for Ganga Maha Aarti</label>
                  </div>
                </>
              )}

              {modalType === 'zones' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Speed Limit (km/h)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.speedLimitKmH || 15}
                      onChange={(e) => setFormData({ ...formData, speedLimitKmH: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Surge Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={formData.surgeMultiplier || 1.0}
                      onChange={(e) => setFormData({ ...formData, surgeMultiplier: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              {modalType === 'rivers' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.city || 'Varanasi'}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.state || 'Uttar Pradesh'}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {modalType === 'rides' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Duration Minutes</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.durationMinutes || 60}
                        onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price Multiplier</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        value={formData.priceMultiplier || 1.0}
                        onChange={(e) => setFormData({ ...formData, priceMultiplier: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
