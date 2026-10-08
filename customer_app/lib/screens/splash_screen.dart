import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  Timer? _autoSlideTimer;

  final List<Map<String, String>> _slides = [
    {
      'title': 'Discover the Beauty\nfrom the Water',
      'subtitle': 'Rivers and lakes like never before',
    },
    {
      'title': 'Sacred Ganges Aarti\n& Heritage Ghats',
      'subtitle': 'Experience Varanasi from a calm perspective',
    },
    {
      'title': 'Instant Ghat Booking\nwith Verified Boatmen',
      'subtitle': 'Safe, transparent fares & instant confirmation',
    },
  ];

  @override
  void initState() {
    super.initState();
    _autoSlideTimer = Timer.periodic(const Duration(milliseconds: 3500), (timer) {
      if (_currentPage < _slides.length - 1) {
        _currentPage++;
      } else {
        _currentPage = 0;
      }
      if (_pageController.hasClients) {
        _pageController.animateToPage(
          _currentPage,
          duration: const Duration(milliseconds: 600),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _autoSlideTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _navigateToLogin() {
    _autoSlideTimer?.cancel();
    Navigator.pushReplacement(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => const LoginScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 500),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ));

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 0. Base Fallback Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
              ),
            ),
          ),

          // 1. Panoramic Varanasi Sunrise Wallpaper
          Image.asset(
            'assets/images/varanasi_splash_bg.jpg',
            fit: BoxFit.cover,
          ),

          // 2. High-Contrast Vignette Overlays for Maximum Legibility
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.black.withValues(alpha: 0.42),
                  Colors.black.withValues(alpha: 0.10),
                  Colors.transparent,
                  Colors.black.withValues(alpha: 0.55),
                  Colors.black.withValues(alpha: 0.88),
                ],
                stops: const [0.0, 0.20, 0.45, 0.74, 1.0],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),

          // 3. Foreground Content
          SafeArea(
            child: Column(
              children: [
                const SizedBox(height: 36),

                // Top: Circular Badge containing naavi_logo.png
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFFEB4D37), // Naavi Signature Coral Red
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.35),
                        blurRadius: 20,
                        offset: const Offset(0, 6),
                      )
                    ],
                    border: Border.all(color: Colors.white, width: 3.5),
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      'assets/images/naavi_logo.png',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // Tagline Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.40),
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.28),
                      width: 1.0,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.20),
                        blurRadius: 10,
                      )
                    ],
                  ),
                  child: const Text(
                    'RIVER & LAKE BOAT BOOKING',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2.2,
                      color: Colors.white,
                    ),
                  ),
                ),

                const Spacer(),

                // Bottom Carousel: Title & Subtitle with Crisp Pure White Harmony
                SizedBox(
                  height: 140,
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (index) {
                      setState(() => _currentPage = index);
                    },
                    itemCount: _slides.length,
                    itemBuilder: (context, index) {
                      final slide = _slides[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 28),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              slide['title']!,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 27,
                                height: 1.25,
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.3,
                                shadows: [
                                  Shadow(
                                    color: Colors.black87,
                                    offset: Offset(0, 2),
                                    blurRadius: 14,
                                  )
                                ],
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              slide['subtitle']!,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: 0.90),
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                letterSpacing: 0.2,
                                shadows: const [
                                  Shadow(
                                    color: Colors.black87,
                                    offset: Offset(0, 1),
                                    blurRadius: 10,
                                  )
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),

                const SizedBox(height: 16),

                // Pill Carousel Indicator (— • •) in Crisp White
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(_slides.length, (index) {
                    final isActive = _currentPage == index;
                    return AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      height: 4,
                      width: isActive ? 28 : 10,
                      decoration: BoxDecoration(
                        color: isActive
                            ? Colors.white
                            : Colors.white.withValues(alpha: 0.40),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    );
                  }),
                ),

                const SizedBox(height: 28),

                // "Get Started" Action Button
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 28),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF0F172A),
                      minimumSize: const Size.fromHeight(52),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 8,
                      shadowColor: Colors.black45,
                    ),
                    onPressed: _navigateToLogin,
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Get Started',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.3,
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.arrow_forward, size: 18),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
