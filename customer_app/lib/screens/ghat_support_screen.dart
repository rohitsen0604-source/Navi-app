import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/api_service.dart';

class GhatSupportScreen extends StatefulWidget {
  const GhatSupportScreen({super.key});

  @override
  State<GhatSupportScreen> createState() => _GhatSupportScreenState();
}

class _GhatSupportScreenState extends State<GhatSupportScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _loading = true;
  Map<String, dynamic>? _helplineData;
  List<dynamic> _userTickets = [];

  // Ticket Form state
  String _selectedCategory = 'GENERAL';
  final TextEditingController _bookingCodeController = TextEditingController();
  final TextEditingController _issueController = TextEditingController();
  bool _submittingTicket = false;

  final List<Map<String, String>> _categories = [
    {'id': 'GENERAL', 'label': 'General Inquiry'},
    {'id': 'BOAT_DELAY', 'label': 'Boat Delay / Schedule'},
    {'id': 'DRIVER_BEHAVIOR', 'label': 'Driver / Sailor Issue'},
    {'id': 'PAYMENT_REFUND', 'label': 'Payment & Refund'},
    {'id': 'LOST_ITEM', 'label': 'Lost & Found on Boat'},
    {'id': 'SAFETY_INQUIRY', 'label': 'Safety & Life Jackets'},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadSupportData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _bookingCodeController.dispose();
    _issueController.dispose();
    super.dispose();
  }

  Future<void> _loadSupportData() async {
    setState(() => _loading = true);
    try {
      final data = await ApiService.getHelplineInfo();
      final tickets = await ApiService.getUserTickets();
      if (mounted) {
        setState(() {
          _helplineData = data['data'];
          _userTickets = tickets;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _makeCall(String phoneNumber) {
    Clipboard.setData(ClipboardData(text: phoneNumber));
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1EE),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.phone_in_talk, color: Color(0xFFEB4D37), size: 22),
            ),
            const SizedBox(width: 12),
            const Text('Dial Helpline', style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Connecting to 24/7 Varanasi Ghat Helpline:'),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(phoneNumber, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A))),
                  const Icon(Icons.copy, size: 16, color: Color(0xFF64748B)),
                ],
              ),
            ),
            const SizedBox(height: 8),
            const Text('Phone number copied to clipboard.', style: TextStyle(fontSize: 11.5, color: Color(0xFF059669), fontWeight: FontWeight.w600)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Calling $phoneNumber...'),
                  backgroundColor: const Color(0xFFEB4D37),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEB4D37),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Call Now'),
          ),
        ],
      ),
    );
  }


  Future<void> _submitTicket() async {
    if (_issueController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please describe your issue or inquiry'),
          backgroundColor: Color(0xFFEB4D37),
        ),
      );
      return;
    }

    setState(() => _submittingTicket = true);
    try {
      final res = await ApiService.createSupportTicket(
        category: _selectedCategory,
        description: _issueController.text.trim(),
        bookingCode: _bookingCodeController.text.trim().isNotEmpty
            ? _bookingCodeController.text.trim()
            : null,
      );

      if (mounted) {
        setState(() {
          _submittingTicket = false;
          _issueController.clear();
          _bookingCodeController.clear();
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['message'] ?? 'Ticket created successfully!'),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );

        // Reload tickets list and switch to My Tickets tab
        final updatedTickets = await ApiService.getUserTickets();
        if (mounted) {
          setState(() {
            _userTickets = updatedTickets;
          });
          _tabController.animateTo(2);
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _submittingTicket = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not create ticket. Please check connection.'),
            backgroundColor: Color(0xFFEB4D37),
          ),
        );
      }
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
                    expandedHeight: 220,
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
                            'assets/images/varanasi_profile_header.jpg',
                            fit: BoxFit.cover,
                            errorBuilder: (ctx, err, stack) => Container(
                              color: const Color(0xFF1E293B),
                              child: const Center(
                                child: Icon(Icons.support_agent, color: Colors.white54, size: 60),
                              ),
                            ),
                          ),
                          // Dark gradient overlay
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
                          // Header Content
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
                                    '24/7 HELPLINE & HARBOR ASSISTANCE',
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
                                  'Ghat Support & Assistance',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 22,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Direct contact with Varanasi Water Police & Station Desks',
                                  style: TextStyle(
                                    color: Colors.white.withValues(alpha: 0.85),
                                    fontSize: 12.5,
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
                            Tab(text: 'Helplines & Desks'),
                            Tab(text: 'Raise Ticket'),
                            Tab(text: 'My Tickets'),
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
                  _buildHelplinesTab(),
                  _buildRaiseTicketTab(),
                  _buildMyTicketsTab(),
                ],
              ),
            ),
    );
  }

  // TAB 1: Helplines, Ghat Desks & FAQs
  Widget _buildHelplinesTab() {
    final hotlines = _helplineData?['hotlines'] ?? {};
    final desks = _helplineData?['ghatDesks'] as List<dynamic>? ?? [];
    final faqs = _helplineData?['faqs'] as List<dynamic>? ?? [];

    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        // Urgent Emergency Hotline Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFEB4D37), Color(0xFFD83824)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFEB4D37).withValues(alpha: 0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.phone_in_talk, color: Colors.white, size: 26),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Toll-Free River Emergency',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      hotlines['tollFree'] ?? '1800-102-NAAVI',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Available 24 hours across all Varanasi ghats',
                      style: TextStyle(color: Colors.white.withValues(alpha: 0.85), fontSize: 11),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () => _makeCall(hotlines['tollFree'] ?? '1800-102-NAAVI'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFFEB4D37),
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                ),
                child: const Text('Call', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // Quick Hotline Grid
        Row(
          children: [
            Expanded(
              child: _buildQuickActionCard(
                icon: Icons.local_police,
                title: 'Water Police',
                subtitle: hotlines['waterPolice'] ?? '+91 542 2221234',
                color: const Color(0xFF1E293B),
                onTap: () => _makeCall(hotlines['waterPolice'] ?? '+91 542 2221234'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildQuickActionCard(
                icon: Icons.chat_bubble_outline,
                title: 'WhatsApp Desk',
                subtitle: '+91 98765 00000',
                color: const Color(0xFF059669),
                onTap: () => _makeCall('+919876500000'),
              ),
            ),
          ],
        ),

        const SizedBox(height: 24),

        // Ghat Physical Assistance Desks
        const Row(
          children: [
            Icon(Icons.location_city, color: Color(0xFFEB4D37), size: 20),
            SizedBox(width: 8),
            Text(
              'Ghat Station Assistance Desks',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
          ],
        ),
        const SizedBox(height: 12),

        ...desks.map((desk) => _buildGhatDeskCard(desk)),

        const SizedBox(height: 24),

        // Frequently Asked Questions
        const Row(
          children: [
            Icon(Icons.help_outline, color: Color(0xFFEB4D37), size: 20),
            SizedBox(width: 8),
            Text(
              'Frequently Asked Questions',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
          ],
        ),
        const SizedBox(height: 12),

        ...faqs.map((faq) => _buildFaqItem(faq['q'] ?? '', faq['a'] ?? '')),

        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
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
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                Icon(Icons.arrow_forward, size: 16, color: color),
              ],
            ),
            const SizedBox(height: 10),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF0F172A))),
            const SizedBox(height: 2),
            Text(subtitle, style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
          ],
        ),
      ),
    );
  }

  Widget _buildGhatDeskCard(Map<String, dynamic> desk) {
    final services = desk['availableServices'] as List<dynamic>? ?? [];

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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  desk['ghatName'] ?? 'Ghat Station Desk',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0F172A)),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF1EE),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  desk['zone'] ?? 'Zone 1',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFEB4D37)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.place_outlined, size: 14, color: Color(0xFF64748B)),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  desk['location'] ?? '',
                  style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              const Icon(Icons.access_time, size: 14, color: Color(0xFF64748B)),
              const SizedBox(width: 4),
              Text(
                'Timings: ${desk['timing'] ?? "24 Hours"}',
                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: services.map((s) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  s.toString(),
                  style: const TextStyle(fontSize: 11, color: Color(0xFF334155), fontWeight: FontWeight.w500),
                ),
              );
            }).toList(),
          ),
          const Divider(height: 20, color: Color(0xFFF1F5F9)),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Supervisor', style: TextStyle(fontSize: 10.5, color: Color(0xFF94A3B8))),
                  Text(
                    desk['supervisor'] ?? 'Officer In-charge',
                    style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                  ),
                ],
              ),
              OutlinedButton.icon(
                onPressed: () => _makeCall(desk['phone'] ?? '+915422221101'),
                icon: const Icon(Icons.call, size: 15, color: Color(0xFFEB4D37)),
                label: const Text('Call Desk', style: TextStyle(color: Color(0xFFEB4D37), fontWeight: FontWeight.bold, fontSize: 12)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFFFFD5CE)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFaqItem(String question, String answer) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: ExpansionTile(
        title: Text(
          question,
          style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
        ),
        iconColor: const Color(0xFFEB4D37),
        collapsedIconColor: const Color(0xFF94A3B8),
        childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
        children: [
          Text(
            answer,
            style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569), height: 1.4),
          ),
        ],
      ),
    );
  }

  // TAB 2: Raise a Ticket Form
  Widget _buildRaiseTicketTab() {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF1EE),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFFFD5CE)),
          ),
          child: const Row(
            children: [
              Icon(Icons.info_outline, color: Color(0xFFEB4D37), size: 22),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Your ticket will be assigned directly to our Varanasi Ghat Operations Station for quick resolution.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF0F172A), height: 1.35),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        const Text(
          'Select Issue Category',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 10),

        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _categories.map((cat) {
            final isSelected = _selectedCategory == cat['id'];
            return ChoiceChip(
              label: Text(cat['label']!),
              selected: isSelected,
              selectedColor: const Color(0xFFEB4D37),
              backgroundColor: Colors.white,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFF0F172A),
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                fontSize: 12,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: BorderSide(
                  color: isSelected ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
                ),
              ),
              onSelected: (selected) {
                if (selected) {
                  setState(() => _selectedCategory = cat['id']!);
                }
              },
            );
          }).toList(),
        ),

        const SizedBox(height: 20),

        const Text(
          'Booking Reference Code (Optional)',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _bookingCodeController,
          decoration: InputDecoration(
            hintText: 'e.g., NV-9912',
            hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
            filled: true,
            fillColor: Colors.white,
            prefixIcon: const Icon(Icons.confirmation_number_outlined, color: Color(0xFFEB4D37), size: 20),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5)),
          ),
        ),

        const SizedBox(height: 20),

        const Text(
          'Describe Your Issue / Inquiry *',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _issueController,
          maxLines: 4,
          decoration: InputDecoration(
            hintText: 'Provide details about what happened at the ghat, trip timing, sailor feedback, or fare question...',
            hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.all(16),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5)),
          ),
        ),

        const SizedBox(height: 24),

        SizedBox(
          height: 52,
          child: ElevatedButton(
            onPressed: _submittingTicket ? null : _submitTicket,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEB4D37),
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: _submittingTicket
                ? const SizedBox(
                    width: 22,
                    height: 22,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                  )
                : const Text(
                    'Submit Ticket to Ghat Desk',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
          ),
        ),

        const SizedBox(height: 30),
      ],
    );
  }

  // TAB 3: My Tickets History
  Widget _buildMyTicketsTab() {
    if (_userTickets.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1EE),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(Icons.assignment_turned_in_outlined, color: Color(0xFFEB4D37), size: 36),
            ),
            const SizedBox(height: 16),
            const Text(
              'No Support Tickets Found',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 6),
            const Text(
              'Need assistance? Switch to the "Raise Ticket" tab',
              style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      itemCount: _userTickets.length,
      itemBuilder: (ctx, index) {
        final t = _userTickets[index];
        final status = (t['status'] ?? 'OPEN_IN_PROGRESS').toString();
        final isResolved = status == 'RESOLVED';

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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    t['ticketId'] ?? 'TKT-VAR-000',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A)),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isResolved ? const Color(0xFFECFDF5) : const Color(0xFFFFF1EE),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      isResolved ? 'RESOLVED' : 'IN PROGRESS',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isResolved ? const Color(0xFF059669) : const Color(0xFFEB4D37),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                t['categoryTitle'] ?? t['category'] ?? 'General Inquiry',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
              ),
              if (t['bookingCode'] != null && t['bookingCode'] != 'GENERAL') ...[
                const SizedBox(height: 2),
                Text(
                  'Booking Ref: ${t['bookingCode']}',
                  style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                ),
              ],
              const SizedBox(height: 8),
              Text(
                t['description'] ?? '',
                style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B), height: 1.35),
              ),
              if (t['resolutionNotes'] != null) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.check_circle, size: 16, color: Color(0xFF059669)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          t['resolutionNotes'],
                          style: const TextStyle(fontSize: 11.5, color: Color(0xFF334155), fontStyle: FontStyle.italic),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
