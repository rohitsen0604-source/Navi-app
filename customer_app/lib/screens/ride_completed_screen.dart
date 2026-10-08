import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'home_screen.dart';

class RideCompletedScreen extends StatefulWidget {
  final String bookingId;
  final String bookingCode;
  final String boatName;
  final String boatNumber;
  final String ghatName;
  final int zoneNumber;
  final int passengers;
  final String tripDuration;
  final String tripTimeText;
  final int baseFare;
  final int platformFee;
  final int couponDiscount;
  final int totalPaid;

  const RideCompletedScreen({
    super.key,
    required this.bookingId,
    this.bookingCode = 'NV-9912',
    this.boatName = 'Motor Boat',
    this.boatNumber = 'UPB-1024',
    this.ghatName = 'Dashashwamedh Ghat',
    this.zoneNumber = 1,
    this.passengers = 2,
    this.tripDuration = 'Full Trip (2 hrs)',
    this.tripTimeText = 'Today, 25 Feb 2026 | 02:00 PM - 04:00 PM',
    this.baseFare = 1200,
    this.platformFee = 50,
    this.couponDiscount = 100,
    this.totalPaid = 1150,
  });

  @override
  State<RideCompletedScreen> createState() => _RideCompletedScreenState();
}

class _RideCompletedScreenState extends State<RideCompletedScreen> {
  int _rating = 4; // Default 4 stars
  final Set<String> _selectedFeedbackTags = {'Great Driver'};
  final TextEditingController _feedbackController = TextEditingController();
  bool _isSubmitting = false;

  final List<String> _availableTags = [
    'Great Driver',
    'Clean Boat',
    'Safe Journey',
    'Good Service',
    'Punctual',
  ];

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  void _toggleTag(String tag) {
    setState(() {
      if (_selectedFeedbackTags.contains(tag)) {
        _selectedFeedbackTags.remove(tag);
      } else {
        _selectedFeedbackTags.add(tag);
      }
    });
  }

  void _handleDownloadInvoice() async {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
        titlePadding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        title: const Row(
          children: [
            Icon(Icons.receipt_long_rounded, color: Color(0xFFEB4D37), size: 26),
            SizedBox(width: 10),
            Text(
              'Trip Tax Invoice',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 18,
                color: Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1EE),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Invoice #: INV-${widget.bookingCode}',
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                  color: Color(0xFFEB4D37),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Date & Time: ${widget.tripTimeText}',
              style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 3),
            Text(
              'Boarding: Zone ${widget.zoneNumber} - ${widget.ghatName}',
              style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 3),
            Text(
              'Vessel: ${widget.boatName} (${widget.boatNumber})',
              style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
            ),
            const Divider(height: 22, color: Color(0xFFE2E8F0)),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Base Fare:', style: TextStyle(fontSize: 13, color: Color(0xFF475569))),
                Text('₹${widget.baseFare}', style: const TextStyle(fontWeight: FontWeight.w600)),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Platform & Safety Fee:', style: TextStyle(fontSize: 13, color: Color(0xFF475569))),
                Text('₹${widget.platformFee}', style: const TextStyle(fontWeight: FontWeight.w600)),
              ],
            ),
            if (widget.couponDiscount > 0) ...[
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Coupon Discount:', style: TextStyle(fontSize: 13, color: Color(0xFF10B981))),
                  Text('-₹${widget.couponDiscount}', style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                ],
              ),
            ],
            const Divider(height: 22, color: Color(0xFFE2E8F0)),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Total Paid (Online):',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14.5, color: Color(0xFF0F172A)),
                ),
                Text(
                  '₹${widget.totalPaid}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 17,
                    color: Color(0xFFEB4D37),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
          ],
        ),
        actionsPadding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
        actions: [
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    side: const BorderSide(color: Color(0xFFCBD5E1)),
                  ),
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Close', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.download_rounded, size: 18, color: Colors.white),
                  label: const Text('Save PDF', style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEB4D37),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Invoice downloaded successfully to your device!'),
                        backgroundColor: Color(0xFF10B981),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _handleDone() async {
    setState(() => _isSubmitting = true);

    try {
      await ApiService.rateRide(
        bookingId: widget.bookingId,
        rating: _rating,
        review: _feedbackController.text.trim(),
        feedbackTags: _selectedFeedbackTags.toList(),
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Thank you for your rating & feedback!'),
            backgroundColor: Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );

        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
          (route) => false,
        );
      }
    } catch (_) {
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
          (route) => false,
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
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
          onPressed: () {
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (_) => const HomeScreen()),
              (route) => false,
            );
          },
        ),
        title: const Text(
          'Ride Completed',
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
              // 1. Header Graphic Card with Floating Green Checkmark
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    // Scenic Sunrise Artwork with Floating Checkmark Badge
                    Stack(
                      clipBehavior: Clip.none,
                      alignment: Alignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                          child: Image.asset(
                            'assets/images/ride_completed_header.jpg',
                            height: 155,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (ctx, err, stack) => Container(
                              height: 155,
                              color: const Color(0xFFFFF1EE),
                              child: const Icon(Icons.directions_boat, size: 60, color: Color(0xFFEB4D37)),
                            ),
                          ),
                        ),

                        // Floating Green Checkmark Badge
                        Positioned(
                          bottom: -22,
                          child: Container(
                            width: 46,
                            height: 46,
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 3),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.12),
                                  blurRadius: 8,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: const Icon(Icons.check, color: Colors.white, size: 28),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 30),

                    // Heading Text
                    const Text(
                      'Ride Completed!',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                        letterSpacing: -0.3,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Thank you for riding with Naavi',
                      style: TextStyle(
                        fontSize: 13.5,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 18),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 2. Trip Details & Fare Breakdown Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Trip Details',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Boat Specs Row
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: Image.asset(
                            'assets/images/boat_motor.jpg',
                            width: 72,
                            height: 72,
                            fit: BoxFit.cover,
                            errorBuilder: (ctx, err, stack) => Container(
                              width: 72,
                              height: 72,
                              color: const Color(0xFFFFF1EE),
                              child: const Icon(Icons.directions_boat, color: Color(0xFFEB4D37)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                widget.boatName,
                                style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0F172A)),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Zone ${widget.zoneNumber} - ${widget.ghatName}',
                                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(Icons.people_outline, size: 13.5, color: Color(0xFF64748B)),
                                  const SizedBox(width: 4),
                                  Text('${widget.passengers} Passengers', style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Row(
                                children: [
                                  const Icon(Icons.timer_outlined, size: 13.5, color: Color(0xFF64748B)),
                                  const SizedBox(width: 4),
                                  Text(widget.tripDuration, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Row(
                                children: [
                                  const Icon(Icons.calendar_today_outlined, size: 12, color: Color(0xFF64748B)),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      widget.tripTimeText,
                                      style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 14),
                      child: Divider(color: Color(0xFFF1F5F9), height: 1),
                    ),

                    // Fare Breakdown
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Base Fare', style: TextStyle(fontSize: 13.5, color: Color(0xFF475569))),
                        Text('₹${widget.baseFare}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                      ],
                    ),
                    const SizedBox(height: 8),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Platform Fee', style: TextStyle(fontSize: 13.5, color: Color(0xFF475569))),
                        Text('₹${widget.platformFee}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                      ],
                    ),
                    const SizedBox(height: 8),

                    if (widget.couponDiscount > 0)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Coupon Discount', style: TextStyle(fontSize: 13.5, color: Color(0xFF10B981), fontWeight: FontWeight.w600)),
                          Text('- ₹${widget.couponDiscount}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF10B981))),
                        ],
                      ),

                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      child: Divider(color: Color(0xFFF1F5F9), height: 1),
                    ),

                    // Total Paid
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total Paid',
                          style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                        ),
                        Text(
                          '₹${widget.totalPaid}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 3. Rate Your Experience Section
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Rate Your Experience',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Interactive Star Rating Bar (5 Golden Stars)
                    Center(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(5, (index) {
                          final starNum = index + 1;
                          final isFilled = starNum <= _rating;

                          return GestureDetector(
                            onTap: () => setState(() => _rating = starNum),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 6),
                              child: Icon(
                                isFilled ? Icons.star_rounded : Icons.star_outline_rounded,
                                size: 38,
                                color: isFilled ? const Color(0xFFF59E0B) : const Color(0xFFCBD5E1),
                              ),
                            ),
                          );
                        }),
                      ),
                    ),

                    const SizedBox(height: 18),

                    // Feedback Tag Chips
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _availableTags.map((tag) {
                        final isSel = _selectedFeedbackTags.contains(tag);

                        return GestureDetector(
                          onTap: () => _toggleTag(tag),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: isSel ? const Color(0xFFFFF1EE) : const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
                                width: isSel ? 1.5 : 1.0,
                              ),
                            ),
                            child: Text(
                              tag,
                              style: TextStyle(
                                fontSize: 12.5,
                                fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                                color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF475569),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 16),

                    // Multi-line Feedback Text Input
                    TextField(
                      controller: _feedbackController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Write your feedback (optional)...',
                        hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                        filled: true,
                        fillColor: const Color(0xFFF8FAFC),
                        contentPadding: const EdgeInsets.all(14),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 4. Download Invoice Button (Outlined)
              OutlinedButton.icon(
                icon: const Icon(Icons.download_rounded, size: 20, color: Color(0xFFEB4D37)),
                label: const Text(
                  'Download Invoice',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFFEB4D37),
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  backgroundColor: Colors.white,
                  side: const BorderSide(color: Color(0xFFEB4D37), width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: _handleDownloadInvoice,
              ),

              const SizedBox(height: 12),

              // 5. Done CTA Button (Solid Sunrise Coral Red)
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(54),
                  backgroundColor: const Color(0xFFEB4D37),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: _isSubmitting ? null : _handleDone,
                child: _isSubmitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : const Text(
                        'Done',
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
}
