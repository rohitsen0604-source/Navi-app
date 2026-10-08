import React from 'react';
import { Activity, Bell, RefreshCw, Radio, UserCheck } from 'lucide-react';

export default function Topbar({ isConnected, onRefresh, title, user }) {
  return (
    <header className="topbar">
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -0.3, margin: 0 }}>
          {title}
        </h1>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '3px 0 0', fontWeight: 500 }}>
          Ganges Waterways Operations &bull; Varanasi Corridor Command
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Real-time backend status badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 99,
          background: isConnected ? '#ecfdf5' : '#fff1f2',
          border: `1px solid ${isConnected ? '#a7f3d0' : '#fecdd3'}`,
          fontSize: 12.5,
          fontWeight: 700,
          color: isConnected ? '#059669' : '#e11d48'
        }}>
          <Radio size={14} style={{ animation: isConnected ? 'pulse 1.5s infinite' : 'none' }} />
          <span>{isConnected ? 'Live Socket Connected' : 'Connecting to API...'}</span>
        </div>

        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px 4px 6px',
            borderRadius: 99,
            background: 'var(--primary-light)',
            border: '1px solid rgba(235,77,55,0.2)'
          }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 800
            }}>
              {user.name?.[0] || 'A'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
              {user.role?.replace('_', ' ')}
            </div>
          </div>
        )}

        <button onClick={onRefresh} className="btn btn-outline" style={{ padding: '8px 12px' }} title="Refresh live data">
          <RefreshCw size={15} />
        </button>

        <button className="btn btn-outline" style={{ padding: '8px 12px', position: 'relative' }} title="System Notifications">
          <Bell size={16} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }} />
        </button>
      </div>
    </header>
  );
}

