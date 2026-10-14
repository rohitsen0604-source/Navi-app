import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class BookingConfirmedDialog extends StatelessWidget {
  final String bookingCode;
  final String ghatName;
  final String boatName;
  final int totalFare;
  final int advancePaid;
  final int remainingFare;
  final String rideOtp;
  final String dateOrTimeText;
  final bool isScheduled;
  final VoidCallback onActionPressed;

  const BookingConfirmedDialog({
    super.key,
    required this.bookingCode,
    required this.ghatName,
    required this.boatName,
    required this.totalFare,
    required this.advancePaid,
    required this.remainingFare,
    required this.rideOtp,
    required this.dateOrTimeText,
    this.isScheduled = false,
    required this.onActionPressed,
  });

  static Future<void> show({
    required BuildContext context,
    required String bookingCode,
    required String ghatName,
    required String boatName,
    required int totalFare,
    required int advancePaid,
    required int remainingFare,
    required String rideOtp,
    required String dateOrTimeText,
    bool isScheduled = false,
    required VoidCallback onActionPressed,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => BookingConfirmedDialog(
        bookingCode: bookingCode,
        ghatName: ghatName,
        boatName: boatName,
        totalFare: totalFare,
        advancePaid: advancePaid,
        remainingFare: remainingFare,
        rideOtp: rideOtp,
        dateOrTimeText: dateOrTimeText,
        isScheduled: isScheduled,
        onActionPressed: () {
          Navigator.pop(ctx);
          onActionPressed();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      elevation: 16,
      backgroundColor: Colors.white,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // 1. Success Animated Icon
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFA7F3D0), width: 2),
                ),
                child: const Center(
                  child: Icon(
                    Icons.check_circle_rounded,
                    color: Color(0xFF10B981),
                    size: 52,
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Title & Subtitle
              Text(
                isScheduled ? 'Scheduled Booking Confirmed!' : 'Booking Confirmed!',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                  color: Color(0xFF0F172A),
                ),
              ),

              const SizedBox(height: 6),

              Text(
                isScheduled
                    ? 'Your advance slot is reserved. Full trip details are saved.'
                    : 'Your boat and rider are locked! Live tracking is active.',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w500,
                ),
              ),

              const SizedBox(height: 20),

              // 2. Start Ride Confirmation OTP Card (Prominent Golden Amber Box)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFBEB),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFFDE68A), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFD97706).withValues(alpha: 0.08),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.key_rounded, size: 18, color: Color(0xFFD97706)),
                        const SizedBox(width: 6),
                        Text(
                          isScheduled ? 'SCHEDULE CONFIRMATION OTP' : 'START RIDE OTP',
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.0,
                            color: Color(0xFFB45309),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          rideOtp,
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 8,
                            color: Color(0xFF92400E),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy_rounded, size: 20, color: Color(0xFFB45309)),
                          tooltip: 'Copy OTP',
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: rideOtp));
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Ride OTP $rideOtp copied!'),
                                duration: const Duration(seconds: 2),
                                backgroundColor: const Color(0xFF0F172A),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Give this 4-digit OTP to your boat captain at boarding to begin the ride',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFB45309),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // 3. Payment Breakdown (20% Advance Paid)
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Booking Code',
                          style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
                        ),
                        Text(
                          bookingCode,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 16, color: Color(0xFFE2E8F0)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Boarding Ghat',
                          style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
                        ),
                        Text(
                          ghatName,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 16, color: Color(0xFFE2E8F0)),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Advance Paid (20%)',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF059669),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFECFDF5),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFA7F3D0)),
                          ),
                          child: Text(
                            '₹$advancePaid (PAID)',
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF059669),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Balance at Ghat (80%)',
                          style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                        ),
                        Text(
                          '₹$remainingFare',
                          style: const TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              if (isScheduled) ...[
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFBFDBFE)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.notifications_active_outlined, size: 18, color: Color(0xFF2563EB)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Captain details will be notified 2 days before $dateOrTimeText.',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF1E40AF),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 22),

              // Action Button
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(52),
                  backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: onActionPressed,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      isScheduled ? Icons.calendar_month_rounded : Icons.navigation_rounded,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      isScheduled ? 'View Scheduled Trips' : 'Track Boat & View Ride',
                      style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
