import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as socket_io;
import '../core/constants.dart';
import '../services/api_service.dart';

class ActiveRideScreen extends StatefulWidget {
  final String bookingId;
  final String bookingCode;
  final String ghatName;
  final int fare;

  const ActiveRideScreen({
    super.key,
    required this.bookingId,
    required this.bookingCode,
    required this.ghatName,
    required this.fare,
  });

  @override
  State<ActiveRideScreen> createState() => _ActiveRideScreenState();
}

class _ActiveRideScreenState extends State<ActiveRideScreen> {
  socket_io.Socket? _socket;
  String _status = 'SEARCHING_DRIVER';
  Map<String, dynamic>? _bookingDetails;
  bool _sosSent = false;

  @override
  void initState() {
    super.initState();
    _initSocket();
    _pollBooking();
  }

  void _initSocket() {
    try {
      _socket = socket_io.io(AppConstants.socketUrl, <String, dynamic>{
        'transports': ['websocket'],
        'autoConnect': true,
      });

      _socket?.onConnect((_) {
        _socket?.emit('join_customer_room', widget.bookingId);
      });

      _socket?.on('BOOKING_UPDATE', (data) {
        if (data != null && mounted) {
          setState(() {
            _status = data['status'] ?? _status;
          });
          _pollBooking();
        }
      });
    } catch (e) {
      debugPrint('Socket error: $e');
    }
  }

  void _pollBooking() async {
    try {
      final res = await ApiService.getBooking(widget.bookingId);
      if (res['success'] == true && mounted) {
        setState(() {
          _bookingDetails = res['data'];
          _status = _bookingDetails?['status'] ?? _status;
        });
      }
    } catch (_) {}
  }

  void _triggerEmergencySOS() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Trigger Emergency SOS?', style: TextStyle(color: Colors.red)),
        content: const Text('This will instantly alert Varanasi Water Police and Naavi Command Center with your location.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Confirm SOS'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await ApiService.triggerSOS(widget.bookingId);
      setState(() => _sosSent = true);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(backgroundColor: Colors.red, content: Text('SOS Alert routed to Water Police & Ground Dispatch!')),
        );
      }
    }
  }

  @override
  void dispose() {
    _socket?.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final driver = _bookingDetails?['driverId'];
    final boat = _bookingDetails?['boatId'];

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.bookingCode),
        automaticallyImplyLeading: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: _status == 'RIDE_STARTED' ? Colors.green.shade50 : const Color(0xFFFFF1EE),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: _status == 'RIDE_STARTED' ? Colors.green.shade200 : const Color(0xFFFFD5CE),
                ),
              ),
              child: Column(
                children: [
                  Icon(
                    _status == 'RIDE_STARTED' ? Icons.directions_boat : Icons.schedule,
                    size: 40,
                    color: _status == 'RIDE_STARTED' ? Colors.green : const Color(0xFFEB4D37),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _status.replaceAll('_', ' '),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: _status == 'RIDE_STARTED' ? Colors.green.shade800 : const Color(0xFFEB4D37),
                    ),
                  ),
                  Text(
                    'Boarding at ${widget.ghatName}',
                    style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Boatman / Driver Details Card
            if (driver != null) ...[
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: const Color(0xFFFFD5CE),
                        child: const Icon(Icons.person, color: Color(0xFFEB4D37), size: 30),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(driver['name'] ?? 'Boatman', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                            Text('⭐ 4.9 • ${driver['phone'] ?? ''}', style: const TextStyle(color: Color(0xFF64748B), fontSize: 13)),
                            if (boat != null)
                              Text('Vessel: ${boat['name']} (${boat['customBoatId']})', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.call, color: Colors.green),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),
              ),
            ] else ...[
              const Center(
                child: Text('Finding nearest available boatman in your Ghat corridor...'),
              ),
            ],

            const Spacer(),

            // SOS Emergency Button (Enabled when ride is active or assigned)
            ElevatedButton.icon(
              icon: const Icon(Icons.warning, color: Colors.white),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade600,
                foregroundColor: Colors.white,
              ),
              onPressed: _triggerEmergencySOS,
              label: Text(_sosSent ? 'SOS TRANSMITTED' : 'EMERGENCY SOS'),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Back to Home'),
            ),
          ],
        ),
      ),
    );
  }
}
