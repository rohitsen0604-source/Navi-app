import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'home_screen.dart';

class LocationZoneScreen extends StatefulWidget {
  const LocationZoneScreen({super.key});

  @override
  State<LocationZoneScreen> createState() => _LocationZoneScreenState();
}

class _LocationZoneScreenState extends State<LocationZoneScreen> {
  final TextEditingController _searchController = TextEditingController();
  
  List<dynamic> _rivers = [];
  List<dynamic> _zones = [];
  bool _loading = true;

  String _selectedRiverId = 'rl1';
  int _selectedZoneNumber = 1;
  String _selectedLocationText = 'Varanasi, Uttar Pradesh';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _loadData() async {
    setState(() => _loading = true);
    try {
      final rivers = await ApiService.getRiverLakes();
      final zones = await ApiService.getZones(riverLakeId: _selectedRiverId);
      if (mounted) {
        setState(() {
          _rivers = rivers;
          _zones = zones;
          if (rivers.isNotEmpty && _selectedRiverId.isEmpty) {
            _selectedRiverId = rivers[0]['_id'] ?? 'rl1';
          }
          if (zones.isNotEmpty) {
            _selectedZoneNumber = zones[0]['zoneNumber'] ?? 1;
          }
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _onRiverSelected(String riverId, String riverCity, String riverName) async {
    setState(() {
      _selectedRiverId = riverId;
      _selectedLocationText = '$riverCity, Uttar Pradesh';
    });
    try {
      final zones = await ApiService.getZones(riverLakeId: riverId);
      if (mounted && zones.isNotEmpty) {
        setState(() {
          _zones = zones;
          _selectedZoneNumber = zones[0]['zoneNumber'] ?? 1;
        });
      }
    } catch (_) {}
  }

  void _handleContinue() {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (_) => HomeScreen(
          initialZoneNumber: _selectedZoneNumber,
          initialRiverId: _selectedRiverId,
        ),
      ),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final searchQuery = _searchController.text.trim().toLowerCase();
    final filteredRivers = _rivers.where((r) {
      final name = (r['name'] ?? '').toString().toLowerCase();
      final city = (r['city'] ?? '').toString().toLowerCase();
      return name.contains(searchQuery) || city.contains(searchQuery);
    }).toList();

    final filteredZones = _zones.where((z) {
      final name = (z['name'] ?? '').toString().toLowerCase();
      final ghat = (z['primaryGhat'] ?? '').toString().toLowerCase();
      return name.contains(searchQuery) || ghat.contains(searchQuery);
    }).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: _loading
            ? const Center(
                child: CircularProgressIndicator(
                  color: Color(0xFFEB4D37),
                ),
              )
            : Column(
                children: [
                  // Main Scrollable Body
                  Expanded(
                    child: SingleChildScrollView(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const SizedBox(height: 12),

                          // 1. Top Header with Back Button & Location Card
                          Row(
                            children: [
                              GestureDetector(
                                onTap: () {
                                  if (Navigator.canPop(context)) {
                                    Navigator.pop(context);
                                  }
                                },
                                child: Container(
                                  width: 42,
                                  height: 42,
                                  margin: const EdgeInsets.only(right: 12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF8FAFC),
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(color: const Color(0xFFE2E8F0)),
                                  ),
                                  child: const Icon(Icons.arrow_back, color: Color(0xFF0F172A), size: 20),
                                ),
                              ),
                              Expanded(
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF8FAFC),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: const Color(0xFFE2E8F0)),
                                  ),
                                  child: Row(
                                    children: [
                                Container(
                                  width: 36,
                                  height: 36,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFFF1EE),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: const Color(0xFFFFD5CE)),
                                  ),
                                  child: const Icon(
                                    Icons.location_on,
                                    color: Color(0xFFEB4D37),
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Your Location',
                                        style: TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w500,
                                          color: Color(0xFF64748B),
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        _selectedLocationText,
                                        style: const TextStyle(
                                          fontSize: 14.5,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFF0F172A),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const Icon(
                                  Icons.keyboard_arrow_down_rounded,
                                  color: Color(0xFF64748B),
                                  size: 24,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                          const SizedBox(height: 16),

                          // 2. Search Bar
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFE2E8F0)),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.search,
                                  color: Color(0xFF94A3B8),
                                  size: 22,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: TextField(
                                    controller: _searchController,
                                    onChanged: (_) => setState(() {}),
                                    style: const TextStyle(
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF0F172A),
                                    ),
                                    decoration: const InputDecoration(
                                      border: InputBorder.none,
                                      hintText: 'Search river, lake or location',
                                      hintStyle: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w400,
                                        color: Color(0xFF94A3B8),
                                      ),
                                    ),
                                  ),
                                ),
                                if (_searchController.text.isNotEmpty)
                                  GestureDetector(
                                    onTap: () {
                                      _searchController.clear();
                                      setState(() {});
                                    },
                                    child: const Icon(Icons.close, size: 18, color: Color(0xFF94A3B8)),
                                  ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 24),

                          // 3. Section: "Select River / Lake"
                          const Text(
                            'Select River / Lake',
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.3,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Horizontal River / Lake Cards
                          SizedBox(
                            height: 165,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              physics: const BouncingScrollPhysics(),
                              itemCount: filteredRivers.length,
                              separatorBuilder: (context, index) => const SizedBox(width: 14),
                              itemBuilder: (context, index) {
                                final river = filteredRivers[index];
                                final isSelected = river['_id'] == _selectedRiverId;

                                return GestureDetector(
                                  onTap: () => _onRiverSelected(
                                    river['_id'],
                                    river['city'] ?? 'Varanasi',
                                    river['name'] ?? 'Ganga River',
                                  ),
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    width: 132,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(18),
                                      border: Border.all(
                                        color: isSelected
                                            ? const Color(0xFFEB4D37)
                                            : const Color(0xFFE2E8F0),
                                        width: isSelected ? 2.2 : 1.2,
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: isSelected
                                              ? const Color(0xFFEB4D37).withValues(alpha: 0.18)
                                              : Colors.black.withValues(alpha: 0.03),
                                          blurRadius: 10,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: Stack(
                                        fit: StackFit.expand,
                                        children: [
                                          // Background Image with Safe Fallback
                                          Image.asset(
                                            river['image'] ?? 'assets/images/river_ganga.jpg',
                                            fit: BoxFit.cover,
                                            errorBuilder: (context, error, stackTrace) {
                                              return Container(
                                                color: const Color(0xFF334155),
                                                child: const Icon(Icons.water, color: Colors.white54, size: 36),
                                              );
                                            },
                                          ),

                                          // Gradient Overlay
                                          Container(
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                begin: Alignment.topCenter,
                                                end: Alignment.bottomCenter,
                                                colors: isSelected
                                                    ? [
                                                        Colors.transparent,
                                                        Colors.black.withValues(alpha: 0.20),
                                                        const Color(0xFFEB4D37).withValues(alpha: 0.88),
                                                        const Color(0xFFEB4D37),
                                                      ]
                                                    : [
                                                        Colors.transparent,
                                                        Colors.transparent,
                                                        Colors.black.withValues(alpha: 0.65),
                                                        Colors.black.withValues(alpha: 0.88),
                                                      ],
                                                stops: const [0.0, 0.38, 0.72, 1.0],
                                              ),
                                            ),
                                          ),

                                          // Checkmark Badge (Top Right)
                                          if (isSelected)
                                            Positioned(
                                              top: 8,
                                              right: 8,
                                              child: Container(
                                                width: 22,
                                                height: 22,
                                                decoration: BoxDecoration(
                                                  color: const Color(0xFFEB4D37),
                                                  shape: BoxShape.circle,
                                                  border: Border.all(color: Colors.white, width: 1.8),
                                                ),
                                                child: const Icon(
                                                  Icons.check,
                                                  color: Colors.white,
                                                  size: 13,
                                                ),
                                              ),
                                            ),

                                          // River Name & City (Bottom)
                                          Positioned(
                                            bottom: 12,
                                            left: 10,
                                            right: 10,
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Text(
                                                  river['name'] ?? '',
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 13.5,
                                                    fontWeight: FontWeight.w700,
                                                    letterSpacing: -0.2,
                                                  ),
                                                ),
                                                const SizedBox(height: 2),
                                                Text(
                                                  river['city'] ?? '',
                                                  maxLines: 1,
                                                  overflow: TextOverflow.ellipsis,
                                                  style: TextStyle(
                                                    color: Colors.white.withValues(alpha: 0.90),
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),

                          const SizedBox(height: 28),

                          // 4. Section: "Select Zone"
                          const Text(
                            'Select Zone',
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.3,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Horizontal Zone Selector Cards with Images & Indicators
                          SizedBox(
                            height: 74,
                            child: ListView.separated(
                              scrollDirection: Axis.horizontal,
                              physics: const BouncingScrollPhysics(),
                              itemCount: filteredZones.length,
                              separatorBuilder: (context, index) => const SizedBox(width: 12),
                              itemBuilder: (context, index) {
                                final zone = filteredZones[index];
                                final isSelected = zone['zoneNumber'] == _selectedZoneNumber;
                                final zoneImg = zone['image'] ?? 'assets/images/zone_dashashwamedh.jpg';

                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedZoneNumber = zone['zoneNumber'];
                                    });
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                    decoration: BoxDecoration(
                                      color: isSelected
                                          ? const Color(0xFFFFF1EE)
                                          : const Color(0xFFF8FAFC),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isSelected
                                            ? const Color(0xFFEB4D37)
                                            : const Color(0xFFE2E8F0),
                                        width: isSelected ? 1.8 : 1.2,
                                      ),
                                      boxShadow: [
                                        if (isSelected)
                                          BoxShadow(
                                            color: const Color(0xFFEB4D37).withValues(alpha: 0.12),
                                            blurRadius: 8,
                                            offset: const Offset(0, 2),
                                          ),
                                      ],
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        // Circular Image Avatar for Zone
                                        Container(
                                          width: 38,
                                          height: 38,
                                          decoration: BoxDecoration(
                                            shape: BoxShape.circle,
                                            border: Border.all(
                                              color: isSelected ? const Color(0xFFEB4D37) : Colors.white,
                                              width: 1.8,
                                            ),
                                          ),
                                          child: ClipOval(
                                            child: Image.asset(
                                              zoneImg,
                                              fit: BoxFit.cover,
                                              errorBuilder: (context, error, stackTrace) {
                                                return Container(
                                                  color: const Color(0xFFE2E8F0),
                                                  child: const Icon(Icons.place, size: 20, color: Color(0xFF64748B)),
                                                );
                                              },
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 10),

                                        // Zone Details
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text(
                                              'Zone ${zone['zoneNumber']}',
                                              style: TextStyle(
                                                fontSize: 13.5,
                                                fontWeight: FontWeight.w700,
                                                color: isSelected
                                                    ? const Color(0xFFEB4D37)
                                                    : const Color(0xFF0F172A),
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              zone['primaryGhat'] ?? '',
                                              style: TextStyle(
                                                fontSize: 11.5,
                                                fontWeight: FontWeight.w500,
                                                color: isSelected
                                                    ? const Color(0xFFEB4D37).withValues(alpha: 0.85)
                                                    : const Color(0xFF64748B),
                                              ),
                                            ),
                                          ],
                                        ),

                                        const SizedBox(width: 8),

                                        // Circular Selector Indicator
                                        Container(
                                          width: 22,
                                          height: 22,
                                          decoration: BoxDecoration(
                                            shape: BoxShape.circle,
                                            color: isSelected
                                                ? const Color(0xFFEB4D37)
                                                : Colors.transparent,
                                            border: Border.all(
                                              color: isSelected
                                                  ? const Color(0xFFEB4D37)
                                                  : const Color(0xFF94A3B8),
                                              width: 1.5,
                                            ),
                                          ),
                                          child: Center(
                                            child: isSelected
                                                ? const Icon(
                                                    Icons.check,
                                                    color: Colors.white,
                                                    size: 13,
                                                  )
                                                : Container(
                                                    width: 6,
                                                    height: 6,
                                                    decoration: const BoxDecoration(
                                                      shape: BoxShape.circle,
                                                      color: Color(0xFF94A3B8),
                                                    ),
                                                  ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),

                          const SizedBox(height: 20),
                        ],
                      ),
                    ),
                  ),

                  // 5. Solid "Continue" Action Button
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(52),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      onPressed: _handleContinue,
                      child: const Text(
                        'Continue',
                        style: TextStyle(
                          fontSize: 16.5,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ),
                  ),

                  // 6. Bottom Scenic Varanasi Boat Artwork (Exact OTP-Style Footer)
                  Stack(
                    alignment: Alignment.topCenter,
                    children: [
                      SizedBox(
                        height: 130,
                        width: double.infinity,
                        child: Image.asset(
                          'assets/images/location_footer_bg.jpg',
                          fit: BoxFit.cover,
                          alignment: Alignment.center,
                          errorBuilder: (context, error, stackTrace) {
                            return const SizedBox.shrink();
                          },
                        ),
                      ),
                      // Top Feather Gradient to seamlessly blend with the white container above
                      Container(
                        height: 35,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.white,
                              Colors.white.withValues(alpha: 0.0),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
      ),
    );
  }
}
