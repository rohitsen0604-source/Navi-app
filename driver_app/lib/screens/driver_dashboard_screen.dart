import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../core/constants.dart';
import '../services/driver_api_service.dart';

class DriverDashboardScreen extends StatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  State<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends State<DriverDashboardScreen> {
  io.Socket? _socket;
  bool _isDutyOn = false;
  Map<String, dynamic>? _driverProfile;
  Map<String, dynamic>? _activeBooking;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  void _loadDashboard() async {
    try {
      final res = await DriverApiService.getDashboard();
      if (res['success'] == true && mounted) {
        final data = res['data'];
        setState(() {
          _driverProfile = data['driver'];
          _isDutyOn = _driverProfile?['isDutyOn'] ?? false;
          _activeBooking = data['activeBooking'];
          _loading = false;
        });

        _initSocket(_driverProfile?['_id']);
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _initSocket(String? driverId) {
    if (driverId == null || _socket != null) return;

    try {
      _socket = io.io(AppConstants.socketUrl, <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': true,
      });

      _socket?.onConnect((_) {
        _socket?.emit('join_driver_room', driverId);
      });

      _socket?.on('NEW_BOOKING_REQUEST', (data) {
        if (mounted && data is Map<String, dynamic>) {
          _showIncomingRequestDialog(data);
        }
      });

      _socket?.on('BOOKING_UPDATE', (_) {
        _loadDashboard();
      });
    } catch (_) {}
  }

  void _toggleDuty() async {
    try {
      final res = await DriverApiService.toggleDuty();
      if (res['success'] == true && mounted) {
        setState(() {
          _isDutyOn = res['isDutyOn'];
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Duty switched ${_isDutyOn ? "ON (Online)" : "OFF (Offline)"}')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    }
  }

  void _showIncomingRequestDialog(Map<String, dynamic> request) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.directions_boat, color: Color(0xFF0D9488)),
            SizedBox(width: 8),
            Text('New Ride Request!'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Booking Ref: ${request['bookingCode']}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text('Pickup Ghat: ${request['boardingPoint']} (Zone ${request['zoneNumber']})'),
            Text('Passengers: ${request['seats']} Pax'),
            Text('Trip Type: ${request['tripType']}'),
            const SizedBox(height: 8),
            Text('Fare: ₹${request['fareAmount']}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0D9488))),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await DriverApiService.rejectBooking(request['bookingId']);
            },
            child: const Text('Reject', style: TextStyle(color: Colors.red)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
            onPressed: () async {
              Navigator.pop(ctx);
              await DriverApiService.acceptBooking(request['bookingId']);
              _loadDashboard();
            },
            child: const Text('Accept Ride'),
          ),
        ],
      ),
    );
  }

  void _startRide(String bookingId) async {
    await DriverApiService.startRide(bookingId);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ride started! Insurance notification triggered.')),
      );
    }
    _loadDashboard();
  }

  void _completeRide(String bookingId, double amount) async {
    await DriverApiService.completeRide(bookingId, amount);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ride completed! Cash payment registered.')),
      );
    }
    _loadDashboard();
  }

  @override
  void dispose() {
    _socket?.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final boat = _driverProfile?['assignedBoatId'];

    return Scaffold(
      appBar: AppBar(
        title: Text(_driverProfile?['name'] ?? 'Boatman Partner'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadDashboard),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Duty Toggle Header
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              color: _isDutyOn ? Colors.teal.shade50 : Colors.grey.shade100,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _isDutyOn ? '🟢 ONLINE FOR DISPATCH' : '⚪ OFFLINE (OFF DUTY)',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: _isDutyOn ? const Color(0xFF0D9488) : Colors.grey,
                          ),
                        ),
                        Text(
                          'Zone ${_driverProfile?['operationalZoneNumber']} • Vessel: ${boat?['name'] ?? "Assigned Boat"}',
                          style: const TextStyle(fontSize: 12, color: Colors.blueGrey),
                        ),
                      ],
                    ),
                    Switch(
                      value: _isDutyOn,
                      activeTrackColor: const Color(0xFF0D9488),
                      onChanged: (_) => _toggleDuty(),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Active Trip Card
            if (_activeBooking != null) ...[
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('CURRENT ACTIVE TRIP', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
                          Chip(
                            label: Text(_activeBooking!['status'], style: const TextStyle(fontSize: 11, color: Colors.white)),
                            backgroundColor: const Color(0xFF0D9488),
                          ),
                        ],
                      ),
                      const Divider(),
                      Text('Ref: ${_activeBooking!['bookingCode']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Pickup: ${_activeBooking!['boardingPointId']?['name'] ?? "Ghat"}', style: const TextStyle(fontSize: 14)),
                      Text('Seats: ${_activeBooking!['seatsBooked']} Passengers'),
                      Text('Collect: ₹${_activeBooking!['finalPayableAmount']} (Pay After Ride)', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.teal)),
                      const SizedBox(height: 16),
                      if (_activeBooking!['status'] == 'DRIVER_ASSIGNED')
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEB4D37)),
                          onPressed: () => _startRide(_activeBooking!['_id']),
                          child: const Text('Start River Ride (Trigger Insurance)'),
                        ),
                      if (_activeBooking!['status'] == 'RIDE_STARTED')
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                          onPressed: () => _completeRide(
                            _activeBooking!['_id'],
                            (_activeBooking!['finalPayableAmount'] as num).toDouble(),
                          ),
                          child: const Text('Complete Ride & Collect Fare'),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Earnings & Statistics
            Row(
              children: [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          const Text('Total Earnings', style: TextStyle(color: Colors.grey, fontSize: 12)),
                          const SizedBox(height: 4),
                          Text('₹${_driverProfile?['totalEarnings'] ?? 0}', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0D9488))),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          const Text('Completed Trips', style: TextStyle(color: Colors.grey, fontSize: 12)),
                          const SizedBox(height: 4),
                          Text('${_driverProfile?['totalRidesCompleted'] ?? 0}', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
