import 'package:flutter/material.dart';
import 'active_ride_screen.dart';
import 'cancel_booking_screen.dart';
import 'chat_support_screen.dart';
import 'ride_completed_screen.dart';
import 'share_ride_screen.dart';
import 'sos_emergency_screen.dart';
import 'feedback_dialog.dart';

class TripDetailsScreen extends StatefulWidget {
  final Map<String, dynamic> booking;

  const TripDetailsScreen({
    super.key,
    required this.booking,
  });

  @override
  State<TripDetailsScreen> createState() => _TripDetailsScreenState();
}

class _TripDetailsScreenState extends State<TripDetailsScreen> {
  late Map<String, dynamic> _booking;

  @override
  void initState() {
    super.initState();
    _booking = Map<String, dynamic>.from(widget.booking);
  }

  String get _bookingId => _booking['_id'] ?? 'b_mock_1';
  String get _bookingCode => _booking['bookingCode'] ?? 'NV-991201';
  String get _status => (_booking['status'] ?? 'CONFIRMED').toString().toUpperCase();
  String get _boatName => _booking['boatName'] ?? 'Ganga Vihar Motor Boat';
  String get _boatNumber => _booking['boatNumber'] ?? 'UPB-1024';
  String get _ghatName => _booking['ghatName'] ?? _booking['boardingGhat'] ?? _booking['boardingPointId']?['name'] ?? 'Dashashwamedh Ghat';
  String get _destinationGhat => _booking['destinationGhat'] ?? _booking['destinationPointId']?['name'] ?? 'Assi Ghat';
  String get _dateTimeText => _booking['dateTimeText'] ?? _booking['scheduledTimeText'] ?? 'Today | 05:30 PM';
  String get _passengersText => _booking['passengersText'] ?? '${_booking['passengers'] ?? 2} Passengers';
  int get _passengers => (_booking['passengers'] as num?)?.toInt() ?? 2;
  String get _driverName => _booking['driverName'] ?? 'Ramesh Manjhi';
  String get _driverPhone => _booking['driverPhone'] ?? '+91 98765 43220';
  String get _paymentMode => _booking['paymentMode'] ?? 'ONLINE_PREPAID';
  String get _tripType => _booking['tripType'] ?? 'FULL_TRIP';
  String get _rideOtp => _booking['rideOtp'] ?? '7394';
  bool get _isScheduled => _booking['isScheduled'] == true || _status == 'SCHEDULED';
  double get _fareAmount =>
      (_booking['fareAmount'] as num?)?.toDouble() ??
      (_booking['totalFare'] as num?)?.toDouble() ??
      (_booking['fare'] as num?)?.toDouble() ??
      550.0;

  bool _notificationReceived = false;

  bool get _isCompleted => _status == 'RIDE_COMPLETED' || _status == 'COMPLETED';
  bool get _isCancelled => _status == 'CANCELLED';
  bool get _isActiveOrUpcoming => !_isCompleted && !_isCancelled;

  void _showInvoiceSheet() async {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.receipt_long, color: Color(0xFFEB4D37), size: 24),
                    SizedBox(width: 10),
                    Text(
                      'Tax Invoice',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
            const Divider(height: 24),
            _buildInvoiceRow('Invoice Number', 'INV-VAR-${_bookingCode.replaceAll('NV-', '')}'),
            _buildInvoiceRow('Booking Reference', _bookingCode),
            _buildInvoiceRow('Issue Date', 'Today, Varanasi Waterways'),
            _buildInvoiceRow('Passenger Name', 'Rahul Sharma'),
            _buildInvoiceRow('Vessel Reg Number', _boatNumber),
            const Divider(height: 20),
            _buildInvoiceRow('Base Boat Tariff', '₹${(_fareAmount - 50).toInt()}'),
            _buildInvoiceRow('Platform & Safety Levy', '₹50'),
            _buildInvoiceRow('GST / Inland Tariffs (0%)', '₹0'),
            const Divider(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Total Amount Paid', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
                Text('₹${_fareAmount.toInt()}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFFEB4D37))),
              ],
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0F172A),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Tax Invoice downloaded to your device.'),
                    backgroundColor: Color(0xFF10B981),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              },
              icon: const Icon(Icons.download, size: 18),
              label: const Text('Download PDF Invoice', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInvoiceRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B))),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
        ],
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
          onPressed: () => Navigator.pop(context, _booking),
        ),
        title: const Text(
          'Trip Details',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontSize: 18,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.support_agent, color: Color(0xFFEB4D37)),
            tooltip: 'Live Support Chat',
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ChatSupportScreen()),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Status Banner Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _isCompleted
                      ? const Color(0xFFECFDF5)
                      : _isCancelled
                          ? const Color(0xFFFEF2F2)
                          : const Color(0xFFFFF1EE),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: _isCompleted
                        ? const Color(0xFFA7F3D0)
                        : _isCancelled
                            ? const Color(0xFFFECACA)
                            : const Color(0xFFFFD5CE),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: _isCompleted
                            ? const Color(0xFF059669)
                            : _isCancelled
                                ? const Color(0xFFDC2626)
                                : const Color(0xFFEB4D37),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        _isCompleted
                            ? Icons.check
                            : _isCancelled
                                ? Icons.close
                                : Icons.directions_boat,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                _isCompleted
                                    ? 'Ride Completed'
                                    : _isCancelled
                                        ? 'Ride Cancelled'
                                        : 'Ride Confirmed',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: _isCompleted
                                      ? const Color(0xFF065F46)
                                      : _isCancelled
                                          ? const Color(0xFF991B1B)
                                          : const Color(0xFF9A3412),
                                ),
                              ),
                              Text(
                                _bookingCode,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _isCompleted
                                ? 'Completed safely on Varanasi Waterways'
                                : _isCancelled
                                    ? 'Refund processed per cancellation tier'
                                    : 'Scheduled at $_ghatName',
                            style: TextStyle(
                              fontSize: 12,
                              color: _isCompleted
                                  ? const Color(0xFF047857)
                                  : _isCancelled
                                      ? const Color(0xFFB91C1C)
                                      : const Color(0xFFC2410C),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // 2. Journey Itinerary Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Ganges Itinerary',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 16),

                    // Pickup Ghat
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Column(
                          children: [
                            Icon(Icons.radio_button_checked, color: Color(0xFF10B981), size: 18),
                            SizedBox(height: 4),
                            SizedBox(
                              height: 32,
                              child: VerticalDivider(color: Color(0xFFCBD5E1), thickness: 2),
                            ),
                          ],
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Boarding Point', style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                              Text(_ghatName, style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                              Text(_dateTimeText, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                            ],
                          ),
                        ),
                      ],
                    ),

                    // Drop Ghat
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.location_on, color: Color(0xFFEB4D37), size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Destination Point', style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                              Text(_destinationGhat, style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                              Text('$_tripType • $_passengersText', style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // 3. Boat & Boatman Card / 2-Day Prior Notification Gate
              if (_isScheduled && !_notificationReceived) ...[
                // Notification Pending State (Per user specification: rider details arrive 2 days before)
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFBFDBFE)),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: const BoxDecoration(
                              color: Color(0xFF2563EB),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.notifications_active_rounded, color: Colors.white, size: 22),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Rider Details & OTP Locked',
                                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF1E3A8A)),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Per waterways rules, captain details & Start Ride OTP are dispatched 2 days prior to your travel date.',
                                  style: const TextStyle(fontSize: 12, color: Color(0xFF1E40AF), height: 1.3),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      // Interactive Simulation Button so the user can test immediately!
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(44),
                          backgroundColor: const Color(0xFF2563EB),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 0,
                        ),
                        onPressed: () {
                          setState(() => _notificationReceived = true);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('🔔 Notification: Your ride is in 2 days! Captain $_driverName assigned. Ride OTP: $_rideOtp'),
                              backgroundColor: const Color(0xFF10B981),
                              behavior: SnackBarBehavior.floating,
                              duration: const Duration(seconds: 4),
                            ),
                          );
                        },
                        icon: const Icon(Icons.alarm_on, size: 18),
                        label: const Text(
                          'Simulate 2-Days Prior Notification',
                          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              ] else ...[
                // Unlocked Rider Details & Start Ride Confirmation OTP Card
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFBEB),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFFDE68A), width: 1.5),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          color: Color(0xFFFEF3C7),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.key_rounded, color: Color(0xFFD97706), size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'START RIDE OTP (GIVE TO RIDER)',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.8,
                                color: Color(0xFFB45309),
                              ),
                            ),
                            Text(
                              _rideOtp,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 6,
                                color: Color(0xFF92400E),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFECFDF5),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          '20% Paid',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF059669)),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // Boat & Rider Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Assigned Vessel & Boatman',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF1EE),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Icon(Icons.directions_boat, color: Color(0xFFEB4D37), size: 28),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _boatName,
                                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Reg: $_boatNumber • Life Jackets Certified',
                                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 22, color: Color(0xFFF1F5F9)),
                      Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: Image.asset(
                              'assets/images/driver_avatar.jpg',
                              width: 40,
                              height: 40,
                              fit: BoxFit.cover,
                              errorBuilder: (ctx, err, stack) => const Icon(Icons.person, color: Color(0xFF64748B)),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _driverName,
                                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                                ),
                                const Text(
                                  'Certified Varanasi Boatman • 4.9 ★',
                                  style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.phone, color: Color(0xFF10B981)),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Calling $_driverName ($_driverPhone)...'),
                                  backgroundColor: const Color(0xFF10B981),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.chat_bubble_outline, color: Color(0xFFEB4D37)),
                            onPressed: () => Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const ChatSupportScreen()),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 16),

              // 4. Itemized Fare Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Payment Breakdown',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        TextButton.icon(
                          onPressed: _showInvoiceSheet,
                          icon: const Icon(Icons.receipt, size: 16, color: Color(0xFFEB4D37)),
                          label: const Text('View Invoice', style: TextStyle(fontSize: 12, color: Color(0xFFEB4D37), fontWeight: FontWeight.w700)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    _buildInvoiceRow('Total Trip Fare', '₹${_fareAmount.toInt()}'),
                    _buildInvoiceRow('20% Advance Paid', '₹${(_fareAmount * 0.20).toInt()} (Paid)'),
                    _buildInvoiceRow('Remaining at Ghat (80%)', '₹${(_fareAmount * 0.80).toInt()}'),
                    _buildInvoiceRow('Payment Mode', _paymentMode == 'ONLINE_PREPAID' ? 'Online (Paid)' : 'Pay After Ride at Ghat'),
                    _buildInvoiceRow('Booking Status', _isCancelled ? 'CANCELLED' : 'CONFIRMED'),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 5. Action Buttons according to Status
              if (_isActiveOrUpcoming) ...[
                // Primary: Track Live Ride
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    backgroundColor: const Color(0xFFEB4D37),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ActiveRideScreen(
                        bookingId: _bookingId,
                        bookingCode: _bookingCode,
                        ghatName: _ghatName,
                        fare: _fareAmount.toInt(),
                        boatName: _boatName,
                        boatNumber: _boatNumber,
                        passengers: _passengers,
                        tripDuration: 'Full Trip (2 hrs)',
                                                                      ),
                    ),
                  ),
                  icon: const Icon(Icons.navigation_outlined, size: 20),
                  label: const Text('Track Live Boat Ride', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
                ),
                const SizedBox(height: 10),

                // Secondary Row: Share Ride & SOS
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                          foregroundColor: const Color(0xFF0F172A),
                          side: const BorderSide(color: Color(0xFFE2E8F0)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ShareRideScreen(
                              bookingId: _bookingId,
                              bookingCode: _bookingCode,
                              zoneGhatText: _ghatName,
                              dateTimeText: _dateTimeText,
                              driverName: _driverName,
                            ),
                          ),
                        ),
                        icon: const Icon(Icons.share_outlined, size: 18),
                        label: const Text('Share Ride', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                          foregroundColor: const Color(0xFFDC2626),
                          side: const BorderSide(color: Color(0xFFFECACA)),
                          backgroundColor: const Color(0xFFFEF2F2),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => SosEmergencyScreen(bookingId: _bookingId),
                          ),
                        ),
                        icon: const Icon(Icons.emergency_outlined, size: 18),
                        label: const Text('Emergency SOS', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Rate & Review Rider Action (Feedback Popup)
                OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(48),
                    foregroundColor: const Color(0xFFEB4D37),
                    side: const BorderSide(color: Color(0xFFEB4D37)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    FeedbackDialog.show(
                      context: context,
                      bookingId: _bookingId,
                      driverName: _driverName,
                      boatName: _boatName,
                      ghatName: _ghatName,
                    );
                  },
                  icon: const Icon(Icons.star_outline_rounded, size: 20),
                  label: const Text('Rate & Give Feedback to Rider', style: TextStyle(fontWeight: FontWeight.w700)),
                ),

                // Cancel Ride Button
                TextButton.icon(
                  onPressed: () async {
                    final res = await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => CancelBookingScreen(
                          bookingId: _bookingId,
                          bookingCode: _bookingCode,
                          boatName: _boatName,
                          ghatName: _ghatName,
                          scheduledTimeText: _dateTimeText,
                          fareAmount: _fareAmount,
                          paymentMode: _paymentMode,
                        ),
                      ),
                    );
                    if (res != null && mounted) {
                      setState(() {
                        _booking['status'] = 'CANCELLED';
                      });
                    }
                  },
                  icon: const Icon(Icons.cancel_outlined, size: 16, color: Color(0xFFDC2626)),
                  label: const Text(
                    'Cancel Booking & Check Refund Policy',
                    style: TextStyle(fontSize: 13, color: Color(0xFFDC2626), fontWeight: FontWeight.w700),
                  ),
                ),
              ] else if (_isCompleted) ...[
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    backgroundColor: const Color(0xFFEB4D37),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => RideCompletedScreen(
                        bookingId: _bookingId,
                        bookingCode: _bookingCode,
                        boatName: _boatName,
                        ghatName: _ghatName,
                        totalPaid: _fareAmount.toInt(),
                      ),
                    ),
                  ),
                  icon: const Icon(Icons.star_outline, size: 20),
                  label: const Text('Rate & Review Ride', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
                ),
              ],

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
