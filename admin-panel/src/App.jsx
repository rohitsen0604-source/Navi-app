import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from './services/api';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import LoginScreen from './components/LoginScreen';

// Views
import DashboardView from './views/DashboardView';
import BookingsView from './views/BookingsView';
import CallCenterView from './views/CallCenterView';
import SOSView from './views/SOSView';
import CustomersView from './views/CustomersView';
import DriversView from './views/DriversView';
import BoatsView from './views/BoatsView';
import MasterDataView from './views/MasterDataView';
import PricingView from './views/PricingView';
import PaymentsView from './views/PaymentsView';
import CouponsView from './views/CouponsView';
import ReportsView from './views/ReportsView';
import AuditView from './views/AuditView';
import SettingsView from './views/SettingsView';

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }
  return 'https://navi-app-8vqo.onrender.com';
};

const SOCKET_URL = getSocketUrl();

export default function App() {

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('naavi_admin_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveNotification, setLiveNotification] = useState(null);

  // Core State
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [boats, setBoats] = useState([]);
  const [rivers, setRivers] = useState([]);
  const [zones, setZones] = useState([]);
  const [ghats, setGhats] = useState([]);
  const [rideTypes, setRideTypes] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [payments, setPayments] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState(null);
  const [incidents, setIncidents] = useState([]);

  const handleLogin = (user, token) => {
    localStorage.setItem('naavi_admin_user', JSON.stringify(user));
    localStorage.setItem('naavi_admin_token', token);
    setCurrentUser(user);
    // If Call Center role, default to call center tab
    if (user.role === 'CALL_CENTER_AGENT') {
      setCurrentTab('call_center');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('naavi_admin_user');
    localStorage.removeItem('naavi_admin_token');
    setCurrentUser(null);
  };

  // Fetch all initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        bookingsRes,
        custRes,
        driversRes,
        boatsRes,
        riversRes,
        zonesRes,
        ghatsRes,
        ridesRes,
        pricingRes,
        paymentsRes,
        couponsRes,
        auditRes,
        settingsRes,
        sosRes
      ] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/bookings'),
        api.get('/admin/customers'),
        api.get('/admin/drivers'),
        api.get('/admin/boats'),
        api.get('/admin/rivers'),
        api.get('/admin/zones'),
        api.get('/admin/ghats'),
        api.get('/admin/ride-types'),
        api.get('/admin/pricing-config'),
        api.get('/admin/payments'),
        api.get('/admin/coupons'),
        api.get('/admin/audit-logs'),
        api.get('/admin/settings'),
        api.get('/admin/sos-incidents')
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.stats);
      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data.data || []);
      if (custRes.status === 'fulfilled') setCustomers(custRes.value.data.data || []);
      if (driversRes.status === 'fulfilled') setDrivers(driversRes.value.data.data || []);
      if (boatsRes.status === 'fulfilled') setBoats(boatsRes.value.data.data || []);
      if (riversRes.status === 'fulfilled') setRivers(riversRes.value.data.data || []);
      if (zonesRes.status === 'fulfilled') setZones(zonesRes.value.data.data || []);
      if (ghatsRes.status === 'fulfilled') setGhats(ghatsRes.value.data.data || []);
      if (ridesRes.status === 'fulfilled') setRideTypes(ridesRes.value.data.data || []);
      if (pricingRes.status === 'fulfilled') setPricing(pricingRes.value.data.data);
      if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value.data.data || []);
      if (couponsRes.status === 'fulfilled') setCoupons(couponsRes.value.data.data || []);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value.data.data || []);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value.data.data);
      if (sosRes.status === 'fulfilled') setIncidents(sosRes.value.data.data || []);
    } catch (e) {
      console.warn('[Admin Panel] Fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();

      // Setup Socket connection
      const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        setIsConnected(true);
        socket.emit('join_admin_room');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('NEW_BOOKING_ALERT', (payload) => {
        setLiveNotification({
          type: 'NEW_BOOKING',
          title: `⚡ New Ride Request: ${payload.bookingCode || 'NV-New'}`,
          desc: `Passenger ${payload.customerName || 'Tourist'} • ₹${payload.fareAmount || 1150} • Zone ${payload.zoneNumber || 1}`,
          bookingId: payload.bookingId,
          time: new Date().toLocaleTimeString()
        });
        loadData();
      });

      socket.on('BOOKING_UPDATE', () => {
        loadData();
      });

      socket.on('GLOBAL_BOOKING_UPDATE', () => {
        loadData();
      });

      socket.on('SOS_EMERGENCY_ALERT', (payload) => {
        setLiveNotification({
          type: 'SOS',
          title: `🚨 CRITICAL SOS ALERT: Booking ${payload.bookingCode || 'Emergency Triggered'}`,
          desc: `Incident reported at Varanasi Waterways. Rescue units dispatched.`,
          bookingId: payload.bookingId,
          time: new Date().toLocaleTimeString()
        });
        loadData();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Operations Dashboard';
      case 'bookings': return 'Live Bookings & Dispatch Control';
      case 'call_center': return 'Call Center Assisted Booking';
      case 'sos': return 'Emergency Incident Desk';
      case 'customers': return 'Customer Management';
      case 'drivers': return 'Boatmen & Driver Fleet';
      case 'boats': return 'Boat Fleet Registry';
      case 'rivers': return 'Rivers & Lakes Management';
      case 'zones': return 'Corridor Zone Management';
      case 'ghats': return 'Ghats & Boarding Points';
      case 'rides': return 'Ride Setup & Packages';
      case 'master_data': return 'Master Data & River Assets';
      case 'pricing': return 'Pricing & Fare Configuration';
      case 'payments': return 'Payments & Refund Visibility';
      case 'coupons': return 'Promotional Coupons & Points';
      case 'reports': return 'Operational Reports & Analytics';
      case 'audit': return 'Operational Activity & Audit Log';
      case 'settings': return 'System Settings & Hotline';
      default: return 'Naavi Operations Panel';
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={currentUser}
        onLogout={handleLogout}
      />

      <div className="admin-main">
        <Topbar
          isConnected={isConnected}
          onRefresh={loadData}
          title={getTabTitle()}
          user={currentUser}
        />

        <main className="content-area">
          {/* Real-time Socket Live Notification Banner */}
          {liveNotification && (
            <div
              style={{
                marginBottom: 16,
                padding: '12px 18px',
                borderRadius: 12,
                backgroundColor: liveNotification.type === 'SOS' ? '#FEF2F2' : '#F0FDF4',
                border: `1.5px solid ${liveNotification.type === 'SOS' ? '#FCA5A5' : '#86EFAC'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>{liveNotification.type === 'SOS' ? '🚨' : '⚡'}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: liveNotification.type === 'SOS' ? '#991B1B' : '#166534' }}>
                    {liveNotification.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: liveNotification.type === 'SOS' ? '#B91C1C' : '#15803D' }}>
                    {liveNotification.desc} • <span style={{ opacity: 0.8 }}>{liveNotification.time}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setCurrentTab('bookings')}
                  style={{
                    backgroundColor: liveNotification.type === 'SOS' ? '#DC2626' : '#16A34A',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  View in Dispatch
                </button>
                <button
                  onClick={() => setLiveNotification(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: 16,
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {currentTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              bookings={bookings}
              drivers={drivers}
              ghats={ghats}
              onNavigate={setCurrentTab}
              onRefresh={loadData}
            />
          )}

          {currentTab === 'bookings' && (
            <BookingsView
              bookings={bookings}
              drivers={drivers}
              boats={boats}
              onRefresh={loadData}
            />
          )}

          {currentTab === 'call_center' && (
            <CallCenterView
              zones={zones}
              ghats={ghats}
              onBookingCreated={loadData}
            />
          )}

          {currentTab === 'sos' && (
            <SOSView incidents={incidents} onRefresh={loadData} />
          )}

          {currentTab === 'customers' && (
            <CustomersView customers={customers} onRefresh={loadData} />
          )}

          {currentTab === 'drivers' && (
            <DriversView drivers={drivers} boats={boats} onRefresh={loadData} />
          )}

          {currentTab === 'boats' && (
            <BoatsView boats={boats} zones={zones} onRefresh={loadData} />
          )}

          {['rivers', 'zones', 'ghats', 'rides', 'master_data'].includes(currentTab) && (
            <MasterDataView
              key={currentTab}
              initialTab={currentTab === 'master_data' ? 'ghats' : currentTab}
              rivers={rivers}
              zones={zones}
              ghats={ghats}
              rideTypes={rideTypes}
              onRefresh={loadData}
              onTabChange={(tabId) => setCurrentTab(tabId)}
            />
          )}

          {currentTab === 'pricing' && (
            <PricingView pricing={pricing} onRefresh={loadData} />
          )}

          {currentTab === 'payments' && (
            <PaymentsView payments={payments} onRefresh={loadData} />
          )}


          {currentTab === 'coupons' && (
            <CouponsView coupons={coupons} onRefresh={loadData} />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              stats={stats}
              bookings={bookings}
              payments={payments}
              ghats={ghats}
              boats={boats}
            />
          )}

          {currentTab === 'audit' && (
            <AuditView auditLogs={auditLogs} onRefresh={loadData} />
          )}

          {currentTab === 'settings' && (
            <SettingsView settings={settings} onRefresh={loadData} />
          )}
        </main>
      </div>
    </div>
  );
}

