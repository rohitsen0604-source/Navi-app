import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'location_zone_screen.dart';

class CompleteProfileScreen extends StatefulWidget {
  final String phoneNumber;

  const CompleteProfileScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<CompleteProfileScreen> createState() => _CompleteProfileScreenState();
}

class _CompleteProfileScreenState extends State<CompleteProfileScreen> {
  final TextEditingController _firstNameController = TextEditingController(text: 'Rahul');
  final TextEditingController _lastNameController = TextEditingController(text: 'Sharma');
  final TextEditingController _emailController = TextEditingController(text: 'rahul.sharma@gmail.com');
  bool _loading = false;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _handleContinue() async {
    final firstName = _firstNameController.text.trim();
    final lastName = _lastNameController.text.trim();
    final email = _emailController.text.trim();

    if (firstName.isEmpty || lastName.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your First Name and Last Name'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() => _loading = true);
    try {
      final res = await ApiService.completeProfile(
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: widget.phoneNumber,
      );

      if (res['success'] == true && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile completed successfully! Welcome to Naavi'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const LocationZoneScreen()),
          (route) => false,
        );
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['message'] ?? 'Failed to complete profile'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } catch (_) {
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const LocationZoneScreen()),
          (route) => false,
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. Top Header with AI Generated Varanasi Morning Image & Blur
            Stack(
              children: [
                SizedBox(
                  height: 200,
                  width: double.infinity,
                  child: Image.asset(
                    'assets/images/varanasi_profile_header.jpg',
                    fit: BoxFit.cover,
                    alignment: Alignment.center,
                  ),
                ),

                // White Gradient Overlay (Blends image seamlessly into white form below)
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withValues(alpha: 0.15),
                          Colors.transparent,
                          Colors.white.withValues(alpha: 0.75),
                          Colors.white,
                        ],
                        stops: const [0.0, 0.35, 0.80, 1.0],
                      ),
                    ),
                  ),
                ),

                // Back Arrow Button
                SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.only(left: 12.0, top: 4.0),
                    child: IconButton(
                      icon: const Icon(
                        Icons.arrow_back,
                        color: Color(0xFF0F172A),
                        size: 24,
                      ),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ),
              ],
            ),

            // 2. Main Profile Completion Form
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Title
                  const Text(
                    'Complete Your Profile',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 25,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 6),

                  // Subtitle
                  const Text(
                    'Get a better experience with\npersonalized recommendations',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF64748B),
                      height: 1.35,
                      fontWeight: FontWeight.w400,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 3. User Avatar with Camera Badge
                  Center(
                    child: Stack(
                      children: [
                        Container(
                          width: 88,
                          height: 88,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: const Color(0xFFE2E8F0),
                            border: Border.all(color: Colors.white, width: 3),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.04),
                                blurRadius: 10,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.person,
                            size: 52,
                            color: Color(0xFF94A3B8),
                          ),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            width: 30,
                            height: 30,
                            decoration: BoxDecoration(
                              color: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.15),
                                  blurRadius: 6,
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.camera_alt,
                              size: 15,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 28),

                  // 4. Form Fields
                  // First Name Card
                  _buildInputField(
                    icon: Icons.person_outline,
                    label: 'First Name',
                    controller: _firstNameController,
                    hint: 'Enter your first name',
                  ),

                  const SizedBox(height: 16),

                  // Last Name Card
                  _buildInputField(
                    icon: Icons.person_outline,
                    label: 'Last Name',
                    controller: _lastNameController,
                    hint: 'Enter your last name',
                  ),

                  const SizedBox(height: 16),

                  // Email ID Card
                  _buildInputField(
                    icon: Icons.mail_outline,
                    label: 'Email ID',
                    controller: _emailController,
                    hint: 'name@example.com',
                    keyboardType: TextInputType.emailAddress,
                  ),

                  const SizedBox(height: 36),

                  // 5. "Continue" Action Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral (Theme match)
                      foregroundColor: Colors.white,
                      minimumSize: const Size.fromHeight(54),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      elevation: 0,
                    ),
                    onPressed: _loading ? null : _handleContinue,
                    child: _loading
                        ? const SizedBox(
                            height: 22,
                            width: 22,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2.5,
                            ),
                          )
                        : const Text(
                            'Continue',
                            style: TextStyle(
                              fontSize: 16.5,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.3,
                            ),
                          ),
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputField({
    required IconData icon,
    required String label,
    required TextEditingController controller,
    required String hint,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFE2E8F0),
          width: 1.5,
        ),
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
          Icon(icon, color: const Color(0xFF0F172A), size: 24),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 2),
                TextField(
                  controller: controller,
                  keyboardType: keyboardType,
                  style: const TextStyle(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0F172A),
                  ),
                  decoration: InputDecoration(
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                    border: InputBorder.none,
                    hintText: hint,
                    hintStyle: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
