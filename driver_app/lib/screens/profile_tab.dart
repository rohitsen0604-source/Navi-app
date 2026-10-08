import 'package:flutter/material.dart';
import '../services/driver_api_service.dart';
import 'driver_login_screen.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  Map<String, dynamic>? _driver;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  void _loadProfile() async {
    try {
      final res = await DriverApiService.getDashboard();
      if (res['success'] == true && mounted) {
        setState(() {
          _driver = res['data']['driver'];
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _logout() async {
    await DriverApiService.saveToken('');
    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const DriverLoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final boat = _driver?['assignedBoatId'];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Boatman KYC & Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.red),
            onPressed: _logout,
            tooltip: 'Logout',
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Driver Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 34,
                    backgroundColor: Colors.teal.shade50,
                    child: const Text('👨‍✈️', style: TextStyle(fontSize: 34)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _driver?['name'] ?? 'Ram Manjhi',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                        Text(
                          'Driver Code: ${_driver?['driverCode'] ?? "DRV-1001"}',
                          style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFF0D9488), fontSize: 13),
                        ),
                        Text(
                          _driver?['phone'] ?? '+91 9876543220',
                          style: const TextStyle(color: Colors.grey, fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.teal.shade50,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          '${_driver?['rating'] ?? 5.0}',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // KYC Documents Status Section
            const Text('KYC Document Verifications', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  _buildDocRow('Varanasi Inland Boating License', 'UP65-DL-2022-0988', true),
                  const Divider(height: 1),
                  _buildDocRow('Aadhaar Card KYC', 'XXXX-XXXX-4589', true),
                  const Divider(height: 1),
                  _buildDocRow('Varanasi Police Clearance Certificate', 'VERIFIED-VNS-2024', true),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Assigned Vessel Details
            const Text('Registered River Vessel', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  _buildVesselDetailRow('Vessel Name', boat?['name'] ?? 'Ganga Vihar Motor Boat'),
                  const SizedBox(height: 8),
                  _buildVesselDetailRow('Custom ID', boat?['customBoatId'] ?? 'BOAT-Z1-001'),
                  const SizedBox(height: 8),
                  _buildVesselDetailRow('Govt Registration', boat?['governmentRegNumber'] ?? 'UP-65-NV-1001'),
                  const SizedBox(height: 8),
                  _buildVesselDetailRow('Category', (boat?['category'] ?? 'MOTOR_BOAT').toString().replaceAll('_', ' ')),
                  const SizedBox(height: 8),
                  _buildVesselDetailRow('Passenger Capacity', '${boat?['capacity'] ?? 10} Seats'),
                  const SizedBox(height: 8),
                  _buildVesselDetailRow('Base Sector', 'Zone ${_driver?['operationalZoneNumber']} (Assi Ghat Corridor)'),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Emergency Contacts Support
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blueGrey.shade50,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Emergency & Dispatch Helplines', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  SizedBox(height: 6),
                  Text('🚨 Varanasi Water Police: 112 / 1090', style: TextStyle(fontSize: 12)),
                  Text('📞 Naavi Operations Control: +91 9876543211', style: TextStyle(fontSize: 12)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDocRow(String title, String docNum, bool isVerified) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
              Text(docNum, style: const TextStyle(fontSize: 11, color: Colors.grey)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Row(
              children: [
                Icon(Icons.check_circle, size: 14, color: Colors.green.shade700),
                const SizedBox(width: 4),
                Text('Verified', style: TextStyle(color: Colors.green.shade700, fontSize: 12, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVesselDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: Colors.blueGrey)),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
      ],
    );
  }
}
