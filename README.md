# ⚓ Naavi – River & Lake Boat Booking & Operations Platform

> **~95% Interconnected Single Source of Truth Ecosystem**
> Built according to the **Naavi Final Technical Development Document**.

---

## 🏛️ System Architecture Overview

```
                          ┌────────────────────────────┐
                          │   Information Website      │
                          └─────────────┬──────────────┘
                                        │ (Deep-link)
         ┌──────────────────────────────┼──────────────────────────────┐
         │                              │                              │
 ┌───────▼────────┐           ┌─────────▼──────────┐          ┌────────▼───────┐
 │  Customer App  │◄─────────►│  Central Backend   │◄────────►│   Driver App   │
 │   (Flutter)    │ WebSocket │ (Node.js + Mongo)  │WebSocket │   (Flutter)    │
 └────────────────┘           └─────────▲──────────┘          └────────────────┘
                                        │
                              ┌─────────┴──────────┐
                              │ Admin & Ops Panel  │
                              │   (React + Vite)   │
                              └────────────────────┘
```

---

## 📁 Repository Structure

| Directory | Tech Stack | Description |
|---|---|---|
| [`backend/`](file:///c:/Users/Hp/.gemini/antigravity-ide/scratch/Navi-app/backend) | **Node.js, Express, Socket.io, Mongoose, Redis** | Central booking engine, allocation algorithm, Redis locks, SOS & Insurance hooks. |
| [`admin-panel/`](file:///c:/Users/Hp/.gemini/antigravity-ide/scratch/Navi-app/admin-panel) | **React, Vite, Lucide Icons, Socket.io-client** | Dispatch command center, 15 Varanasi zones master data, driver reassignment, call-center booking, SOS desk. |
| [`customer_app/`](file:///c:/Users/Hp/.gemini/antigravity-ide/scratch/Navi-app/customer_app) | **Flutter (Android + iOS)** | B2C passenger app: OTP auth, Ghat selection, Book Now / Book Later (T+2), live status & SOS button. |
| [`driver_app/`](file:///c:/Users/Hp/.gemini/antigravity-ide/scratch/Navi-app/driver_app) | **Flutter (Android + iOS)** | Boatman app: On/Off duty toggle, instant booking request acceptance, start/complete trip, earnings. |

---

## 🚀 How to Run the Ecosystem

### 1. Backend Server (Node.js)
```bash
cd backend
npm install
# Seed Varanasi Master Data (15 Zones, Ghats, Demo Boats, and Drivers)
npm run seed
# Start development server
npm run dev
```
* **API URL:** `http://localhost:5000`
* **Health Check:** `http://localhost:5000/health`

### 2. Admin & Operations Web Panel (React)
```bash
cd admin-panel
npm install
npm run dev
```
* **Web Panel URL:** `http://localhost:5173`

### 3. Customer Mobile App (Flutter)
```bash
cd customer_app
flutter run
```
* Default Test OTP: `123456`
* Pre-configured test customer: `9876543212`

### 4. Driver / Boatman Mobile App (Flutter)
```bash
cd driver_app
flutter run
```
* Default Test OTP: `123456`
* Pre-configured test boatman: `9876543220` (Ram Manjhi - Zone 1 Assi Ghat)

---

## 🔑 Key Features Implemented

1. **Central Allocation Engine (`backend/src/services/allocationService.js`):**
   * Multi-zone matching (Same zone priority ➔ Adjacent zone fallback).
   * Duty verification (`isDutyOn === true`) and active trip check.
   * Vessel capacity constraint check (`seats <= boat.capacity`).
   * **Atomic Reservation Lock** with Redis/In-memory mutex to eliminate double-booking race conditions.

2. **95% Interconnection via WebSockets (`backend/src/services/socketService.js`):**
   * Actions from Customer or Admin (reassignments, booking creation) immediately update Driver and Ops dashboards in real time.

3. **Master Data for Varanasi:**
   * 15 continuous Ganges Zones from Zone 1 (Assi Ghat) to Zone 15 (Sant Ravidas Ghat).
   * Prominent Ghats with GPS coordinates.
   * Motor Boats, Luxury Bajras, and Eco Vessels pre-seeded.

4. **Call Center Assisted Booking:**
   * Admin and call-center staff can take phone bookings and dispatch via the central booking engine with automated fare calculation.

5. **Safety & Compliance:**
   * One-tap Emergency SOS incident routing.
   * Insurance event triggers at Ride Start and Ride Completion.