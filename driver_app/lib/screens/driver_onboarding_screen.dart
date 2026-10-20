import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/theme.dart';
import '../services/driver_api_service.dart';
import 'driver_login_screen.dart';

class DriverOnboardingScreen extends StatefulWidget {
  const DriverOnboardingScreen({super.key});

  @override
  State<DriverOnboardingScreen> createState() => _DriverOnboardingScreenState();
}

class _DriverOnboardingScreenState extends State<DriverOnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  // Default fallback slides matching reference screenshots & driver partner fleet
  List<Map<String, dynamic>> _slides = [
    {
      'id': 'slide_1',
      'type': 'hero',
      'titlePrefix': 'Explore',
      'highlightText': 'Rivers & Lakes',
      'titleSuffix': 'with Naavi',
      'description': 'Book boats, enjoy scenic rides and create unforgettable memories.',
      'imageAsset': 'assets/images/driver_onboarding_hero.jpg',
      'badge': 'NAAVI CAPTAIN FLEET',
    },
    {
      'id': 'slide_2',
      'type': 'how_it_works',
      'titlePrefix': 'How Naavi',
      'highlightText': 'Works?',
      'titleSuffix': '',
      'description': 'Simple steps to start earning\nwith your boat.',
      'imageAsset': 'assets/images/driver_river_waves.jpg',
      'badge': 'HOW IT WORKS',
      'steps': [
        {
          'title': '1. Register',
          'description': 'Create your profile and add boat details.',
          'icon': Icons.badge_rounded,
          'bgColor': Color(0xFFE0F2FE),
          'iconColor': Color(0xFF0284C7),
        },
        {
          'title': '2. Receive Bookings',
          'description': 'Get ride requests from nearby tourists.',
          'icon': Icons.calendar_month_rounded,
          'bgColor': Color(0xFFE0F2FE),
          'iconColor': Color(0xFF0284C7),
        },
        {
          'title': '3. Earn Money',
          'description': 'Complete rides and earn instantly.',
          'icon': Icons.monetization_on_rounded,
          'bgColor': Color(0xFFFEF3C7),
          'iconColor': Color(0xFFD97706),
        },
      ],
    },
    {
      'id': 'slide_3',
      'type': 'safe_reliable',
      'titlePrefix': 'Safe, Secure',
      'highlightText': '& Reliable',
      'titleSuffix': '',
      'description': 'Your safety and earnings\nare our priority.',
      'imageAsset': 'assets/images/driver_safe_waterway.jpg',
      'badge': 'SAFE & RELIABLE',
    },
  ];


  @override
  void initState() {
    super.initState();
    _fetchOnboardingFromBackend();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  // Backend Integration: Fetch dynamic slides and configuration
  Future<void> _fetchOnboardingFromBackend() async {
    try {
      final res = await DriverApiService.getOnboardingConfig();
      if (res['success'] == true && res['data']?['slides'] != null) {
        final List dynamicSlides = res['data']['slides'];
        if (dynamicSlides.isNotEmpty && mounted) {
          setState(() {
            _slides = List<Map<String, dynamic>>.from(dynamicSlides);
          });
        }
      }
    } catch (_) {
      // Graceful offline fallback already configured
    }
  }

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('driver_onboarding_completed', true);

    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) =>
            const DriverLoginScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 350),
      ),
    );
  }

  void _onNextPressed() {
    if (_currentPage < _slides.length - 1) {
      _pageController.animateToPage(
        _currentPage + 1,
        duration: const Duration(milliseconds: 320),
        curve: Curves.easeInOut,
      );
    } else {
      _completeOnboarding();
    }
  }

  Widget _buildStepCard({
    required IconData icon,
    required String title,
    required String description,
    required Color bgColor,
    required Color iconColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
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
          // Circular Icon Badge Container
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: bgColor,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Icon(icon, color: iconColor, size: 27),
            ),
          ),
          const SizedBox(width: 14),
          // Title and description
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                    letterSpacing: -0.2,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                    height: 1.35,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGridItem({
    required IconData icon,
    required Color bgColor,
    required Color iconColor,
    required String label,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: bgColor,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Icon(icon, color: iconColor, size: 24),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.w700,
              color: Color(0xFF0F172A),
              height: 1.25,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSafeReliableContent(Map<String, dynamic> slide) {
    return SingleChildScrollView(
      physics: const ClampingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: 6),

          // Glowing Shield Emblem with radiant accents
          Stack(
            alignment: Alignment.center,
            children: [
              // Radiance Dash Accents
              SizedBox(
                width: 110,
                height: 72,
                child: CustomPaint(
                  painter: _RadiancePainter(),
                ),
              ),
              // Blue Shield Emblem with soft glow
              Container(
                width: 58,
                height: 64,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF60A5FA), Color(0xFF2563EB)],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                    bottomLeft: Radius.circular(30),
                    bottomRight: Radius.circular(30),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF2563EB).withValues(alpha: 0.35),
                      blurRadius: 18,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.check_rounded,
                    color: Colors.white,
                    size: 34,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // Title
          const Text(
            'Safe, Secure\n& Reliable',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
              height: 1.15,
              letterSpacing: -0.6,
            ),
          ),
          const SizedBox(height: 8),

          // Subtitle
          const Text(
            'Your safety and earnings\nare our priority.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              color: Color(0xFF64748B),
              height: 1.35,
              fontWeight: FontWeight.w400,
            ),
          ),

          const SizedBox(height: 16),

          // 2x2 Feature Grid inside white rounded container
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                // Row 1: Verified Bookings | 24/7 Support
                Row(
                  children: [
                    Expanded(
                      child: _buildGridItem(
                        icon: Icons.verified_user_rounded,
                        bgColor: const Color(0xFFDCFCE7),
                        iconColor: const Color(0xFF16A34A),
                        label: 'Verified\nBookings',
                      ),
                    ),
                    Container(
                      width: 1,
                      height: 60,
                      color: const Color(0xFFF1F5F9),
                    ),
                    Expanded(
                      child: _buildGridItem(
                        icon: Icons.support_agent_rounded,
                        bgColor: const Color(0xFFFFE4E6),
                        iconColor: const Color(0xFFE11D48),
                        label: '24/7\nSupport',
                      ),
                    ),
                  ],
                ),
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  height: 1,
                  color: const Color(0xFFF1F5F9),
                ),
                // Row 2: Secure Payments | Ratings & Reviews
                Row(
                  children: [
                    Expanded(
                      child: _buildGridItem(
                        icon: Icons.credit_card_rounded,
                        bgColor: const Color(0xFFE0F2FE),
                        iconColor: const Color(0xFF0284C7),
                        label: 'Secure\nPayments',
                      ),
                    ),
                    Container(
                      width: 1,
                      height: 60,
                      color: const Color(0xFFF1F5F9),
                    ),
                    Expanded(
                      child: _buildGridItem(
                        icon: Icons.star_rounded,
                        bgColor: const Color(0xFFFEF3C7),
                        iconColor: const Color(0xFFD97706),
                        label: 'Ratings &\nReviews',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Bottom Scenic Ghat River Cruise Illustration Banner (Full Image Visible)
          Container(
            width: double.infinity,
            margin: const EdgeInsets.fromLTRB(16, 4, 16, 4),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Image.asset(
                'assets/images/driver_safe_waterway.jpg',
                width: double.infinity,
                fit: BoxFit.fitWidth,
                alignment: Alignment.center,
                errorBuilder: (context, error, stackTrace) => Container(
                  height: 130,
                  color: const Color(0xFFE0F2FE),
                  child: const Center(
                    child: Icon(Icons.directions_boat_rounded,
                        size: 44, color: Color(0xFF0284C7)),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );

  }

  Widget _buildSlideContent(Map<String, dynamic> slide, int index) {
    final String type = slide['type'] ?? (index == 1 ? 'how_it_works' : (index == 2 ? 'safe_reliable' : 'hero'));

    if (type == 'how_it_works' || index == 1) {
      // Screen 2: How Naavi Works? with 3 Step Cards and River Wave Art
      return SingleChildScrollView(
        physics: const ClampingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 6),
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                        height: 1.15,
                        letterSpacing: -0.6,
                      ),
                      children: [
                        TextSpan(text: 'How Naavi\n'),
                        TextSpan(text: 'Works?'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Simple steps to start earning\nwith your boat.',
                    style: TextStyle(
                      fontSize: 15,
                      color: Color(0xFF64748B),
                      height: 1.4,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // 3 Steps Cards Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  _buildStepCard(
                    icon: Icons.badge_rounded,
                    title: '1. Register',
                    description: 'Create your profile and add boat details.',
                    bgColor: const Color(0xFFE0F2FE),
                    iconColor: const Color(0xFF0284C7),
                  ),
                  _buildStepCard(
                    icon: Icons.calendar_month_rounded,
                    title: '2. Receive Bookings',
                    description: 'Get ride requests from nearby tourists.',
                    bgColor: const Color(0xFFE0F2FE),
                    iconColor: const Color(0xFF0284C7),
                  ),
                  _buildStepCard(
                    icon: Icons.monetization_on_rounded,
                    title: '3. Earn Money',
                    description: 'Complete rides and earn instantly.',
                    bgColor: const Color(0xFFFEF3C7),
                    iconColor: const Color(0xFFD97706),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 10),

            // Generated River Water Wave Banner Illustration
            SizedBox(
              width: double.infinity,
              height: 100,
              child: Image.asset(
                'assets/images/driver_river_waves.jpg',
                fit: BoxFit.cover,
                alignment: Alignment.center,
                errorBuilder: (context, error, stackTrace) => Container(
                  height: 60,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(0xFF38BDF8).withValues(alpha: 0.15),
                        const Color(0xFFF97316).withValues(alpha: 0.12),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    if (type == 'safe_reliable' || index == 2) {
      // Screen 3: Safe, Secure & Reliable with Shield, 2x2 Grid, and Ghat Cruise Banner
      return _buildSafeReliableContent(slide);
    }

    // Default Hero Slide (Slide 1, Slide 4)
    final String titlePrefix = slide['titlePrefix'] ?? 'Explore';
    final String highlightText = slide['highlightText'] ?? 'Rivers & Lakes';
    final String titleSuffix = slide['titleSuffix'] ?? 'with Naavi';
    final String description = slide['description'] ?? '';

    return SingleChildScrollView(
      physics: const ClampingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 8),

          // Title Header (RichText matching reference screenshot)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: TextSpan(
                    style: const TextStyle(
                      fontSize: 34,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                      height: 1.15,
                      letterSpacing: -0.6,
                    ),
                    children: [
                      TextSpan(text: '$titlePrefix\n'),
                      TextSpan(
                        text: '$highlightText\n',
                        style: TextStyle(
                          color: AppTheme.primary, // Naavi Sunrise Coral
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      TextSpan(text: titleSuffix),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Subtitle
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 15,
                    color: Color(0xFF64748B),
                    height: 1.45,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // Center Hero Illustration
          Container(
            width: double.infinity,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            height: MediaQuery.of(context).size.height * 0.44,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 18,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset(
                    'assets/images/driver_onboarding_hero.jpg',
                    fit: BoxFit.cover,
                    alignment: Alignment.center,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: const Color(0xFFE2E8F0),
                      child: Center(
                        child: Icon(
                          Icons.directions_boat_rounded,
                          size: 80,
                          color: AppTheme.primary,
                        ),
                      ),
                    ),
                  ),

                  // Gentle gradient blending at bottom
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 40,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [
                            Colors.white.withValues(alpha: 0.35),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ));

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar with "Skip" button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // App Brand Chip
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.warmLight,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.warmBorder, width: 1),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.directions_boat_rounded,
                          size: 14,
                          color: AppTheme.primary,
                        ),
                        const SizedBox(width: 5),
                        Text(
                          'NAAVI PARTNER',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.2,
                            color: AppTheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Skip Button
                  GestureDetector(
                    onTap: _completeOnboarding,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      child: Text(
                        'Skip',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Dynamic Content Section (Title & Subtitle + Hero/Step/Safe Content)
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _slides.length,
                onPageChanged: (index) {
                  setState(() => _currentPage = index);
                },
                itemBuilder: (context, index) {
                  final slide = _slides[index];
                  return _buildSlideContent(slide, index);
                },
              ),
            ),

            // Bottom White Card Container with Dots & Next Button
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(32),
                  topRight: Radius.circular(32),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 20,
                    offset: const Offset(0, -6),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Page Indicator Dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(_slides.length, (index) {
                      final bool isActive = index == _currentPage;
                      return AnimatedContainer(
                        duration: const Duration(milliseconds: 280),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        height: 6,
                        width: isActive ? 22 : 6,
                        decoration: BoxDecoration(
                          color: isActive
                              ? AppTheme.primary
                              : const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      );
                    }),
                  ),

                  const SizedBox(height: 20),

                  // Next / Get Started Action Button
                  ElevatedButton(
                    onPressed: _onNextPressed,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(54),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      elevation: 3,
                      shadowColor: AppTheme.primary.withValues(alpha: 0.35),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          _currentPage == _slides.length - 1
                              ? 'Get Started'
                              : 'Next',
                          style: const TextStyle(
                            fontSize: 16.5,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.3,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.arrow_forward_rounded, size: 20),
                      ],
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

class _RadiancePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF60A5FA)
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    // Left radiance lines
    canvas.drawLine(const Offset(18, 22), const Offset(28, 26), paint);
    canvas.drawLine(const Offset(12, 38), const Offset(24, 38), paint);

    // Right radiance lines
    canvas.drawLine(const Offset(92, 22), const Offset(82, 26), paint);
    canvas.drawLine(const Offset(98, 38), const Offset(86, 38), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
