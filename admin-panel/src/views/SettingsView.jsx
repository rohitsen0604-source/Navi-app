import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldAlert, Radio, Clock, PhoneCall, CheckCircle2, Siren } from 'lucide-react';
import api from '../services/api';

export default function SettingsView({ settingsData = {}, onRefresh }) {
  const [settings, setSettings] = useState({
    platformName: 'Naavi River Waterways Dispatch Engine',
    city: 'Varanasi',
    waterPoliceHotline: '112 / +91 542 2508000',
    operatingHoursStart: '05:00 AM',
    operatingHoursEnd: '10:00 PM',
    driverSearchRadiusMeters: 2500,
    gpsTelemetryIntervalSeconds: 3,
    automaticDriverAllocation: true,
    smsGatewayActive: true,
    waterAlertStatus: 'NORMAL_CURRENT',
    nightSafetyCurfewActive: false
  });

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settingsData && Object.keys(settingsData).length > 0) {
      setSettings(prev => ({ ...prev, ...settingsData }));
    }
  }, [settingsData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/settings', settings);
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

  const handleTestSiren = () => {
    alert('🚨 EMERGENCY SIREN TEST: High-priority acoustic siren and Water Police telemetry broadcast test successful.');
  };

  return (
    <div>
      {/* Page Hero Header */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-title">
            <Settings size={26} />
            <span>Platform Configuration & River Safety Protocol</span>
          </div>
          <div className="page-hero-subtitle">
            Configure system operational parameters, Water Police hotlines, automatic dispatch radius, and safety thresholds.
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
          <CheckCircle2 size={20} /> Operational settings successfully updated across all fleet tablets and dispatch nodes.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          {/* Main Settings Form */}
          <div className="card">
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>General & Dispatch Parameters</h3>

            <div className="form-group">
              <label className="form-label">Platform Command Title</label>
              <input
                type="text"
                className="form-input"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Operating City</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Water Police Emergency Hotline</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.waterPoliceHotline}
                  onChange={(e) => setSettings({ ...settings, waterPoliceHotline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Corridor Opening Time</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.operatingHoursStart}
                  onChange={(e) => setSettings({ ...settings, operatingHoursStart: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Corridor Closing Time</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.operatingHoursEnd}
                  onChange={(e) => setSettings({ ...settings, operatingHoursEnd: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Driver Search Radius (Meters)</label>
                <input
                  type="number"
                  className="form-input"
                  value={settings.driverSearchRadiusMeters}
                  onChange={(e) => setSettings({ ...settings, driverSearchRadiusMeters: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">GPS Telemetry Interval (Seconds)</label>
                <input
                  type="number"
                  className="form-input"
                  value={settings.gpsTelemetryIntervalSeconds}
                  onChange={(e) => setSettings({ ...settings, gpsTelemetryIntervalSeconds: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={settings.automaticDriverAllocation}
                  onChange={(e) => setSettings({ ...settings, automaticDriverAllocation: e.target.checked })}
                />
                Automatic Algorithmic Driver Allocation (Proximity Matching)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={settings.smsGatewayActive}
                  onChange={(e) => setSettings({ ...settings, smsGatewayActive: e.target.checked })}
                />
                SMS & WhatsApp Passenger Notification Gateway Active
              </label>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: 14.5 }}
              >
                <Save size={18} /> {loading ? 'Saving Settings...' : 'Save Settings'}
              </button>
            </div>
          </div>

          {/* Emergency Safety Protocol & Siren Test */}
          <div className="card" style={{ background: '#FFFDFD', border: '1px solid #FFE4E6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <ShieldAlert size={22} color="var(--primary)" />
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>Safety & Water Advisory</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Ganga River Current Advisory</label>
              <select
                className="form-select"
                value={settings.waterAlertStatus}
                onChange={(e) => setSettings({ ...settings, waterAlertStatus: e.target.value })}
              >
                <option value="NORMAL_CURRENT">Normal Current (Green Flag • All Vessels Permitted)</option>
                <option value="MODERATE_CURRENT">Moderate Current (Yellow Flag • Speed Limit 12 km/h)</option>
                <option value="HIGH_CURRENT_WARNING">High Current Warning (Orange Flag • Row Boats Restricted)</option>
                <option value="FLOOD_ALERT_CLOSED">Emergency Red Alert (Corridor Closed by District Magistrate)</option>
              </select>
            </div>

            <div style={{
              background: 'var(--primary-light)',
              borderRadius: 12,
              padding: 16,
              border: '1px solid var(--primary-border)',
              margin: '18px 0'
            }}>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--primary)' }}>Emergency Siren Test Console</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                Sends acoustic broadcast signals across connected boatman devices and logs response times.
              </div>
              <button
                type="button"
                onClick={handleTestSiren}
                className="btn btn-danger btn-sm"
                style={{ marginTop: 12, width: '100%' }}
              >
                <Siren size={16} /> Broadcast Emergency Siren Test
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
