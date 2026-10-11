import 'payment_screen.dart';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'my_rides_screen.dart';
import 'offers_coupons_screen.dart';

class ScheduleConfirmationScreen extends StatefulWidget {
  final int zoneNumber;
  final String ghatId;
  final String ghatName;
  final String boatCategory;
  final String boatName;
  final int passengers;
  final String tripType;
  final DateTime selectedDate;
  final String scheduledDateText;
  final Map<String, dynamic> timeSlot;
  final Map<String, dynamic> fareData;

  const ScheduleConfirmationScreen({
    super.key,
    required this.zoneNumber,
    required this.ghatId,
    required this.ghatName,
    required this.boatCategory,
    required this.boatName,
    required this.passengers,
    required this.tripType,
    required this.selectedDate,
    required this.scheduledDateText,
    required this.timeSlot,
    required this.fareData,
  });

  @override
  State<ScheduleConfirmationScreen> createState() => _ScheduleConfirmationScreenState();
}

class _ScheduleConfirmationScreenState extends State<ScheduleConfirmationScreen> {
  String _paymentMode = 'ONLINE_PREPAID'; // 'ONLINE_PREPAID' or 'PAY_AFTER_RIDE'
  bool _isSubmitting = false;

  String? _appliedCoupon;
  int _discountAmount = 0;
  late int _totalAmount;

  @override
  void initState() {
    super.initState();
    _totalAmount = (widget.fareData['finalPayableAmount'] as num?)?.toInt() ?? 1150;
    _discountAmount = (widget.fareData['discountAmount'] as num?)?.toInt() ?? 0;
    _appliedCoupon = widget.fareData['couponCode'];
  }

  void _openOffersScreen() async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => OffersCouponsScreen(
          fareAmount: _totalAmount + _discountAmount,
          zoneNumber: widget.zoneNumber,
          appliedCoupon: _appliedCoupon,
        ),
      ),
    );

    if (result != null && result is Map<String, dynamic> && mounted) {
      setState(() {
        _appliedCoupon = result['code'];
        _discountAmount = (result['discountAmount'] as num?)?.toInt() ?? 0;
        final subtotal = (widget.fareData['subtotal'] as num?)?.toInt() ?? (_totalAmount + _discountAmount);
        _totalAmount = (subtotal - _discountAmount).clamp(0, 999999);
      });
    }
  }

  void _confirmBooking() async {
    if (_paymentMode == 'ONLINE_PREPAID') {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => PaymentScreen(
            totalAmount: _totalAmount.toDouble(),
            boatName: widget.boatName,
            boatCategory: widget.boatCategory,
            ghatName: widget.ghatName,
            scheduledTimeText: '${widget.scheduledDateText} | ${widget.timeSlot['displayTime'] ?? widget.timeSlot['time']}',
            passengers: widget.passengers,
            tripType: widget.tripType,
            zoneNumber: widget.zoneNumber,
            ghatId: widget.ghatId,
            couponCode: _appliedCoupon,
            discountAmount: _discountAmount,
            extraBookingData: {
              'bookingType': 'BOOK_LATER',
              'scheduledDateText': widget.scheduledDateText,
              'timeSlotText': widget.timeSlot['displayTime'] ?? widget.timeSlot['time'],
            },
          ),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final scheduledIso = DateTime(
        widget.selectedDate.year,
        widget.selectedDate.month,
        widget.selectedDate.day,
        _parseSlotHour(widget.timeSlot['time']),
        _parseSlotMinute(widget.timeSlot['time']),
      ).toIso8601String();

      final res = await ApiService.createBooking({
        'zoneNumber': widget.zoneNumber,
        'boardingPointId': widget.ghatId,
        'bookingType': 'BOOK_LATER',
        'tripType': widget.tripType,
        'boatCategory': widget.boatCategory,
        'seatsBooked': widget.passengers,
        'fareAmount': _totalAmount + _discountAmount,
        'discountAmount': _discountAmount,
        'couponCode': _appliedCoupon,
        'paymentMode': _paymentMode,
        'scheduledTime': scheduledIso,
        'scheduledDateText': widget.scheduledDateText,
        'timeSlotText': widget.timeSlot['displayTime'] ?? widget.timeSlot['time'],
      });

      if (mounted) {
        final bookingData = res['data'] ?? {};
        final bookingCode = bookingData['bookingCode'] ?? 'NV-991201';

        _showSuccessDialog(bookingCode);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Scheduling failed: ${e.toString()}'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  int _parseSlotHour(dynamic timeStr) {
    if (timeStr == null) return 6;
    final str = timeStr.toString();
    final parts = str.split(':');
    int h = int.tryParse(parts[0]) ?? 6;
    if (str.contains('PM') && h < 12) h += 12;
    if (str.contains('AM') && h == 12) h = 0;
    return h;
  }

  int _parseSlotMinute(dynamic timeStr) {
    if (timeStr == null) return 0;
    final str = timeStr.toString();
    if (str.contains(':30')) return 30;
    return 0;
  }

  void _showSuccessDialog(String bookingCode) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        contentPadding: const EdgeInsets.all(24),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(
                color: Color(0xFFECFDF5),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 40),
            ),
            const SizedBox(height: 16),
            const Text(
              'Trip Scheduled Successfully!',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Booking Ref: $bookingCode',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Color(0xFFEB4D37),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Date:', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                      Text(widget.scheduledDateText.split('•').first.trim(), style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Time Slot:', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                      Text(widget.timeSlot['time'] ?? '', style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Boarding:', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                      Text(widget.ghatName, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEB4D37),
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: () {
                Navigator.pop(ctx); // Close dialog
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) => const MyRidesScreen()),
                  (route) => false,
                );
              },
              child: const Text('View in My Rides', style: TextStyle(fontWeight: FontWeight.w800)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Confirm Scheduled Booking',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontSize: 17.5,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Schedule Summary Card (Date, Time, Ghat)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
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
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF1EE),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.calendar_month_outlined, color: Color(0xFFEB4D37), size: 24),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Scheduled Date & Time', style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                              const SizedBox(height: 2),
                              Text(
                                '${widget.scheduledDateText} • ${widget.timeSlot['time']}',
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24, color: Color(0xFFF1F5F9)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Boarding Point', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                            const SizedBox(height: 2),
                            Text('Zone ${widget.zoneNumber} • ${widget.ghatName}', style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700)),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text('Vessel & Seats', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                            const SizedBox(height: 2),
                            Text('${widget.boatName} (${widget.passengers} Pax)', style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // 2. Cancellation Policy Card (Authoritative Naavi Policy)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.shield_outlined, color: Color(0xFF16A34A), size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Naavi Cancellation & Refund Policy',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF15803D),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      '• Free cancellation with 80% refund up to 12 hours prior.\n• 70% refund between 6 - 12 hours prior.\n• 50% refund between 3 - 6 hours prior.\n• Non-refundable within 3 hours of boarding.',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF166534),
                        height: 1.45,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // 3. Coupon Promo Code Card
              GestureDetector(
                onTap: _openOffersScreen,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.local_offer_outlined, color: Color(0xFFEB4D37), size: 22),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _appliedCoupon != null ? 'Applied Coupon: $_appliedCoupon' : 'Apply Coupon or Promo Code',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: _appliedCoupon != null ? FontWeight.w800 : FontWeight.w600,
                            color: _appliedCoupon != null ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                          ),
                        ),
                      ),
                      if (_appliedCoupon != null)
                        Text(
                          '-₹$_discountAmount',
                          style: const TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF10B981)),
                        )
                      else
                        const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // 4. Payment Mode Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Select Payment Option', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                    const SizedBox(height: 12),
                    _buildPaymentCard(
                      value: 'ONLINE_PREPAID',
                      title: 'Online Instant Payment',
                      subtitle: 'UPI, Credit/Debit Cards, Net Banking',
                      icon: Icons.credit_card_rounded,
                    ),
                    const SizedBox(height: 10),
                    _buildPaymentCard(
                      value: 'PAY_AFTER_RIDE',
                      title: 'Pay After Ride at Ghat',
                      subtitle: 'Pay boatman via Cash or QR code on completion',
                      icon: Icons.payments_outlined,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // 5. Final Fare Breakdown Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Estimated Fare', style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                        Text('₹${_totalAmount + _discountAmount}', style: const TextStyle(fontWeight: FontWeight.w600)),
                      ],
                    ),
                    if (_discountAmount > 0) ...[
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Coupon Discount ($_appliedCoupon)', style: const TextStyle(fontSize: 13, color: Color(0xFF10B981))),
                          Text('-₹$_discountAmount', style: const TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF10B981))),
                        ],
                      ),
                    ],
                    const Divider(height: 18, color: Color(0xFFF1F5F9)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Final Amount Payable', style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                        Text(
                          '₹$_totalAmount',
                          style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w900, color: Color(0xFFEB4D37)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 6. Action Button
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEB4D37),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(54),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                onPressed: _isSubmitting ? null : _confirmBooking,
                child: _isSubmitting
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                      )
                    : const Text(
                        'Confirm Scheduled Ride',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 0.2),
                      ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentCard({
    required String value,
    required String title,
    required String subtitle,
    required IconData icon,
  }) {
    final isSelected = _paymentMode == value;
    return InkWell(
      onTap: () => setState(() => _paymentMode = value),
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFEB4D37).withValues(alpha: 0.05) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFFCBD5E1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFF0F172A))),
                  Text(subtitle, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle_rounded : Icons.radio_button_off_rounded,
              color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFFCBD5E1),
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

}