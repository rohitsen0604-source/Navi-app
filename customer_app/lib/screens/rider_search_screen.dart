import 'dart:async';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'active_ride_screen.dart';
import 'booking_confirmed_dialog.dart';

class RiderSearchScreen extends StatefulWidget {
  final int zoneNumber;
  final String ghatName;
  final String? ghatId;
  final int passengers;
  final String tripType;
  final String boatCategory;
  final int totalFare;

  const RiderSearchScreen({
    super.key,
    required this.zoneNumber,
    required this.ghatName,
    this.ghatId,
    required this.passengers,
    required this.tripType,
    required this.boatCategory,
    required this.totalFare,
  });

  @override
  State<RiderSearchScreen> createState() => _RiderSearchScreenState();
}

class _RiderSearchScreenState extends State<RiderSearchScreen> with TickerProviderStateMixin {
  // Phase 1: Searching for rider
  bool _isSearching = true;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  // Phase 2: Rider accepted
  Map<String, dynamic>? _riderData;

  // 45-second timer
  int _secondsLeft = 45;
  Timer? _countdownTimer;
  bool _isCancelled = false;
  bool _isPaying = false;

  // 20% Advance Calculation
  int get _advanceAmount => (widget.totalFare * 0.20).round();
  int get _remainingAmount => widget.totalFare - _advanceAmount;
  String _rideOtp = '5821';

  @override
  void initState() {
    super.initState();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.9, end: 1.25).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _generateRandomOtp();
    _startRiderSearch();
  }

  void _generateRandomOtp() {
    final now = DateTime.now().millisecondsSinceEpoch;
    final code = (1000 + (now % 8999)).toString();
    setState(() => _rideOtp = code);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _countdownTimer?.cancel();
    super.dispose();
  }

  void _startRiderSearch() {
    // Simulate rider matching in 3.5 seconds
    Timer(const Duration(milliseconds: 3500), () {
      if (mounted && !_isCancelled) {
        setState(() {
          _isSearching = false;
          _riderData = {
            'name': 'Ramesh Manjhi',
            'phone': '+91 98765 43220',
            'rating': '4.9',
            'tripsCount': '340+',
            'boatName': 'Ganga Vihar Motor Boat',
            'boatNumber': 'UPB-1024',
            'eta': '3 mins away',
            'distance': '450 meters away',
          };
        });

        _start45SecondCountdown();
      }
    });
  }

  void _start45SecondCountdown() {
    _countdownTimer?.cancel();
    setState(() => _secondsLeft = 45);

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_secondsLeft > 1) {
        setState(() => _secondsLeft--);
      } else {
        timer.cancel();
        setState(() {
          _secondsLeft = 0;
          _isCancelled = true;
        });
      }
    });
  }

  void _showPaymentModal() {
    String selectedMethod = 'UPI_GPAY';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: SafeArea(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Handle Bar
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Title
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Pay 20% Advance',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Lock boat & driver immediately',
                              style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF1EE),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFFFD5CE)),
                          ),
                          child: Text(
                            '₹$_advanceAmount',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFEB4D37),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Payment Options
                    _buildPaymentTile(
                      icon: Icons.account_balance_wallet_outlined,
                      title: 'Google Pay / PhonePe / Paytm (UPI)',
                      subtitle: 'Fast 1-click verified checkout',
                      methodId: 'UPI_GPAY',
                      selectedId: selectedMethod,
                      onTap: () => setModalState(() => selectedMethod = 'UPI_GPAY'),
                    ),
                    const SizedBox(height: 10),

                    _buildPaymentTile(
                      icon: Icons.credit_card_outlined,
                      title: 'Credit / Debit Card',
                      subtitle: 'Visa, MasterCard, RuPay',
                      methodId: 'CARD',
                      selectedId: selectedMethod,
                      onTap: () => setModalState(() => selectedMethod = 'CARD'),
                    ),
                    const SizedBox(height: 10),

                    _buildPaymentTile(
                      icon: Icons.account_balance_outlined,
                      title: 'Net Banking / Naavi Wallet',
                      subtitle: 'All major Indian banks supported',
                      methodId: 'WALLET',
                      selectedId: selectedMethod,
                      onTap: () => setModalState(() => selectedMethod = 'WALLET'),
                    ),

                    const SizedBox(height: 22),

                    // Confirm CTA
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEB4D37),
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(52),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                      onPressed: () {
                        Navigator.pop(ctx);
                        _processAdvancePayment();
                      },
                      child: Text(
                        'Pay ₹$_advanceAmount & Confirm Ride',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildPaymentTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required String methodId,
    required String selectedId,
    required VoidCallback onTap,
  }) {
    final isSelected = methodId == selectedId;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFFFF1EE) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
            width: isSelected ? 1.8 : 1.0,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFF64748B)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w700,
                      color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle : Icons.radio_button_unchecked,
              color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFFCBD5E1),
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  void _processAdvancePayment() async {
    _countdownTimer?.cancel();
    setState(() => _isPaying = true);

    try {
      final res = await ApiService.createBooking({
        'riverLakeId': 'rl1',
        'zoneNumber': widget.zoneNumber,
        'boardingPointId': widget.ghatId ?? 'g1',
        'bookingType': 'BOOK_NOW',
        'tripType': widget.tripType,
        'boatCategory': widget.boatCategory,
        'seatsBooked': widget.passengers,
        'fareAmount': widget.totalFare,
        'advancePaid': _advanceAmount,
        'paymentMode': 'ONLINE_PREPAID',
        'startRideOtp': _rideOtp,
      });

      final bookingData = res['data'] ?? {};
      final bookingId = bookingData['_id'] ?? 'b_${DateTime.now().millisecondsSinceEpoch}';
      final bookingCode = bookingData['bookingCode'] ?? 'NV-9912';

      if (mounted) {
        setState(() => _isPaying = false);

        // Show Booking Confirmed Popup
        await BookingConfirmedDialog.show(
          context: context,
          bookingCode: bookingCode,
          ghatName: widget.ghatName,
          boatName: _riderData?['boatName'] ?? 'Ganga Vihar Motor Boat',
          totalFare: widget.totalFare,
          advancePaid: _advanceAmount,
          remainingFare: _remainingAmount,
          rideOtp: _rideOtp,
          dateOrTimeText: 'Immediate Boarding (3 mins away)',
          isScheduled: false,
          onActionPressed: () {
            // Navigate directly to Active Ride Screen with Live Tracking & Rider Details
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => ActiveRideScreen(
                  bookingId: bookingId,
                  bookingCode: bookingCode,
                  ghatName: widget.ghatName,
                  fare: widget.totalFare,
                  boatName: _riderData?['boatName'] ?? 'Ganga Vihar Motor Boat',
                  boatNumber: _riderData?['boatNumber'] ?? 'UPB-1024',
                  passengers: widget.passengers,
                  tripDuration: 'Full Trip (2 hrs)',
                ),
              ),
            );
          },
        );
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isPaying = false);
        final bookingCode = 'NV-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

        await BookingConfirmedDialog.show(
          context: context,
          bookingCode: bookingCode,
          ghatName: widget.ghatName,
          boatName: _riderData?['boatName'] ?? 'Ganga Vihar Motor Boat',
          totalFare: widget.totalFare,
          advancePaid: _advanceAmount,
          remainingFare: _remainingAmount,
          rideOtp: _rideOtp,
          dateOrTimeText: 'Immediate Boarding (3 mins away)',
          isScheduled: false,
          onActionPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => ActiveRideScreen(
                  bookingId: 'b_mock_active',
                  bookingCode: bookingCode,
                  ghatName: widget.ghatName,
                  fare: widget.totalFare,
                  boatName: _riderData?['boatName'] ?? 'Ganga Vihar Motor Boat',
                  boatNumber: _riderData?['boatNumber'] ?? 'UPB-1024',
                  passengers: widget.passengers,
                  tripDuration: 'Full Trip (2 hrs)',
                ),
              ),
            );
          },
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () {
            _countdownTimer?.cancel();
            Navigator.pop(context);
          },
        ),
        title: Text(
          _isSearching
              ? 'Finding Nearby Boats'
              : _isCancelled
                  ? 'Booking Cancelled'
                  : 'Rider Found!',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: _isSearching
            ? _buildSearchingView()
            : _isCancelled
                ? _buildTimeoutView()
                : _buildRiderAcceptedView(),
      ),
    );
  }

  // 1. Searching Radar Screen
  Widget _buildSearchingView() {
    return Column(
      children: [
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Animated Sonar Ripple
              Stack(
                alignment: Alignment.center,
                children: [
                  ScaleTransition(
                    scale: _pulseAnimation,
                    child: Container(
                      width: 170,
                      height: 170,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: const Color(0xFFEB4D37).withValues(alpha: 0.12),
                      ),
                    ),
                  ),
                  Container(
                    width: 110,
                    height: 110,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFFEB4D37).withValues(alpha: 0.22),
                    ),
                  ),
                  Container(
                    width: 72,
                    height: 72,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFFEB4D37),
                      boxShadow: [
                        BoxShadow(
                          color: Color(0xFFEB4D37),
                          blurRadius: 18,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.directions_boat_rounded,
                      color: Colors.white,
                      size: 38,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 36),

              const Text(
                'Searching Nearby Boats...',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                  letterSpacing: -0.3,
                ),
              ),

              const SizedBox(height: 8),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Text(
                  'Contacting verified licensed boatmen near ${widget.ghatName} on River Ganges...',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 13.5,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),

        // Summary Card at bottom
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            border: Border(top: BorderSide(color: Colors.grey.shade200)),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 18, color: Color(0xFFEB4D37)),
                      const SizedBox(width: 6),
                      Text(
                        widget.ghatName,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
                      ),
                    ],
                  ),
                  Text(
                    '₹${widget.totalFare}',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFFEB4D37)),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  side: BorderSide(color: Colors.grey.shade300),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel Request', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 2. Rider Accepted + 45s Countdown + 20% Advance Payment Screen
  Widget _buildRiderAcceptedView() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 45-Second Auto-Cancel Warning Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFFECACA), width: 1.5),
            ),
            child: Row(
              children: [
                // Circular Countdown Timer Display
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 52,
                      height: 52,
                      child: CircularProgressIndicator(
                        value: _secondsLeft / 45,
                        strokeWidth: 4,
                        backgroundColor: Colors.red.shade100,
                        color: const Color(0xFFEF4444),
                      ),
                    ),
                    Text(
                      '${_secondsLeft}s',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFDC2626),
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Confirm within 45 seconds',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF991B1B),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Pay 20% advance (₹$_advanceAmount) now to lock your rider. Unpaid rides auto-cancel.',
                        style: const TextStyle(fontSize: 11.5, color: Color(0xFFB91C1C), height: 1.3),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Rider Profile Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
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
            child: Column(
              children: [
                Row(
                  children: [
                    // Driver Avatar
                    Container(
                      width: 62,
                      height: 62,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFEB4D37), width: 2),
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/images/driver_avatar.jpg',
                          fit: BoxFit.cover,
                          errorBuilder: (ctx, err, stack) => const Icon(Icons.person, size: 36, color: Color(0xFFEB4D37)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                _riderData?['name'] ?? 'Ramesh Manjhi',
                                style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                              ),
                              const SizedBox(width: 4),
                              const Icon(Icons.verified, size: 16, color: Color(0xFF10B981)),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '⭐ ${_riderData?['rating']} • ${_riderData?['tripsCount']} rides completed',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            _riderData?['boatName'] ?? 'Ganga Vihar Motor Boat',
                            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFFEB4D37)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(height: 24, color: Color(0xFFE2E8F0)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.directions_boat_outlined, size: 16, color: Color(0xFF64748B)),
                        const SizedBox(width: 6),
                        Text(
                          _riderData?['boatNumber'] ?? 'UPB-1024',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        _riderData?['eta'] ?? '3 mins away',
                        style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF059669)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // 20% Advance Payment Breakdown Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Total Trip Fare', style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                    Text('₹${widget.totalFare}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Advance Payable (20%)', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFFEB4D37))),
                    Text('₹$_advanceAmount', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFFEB4D37))),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Remaining at Boarding (80%)', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                    Text('₹$_remainingAmount', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // Pay Now CTA Button
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              minimumSize: const Size.fromHeight(54),
              backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            onPressed: _isPaying ? null : _showPaymentModal,
            child: _isPaying
                ? const SizedBox(
                    height: 22,
                    width: 22,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.bolt, size: 22),
                      const SizedBox(width: 8),
                      Text(
                        'Pay 20% (₹$_advanceAmount) to Confirm',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                      ),
                    ],
                  ),
          ),

          const SizedBox(height: 12),

          Center(
            child: TextButton(
              onPressed: () {
                _countdownTimer?.cancel();
                Navigator.pop(context);
              },
              child: const Text('Decline Rider', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
    );
  }

  // 3. Timeout / Cancelled View if 45s expires
  Widget _buildTimeoutView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: Color(0xFFFEF2F2),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.timer_off_rounded, size: 48, color: Color(0xFFEF4444)),
            ),
            const SizedBox(height: 20),
            const Text(
              'Booking Auto-Cancelled',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 8),
            const Text(
              'The 20% advance payment was not completed within 45 seconds. The boat captain has been released to other passengers.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13.5, color: Color(0xFF64748B), height: 1.4),
            ),
            const SizedBox(height: 28),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
                backgroundColor: const Color(0xFFEB4D37),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: () {
                setState(() {
                  _isCancelled = false;
                  _isSearching = true;
                  _riderFound = false;
                });
                _startRiderSearch();
              },
              child: const Text('Try Searching Again', style: TextStyle(fontWeight: FontWeight.w800)),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Back to Home', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}
