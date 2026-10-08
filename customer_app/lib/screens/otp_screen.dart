import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/api_service.dart';
import 'complete_profile_screen.dart';
import 'location_zone_screen.dart';

class OtpScreen extends StatefulWidget {
  final String phoneNumber;

  const OtpScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _controllers = List.generate(
    6,
    (index) => TextEditingController(text: (index + 1).toString()), // Demo prefilled 1 2 3 4 5 6
  );
  final List<FocusNode> _focusNodes = List.generate(6, (index) => FocusNode());

  int _resendSeconds = 25;
  Timer? _timer;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (var c in _controllers) {
      c.dispose();
    }
    for (var f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() => _resendSeconds = 25);
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_resendSeconds > 0) {
        setState(() => _resendSeconds--);
      } else {
        t.cancel();
      }
    });
  }

  String get _enteredOtp => _controllers.map((c) => c.text).join();

  void _verifyOtp() async {
    final otp = _enteredOtp.trim();
    if (otp.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter complete 6-digit OTP'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() => _loading = true);
    try {
      final res = await ApiService.verifyOtp(widget.phoneNumber, otp);
      if (res['success'] == true && mounted) {
        final bool isNew = res['isNewUser'] == true || res['isProfileCompleted'] == false;
        if (isNew) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => CompleteProfileScreen(phoneNumber: widget.phoneNumber),
            ),
          );
        } else {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (_) => const LocationZoneScreen()),
            (route) => false,
          );
        }
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['message'] ?? 'Invalid OTP code'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } catch (_) {
      // Offline fallback
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => CompleteProfileScreen(phoneNumber: widget.phoneNumber),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _resendOtp() async {
    _startTimer();
    try {
      await ApiService.sendOtp(widget.phoneNumber);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('OTP sent successfully (Demo: 123456)')),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Demo OTP resent: 123456')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A), size: 24),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 8),

                    // 1. Title
                    const Text(
                      'Verify Your Number',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 25,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                        color: Color(0xFF0F172A),
                      ),
                    ),

                    const SizedBox(height: 8),

                    // 2. Subtitle & Phone Number
                    const Text(
                      'We have sent a 6-digit OTP to',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '+91 ${widget.phoneNumber}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF0F172A),
                      ),
                    ),

                    const SizedBox(height: 32),

                    // 3. 6 Separate OTP Boxes
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(6, (index) {
                        return Container(
                          width: 48,
                          height: 56,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: _controllers[index].text.isNotEmpty
                                  ? const Color(0xFFEB4D37) // Naavi Coral Red
                                  : const Color(0xFFE2E8F0),
                              width: _controllers[index].text.isNotEmpty ? 1.8 : 1.3,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.02),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Center(
                            child: TextField(
                              controller: _controllers[index],
                              focusNode: _focusNodes[index],
                              textAlign: TextAlign.center,
                              keyboardType: TextInputType.number,
                              maxLength: 1,
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                              ],
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF0F172A),
                              ),
                              decoration: const InputDecoration(
                                counterText: '',
                                border: InputBorder.none,
                                contentPadding: EdgeInsets.zero,
                              ),
                              onChanged: (value) {
                                setState(() {});
                                if (value.isNotEmpty && index < 5) {
                                  _focusNodes[index + 1].requestFocus();
                                } else if (value.isEmpty && index > 0) {
                                  _focusNodes[index - 1].requestFocus();
                                }
                                if (_enteredOtp.length == 6) {
                                  _verifyOtp();
                                }
                              },
                            ),
                          ),
                        );
                      }),
                    ),

                    const SizedBox(height: 28),

                    // 4. Resend OTP Timer / Link
                    Center(
                      child: _resendSeconds > 0
                          ? Text(
                              'Resend OTP in 00:${_resendSeconds.toString().padLeft(2, '0')}',
                              style: const TextStyle(
                                fontSize: 13.5,
                                color: Color(0xFF64748B),
                                fontWeight: FontWeight.w500,
                              ),
                            )
                          : TextButton(
                              onPressed: _resendOtp,
                              child: const Text(
                                'Resend OTP',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFFEB4D37),
                                ),
                              ),
                            ),
                    ),

                    const SizedBox(height: 24),

                    // 5. Verify Action Button
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEB4D37), // Naavi Coral Red (Theme match)
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(52),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 0,
                      ),
                      onPressed: _loading ? null : _verifyOtp,
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
                              'Verify',
                              style: TextStyle(
                                fontSize: 16.5,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.3,
                              ),
                            ),
                    ),

                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),

            // 6. Bottom Scenic Varanasi Boat Artwork (Exact Reference Design)
            Stack(
              alignment: Alignment.topCenter,
              children: [
                SizedBox(
                  height: 220,
                  width: double.infinity,
                  child: Image.asset(
                    'assets/images/varanasi_otp_bg.jpg',
                    fit: BoxFit.cover,
                    alignment: Alignment.center,
                  ),
                ),
                // Gradient top feather to merge seamlessly into white screen
                Container(
                  height: 40,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.white,
                        Colors.white.withValues(alpha: 0.0),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
