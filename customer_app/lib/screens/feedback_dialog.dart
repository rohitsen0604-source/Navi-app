import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'home_screen.dart';

class FeedbackDialog extends StatefulWidget {
  final String bookingId;
  final String driverName;
  final String boatName;
  final String ghatName;

  const FeedbackDialog({
    super.key,
    required this.bookingId,
    this.driverName = 'Ramesh Manjhi',
    this.boatName = 'Ganga Vihar Motor Boat',
    this.ghatName = 'Dashashwamedh Ghat',
  });

  static Future<void> show({
    required BuildContext context,
    required String bookingId,
    String driverName = 'Ramesh Manjhi',
    String boatName = 'Ganga Vihar Motor Boat',
    String ghatName = 'Dashashwamedh Ghat',
  }) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => FeedbackDialog(
        bookingId: bookingId,
        driverName: driverName,
        boatName: boatName,
        ghatName: ghatName,
      ),
    );
  }

  @override
  State<FeedbackDialog> createState() => _FeedbackDialogState();
}

class _FeedbackDialogState extends State<FeedbackDialog> {
  int _rating = 5;
  final Set<String> _selectedTags = {'Polite Captain', 'Safe Navigation'};
  final TextEditingController _reviewController = TextEditingController();
  bool _submitting = false;

  final List<String> _tags = [
    'Polite Captain',
    'Safe Navigation',
    'Clean Boat',
    'Punctual',
    'Ghat Heritage Guide',
    'Smooth River Ride',
  ];

  @override
  void dispose() {
    _reviewController.dispose();
    super.dispose();
  }

  void _handleSubmit() async {
    setState(() => _submitting = true);
    try {
      await ApiService.rateRide(
        bookingId: widget.bookingId,
        rating: _rating,
        review: _reviewController.text.trim(),
        feedbackTags: _selectedTags.toList(),
      );
    } catch (_) {}

    if (mounted) {
      setState(() => _submitting = false);
      Navigator.pop(context); // close dialog

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Thank you! Your feedback has been submitted successfully.'),
          backgroundColor: Color(0xFF10B981),
          behavior: SnackBarBehavior.floating,
        ),
      );

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      backgroundColor: Colors.white,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(22.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // 1. Captain Avatar
              Stack(
                alignment: Alignment.bottomRight,
                children: [
                  Container(
                    width: 76,
                    height: 76,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFEB4D37), width: 2.5),
                    ),
                    child: ClipOval(
                      child: Image.asset(
                        'assets/images/driver_avatar.jpg',
                        fit: BoxFit.cover,
                        errorBuilder: (ctx, err, stack) => Container(
                          color: const Color(0xFFFFF1EE),
                          child: const Icon(Icons.person, color: Color(0xFFEB4D37), size: 40),
                        ),
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Color(0xFF10B981),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.check, size: 12, color: Colors.white),
                  ),
                ],
              ),

              const SizedBox(height: 12),

              Text(
                'How was your boat trip with ${widget.driverName}?',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                  letterSpacing: -0.3,
                ),
              ),

              const SizedBox(height: 4),

              Text(
                '${widget.boatName} • ${widget.ghatName}',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF64748B),
                ),
              ),

              const SizedBox(height: 18),

              // 2. Star Rating (1 to 5)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) {
                  final starNum = index + 1;
                  final isSelected = starNum <= _rating;
                  return GestureDetector(
                    onTap: () => setState(() => _rating = starNum),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4.0),
                      child: Icon(
                        isSelected ? Icons.star_rounded : Icons.star_outline_rounded,
                        size: 38,
                        color: isSelected ? const Color(0xFFF59E0B) : const Color(0xFFCBD5E1),
                      ),
                    ),
                  );
                }),
              ),

              const SizedBox(height: 6),

              Text(
                _rating == 5
                    ? 'Excellent Experience! 🌟'
                    : _rating == 4
                        ? 'Good Journey! 👍'
                        : _rating == 3
                            ? 'Average Ride 🙂'
                            : 'Needs Improvement ⚠️',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFFD97706),
                ),
              ),

              const SizedBox(height: 18),

              // 3. Feedback Tags
              Wrap(
                spacing: 8,
                runSpacing: 8,
                alignment: WrapAlignment.center,
                children: _tags.map((tag) {
                  final isSel = _selectedTags.contains(tag);
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        if (isSel) {
                          _selectedTags.remove(tag);
                        } else {
                          _selectedTags.add(tag);
                        }
                      });
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 180),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                      decoration: BoxDecoration(
                        color: isSel ? const Color(0xFFFFF1EE) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isSel ? const Color(0xFFEB4D37) : const Color(0xFFE2E8F0),
                          width: isSel ? 1.5 : 1.0,
                        ),
                      ),
                      child: Text(
                        tag,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isSel ? FontWeight.w700 : FontWeight.w500,
                          color: isSel ? const Color(0xFFEB4D37) : const Color(0xFF475569),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 16),

              // 4. Text Review Box
              TextField(
                controller: _reviewController,
                maxLines: 2,
                style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A)),
                decoration: InputDecoration(
                  hintText: 'Share more about your experience on the water...',
                  hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  contentPadding: const EdgeInsets.all(12),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                    borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // 5. Submit Button
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  backgroundColor: const Color(0xFFEB4D37), // Naavi Sunrise Coral
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _submitting ? null : _handleSubmit,
                child: _submitting
                    ? const SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : const Text(
                        'Submit Feedback',
                        style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w800),
                      ),
              ),

              const SizedBox(height: 8),

              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const HomeScreen()),
                    (route) => false,
                  );
                },
                child: const Text(
                  'Skip for Now',
                  style: TextStyle(color: Color(0xFF64748B), fontSize: 13, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
