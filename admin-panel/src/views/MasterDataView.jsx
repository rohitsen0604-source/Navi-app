import React, { useState } from 'react';
import { Ship, MapPin, Layers, Plus } from 'lucide-react';
import api from '../services/api';

export default function MasterDataView({ zones, ghats, boats, onRefresh }) {
  const [activeTab, setActiveTab] = useState('zones');
  const [showBoatModal, setShowBoatModal] = useState(false);
  const [newBoat, setNewBoat] = useState({
    customBoatId: '',
    governmentRegNumber: '',
    name: '',
    category: 'MOTOR_BOAT',
    capacity: 10,
    zoneNumber: 1
  });

  const handleAddBoat = async (e) => {
    e.preventDefault();
    try {
      await api.post('/master-data/boats', newBoat);
      alert('Boat vessel registered successfully!');
      setShowBoatModal(false);
      onRefresh();
    } catch (err) {
      alert(`Failed to add boat: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Master Data Architecture</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Varanasi 15 River Zones, Ghats, and Vessel Fleet</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 8, padding: 3 }}>
            <button
              onClick={() => setActiveTab('zones')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: 13,
                background: activeTab === 'zones' ? '#fff' : 'transparent',
                color: activeTab === 'zones' ? 'var(--text-main)' : 'var(--text-muted)',
                borderRadius: 6
              }}
            >
              15 River Zones ({zones.length})
            </button>
            <button
              onClick={() => setActiveTab('ghats')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: 13,
                background: activeTab === 'ghats' ? '#fff' : 'transparent',
                color: activeTab === 'ghats' ? 'var(--text-main)' : 'var(--text-muted)',
                borderRadius: 6
              }}
            >
              Boarding Ghats ({ghats.length})
            </button>
            <button
              onClick={() => setActiveTab('boats')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: 13,
                background: activeTab === 'boats' ? '#fff' : 'transparent',
                color: activeTab === 'boats' ? 'var(--text-main)' : 'var(--text-muted)',
                borderRadius: 6
              }}
            >
              Fleet Vessels ({boats.length})
            </button>
          </div>

          {activeTab === 'boats' && (
            <button onClick={() => setShowBoatModal(true)} className="btn btn-primary" style={{ fontSize: 13 }}>
              <Plus size={15} /> Add Vessel
            </button>
          )}
        </div>
      </div>

      {activeTab === 'zones' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ZONE #</th>
                <th>CODE</th>
                <th>SECTOR DESIGNATION</th>
                <th>ADJACENT CORRIDORS (FALLBACK)</th>
                <th>SERVICE STATUS</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z._id || z.zoneNumber}>
                  <td style={{ fontWeight: 700 }}>Zone {z.zoneNumber}</td>
                  <td className="font-mono" style={{ color: 'var(--primary)', fontWeight: 600 }}>{z.code}</td>
                  <td style={{ fontWeight: 600 }}>{z.name}</td>
                  <td>
                    {z.adjacentZoneNumbers?.length > 0 ? (
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Zones: {z.adjacentZoneNumbers.join(', ')}
                      </span>
                    ) : 'Terminal'}
                  </td>
                  <td><span className="badge badge-success">Active Corridor</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ghats' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>GHAT / BOARDING POINT</th>
                <th>ZONE SECTOR</th>
                <th>POPULAR SPOT</th>
                <th>GEO COORDINATES</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {ghats.map((g) => (
                <tr key={g._id || g.name}>
                  <td style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={16} color="var(--primary)" />
                    {g.name}
                  </td>
                  <td>Zone {g.zoneNumber}</td>
                  <td>
                    {g.isPopular ? (
                      <span className="badge badge-info">Popular Heritage Ghat</span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Standard</span>
                    )}
                  </td>
                  <td className="font-mono" style={{ fontSize: 12 }}>
                    {g.coordinates?.latitude || 25.30}, {g.coordinates?.longitude || 83.01}
                  </td>
                  <td><span className="badge badge-success">Operational</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'boats' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>VESSEL ID</th>
                <th>GOVERNMENT REGISTRATION</th>
                <th>BOAT NAME</th>
                <th>CATEGORY</th>
                <th>PASSENGER CAPACITY</th>
                <th>HOME ZONE</th>
                <th>AVAILABILITY</th>
              </tr>
            </thead>
            <tbody>
              {boats.map((b) => (
                <tr key={b._id}>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>{b.customBoatId}</td>
                  <td style={{ fontWeight: 600 }}>{b.governmentRegNumber}</td>
                  <td>{b.name}</td>
                  <td><span className="badge badge-info">{b.category?.replace(/_/g, ' ')}</span></td>
                  <td style={{ fontWeight: 700 }}>{b.capacity} Seats</td>
                  <td>Zone {b.zoneNumber}</td>
                  <td><span className="badge badge-success">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Boat Modal */}
      {showBoatModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Register New Boat Vessel</h3>
            <form onSubmit={handleAddBoat} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Custom Boat ID</label>
                <input
                  required
                  placeholder="e.g. BOAT-Z1-003"
                  value={newBoat.customBoatId}
                  onChange={(e) => setNewBoat({ ...newBoat, customBoatId: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Govt Reg Number</label>
                <input
                  required
                  placeholder="e.g. UP-65-NV-3003"
                  value={newBoat.governmentRegNumber}
                  onChange={(e) => setNewBoat({ ...newBoat, governmentRegNumber: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Boat Name</label>
                <input
                  required
                  placeholder="e.g. Ganga Shanti Express"
                  value={newBoat.name}
                  onChange={(e) => setNewBoat({ ...newBoat, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label>
                  <select
                    value={newBoat.category}
                    onChange={(e) => setNewBoat({ ...newBoat, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                  >
                    <option value="MOTOR_BOAT">Motor Boat</option>
                    <option value="MANUAL_ROW_BOAT">Manual Row Boat</option>
                    <option value="LUXURY_BAJRA">Luxury Bajra</option>
                    <option value="SPEED_BOAT">Speed Boat</option>
                    <option value="EV_BOAT">EV Boat</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Capacity (Seats)</label>
                  <input
                    type="number"
                    min="1"
                    value={newBoat.capacity}
                    onChange={(e) => setNewBoat({ ...newBoat, capacity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowBoatModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Vessel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
