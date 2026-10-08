import 'package:flutter/material.dart';

class CollectPaymentDialog extends StatefulWidget {
  final String bookingCode;
  final double amount;
  final Function(double collected) onConfirm;

  const CollectPaymentDialog({
    super.key,
    required this.bookingCode,
    required this.amount,
    required this.onConfirm,
  });

  @override
  State<CollectPaymentDialog> createState() => _CollectPaymentDialogState();
}

class _CollectPaymentDialogState extends State<CollectPaymentDialog> {
  String _paymentMethod = 'CASH'; // or 'UPI_QR'

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.shade50,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle, color: Colors.green, size: 36),
          ),
          const SizedBox(height: 12),
          const Text(
            'Collect Trip Payment',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
          ),
          Text(
            'Ref: ${widget.bookingCode}',
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.teal.shade50,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.teal.shade200),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Fare to Collect:', style: TextStyle(fontWeight: FontWeight.w600)),
                Text(
                  '₹${widget.amount.toInt()}',
                  style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFF0D9488)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text('Select Collection Method:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: ChoiceChip(
                  label: const Center(child: Text('💵 Cash')),
                  selected: _paymentMethod == 'CASH',
                  onSelected: (val) => setState(() => _paymentMethod = 'CASH'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ChoiceChip(
                  label: const Center(child: Text('📱 UPI / QR')),
                  selected: _paymentMethod == 'UPI_QR',
                  onSelected: (val) => setState(() => _paymentMethod = 'UPI_QR'),
                ),
              ),
            ],
          ),
          if (_paymentMethod == 'UPI_QR') ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Row(
                children: [
                  Icon(Icons.qr_code_2, size: 32, color: Colors.blueGrey),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Ask customer to scan your Naavi Ghat QR code',
                      style: TextStyle(fontSize: 12, color: Colors.blueGrey),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Back'),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF0D9488),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          ),
          onPressed: () {
            Navigator.pop(context);
            widget.onConfirm(widget.amount);
          },
          child: const Text('Confirm Received'),
        ),
      ],
    );
  }
}
