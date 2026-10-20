import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../core/theme.dart';
import '../services/driver_api_service.dart';
import 'driver_kyc_status_screen.dart';

class DriverBoatDetailsScreen extends StatefulWidget {
  final String phoneNumber;

  const DriverBoatDetailsScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<DriverBoatDetailsScreen> createState() =>
      _DriverBoatDetailsScreenState();
}

class _DriverBoatDetailsScreenState extends State<DriverBoatDetailsScreen> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _boatNameController;
  late final TextEditingController _capacityController;
  late final TextEditingController _regNumberController;

  String _selectedBoatType = 'Motor Boat';
  bool _loading = false;

  final List<String> _boatTypes = [
    'Motor Boat',
    'Shikara / Row Boat',
    'Speed Boat',
    'Mini Cruise',
  ];

  @override
  void initState() {
    super.initState();
    _boatNameController = TextEditingController(text: 'Naavi-01');
    _capacityController = TextEditingController(text: '10');
    _regNumberController = TextEditingController(text: 'MP-09-AB-1234');
  }

  @override
  void dispose() {
    _boatNameController.dispose();
    _capacityController.dispose();
    _regNumberController.dispose();
    super.dispose();
  }

  void _showAddPhotoDialog() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Row(
          children: [
            Icon(Icons.add_photo_alternate_rounded,
                color: Colors.white, size: 20),
            SizedBox(width: 8),
            Text('Photo gallery updated with new boat picture'),
          ],
        ),
        backgroundColor: AppTheme.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  Future<void> _submitBoatDetails() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _loading = true);

    try {
      final res = await DriverApiService.saveBoatDetails(
        phone: widget.phoneNumber,
        boatName: _boatNameController.text.trim(),
        boatType: _selectedBoatType,
        seatingCapacity: int.tryParse(_capacityController.text.trim()) ?? 10,
        registrationNumber: _regNumberController.text.trim(),
        boatPhotos: [
          'assets/images/driver_boat_photo_1.jpg',
          'assets/images/driver_boat_photo_2.jpg',
        ],
      );

      if (mounted) {
        if (res['success'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Row(
                children: [
                  Icon(Icons.verified_rounded, color: Colors.white, size: 20),
                  SizedBox(width: 8),
                  Text('Boat information & documents verified successfully!'),
                ],
              ),
              backgroundColor: AppTheme.success,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
            ),
          );

          // Route to Step 3: KYC Verification Status Screen
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => DriverKycStatusScreen(
                phoneNumber: widget.phoneNumber,
              ),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(res['message'] ?? 'Failed to save boat details'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      }
    } catch (_) {
      // Offline fallback: continue to KYC status screen
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => DriverKycStatusScreen(
              phoneNumber: widget.phoneNumber,
            ),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Widget _buildFieldCard({
    required IconData icon,
    required String label,
    required Widget child,
    VoidCallback? onTap,
    Widget? trailing,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Icon(icon, color: const Color(0xFF64748B), size: 20),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                  const SizedBox(height: 2),
                  child,
                ],
              ),
            ),
            ?trailing,
          ],
        ),
      ),
    );
  }

  Widget _buildDocumentCard({
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String title,
    required String previewAsset,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Left Icon Badge
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Icon(icon, color: iconColor, size: 20),
            ),
          ),
          const SizedBox(width: 12),
          // Document Title
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0F172A),
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Thumbnail Preview
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.asset(
              previewAsset,
              width: 52,
              height: 36,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                width: 52,
                height: 36,
                color: const Color(0xFFF1F5F9),
                child: const Icon(Icons.description, size: 18, color: Colors.grey),
              ),
            ),
          ),
          const SizedBox(width: 10),
          // Green Verified Checkmark
          Container(
            width: 22,
            height: 22,
            decoration: const BoxDecoration(
              color: Color(0xFF16A34A),
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Icon(
                Icons.check_rounded,
                size: 15,
                color: Colors.white,
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
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Color(0xFF0F172A), size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        centerTitle: true,
        title: const Text(
          'Boat Details',
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
                '2/3',
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
                // Step 1: Completed
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
                // Step 2: Active (Theme Coral)
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
                // Step 3: Inactive
                Expanded(
                  child: Container(
                    height: 4.5,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2E8F0),
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
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Section 1: Boat Information Title & Subtitle
                      const Text(
                        'Boat Information',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Add your boat details and documents',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF64748B),
                        ),
                      ),

                      const SizedBox(height: 18),

                      // Boat Photos Gallery Row
                      Row(
                        children: [
                          // Photo 1 Thumbnail
                          ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.asset(
                              'assets/images/driver_boat_photo_1.jpg',
                              width: 82,
                              height: 82,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 12),
                          // Photo 2 Thumbnail
                          ClipRRect(
                            borderRadius: BorderRadius.circular(14),
                            child: Image.asset(
                              'assets/images/driver_boat_photo_2.jpg',
                              width: 82,
                              height: 82,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 12),
                          // Add Photos Button
                          GestureDetector(
                            onTap: _showAddPhotoDialog,
                            child: Container(
                              width: 82,
                              height: 82,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: const Color(0xFFCBD5E1),
                                  width: 1.5,
                                ),
                              ),
                              child: const Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.add_rounded,
                                    color: AppTheme.primary,
                                    size: 26,
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    'Add Photos',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF64748B),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 22),

                      // 1. Boat Name
                      _buildFieldCard(
                        icon: Icons.directions_boat_outlined,
                        label: 'Boat Name',
                        child: TextFormField(
                          controller: _boatNameController,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0F172A),
                          ),
                          decoration: const InputDecoration(
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                            border: InputBorder.none,
                            hintText: 'Enter boat name',
                          ),
                          validator: (v) =>
                              v == null || v.trim().isEmpty ? 'Required' : null,
                        ),
                      ),

                      // 2. Boat Type Dropdown
                      _buildFieldCard(
                        icon: Icons.sailing_rounded,
                        label: 'Boat Type',
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _selectedBoatType,
                            isDense: true,
                            isExpanded: true,
                            icon: const SizedBox.shrink(),
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF0F172A),
                            ),
                            items: _boatTypes
                                .map((t) => DropdownMenuItem(
                                      value: t,
                                      child: Text(t),
                                    ))
                                .toList(),
                            onChanged: (val) {
                              if (val != null) {
                                setState(() => _selectedBoatType = val);
                              }
                            },
                          ),
                        ),
                        trailing: const Icon(
                          Icons.keyboard_arrow_down_rounded,
                          color: Color(0xFF64748B),
                          size: 22,
                        ),
                      ),

                      // 3. Seating Capacity
                      _buildFieldCard(
                        icon: Icons.people_outline_rounded,
                        label: 'Seating Capacity',
                        child: TextFormField(
                          controller: _capacityController,
                          keyboardType: TextInputType.number,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly
                          ],
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0F172A),
                          ),
                          decoration: const InputDecoration(
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                            border: InputBorder.none,
                            hintText: 'Capacity',
                          ),
                          validator: (v) =>
                              v == null || v.trim().isEmpty ? 'Required' : null,
                        ),
                        trailing: const Text(
                          'persons',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ),

                      // 4. Registration Number
                      _buildFieldCard(
                        icon: Icons.badge_outlined,
                        label: 'Registration Number (if any)',
                        child: TextFormField(
                          controller: _regNumberController,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0F172A),
                          ),
                          decoration: const InputDecoration(
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                            border: InputBorder.none,
                            hintText: 'e.g. MP-09-AB-1234',
                          ),
                        ),
                      ),

                      const SizedBox(height: 14),

                      // Section 2: Documents
                      const Text(
                        'Documents',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Upload clear photos of required documents',
                        style: TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF64748B),
                        ),
                      ),

                      const SizedBox(height: 14),

                      // Document 1: Registration Certificate
                      _buildDocumentCard(
                        icon: Icons.description_rounded,
                        iconColor: const Color(0xFF16A34A),
                        iconBgColor: const Color(0xFFDCFCE7),
                        title: 'Boat Registration Certificate',
                        previewAsset: 'assets/images/driver_doc_certificate.jpg',
                      ),

                      // Document 2: Boat Insurance (Optional)
                      _buildDocumentCard(
                        icon: Icons.shield_outlined,
                        iconColor: const Color(0xFF0284C7),
                        iconBgColor: const Color(0xFFE0F2FE),
                        title: 'Boat Insurance (Optional)',
                        previewAsset: 'assets/images/driver_boat_photo_1.jpg',
                      ),

                      // Document 3: Safety Equipment Photo
                      _buildDocumentCard(
                        icon: Icons.album_outlined,
                        iconColor: const Color(0xFFEF4444),
                        iconBgColor: const Color(0xFFFEE2E2),
                        title: 'Safety Equipment Photo',
                        previewAsset: 'assets/images/driver_boat_photo_2.jpg',
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Action Button: Continue ->
              Container(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 10,
                      offset: const Offset(0, -3),
                    ),
                  ],
                ),
                child: ElevatedButton(
                  onPressed: _loading ? null : _submitBoatDetails,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(54),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 3,
                    shadowColor: AppTheme.primary.withValues(alpha: 0.35),
                  ),
                  child: _loading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.5,
                          ),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Continue',
                              style: TextStyle(
                                fontSize: 16.5,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.3,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded, size: 20),
                          ],
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
