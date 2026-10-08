import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'available_boats_screen.dart';

class HomeScreen extends StatefulWidget {
  final int initialZoneNumber;
  final String? initialRiverId;

  const HomeScreen({
    super.key,
    this.initialZoneNumber = 1,
    this.initialRiverId,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentBottomNavIndex = 0;

  // Booking Form State
  int _seats = 2;
  String _selectedTripType = 'FULL_TRIP';
  String _selectedCategory = 'MOTOR_BOAT';
  int _selectedZoneNumber = 1;
  String? _selectedGhatId;
  String? _selectedGhatName;
  
  List<dynamic> _ghats = [];
  List<dynamic> _myRides = [];
  bool _loading = true;

  final List<Map<String, String>> _heroSlides = [
    {
      'title': 'Subah-e-Banaras\nBoat Tour',
      'subtitle': 'Experience peaceful sunrise and evening\nMaha Aarti across holy ghats',
      'image': 'assets/images/home_hero_banner.jpg',
    },
    {
      'title': 'Sacred Evening\nGanga Maha Aarti',
      'subtitle': 'Reserve Bajra VIP front-row seating\nat Dashashwamedh Ghat',
      'image': 'assets/images/river_assi.jpg',
    },
    {
      'title': 'Explore 84 Ghats\nHeritage Corridor',
      'subtitle': 'Book verified motor boats and bajras\nwith live GPS safety tracking',
      'image': 'assets/images/river_ganga.jpg',
    },
  ];
  int _currentSlideIndex = 0;

  @override
  void initState() {
    super.initState();
    _selectedZoneNumber = widget.initialZoneNumber;
    _loadMasterData();
  }

  void _loadMasterData() async {
    setState(() => _loading = true);
    try {
      final ghats = await ApiService.getGhats(_selectedZoneNumber);
      final rides = await ApiService.getMyRides();

      if (mounted) {
        setState(() {
          _ghats = ghats;
          _myRides = rides;
          if (ghats.isNotEmpty) {
            _selectedGhatId = ghats[0]['_id'];
            _selectedGhatName = ghats[0]['name'];
          }
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  int _calculateFare() {
    int base = 350;
    if (_selectedCategory == 'LUXURY_BAJRA') base = 1200;
    if (_selectedCategory == 'MOTOR_BOAT') base = 500;
    if (_selectedCategory == 'SPEED_BOAT') base = 800;
    if (_selectedCategory == 'EV_BOAT') base = 650;
    if (_selectedCategory == 'MANUAL_ROW_BOAT') base = 300;

    if (_selectedTripType == 'FULL_TRIP') base = (base * 1.8).round();
    if (_selectedTripType == 'EVENT') base = base * 3;
    if (_selectedTripType == 'CROSS_GHAT') base = (base * 0.6).round();

    return base + (_seats * 60);
  }

  String _getTripTypeTitle(String type) {
    switch (type) {
      case 'FULL_TRIP':
        return 'Full Trip (2:00 hrs)';
      case 'HALF_TRIP':
        return 'Half Trip (1:00 hr)';
      case 'CROSS_GHAT':
        return 'Cross Ghat (15 mins)';
      case 'EVENT':
        return 'Maha Aarti (3:00 hrs)';
      default:
        return 'Full Trip (2:00 hrs)';
    }
  }

  String _getBoatCategoryTitle(String cat) {
    switch (cat) {
      case 'MOTOR_BOAT':
        return 'Motor Boat';
      case 'LUXURY_BAJRA':
        return 'Luxury Bajra';
      case 'MANUAL_ROW_BOAT':
        return 'Row Boat';
      case 'SPEED_BOAT':
        return 'Speed Boat';
      case 'EV_BOAT':
        return 'EV Solar Boat';
      default:
        return 'Motor Boat';
    }
  }

  void _showTripTypeSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        final types = [
          {'id': 'FULL_TRIP', 'label': 'Full Trip (2:00 hrs)', 'desc': 'Grand tour across all major 84 Ghats corridor'},
          {'id': 'HALF_TRIP', 'label': 'Half Trip (1:00 hr)', 'desc': 'Sunrise or sunset serenity tour'},
          {'id': 'CROSS_GHAT', 'label': 'Cross Ghat (15 mins)', 'desc': 'Direct point-to-point river crossing'},
          {'id': 'EVENT', 'label': 'Maha Aarti Special (3:00 hrs)', 'desc': 'Prime front-row evening Aarti viewing'},
        ];

        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Select Trip Type',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 16),
                ...types.map((t) {
                  final isSel = _selectedTripType == t['id'];
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(
                        color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
                        width: isSel ? 1.8 : 1.0,
                      ),
                    ),
                    tileColor: isSel ? const Color(0xFFFFF1EE) : Colors.white,
                    leading: Icon(
                      Icons.timer_outlined,
                      color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF64748B),
                    ),
                    title: Text(
                      t['label']!,
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                      ),
                    ),
                    subtitle: Text(t['desc']!, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    trailing: isSel
                        ? const Icon(Icons.check_circle, color: Color(0xFFEB4D37))
                        : const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
                    onTap: () {
                      setState(() => _selectedTripType = t['id']!);
                      Navigator.pop(ctx);
                    },
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showBoatTypeSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        final boats = [
          {'id': 'MOTOR_BOAT', 'label': 'Motor Boat', 'desc': 'High-power reliable motor boat • 10 Pax', 'icon': Icons.directions_boat},
          {'id': 'LUXURY_BAJRA', 'label': 'Luxury Bajra', 'desc': 'Two-deck heritage lounge vessel • 25 Pax', 'icon': Icons.sailing},
          {'id': 'MANUAL_ROW_BOAT', 'label': 'Row Boat (Hand Rowed)', 'desc': 'Silent traditional wooden rowing boat • 4 Pax', 'icon': Icons.kayaking},
          {'id': 'SPEED_BOAT', 'label': 'Speed Boat', 'desc': 'High adrenaline fast river craft • 6 Pax', 'icon': Icons.speed},
          {'id': 'EV_BOAT', 'label': 'EV Solar Boat', 'desc': 'Eco-friendly clean zero-emission vessel • 12 Pax', 'icon': Icons.electric_bolt},
        ];

        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Select Boat Category',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 16),
                ...boats.map((b) {
                  final isSel = _selectedCategory == b['id'];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
                          width: isSel ? 1.8 : 1.0,
                        ),
                      ),
                      tileColor: isSel ? const Color(0xFFFFF1EE) : Colors.white,
                      leading: Icon(
                        b['icon'] as IconData,
                        color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF64748B),
                      ),
                      title: Text(
                        b['label'] as String,
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                        ),
                      ),
                      subtitle: Text(b['desc'] as String, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      trailing: isSel
                          ? const Icon(Icons.check_circle, color: Color(0xFFEB4D37))
                          : const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
                      onTap: () {
                        setState(() => _selectedCategory = b['id'] as String);
                        Navigator.pop(ctx);
                      },
                    ),
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showGhatSelector() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Select Boarding Point / Ghat',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 16),
                ..._ghats.map((g) {
                  final isSel = _selectedGhatId == g['_id'];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
                          width: isSel ? 1.8 : 1.0,
                        ),
                      ),
                      tileColor: isSel ? const Color(0xFFFFF1EE) : Colors.white,
                      leading: Icon(
                        Icons.pin_drop,
                        color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF64748B),
                      ),
                      title: Text(
                        '${g['name'] ?? "Ghat"} ${g['isPopular'] == true ? "⭐" : ""}',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                        ),
                      ),
                      subtitle: Text(
                        'Zone $_selectedZoneNumber corridor boarding',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      ),
                      trailing: isSel
                          ? const Icon(Icons.check_circle, color: Color(0xFFEB4D37))
                          : const Icon(Icons.chevron_right, color: Color(0xFF94A3B8)),
                      onTap: () {
                        setState(() {
                          _selectedGhatId = g['_id'];
                          _selectedGhatName = g['name'];
                        });
                        Navigator.pop(ctx);
                      },
                    ),
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  void _handleBooking(String bookingType) {
    if (_selectedGhatId == null && _ghats.isNotEmpty) {
      _selectedGhatId = _ghats[0]['_id'];
      _selectedGhatName = _ghats[0]['name'];
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => AvailableBoatsScreen(
          zoneNumber: _selectedZoneNumber,
          ghatName: _selectedGhatName ?? 'Dashashwamedh Ghat',
          ghatId: _selectedGhatId ?? 'g1',
          passengers: _seats,
          tripType: _selectedTripType,
          bookingType: bookingType,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFFEB4D37)),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: _buildCurrentTab(),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: Colors.grey.shade200)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentBottomNavIndex,
          onTap: (idx) => setState(() => _currentBottomNavIndex = idx),
          backgroundColor: Colors.white,
          selectedItemColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
          unselectedItemColor: const Color(0xFF94A3B8),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 12),
          type: BottomNavigationBarType.fixed,
          elevation: 0,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.receipt_long_rounded),
              label: 'My Rides',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.local_offer_outlined),
              label: 'Offers',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline_rounded),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentTab() {
    switch (_currentBottomNavIndex) {
      case 0:
        return _buildHomeTab();
      case 1:
        return _buildMyRidesTab();
      case 2:
        return _buildOffersTab();
      case 3:
        return _buildProfileTab();
      default:
        return _buildHomeTab();
    }
  }

  // TAB 1: Main Home / Booking Options Screen
  Widget _buildHomeTab() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Top Bar Header (Naavi Logo + Notification Bell + Avatar)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Left: Naavi Brand Title with Boat mark
              Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEB4D37),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    padding: const EdgeInsets.all(6),
                    child: Image.asset(
                      'assets/images/naavi_logo.png',
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) => const Icon(Icons.directions_boat, color: Colors.white, size: 22),
                    ),
                  ),
                  const SizedBox(width: 10),
                  const Text(
                    'Naavi',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.5,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                ],
              ),

              // Right: Notification Bell + User Avatar
              Row(
                children: [
                  IconButton(
                    icon: Stack(
                      children: [
                        const Icon(Icons.notifications_none_rounded, color: Color(0xFF0F172A), size: 26),
                        Positioned(
                          right: 0,
                          top: 0,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Color(0xFFEB4D37),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ],
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('No new notifications')),
                      );
                    },
                  ),
                  const SizedBox(width: 4),
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFFFFF1EE),
                      border: Border.all(color: const Color(0xFFFFD5CE), width: 1.5),
                    ),
                    child: const Icon(Icons.person, color: Color(0xFFEB4D37), size: 22),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 18),

          // 2. Hero Carousel Banner Card
          Container(
            height: 156,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.08),
                  blurRadius: 14,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Image
                  Image.asset(
                    _heroSlides[_currentSlideIndex]['image']!,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(color: const Color(0xFF1E293B)),
                  ),

                  // Gradient Dark Overlay for contrast
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                        colors: [
                          Colors.black.withValues(alpha: 0.78),
                          Colors.black.withValues(alpha: 0.40),
                          Colors.transparent,
                        ],
                        stops: const [0.0, 0.65, 1.0],
                      ),
                    ),
                  ),

                  // Overlay Content
                  Padding(
                    padding: const EdgeInsets.all(18.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _heroSlides[_currentSlideIndex]['title']!,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16.5,
                            height: 1.25,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.2,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          _heroSlides[_currentSlideIndex]['subtitle']!,
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.90),
                            fontSize: 11.5,
                            fontWeight: FontWeight.w400,
                            height: 1.3,
                          ),
                        ),
                        const Spacer(),

                        // Slide Pill Indicators
                        Row(
                          children: List.generate(_heroSlides.length, (idx) {
                            final isSel = idx == _currentSlideIndex;
                            return GestureDetector(
                              onTap: () => setState(() => _currentSlideIndex = idx),
                              child: Container(
                                margin: const EdgeInsets.only(right: 6),
                                width: isSel ? 22 : 6,
                                height: 4,
                                decoration: BoxDecoration(
                                  color: isSel ? Colors.white : Colors.white54,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          // 3. "Book Your Ride" Form Card
          Container(
            padding: const EdgeInsets.all(20),
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
                  'Book Your Ride',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.3,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 18),

                // Row 1: Number of Seats
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.groups_outlined, color: Color(0xFF0F172A), size: 22),
                        SizedBox(width: 12),
                        Text(
                          'Number of Seats',
                          style: TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),

                    // Stepper (- 2 +)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          InkWell(
                            onTap: _seats > 1 ? () => setState(() => _seats--) : null,
                            borderRadius: BorderRadius.circular(10),
                            child: Padding(
                              padding: const EdgeInsets.all(4.0),
                              child: Icon(
                                Icons.remove,
                                size: 18,
                                color: _seats > 1 ? const Color(0xFF0F172A) : Colors.grey.shade400,
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 14),
                            child: Text(
                              '$_seats',
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                          ),
                          InkWell(
                            onTap: _seats < 25 ? () => setState(() => _seats++) : null,
                            borderRadius: BorderRadius.circular(10),
                            child: const Padding(
                              padding: EdgeInsets.all(4.0),
                              child: Icon(
                                Icons.add,
                                size: 18,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12.0),
                  child: Divider(color: Color(0xFFF1F5F9), height: 1),
                ),

                // Row 2: Trip Type
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.track_changes_outlined, color: Color(0xFF0F172A), size: 22),
                        SizedBox(width: 12),
                        Text(
                          'Trip Type',
                          style: TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),

                    InkWell(
                      onTap: _showTripTypeSelector,
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          children: [
                            Text(
                              _getTripTypeTitle(_selectedTripType),
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Icon(Icons.chevron_right, size: 18, color: Color(0xFF64748B)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12.0),
                  child: Divider(color: Color(0xFFF1F5F9), height: 1),
                ),

                // Row 3: Boat Type
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.directions_boat_outlined, color: Color(0xFF0F172A), size: 22),
                        SizedBox(width: 12),
                        Text(
                          'Boat Type',
                          style: TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),

                    InkWell(
                      onTap: _showBoatTypeSelector,
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          children: [
                            Text(
                              _getBoatCategoryTitle(_selectedCategory),
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Icon(Icons.chevron_right, size: 18, color: Color(0xFF64748B)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // 4. Boarding Ghat & Fare Preview Pill
          InkWell(
            onTap: _showGhatSelector,
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1EE), // Warm Sunrise tint
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFFD5CE)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.location_on, color: Color(0xFFEB4D37), size: 16),
                            const SizedBox(width: 4),
                            Text(
                              'Boarding: ${_selectedGhatName ?? "Assi Ghat"} (Zone $_selectedZoneNumber)',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(Icons.keyboard_arrow_down, color: Color(0xFFEB4D37), size: 16),
                          ],
                        ),
                        const SizedBox(height: 3),
                        const Text(
                          'Pay After Ride (Cash / UPI on Ghat)',
                          style: TextStyle(fontSize: 11, color: Color(0xFF10B981), fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '₹${_calculateFare()}',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFFEB4D37),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          // 5. Action Buttons (Book Later & Book Now)
          Row(
            children: [
              // Book Later Button (Outlined)
              Expanded(
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.calendar_month_outlined, size: 18, color: Color(0xFFEB4D37)),
                  label: const Text(
                    'Book Later',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFEB4D37),
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: Color(0xFFEB4D37), width: 1.5),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: () => _handleBooking('BOOK_LATER'),
                ),
              ),

              const SizedBox(width: 12),

              // Book Now Button (Solid Sunrise Coral Red)
              Expanded(
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.bolt, size: 20, color: Colors.white),
                  label: const Text(
                    'Book Now',
                    style: TextStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.2,
                      color: Colors.white,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size.fromHeight(52),
                    backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: () => _handleBooking('BOOK_NOW'),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),
        ],
      ),
    );
  }

  // TAB 2: My Rides / Ride History
  Widget _buildMyRidesTab() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'My Bookings & Rides',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 16),
          if (_myRides.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Column(
                children: [
                  Icon(Icons.directions_boat_outlined, size: 48, color: Color(0xFF94A3B8)),
                  SizedBox(height: 12),
                  Text('No boat rides yet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  SizedBox(height: 4),
                  Text('Your completed and upcoming boat tours will appear here', style: TextStyle(color: Color(0xFF64748B), fontSize: 13), textAlign: TextAlign.center),
                ],
              ),
            )
          else
            ..._myRides.map((ride) {
              return Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 8, offset: const Offset(0, 2)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Ref: ${ride['bookingCode'] ?? "NV-RIDE"}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF1EE),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            (ride['status'] ?? 'COMPLETED').toString().replaceAll('_', ' '),
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFEB4D37)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${ride['boardingPointId']?['name'] ?? "Assi Ghat"} • ${ride['boatCategory']?.toString().replaceAll('_', ' ') ?? "Motor Boat"}',
                      style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('₹${ride['fareAmount'] ?? 950}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Color(0xFFEB4D37))),
                        TextButton(
                          onPressed: () {},
                          child: const Text('View Ticket', style: TextStyle(color: Color(0xFFEB4D37), fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  // TAB 3: Offers & Promo Codes
  Widget _buildOffersTab() {
    final offers = [
      {'code': 'BANARAS10', 'title': '10% OFF Morning Subah-e-Banaras', 'desc': 'Valid on Assi Ghat early morning boat trips'},
      {'code': 'AARTI20', 'title': '₹100 Cashback on Evening Aarti Bajra', 'desc': 'Valid on bookings above ₹1000'},
      {'code': 'FIRSTNAAVI', 'title': 'Flat ₹50 OFF for New Passengers', 'desc': 'Auto-applied on your first river journey'},
    ];

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Special River Offers & Discounts',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 16),
          ...offers.map((offer) {
            return Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFFFD5CE)),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 8),
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
                    child: const Icon(Icons.local_offer, color: Color(0xFFEB4D37), size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(offer['title']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A))),
                        const SizedBox(height: 2),
                        Text(offer['desc']!, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text('CODE: ${offer['code']}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8, color: Color(0xFF0F172A))),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // TAB 4: Profile & Safety Settings
  Widget _buildProfileTab() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Profile Header Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                Container(
                  width: 58,
                  height: 58,
                  decoration: const BoxDecoration(
                    color: Color(0xFFFFF1EE),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.person, color: Color(0xFFEB4D37), size: 34),
                ),
                const SizedBox(width: 16),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Rahul Sharma', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      SizedBox(height: 2),
                      Text('+91 98765 43210', style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
                      Text('rahul.sharma@gmail.com', style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Action Tiles
          _buildSettingsTile(icon: Icons.shield_outlined, title: 'Emergency SOS & Safety Guidelines', onTap: () {}),
          _buildSettingsTile(icon: Icons.language_outlined, title: 'Language (Hindi / English)', onTap: () {}),
          _buildSettingsTile(icon: Icons.help_outline_rounded, title: 'Ghat Support & 24/7 Helpline', onTap: () {}),
          _buildSettingsTile(icon: Icons.privacy_tip_outlined, title: 'Terms of Service & Privacy Policy', onTap: () {}),
        ],
      ),
    );
  }

  Widget _buildSettingsTile({required IconData icon, required String title, required VoidCallback onTap}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: ListTile(
        leading: Icon(icon, color: const Color(0xFFEB4D37), size: 22),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF0F172A))),
        trailing: const Icon(Icons.chevron_right, size: 20, color: Color(0xFF94A3B8)),
        onTap: onTap,
      ),
    );
  }
}
