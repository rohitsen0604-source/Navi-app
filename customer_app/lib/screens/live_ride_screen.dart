import 'dart:async';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as socket_io;
import '../core/constants.dart';
import '../services/api_service.dart';
import 'ride_completed_screen.dart';
import 'share_ride_screen.dart';
import 'sos_emergency_screen.dart';


class LiveRideScreen extends StatefulWidget {
  final String bookingId;
  final String bookingCode;
  final String startGhat;
  final String destinationGhat;
  final String boatName;
  final String boatNumber;
  final int passengers;
  final String tripDuration;
  final String startedAtText;

  const LiveRideScreen({
    super.key,
    required this.bookingId,
    this.bookingCode = 'NV-9912',
    this.startGhat = 'Assi Ghat',
    this.destinationGhat = 'Dashashwamedh Ghat',
    this.boatName = 'Motor Boat',
    this.boatNumber = 'UPB-1024',
    this.passengers = 2,
    this.tripDuration = 'Full Trip (2 hrs)',
    this.startedAtText = '02:05 PM, 25 Feb 2026',
  });

  @override
  State<LiveRideScreen> createState() => _LiveRideScreenState();
}

class _LiveRideScreenState extends State<LiveRideScreen> with SingleTickerProviderStateMixin {
  socket_io.Socket? _socket;
  Timer? _telemetryTimer;

  double _distanceCoveredKm = 1.2;
  int _timeElapsedMinutes = 28;
  int _timeRemainingMinutes = 92; // 1 hr 32 min

  late AnimationController _boatPulseController;

  @override
  void initState() {
    super.initState();
    _boatPulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _initSocket();
    _fetchTelemetry();

    // Auto-update live telemetry every 10 seconds for real-time live feel
    _telemetryTimer = Timer.periodic(const Duration(seconds: 10), (timer) {
      if (mounted) {
        setState(() {
          _distanceCoveredKm = double.parse((_distanceCoveredKm + 0.05).toStringAsFixed(2));
          _timeElapsedMinutes += 1;
          if (_timeRemainingMinutes > 1) {
            _timeRemainingMinutes -= 1;
          }
        });
      }
    });
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

      _socket?.on('TELEMETRY_UPDATE', (data) {
        if (data != null && mounted) {
          setState(() {
            _distanceCoveredKm = (data['distanceCoveredKm'] as num?)?.toDouble() ?? _distanceCoveredKm;
            _timeElapsedMinutes = data['timeElapsedMinutes'] ?? _timeElapsedMinutes;
            _timeRemainingMinutes = data['timeRemainingMinutes'] ?? _timeRemainingMinutes;
          });
        }
      });

      _socket?.on('RIDE_COMPLETED', (_) {
        if (mounted) _handleCompleteRide();
      });
    } catch (e) {
      debugPrint('Socket telemetry error: $e');
    }
  }

  void _handleCompleteRide() async {
    try {
      await ApiService.completeTrip(widget.bookingId);
    } catch (_) {}

    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => RideCompletedScreen(
            bookingId: widget.bookingId,
            bookingCode: widget.bookingCode,
            boatName: widget.boatName,
            boatNumber: widget.boatNumber,
            ghatName: widget.destinationGhat,
            zoneNumber: 1,
            passengers: widget.passengers,
            tripDuration: widget.tripDuration,
            tripTimeText: 'Today, 25 Feb 2026  |  02:00 PM - 04:00 PM',
            baseFare: 1200,
            platformFee: 50,
            couponDiscount: 100,
            totalPaid: 1150,
          ),
        ),
      );
    }
  }

  void _fetchTelemetry() async {
    try {
      final res = await ApiService.getLiveTelemetry(widget.bookingId);
      if (res['success'] == true && res['data'] != null && mounted) {
        final d = res['data'];
        setState(() {
          _distanceCoveredKm = (d['distanceCoveredKm'] as num?)?.toDouble() ?? _distanceCoveredKm;
          _timeElapsedMinutes = d['timeElapsedMinutes'] ?? _timeElapsedMinutes;
          _timeRemainingMinutes = d['timeRemainingMinutes'] ?? _timeRemainingMinutes;
        });
      }
    } catch (_) {}
  }

  String _formatRemainingTime(int minutes) {
    if (minutes < 60) return '$minutes min';
    final hrs = minutes ~/ 60;
    final mins = minutes % 60;
    return '$hrs hr $mins min';
  }

  void _handleCallDriver() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Connecting live voice call to Driver Ramesh Yadav (+91 98765 43220)...'),
        backgroundColor: Color(0xFF0F172A),
      ),
    );
  }

  void _handleChatDriver() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening live in-trip river chat with boat driver...'),
        backgroundColor: Color(0xFF0F172A),
      ),
    );
  }

  void _handleShareRide() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ShareRideScreen(
          bookingId: widget.bookingId,
          bookingCode: widget.bookingCode,
          boatName: widget.boatName,
          boatNumber: widget.boatNumber,
          zoneGhatText: 'Zone 1 - ${widget.destinationGhat}',
          passengers: widget.passengers,
          durationText: widget.tripDuration,
          dateTimeText: widget.startedAtText,
          driverName: 'Ramesh Yadav',
          driverPhone: '+91 98765 43220',
        ),
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
          initialGhat: widget.destinationGhat,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _telemetryTimer?.cancel();
    _boatPulseController.dispose();
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
          'Ride Started',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontSize: 18,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),
        centerTitle: true,
        actions: [
          // Live Pill Badge (Orange / Sunrise Coral)
          Container(
            margin: const EdgeInsets.only(right: 16, top: 12, bottom: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFFF7A00),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 5),
                const Text(
                  'Live',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Success Alert Banner (Green)
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
                            'Your ride has started!',
                            style: TextStyle(
                              fontSize: 14.5,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF065F46),
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Enjoy a safe and pleasant journey.',
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

              // 2. Boat & Trip Info Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Boat Image
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.asset(
                        'assets/images/live_boat_cruise.jpg',
                        width: 92,
                        height: 92,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          width: 92,
                          height: 92,
                          color: const Color(0xFFFFF1EE),
                          child: const Icon(Icons.directions_boat, color: Color(0xFFEB4D37), size: 36),
                        ),
                      ),
                    ),

                    const SizedBox(width: 14),

                    // Boat Details
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.boatName,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '${widget.boatNumber}   |   Zone 1',
                            style: const TextStyle(
                              fontSize: 12.5,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              const Icon(Icons.people_outline, size: 14, color: Color(0xFF64748B)),
                              const SizedBox(width: 4),
                              Text(
                                '${widget.passengers} Passengers',
                                style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Row(
                            children: [
                              const Icon(Icons.timer_outlined, size: 14, color: Color(0xFF64748B)),
                              const SizedBox(width: 4),
                              Text(
                                widget.tripDuration,
                                style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Row(
                            children: [
                              const Icon(Icons.schedule, size: 13, color: Color(0xFF64748B)),
                              const SizedBox(width: 4),
                              Text(
                                'Started at ${widget.startedAtText}',
                                style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // 3. Live Trip Metrics Row (3 Columns)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    // Column 1: Distance Covered
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            '$_distanceCoveredKm km',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFEB4D37), // Sunrise Coral Red
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'Distance Covered',
                            style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),

                    Container(width: 1, height: 32, color: const Color(0xFFE2E8F0)),

                    // Column 2: Time Elapsed
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            '$_timeElapsedMinutes min',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFEB4D37), // Sunrise Coral Red
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'Time Elapsed',
                            style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),

                    Container(width: 1, height: 32, color: const Color(0xFFE2E8F0)),

                    // Column 3: Time Remaining
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            _formatRemainingTime(_timeRemainingMinutes),
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFEB4D37), // Sunrise Coral Red
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'Time Remaining',
                            style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // 4. Live River GPS Map Card
              Container(
                height: 250,
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
                      // River Map Background Graphic
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

                      // Dotted Live River Trajectory
                      Positioned.fill(
                        child: CustomPaint(
                          painter: LiveRiverTrajectoryPainter(),
                        ),
                      ),

                      // Start Point Marker (Bottom-Left: Assi Ghat)
                      Positioned(
                        bottom: 40,
                        left: 20,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFF10B981),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 5),
                                  Text(
                                    widget.startGhat,
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Destination Marker (Top-Right: Dashashwamedh Ghat)
                      Positioned(
                        top: 25,
                        right: 30,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                              ),
                              child: Text(
                                widget.destinationGhat,
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Icon(Icons.location_on, color: Color(0xFFEB4D37), size: 30),
                          ],
                        ),
                      ),

                      // Live Sailing Boat with Glowing Ripple Circle
                      Positioned(
                        top: 100,
                        right: 110,
                        child: AnimatedBuilder(
                          animation: _boatPulseController,
                          builder: (context, child) {
                            return Stack(
                              alignment: Alignment.center,
                              children: [
                                // Pulse Ripple
                                Container(
                                  width: 44 + (_boatPulseController.value * 12),
                                  height: 44 + (_boatPulseController.value * 12),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: const Color(0xFFEB4D37).withValues(alpha: 0.25 * (1 - _boatPulseController.value)),
                                  ),
                                ),
                                // Boat Marker Circle
                                Container(
                                  width: 38,
                                  height: 38,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFFEB4D37),
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(color: Colors.black26, blurRadius: 6),
                                    ],
                                  ),
                                  child: const Icon(Icons.directions_boat, color: Colors.white, size: 22),
                                ),
                              ],
                            );
                          },
                        ),
                      ),

                      // Floating GPS Re-Center Button
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

              const SizedBox(height: 20),

              // 5. Bottom 4-Button Grid: Call Driver, Chat, Share Ride, SOS
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildBottomActionButton(
                    icon: Icons.call,
                    label: 'Call Driver',
                    onTap: _handleCallDriver,
                  ),
                  _buildBottomActionButton(
                    icon: Icons.chat_bubble_outline,
                    label: 'Chat',
                    onTap: _handleChatDriver,
                  ),
                  _buildBottomActionButton(
                    icon: Icons.send_rounded,
                    label: 'Share Ride',
                    onTap: _handleShareRide,
                  ),
                  _buildBottomSosButton(),
                ],
              ),

              const SizedBox(height: 16),

              // 6. Complete Ride Action (Transitions to Screen 11)
              ElevatedButton.icon(
                icon: const Icon(Icons.check_circle_outline, size: 20, color: Colors.white),
                label: const Text(
                  'End & Complete Ride',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.2,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(52),
                  backgroundColor: const Color(0xFFEB4D37),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: _handleCompleteRide,
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(22),
          child: Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1EE), // Soft Coral background
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFFFD5CE)),
            ),
            child: Icon(icon, color: const Color(0xFFEB4D37), size: 22),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
        ),
      ],
    );
  }

  Widget _buildBottomSosButton() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          onTap: _triggerEmergencySOS,
          borderRadius: BorderRadius.circular(22),
          child: Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFFCA5A5)),
            ),
            child: const Center(
              child: Text(
                'SOS',
                style: TextStyle(
                  color: Color(0xFFDC2626),
                  fontWeight: FontWeight.w900,
                  fontSize: 14,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'SOS',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFFDC2626)),
        ),
      ],
    );
  }
}

class LiveRiverTrajectoryPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFEB4D37).withValues(alpha: 0.85)
      ..strokeWidth = 2.8
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(size.width * 0.18, size.height * 0.82);
    path.quadraticBezierTo(
      size.width * 0.40,
      size.height * 0.65,
      size.width * 0.76,
      size.height * 0.22,
    );

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
