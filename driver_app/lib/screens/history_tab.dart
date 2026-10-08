import 'package:flutter/material.dart';
import '../services/driver_api_service.dart';

class HistoryTab extends StatefulWidget {
  const HistoryTab({super.key});

  @override
  State<HistoryTab> createState() => _HistoryTabState();
}

class _HistoryTabState extends State<HistoryTab> {
  List<dynamic> _trips = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  void _loadHistory() async {
    try {
      final res = await DriverApiService.getDashboard();
      if (res['success'] == true && mounted) {
        setState(() {
          _trips = res['data']['recentTrips'] ?? [];
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
      appBar: AppBar(
        title: const Text('Trip History'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadHistory),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _trips.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.history_toggle_off, size: 64, color: Colors.grey.shade400),
                      const SizedBox(height: 16),
                      const Text(
                        'No Completed Trips Yet',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Completed river trips will appear here with fare breakdowns.',
                        style: TextStyle(fontSize: 13, color: Colors.grey),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _trips.length,
                  itemBuilder: (context, index) {
                    final trip = _trips[index];
                    final date = trip['completedAt'] != null
                        ? DateTime.parse(trip['completedAt'])
                        : DateTime.now();

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  trip['bookingCode'] ?? 'NV-TRIP',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                ),
                                Text(
                                  '₹${trip['finalPayableAmount']}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18,
                                    color: Color(0xFF0D9488),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.directions_boat_outlined, size: 16, color: Colors.blueGrey),
                                const SizedBox(width: 6),
                                Text(
                                  '${trip['tripType']?.replaceAll('_', ' ')} • ${trip['seatsBooked']} Passengers',
                                  style: const TextStyle(fontSize: 13, color: Colors.blueGrey),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.access_time, size: 16, color: Colors.grey),
                                const SizedBox(width: 6),
                                Text(
                                  '${date.day}/${date.month}/${date.year} • ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}',
                                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                                ),
                              ],
                            ),
                            const Divider(height: 18),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: Colors.green.shade50,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    'Paid: ${trip['paymentMode']?.replaceAll('_', ' ')}',
                                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.green.shade800),
                                  ),
                                ),
                                Row(
                                  children: [
                                    const Icon(Icons.star, size: 16, color: Colors.amber),
                                    const SizedBox(width: 4),
                                    Text(
                                      trip['rating'] != null ? '${trip['rating']}.0' : '5.0',
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
