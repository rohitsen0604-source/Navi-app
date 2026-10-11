import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'active_ride_screen.dart';
import 'home_screen.dart';
import 'trip_details_screen.dart';

class PaymentSuccessScreen extends StatelessWidget {
  final Map<String, dynamic> bookingData;
  final double totalAmount;
  final String paymentMethod;
  final String transactionId;
  final String boatName;
  final String ghatName;
  final String scheduledTimeText;
  final int passengers;
  final String tripType;

  const PaymentSuccessScreen({
    super.key,
    required this.bookingData,
    required this.totalAmount,
    required this.paymentMethod,
    required this.transactionId,
    required this.boatName,
    required this.ghatName,
    required this.scheduledTimeText,
    required this.passengers,
    required this.tripType,
  });

  String get _bookingCode => bookingData['bookingCode'] ?? 'NV-991201';
  String get _bookingId => bookingData['_id'] ?? 'b_mock_1';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),

              // Animated Green Checkmark
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Container(
                    width: 68,
                    height: 68,
                    decoration: const BoxDecoration(
                      color: Color(0xFF10B981),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.check_rounded,
                      color: Colors.white,
                      size: 44,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 18),

              const Text(
                'Payment Successful!',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Your boat ride in Varanasi is confirmed.',
                style: TextStyle(
                  fontSize: 13.5,
                  color: Colors.grey[600],
                  fontWeight: FontWeight.w500,
                ),
              ),

              const SizedBox(height: 16),

              // Amount Card
              Text(
                '₹${totalAmount.toInt()}',
                style: const TextStyle(
                  fontSize: 38,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFFEB4D37),
                  letterSpacing: -1.0,
                ),
              ),
              Text(
                'Paid via $paymentMethod',
                style: const TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF64748B),
                ),
              ),

              const SizedBox(height: 24),

              // Booking Details Container
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  children: [
                    _buildReceiptRow(
                      label: 'Booking Code',
                      value: _bookingCode,
                      isBold: true,
                      canCopy: true,
                      context: context,
                    ),
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildReceiptRow(
                      label: 'Transaction ID',
                      value: transactionId,
                      canCopy: true,
                      context: context,
                    ),
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildReceiptRow(label: 'Vessel', value: boatName),
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildReceiptRow(label: 'Boarding Point', value: ghatName),
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildReceiptRow(label: 'Departure Time', value: scheduledTimeText),
                    const Divider(height: 20, color: Color(0xFFE2E8F0)),
                    _buildReceiptRow(label: 'Travelers', value: '$passengers Passengers'),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Waterways Safety Notice
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.verified_user, color: Color(0xFF059669), size: 18),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Life jackets provided on vessel. Please arrive 10 mins before departure at the designated ghat.',
                        style: TextStyle(fontSize: 11.5, color: Color(0xFF065F46), fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Action Buttons
              // 1. Live Tracking (Primary)
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(52),
                  backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ActiveRideScreen(
                        bookingId: _bookingId,
                        bookingCode: _bookingCode,
                        ghatName: ghatName,
                        fare: totalAmount.toInt(),
                        boatName: boatName,
                        boatNumber: 'UPB-1024',
                        passengers: passengers,
                        tripDuration: 'Full Trip (2 hrs)',
                                                                      ),
                    ),
                  );
                },
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.navigation_outlined, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Track Live Boat Ride',
                      style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // 2. View Trip Details (Secondary)
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  foregroundColor: const Color(0xFF0F172A),
                  side: const BorderSide(color: Color(0xFFCBD5E1)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => TripDetailsScreen(
                        booking: {
                          '_id': _bookingId,
                          'bookingCode': _bookingCode,
                          'boatName': boatName,
                          'ghatName': ghatName,
                          'dateTimeText': scheduledTimeText,
                          'fareAmount': totalAmount,
                          'passengers': passengers,
                          'passengersText': '$passengers Passengers',
                          'status': 'CONFIRMED',
                          'tripType': tripType,
                          'paymentMode': paymentMethod,
                          'transactionId': transactionId,
                          'driverName': 'Ram Manjhi',
                          'driverPhone': '+91 98765 43220',
                          'boatNumber': 'UPB-1024',
                        },
                      ),
                    ),
                  );
                },
                child: const Text(
                  'View Trip Details & Itinerary',
                  style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700),
                ),
              ),

              const SizedBox(height: 8),

              // 3. Return to Home
              TextButton(
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const HomeScreen()),
                    (route) => false,
                  );
                },
                child: const Text(
                  'Return to Home',
                  style: TextStyle(fontSize: 13.5, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                ),
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReceiptRow({
    required String label,
    required String value,
    bool isBold = false,
    bool canCopy = false,
    BuildContext? context,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
        ),
        Row(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isBold ? FontWeight.w800 : FontWeight.w600,
                color: isBold ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
              ),
            ),
            if (canCopy && context != null) ...[
              const SizedBox(width: 6),
              GestureDetector(
                onTap: () {
                  Clipboard.setData(ClipboardData(text: value));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('$label copied to clipboard'),
                      duration: const Duration(seconds: 2),
                      backgroundColor: const Color(0xFF10B981),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                },
                child: const Icon(Icons.copy, size: 14, color: Color(0xFF94A3B8)),
              ),
            ],
          ],
        ),
      ],
    );
  }
}
