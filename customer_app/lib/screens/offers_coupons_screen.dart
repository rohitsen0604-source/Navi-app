import 'package:flutter/material.dart';
import '../services/api_service.dart';

class OffersCouponsScreen extends StatefulWidget {
  final int fareAmount;
  final int zoneNumber;
  final String? appliedCoupon;

  const OffersCouponsScreen({
    super.key,
    this.fareAmount = 950,
    this.zoneNumber = 1,
    this.appliedCoupon,
  });

  @override
  State<OffersCouponsScreen> createState() => _OffersCouponsScreenState();
}

class _OffersCouponsScreenState extends State<OffersCouponsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _couponInputController = TextEditingController();
  bool _loading = true;
  bool _isApplying = false;
  List<dynamic> _coupons = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    if (widget.appliedCoupon != null) {
      _couponInputController.text = widget.appliedCoupon!;
    }
    _loadCoupons();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _couponInputController.dispose();
    super.dispose();
  }

  Future<void> _loadCoupons() async {
    setState(() => _loading = true);
    try {
      final list = await ApiService.getCoupons(
        zoneNumber: widget.zoneNumber,
        fareAmount: widget.fareAmount,
      );
      if (mounted) {
        setState(() {
          _coupons = list;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _applyCouponCode(String code) async {
    if (code.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a coupon code'),
          backgroundColor: Color(0xFFEB4D37),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() => _isApplying = true);
    final cleanCode = code.trim().toUpperCase();

    try {
      final res = await ApiService.applyCoupon(
        code: cleanCode,
        fareAmount: widget.fareAmount,
        zoneNumber: widget.zoneNumber,
      );

      if (mounted) {
        setState(() => _isApplying = false);

        if (res['success'] == true && res['data'] != null) {
          final data = res['data'];
          final discount = (data['discountAmount'] as num?)?.toInt() ?? 0;

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(res['message'] ?? 'Coupon $cleanCode applied! Saved ₹$discount'),
              backgroundColor: const Color(0xFF10B981),
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          );

          // Return result to caller screen (e.g. BookingSummaryScreen)
          Navigator.pop(context, {
            'code': cleanCode,
            'discountAmount': discount,
            'data': data,
          });
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(res['message'] ?? 'Invalid coupon code'),
              backgroundColor: const Color(0xFFDC2626),
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isApplying = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not validate coupon. Please check connection.'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
      }
    }
  }

  void _showTermsDialog(Map<String, dynamic> coupon) {
    final terms = coupon['termsAndConditions'] as List<dynamic>? ?? [
      'Valid on standard Naavi boat bookings.',
      'Discount capped at maximum offer limit.',
      'Non-transferable and cannot be clubbed with other promos.'
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(22),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Terms & Conditions (${coupon['code']})',
                    style: const TextStyle(
                      fontSize: 16.5,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Color(0xFF64748B), size: 20),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ...terms.map((t) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('• ', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFEB4D37))),
                        Expanded(
                          child: Text(
                            t.toString(),
                            style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.35),
                          ),
                        ),
                      ],
                    ),
                  )),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 46,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(ctx),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEB4D37),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Got It', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
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
          'Offers & Coupons',
          style: TextStyle(
            color: Color(0xFF0F172A),
            fontSize: 18,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
          ),
        ),
        centerTitle: true,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFEB4D37)))
          : SafeArea(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Scenic Header Banner
                    Container(
                      height: 130,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
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
                          fit: StackFit.expand,
                          children: [
                            Image.asset(
                              'assets/images/offers_header.jpg',
                              fit: BoxFit.cover,
                              errorBuilder: (ctx, err, stack) => Container(
                                color: const Color(0xFF0F172A),
                                child: const Center(
                                  child: Icon(Icons.local_offer, color: Colors.white30, size: 40),
                                ),
                              ),
                            ),
                            Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.black.withValues(alpha: 0.2),
                                    Colors.black.withValues(alpha: 0.8),
                                  ],
                                ),
                              ),
                            ),
                            Positioned(
                              left: 18,
                              right: 18,
                              bottom: 16,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFEB4D37),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: const Text(
                                      'INSTANT RIVER SAVINGS',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 0.6,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    'Special Boat Tour Promos & Discounts',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16.5,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 18),

                    // 1. Coupon Input Row
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _couponInputController,
                            textCapitalization: TextCapitalization.characters,
                            decoration: InputDecoration(
                              hintText: 'Enter coupon code',
                              hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13.5),
                              filled: true,
                              fillColor: Colors.white,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
                        ),
                        const SizedBox(width: 10),
                        SizedBox(
                          height: 50,
                          child: ElevatedButton(
                            onPressed: _isApplying ? null : () => _applyCouponCode(_couponInputController.text),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFEB4D37), // Sunrise Coral Red
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              padding: const EdgeInsets.symmetric(horizontal: 22),
                            ),
                            child: _isApplying
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                  )
                                : const Text(
                                    'Apply',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5),
                                  ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // 2. Tab Filter Buttons: Available (3) & All Coupons
                    Container(
                      height: 44,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: TabBar(
                        controller: _tabController,
                        indicator: BoxDecoration(
                          color: const Color(0xFFEB4D37), // Sunrise Coral Red
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFEB4D37).withValues(alpha: 0.3),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        labelColor: Colors.white,
                        unselectedLabelColor: const Color(0xFF64748B),
                        labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                        dividerColor: Colors.transparent,
                        indicatorSize: TabBarIndicatorSize.tab,
                        tabs: [
                          Tab(text: 'Available (${_coupons.length})'),
                          const Tab(text: 'All Coupons'),
                        ],
                      ),
                    ),

                    const SizedBox(height: 18),

                    // 3. Coupons List
                    ..._coupons.map((coupon) => _buildCouponCard(coupon)),

                    const SizedBox(height: 10),

                    // 4. More Exciting Offers Banner
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF1EE),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.card_giftcard, color: Color(0xFFEB4D37), size: 24),
                          ),
                          const SizedBox(width: 14),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'More exciting offers coming soon!',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13.5,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                SizedBox(height: 2),
                                Text(
                                  'Stay tuned for special discounts and seasonal offers.',
                                  style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B), height: 1.3),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildCouponCard(Map<String, dynamic> coupon) {
    final code = coupon['code'] ?? 'NAAVI';
    final badgeText = coupon['badgeText'] ?? 'OFFER';
    final badgeColor = coupon['badgeColor'] ?? 'GREEN';
    final isAlreadyApplied = widget.appliedCoupon == code;

    Color iconBgColor;
    Color iconColor;
    IconData cardIcon;

    if (badgeColor == 'GREEN') {
      iconBgColor = const Color(0xFFECFDF5);
      iconColor = const Color(0xFF059669);
      cardIcon = Icons.percent;
    } else if (badgeColor == 'GOLD') {
      iconBgColor = const Color(0xFFFEF3C7);
      iconColor = const Color(0xFFD97706);
      cardIcon = Icons.directions_boat_filled;
    } else {
      iconBgColor = const Color(0xFFFFF1EE);
      iconColor = const Color(0xFFEB4D37);
      cardIcon = Icons.local_offer;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isAlreadyApplied ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
          width: isAlreadyApplied ? 1.5 : 1,
        ),
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
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon Badge
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: iconBgColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(cardIcon, color: iconColor, size: 22),
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
                            code,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                              letterSpacing: 0.3,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: iconBgColor,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              badgeText,
                              style: TextStyle(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w800,
                                color: iconColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        coupon['description'] ?? '',
                        style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B), height: 1.35),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Dashed Divider & Action Row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: const BoxDecoration(
              color: Color(0xFFFAFAFA),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(18)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 13, color: Color(0xFF64748B)),
                    const SizedBox(width: 4),
                    Text(
                      coupon['validUntilText'] ?? 'Valid for limited time',
                      style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: () => _showTermsDialog(coupon),
                      child: const Text(
                        'T&C',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFEB4D37),
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  height: 34,
                  child: ElevatedButton(
                    onPressed: isAlreadyApplied ? null : () => _applyCouponCode(code),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEB4D37), // Sunrise Coral Red
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                    child: Text(
                      isAlreadyApplied ? 'Applied' : 'Apply',
                      style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
