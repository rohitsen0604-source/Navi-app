import React, { useState } from 'react';
import { PhoneCall, Check, Send, User, MapPin, Anchor, Sparkles } from 'lucide-react';
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
    if (category === 'EV_BOAT') baseRate = 600;
    if (category === 'SPEED_BOAT') baseRate = 900;
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
      if (onBookingCreated) onBookingCreated();
    } catch (err) {
      alert(`Booking creation failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="view-header-banner" style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        color: '#fff',
        padding: '28px 32px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/admin_portal_hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          opacity: 0.22
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(235,77,55,0.2)', color: 'var(--primary-hover)', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 8, border: '1px solid rgba(235,77,55,0.4)' }}>
              <PhoneCall size={14} /> LIVE CALL-CENTER CONSOLE
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Assisted River Booking Desk</h1>
            <p style={{ margin: '6px 0 0', color: '#CBD5E1', fontSize: 13.5, maxWidth: 650 }}>
              Create instant phone reservations, assign ghat allocations, and dispatch verified boatmen for walk-in or helpline pilgrims.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>DISPATCH TIME</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#38BDF8' }}>&lt; 90 Sec</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>AVAILABLE GHATS</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary-hover)' }}>{ghats?.length || 84}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 840, margin: '0 auto' }}>
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
                  {zones && zones.length > 0 ? (
                    zones.map((z) => (
                      <option key={z._id || z.zoneNumber} value={z.zoneNumber}>
                        Zone {z.zoneNumber} - {z.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Zone 1 - Assi to Harishchandra Ghat</option>
                      <option value="2">Zone 2 - Dashashwamedh Central Corridor</option>
                      <option value="3">Zone 3 - Manikarnika to Panchganga</option>
                      <option value="4">Zone 4 - Trilochan to Namo Ghat</option>
                    </>
                  )}
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
                  {filteredGhats.length === 0 && (
                    <>
                      <option value="ghat-assi">Assi Ghat (South)</option>
                      <option value="ghat-dasha">Dashashwamedh Main Ghat</option>
                      <option value="ghat-namo">Namo Ghat (North)</option>
                    </>
                  )}
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

            <div style={{ padding: 16, borderRadius: 10, background: '#fff5f5', border: '1px solid rgba(235,77,55,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>CALCULATED TARIFF FARE</span>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary)', margin: 0 }}>₹{formData.fareAmount}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Payment Settlement Mode:</span>
                <p style={{ fontWeight: 700, color: '#059669', margin: 0 }}>Pay After Ride (Cash/UPI at Ghat)</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
                <Send size={16} /> {loading ? 'Dispatching Allocation...' : 'Confirm Assisted Booking'}
              </button>
            </div>
          </form>
        </div>

        {lastCreatedBooking && (
          <div className="card" style={{ marginTop: 20, borderLeft: '4px solid #10b981', background: '#ecfdf5' }}>
            <h4 style={{ color: '#047857', fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={18} /> Booking Confirmed & Allocation Dispatched!
            </h4>
            <p style={{ fontSize: 13, margin: 0, color: '#065f46' }}>
              Booking Reference: <strong>{lastCreatedBooking.bookingCode}</strong>. Dispatch engine has notified available boatmen in Zone {lastCreatedBooking.zoneNumber}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

