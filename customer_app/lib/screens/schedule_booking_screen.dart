import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'booking_calendar_screen.dart';
import 'time_slots_screen.dart';
import 'schedule_confirmation_screen.dart';

class ScheduleBookingScreen extends StatefulWidget {
  final int initialZoneNumber;
  final String? initialGhatId;
  final String? initialGhatName;
  final String initialBoatCategory;

  const ScheduleBookingScreen({
    super.key,
    this.initialZoneNumber = 1,
    this.initialGhatId,
    this.initialGhatName,
    this.initialBoatCategory = 'MOTOR_BOAT',
  });

  @override
  State<ScheduleBookingScreen> createState() => _ScheduleBookingScreenState();
}

class _ScheduleBookingScreenState extends State<ScheduleBookingScreen> {
  late int _zoneNumber;
  String? _ghatId;
  String? _ghatName;
  late String _boatCategory;
  int _seats = 2;
  String _tripType = 'FULL_TRIP';

  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1)); // Default tomorrow
  Map<String, dynamic>? _selectedSlot;

  List<dynamic> _ghats = [];
  bool _loading = true;
  bool _calculatingFare = false;
  Map<String, dynamic>? _fareData;

  @override
  void initState() {
    super.initState();
    _zoneNumber = widget.initialZoneNumber;
    _ghatId = widget.initialGhatId;
    _ghatName = widget.initialGhatName;
    _boatCategory = widget.initialBoatCategory;

    // Default morning sunrise slot
    _selectedSlot = {
      'id': 'slot_0600',
      'time': '06:00 AM',
      'displayTime': '06:00 AM - 06:30 AM',
      'tag': 'Subah-e-Banaras Sunrise',
      'period': 'MORNING',
      'isPeak': false
    };

    _loadMasterData();
  }

  Future<void> _loadMasterData() async {
    setState(() => _loading = true);
    try {
      final ghats = await ApiService.getGhats(_zoneNumber);
      if (mounted) {
        setState(() {
          _ghats = ghats;
          if (_ghats.isNotEmpty) {
            _ghatId = _ghatId ?? _ghats[0]['_id'];
            _ghatName = _ghatName ?? _ghats[0]['name'];
          }
          _loading = false;
        });
        _fetchLiveFare();
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _fetchLiveFare() async {
    if (!mounted) return;
    setState(() => _calculatingFare = true);
    try {
      final res = await ApiService.calculateFare(
        boatCategory: _boatCategory,
        tripType: _tripType,
        seatsBooked: _seats,
        timeSlot: _selectedSlot?['displayTime'] ?? '',
      );
      if (res['success'] == true && mounted) {
        setState(() {
          _fareData = res['data'];
          _calculatingFare = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _calculatingFare = false);
    }
  }

  void _openCalendar() async {
    final result = await Navigator.push<DateTime>(
      context,
      MaterialPageRoute(
        builder: (_) => BookingCalendarScreen(initialDate: _selectedDate),
      ),
    );

    if (result != null && mounted) {
      setState(() => _selectedDate = result);
      _fetchLiveFare();
    }
  }

  void _openTimeSlots() async {
    final result = await Navigator.push<Map<String, dynamic>>(
      context,
      MaterialPageRoute(
        builder: (_) => TimeSlotsScreen(
          selectedDate: _selectedDate,
          zoneNumber: _zoneNumber,
          boatCategory: _boatCategory,
          initialSlotId: _selectedSlot?['id'],
        ),
      ),
    );

    if (result != null && mounted) {
      setState(() => _selectedSlot = result);
      _fetchLiveFare();
    }
  }

  String _formatDisplayDate(DateTime d) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = DateTime(d.year, d.month, d.day);
    final diff = target.difference(today).inDays;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    final dateStr = '${days[d.weekday - 1]}, ${d.day} ${months[d.month - 1]} ${d.year}';

    if (diff == 0) return 'Today • $dateStr';
    if (diff == 1) return 'Tomorrow • $dateStr';
    if (diff == 2) return 'Day After • $dateStr';
    return dateStr;
  }

  String _getBoatTitle(String cat) {
    switch (cat) {
      case 'MOTOR_BOAT': return 'Motor Boat';
      case 'MANUAL_ROW_BOAT': return 'Hand-Row Boat';
      case 'LUXURY_BAJRA': return 'Royal Heritage Bajra';
      case 'SPEED_BOAT': return 'VIP Speed Boat';
      case 'EV_BOAT': return 'Solar EV Eco Boat';
      default: return 'Motor Boat';
    }
  }

  String _getTripTitle(String t) {
    switch (t) {
      case 'FULL_TRIP': return 'Full Trip (2:00 hrs)';
      case 'HALF_TRIP': return 'Half Trip (1:00 hr)';
      case 'CROSS_GHAT': return 'Cross Ghat (15 mins)';
      case 'EVENT': return 'Maha Aarti (3:00 hrs)';
      default: return 'Full Trip (2:00 hrs)';
    }
  }

  void _proceedToReview() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => ScheduleConfirmationScreen(
          zoneNumber: _zoneNumber,
          ghatId: _ghatId ?? 'g1',
          ghatName: _ghatName ?? 'Dashashwamedh Ghat',
          boatCategory: _boatCategory,
          boatName: _getBoatTitle(_boatCategory),
          passengers: _seats,
          tripType: _tripType,
          selectedDate: _selectedDate,
          scheduledDateText: _formatDisplayDate(_selectedDate),
          timeSlot: _selectedSlot ?? {
            'time': '06:00 AM',
            'displayTime': '06:00 AM - 06:30 AM',
            'tag': 'Subah-e-Banaras Sunrise'
          },
          fareData: _fareData ?? {
            'baseFare': 600,
            'calculatedBoatFare': 1080,
            'passengerCharges': _seats * 60,
            'platformSafetyLevy': 50,
            'finalPayableAmount': 1080 + (_seats * 60) + 50,
          },
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
          'Schedule Boat Booking',
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
                    // 1. Operating Location Summary Banner
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
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
                            child: const Icon(Icons.location_on, color: Color(0xFFEB4D37), size: 24),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Ganges River • Varanasi',
                                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Zone $_zoneNumber • ${_ghatName ?? "Dashashwamedh Ghat"}',
                                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                ),
                              ],
                            ),
                          ),
                          TextButton(
                            onPressed: _showGhatSelector,
                            child: const Text('Change', style: TextStyle(color: Color(0xFFEB4D37), fontWeight: FontWeight.w700)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // 2. Date Selection Card (T+2 Calendar Trigger)
                    GestureDetector(
                      onTap: _openCalendar,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
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
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: const Color(0xFFEFF6FF),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Icon(Icons.calendar_month_rounded, color: Color(0xFF2563EB), size: 26),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Scheduled Date (T+2 Limit)',
                                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    _formatDisplayDate(_selectedDate),
                                    style: const TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // 3. Time Slot Selection Card (Dynamic Slot Trigger)
                    GestureDetector(
                      onTap: _openTimeSlots,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
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
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFFBEB),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Icon(Icons.access_time_filled, color: Color(0xFFD97706), size: 26),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Operating Time Slot',
                                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    _selectedSlot != null
                                        ? '${_selectedSlot!['time']} • ${_selectedSlot!['tag']}'
                                        : 'Tap to select slot',
                                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // 4. Vessel Category Selector
                    const Text(
                      'Select Vessel Category',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 10),
                    _buildBoatCategoryCards(),
                    const SizedBox(height: 16),

                    // 5. Trip Type & Seat Counter
                    Row(
                      children: [
                        // Trip Type Button
                        Expanded(
                          flex: 3,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Trip Type', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                                const SizedBox(height: 4),
                                InkWell(
                                  onTap: _showTripTypeSelector,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        _getTripTitle(_tripType),
                                        style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                      ),
                                      const Icon(Icons.arrow_drop_down, color: Color(0xFF64748B)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Seat Counter
                        Expanded(
                          flex: 2,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Column(
                              children: [
                                const Text('Passengers', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.remove_circle_outline, size: 22, color: Color(0xFF64748B)),
                                      onPressed: _seats > 1
                                          ? () {
                                              setState(() => _seats--);
                                              _fetchLiveFare();
                                            }
                                          : null,
                                    ),
                                    Text('$_seats', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                                    IconButton(
                                      icon: const Icon(Icons.add_circle_outline, size: 22, color: Color(0xFFEB4D37)),
                                      onPressed: _seats < 25
                                          ? () {
                                              setState(() => _seats++);
                                              _fetchLiveFare();
                                            }
                                          : null,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // 6. Live Server Fare Estimate Box
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Estimated Fare Breakdown', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                              if (_calculatingFare)
                                const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFFEB4D37)))
                              else
                                const Text('Official Ratified Rate', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF10B981))),
                            ],
                          ),
                          const Divider(height: 20, color: Color(0xFFF1F5F9)),
                          if (_fareData != null && _fareData!['breakdownItems'] != null)
                            ...(_fareData!['breakdownItems'] as List<dynamic>).map((item) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(vertical: 3),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(item['label'] ?? '', style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569))),
                                    Text('₹${item['amount']}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                                  ],
                                ),
                              );
                            }),
                          const Divider(height: 20, color: Color(0xFFF1F5F9)),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Total Payable Estimate', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                              Text(
                                '₹${_fareData?['finalPayableAmount'] ?? 1150}',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFFEB4D37)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // 7. Continue to Review Action Button
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEB4D37),
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(54),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                      onPressed: _proceedToReview,
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Review & Confirm Schedule', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 0.2)),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward, size: 20),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildBoatCategoryCards() {
    final categories = [
      {'id': 'MOTOR_BOAT', 'title': 'Motor Boat', 'capacity': '10 Pax', 'icon': Icons.directions_boat},
      {'id': 'MANUAL_ROW_BOAT', 'title': 'Hand-Row', 'capacity': '4 Pax', 'icon': Icons.kayaking},
      {'id': 'LUXURY_BAJRA', 'title': 'Luxury Bajra', 'capacity': '25 Pax', 'icon': Icons.sailing},
      {'id': 'EV_BOAT', 'title': 'Solar Eco', 'capacity': '12 Pax', 'icon': Icons.electric_bolt},
      {'id': 'SPEED_BOAT', 'title': 'Speed Boat', 'capacity': '6 Pax', 'icon': Icons.speed},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: categories.map((cat) {
          final isSel = _boatCategory == cat['id'];
          return GestureDetector(
            onTap: () {
              setState(() => _boatCategory = cat['id'] as String);
              _fetchLiveFare();
            },
            child: Container(
              margin: const EdgeInsets.only(right: 10),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: isSel ? const Color(0xFFFFF1EE) : Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
                  width: isSel ? 2.0 : 1.0,
                ),
              ),
              child: Row(
                children: [
                  Icon(cat['icon'] as IconData, size: 20, color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF64748B)),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        cat['title'] as String,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                          color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                        ),
                      ),
                      Text(cat['capacity'] as String, style: const TextStyle(fontSize: 10.5, color: Color(0xFF94A3B8))),
                    ],
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  void _showGhatSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Select Boarding Ghat', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
              const SizedBox(height: 14),
              ..._ghats.map((g) {
                final isSel = _ghatId == g['_id'];
                return ListTile(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  tileColor: isSel ? const Color(0xFFFFF1EE) : null,
                  leading: const Icon(Icons.pin_drop, color: Color(0xFFEB4D37)),
                  title: Text(g['name'] ?? '', style: TextStyle(fontWeight: isSel ? FontWeight.w800 : FontWeight.w600)),
                  trailing: isSel ? const Icon(Icons.check_circle, color: Color(0xFFEB4D37)) : null,
                  onTap: () {
                    setState(() {
                      _ghatId = g['_id'];
                      _ghatName = g['name'];
                    });
                    Navigator.pop(ctx);
                  },
                );
              }),
            ],
          ),
        ),
      ),
    );
  }

  void _showTripTypeSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Select Trip Duration', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
              const SizedBox(height: 14),
              ...['FULL_TRIP', 'HALF_TRIP', 'CROSS_GHAT', 'EVENT'].map((t) {
                final isSel = _tripType == t;
                return ListTile(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  tileColor: isSel ? const Color(0xFFFFF1EE) : null,
                  leading: const Icon(Icons.timer_outlined, color: Color(0xFFEB4D37)),
                  title: Text(_getTripTitle(t), style: TextStyle(fontWeight: isSel ? FontWeight.w800 : FontWeight.w600)),
                  trailing: isSel ? const Icon(Icons.check_circle, color: Color(0xFFEB4D37)) : null,
                  onTap: () {
                    setState(() => _tripType = t);
                    Navigator.pop(ctx);
                    _fetchLiveFare();
                  },
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}
