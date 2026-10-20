import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../core/constants.dart';
import '../core/theme.dart';
import '../services/driver_api_service.dart';
import '../widgets/request_dialog.dart';
import '../widgets/collect_payment_dialog.dart';
import 'driver_login_screen.dart';

class DutyTab extends StatefulWidget {
  final ValueChanged<int>? onNavigateTab;

  const DutyTab({super.key, this.onNavigateTab});

  @override
  State<DutyTab> createState() => _DutyTabState();
}

class _DutyTabState extends State<DutyTab> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  io.Socket? _socket;
  bool _isDutyOn = true;
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
          _isDutyOn = _driverProfile?['isDutyOn'] ?? true;
          _activeBooking = data['activeBooking'];
          _loading = false;
        });

        _initSocket(_driverProfile?['_id']);
      } else {
        if (mounted) setState(() => _loading = false);
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
    final nextState = !_isDutyOn;
    setState(() => _isDutyOn = nextState);

    try {
      final res = await DriverApiService.toggleDuty();
      if (res['success'] == true && mounted) {
        setState(() {
          _isDutyOn = res['isDutyOn'] ?? nextState;
        });
      }
    } catch (_) {
      // Offline fallback: keep local state
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor:
              _isDutyOn ? const Color(0xFF16A34A) : const Color(0xFF64748B),
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          content: Row(
            children: [
              Icon(
                _isDutyOn
                    ? Icons.check_circle_rounded
                    : Icons.pause_circle_rounded,
                color: Colors.white,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                _isDutyOn
                    ? 'Captain Duty is ONLINE! Ready for rides.'
                    : 'Captain Duty is OFFLINE.',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          duration: const Duration(seconds: 2),
        ),
      );
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
        SnackBar(
          backgroundColor: AppTheme.primary,
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          content: const Row(
            children: [
              Icon(Icons.directions_boat_rounded, color: Colors.white, size: 20),
              SizedBox(width: 8),
              Text('Ride started! Passenger safety insurance active.'),
            ],
          ),
        ),
      );
    }
    _loadDutyState();
  }

  void _openCompletePaymentModal(
      String bookingId, double amount, String bookingCode) {
    showDialog(
      context: context,
      builder: (ctx) => CollectPaymentDialog(
        bookingCode: bookingCode,
        amount: amount,
        onConfirm: (collected) async {
          await DriverApiService.completeRide(bookingId, collected);
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                backgroundColor: const Color(0xFF16A34A),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
                content: const Text(
                    'Trip Completed! Fare recorded in your daily earnings.'),
              ),
            );
          }
          _loadDutyState();
        },
      ),
    );
  }

  void _showMyBoatModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Assigned Boat Details',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.asset(
                  'assets/images/driver_boat_photo_1.jpg',
                  height: 140,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 16),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Boat Name:',
                      style: TextStyle(fontSize: 14, color: Color(0xFF64748B))),
                  Text('Naavi-01',
                      style:
                          TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
                ],
              ),
              const SizedBox(height: 8),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Type & Category:',
                      style: TextStyle(fontSize: 14, color: Color(0xFF64748B))),
                  Text('Motor Boat (Zone 1)',
                      style:
                          TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
                ],
              ),
              const SizedBox(height: 8),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Seating Capacity:',
                      style: TextStyle(fontSize: 14, color: Color(0xFF64748B))),
                  Text('10 Persons',
                      style:
                          TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
                ],
              ),
              const SizedBox(height: 8),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Registration Number:',
                      style: TextStyle(fontSize: 14, color: Color(0xFF64748B))),
                  Text('MP-09-AB-1234',
                      style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.primary)),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }

  void _showSupportModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Naavi Captain Support',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                '24/7 Emergency & Dispatch Helpline',
                style: TextStyle(fontSize: 14, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 20),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Center(
                    child: Icon(Icons.phone_in_talk_rounded,
                        color: Color(0xFF16A34A)),
                  ),
                ),
                title: const Text('Call Dispatch Center',
                    style: TextStyle(fontWeight: FontWeight.w700)),
                subtitle: const Text('+91 1800 200 4455 (Toll Free)'),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Calling Naavi Dispatch Center...')),
                  );
                },
              ),
              const Divider(),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEE2E2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Center(
                    child: Icon(Icons.sos_rounded, color: Color(0xFFEF4444)),
                  ),
                ),
                title: const Text('Waterway SOS Emergency',
                    style: TextStyle(
                        fontWeight: FontWeight.w700, color: Color(0xFFEF4444))),
                subtitle: const Text('Immediate River Police & Coast Rescue'),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      backgroundColor: Colors.redAccent,
                      content: Text('Emergency SOS Signal Sent to River Patrol!'),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showNotificationsDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.notifications_active_rounded,
                color: AppTheme.primary, size: 24),
            SizedBox(width: 8),
            Text('Notifications (1)',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('🎉 Welcome to Naavi Captain Fleet!',
                style: TextStyle(fontWeight: FontWeight.w700)),
            SizedBox(height: 4),
            Text(
              'Your boat registration has been validated. Keep your duty switch ON to receive incoming tourist ride requests.',
              style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close',
                style: TextStyle(
                    fontWeight: FontWeight.w700, color: AppTheme.primary)),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _socket?.disconnect();
    super.dispose();
  }

  Widget _buildQuickActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 74,
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Icon(icon, color: const Color(0xFF2563EB), size: 20),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E293B),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ));

    final String captainName =
        _driverProfile?['name'] ?? 'Rajesh Kumar';
    final String roleTitle =
        _driverProfile?['roleTitle'] ?? 'Boat Operator';
    final double rating =
        (_driverProfile?['rating'] is num) ? _driverProfile!['rating'].toDouble() : 4.8;
    final int ridesCount =
        _driverProfile?['totalRidesCompleted'] ?? 120;
    final int todaysRides =
        _driverProfile?['todaysRides'] ?? 12;
    final int todaysEarnings =
        _driverProfile?['todaysEarnings'] ?? 2450;
    final String acceptance =
        _driverProfile?['acceptanceRate'] ?? '96%';

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: const Color(0xFFF8FAFC),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppTheme.primary, AppTheme.accent],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                        ),
                        child: ClipOval(
                          child: Image.asset(
                            'assets/images/driver_avatar_profile.jpg',
                            fit: BoxFit.cover,
                            errorBuilder: (_, _, _) => const Icon(
                                Icons.person,
                                color: AppTheme.primary),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              captainName,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            Text(
                              'Naavi Captain • DRV-1001',
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.85),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.home_rounded, color: AppTheme.primary),
              title: const Text('Home Dashboard',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.directions_boat_rounded,
                  color: Color(0xFF2563EB)),
              title: const Text('My Boat (Naavi-01)',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              onTap: () {
                Navigator.pop(context);
                _showMyBoatModal();
              },
            ),
            ListTile(
              leading: const Icon(Icons.calendar_month_rounded,
                  color: Color(0xFF0D9488)),
              title: const Text('Bookings & Trips',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              onTap: () {
                Navigator.pop(context);
                widget.onNavigateTab?.call(1);
              },
            ),
            ListTile(
              leading: const Icon(Icons.account_balance_wallet_rounded,
                  color: Color(0xFF16A34A)),
              title: const Text('Earnings',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              onTap: () {
                Navigator.pop(context);
                widget.onNavigateTab?.call(2);
              },
            ),
            ListTile(
              leading: const Icon(Icons.headset_mic_rounded,
                  color: Color(0xFFD97706)),
              title: const Text('24/7 Support',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              onTap: () {
                Navigator.pop(context);
                _showSupportModal();
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout_rounded, color: Colors.redAccent),
              title: const Text('Logout',
                  style: TextStyle(
                      fontWeight: FontWeight.w700, color: Colors.redAccent)),
              onTap: () {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) => const DriverLoginScreen()),
                  (route) => false,
                );
              },
            ),
          ],
        ),
      ),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8FAFC),
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.menu_rounded,
              color: Color(0xFF0F172A), size: 26),
          onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        ),
        // Naavi Logo in circle + Naavi brand text (Matching User Request)
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                  BoxShadow(
                    color: AppTheme.primary.withValues(alpha: 0.15),
                    blurRadius: 6,
                  ),
                ],
              ),
              child: ClipOval(
                child: Image.asset(
                  'assets/images/naavi_logo_square.png',
                  fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => const Icon(
                    Icons.directions_boat_rounded,
                    color: AppTheme.primary,
                    size: 20,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'Naavi',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.notifications_none_rounded,
                      color: Color(0xFF0F172A), size: 26),
                  onPressed: _showNotificationsDialog,
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: Container(
                    width: 14,
                    height: 14,
                    decoration: const BoxDecoration(
                      color: Color(0xFFEF4444),
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        '1',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: _loading
          ? const Center(
              child: CircularProgressIndicator(color: AppTheme.primary))
          : RefreshIndicator(
              color: AppTheme.primary,
              onRefresh: () async => _loadDutyState(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(
                    parent: BouncingScrollPhysics()),
                padding: const EdgeInsets.fromLTRB(20, 4, 20, 24),
                child: Column(
                  children: [
                    // 1. Online / Offline Duty Switch Pill (Matching Screenshot)
                    Center(
                      child: GestureDetector(
                        onTap: _toggleDuty,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          padding: const EdgeInsets.fromLTRB(16, 6, 6, 6),
                          decoration: BoxDecoration(
                            color: _isDutyOn
                                ? const Color(0xFFDCFCE7)
                                : const Color(0xFFE2E8F0),
                            borderRadius: BorderRadius.circular(30),
                            border: Border.all(
                              color: _isDutyOn
                                  ? const Color(0xFF86EFAC)
                                  : const Color(0xFFCBD5E1),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                _isDutyOn ? 'Online' : 'Offline',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: _isDutyOn
                                      ? const Color(0xFF15803D)
                                      : const Color(0xFF64748B),
                                ),
                              ),
                              const SizedBox(width: 8),
                              AnimatedContainer(
                                duration: const Duration(milliseconds: 250),
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: _isDutyOn
                                      ? const Color(0xFF16A34A)
                                      : const Color(0xFF94A3B8),
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withValues(alpha: 0.1),
                                      blurRadius: 4,
                                      offset: const Offset(0, 1),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: Icon(
                                    _isDutyOn
                                        ? Icons.check_rounded
                                        : Icons.close_rounded,
                                    size: 18,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    // 2. Captain Profile Section (Circular Avatar + Green Status Dot + Name + Role + Rating)
                    Center(
                      child: Column(
                        children: [
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              Container(
                                width: 88,
                                height: 88,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: Colors.white,
                                    width: 3.5,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color:
                                          Colors.black.withValues(alpha: 0.08),
                                      blurRadius: 12,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: ClipOval(
                                  child: Image.asset(
                                    'assets/images/driver_avatar_profile.jpg',
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, _, _) =>
                                        const Center(
                                      child: Icon(Icons.person,
                                          size: 44, color: AppTheme.primary),
                                    ),
                                  ),
                                ),
                              ),
                              // Online Status Indicator Dot
                              Positioned(
                                bottom: 2,
                                right: 2,
                                child: Container(
                                  width: 18,
                                  height: 18,
                                  decoration: BoxDecoration(
                                    color: _isDutyOn
                                        ? const Color(0xFF22C55E)
                                        : const Color(0xFF94A3B8),
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                        color: Colors.white, width: 2.5),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            captainName,
                            style: const TextStyle(
                              fontSize: 21,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            roleTitle,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF64748B),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.star_rounded,
                                size: 19,
                                color: Color(0xFFF59E0B),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '$rating ($ridesCount rides)',
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF334155),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // 3. Today's Key Performance Stats Card (3 Columns: Rides, Earnings, Acceptance)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: const Color(0xFFE2E8F0), width: 1.2),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          // Column 1: Today's Rides
                          Expanded(
                            child: Column(
                              children: [
                                Text(
                                  '$todaysRides',
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  "Today's Rides",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            width: 1,
                            height: 38,
                            color: const Color(0xFFE2E8F0),
                          ),
                          // Column 2: Today's Earnings
                          Expanded(
                            child: Column(
                              children: [
                                Text(
                                  '₹$todaysEarnings',
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  "Today's Earnings",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            width: 1,
                            height: 38,
                            color: const Color(0xFFE2E8F0),
                          ),
                          // Column 3: Acceptance
                          Expanded(
                            child: Column(
                              children: [
                                Text(
                                  acceptance,
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  'Acceptance',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 18),

                    // 4. Quick Action Grid (My Boat, Earnings, Bookings, Support)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildQuickActionButton(
                          icon: Icons.directions_boat_rounded,
                          label: 'My Boat',
                          onTap: _showMyBoatModal,
                        ),
                        _buildQuickActionButton(
                          icon: Icons.account_balance_wallet_rounded,
                          label: 'Earnings',
                          onTap: () => widget.onNavigateTab?.call(2),
                        ),
                        _buildQuickActionButton(
                          icon: Icons.calendar_month_rounded,
                          label: 'Bookings',
                          onTap: () => widget.onNavigateTab?.call(1),
                        ),
                        _buildQuickActionButton(
                          icon: Icons.headset_mic_rounded,
                          label: 'Support',
                          onTap: _showSupportModal,
                        ),
                      ],
                    ),

                    const SizedBox(height: 22),

                    // 5. Upcoming Booking Section (Matching Screenshot)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Upcoming Booking',
                          style: TextStyle(
                            fontSize: 17.5,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                            letterSpacing: -0.3,
                          ),
                        ),
                        GestureDetector(
                          onTap: () => widget.onNavigateTab?.call(1),
                          child: const Text(
                            'View All',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primary,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Upcoming Booking Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(
                            color: const Color(0xFFE2E8F0), width: 1.2),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header: Time + Upcoming Pill
                          Row(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Center(
                                  child: Icon(
                                    Icons.directions_boat_filled_rounded,
                                    size: 18,
                                    color: Color(0xFF475569),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              const Text(
                                'Today, 11:30 AM',
                                style: TextStyle(
                                  fontSize: 14.5,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF1E293B),
                                ),
                              ),
                              const Spacer(),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFDCFCE7),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  'Upcoming',
                                  style: TextStyle(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF16A34A),
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 14),

                          // Route: Blue Dot (Vijay Nagar Jetty) -> Red Pin (Lake View Point)
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Column(
                                children: [
                                  Container(
                                    width: 10,
                                    height: 10,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFF2563EB),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  Container(
                                    width: 2,
                                    height: 24,
                                    color: const Color(0xFFCBD5E1),
                                  ),
                                  const Icon(
                                    Icons.location_on_rounded,
                                    size: 16,
                                    color: Color(0xFFEF4444),
                                  ),
                                ],
                              ),
                              const SizedBox(width: 12),
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Vijay Nagar Jetty',
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w800,
                                        color: Color(0xFF0F172A),
                                      ),
                                    ),
                                    SizedBox(height: 16),
                                    Text(
                                      'Lake View Point',
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w800,
                                        color: Color(0xFF0F172A),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 14),

                          const Divider(height: 1, color: Color(0xFFF1F5F9)),

                          const SizedBox(height: 10),

                          // Subtext: 4 Passengers • 1.2 km away
                          const Row(
                            children: [
                              Icon(Icons.access_time_rounded,
                                  size: 16, color: Color(0xFF94A3B8)),
                              SizedBox(width: 6),
                              Text(
                                '4 Passengers • 1.2 km away',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // Active Ride Card (if currently dispatching or running)
                    if (_activeBooking != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF7ED),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                              color: const Color(0xFFFDBA74), width: 1.2),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.navigation_rounded,
                                    color: Color(0xFFEA580C), size: 20),
                                const SizedBox(width: 8),
                                const Text(
                                  'CURRENT ACTIVE RIDE',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 13,
                                    color: Color(0xFFEA580C),
                                  ),
                                ),
                                const Spacer(),
                                Text(
                                  'OTP: ${_activeBooking?['startOtp'] ?? "1234"}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w900,
                                    fontSize: 14,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () => _startRide(
                                        _activeBooking?['_id'] ?? ''),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppTheme.primary,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(10)),
                                    ),
                                    child: const Text('Start Ride'),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () => _openCompletePaymentModal(
                                      _activeBooking?['_id'] ?? '',
                                      (_activeBooking?['finalPayableAmount'] ??
                                              950)
                                          .toDouble(),
                                      _activeBooking?['bookingCode'] ??
                                          'NV-9821',
                                    ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor:
                                          const Color(0xFF16A34A),
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(10)),
                                    ),
                                    child: const Text('Complete Trip'),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
    );
  }
}
