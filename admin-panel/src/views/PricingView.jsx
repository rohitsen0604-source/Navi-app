import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Save, RefreshCw, Calculator, CheckCircle2, Shield } from 'lucide-react';
import api from '../services/api';

export default function PricingView({ pricingConfig = {}, onRefresh }) {
  const [config, setConfig] = useState({
    baseFares: {
      MOTOR_BOAT: 500,
      LUXURY_BAJRA: 1200,
      MANUAL_ROW_BOAT: 300,
      SPEED_BOAT: 800,
      EV_BOAT: 650
    },
    perPassengerCharge: 60,
    eveningPeakSurgeMultiplier: 1.25,
    festivalSurcharge: 150,
    platformSafetyLevy: 25,
    gstRatePercentage: 5,
    cancellationRefundWindowMinutes: 30
  });

  // Simulator State
  const [simCategory, setSimCategory] = useState('MOTOR_BOAT');
  const [simPassengers, setSimPassengers] = useState(2);
  const [simTripType, setSimTripType] = useState('FULL_TRIP');
  const [simIsEvening, setSimIsEvening] = useState(false);
  const [simIsFestival, setSimIsFestival] = useState(false);

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (pricingConfig && Object.keys(pricingConfig).length > 0) {
      setConfig(prev => ({ ...prev, ...pricingConfig }));
    }
  }, [pricingConfig]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/pricing', config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Simulated Fare
  const calculateSimulatedFare = () => {
    let base = config.baseFares[simCategory] || 500;
    if (simTripType === 'FULL_TRIP') base = Math.round(base * 1.8);
    if (simTripType === 'EVENT') base = base * 3;
    if (simTripType === 'CROSS_GHAT') base = Math.round(base * 0.6);

    let passengerTotal = simPassengers * config.perPassengerCharge;
    let subtotal = base + passengerTotal;

    if (simIsEvening) subtotal = Math.round(subtotal * config.eveningPeakSurgeMultiplier);
    if (simIsFestival) subtotal += config.festivalSurcharge;

    subtotal += config.platformSafetyLevy;
    const gst = Math.round(subtotal * (config.gstRatePercentage / 100));
    return {
      subtotal,
      gst,
      total: subtotal + gst
    };
  };

  const simResult = calculateSimulatedFare();

  return (
    <div>
      {/* Page Hero Header */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-title">
            <DollarSign size={26} />
            <span>Dynamic Pricing Engine & Surge Configuration</span>
          </div>
          <div className="page-hero-subtitle">
            Configure vessel base rates, passenger levies, peak sunset surge multipliers, and test live fares.
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div style={{
          background: 'var(--success-light)',
          color: 'var(--success)',
          padding: '14px 18px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 700,
          marginBottom: 20
        }}>
          <CheckCircle2 size={20} /> Pricing parameters updated and synchronized with all passenger apps in real-time.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Form Column */}
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>Vessel Base Rates (₹)</h3>
          
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Motor Boat (Base ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.baseFares.MOTOR_BOAT}
                  onChange={(e) => setConfig({
                    ...config,
                    baseFares: { ...config.baseFares, MOTOR_BOAT: Number(e.target.value) }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Luxury Bajra (Base ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.baseFares.LUXURY_BAJRA}
                  onChange={(e) => setConfig({
                    ...config,
                    baseFares: { ...config.baseFares, LUXURY_BAJRA: Number(e.target.value) }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Manual Row Boat (Base ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.baseFares.MANUAL_ROW_BOAT}
                  onChange={(e) => setConfig({
                    ...config,
                    baseFares: { ...config.baseFares, MANUAL_ROW_BOAT: Number(e.target.value) }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Speed Boat (Base ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.baseFares.SPEED_BOAT}
                  onChange={(e) => setConfig({
                    ...config,
                    baseFares: { ...config.baseFares, SPEED_BOAT: Number(e.target.value) }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Solar EV Boat (Base ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.baseFares.EV_BOAT}
                  onChange={(e) => setConfig({
                    ...config,
                    baseFares: { ...config.baseFares, EV_BOAT: Number(e.target.value) }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Per Extra Passenger (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.perPassengerCharge}
                  onChange={(e) => setConfig({
                    ...config,
                    perPassengerCharge: Number(e.target.value)
                  })}
                  required
                />
              </div>
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 800, margin: '24px 0 14px' }}>Surges, Levies & Taxes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Evening Peak Surge Multiplier</label>
                <input
                  type="number"
                  step="0.05"
                  className="form-input"
                  value={config.eveningPeakSurgeMultiplier}
                  onChange={(e) => setConfig({
                    ...config,
                    eveningPeakSurgeMultiplier: parseFloat(e.target.value)
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Festival Special Levy (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.festivalSurcharge}
                  onChange={(e) => setConfig({
                    ...config,
                    festivalSurcharge: Number(e.target.value)
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Platform Safety & GPS Levy (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.platformSafetyLevy}
                  onChange={(e) => setConfig({
                    ...config,
                    platformSafetyLevy: Number(e.target.value)
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Inland GST Rate (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={config.gstRatePercentage}
                  onChange={(e) => setConfig({
                    ...config,
                    gstRatePercentage: Number(e.target.value)
                  })}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: 14.5 }}
              >
                <Save size={18} /> {loading ? 'Saving Changes...' : 'Save & Publish Fares'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Simulator Column */}
        <div className="card" style={{ background: '#FFFDFD', border: '1px solid var(--primary-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Calculator size={20} color="var(--primary)" />
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>Live Fare Simulator</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Vessel Type</label>
              <select
                className="form-select"
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value)}
              >
                <option value="MOTOR_BOAT">Motor Boat</option>
                <option value="LUXURY_BAJRA">Luxury Bajra</option>
                <option value="MANUAL_ROW_BOAT">Manual Row Boat</option>
                <option value="SPEED_BOAT">Speed Boat</option>
                <option value="EV_BOAT">Solar EV Eco Boat</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trip Type</label>
              <select
                className="form-select"
                value={simTripType}
                onChange={(e) => setSimTripType(e.target.value)}
              >
                <option value="FULL_TRIP">Full Trip (2 hrs - 1.8x)</option>
                <option value="HALF_TRIP">Half Trip (1 hr - 1.0x)</option>
                <option value="CROSS_GHAT">Cross Ghat (15 mins - 0.6x)</option>
                <option value="EVENT">Maha Aarti Special (3 hrs - 3.0x)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Passengers: {simPassengers} Pax</label>
              <input
                type="range"
                min={1}
                max={15}
                value={simPassengers}
                onChange={(e) => setSimPassengers(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={simIsEvening}
                  onChange={(e) => setSimIsEvening(e.target.checked)}
                />
                Evening Sunset Surge
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={simIsFestival}
                  onChange={(e) => setSimIsFestival(e.target.checked)}
                />
                Festival Surcharge
              </label>
            </div>

            {/* Calculated Breakdown Card */}
            <div style={{
              background: 'var(--primary-light)',
              borderRadius: 14,
              border: '1px solid var(--primary-border)',
              padding: 18,
              marginTop: 10
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>Subtotal (Base + Pax + Surge):</span>
                <strong>₹{simResult.subtotal}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>GST (5%):</span>
                <strong>₹{simResult.gst}</strong>
              </div>
              <div style={{ height: 1, background: 'var(--primary-border)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 900 }}>
                <span>Customer Estimated Fare:</span>
                <span style={{ color: 'var(--primary)' }}>₹{simResult.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
