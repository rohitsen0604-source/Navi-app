import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'login_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _isLoading = true;
  String _userName = 'Rahul Sharma';
  String _userPhone = '+91 98765 43210';
  String _userEmail = 'rahul.sharma@gmail.com';
  bool _isEmailVerified = true;
  String _selectedLanguage = 'English';
  String _selectedTheme = 'Light';
  bool _notificationsEnabled = true;

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  void _loadProfileData() async {
    try {
      final res = await ApiService.getUserProfile();
      if (res['success'] == true && res['user'] != null && mounted) {
        final u = res['user'];
        setState(() {
          final fName = u['firstName'] ?? 'Rahul';
          final lName = u['lastName'] ?? 'Sharma';
          _userName = '$fName $lName'.trim();
          _userPhone = u['phone'] ?? '+91 98765 43210';
          _userEmail = u['email'] ?? 'rahul.sharma@gmail.com';
          _isEmailVerified = u['isEmailVerified'] ?? true;
          _selectedLanguage = u['preferredLanguage'] ?? 'English';
          _selectedTheme = u['appTheme'] ?? 'Light';
          _notificationsEnabled = u['notificationsEnabled'] ?? true;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _handleLanguageSelect() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Preferred Language',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 16),
            ...['English', 'हिंदी (Hindi)', 'বাংলা (Bengali)'].map((lang) {
              final pureLang = lang.split(' ').first;
              final isSel = _selectedLanguage == pureLang || _selectedLanguage == lang;
              return ListTile(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                tileColor: isSel ? const Color(0xFFFFF1EE) : Colors.transparent,
                title: Text(
                  lang,
                  style: TextStyle(
                    fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                    color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                  ),
                ),
                trailing: isSel ? const Icon(Icons.check_circle, color: Color(0xFFEB4D37)) : null,
                onTap: () async {
                  Navigator.pop(ctx);
                  setState(() => _selectedLanguage = pureLang);
                  await ApiService.updatePreferences(preferredLanguage: pureLang);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Language updated to $lang'), backgroundColor: const Color(0xFF10B981)),
                    );
                  }
                },
              );
            }),
          ],
        ),
      ),
    );
  }

  void _handleThemeSelect() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select App Theme',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 16),
            ...['Light', 'Dark', 'System Default'].map((theme) {
              final isSel = _selectedTheme == theme;
              return ListTile(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                tileColor: isSel ? const Color(0xFFFFF1EE) : Colors.transparent,
                title: Text(
                  theme,
                  style: TextStyle(
                    fontWeight: isSel ? FontWeight.w800 : FontWeight.w600,
                    color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF0F172A),
                  ),
                ),
                trailing: isSel ? const Icon(Icons.check_circle, color: Color(0xFFEB4D37)) : null,
                onTap: () async {
                  Navigator.pop(ctx);
                  setState(() => _selectedTheme = theme);
                  await ApiService.updatePreferences(appTheme: theme);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Theme set to $theme Mode'), backgroundColor: const Color(0xFF10B981)),
                    );
                  }
                },
              );
            }),
          ],
        ),
      ),
    );
  }

  void _toggleNotifications() async {
    setState(() => _notificationsEnabled = !_notificationsEnabled);
    await ApiService.updatePreferences(notificationsEnabled: _notificationsEnabled);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_notificationsEnabled ? 'Push notifications enabled' : 'Push notifications silenced'),
          backgroundColor: const Color(0xFF10B981),
        ),
      );
    }
  }

  void _handleChangePhone() {
    final phoneController = TextEditingController(text: _userPhone);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Change Phone Number', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Enter your new phone number. An OTP will be sent for instant verification.',
              style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.phone, color: Color(0xFFEB4D37)),
                labelText: 'New Phone Number',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEB4D37),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await ApiService.requestChangePhone(phoneController.text.trim());
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('OTP sent to new phone number (Demo OTP: 123456)'),
                    backgroundColor: Color(0xFF10B981),
                  ),
                );
              }
            },
            child: const Text('Send OTP'),
          ),
        ],
      ),
    );
  }

  void _handlePersonalInfo() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Personal Information', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoRow('Full Name', _userName),
            _buildInfoRow('Registered Phone', _userPhone),
            _buildInfoRow('Email Address', _userEmail),
            _buildInfoRow('Account Status', 'Active & Verified', isGreen: true),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEB4D37),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isGreen = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500)),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: isGreen ? const Color(0xFF10B981) : const Color(0xFF0F172A),
            ),
          ),
        ],
      ),
    );
  }

  void _handleShowStaticDialog(String title, String content) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 17)),
        content: SingleChildScrollView(
          child: Text(content, style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.4)),
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEB4D37),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _handleLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 24),
            SizedBox(width: 8),
            Text('Logout from Naavi?', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
          ],
        ),
        content: const Text(
          'Are you sure you want to log out of your Naavi account?',
          style: TextStyle(fontSize: 13.5, color: Color(0xFF475569)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF64748B), fontWeight: FontWeight.bold)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Logout', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await ApiService.logout();
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
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
          'Settings',
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
        child: _isLoading
            ? const Center(child: CircularProgressIndicator(color: Color(0xFFEB4D37)))
            : SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Scenic Header Banner Image
                    Container(
                      height: 100,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.asset(
                              'assets/images/varanasi_profile_header.jpg',
                              fit: BoxFit.cover,
                              errorBuilder: (ctx, err, stack) => Container(
                                color: const Color(0xFFFFF1EE),
                                child: const Icon(Icons.waves, color: Color(0xFFEB4D37), size: 40),
                              ),
                            ),
                            Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.black.withValues(alpha: 0.45),
                                    Colors.transparent,
                                  ],
                                  begin: Alignment.bottomCenter,
                                  end: Alignment.topCenter,
                                ),
                              ),
                            ),
                            const Positioned(
                              left: 16,
                              bottom: 12,
                              child: Text(
                                'Naavi Account & Preferences',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 15,
                                  shadows: [Shadow(color: Colors.black45, blurRadius: 4)],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    // User Profile Header Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
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
                        children: [
                          // User Avatar
                          ClipRRect(
                            borderRadius: BorderRadius.circular(30),
                            child: Image.asset(
                              'assets/images/driver_avatar.jpg',
                              width: 60,
                              height: 60,
                              fit: BoxFit.cover,
                              errorBuilder: (ctx, err, stack) => Container(
                                width: 60,
                                height: 60,
                                color: const Color(0xFFFFF1EE),
                                child: const Icon(Icons.person, color: Color(0xFFEB4D37), size: 30),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _userName,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 16,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  _userPhone,
                                  style: const TextStyle(
                                    fontSize: 12.5,
                                    color: Color(0xFF64748B),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 1),
                                Text(
                                  _userEmail,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.chevron_right, color: Color(0xFF94A3B8), size: 22),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Section 1: Account Information Card
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        children: [
                          _buildSettingRow(
                            icon: Icons.person_outline_rounded,
                            title: 'Personal Information',
                            onTap: _handlePersonalInfo,
                          ),
                          const Divider(height: 1, indent: 54, endIndent: 16, color: Color(0xFFF1F5F9)),
                          _buildSettingRow(
                            icon: Icons.phone_outlined,
                            title: 'Change Phone Number',
                            onTap: _handleChangePhone,
                          ),
                          const Divider(height: 1, indent: 54, endIndent: 16, color: Color(0xFFF1F5F9)),
                          _buildSettingRow(
                            icon: Icons.mail_outline_rounded,
                            title: 'Verify Email ID',
                            trailing: _isEmailVerified
                                ? Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFECFDF5),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Text(
                                      'Verified',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF10B981),
                                      ),
                                    ),
                                  )
                                : null,
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Email rahul.sharma@gmail.com is already verified!'),
                                  backgroundColor: Color(0xFF10B981),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Section 2: Preferences Card
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        children: [
                          _buildSettingRow(
                            icon: Icons.language_rounded,
                            title: 'Language',
                            valueText: _selectedLanguage,
                            onTap: _handleLanguageSelect,
                          ),
                          const Divider(height: 1, indent: 54, endIndent: 16, color: Color(0xFFF1F5F9)),
                          _buildSettingRow(
                            icon: Icons.notifications_none_rounded,
                            title: 'Notifications',
                            trailing: Switch.adaptive(
                              value: _notificationsEnabled,
                              activeTrackColor: const Color(0xFFEB4D37),
                              onChanged: (_) => _toggleNotifications(),
                            ),
                            onTap: _toggleNotifications,
                          ),
                          const Divider(height: 1, indent: 54, endIndent: 16, color: Color(0xFFF1F5F9)),
                          _buildSettingRow(
                            icon: Icons.palette_outlined,
                            title: 'App Theme',
                            valueText: _selectedTheme,
                            onTap: _handleThemeSelect,
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Section 3: Support & Legal Card
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        children: [
                          _buildSettingRow(
                            icon: Icons.help_outline_rounded,
                            title: 'Help & Support',
                            onTap: () => _handleShowStaticDialog(
                              'Help & Support',
                              'Naavi 24/7 Ghat Help Center:\n\n• Hotline: 1800-102-NAAVI\n• WhatsApp Support: +91 98765 00000\n• Water Police Helpline: +91 542 2221234\n• Email: support@naavi.in',
                            ),
                          ),
                          const Divider(height: 1, indent: 54, endIndent: 16, color: Color(0xFFF1F5F9)),
                          _buildSettingRow(
                            icon: Icons.info_outline_rounded,
                            title: 'About Naavi',
                            onTap: () => _handleShowStaticDialog(
                              'About Naavi',
                              'Naavi is Varanasi’s premier digital inland waterways and boat operations platform. Connecting pilgrims, tourists, and ghat boat operators with safe, standardized, and real-time river journeys.\n\nVersion: 1.0.0 (Build 2026.1)',
                            ),
                          ),
                          const Divider(height: 1, indent: 54, endIndent: 16, color: Color(0xFFF1F5F9)),
                          _buildSettingRow(
                            icon: Icons.description_outlined,
                            title: 'Terms & Conditions',
                            onTap: () => _handleShowStaticDialog(
                              'Terms & Conditions',
                              '1. All boat journeys adhere to Varanasi Inland Waterways safety norms.\n2. Life jackets must be worn at all times while aboard.\n3. Fares are standardized as per official Ghat corridor rates.\n4. Cancellations up to 30 mins before trip start are eligible for 100% refund.',
                            ),
                          ),
                          const Divider(height: 1, indent: 54, endIndent: 16, color: Color(0xFFF1F5F9)),
                          _buildSettingRow(
                            icon: Icons.security_outlined,
                            title: 'Privacy Policy',
                            onTap: () => _handleShowStaticDialog(
                              'Privacy Policy',
                              'Naavi respects your privacy. Live GPS location is collected strictly during active river rides for passenger safety, SOS telemetry, and rescue operations.',
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Logout Button (Soft Pink/Red Background with Red Label)
                    InkWell(
                      onTap: _handleLogout,
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF1F1), // Soft Red Tint
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFFFE4E6)),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.logout_rounded, color: Color(0xFFEF4444), size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Logout',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFFEF4444),
                              ),
                            ),
                          ],
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

  Widget _buildSettingRow({
    required IconData icon,
    required String title,
    String? valueText,
    Widget? trailing,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFF0F172A), size: 22),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF0F172A),
                ),
              ),
            ),
            if (valueText != null) ...[
              Text(
                valueText,
                style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
              ),
              const SizedBox(width: 6),
            ],
            if (trailing != null)
              trailing
            else
              const Icon(Icons.chevron_right, color: Color(0xFFCBD5E1), size: 20),
          ],
        ),
      ),
    );
  }
}
