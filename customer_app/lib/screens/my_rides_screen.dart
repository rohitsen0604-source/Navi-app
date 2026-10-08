import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/api_service.dart';
import 'live_ride_screen.dart';

class MyRidesScreen extends StatefulWidget {
  final bool showBackButton;
  final VoidCallback? onBack;

  const MyRidesScreen({
    super.key,
    this.showBackButton = true,
    this.onBack,
  });

  @override
  State<MyRidesScreen> createState() => _MyRidesScreenState();
}

class _MyRidesScreenState extends State<MyRidesScreen> {
  String _selectedFilter = 'ALL'; // 'ALL', 'COMPLETED', 'UPCOMING', 'CANCELLED'
  bool _loading = true;
  List<dynamic> _rides = [];

  final List<Map<String, String>> _filterTabs = [
    {'id': 'ALL', 'label': 'All'},
    {'id': 'COMPLETED', 'label': 'Completed'},
    {'id': 'UPCOMING', 'label': 'Upcoming'},
    {'id': 'CANCELLED', 'label': 'Cancelled'},
  ];

  @override
  void initState() {
    super.initState();
    _loadRides();
  }

  Future<void> _loadRides() async {
    setState(() => _loading = true);
    try {
      final list = await ApiService.getMyRides(status: _selectedFilter);
      if (mounted) {
        setState(() {
          _rides = list;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _onFilterChanged(String filterId) {
    if (_selectedFilter != filterId) {
      setState(() => _selectedFilter = filterId);
      _loadRides();
    }
  }

  void _showInvoiceBottomSheet(Map<String, dynamic> ride) async {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final bookingCode = ride['bookingCode'] ?? 'NV-991201';
        final boatName = ride['boatName'] ?? 'Motor Boat';
        final ghatName = ride['ghatName'] ?? ride['boardingPointId']?['name'] ?? 'Dashashwamedh Ghat';
        final dateTime = ride['dateTimeText'] ?? '25 Feb 2026 | 02:00 PM';
        final fare = ride['fareAmount'] ?? 1150;
        final driverName = ride['driverName'] ?? 'Ramesh Yadav';
        final invoiceNo = 'INV-${bookingCode.replaceAll("NV-", "VAR-")}';

        return Container(
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
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Tax Invoice Receipt',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Ref: $invoiceNo',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Trip Summary Box
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
                        const Text('Vessel & Operator', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                        Text('$boatName • $driverName', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Boarding Ghat', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                        Text(ghatName, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Date & Time', style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B))),
                        Text(dateTime, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Fare Breakdown
              const Text('Fare Breakdown', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Base Boat Tariff', style: TextStyle(fontSize: 13, color: Color(0xFF475569))),
                  Text('₹${(fare as int) - 50}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF0F172A))),
                ],
              ),
              const SizedBox(height: 8),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Waterway Safety & Platform Fee', style: TextStyle(fontSize: 13, color: Color(0xFF475569))),
                  Text('₹50', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF0F172A))),
                ],
              ),
              const SizedBox(height: 8),
              const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('GST / Inland Tax (0% Exempt)', style: TextStyle(fontSize: 13, color: Color(0xFF475569))),
                  Text('₹0', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF0F172A))),
                ],
              ),
              const Divider(height: 24, color: Color(0xFFE2E8F0)),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Total Amount Paid', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                  Text('₹$fare', style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: Color(0xFFEB4D37))),
                ],
              ),

              const SizedBox(height: 22),

              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: 'Invoice: $invoiceNo\nBooking: $bookingCode\nTotal: ₹$fare\nGhat: $ghatName'));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Receipt details copied to clipboard!'),
                            backgroundColor: Color(0xFF10B981),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      icon: const Icon(Icons.copy, size: 16, color: Color(0xFFEB4D37)),
                      label: const Text('Copy Details', style: TextStyle(color: Color(0xFFEB4D37), fontWeight: FontWeight.bold)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFFFFD5CE)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Invoice $invoiceNo downloaded successfully!'),
                            backgroundColor: const Color(0xFF10B981),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      icon: const Icon(Icons.download, size: 18, color: Colors.white),
                      label: const Text('Download PDF', style: TextStyle(fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEB4D37),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  void _showCancellationDetailsSheet(Map<String, dynamic> ride) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final fare = ride['fareAmount'] ?? 1800;
        final reason = ride['cancellationReason'] ?? 'High river current safety advisory by Water Police';
        final bookingCode = ride['bookingCode'] ?? 'NV-180010';

        return Container(
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
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF2F2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.cancel_outlined, color: Color(0xFFDC2626), size: 22),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Cancellation Details',
                        style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Booking Reference: $bookingCode', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                    const SizedBox(height: 8),
                    const Text('Cancellation Reason:', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    const SizedBox(height: 2),
                    Text(reason, style: const TextStyle(fontSize: 13, color: Color(0xFF334155), fontWeight: FontWeight.w500)),
                  ],
                ),
              ),

              const SizedBox(height: 14),

              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle, color: Color(0xFF059669), size: 22),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('100% Refund Processed', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF065F46))),
                          Text('₹$fare refunded to original payment method.', style: const TextStyle(fontSize: 12, color: Color(0xFF047857))),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              SizedBox(
                height: 48,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(ctx),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEB4D37),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Close Details', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _navigateToActiveRide(Map<String, dynamic> ride) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => LiveRideScreen(
          bookingId: ride['_id'] ?? 'b_demo_active',
          bookingCode: ride['bookingCode'] ?? 'NV-9912',
          boatName: ride['boatName'] ?? 'Motor Boat',
          boatNumber: ride['boatNumber'] ?? 'UPB-1024',
          startGhat: ride['ghatName'] ?? 'Assi Ghat',
          destinationGhat: 'Dashashwamedh Ghat',
          passengers: ride['passengers'] ?? 2,
          tripDuration: ride['tripDuration'] ?? 'Full Trip (2 hrs)',
          startedAtText: ride['dateTimeText'] ?? 'Today, 25 Feb 2026 | 02:00 PM',
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
        elevation: 0.5,
        leading: (widget.showBackButton || widget.onBack != null || Navigator.canPop(context))
            ? IconButton(
                icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
                onPressed: () {
                  if (widget.onBack != null) {
                    widget.onBack!();
                  } else if (Navigator.canPop(context)) {
                    Navigator.pop(context);
                  }
                },
              )
            : null,
        title: const Text(
          'My Rides',
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
        child: Column(
          children: [
            // Filter Pills Bar (All, Completed, Upcoming, Cancelled)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              color: Colors.white,
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  children: _filterTabs.map((tab) {
                    final isSelected = _selectedFilter == tab['id'];
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(tab['label']!),
                        selected: isSelected,
                        selectedColor: const Color(0xFFEB4D37), // Sunrise Coral Red
                        backgroundColor: const Color(0xFFF1F5F9),
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : const Color(0xFF64748B),
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                          fontSize: 13,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                          side: BorderSide(
                            color: isSelected ? const Color(0xFFEB4D37) : Colors.transparent,
                          ),
                        ),
                        onSelected: (_) => _onFilterChanged(tab['id']!),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            // Rides List View
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator(color: Color(0xFFEB4D37)))
                  : _rides.isEmpty
                      ? _buildEmptyState()
                      : RefreshIndicator(
                          color: const Color(0xFFEB4D37),
                          onRefresh: _loadRides,
                          child: ListView.builder(
                            physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
                            padding: const EdgeInsets.all(16),
                            itemCount: _rides.length,
                            itemBuilder: (ctx, index) {
                              return _buildRideCard(_rides[index]);
                            },
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1EE),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(Icons.directions_boat_outlined, color: Color(0xFFEB4D37), size: 36),
          ),
          const SizedBox(height: 16),
          const Text(
            'No Rides Found',
            style: TextStyle(fontSize: 16.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 6),
          Text(
            _selectedFilter == 'ALL'
                ? 'You have not taken any boat rides yet.'
                : 'No ${_selectedFilter.toLowerCase()} rides in your history.',
            style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
          ),
        ],
      ),
    );
  }

  Widget _buildRideCard(Map<String, dynamic> ride) {
    final status = (ride['status'] ?? 'RIDE_COMPLETED').toString().toUpperCase();
    final isCompleted = status == 'RIDE_COMPLETED' || status == 'COMPLETED';
    final isCancelled = status == 'CANCELLED';
    final isUpcoming = !isCompleted && !isCancelled;

    final boatName = ride['boatName'] ?? (ride['boatCategory'] == 'MANUAL_ROW_BOAT' ? 'Row Boat' : ride['boatCategory'] == 'LUXURY_BAJRA' ? 'Premium Boat' : 'Motor Boat');
    final ghatName = ride['ghatName'] ?? ride['boardingPointId']?['name'] ?? 'Dashashwamedh Ghat';
    final dateTime = ride['dateTimeText'] ?? '25 Feb 2026 | 02:00 PM';
    final passengersText = ride['passengersText'] ?? '2 Passengers | Full Trip (2 hrs)';
    final fare = ride['fareAmount'] ?? 1150;
    final image = ride['boatImage'] ?? (boatName.toString().contains('Row') ? 'assets/images/boat_history_fresh.jpg' : boatName.toString().contains('Premium') ? 'assets/images/boat_premium.jpg' : 'assets/images/boat_motor_fresh.jpg');

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Boat Thumbnail
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: Image.asset(
                  image,
                  width: 76,
                  height: 76,
                  fit: BoxFit.cover,
                  errorBuilder: (ctx, err, stack) => Container(
                    width: 76,
                    height: 76,
                    color: const Color(0xFFFFF1EE),
                    child: const Icon(Icons.directions_boat, color: Color(0xFFEB4D37), size: 32),
                  ),
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
                          boatName,
                          style: const TextStyle(
                            fontSize: 15.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        // Status Badge matching screenshot
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: isCompleted
                                ? const Color(0xFFECFDF5)
                                : isCancelled
                                    ? const Color(0xFFFEF2F2)
                                    : const Color(0xFFFFF1EE),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            isCompleted
                                ? 'Completed'
                                : isCancelled
                                    ? 'Cancelled'
                                    : (isUpcoming ? 'Upcoming' : 'Active'),
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: isCompleted
                                  ? const Color(0xFF059669)
                                  : isCancelled
                                      ? const Color(0xFFDC2626)
                                      : const Color(0xFFEB4D37),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      ghatName,
                      style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      dateTime,
                      style: const TextStyle(fontSize: 11.5, color: Color(0xFF94A3B8)),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Passenger & Duration Row
          Row(
            children: [
              const Icon(Icons.people_outline, size: 14, color: Color(0xFF64748B)),
              const SizedBox(width: 4),
              Text(
                passengersText,
                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Fare & Action Button Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                '₹$fare',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                  letterSpacing: -0.2,
                ),
              ),
              if (isCompleted)
                OutlinedButton(
                  onPressed: () => _showInvoiceBottomSheet(ride),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFEB4D37)), // Sunrise Coral Red
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  child: const Text(
                    'View Invoice',
                    style: TextStyle(
                      color: Color(0xFFEB4D37),
                      fontWeight: FontWeight.bold,
                      fontSize: 12.5,
                    ),
                  ),
                )
              else if (isCancelled)
                OutlinedButton(
                  onPressed: () => _showCancellationDetailsSheet(ride),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  child: const Text(
                    'View Details',
                    style: TextStyle(
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.bold,
                      fontSize: 12.5,
                    ),
                  ),
                )
              else
                ElevatedButton(
                  onPressed: () => _navigateToActiveRide(ride),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEB4D37),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  child: const Text(
                    'Track Ride',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12.5),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
