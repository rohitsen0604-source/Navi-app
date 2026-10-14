import 'package:flutter/material.dart';

class BookingCalendarScreen extends StatefulWidget {
  final DateTime initialDate;
  final int maxAdvanceDays; // 1 month (30 days)

  const BookingCalendarScreen({
    super.key,
    required this.initialDate,
    this.maxAdvanceDays = 30,
  });

  @override
  State<BookingCalendarScreen> createState() => _BookingCalendarScreenState();
}

class _BookingCalendarScreenState extends State<BookingCalendarScreen> {
  late DateTime _selectedDate;
  late DateTime _displayedMonth;
  late DateTime _today;
  late DateTime _maxAllowedDate;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _today = DateTime(now.year, now.month, now.day);
    _selectedDate = DateTime(widget.initialDate.year, widget.initialDate.month, widget.initialDate.day);
    if (_selectedDate.isBefore(_today)) {
      _selectedDate = _today;
    }
    _displayedMonth = DateTime(_selectedDate.year, _selectedDate.month, 1);
    _maxAllowedDate = _today.add(Duration(days: widget.maxAdvanceDays));
  }

  void _previousMonth() {
    setState(() {
      _displayedMonth = DateTime(_displayedMonth.year, _displayedMonth.month - 1, 1);
    });
  }

  void _nextMonth() {
    setState(() {
      _displayedMonth = DateTime(_displayedMonth.year, _displayedMonth.month + 1, 1);
    });
  }

  bool _isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  String _getMonthName(int month) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }

  String _getDayOfWeek(int weekday) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[weekday - 1];
  }

  String _getDateBadgeText(DateTime date) {
    if (_isSameDay(date, _today)) return 'Today';
    if (_isSameDay(date, _today.add(const Duration(days: 1)))) return 'Tomorrow';
    if (_isSameDay(date, _today.add(const Duration(days: 2)))) return 'Day After';
    return '';
  }

  @override
  Widget build(BuildContext context) {
    final daysInMonth = DateUtils.getDaysInMonth(_displayedMonth.year, _displayedMonth.month);
    final firstDayOffset = DateTime(_displayedMonth.year, _displayedMonth.month, 1).weekday % 7; // Sunday = 0
    final badge = _getDateBadgeText(_selectedDate);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Select Travel Date',
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
            // 1. T+2 Policy Information Card
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1EE),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFFFD5CE)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.calendar_month_outlined, color: Color(0xFFEB4D37), size: 20),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Advance booking window: 1 Month timeline active for Varanasi Ganges waterways.',
                      style: TextStyle(
                        color: Color(0xFF0F172A),
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // 2. Month Navigation Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${_getMonthName(_displayedMonth.month)} ${_displayedMonth.year}',
                    style: const TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chevron_left, color: Color(0xFF0F172A)),
                        onPressed: _displayedMonth.isAfter(DateTime(_today.year, _today.month, 1))
                            ? _previousMonth
                            : null,
                      ),
                      IconButton(
                        icon: const Icon(Icons.chevron_right, color: Color(0xFF0F172A)),
                        onPressed: _nextMonth,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // 3. Weekday Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: const ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) {
                  return Expanded(
                    child: Center(
                      child: Text(
                        d,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 8),

            // 4. Calendar Days Grid
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: GridView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7,
                    mainAxisSpacing: 8,
                    crossAxisSpacing: 8,
                    childAspectRatio: 0.95,
                  ),
                  itemCount: 42, // 6 weeks
                  itemBuilder: (context, index) {
                    final dayIndex = index - firstDayOffset + 1;
                    if (dayIndex < 1 || dayIndex > daysInMonth) {
                      return const SizedBox.shrink();
                    }

                    final cellDate = DateTime(_displayedMonth.year, _displayedMonth.month, dayIndex);
                    final isPast = cellDate.isBefore(_today);
                    final isBeyondMax = cellDate.isAfter(_maxAllowedDate);
                    final isEnabled = !isPast && !isBeyondMax;
                    final isSelected = _isSameDay(cellDate, _selectedDate);
                    final isTodayDate = _isSameDay(cellDate, _today);

                    return GestureDetector(
                      onTap: isEnabled
                          ? () => setState(() => _selectedDate = cellDate)
                          : () {
                              if (isBeyondMax) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Advance bookings permitted up to T+2 days only.'),
                                    duration: Duration(seconds: 2),
                                    backgroundColor: Color(0xFF0F172A),
                                  ),
                                );
                              }
                            },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFFEB4D37)
                              : isTodayDate
                                  ? const Color(0xFFFFF1EE)
                                  : isEnabled
                                      ? Colors.white
                                      : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected
                                ? const Color(0xFFEB4D37)
                                : isTodayDate
                                    ? const Color(0xFFEB4D37)
                                    : isEnabled
                                        ? const Color(0xFFE2E8F0)
                                        : const Color(0xFFF1F5F9),
                            width: isSelected || isTodayDate ? 1.8 : 1.0,
                          ),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: const Color(0xFFEB4D37).withValues(alpha: 0.3),
                                    blurRadius: 8,
                                    offset: const Offset(0, 3),
                                  )
                                ]
                              : null,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '$dayIndex',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: isSelected || isTodayDate ? FontWeight.w800 : FontWeight.w600,
                                color: isSelected
                                    ? Colors.white
                                    : isEnabled
                                        ? const Color(0xFF0F172A)
                                        : const Color(0xFFCBD5E1),
                              ),
                            ),
                            if (isTodayDate && !isSelected)
                              Container(
                                margin: const EdgeInsets.only(top: 2),
                                width: 4,
                                height: 4,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFEB4D37),
                                  shape: BoxShape.circle,
                                ),
                              ),
                            if (isBeyondMax)
                              const Padding(
                                padding: EdgeInsets.only(top: 1),
                                child: Icon(Icons.lock_outline, size: 10, color: Color(0xFFCBD5E1)),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

            // 5. Selected Date Summary Footer
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Selected Date',
                            style: TextStyle(
                              fontSize: 12,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Text(
                                '${_getDayOfWeek(_selectedDate.weekday)}, ${_selectedDate.day} ${_getMonthName(_selectedDate.month)} ${_selectedDate.year}',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              if (badge.isNotEmpty) ...[
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFFF1EE),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    badge,
                                    style: const TextStyle(
                                      color: Color(0xFFEB4D37),
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
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
                    onPressed: () {
                      Navigator.pop(context, _selectedDate);
                    },
                    child: const Text(
                      'Confirm Travel Date',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.2,
                      ),
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
}
