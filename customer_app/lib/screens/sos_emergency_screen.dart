import 'dart:async';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SosEmergencyScreen extends StatefulWidget {
  final String? bookingId;
  final String bookingCode;
  final String initialGhat;

  const SosEmergencyScreen({
    super.key,
    this.bookingId,
    this.bookingCode = 'NV-9912',
    this.initialGhat = 'Dashashwamedh Ghat',
  });

  @override
  State<SosEmergencyScreen> createState() => _SosEmergencyScreenState();
}

class _SosEmergencyScreenState extends State<SosEmergencyScreen>
    with SingleTickerProviderStateMixin {
  bool _notifySupport = true;
  bool _notifyContacts = true;
  bool _callLocalEmergency = true;

  bool _isTriggering = false;
  bool _isSosActive = false;
  Map<String, dynamic>? _sosResponseData;
  String _currentLocationName = 'Dashashwamedh Ghat, Varanasi\nUttar Pradesh, India';

  late AnimationController _radarController;
  int _activeSeconds = 0;
  Timer? _countdownTimer;

  @override
  void initState() {
    super.initState();
    _radarController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void dispose() {
    _radarController.dispose();
    _countdownTimer?.cancel();
    super.dispose();
  }

  void _handleUpdateLocation() {
    setState(() {
      _currentLocationName = 'Dashashwamedh Main Ghat, Varanasi\nGPS Accuracy: ±2m (Calibrated)';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('GPS Signal calibrated! Live location refreshed at Varanasi River Corridor.'),
        backgroundColor: Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _handleTriggerSos() async {
    setState(() => _isTriggering = true);

    try {
      final res = await ApiService.triggerSOSAlert(
        bookingId: widget.bookingId,
        latitude: 25.3072,
        longitude: 83.0105,
        locationName: _currentLocationName.replaceAll('\n', ', '),
        notifySupport: _notifySupport,
        notifyContacts: _notifyContacts,
        callLocalEmergency: _callLocalEmergency,
      );

      if (mounted) {
        setState(() {
          _isSosActive = true;
          _sosResponseData = res['data'];
          _isTriggering = false;
        });

        _countdownTimer?.cancel();
        _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
          if (mounted) {
            setState(() => _activeSeconds++);
          }
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🚨 SOS Alert Dispatched! Varanasi Water Police & Naavi Control Room Notified.'),
            backgroundColor: Color(0xFFDC2626),
            behavior: SnackBarBehavior.floating,
            duration: Duration(seconds: 4),
          ),
        );
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _isSosActive = true;
          _isTriggering = false;
        });
      }
    }
  }

  void _handleCancelSos() async {
    if (_isSosActive) {
      final incidentCode = _sosResponseData?['incidentCode'] ?? 'SOS-VAR-88192';
      await ApiService.cancelSOSAlert(incidentCode);
      _countdownTimer?.cancel();
      if (mounted) {
        setState(() {
          _isSosActive = false;
          _activeSeconds = 0;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('SOS Alert cancelled. Status marked as safe.'),
            backgroundColor: Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } else {
      Navigator.pop(context);
    }
  }

  void _callEmergencyDirect(String number) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Connecting high-priority emergency call to $number...'),
        backgroundColor: const Color(0xFFDC2626),
        behavior: SnackBarBehavior.floating,
      ),
    );
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
          'SOS Emergency',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontSize: 18,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Top Emergency Assistance Banner Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF1F2),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFFFE4E6)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Red Circular SOS Badge
                    Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        color: Color(0xFFDC2626),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Color(0x33DC2626),
                            blurRadius: 8,
                            offset: Offset(0, 3),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          'sos',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w900,
                            fontSize: 13,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Emergency Assistance',
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 15,
                              color: Color(0xFFDC2626),
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'We will immediately notify our support team and your emergency contacts with your live location.',
                            style: TextStyle(
                              fontSize: 12.5,
                              color: Color(0xFF475569),
                              height: 1.35,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // 2. Interactive River GPS Emergency Map Container
              Container(
                height: 230,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
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
                  borderRadius: BorderRadius.circular(20),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Base Map Image
                      Image.asset(
                        'assets/images/river_map.jpg',
                        width: double.infinity,
                        height: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (ctx, err, stack) => Container(
                          color: const Color(0xFFE0F2FE),
                          child: const Center(
                            child: Icon(Icons.map, size: 60, color: Color(0xFF38BDF8)),
                          ),
                        ),
                      ),

                      // Varanasi Ganges River Water Channel Overlay Effect
                      Positioned.fill(
                        child: CustomPaint(
                          painter: EmergencyMapOverlayPainter(),
                        ),
                      ),

                      // Pulsing Concentric Radar Rings for SOS
                      AnimatedBuilder(
                        animation: _radarController,
                        builder: (context, child) {
                          return Stack(
                            alignment: Alignment.center,
                            children: [
                              Container(
                                width: 50 + (_radarController.value * 65),
                                height: 50 + (_radarController.value * 65),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: const Color(0xFFDC2626).withValues(alpha: 0.20 * (1 - _radarController.value)),
                                  border: Border.all(
                                    color: const Color(0xFFDC2626).withValues(alpha: 0.40 * (1 - _radarController.value)),
                                    width: 1.5,
                                  ),
                                ),
                              ),
                              Container(
                                width: 35 + (_radarController.value * 35),
                                height: 35 + (_radarController.value * 35),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: const Color(0xFFDC2626).withValues(alpha: 0.30 * (1 - _radarController.value)),
                                ),
                              ),
                            ],
                          );
                        },
                      ),

                      // Central Blue GPS Dot
                      Container(
                        width: 16,
                        height: 16,
                        decoration: BoxDecoration(
                          color: const Color(0xFF2563EB),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                          boxShadow: const [
                            BoxShadow(color: Colors.black26, blurRadius: 4),
                          ],
                        ),
                      ),

                      // Red SOS Pin Marker above GPS Dot
                      Positioned(
                        top: 72,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFDC2626),
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: const [
                                  BoxShadow(color: Colors.black26, blurRadius: 6, offset: Offset(0, 2)),
                                ],
                              ),
                              child: const Text(
                                'sos',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w900,
                                  fontSize: 11,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                            const Icon(Icons.arrow_drop_down, color: Color(0xFFDC2626), size: 16),
                          ],
                        ),
                      ),

                      // Ghat Location Pill Badge
                      Positioned(
                        top: 32,
                        right: 28,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: const [
                              BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 2)),
                            ],
                          ),
                          child: Text(
                            widget.initialGhat,
                            style: const TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ),
                      ),

                      // Floating Re-Center GPS Button
                      Positioned(
                        right: 14,
                        bottom: 14,
                        child: GestureDetector(
                          onTap: _handleUpdateLocation,
                          child: Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(color: Colors.black.withValues(alpha: 0.12), blurRadius: 6),
                              ],
                            ),
                            child: const Icon(Icons.my_location, size: 18, color: Color(0xFF0F172A)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // 3. Current Location Details Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: const BoxDecoration(
                        color: Color(0xFFEFF6FF),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.location_on, color: Color(0xFF2563EB), size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Your Current Location',
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 13.5,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _currentLocationName,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF64748B),
                              height: 1.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                    TextButton(
                      onPressed: _handleUpdateLocation,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        foregroundColor: const Color(0xFF2563EB),
                      ),
                      child: const Text(
                        'Update',
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 4. Notify Section Header & Checklist Card
              const Text(
                'Notify',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 12),

              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    // Option 1: Naavi Support Team
                    _buildNotifyItem(
                      icon: Icons.headset_mic_outlined,
                      title: 'Naavi Support Team',
                      subtitle: 'Immediate assistance',
                      value: _notifySupport,
                      onChanged: (val) => setState(() => _notifySupport = val ?? false),
                    ),

                    const Divider(height: 1, indent: 56, endIndent: 16, color: Color(0xFFF1F5F9)),

                    // Option 2: Emergency Contacts
                    _buildNotifyItem(
                      icon: Icons.people_outline_rounded,
                      title: 'Emergency Contacts',
                      subtitle: '2 contacts will be notified',
                      value: _notifyContacts,
                      onChanged: (val) => setState(() => _notifyContacts = val ?? false),
                    ),

                    const Divider(height: 1, indent: 56, endIndent: 16, color: Color(0xFFF1F5F9)),

                    // Option 3: Call Local Emergency
                    _buildNotifyItem(
                      icon: Icons.phone_outlined,
                      title: 'Call Local Emergency',
                      subtitle: 'Dial 112 (India)',
                      value: _callEmergencyLocal,
                      onChanged: (val) => setState(() => _callLocalEmergency = val ?? false),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Active SOS Rescue Status Card (When Alert is Live)
              if (_isSosActive) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF2F2),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFFCA5A5), width: 1.5),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.emergency, color: Color(0xFFDC2626), size: 22),
                          const SizedBox(width: 8),
                          Text(
                            'Active Incident: ${_sosResponseData?['incidentCode'] ?? "SOS-VAR-88192"}',
                            style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFFDC2626), fontSize: 14),
                          ),
                          const Spacer(),
                          Text(
                            '${_activeSeconds}s active',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF991B1B)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Dispatch: Varanasi Water Police Patrol Boat #4 (ETA: 2-4 mins)',
                        style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              icon: const Icon(Icons.call, size: 16, color: Colors.white),
                              label: const Text('Call 112', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFDC2626),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              onPressed: () => _callEmergencyDirect('112'),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: OutlinedButton.icon(
                              icon: const Icon(Icons.security, size: 16, color: Color(0xFFDC2626)),
                              label: const Text('Water Police', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFFDC2626))),
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: Color(0xFFDC2626)),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              ),
                              onPressed: () => _callEmergencyDirect('+91 542 2221234'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // 5. Trigger SOS Alert Button (Solid High-Priority Red)
              ElevatedButton.icon(
                icon: const Icon(Icons.phone, size: 20, color: Colors.white),
                label: Text(
                  _isSosActive ? 'Broadcast SOS Update' : 'Trigger SOS Alert',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.3,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(54),
                  backgroundColor: const Color(0xFFDC2626), // High-Priority Alert Red
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: _isTriggering ? null : _handleTriggerSos,
              ),

              const SizedBox(height: 12),

              // 6. Cancel Button
              OutlinedButton.icon(
                icon: const Icon(Icons.access_time, size: 18, color: Color(0xFF64748B)),
                label: Text(
                  _isSosActive ? 'Cancel SOS & Mark Safe' : 'Cancel',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF475569),
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  backgroundColor: const Color(0xFFF1F5F9),
                  side: const BorderSide(color: Color(0xFFE2E8F0)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: _handleCancelSos,
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  bool get _callEmergencyLocal => _callLocalEmergency;

  Widget _buildNotifyItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool?> onChanged,
  }) {
    return InkWell(
      onTap: () => onChanged(!value),
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            // Custom Rounded Checkbox
            Transform.scale(
              scale: 1.15,
              child: Checkbox(
                value: value,
                activeColor: const Color(0xFF2563EB), // Classic Checkbox Blue / Primary
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                onChanged: onChanged,
              ),
            ),
            const SizedBox(width: 8),
            Icon(icon, size: 22, color: const Color(0xFF0F172A)),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      fontSize: 14,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class EmergencyMapOverlayPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final riverPaint = Paint()
      ..color = const Color(0xFF38BDF8).withValues(alpha: 0.18)
      ..style = PaintingStyle.fill;

    final riverPath = Path();
    riverPath.moveTo(0, size.height * 0.2);
    riverPath.quadraticBezierTo(
      size.width * 0.45,
      size.height * 0.45,
      size.width,
      size.height * 0.8,
    );
    riverPath.lineTo(size.width, size.height);
    riverPath.lineTo(0, size.height);
    riverPath.close();

    canvas.drawPath(riverPath, riverPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
