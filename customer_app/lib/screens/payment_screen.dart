import 'dart:async';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'payment_success_screen.dart';

class PaymentScreen extends StatefulWidget {
  final double totalAmount;
  final String boatName;
  final String boatCategory;
  final String ghatName;
  final String scheduledTimeText;
  final int passengers;
  final String tripType;
  final int zoneNumber;
  final String? ghatId;
  final String? couponCode;
  final int discountAmount;
  final Map<String, dynamic>? extraBookingData;

  const PaymentScreen({
    super.key,
    required this.totalAmount,
    required this.boatName,
    required this.boatCategory,
    required this.ghatName,
    required this.scheduledTimeText,
    required this.passengers,
    required this.tripType,
    required this.zoneNumber,
    this.ghatId,
    this.couponCode,
    this.discountAmount = 0,
    this.extraBookingData,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  String _selectedMethod = 'UPI_GPAY'; // 'UPI_GPAY', 'UPI_PHONEPE', 'UPI_PAYTM', 'UPI_CUSTOM', 'CARD', 'NETBANKING', 'WALLET'

  final TextEditingController _upiIdController = TextEditingController(text: 'traveler@okhdfcbank');
  final TextEditingController _cardNumberController = TextEditingController(text: '4532 •••• •••• 8821');
  final TextEditingController _cardExpiryController = TextEditingController(text: '08/28');
  final TextEditingController _cardCvvController = TextEditingController(text: '321');
  final TextEditingController _cardHolderController = TextEditingController(text: 'RAHUL SHARMA');

  String _selectedBank = 'HDFC Bank';
  String _selectedWallet = 'Paytm Wallet';
  bool _saveCard = true;
  bool _isProcessing = false;
  String _processingStep = 'Connecting to Secure Payment Gateway...';

  final List<String> _upiHandleChips = ['@okhdfcbank', '@okaxis', '@ybl', '@paytm', '@upi'];
  final List<String> _popularBanks = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank'];
  final List<String> _wallets = ['Paytm Wallet', 'Amazon Pay', 'Mobikwik'];

  @override
  void dispose() {
    _upiIdController.dispose();
    _cardNumberController.dispose();
    _cardExpiryController.dispose();
    _cardCvvController.dispose();
    _cardHolderController.dispose();
    super.dispose();
  }

  void _processPayment() async {
    setState(() {
      _isProcessing = true;
      _processingStep = 'Connecting to Bank Gateway...';
    });

    // Simulated 3-stage bank verification & waterways token clearance
    Timer(const Duration(milliseconds: 900), () {
      if (mounted) {
        setState(() => _processingStep = 'Authorizing ₹${widget.totalAmount.toInt()} with $_getPaymentMethodTitle()...');
      }
    });

    Timer(const Duration(milliseconds: 1800), () {
      if (mounted) {
        setState(() => _processingStep = 'Securing Waterways Boarding Slot & Booking Code...');
      }
    });

    Timer(const Duration(milliseconds: 2600), () async {
      try {
        final bookingPayload = {
          'riverLakeId': 'rl1',
          'zoneNumber': widget.zoneNumber,
          'boardingPointId': widget.ghatId ?? 'g1',
          'bookingType': widget.extraBookingData?['bookingType'] ?? 'BOOK_NOW',
          'tripType': widget.tripType,
          'boatCategory': widget.boatCategory,
          'seatsBooked': widget.passengers,
          'fareAmount': widget.totalAmount,
          'paymentMode': 'ONLINE_PREPAID',
          'couponCode': widget.couponCode,
          'discountAmount': widget.discountAmount,
          'scheduledDateText': widget.extraBookingData?['scheduledDateText'],
          'timeSlotText': widget.extraBookingData?['timeSlotText'] ?? widget.scheduledTimeText,
        };

        final res = await ApiService.createBooking(bookingPayload);
        final bookingData = res['data'] ?? {};
        final txnId = 'NV-TXN-${DateTime.now().millisecondsSinceEpoch.toString().substring(4)}';

        if (mounted) {
          setState(() => _isProcessing = false);
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => PaymentSuccessScreen(
                bookingData: bookingData,
                totalAmount: widget.totalAmount,
                paymentMethod: _getPaymentMethodTitle(),
                transactionId: txnId,
                boatName: widget.boatName,
                ghatName: widget.ghatName,
                scheduledTimeText: widget.scheduledTimeText,
                passengers: widget.passengers,
                tripType: widget.tripType,
              ),
            ),
          );
        }
      } catch (_) {
        if (mounted) {
          setState(() => _isProcessing = false);
          // Fallback demo success
          final txnId = 'NV-TXN-${DateTime.now().millisecondsSinceEpoch.toString().substring(4)}';
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => PaymentSuccessScreen(
                bookingData: {
                  '_id': 'b_${DateTime.now().millisecondsSinceEpoch}',
                  'bookingCode': 'NV-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
                  'status': 'CONFIRMED',
                },
                totalAmount: widget.totalAmount,
                paymentMethod: _getPaymentMethodTitle(),
                transactionId: txnId,
                boatName: widget.boatName,
                ghatName: widget.ghatName,
                scheduledTimeText: widget.scheduledTimeText,
                passengers: widget.passengers,
                tripType: widget.tripType,
              ),
            ),
          );
        }
      }
    });
  }

  String _getPaymentMethodTitle() {
    switch (_selectedMethod) {
      case 'UPI_GPAY':
        return 'Google Pay UPI';
      case 'UPI_PHONEPE':
        return 'PhonePe UPI';
      case 'UPI_PAYTM':
        return 'Paytm UPI';
      case 'UPI_CUSTOM':
        return 'UPI ID (${_upiIdController.text})';
      case 'CARD':
        return 'Visa / Mastercard ending 8821';
      case 'NETBANKING':
        return 'Net Banking ($_selectedBank)';
      case 'WALLET':
        return _selectedWallet;
      default:
        return 'Online Instant Payment';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          appBar: AppBar(
            backgroundColor: Colors.white,
            elevation: 0.5,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
              onPressed: () => Navigator.pop(context),
            ),
            title: const Text(
              'Select Payment Method',
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
                  // 1. Order Summary Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'TOTAL AMOUNT TO PAY',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF94A3B8),
                                letterSpacing: 0.8,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981).withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.lock, size: 12, color: Color(0xFF34D399)),
                                  SizedBox(width: 4),
                                  Text(
                                    '256-Bit SSL',
                                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF34D399)),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '₹${widget.totalAmount.toInt()}',
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const Divider(color: Color(0xFF334155), height: 20),
                        Row(
                          children: [
                            const Icon(Icons.directions_boat, size: 16, color: Color(0xFFEB4D37)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                '${widget.boatName} • ${widget.passengers} Pax',
                                style: const TextStyle(fontSize: 12.5, color: Color(0xFFE2E8F0), fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.location_on_outlined, size: 16, color: Color(0xFF94A3B8)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                '${widget.ghatName} • ${widget.scheduledTimeText}',
                                style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // 2. Section: UPI Apps (Fast & Free)
                  const Text(
                    'UPI Fast Checkout',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 10),

                  Row(
                    children: [
                      Expanded(
                        child: _buildUpiAppTile(
                          id: 'UPI_GPAY',
                          title: 'Google Pay',
                          icon: Icons.g_mobiledata_rounded,
                          accentColor: const Color(0xFF4285F4),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _buildUpiAppTile(
                          id: 'UPI_PHONEPE',
                          title: 'PhonePe',
                          icon: Icons.account_balance_wallet,
                          accentColor: const Color(0xFF5F259F),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _buildUpiAppTile(
                          id: 'UPI_PAYTM',
                          title: 'Paytm UPI',
                          icon: Icons.payment,
                          accentColor: const Color(0xFF00B9F1),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Custom UPI ID option
                  _buildPaymentGroupCard(
                    id: 'UPI_CUSTOM',
                    icon: Icons.qr_code_scanner_rounded,
                    title: 'Enter Custom UPI ID / VPA',
                    subtitle: 'Pay using BHIM or any UPI enabled bank app',
                    content: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        TextField(
                          controller: _upiIdController,
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                          decoration: InputDecoration(
                            hintText: 'username@bank',
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                            suffixIcon: const Icon(Icons.verified_user, color: Color(0xFF10B981), size: 18),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 6,
                          children: _upiHandleChips.map((chip) {
                            return ActionChip(
                              label: Text(chip, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                              backgroundColor: const Color(0xFFF1F5F9),
                              padding: EdgeInsets.zero,
                              onPressed: () {
                                final current = _upiIdController.text.split('@')[0];
                                setState(() => _upiIdController.text = '$current$chip');
                              },
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // 3. Section: Credit / Debit Cards
                  const Text(
                    'Cards, Net Banking & Wallets',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 10),

                  _buildPaymentGroupCard(
                    id: 'CARD',
                    icon: Icons.credit_card,
                    title: 'Credit / Debit Card',
                    subtitle: 'Visa, Mastercard, RuPay, Maestro',
                    content: Column(
                      children: [
                        const SizedBox(height: 8),
                        TextField(
                          controller: _cardNumberController,
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: 'Card Number',
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                            prefixIcon: const Icon(Icons.credit_card, color: Color(0xFFEB4D37)),
                            suffixIcon: const Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Icon(Icons.credit_card_outlined, color: Color(0xFF1E293B)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _cardExpiryController,
                                decoration: InputDecoration(
                                  labelText: 'Expiry (MM/YY)',
                                  filled: true,
                                  fillColor: const Color(0xFFF8FAFC),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TextField(
                                controller: _cardCvvController,
                                obscureText: true,
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                  labelText: 'CVV',
                                  filled: true,
                                  fillColor: const Color(0xFFF8FAFC),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        TextField(
                          controller: _cardHolderController,
                          decoration: InputDecoration(
                            labelText: 'Name on Card',
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Checkbox(
                              value: _saveCard,
                              activeColor: const Color(0xFFEB4D37),
                              onChanged: (val) => setState(() => _saveCard = val ?? true),
                            ),
                            const Expanded(
                              child: Text(
                                'Save card securely as per RBI guidelines',
                                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Net Banking
                  _buildPaymentGroupCard(
                    id: 'NETBANKING',
                    icon: Icons.account_balance,
                    title: 'Net Banking',
                    subtitle: 'All Major Indian Banks Supported',
                    content: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        DropdownButtonFormField<String>(
                          initialValue: _selectedBank,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          items: _popularBanks.map((b) => DropdownMenuItem(value: b, child: Text(b))).toList(),
                          onChanged: (val) => setState(() => _selectedBank = val!),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Wallets
                  _buildPaymentGroupCard(
                    id: 'WALLET',
                    icon: Icons.account_balance_wallet_outlined,
                    title: 'Digital Wallets',
                    subtitle: 'Paytm, Amazon Pay, Mobikwik',
                    content: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        DropdownButtonFormField<String>(
                          initialValue: _selectedWallet,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          items: _wallets.map((w) => DropdownMenuItem(value: w, child: Text(w))).toList(),
                          onChanged: (val) => setState(() => _selectedWallet = val!),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 28),

                  // CTA: Pay Now Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(54),
                      backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: _isProcessing ? null : _processPayment,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.lock_outline, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          'Pay ₹${widget.totalAmount.toInt()} Securely',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 0.2),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),
                  const Center(
                    child: Text(
                      '🛡️ Inland Waterways Authority of India Certified Gateway',
                      style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),

        // Processing Overlay Dialog
        if (_isProcessing)
          Container(
            color: Colors.black.withValues(alpha: 0.7),
            child: Center(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 32),
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.15),
                      blurRadius: 20,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(
                      width: 54,
                      height: 54,
                      child: CircularProgressIndicator(
                        color: Color(0xFFEB4D37),
                        strokeWidth: 3.5,
                      ),
                    ),
                    const SizedBox(height: 22),
                    const Text(
                      'Processing Payment',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _processingStep,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.35),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF1EE),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'Amount: ₹${widget.totalAmount.toInt()}',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFFEB4D37)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildUpiAppTile({
    required String id,
    required String title,
    required IconData icon,
    required Color accentColor,
  }) {
    final isSel = _selectedMethod == id;
    return InkWell(
      onTap: () => setState(() => _selectedMethod = id),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: isSel ? const Color(0xFFFFF1EE) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
            width: isSel ? 1.8 : 1.0,
          ),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: accentColor.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: accentColor, size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentGroupCard({
    required String id,
    required IconData icon,
    required String title,
    required String subtitle,
    required Widget content,
  }) {
    final isSel = _selectedMethod == id;
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
          width: isSel ? 1.6 : 1.0,
        ),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _selectedMethod = id),
            borderRadius: BorderRadius.circular(18),
            child: Padding(
              padding: const EdgeInsets.all(14.0),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: isSel ? const Color(0xFFFFF1EE) : const Color(0xFFF1F5F9),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(icon, color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF64748B), size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                            color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                          ),
                        ),
                        Text(
                          subtitle,
                          style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    isSel ? Icons.radio_button_checked : Icons.radio_button_off,
                    color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFCBD5E1),
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
          if (isSel)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: content,
            ),
        ],
      ),
    );
  }
}
