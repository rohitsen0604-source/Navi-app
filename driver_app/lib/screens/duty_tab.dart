import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../core/constants.dart';
import '../services/driver_api_service.dart';
import '../widgets/request_dialog.dart';
import '../widgets/collect_payment_dialog.dart';

class DutyTab extends StatefulWidget {
  const DutyTab({super.key});

  @override
  State<DutyTab> createState() => _DutyTabState();
}

class _DutyTabState extends State<DutyTab> {
  io.Socket? _socket;
  bool _isDutyOn = false;
  Map<String, dynamic>? _driverProfile;
  Map<String, dynamic>? _activeBooking;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDutyState();
  }

  void _loadDutyState() async {
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
        _loadDutyState();
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
          SnackBar(
            backgroundColor: _isDutyOn ? const Color(0xFF0D9488) : Colors.grey.shade700,
            content: Text('Duty switched ${_isDutyOn ? "ON (Online for Ghat Dispatch)" : "OFF (Offline)"}'),
          ),
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
      builder: (ctx) => IncomingRequestDialog(
        request: request,
        onAccept: () async {
          Navigator.pop(ctx);
          await DriverApiService.acceptBooking(request['bookingId']);
          _loadDutyState();
        },
        onReject: () async {
          Navigator.pop(ctx);
          await DriverApiService.rejectBooking(request['bookingId']);
          _loadDutyState();
        },
      ),
    );
  }

  void _startRide(String bookingId) async {
    await DriverApiService.startRide(bookingId);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFFEB4D37),
          content: Text('Ride started! Passenger insurance policy active.'),
        ),
      );
    }
    _loadDutyState();
  }

  void _openCompletePaymentModal(String bookingId, double amount, String bookingCode) {
    showDialog(
      context: context,
      builder: (ctx) => CollectPaymentDialog(
        bookingCode: bookingCode,
        amount: amount,
        onConfirm: (collected) async {
          await DriverApiService.completeRide(bookingId, collected);
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                backgroundColor: Colors.green,
                content: Text('Trip Completed! Fare recorded in your daily earnings.'),
              ),
            );
          }
          _loadDutyState();
        },
      ),
    );
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
    final customer = _activeBooking?['customerId'];

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Text('⚓ ', style: TextStyle(fontSize: 22)),
            Text('Ganges Duty Desk'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadDutyState,
            tooltip: 'Refresh Duty Status',
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Online / Offline Duty Switch Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: _isDutyOn
                      ? [const Color(0xFF0D9488), const Color(0xFF0F766E)]
                      : [Colors.blueGrey.shade800, Colors.blueGrey.shade900],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: (_isDutyOn ? const Color(0xFF0D9488) : Colors.black).withValues(alpha: 0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Icon(
                        _isDutyOn ? Icons.radar : Icons.power_settings_new,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _isDutyOn ? 'ONLINE ON GHAT' : 'DUTY OFF (OFFLINE)',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _isDutyOn
                              ? 'Waiting for bookings in Zone ${_driverProfile?['operationalZoneNumber']}'
                              : 'Toggle switch to start receiving ride requests',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.85),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Switch(
                    value: _isDutyOn,
                    activeTrackColor: Colors.white,
                    activeThumbColor: const Color(0xFF0D9488),
                    inactiveThumbColor: Colors.white,
                    inactiveTrackColor: Colors.white.withValues(alpha: 0.3),
                    onChanged: (_) => _toggleDuty(),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Assigned Vessel Quick Specs
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: Colors.teal.shade50,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.directions_boat, color: Color(0xFF0D9488)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          boat?['name'] ?? 'Varanasi Motor Vessel',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                        Text(
                          'ID: ${boat?['customBoatId'] ?? "BOAT-Z1-001"} • Reg: ${boat?['governmentRegNumber'] ?? "UP-65-NV-1001"}',
                          style: const TextStyle(fontSize: 11, color: Colors.blueGrey),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${boat?['capacity'] ?? 10} Seats',
                      style: TextStyle(color: Colors.green.shade800, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Current Active Trip Section
            if (_activeBooking != null) ...[
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF0D9488), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF0D9488).withValues(alpha: 0.08),
                      blurRadius: 15,
                      offset: const Offset(0, 6),
                    )
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'CURRENT ACTIVE RIDE',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0D9488),
                            letterSpacing: 0.8,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: _activeBooking!['status'] == 'RIDE_STARTED'
                                ? Colors.green.shade100
                                : const Color(0xFFFFD5CE),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            _activeBooking!['status'] == 'RIDE_STARTED' ? 'RIDE UNDERWAY' : 'ASSIGNED',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: _activeBooking!['status'] == 'RIDE_STARTED'
                                  ? Colors.green.shade800
                                  : const Color(0xFFEB4D37),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    Text(
                      'Booking Ref: ${_activeBooking!['bookingCode']}',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),

                    // Pickup Ghat Info Box
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.pin_drop, color: Color(0xFFEB4D37), size: 24),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('BOARDING POINT (GHAT)', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                                Text(
                                  _activeBooking!['boardingPointId']?['name'] ?? 'Assi Ghat',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Customer Contact Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              customer?['firstName'] != null
                                  ? '${customer['firstName']} ${customer['lastName'] ?? ""}'
                                  : 'Passenger',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                            ),
                            Text(
                              '${_activeBooking!['seatsBooked']} Passengers • ${_activeBooking!['tripType']?.replaceAll('_', ' ')}',
                              style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                        IconButton(
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.green.shade50,
                            foregroundColor: Colors.green.shade700,
                          ),
                          icon: const Icon(Icons.call),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Calling customer: ${customer?['phone'] ?? "N/A"}')),
                            );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Collect Fare Indicator
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade50,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Fare to Collect on Ghat:', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                          Text(
                            '₹${_activeBooking!['finalPayableAmount']}',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.amber.shade900),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Action Button based on Ride State
                    if (_activeBooking!['status'] == 'DRIVER_ASSIGNED')
                      ElevatedButton.icon(
                        icon: const Icon(Icons.play_arrow),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEB4D37),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () => _startRide(_activeBooking!['_id']),
                        label: const Text('Start River Trip (Insurance Sync)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      ),

                    if (_activeBooking!['status'] == 'RIDE_STARTED')
                      ElevatedButton.icon(
                        icon: const Icon(Icons.check_circle),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0D9488),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () => _openCompletePaymentModal(
                          _activeBooking!['_id'],
                          (_activeBooking!['finalPayableAmount'] as num).toDouble(),
                          _activeBooking!['bookingCode'] ?? 'NV-RIDE',
                        ),
                        label: const Text('Complete Trip & Collect Cash', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      ),
                  ],
                ),
              ),
            ] else ...[
              // Idle state card when duty is on but no active ride
              Container(
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  children: [
                    Icon(
                      _isDutyOn ? Icons.waves : Icons.bedtime_outlined,
                      size: 48,
                      color: _isDutyOn ? const Color(0xFF0D9488) : Colors.grey,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _isDutyOn ? 'Vessel Ready on Ghat' : 'You are currently Offline',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _isDutyOn
                          ? 'Central allocation engine will automatically sound an alert when a passenger books near your Ghat corridor.'
                          : 'Turn duty ON from the top switch to start receiving Varanasi passenger bookings.',
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 12, color: Colors.blueGrey),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
