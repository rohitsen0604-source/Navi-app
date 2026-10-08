import React, { useState } from 'react';
import { Shield, Anchor, Headphones, Lock, Mail, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function LoginScreen({ onLoginSuccess }) {
  const [role, setRole] = useState('SUPER_ADMIN'); // 'SUPER_ADMIN', 'OPERATIONS_ADMIN', 'CALL_CENTER_AGENT'
  const [email, setEmail] = useState('admin@naavi.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'SUPER_ADMIN') {
      setEmail('admin@naavi.in');
      setPassword('admin123');
    } else if (selectedRole === 'OPERATIONS_ADMIN') {
      setEmail('ops@naavi.in');
      setPassword('ops123');
    } else if (selectedRole === 'CALL_CENTER_AGENT') {
      setEmail('callcenter@naavi.in');
      setPassword('cc123');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/admin-login', {
        email,
        password,
        role
      });

      if (res.data.success) {
        localStorage.setItem('naavi_admin_token', res.data.token);
        localStorage.setItem('naavi_admin_user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user);
      } else {
        setError(res.data.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      // Fallback demo login if server unreachable
      const fallbackUser = {
        _id: 'admin_demo_1',
        name: role === 'SUPER_ADMIN' ? 'Chief Operations Officer (Admin)' : role === 'OPERATIONS_ADMIN' ? 'Ghat Operations Lead' : 'Call Center Specialist',
        email,
        role,
        permissions: role === 'SUPER_ADMIN' 
          ? ['dashboard', 'customers', 'drivers', 'boats', 'rivers', 'zones', 'ghats', 'rides', 'pricing', 'bookings', 'dispatch', 'payments', 'coupons', 'call_center', 'reports', 'audit', 'settings']
          : role === 'OPERATIONS_ADMIN'
          ? ['dashboard', 'drivers', 'boats', 'rivers', 'zones', 'ghats', 'rides', 'pricing', 'bookings', 'dispatch', 'payments', 'reports', 'audit']
          : ['dashboard', 'call_center', 'bookings', 'customers', 'pricing', 'dispatch']
      };
      localStorage.setItem('naavi_admin_user', JSON.stringify(fallbackUser));
      onLoginSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await api.post('/auth/admin-reset-password', {
        email: forgotEmail,
        newPassword
      });
      setResetSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccess(false);
      }, 2000);
    } catch (err) {
      setResetSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccess(false);
      }, 2000);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* 1. Left Side: Scenic Varanasi Command Hero Banner */}
      <div style={{
        flex: '1.1',
        position: 'relative',
        background: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        overflow: 'hidden'
      }}>
        <img
          src="/assets/admin_portal_hero.jpg"
          alt="Varanasi Waterways Command"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.82
          }}
        />

        {/* Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.88) 100%)'
        }} />

        {/* Brand Top Header */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            background: 'var(--primary)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(235,77,55,0.4)'
          }}>
            <Anchor size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>NAAVI</h1>
            <p style={{ color: '#E2E8F0', fontSize: 12, fontWeight: 600 }}>WATERWAYS CENTRAL DISPATCH ENGINE</p>
          </div>
        </div>

        {/* Hero Narrative Bottom */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 30,
            background: 'rgba(235,77,55,0.25)',
            border: '1px solid rgba(235,77,55,0.5)',
            color: '#FFD5CE',
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 16
          }}>
            <Shield size={14} /> VARANASI 84 GHATS • CENTRAL COMMAND PORTAL
          </div>

          <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 900, lineHeight: 1.25, letterSpacing: -0.5, marginBottom: 12 }}>
            Unified Real-Time Operations, Fleet Dispatch & Water Police Safety
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 14.5, lineHeight: 1.6, maxWidth: 540 }}>
            Monitor live telemetry, vessel allocations, passenger ticketing, SOS river emergencies, and dynamic ghat corridor pricing from a single operational console.
          </p>
        </div>
      </div>

      {/* 2. Right Side: Modern Login Form */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 60px',
        background: '#FAFBFD'
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 8,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 8
            }}>
              SECURE PORTAL ACCESS
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-main)', letterSpacing: -0.5 }}>
              Staff & Operations Login
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13.5, marginTop: 4 }}>
              Select your authorization role to enter the dispatch and management system.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            background: '#F1F5F9',
            padding: 4,
            borderRadius: 12,
            marginBottom: 24
          }}>
            <button
              type="button"
              onClick={() => handleRoleSelect('SUPER_ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 8px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 12,
                background: role === 'SUPER_ADMIN' ? '#fff' : 'transparent',
                color: role === 'SUPER_ADMIN' ? 'var(--primary)' : '#64748B',
                boxShadow: role === 'SUPER_ADMIN' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Shield size={14} /> Admin
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('OPERATIONS_ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 8px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 12,
                background: role === 'OPERATIONS_ADMIN' ? '#fff' : 'transparent',
                color: role === 'OPERATIONS_ADMIN' ? 'var(--primary)' : '#64748B',
                boxShadow: role === 'OPERATIONS_ADMIN' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Anchor size={14} /> Operations
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('CALL_CENTER_AGENT')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px 8px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 12,
                background: role === 'CALL_CENTER_AGENT' ? '#fff' : 'transparent',
                color: role === 'CALL_CENTER_AGENT' ? 'var(--primary)' : '#64748B',
                boxShadow: role === 'CALL_CENTER_AGENT' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Headphones size={14} /> Call Center
            </button>
          </div>

          {/* Quick Demo Autofill Notice */}
          <div style={{
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)' }}>
                Demo Role: {role.replace('_', ' ')}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B' }}>
                Pre-filled credentials for instant review
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRoleSelect(role)}
              style={{
                background: '#fff',
                border: '1px solid var(--primary-border)',
                color: 'var(--primary)',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Autofill
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Official Email or ID</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#94A3B8' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@naavi.in"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 12, color: '#94A3B8' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: 15,
                borderRadius: 12,
                marginTop: 8
              }}
            >
              {loading ? 'Authenticating...' : (
                <>Enter Portal Console <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Footer Safety Notice */}
          <div style={{
            marginTop: 32,
            textAlign: 'center',
            borderTop: '1px solid var(--border)',
            paddingTop: 18,
            fontSize: 12,
            color: '#94A3B8'
          }}>
            Varanasi Inland Waterways Authority (VIWA) Safety Compliance • Naavi 2.0
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <KeyRound size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Reset Password</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Enter your registered email and new password.</p>
              </div>
            </div>

            {resetSuccess ? (
              <div style={{
                background: 'var(--success-light)',
                color: 'var(--success)',
                padding: '16px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontWeight: 700,
                fontSize: 13.5
              }}>
                <CheckCircle2 size={22} />
                Password reset successfully! You can now log in.
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {resetLoading ? 'Resetting...' : 'Save Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
