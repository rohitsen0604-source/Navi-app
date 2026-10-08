import React, { useState } from 'react';
import { FileText, Search, Shield, Clock, RefreshCw, User, CheckCircle2 } from 'lucide-react';

export default function AuditView({ auditLogs = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchSearch = `${log.actorName} ${log.action} ${log.entity} ${log.notes}`.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div>
      {/* Page Hero Header */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-title">
            <FileText size={26} />
            <span>Operational Activity & Governance Audit Log</span>
          </div>
          <div className="page-hero-subtitle">
            Immutable chronological record of vessel reassignments, pricing overrides, KYC approvals, and staff actions.
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
              placeholder="Search audit logs by actor, action or notes..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['ALL', 'UPDATE_PRICING', 'REASSIGN_DRIVER', 'ASSISTED_BOOKING_CREATED'].map(act => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`btn btn-sm ${actionFilter === act ? 'btn-primary' : 'btn-outline'}`}
              >
                {act === 'ALL' ? 'All Activities' : act.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onRefresh} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={16} /> Sync Logs
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Staff / Actor</th>
              <th>Action Triggered</th>
              <th>Target Entity</th>
              <th>Notes & Details</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No audit log entries matching filter.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log._id}>
                  <td className="font-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: 13.5 }}>{log.actorName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.actorRole?.replace('_', ' ')}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {log.action?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: 13 }}>
                    {log.entity}
                  </td>
                  <td style={{ fontSize: 12.5, color: '#334155', maxWidth: 360 }}>
                    {log.notes}
                  </td>
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle2 size={12} /> Logged
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
