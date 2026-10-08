import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Calendar, Compass, Sailboat, FileSpreadsheet } from 'lucide-react';

export default function ReportsView({ reports = {} }) {
  const [timeRange, setTimeRange] = useState('TODAY'); // 'TODAY', 'WEEK', 'MONTH', 'YEAR'

  const reportData = reports.data || {
    summary: {
      totalRevenue: 84500,
      completedRides: 48,
      cancelledRides: 3,
      averageFarePerRide: 1760,
      averagePassengerRating: 4.88
    },
    topGhats: [
      { name: 'Dashashwamedh Ghat', trips: 22, revenue: 38500 },
      { name: 'Assi Ghat', trips: 15, revenue: 24200 },
      { name: 'Namo Ghat', trips: 8, revenue: 14800 },
      { name: 'Manikarnika Ghat', trips: 3, revenue: 7000 }
    ],
    vesselBreakdown: [
      { category: 'Motor Boat', percentage: 45, trips: 22 },
      { category: 'Luxury Bajra', percentage: 30, trips: 14 },
      { category: 'Row Boat', percentage: 15, trips: 7 },
      { category: 'Speed & EV', percentage: 10, trips: 5 }
    ]
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Ghat Name,Total Trips,Total Revenue (INR)\n"
      + reportData.topGhats.map(g => `${g.name},${g.trips},${g.revenue}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Naavi_Varanasi_Report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Page Hero Header */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-title">
            <BarChart3 size={26} />
            <span>Operational Reports & Business Analytics</span>
          </div>
          <div className="page-hero-subtitle">
            Revenue aggregates, corridor trip density, vessel utilization, and exportable financial summaries.
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="section-header">
        <div style={{ display: 'flex', gap: 6 }}>
          {['TODAY', 'WEEK', 'MONTH', 'YEAR'].map(tr => (
            <button
              key={tr}
              onClick={() => setTimeRange(tr)}
              className={`btn btn-sm ${timeRange === tr ? 'btn-primary' : 'btn-outline'}`}
            >
              {tr}
            </button>
          ))}
        </div>

        <button onClick={handleExportCSV} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileSpreadsheet size={16} /> Export CSV Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-box">
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>GROSS TRIP REVENUE</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
              ₹{reportData.summary.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--success)', fontWeight: 700 }}>Active Period Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#ECFDF5', color: 'var(--success)' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>COMPLETED TRIPS</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
              {reportData.summary.completedRides}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{reportData.summary.cancelledRides} Cancelled</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#FFF4EB', color: 'var(--accent)' }}>
            <Sailboat size={24} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>AVERAGE TICKET FARE</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
              ₹{reportData.summary.averageFarePerRide}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Per Booked Vessel</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <Compass size={24} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>CUSTOMER SATISFACTION</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 2 }}>
              {reportData.summary.averagePassengerRating} / 5.0
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--success)', fontWeight: 700 }}>Verified Post-Trip Reviews</div>
          </div>
        </div>
      </div>

      {/* Split Section: Top Ghats Ranking & Vessel Category Share */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Top Ghats by Passenger Volume & Revenue</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank & Ghat Name</th>
                  <th>Completed Trips</th>
                  <th>Total Collections (₹)</th>
                  <th>Corridor Share</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topGhats.map((g, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: idx === 0 ? 'var(--primary)' : '#F1F5F9',
                          color: idx === 0 ? '#fff' : '#64748B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 12
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontWeight: 800 }}>{g.name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{g.trips} Trips</td>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>₹{g.revenue.toLocaleString('en-IN')}</td>
                    <td>
                      <div style={{ width: 100, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, (g.trips / 22) * 100)}%`,
                          height: '100%',
                          background: 'var(--primary)',
                          borderRadius: 4
                        }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vessel Utilization Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Vessel Fleet Category Share</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reportData.vesselBreakdown.map((v, i) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 12, background: '#F8FAFC', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>{v.category}</span>
                  <strong style={{ fontSize: 14, color: 'var(--primary)' }}>{v.percentage}% ({v.trips} trips)</strong>
                </div>
                <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${v.percentage}%`,
                    height: '100%',
                    background: i === 0 ? 'var(--primary)' : i === 1 ? 'var(--accent)' : i === 2 ? '#059669' : '#475569',
                    borderRadius: 4
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
