import 'dart:async';
import 'package:flutter/material.dart';

class IncomingRequestDialog extends StatefulWidget {
  final Map<String, dynamic> request;
  final VoidCallback onAccept;
  final VoidCallback onReject;

  const IncomingRequestDialog({
    super.key,
    required this.request,
    required this.onAccept,
    required this.onReject,
  });

  @override
  State<IncomingRequestDialog> createState() => _IncomingRequestDialogState();
}

class _IncomingRequestDialogState extends State<IncomingRequestDialog> {
  int _secondsRemaining = 30;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 1) {
        setState(() => _secondsRemaining--);
      } else {
        _timer?.cancel();
        widget.onReject(); // Auto-reject on timeout
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final fare = widget.request['fareAmount'] ?? 0;
    final seats = widget.request['seats'] ?? 1;
    final ghat = widget.request['boardingPoint'] ?? 'Varanasi Ghat';
    final zone = widget.request['zoneNumber'] ?? 1;
    final tripType = widget.request['tripType'] ?? 'FULL_TRIP';

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      contentPadding: const EdgeInsets.all(24),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Circular Countdown Timer Header
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 72,
                height: 72,
                child: CircularProgressIndicator(
                  value: _secondsRemaining / 30,
                  strokeWidth: 6,
                  color: _secondsRemaining > 10 ? const Color(0xFF0D9488) : Colors.red,
                  backgroundColor: Colors.grey.shade200,
                ),
              ),
              Text(
                '$_secondsRemaining',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: _secondsRemaining > 10 ? const Color(0xFF0D9488) : Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          const Text(
            'New River Ride Request!',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          Text(
            'Ref: ${widget.request['bookingCode']}',
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
          const SizedBox(height: 16),

          // Details Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    const Icon(Icons.location_on, color: Color(0xFFEB4D37), size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('PICKUP GHAT', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                          Text('$ghat (Zone $zone)', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('PASSENGERS', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                        Text('$seats Pax', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('TRIP TYPE', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                        Text(tripType.replaceAll('_', ' '), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Colors.blueGrey)),
                      ],
                    ),
                  ],
                ),
                const Divider(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Trip Fare Earnings:', style: TextStyle(fontWeight: FontWeight.bold)),
                    Text(
                      '₹$fare',
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0D9488)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Accept / Reject Action Buttons
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    _timer?.cancel();
                    widget.onReject();
                  },
                  child: const Text('Decline', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0D9488),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    _timer?.cancel();
                    widget.onAccept();
                  },
                  child: const Text('Accept Ride', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
