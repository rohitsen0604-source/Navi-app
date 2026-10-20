import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../core/theme.dart';
import '../services/driver_api_service.dart';
import 'main_nav_screen.dart';

class DriverKycStatusScreen extends StatefulWidget {
  final String phoneNumber;

  const DriverKycStatusScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<DriverKycStatusScreen> createState() => _DriverKycStatusScreenState();
}

class _DriverKycStatusScreenState extends State<DriverKycStatusScreen> {
  @override
  void initState() {
    super.initState();
    _triggerKycSubmission();
  }

  void _triggerKycSubmission() async {
    try {
      await DriverApiService.submitKyc(widget.phoneNumber);
    } catch (_) {}
  }

  void _goToHome() {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const DriverMainNavScreen()),
      (route) => false,
    );
  }

  Widget _buildTimelineItem({
    required Widget indicator,
    required String title,
    required String subtitle,
    String? actionText,
    VoidCallback? onActionTap,
    bool showConnectingLine = true,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Indicator & Vertical Connecting Line
          Column(
            children: [
              indicator,
              if (showConnectingLine)
                Expanded(
                  child: Container(
                    width: 2,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    color: const Color(0xFFDCFCE7),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),
          // Content & Action
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 22),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          subtitle,
                          style: const TextStyle(
                            fontSize: 13,
                            color: Color(0xFF64748B),
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (actionText != null)
                    GestureDetector(
                      onTap: onActionTap,
                      child: Padding(
                        padding: const EdgeInsets.only(left: 8),
                        child: Text(
                          actionText,
                          style: const TextStyle(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.primary,
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
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Color(0xFF0F172A), size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        title: const Text(
          'KYC Verification',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 18),
            child: Center(
              child: Text(
                '3/3',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF64748B),
                ),
              ),
            ),
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(10),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                // Step 1: Active Theme Coral
                Expanded(
                  child: Container(
                    height: 4.5,
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                // Step 2: Active Theme Coral
                Expanded(
                  child: Container(
                    height: 4.5,
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                // Step 3: Active Theme Coral (All 3 Filled!)
                Expanded(
                  child: Container(
                    height: 4.5,
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
                child: Column(
                  children: [
                    // Center 3D Illustration
                    Center(
                      child: Container(
                        width: 140,
                        height: 140,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFFF0FDF4),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF22C55E).withValues(alpha: 0.12),
                              blurRadius: 24,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: Image.asset(
                            'assets/images/driver_kyc_success_hero.jpg',
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                const Center(
                              child: Icon(
                                Icons.verified_user_rounded,
                                size: 64,
                                color: Color(0xFF16A34A),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Main Header: KYC Submitted!
                    const Text(
                      'KYC Submitted!',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                        letterSpacing: -0.5,
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Subtitle
                    const Text(
                      'Your details and documents have been\nsubmitted for verification.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14.5,
                        color: Color(0xFF64748B),
                        height: 1.4,
                      ),
                    ),

                    const SizedBox(height: 32),

                    // Stepper / Timeline items matching screenshot
                    // 1. Personal Details
                    _buildTimelineItem(
                      indicator: Container(
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          color: Color(0xFF16A34A),
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Icon(Icons.check_rounded,
                              size: 16, color: Colors.white),
                        ),
                      ),
                      title: 'Personal Details',
                      subtitle: 'Submitted',
                      actionText: 'Edit',
                      onActionTap: () => Navigator.pop(context),
                      showConnectingLine: true,
                    ),

                    // 2. Boat Details
                    _buildTimelineItem(
                      indicator: Container(
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          color: Color(0xFF16A34A),
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Icon(Icons.check_rounded,
                              size: 16, color: Colors.white),
                        ),
                      ),
                      title: 'Boat Details',
                      subtitle: 'Submitted',
                      actionText: 'Edit',
                      onActionTap: () => Navigator.pop(context),
                      showConnectingLine: true,
                    ),

                    // 3. Documents
                    _buildTimelineItem(
                      indicator: Container(
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          color: Color(0xFF16A34A),
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Icon(Icons.check_rounded,
                              size: 16, color: Colors.white),
                        ),
                      ),
                      title: 'Documents',
                      subtitle: 'Uploaded',
                      actionText: 'Edit',
                      onActionTap: () => Navigator.pop(context),
                      showConnectingLine: true,
                    ),

                    // 4. Under Verification
                    _buildTimelineItem(
                      indicator: Container(
                        width: 24,
                        height: 24,
                        decoration: const BoxDecoration(
                          color: Color(0xFFF59E0B),
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Icon(Icons.access_time_rounded,
                              size: 15, color: Colors.white),
                        ),
                      ),
                      title: 'Under Verification',
                      subtitle:
                          'Our team will verify your details within 24–48 hours.',
                      actionText: null,
                      showConnectingLine: false,
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Action Button: Go to Home
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton(
                  onPressed: _goToHome,
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppTheme.primary, width: 1.8),
                    foregroundColor: AppTheme.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Go to Home',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.2,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
