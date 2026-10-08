import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NaaviCustomerApp());
}

class NaaviCustomerApp extends StatelessWidget {
  const NaaviCustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Naavi Customer',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SplashScreen(),
    );
  }
}
