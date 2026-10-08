import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/api_service.dart';

class ShareRideScreen extends StatefulWidget {
  final String bookingId;
  final String bookingCode;
  final String boatName;
  final String boatNumber;
  final String zoneGhatText;
  final int passengers;
  final String durationText;
  final String dateTimeText;
  final String driverName;
  final String driverPhone;

  const ShareRideScreen({
    super.key,
    this.bookingId = 'b_active_ride_demo',
    this.bookingCode = 'NV-9912',
    this.boatName = 'Motor Boat',
    this.boatNumber = 'UPB-1024',
    this.zoneGhatText = 'Zone 1 - Dashashwamedh Ghat',
    this.passengers = 2,
    this.durationText = 'Full Trip (2 hrs)',
    this.dateTimeText = 'Today, 25 Feb 2026 | 02:00 PM',
    this.driverName = 'Ramesh Yadav',
    this.driverPhone = '+91 98765 43220',
  });

  @override
  State<ShareRideScreen> createState() => _ShareRideScreenState();
}

class _ShareRideScreenState extends State<ShareRideScreen> {
  bool _loading = true;
  bool _isSharing = false;
  List<dynamic> _contacts = [];
  final Set<String> _selectedContactIds = {};
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  // Contact Dialog Controllers
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  String _selectedRelation = 'Family';

  final List<String> _relations = ['Family', 'Brother', 'Sister', 'Mom', 'Dad', 'Friend', 'Spouse', 'Other'];

  @override
  void initState() {
    super.initState();
    _loadContacts();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _loadContacts() async {
    setState(() => _loading = true);
    try {
      final contacts = await ApiService.getEmergencyContacts();
      if (mounted) {
        setState(() {
          _contacts = List.from(contacts);
          _selectedContactIds.clear();
          for (var c in _contacts) {
            if (c['selected'] == true || c['isPrimary'] == true || c['id'] == 'c1' || c['id'] == 'c2') {
              _selectedContactIds.add(c['id'].toString());
            }
          }
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  String _getTrackingUrl() {
    final cleanCode = widget.bookingCode.replaceAll('NV-', '');
    return 'https://naavi.app/ride/$cleanCode';
  }

  String _getMessagePreview() {
    final pickup = widget.zoneGhatText.contains('-')
        ? widget.zoneGhatText.split('-').last.trim()
        : widget.zoneGhatText;
    final timeStr = widget.dateTimeText.contains('|')
        ? widget.dateTimeText.split('|').last.trim()
        : '02:00 PM';

    return "I'm on a boat ride with Naavi.\n"
        "Pickup: $pickup\n"
        "Time: $timeStr | Driver: ${widget.driverName}\n"
        "Live tracking: ${_getTrackingUrl()}";
  }

  void _toggleContact(String id) {
    setState(() {
      if (_selectedContactIds.contains(id)) {
        _selectedContactIds.remove(id);
      } else {
        _selectedContactIds.add(id);
      }
    });
  }

  void _showAddNewContactDialog() {
    _nameController.clear();
    _phoneController.clear();
    _selectedRelation = 'Family';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 24,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
              ),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Add Trusted Contact',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Full Name
                  const Text('Contact Name *', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _nameController,
                    decoration: InputDecoration(
                      hintText: 'e.g., Anurag Sharma',
                      prefixIcon: const Icon(Icons.person_outline, color: Color(0xFFEB4D37)),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5)),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Phone Number
                  const Text('Mobile Phone *', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      hintText: 'e.g., 9876543210',
                      prefixIcon: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                        child: Text('+91', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      ),
                      filled: true,
                      fillColor: const Color(0xFFF8FAFC),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5)),
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Relationship Tag Chips
                  const Text('Relationship', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _relations.map((rel) {
                      final isSel = _selectedRelation == rel;
                      return ChoiceChip(
                        label: Text(rel),
                        selected: isSel,
                        selectedColor: const Color(0xFFEB4D37),
                        backgroundColor: const Color(0xFFF1F5F9),
                        labelStyle: TextStyle(
                          color: isSel ? Colors.white : const Color(0xFF334155),
                          fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                          fontSize: 12,
                        ),
                        onSelected: (val) {
                          if (val) setModalState(() => _selectedRelation = rel);
                        },
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 22),

                  // Save Button
                  SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () async {
                        final name = _nameController.text.trim();
                        final phone = _phoneController.text.trim();
                        if (name.isEmpty || phone.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Please enter name and phone number'), backgroundColor: Color(0xFFEB4D37)),
                          );
                          return;
                        }

                        final formattedPhone = phone.startsWith('+91') ? phone : '+91 $phone';
                        final formattedName = '$name ($_selectedRelation)';

                        final messenger = ScaffoldMessenger.of(context);
                        Navigator.pop(ctx);
                        final res = await ApiService.addEmergencyContact(
                          name: formattedName,
                          phone: formattedPhone,
                          relation: _selectedRelation,
                        );

                        if (!mounted) return;

                        if (res['data'] != null) {
                          final newC = res['data'];
                          setState(() {
                            _contacts.add(newC);
                            _selectedContactIds.add(newC['id'].toString());
                          });
                          messenger.showSnackBar(
                            SnackBar(
                              content: Text('Added $formattedName to trusted contacts'),
                              backgroundColor: const Color(0xFF10B981),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        }


                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEB4D37),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Save & Select Contact', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.5)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _shareRide() async {
    if (_selectedContactIds.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select at least one contact to share ride with'),
          backgroundColor: Color(0xFFEB4D37),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() => _isSharing = true);
    try {
      final res = await ApiService.shareRideDetails(
        bookingId: widget.bookingId,
        bookingCode: widget.bookingCode,
        selectedContactIds: _selectedContactIds.toList(),
        pickupGhat: widget.zoneGhatText,
        timeText: widget.dateTimeText,
        driverName: widget.driverName,
        customMessage: _getMessagePreview(),
      );

      if (mounted) {
        setState(() => _isSharing = false);
        _showShareSuccessSheet(res);
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isSharing = false);
        _showShareSuccessSheet(null);
      }
    }
  }

  void _showShareSuccessSheet(Map<String, dynamic>? result) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 68,
                height: 68,
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF1EE),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFFFD5CE), width: 2),
                ),
                child: const Icon(Icons.check_circle_rounded, color: Color(0xFFEB4D37), size: 40),
              ),
              const SizedBox(height: 16),
              const Text(
                'Ride Details Shared!',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Live river navigation tracking link has been broadcasted to ${_selectedContactIds.length} contact(s) via SMS & WhatsApp.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), height: 1.4),
              ),
              const SizedBox(height: 20),

              // Tracking Link Box
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.link, color: Color(0xFFEB4D37), size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        _getTrackingUrl(),
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.copy, size: 18, color: Color(0xFF64748B)),
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: _getMessagePreview()));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Message & tracking link copied!'),
                            backgroundColor: Color(0xFF10B981),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    Navigator.pop(context); // Return to live ride screen
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEB4D37),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Back to Live Ride', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredContacts = _contacts.where((c) {
      final name = (c['name'] ?? '').toString().toLowerCase();
      final phone = (c['phone'] ?? '').toString().toLowerCase();
      final q = _searchQuery.toLowerCase();
      return name.contains(q) || phone.contains(q);
    }).toList();

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
          'Share Ride Details',
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
                    // Subtitle Header
                    const Text(
                      'Keep your loved ones informed about your ride for added safety.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: Color(0xFF64748B),
                        height: 1.4,
                      ),
                    ),

                    const SizedBox(height: 16),

                    // 1. Boat & Ride Summary Card
                    Container(
                      padding: const EdgeInsets.all(14),
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
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.asset(
                              'assets/images/share_ride_header.jpg',
                              width: 82,
                              height: 82,
                              fit: BoxFit.cover,
                              errorBuilder: (ctx, err, stack) => Container(
                                width: 82,
                                height: 82,
                                color: const Color(0xFFFFF1EE),
                                child: const Icon(Icons.directions_boat, color: Color(0xFFEB4D37), size: 36),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  widget.boatName,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  widget.zoneGhatText,
                                  style: const TextStyle(fontSize: 12.5, color: Color(0xFF64748B)),
                                ),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    const Icon(Icons.people_outline, size: 14, color: Color(0xFF64748B)),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${widget.passengers} Passengers',
                                      style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    const Icon(Icons.location_on_outlined, size: 14, color: Color(0xFF64748B)),
                                    const SizedBox(width: 4),
                                    Text(
                                      widget.durationText,
                                      style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    const Icon(Icons.calendar_today_outlined, size: 13, color: Color(0xFF64748B)),
                                    const SizedBox(width: 4),
                                    Expanded(
                                      child: Text(
                                        widget.dateTimeText,
                                        style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 22),

                    // 2. Share with Contacts Section
                    const Text(
                      'Share with Contacts',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Search Bar
                    TextField(
                      controller: _searchController,
                      onChanged: (val) => setState(() => _searchQuery = val),
                      decoration: InputDecoration(
                        hintText: 'Search contacts...',
                        hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                        prefixIcon: const Icon(Icons.search, color: Color(0xFF94A3B8), size: 20),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5)),
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Contacts List
                    ...filteredContacts.map((c) {
                      final id = c['id'].toString();
                      final isSelected = _selectedContactIds.contains(id);
                      final name = c['name'] ?? 'Contact';
                      final phone = c['phone'] ?? '';

                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected ? const Color(0xFFEB4D37).withValues(alpha: 0.5) : const Color(0xFFE2E8F0),
                          ),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                          leading: CircleAvatar(
                            radius: 20,
                            backgroundColor: const Color(0xFFFFF1EE),
                            backgroundImage: const AssetImage('assets/images/driver_avatar.jpg'),
                            child: const Icon(Icons.person, color: Color(0xFFEB4D37), size: 20),
                          ),
                          title: Text(
                            name,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          subtitle: Text(
                            phone,
                            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                          ),
                          trailing: Transform.scale(
                            scale: 1.1,
                            child: Checkbox(
                              value: isSelected,
                              activeColor: const Color(0xFFEB4D37), // Sunrise Coral Red
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
                              side: const BorderSide(color: Color(0xFFCBD5E1), width: 1.5),
                              onChanged: (_) => _toggleContact(id),
                            ),
                          ),
                          onTap: () => _toggleContact(id),
                        ),
                      );
                    }),

                    const SizedBox(height: 8),

                    // Add New Contact Button
                    InkWell(
                      onTap: _showAddNewContactDialog,
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF1EE),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFFFD5CE)),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_circle, color: Color(0xFFEB4D37), size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Add New Contact',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFEB4D37),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 22),

                    // 3. Message Preview
                    const Text(
                      'Message Preview',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 10),

                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _getMessagePreview(),
                            style: const TextStyle(
                              fontSize: 12.5,
                              color: Color(0xFF334155),
                              height: 1.5,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // 4. Share Ride Button
                    SizedBox(
                      height: 52,
                      child: ElevatedButton.icon(
                        onPressed: _isSharing ? null : _shareRide,
                        icon: _isSharing
                            ? const SizedBox.shrink()
                            : const Icon(Icons.share, size: 20, color: Colors.white),
                        label: _isSharing
                            ? const SizedBox(
                                width: 22,
                                height: 22,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                              )
                            : const Text(
                                'Share Ride Details',
                                style: TextStyle(
                                  fontSize: 15.5,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.2,
                                ),
                              ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEB4D37), // Sunrise Coral Red
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
    );
  }
}
