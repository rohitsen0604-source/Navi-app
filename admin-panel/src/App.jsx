import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from './services/api';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './views/DashboardView';
import BookingsView from './views/BookingsView';
import MasterDataView from './views/MasterDataView';
import DriversView from './views/DriversView';
import CallCenterView from './views/CallCenterView';
import SOSView from './views/SOSView';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [zones, setZones] = useState([]);
  const [ghats, setGhats] = useState([]);
  const [boats, setBoats] = useState([]);
  const [incidents, setIncidents] = useState([]);

  // Fetch all initial data
  const loadData = async () => {
    try {
      const [
        statsRes,
        bookingsRes,
        driversRes,
        zonesRes,
        ghatsRes,
        boatsRes,
        sosRes
      ] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/bookings'),
        api.get('/admin/drivers'),
        api.get('/master-data/zones'),
        api.get('/master-data/boarding-points'),
        api.get('/master-data/available-boats'),
        api.get('/admin/sos-incidents')
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.stats);
      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data.data);
      if (driversRes.status === 'fulfilled') setDrivers(driversRes.value.data.data);
      if (zonesRes.status === 'fulfilled') setZones(zonesRes.value.data.data);
      if (ghatsRes.status === 'fulfilled') setGhats(ghatsRes.value.data.data);
      if (boatsRes.status === 'fulfilled') setBoats(boatsRes.value.data.data);
      if (sosRes.status === 'fulfilled') setIncidents(sosRes.value.data.data);
    } catch (e) {
      console.warn('[Admin Panel] Initial fetch error:', e.message);
    }
  };

  useEffect(() => {
    loadData();

    // Setup Socket connection for 95% Interconnection
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_admin_room');
      console.log('[Admin Socket] Connected and joined operations room');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('BOOKING_UPDATE', (payload) => {
      console.log('[Admin Live Event] Booking update received:', payload);
      loadData(); // Synchronize immediately
    });

    socket.on('SOS_EMERGENCY_ALERT', (payload) => {
      alert(`🚨 CRITICAL SOS ALERT: Booking ${payload.bookingCode}`);
      loadData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Operations Dashboard';
      case 'bookings': return 'Live Bookings & Dispatch Control';
      case 'master_data': return 'Master Data & River Assets';
      case 'drivers': return 'Boatmen & Driver Fleet';
      case 'call_center': return 'Call Center Assisted Booking';
      case 'sos': return 'Emergency Incident Desk';
      case 'reports': return 'Operational Reports & Analytics';
      case 'settings': return 'System Settings';
      default: return 'Naavi Operations Panel';
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="admin-main">
        <Topbar isConnected={isConnected} onRefresh={loadData} title={getTabTitle()} />

        <main className="content-area">
          {currentTab === 'dashboard' && (
            <DashboardView stats={stats} onNavigate={setCurrentTab} />
          )}

          {currentTab === 'bookings' && (
            <BookingsView bookings={bookings} drivers={drivers} onRefresh={loadData} />
          )}

          {currentTab === 'master_data' && (
            <MasterDataView zones={zones} ghats={ghats} boats={boats} onRefresh={loadData} />
          )}

          {currentTab === 'drivers' && (
            <DriversView drivers={drivers} onRefresh={loadData} />
          )}

          {currentTab === 'call_center' && (
            <CallCenterView zones={zones} ghats={ghats} onBookingCreated={loadData} />
          )}

          {currentTab === 'sos' && (
            <SOSView incidents={incidents} onRefresh={loadData} />
          )}

          {currentTab === 'reports' && (
            <div className="card">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Operational Reports & Audit Summary</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                Daily trip volume, boat utilization rates, and cash collections are logged centrally.
              </p>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="card">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Configuration & System Parameters</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                Razorpay keys, MSG91 template IDs, and insurance endpoint endpoints.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
