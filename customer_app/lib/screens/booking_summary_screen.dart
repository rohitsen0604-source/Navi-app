import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'active_ride_screen.dart';

class BookingSummaryScreen extends StatefulWidget {
  final Map<String, dynamic> selectedBoat;
  final int zoneNumber;
  final String ghatName;
  final String? ghatId;
  final int passengers;
  final String tripType;
  final String bookingType;
  final String scheduledTimeText;

  const BookingSummaryScreen({
    super.key,
    required this.selectedBoat,
    this.zoneNumber = 1,
    this.ghatName = 'Dashashwamedh Ghat',
    this.ghatId,
    this.passengers = 2,
    this.tripType = 'FULL_TRIP',
    this.bookingType = 'BOOK_NOW',
    this.scheduledTimeText = 'Today, 25 Feb 2026  |  02:00 PM',
  });

  @override
  State<BookingSummaryScreen> createState() => _BookingSummaryScreenState();
}

class _BookingSummaryScreenState extends State<BookingSummaryScreen> {
  String _selectedPaymentMode = 'ONLINE_PREPAID'; // 'ONLINE_PREPAID' or 'PAY_AFTER_RIDE'
  bool _isBookingLoading = false;
  String? _appliedCoupon;
  int _discountAmount = 0;

  final int _platformFee = 50;

  int get _baseFare => (widget.selectedBoat['price'] as int?) ?? 1200;
  int get _totalAmount => (_baseFare + _platformFee - _discountAmount).clamp(0, 999999);

  void _showCouponDialog() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Apply Promo Code', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: controller,
                textCapitalization: TextCapitalization.characters,
                decoration: InputDecoration(
                  hintText: 'e.g. BANARAS10 or FIRSTNAAVI',
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Available coupons:\n• BANARAS10 (₹100 OFF)\n• FIRSTNAAVI (₹50 OFF)',
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B))),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEB4D37),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                final code = controller.text.trim().toUpperCase();
                if (code == 'BANARAS10') {
                  setState(() {
                    _appliedCoupon = 'BANARAS10';
                    _discountAmount = 100;
                  });
                  Navigator.pop(ctx);
                } else if (code == 'FIRSTNAAVI') {
                  setState(() {
                    _appliedCoupon = 'FIRSTNAAVI';
                    _discountAmount = 50;
                  });
                  Navigator.pop(ctx);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Invalid coupon code'), backgroundColor: Colors.redAccent),
                  );
                }
              },
              child: const Text('Apply'),
            ),
          ],
        );
      },
    );
  }

  void _handleConfirmBooking() async {
    setState(() => _isBookingLoading = true);

    try {
      final res = await ApiService.createBooking({
        'riverLakeId': 'rl1',
        'zoneNumber': widget.zoneNumber,
        'boardingPointId': widget.ghatId ?? 'g1',
        'bookingType': widget.bookingType,
        'tripType': widget.tripType,
        'boatCategory': widget.selectedBoat['category'] ?? 'MOTOR_BOAT',
        'seatsBooked': widget.passengers,
        'fareAmount': _totalAmount,
        'paymentMode': _selectedPaymentMode,
        'couponCode': _appliedCoupon,
        'discountAmount': _discountAmount,
      });

      if (mounted) {
        final bookingData = res['data'] ?? {};
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ActiveRideScreen(
              bookingId: bookingData['_id'] ?? 'b_mock_1',
              bookingCode: bookingData['bookingCode'] ?? 'NV-9912',
              ghatName: widget.ghatName,
              fare: _totalAmount,
            ),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Booking error: ${e.toString()}'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isBookingLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final boatName = widget.selectedBoat['name'] ?? 'Motor Boat';
    final boatImage = widget.selectedBoat['image'] ?? 'assets/images/boat_motor.jpg';
    final durationText = widget.selectedBoat['durationText'] ?? 'Full Trip (2 hrs)';

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
          'Booking Summary',
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
              // 1. Boat / Trip Card Header
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
                        boatImage,
                        width: 90,
                        height: 90,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          width: 90,
                          height: 90,
                          color: const Color(0xFFFFF1EE),
                          child: const Icon(Icons.directions_boat, color: Color(0xFFEB4D37), size: 36),
                        ),
                      ),
                    ),

                    const SizedBox(width: 14),

                    // Boat Specs
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            boatName,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Zone ${widget.zoneNumber} - ${widget.ghatName}',
                            style: const TextStyle(
                              fontSize: 12.5,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              const Icon(Icons.person_outline, size: 14, color: Color(0xFF64748B)),
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
                                durationText,
                                style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Row(
                            children: [
                              const Icon(Icons.calendar_today_outlined, size: 13, color: Color(0xFF64748B)),
                              const SizedBox(width: 4),
                              Text(
                                widget.scheduledTimeText,
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

              const SizedBox(height: 24),

              // 2. Fare Details Section
              const Text(
                'Fare Details',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    // Base Fare
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Base Fare', style: TextStyle(fontSize: 14, color: Color(0xFF475569))),
                        Text('₹$_baseFare', style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Platform Fee
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Platform Fee', style: TextStyle(fontSize: 14, color: Color(0xFF475569))),
                        Text('₹$_platformFee', style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Coupon Link / Discount Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        InkWell(
                          onTap: _showCouponDialog,
                          child: Text(
                            _appliedCoupon != null ? 'Coupon ($_appliedCoupon) Applied' : 'Have a Coupon Code?',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFFEB4D37), // Sunrise Coral Red
                            ),
                          ),
                        ),
                        Text(
                          _discountAmount > 0 ? '-₹$_discountAmount' : '₹0',
                          style: TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w700,
                            color: _discountAmount > 0 ? const Color(0xFF10B981) : const Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),

                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 14),
                      child: Divider(color: Color(0xFFF1F5F9), height: 1),
                    ),

                    // Total Amount
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total Amount',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        Text(
                          '₹$_totalAmount',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFFEB4D37), // Sunrise Coral Red
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 3. Payment Mode Section
              const Text(
                'Payment Mode',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                  letterSpacing: -0.2,
                ),
              ),
              const SizedBox(height: 12),

              // Option A: Pay Online
              _buildPaymentOptionTile(
                id: 'ONLINE_PREPAID',
                title: 'Pay Online (UPI / Card / Wallet)',
                icon: Icons.credit_card_outlined,
              ),

              const SizedBox(height: 10),

              // Option B: Pay After Ride
              _buildPaymentOptionTile(
                id: 'PAY_AFTER_RIDE',
                title: 'Pay After Ride (Cash / UPI)',
                icon: Icons.calendar_today_outlined,
              ),

              const SizedBox(height: 32),

              // 4. Confirm Booking CTA Button (Sunrise Coral Red)
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(54),
                  backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: _isBookingLoading ? null : _handleConfirmBooking,
                child: _isBookingLoading
                    ? const SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.2),
                      )
                    : const Text(
                        'Confirm Booking',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.2,
                        ),
                      ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentOptionTile({
    required String id,
    required String title,
    required IconData icon,
  }) {
    final isSel = _selectedPaymentMode == id;

    return GestureDetector(
      onTap: () => setState(() => _selectedPaymentMode = id),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isSel ? const Color(0xFFFFF1EE) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
            width: isSel ? 1.8 : 1.0,
          ),
        ),
        child: Row(
          children: [
            // Custom Radio Icon
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFCBD5E1),
                  width: 2,
                ),
              ),
              child: isSel
                  ? Center(
                      child: Container(
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(
                          color: Color(0xFFEB4D37),
                          shape: BoxShape.circle,
                        ),
                      ),
                    )
                  : null,
            ),
            const SizedBox(width: 14),
            Icon(icon, size: 22, color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A)),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: isSel ? FontWeight.w700 : FontWeight.w600,
                  color: const Color(0xFF0F172A),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
