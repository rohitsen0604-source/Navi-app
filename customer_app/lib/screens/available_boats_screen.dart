import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'booking_summary_screen.dart';

class AvailableBoatsScreen extends StatefulWidget {
  final int zoneNumber;
  final String ghatName;
  final String? ghatId;
  final int passengers;
  final String tripType;
  final String bookingType;

  const AvailableBoatsScreen({
    super.key,
    this.zoneNumber = 1,
    this.ghatName = 'Dashashwamedh Ghat',
    this.ghatId,
    this.passengers = 2,
    this.tripType = 'FULL_TRIP',
    this.bookingType = 'BOOK_NOW',
  });

  @override
  State<AvailableBoatsScreen> createState() => _AvailableBoatsScreenState();
}

class _AvailableBoatsScreenState extends State<AvailableBoatsScreen> {
  String _selectedFilter = 'All';
  List<dynamic> _boats = [];
  bool _loading = true;

  final List<String> _filters = ['All', 'Row Boat', 'Motor Boat', 'Premium'];

  late int _currentZone;
  late String _currentGhat;
  late int _currentPassengers;

  @override
  void initState() {
    super.initState();
    _currentZone = widget.zoneNumber;
    _currentGhat = widget.ghatName;
    _currentPassengers = widget.passengers;
    _fetchBoats();
  }

  Future<void> _fetchBoats() async {
    setState(() => _loading = true);
    try {
      final data = await ApiService.getAvailableBoats(
        zoneNumber: _currentZone,
        tag: _selectedFilter,
      );
      if (mounted) {
        setState(() {
          _boats = data;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _onFilterSelected(String filter) {
    if (_selectedFilter == filter) return;
    setState(() => _selectedFilter = filter);
    _fetchBoats();
  }

  void _showChangeDetailsModal() {
    int tempSeats = _currentPassengers;
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Change Passengers & Zone',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Passengers', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove, size: 18),
                                onPressed: tempSeats > 1 ? () => setModalState(() => tempSeats--) : null,
                              ),
                              Text('$tempSeats', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                              IconButton(
                                icon: const Icon(Icons.add, size: 18),
                                onPressed: tempSeats < 20 ? () => setModalState(() => tempSeats++) : null,
                              ),
                            ],
                          ),
                        ),
                      ],
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
                        setState(() {
                          _currentPassengers = tempSeats;
                        });
                        Navigator.pop(ctx);
                        _fetchBoats();
                      },
                      child: const Text('Apply Changes', style: TextStyle(fontWeight: FontWeight.bold)),
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

  void _handleSelectBoat(Map<String, dynamic> boat) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => BookingSummaryScreen(
          selectedBoat: boat,
          zoneNumber: _currentZone,
          ghatName: _currentGhat,
          ghatId: widget.ghatId ?? 'g1',
          passengers: _currentPassengers,
          tripType: widget.tripType,
          bookingType: widget.bookingType,
          scheduledTimeText: 'Today, 25 Feb 2026  |  02:00 PM',
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Available Boats',
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
            // Subheader: Zone & Ghat info + Change button
            Container(
              color: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Zone $_currentZone - $_currentGhat',
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Today, 25 Feb 2026   |   $_currentPassengers Passengers',
                          style: const TextStyle(
                            fontSize: 12.5,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  InkWell(
                    onTap: _showChangeDetailsModal,
                    borderRadius: BorderRadius.circular(8),
                    child: const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: Text(
                        'Change',
                        style: TextStyle(
                          color: Color(0xFFEB4D37), // Sunrise Coral Red
                          fontWeight: FontWeight.w700,
                          fontSize: 13.5,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const Divider(height: 1, color: Color(0xFFE2E8F0)),

            // Filter Chips Bar
            Container(
              color: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                child: Row(
                  children: _filters.map((f) {
                    final isSel = _selectedFilter == f;
                    return Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: GestureDetector(
                        onTap: () => _onFilterSelected(f),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
                            ),
                          ),
                          child: Text(
                            f,
                            style: TextStyle(
                              color: isSel ? Colors.white : const Color(0xFF475569),
                              fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            const SizedBox(height: 10),

            // Boat Cards List
            Expanded(
              child: _loading
                  ? const Center(
                      child: CircularProgressIndicator(color: Color(0xFFEB4D37)),
                    )
                  : _boats.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.directions_boat_outlined, size: 54, color: Colors.grey.shade400),
                              const SizedBox(height: 12),
                              const Text(
                                'No boats available in this category',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          physics: const BouncingScrollPhysics(),
                          itemCount: _boats.length,
                          separatorBuilder: (_, index) => const SizedBox(height: 14),
                          itemBuilder: (ctx, index) {
                            final boat = _boats[index];

                            return Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.03),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  // Left: Unique Boat Image
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(14),
                                    child: Image.asset(
                                      boat['image'] ?? 'assets/images/boat_row.jpg',
                                      width: 96,
                                      height: 96,
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) => Container(
                                        width: 96,
                                        height: 96,
                                        color: const Color(0xFFFFF1EE),
                                        child: const Icon(Icons.directions_boat, color: Color(0xFFEB4D37), size: 36),
                                      ),
                                    ),
                                  ),

                                  const SizedBox(width: 14),

                                  // Middle: Boat Details
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          boat['name'] ?? 'Boat',
                                          style: const TextStyle(
                                            fontSize: 15.5,
                                            fontWeight: FontWeight.w800,
                                            color: Color(0xFF0F172A),
                                            letterSpacing: -0.2,
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        Row(
                                          children: [
                                            const Icon(Icons.people_outline, size: 15, color: Color(0xFF64748B)),
                                            const SizedBox(width: 5),
                                            Text(
                                              boat['passengersText'] ?? 'Up to ${boat['capacity'] ?? 4} passengers',
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Color(0xFF64748B),
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 4),
                                        Row(
                                          children: [
                                            const Icon(Icons.access_time, size: 15, color: Color(0xFF64748B)),
                                            const SizedBox(width: 5),
                                            Text(
                                              boat['durationText'] ?? 'Full Trip (2 hrs)',
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Color(0xFF64748B),
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),

                                  const SizedBox(width: 10),

                                  // Right: Price and Select Button
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        '₹${boat['price'] ?? 800}',
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w900,
                                          color: Color(0xFF0F172A),
                                        ),
                                      ),
                                      const SizedBox(height: 10),
                                      SizedBox(
                                        width: 84,
                                        height: 38,
                                        child: ElevatedButton(
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                                            foregroundColor: Colors.white,
                                            elevation: 0,
                                            padding: EdgeInsets.zero,
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                          ),
                                          onPressed: () => _handleSelectBoat(boat),
                                          child: const Text(
                                            'Select',
                                            style: TextStyle(
                                              fontSize: 13.5,
                                              fontWeight: FontWeight.w800,
                                              letterSpacing: 0.2,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}
