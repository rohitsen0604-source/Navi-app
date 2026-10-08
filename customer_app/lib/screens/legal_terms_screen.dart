import 'package:flutter/material.dart';
import '../services/api_service.dart';

class LegalTermsScreen extends StatefulWidget {
  const LegalTermsScreen({super.key});

  @override
  State<LegalTermsScreen> createState() => _LegalTermsScreenState();
}

class _LegalTermsScreenState extends State<LegalTermsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _loading = true;
  Map<String, dynamic>? _legalData;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadLegalData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadLegalData() async {
    setState(() => _loading = true);
    try {
      final data = await ApiService.getLegalTerms();
      if (mounted) {
        setState(() {
          _legalData = data['data'];
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: _loading
          ? const Center(
              child: CircularProgressIndicator(color: Color(0xFFEB4D37)),
            )
          : NestedScrollView(
              headerSliverBuilder: (context, innerBoxIsScrolled) {
                return [
                  SliverAppBar(
                    expandedHeight: 210,
                    pinned: true,
                    elevation: 0,
                    backgroundColor: const Color(0xFF0F172A),
                    leading: Container(
                      margin: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        shape: BoxShape.circle,
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A), size: 20),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ),
                    flexibleSpace: FlexibleSpaceBar(
                      background: Stack(
                        fit: StackFit.expand,
                        children: [
                          Image.asset(
                            'assets/images/river_ganga.jpg',
                            fit: BoxFit.cover,
                            errorBuilder: (ctx, err, stack) => Container(
                              color: const Color(0xFF1E293B),
                              child: const Center(
                                child: Icon(Icons.gavel, color: Colors.white54, size: 60),
                              ),
                            ),
                          ),
                          Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.black.withValues(alpha: 0.35),
                                  Colors.black.withValues(alpha: 0.85),
                                ],
                              ),
                            ),
                          ),
                          Positioned(
                            left: 20,
                            right: 20,
                            bottom: 18,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEB4D37),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text(
                                    'GOVERNMENT RATIFIED & COMPLIANT',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.8,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 6),
                                const Text(
                                  'Terms of Service & Privacy',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 22,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Inland Vessels Act 2021 & Varanasi Waterway Guidelines',
                                  style: TextStyle(
                                    color: Colors.white.withValues(alpha: 0.85),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    bottom: PreferredSize(
                      preferredSize: const Size.fromHeight(48),
                      child: Container(
                        color: Colors.white,
                        child: TabBar(
                          controller: _tabController,
                          indicatorColor: const Color(0xFFEB4D37),
                          indicatorWeight: 3,
                          labelColor: const Color(0xFFEB4D37),
                          unselectedLabelColor: const Color(0xFF64748B),
                          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                          tabs: const [
                            Tab(text: 'Terms of Service'),
                            Tab(text: 'Safety Charter'),
                            Tab(text: 'Privacy Policy'),
                          ],
                        ),
                      ),
                    ),
                  ),
                ];
              },
              body: TabBarView(
                controller: _tabController,
                children: [
                  _buildTermsTab(),
                  _buildSafetyCharterTab(),
                  _buildPrivacyTab(),
                ],
              ),
            ),
    );
  }

  // TAB 1: Terms of Service
  Widget _buildTermsTab() {
    final terms = _legalData?['termsOfService'] as List<dynamic>? ?? [];

    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(18),
      children: [
        _buildInfoBanner(
          icon: Icons.verified_user_outlined,
          title: 'Official Tariffs & Fair Boat Policy',
          description: 'All rides and bajra tours are regulated according to official rates set by the Varanasi Waterways Authority.',
        ),
        const SizedBox(height: 16),
        ...terms.map((t) => _buildSectionCard(t['title'] ?? '', t['content'] ?? '')),
        const SizedBox(height: 16),
        _buildComplianceFooter(),
      ],
    );
  }

  // TAB 2: Safety & Passenger Charter
  Widget _buildSafetyCharterTab() {
    final safetyPoints = [
      {
        'title': '1. 100% Mandatory Life Jacket Policy',
        'content': 'Every passenger, regardless of swimming ability, must wear an approved Type-III PFD life jacket prior to boat departure from any ghat.',
      },
      {
        'title': '2. Vessel Capacity & Weight Distribution',
        'content': 'Row boats strictly admit up to 4 passengers, motor boats up to 8, and luxury bajras up to 12. Overloading is an offense under River Navigation laws.',
      },
      {
        'title': '3. Night Boating Curfew',
        'content': 'Night rides after 09:30 PM are prohibited unless authorized with high-visibility navigation beacons and certified river pilots.',
      },
      {
        'title': '4. Alcohol & Substance Prohibition',
        'content': 'Carrying or consuming alcohol or illegal substances on river vessels is strictly forbidden and punishable with immediate escort to Water Police.',
      },
    ];

    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(18),
      children: [
        _buildInfoBanner(
          icon: Icons.shield,
          title: 'Passenger Safety Charter',
          description: 'Zero tolerance for river safety protocol violations. Monitored 24/7 by Varanasi Water Police.',
        ),
        const SizedBox(height: 16),
        ...safetyPoints.map((s) => _buildSectionCard(s['title']!, s['content']!)),
        const SizedBox(height: 16),
        _buildComplianceFooter(),
      ],
    );
  }

  // TAB 3: Privacy Policy
  Widget _buildPrivacyTab() {
    final privacy = _legalData?['privacyPolicy'] as List<dynamic>? ?? [];

    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(18),
      children: [
        _buildInfoBanner(
          icon: Icons.lock_outline,
          title: 'Encrypted Passenger Data',
          description: 'Your personal information and GPS telemetry are safeguarded with end-to-end encryption.',
        ),
        const SizedBox(height: 16),
        ...privacy.map((p) => _buildSectionCard(p['title'] ?? '', p['content'] ?? '')),
        const SizedBox(height: 16),
        _buildComplianceFooter(),
      ],
    );
  }

  Widget _buildInfoBanner({
    required IconData icon,
    required String title,
    required String description,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF1EE),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFFD5CE)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFEB4D37).withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: const Color(0xFFEB4D37), size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 3),
                Text(
                  description,
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.35),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard(String title, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.45),
          ),
        ],
      ),
    );
  }

  Widget _buildComplianceFooter() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF1EE),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.gavel, color: Color(0xFFEB4D37), size: 20),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Varanasi Waterways Grievance Cell', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A))),
                    Text('grievance@naavi.in • Varanasi, UP', style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Last Updated: February 2026. Certified compliant with Ministry of Ports, Shipping and Waterways of India.',
            style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), height: 1.3),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
