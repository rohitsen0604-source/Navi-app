import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as socket_io;
import '../core/constants.dart';
import '../services/api_service.dart';
import 'live_ride_screen.dart';
import 'sos_emergency_screen.dart';

class ActiveRideScreen extends StatefulWidget {
  final String bookingId;
  final String bookingCode;
  final String ghatName;
  final int fare;
  final String boatName;
  final String boatNumber;
  final int passengers;
  final String tripDuration;

  const ActiveRideScreen({
    super.key,
    required this.bookingId,
    required this.bookingCode,
    required this.ghatName,
    required this.fare,
    this.boatName = 'Motor Boat',
    this.boatNumber = 'UPB-1024',
    this.passengers = 2,
    this.tripDuration = 'Full Trip (2 hrs)',
  });

  @override
  State<ActiveRideScreen> createState() => _ActiveRideScreenState();
}

class _ActiveRideScreenState extends State<ActiveRideScreen> {
  socket_io.Socket? _socket;
  String _status = 'DRIVER_ASSIGNED';
  Map<String, dynamic>? _bookingDetails;
  int _currentStepIndex = 1; // 0: Booking Confirmed, 1: Driver Assigned, 2: On the Way, 3: Ride Started, 4: Completed

  final String _driverName = 'Ramesh Yadav';
  final String _driverRating = '4.8 (320+ rides)';
  final String _driverPhone = '+91 98765 43220';

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
            _updateStepIndex(_status);
          });
          _pollBooking();
        }
      });
    } catch (e) {
      debugPrint('Socket error: $e');
    }
  }

  void _updateStepIndex(String status) {
    if (status == 'SEARCHING_DRIVER') {
      _currentStepIndex = 0;
    } else if (status == 'DRIVER_ASSIGNED') {
      _currentStepIndex = 1;
    } else if (status == 'DRIVER_ARRIVED' || status == 'ON_THE_WAY') {
      _currentStepIndex = 2;
    } else if (status == 'RIDE_STARTED' || status == 'IN_TRIP') {
      _currentStepIndex = 3;
    } else if (status == 'RIDE_COMPLETED' || status == 'COMPLETED') {
      _currentStepIndex = 4;
    }
  }

  void _pollBooking() async {
    try {
      final res = await ApiService.getBooking(widget.bookingId);
      if (res['success'] == true && mounted) {
        setState(() {
          _bookingDetails = res['data'];
          _status = _bookingDetails?['status'] ?? _status;
          _updateStepIndex(_status);
        });
      }
    } catch (_) {}
  }

  void _showHelpModal() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Naavi 24/7 River Help Center',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 14),
                ListTile(
                  leading: const Icon(Icons.phone_in_talk, color: Color(0xFFEB4D37)),
                  title: const Text('Call Ghat Operations Desk', style: TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: const Text('+91 542 2220191 • Toll Free'),
                  onTap: () => Navigator.pop(ctx),
                ),
                ListTile(
                  leading: const Icon(Icons.shield_outlined, color: Color(0xFFEB4D37)),
                  title: const Text('Varanasi Water Police Post', style: TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: const Text('Dashashwamedh River Patrol #112'),
                  onTap: () => Navigator.pop(ctx),
                ),
                ListTile(
                  leading: const Icon(Icons.chat_bubble_outline, color: Color(0xFFEB4D37)),
                  title: const Text('Chat with Naavi Support', style: TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: const Text('Typical reply in 1 min'),
                  onTap: () => Navigator.pop(ctx),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _handleDriverCall() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Calling Driver Ramesh Yadav ($_driverPhone)...'),
        backgroundColor: const Color(0xFF0F172A),
      ),
    );
  }

  void _handleDriverChat() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening chat with driver Ramesh Yadav...'),
        backgroundColor: Color(0xFF0F172A),
      ),
    );
  }

  void _handleShareTrip() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Live boat trip tracking link copied for Ref ${widget.bookingCode}!'),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
  }

  void _triggerEmergencySOS() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => SosEmergencyScreen(
          bookingId: widget.bookingId,
          bookingCode: widget.bookingCode,
          initialGhat: widget.ghatName,
        ),
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
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Ride Confirmed',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontSize: 18,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),
        centerTitle: true,
        actions: [
          TextButton.icon(
            icon: const Icon(Icons.headset_mic_outlined, size: 18, color: Color(0xFFEB4D37)),
            label: const Text(
              'Help',
              style: TextStyle(
                color: Color(0xFFEB4D37),
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
            ),
            onPressed: _showHelpModal,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Success Alert Banner (Green Pill)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: const BoxDecoration(
                        color: Color(0xFF10B981),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check, color: Colors.white, size: 18),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Your ride has been confirmed!',
                            style: TextStyle(
                              fontSize: 14.5,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF065F46),
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Driver is on the way to your pickup point.',
                            style: TextStyle(
                              fontSize: 12,
                              color: Color(0xFF047857),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // 2. Driver & Boat Details Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    // Top: Driver Avatar, Name, Rating & Quick Actions
                    Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(30),
                          child: Image.asset(
                            'assets/images/driver_avatar.jpg',
                            width: 56,
                            height: 56,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(
                              width: 56,
                              height: 56,
                              color: const Color(0xFFFFF1EE),
                              child: const Icon(Icons.person, color: Color(0xFFEB4D37), size: 30),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _driverName,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(height: 3),
                              Row(
                                children: [
                                  const Icon(Icons.star_rounded, size: 16, color: Color(0xFFF59E0B)),
                                  const SizedBox(width: 3),
                                  Text(
                                    _driverRating,
                                    style: const TextStyle(
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF64748B),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),

                        // Action Buttons: Call, Chat, Share
                        _buildRoundActionButton(
                          icon: Icons.call,
                          label: 'Call',
                          onTap: _handleDriverCall,
                        ),
                        const SizedBox(width: 10),
                        _buildRoundActionButton(
                          icon: Icons.chat_bubble_outline,
                          label: 'Chat',
                          onTap: _handleDriverChat,
                        ),
                        const SizedBox(width: 10),
                        _buildRoundActionButton(
                          icon: Icons.send_rounded,
                          label: 'Share',
                          onTap: _handleShareTrip,
                        ),
                      ],
                    ),

                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 14),
                      child: Divider(color: Color(0xFFF1F5F9), height: 1),
                    ),

                    // Boat Details Row 1
                    Row(
                      children: [
                        const Icon(Icons.directions_boat_outlined, size: 20, color: Color(0xFF0F172A)),
                        const SizedBox(width: 10),
                        Text(
                          widget.boatName,
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF0F172A)),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${widget.boatNumber}   |   Zone 1',
                          style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Boat Details Row 2
                    Row(
                      children: [
                        const Icon(Icons.people_outline, size: 20, color: Color(0xFF0F172A)),
                        const SizedBox(width: 10),
                        Text(
                          '${widget.passengers} Passengers',
                          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF0F172A)),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          widget.tripDuration,
                          style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Boat Details Row 3
                    const Row(
                      children: [
                        Icon(Icons.calendar_month_outlined, size: 20, color: Color(0xFF0F172A)),
                        SizedBox(width: 10),
                        Text(
                          'Today, 25 Feb 2026',
                          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF0F172A)),
                        ),
                        SizedBox(width: 8),
                        Text(
                          '02:00 PM - 04:00 PM',
                          style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 3. Horizontal Progress Step Timeline
              _buildProgressTimeline(),

              const SizedBox(height: 20),

              // 4. Live Map & River Tracking Card
              Container(
                height: 240,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(22),
                  child: Stack(
                    children: [
                      // River Map Graphic
                      Positioned.fill(
                        child: Image.asset(
                          'assets/images/river_map.jpg',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: const Color(0xFFE2E8F0),
                            child: const Center(
                              child: Icon(Icons.map, size: 48, color: Color(0xFF94A3B8)),
                            ),
                          ),
                        ),
                      ),

                      // Dotted Route Curve (Simulated)
                      Positioned.fill(
                        child: CustomPaint(
                          painter: RouteCurvePainter(),
                        ),
                      ),

                      // Destination Marker (Red Pin: Dashashwamedh Ghat)
                      Positioned(
                        top: 45,
                        right: 80,
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                              ),
                              child: Text(
                                widget.ghatName,
                                style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Icon(Icons.location_on, color: Color(0xFFEB4D37), size: 28),
                          ],
                        ),
                      ),

                      // Live Moving Boat Driver Pin
                      Positioned(
                        top: 95,
                        right: 60,
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(2),
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)],
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(16),
                                child: Image.asset(
                                  'assets/images/driver_avatar.jpg',
                                  width: 32,
                                  height: 32,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFF0F172A),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                'Driver is 3 mins away',
                                style: TextStyle(fontSize: 9.5, color: Colors.white, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Floating Pickup Point Pill (Bottom Left)
                      Positioned(
                        left: 14,
                        bottom: 14,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.95),
                            borderRadius: BorderRadius.circular(14),
                            boxShadow: [
                              BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 6),
                            ],
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 10,
                                height: 10,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFEB4D37),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Text('Your Pickup Point', style: TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                                  Text(widget.ghatName, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Floating Re-Center Button (Bottom Right)
                      Positioned(
                        right: 14,
                        bottom: 14,
                        child: Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 6),
                            ],
                          ),
                          child: const Icon(Icons.my_location, size: 20, color: Color(0xFF0F172A)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // 5. Estimated Arrival Bar
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.access_time_rounded, color: Color(0xFF0F172A), size: 22),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Estimated Arrival',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Driver is heading to your pickup point',
                            style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                    const Text(
                      '3 mins (1.2 km)',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // 5.5. View Live Ride Screen Button (Sunrise Coral Red)
              ElevatedButton.icon(
                icon: const Icon(Icons.navigation_outlined, size: 20, color: Colors.white),
                label: const Text(
                  'View Live River Ride',
                  style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800, color: Colors.white),
                ),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(52),
                  backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral Red
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => LiveRideScreen(
                        bookingId: widget.bookingId,
                        bookingCode: widget.bookingCode,
                        startGhat: 'Assi Ghat',
                        destinationGhat: widget.ghatName,
                        boatName: widget.boatName,
                        boatNumber: widget.boatNumber,
                        passengers: widget.passengers,
                        tripDuration: widget.tripDuration,
                        startedAtText: '02:05 PM, 25 Feb 2026',
                      ),
                    ),
                  );
                },
              ),

              const SizedBox(height: 12),

              // 6. SOS Emergency Button (Outlined Red)
              OutlinedButton.icon(
                icon: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: const BoxDecoration(
                    color: Color(0xFFEF4444),
                    shape: BoxShape.circle,
                  ),
                  child: const Text('SOS', style: TextStyle(fontSize: 9, color: Colors.white, fontWeight: FontWeight.w900)),
                ),
                label: const Text(
                  'SOS Emergency',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFFEF4444),
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  backgroundColor: const Color(0xFFFEF2F2),
                  side: const BorderSide(color: Color(0xFFFCA5A5), width: 1.5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _triggerEmergencySOS,
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoundActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Container(
            width: 38,
            height: 38,
            decoration: const BoxDecoration(
              color: Color(0xFFEB4D37), // Sunrise Coral Red
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 18),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
        ),
      ],
    );
  }

  Widget _buildProgressTimeline() {
    final steps = [
      'Booking\nConfirmed',
      'Driver\nAssigned',
      'On the\nWay',
      'Ride\nStarted',
      'Completed',
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(steps.length, (idx) {
          final isCompleted = idx <= _currentStepIndex;
          final isCurrent = idx == _currentStepIndex;

          return Expanded(
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 2,
                        color: idx == 0 ? Colors.transparent : (idx <= _currentStepIndex ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0)),
                      ),
                    ),
                    Container(
                      width: 22,
                      height: 22,
                      decoration: BoxDecoration(
                        color: isCompleted ? const Color(0xFFEB4D37) : const Color(0xFFF1F5F9),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isCompleted ? const Color(0xFFEB4D37) : const Color(0xFFCBD5E1),
                          width: 2,
                        ),
                      ),
                      child: isCompleted
                          ? const Icon(Icons.check, size: 14, color: Colors.white)
                          : (isCurrent
                              ? Center(
                                  child: Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFEB4D37),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                )
                              : null),
                    ),
                    Expanded(
                      child: Container(
                        height: 2,
                        color: idx == steps.length - 1 ? Colors.transparent : (idx < _currentStepIndex ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  steps[idx],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: isCompleted ? FontWeight.w800 : FontWeight.w500,
                    color: isCompleted ? const Color(0xFF0F172A) : const Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }
}

class RouteCurvePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFEB4D37).withValues(alpha: 0.8)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(size.width * 0.25, size.height * 0.75);
    path.quadraticBezierTo(
      size.width * 0.45,
      size.height * 0.55,
      size.width * 0.72,
      size.height * 0.32,
    );

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
