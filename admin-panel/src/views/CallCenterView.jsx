import React, { useState } from 'react';
import { PhoneCall, Check, Send } from 'lucide-react';
import api from '../services/api';

export default function CallCenterView({ zones, ghats, onBookingCreated }) {
  const [formData, setFormData] = useState({
    customerPhone: '',
    customerName: '',
    zoneNumber: 1,
    boardingPointId: '',
    tripType: 'FULL_TRIP',
    boatCategory: 'MOTOR_BOAT',
    seatsBooked: 2,
    fareAmount: 800,
    bookingType: 'BOOK_NOW'
  });
  const [loading, setLoading] = useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = useState(null);

  const handleZoneChange = (zoneNum) => {
    setFormData({
      ...formData,
      zoneNumber: Number(zoneNum),
      boardingPointId: '' // reset ghat selection
    });
  };

  const filteredGhats = ghats.filter((g) => g.zoneNumber === Number(formData.zoneNumber));

  // Dynamic fare calculation estimator
  const calculateFare = (tripType, category, seats) => {
    let baseRate = 300;
    if (category === 'LUXURY_BAJRA') baseRate = 1200;
    if (category === 'MOTOR_BOAT') baseRate = 500;
    if (tripType === 'FULL_TRIP') baseRate *= 1.8;
    if (tripType === 'EVENT') baseRate *= 3;
    return Math.round(baseRate + seats * 50);
  };

  const handleFieldChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    if (['tripType', 'boatCategory', 'seatsBooked'].includes(field)) {
      updated.fareAmount = calculateFare(
        field === 'tripType' ? val : updated.tripType,
        field === 'boatCategory' ? val : updated.boatCategory,
        field === 'seatsBooked' ? Number(val) : updated.seatsBooked
      );
    }
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.boardingPointId) {
      alert('Please select a Boarding Point / Ghat');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/admin/call-center-booking', {
        ...formData,
        seatsBooked: Number(formData.seatsBooked),
        fareAmount: Number(formData.fareAmount)
      });
      setLastCreatedBooking(res.data.booking);
      alert('Call Center booking registered! Central Allocation Engine triggered.');
      onBookingCreated();
    } catch (err) {
      alert(`Booking creation failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Call Center & Ground Staff Assisted Booking</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Create customer reservations directly over phone with the centralized booking engine
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Customer Mobile Number *
              </label>
              <input
                required
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.customerPhone}
                onChange={(e) => handleFieldChange('customerPhone', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Customer Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Ananya Pandey"
                value={formData.customerName}
                onChange={(e) => handleFieldChange('customerName', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Select River Zone *
              </label>
              <select
                value={formData.zoneNumber}
                onChange={(e) => handleZoneChange(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
              >
                {zones.map((z) => (
                  <option key={z._id || z.zoneNumber} value={z.zoneNumber}>
                    Zone {z.zoneNumber} - {z.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Boarding Point (Ghat) *
              </label>
              <select
                required
                value={formData.boardingPointId}
                onChange={(e) => handleFieldChange('boardingPointId', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
              >
                <option value="">-- Choose Ghat --</option>
                {filteredGhats.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name} {g.isPopular ? '⭐' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Trip Type</label>
              <select
                value={formData.tripType}
                onChange={(e) => handleFieldChange('tripType', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
              >
                <option value="FULL_TRIP">Full Trip (River Corridor)</option>
                <option value="HALF_TRIP">Half Trip (Up/Down)</option>
                <option value="CROSS_GHAT">Cross Ghat Ferry</option>
                <option value="EVENT">Aarti / Event Special</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Vessel Category</label>
              <select
                value={formData.boatCategory}
                onChange={(e) => handleFieldChange('boatCategory', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
              >
                <option value="MOTOR_BOAT">Motor Boat</option>
                <option value="MANUAL_ROW_BOAT">Manual Row Boat</option>
                <option value="LUXURY_BAJRA">Luxury Bajra</option>
                <option value="SPEED_BOAT">Speed Boat</option>
                <option value="EV_BOAT">EV Eco Vessel</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Passengers</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.seatsBooked}
                onChange={(e) => handleFieldChange('seatsBooked', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>CALCULATED FARE</span>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>₹{formData.fareAmount}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Payment Collection Mode:</span>
              <p style={{ fontWeight: 600, color: '#059669' }}>Pay After Ride (Cash/UPI on Ghat)</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <Send size={16} /> {loading ? 'Dispatching...' : 'Confirm Phone Booking'}
            </button>
          </div>
        </form>
      </div>

      {lastCreatedBooking && (
        <div className="card" style={{ marginTop: 20, borderLeft: '4px solid var(--success)' }}>
          <h4 style={{ color: 'var(--success)', fontWeight: 700, marginBottom: 4 }}>
            Booking Confirmed & Allocation Started!
          </h4>
          <p style={{ fontSize: 13 }}>
            Reference: <strong>{lastCreatedBooking.bookingCode}</strong>. Matching nearest available boatman in Zone {lastCreatedBooking.zoneNumber}.
          </p>
        </div>
      )}
    </div>
  );
}
