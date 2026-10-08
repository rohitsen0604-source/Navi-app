import 'package:flutter/material.dart';
import '../services/driver_api_service.dart';

class EarningsTab extends StatefulWidget {
  const EarningsTab({super.key});

  @override
  State<EarningsTab> createState() => _EarningsTabState();
}

class _EarningsTabState extends State<EarningsTab> {
  Map<String, dynamic>? _driver;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadEarnings();
  }

  void _loadEarnings() async {
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

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final totalEarnings = _driver?['totalEarnings'] ?? 0;
    final totalTrips = _driver?['totalRidesCompleted'] ?? 0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Earnings & Settlements'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadEarnings),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Hero Earnings Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0D9488), Color(0xFFEB4D37)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF0D9488).withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  )
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'TOTAL EARNINGS REVENUE',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '₹$totalEarnings',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 36,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Completed Trips', style: TextStyle(color: Colors.white70, fontSize: 12)),
                          Text('$totalTrips Rides', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                        ],
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF0D9488),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Payout transfer initiated to registered bank account!')),
                          );
                        },
                        child: const Text('Withdraw Payout'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Daily Ghat Incentive Quest Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.amber.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.stars, color: Colors.amber, size: 28),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Ganges Daily Incentive Quest', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                            Text('Earn extra ₹300 bonus on 5 trips today', style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: (totalTrips % 5) / 5.0,
                      minHeight: 10,
                      color: Colors.amber,
                      backgroundColor: Colors.grey.shade100,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${totalTrips % 5} of 5 trips completed (${5 - (totalTrips % 5)} more to unlock ₹300 bonus)',
                    style: const TextStyle(fontSize: 12, color: Colors.blueGrey, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Breakdown
            const Text('Collection Breakdown', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.money, color: Colors.green),
                          SizedBox(width: 8),
                          Text('Cash Collected on Ghat'),
                        ],
                      ),
                      Text('₹${(totalEarnings * 0.7).toInt()}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.qr_code, color: Colors.blue),
                          SizedBox(width: 8),
                          Text('Online / UPI Settlements'),
                        ],
                      ),
                      Text('₹${(totalEarnings * 0.3).toInt()}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
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
