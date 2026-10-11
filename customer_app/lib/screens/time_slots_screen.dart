import 'package:flutter/material.dart';
import '../services/api_service.dart';

class TimeSlotsScreen extends StatefulWidget {
  final DateTime selectedDate;
  final int zoneNumber;
  final String boatCategory;
  final String? initialSlotId;

  const TimeSlotsScreen({
    super.key,
    required this.selectedDate,
    this.zoneNumber = 1,
    this.boatCategory = 'MOTOR_BOAT',
    this.initialSlotId,
  });

  @override
  State<TimeSlotsScreen> createState() => _TimeSlotsScreenState();
}

class _TimeSlotsScreenState extends State<TimeSlotsScreen> {
  late DateTime _currentDate;
  bool _loading = true;
  String? _errorMessage;
  List<dynamic> _allSlots = [];
  Map<String, dynamic>? _selectedSlot;

  @override
  void initState() {
    super.initState();
    _currentDate = widget.selectedDate;
    _fetchSlots();
  }

  String _formatDate(DateTime d) {
    final y = d.year.toString().padLeft(4, '0');
    final m = d.month.toString().padLeft(2, '0');
    final day = d.day.toString().padLeft(2, '0');
    return '$y-$m-$day';
  }

  Future<void> _fetchSlots() async {
    setState(() {
      _loading = true;
      _errorMessage = null;
    });

    try {
      final res = await ApiService.getTimeSlots(
        date: _formatDate(_currentDate),
        zoneNumber: widget.zoneNumber,
        boatCategory: widget.boatCategory,
      );

      if (res['success'] == true && res['data'] != null && mounted) {
        final List<dynamic> slots = res['data']['slots'] ?? [];
        setState(() {
          _allSlots = slots;
          _loading = false;
          // Pre-select first available slot or matching initial
          if (widget.initialSlotId != null) {
            _selectedSlot = slots.firstWhere(
              (s) => s['id'] == widget.initialSlotId && s['isAvailable'] == true,
              orElse: () => slots.firstWhere((s) => s['isAvailable'] == true, orElse: () => null),
            );
          } else {
            _selectedSlot = slots.firstWhere((s) => s['isAvailable'] == true, orElse: () => null);
          }
        });
      } else if (mounted) {
        setState(() {
          _errorMessage = res['message'] ?? 'Unable to retrieve operational time slots.';
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Network error fetching time slots. Please tap retry.';
          _loading = false;
        });
      }
    }
  }

  void _onDateTabChanged(int offset) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = today.add(Duration(days: offset));
    if (target.year != _currentDate.year || target.month != _currentDate.month || target.day != _currentDate.day) {
      setState(() => _currentDate = target);
      _fetchSlots();
    }
  }

  int get _currentDateOffset {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return _currentDate.difference(today).inDays.clamp(0, 2);
  }

  Widget _buildPeriodSection(String title, String icon, List<dynamic> slots) {
    if (slots.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 18)),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            children: slots.map((s) {
              final isAvailable = s['isAvailable'] == true;
              final isPeak = s['isPeak'] == true;
              final isSelected = _selectedSlot != null && _selectedSlot!['id'] == s['id'];

              return GestureDetector(
                onTap: isAvailable
                    ? () {
                        setState(() => _selectedSlot = s);
                      }
                    : null,
                child: Container(
                  width: (MediaQuery.of(context).size.width - 42) / 2,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFFFFF1EE)
                        : isAvailable
                            ? Colors.white
                            : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected
                          ? const Color(0xFFEB4D37)
                          : isAvailable
                              ? const Color(0xFFE2E8F0)
                              : const Color(0xFFF1F5F9),
                      width: isSelected ? 2.0 : 1.0,
                    ),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: const Color(0xFFEB4D37).withValues(alpha: 0.18),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            )
                          ]
                        : null,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            s['time'] ?? '',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: isSelected
                                  ? const Color(0xFFEB4D37)
                                  : isAvailable
                                      ? const Color(0xFF0F172A)
                                      : const Color(0xFF94A3B8),
                            ),
                          ),
                          if (isSelected)
                            const Icon(Icons.check_circle, size: 18, color: Color(0xFFEB4D37))
                          else if (isPeak && isAvailable)
                            const Icon(Icons.local_fire_department, size: 16, color: Color(0xFFF59E0B))
                          else if (!isAvailable)
                            const Icon(Icons.block, size: 14, color: Color(0xFFCBD5E1)),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        s['tag'] ?? (isAvailable ? 'Available' : 'Passed'),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: isSelected
                              ? const Color(0xFFEB4D37)
                              : isAvailable
                                  ? const Color(0xFF64748B)
                                  : const Color(0xFF94A3B8),
                        ),
                      ),
                      if (isPeak && isAvailable)
                        Container(
                          margin: const EdgeInsets.only(top: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            '🔥 Peak Aarti',
                            style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final morningSlots = _allSlots.where((s) => s['period'] == 'MORNING').toList();
    final afternoonSlots = _allSlots.where((s) => s['period'] == 'AFTERNOON').toList();
    final eveningSlots = _allSlots.where((s) => s['period'] == 'EVENING').toList();

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
          'Select Time Slot',
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
            // 1. Quick Date Tabs (Today, Tomorrow, Day After)
            Container(
              color: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                children: [
                  _buildDateTab('Today', 0),
                  const SizedBox(width: 8),
                  _buildDateTab('Tomorrow', 1),
                  const SizedBox(width: 8),
                  _buildDateTab('Day After', 2),
                ],
              ),
            ),
            const Divider(height: 1, color: Color(0xFFE2E8F0)),

            // 2. Slot Groups Scrollable Body
            Expanded(
              child: _loading
                  ? const Center(
                      child: CircularProgressIndicator(color: Color(0xFFEB4D37)),
                    )
                  : _errorMessage != null
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 32),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.error_outline, size: 48, color: Color(0xFFEB4D37)),
                                const SizedBox(height: 12),
                                Text(
                                  _errorMessage!,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                                ),
                                const SizedBox(height: 16),
                                ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFFEB4D37),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                  onPressed: _fetchSlots,
                                  child: const Text('Retry'),
                                ),
                              ],
                            ),
                          ),
                        )
                      : SingleChildScrollView(
                          physics: const BouncingScrollPhysics(),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _buildPeriodSection('Morning Tours & Sunrise', '🌅', morningSlots),
                              _buildPeriodSection('Afternoon River Cruise', '☀️', afternoonSlots),
                              _buildPeriodSection('Evening & Maha Aarti', '🔥', eveningSlots),
                            ],
                          ),
                        ),
            ),

            // 3. Selection Footer
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 16,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (_selectedSlot != null) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Selected Slot',
                              style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${_selectedSlot!['time']} • ${_selectedSlot!['tag']}',
                              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                            ),
                          ],
                        ),
                        if (_selectedSlot!['isPeak'] == true)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFEF3C7),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              '+₹150 Aarti Surcharge',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                  ],
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEB4D37),
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(52),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    onPressed: _selectedSlot != null
                        ? () {
                            Navigator.pop(context, _selectedSlot);
                          }
                        : null,
                    child: const Text(
                      'Confirm Time Slot',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 0.2),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateTab(String label, int offset) {
    final isSelected = _currentDateOffset == offset;
    return Expanded(
      child: GestureDetector(
        onTap: () => _onDateTabChanged(offset),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFFFF1EE) : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? const Color(0xFFEB4D37) : Colors.transparent,
              width: 1.5,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFF64748B),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
