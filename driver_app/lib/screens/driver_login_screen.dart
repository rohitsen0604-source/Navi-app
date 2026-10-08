import 'package:flutter/material.dart';
import '../services/driver_api_service.dart';
import 'main_nav_screen.dart';

class DriverLoginScreen extends StatefulWidget {
  const DriverLoginScreen({super.key});

  @override
  State<DriverLoginScreen> createState() => _DriverLoginScreenState();
}

class _DriverLoginScreenState extends State<DriverLoginScreen> {
  final _phoneController = TextEditingController(text: '9876543220');
  final _otpController = TextEditingController(text: '123456');
  bool _otpSent = false;
  bool _loading = false;

  void _sendOtp() async {
    setState(() => _loading = true);
    try {
      final res = await DriverApiService.sendOtp(_phoneController.text.trim());
      if (res['success'] == true) {
        setState(() => _otpSent = true);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Driver OTP 123456 sent!')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    } finally {
      setState(() => _loading = false);
    }
  }

  void _verifyOtp() async {
    setState(() => _loading = true);
    try {
      final res = await DriverApiService.verifyOtp(
        _phoneController.text.trim(),
        _otpController.text.trim(),
      );
      if (res['success'] == true && mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const DriverMainNavScreen()),
        );
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(res['message'] ?? 'Authentication failed')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Center(
                child: Text('👨‍✈️', style: TextStyle(fontSize: 64)),
              ),
              const SizedBox(height: 12),
              const Text(
                'Naavi Boatman Partner',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
              ),
              const Text(
                'Varanasi Ghats Waterway Fleet',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
              const SizedBox(height: 36),
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: 'Registered Mobile Number',
                  prefixText: '+91 ',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  prefixIcon: const Icon(Icons.phone),
                ),
              ),
              const SizedBox(height: 16),
              if (_otpSent) ...[
                TextField(
                  controller: _otpController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Enter 6-digit OTP',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    prefixIcon: const Icon(Icons.lock),
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _loading ? null : _verifyOtp,
                  child: _loading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Login to Duty Dashboard'),
                ),
              ] else ...[
                ElevatedButton(
                  onPressed: _loading ? null : _sendOtp,
                  child: _loading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Send Duty OTP'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
