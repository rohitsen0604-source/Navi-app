import React from 'react';
import { Activity, Bell, RefreshCw, Radio } from 'lucide-react';

export default function Topbar({ isConnected, onRefresh, title }) {
  return (
    <header className="topbar">
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>{title}</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Ganges Waterway Operations • Varanasi Corridor</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Real-time backend status badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 99,
          background: isConnected ? '#ecfdf5' : '#fff1f2',
          border: `1px solid ${isConnected ? '#a7f3d0' : '#fecdd3'}`,
          fontSize: 13,
          fontWeight: 600,
          color: isConnected ? '#059669' : '#e11d48'
        }}>
          <Radio size={14} className={isConnected ? 'animate-pulse' : ''} />
          <span>{isConnected ? 'Backend 95% Synced' : 'Connecting to API...'}</span>
        </div>

        <button onClick={onRefresh} className="btn btn-outline" style={{ padding: '8px 12px' }} title="Refresh live data">
          <RefreshCw size={15} />
        </button>

        <button className="btn btn-outline" style={{ padding: '8px 12px', position: 'relative' }}>
          <Bell size={16} />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
        </button>
      </div>
    </header>
  );
}
