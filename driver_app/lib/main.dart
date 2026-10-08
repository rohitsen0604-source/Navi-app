import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'screens/driver_login_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NaaviDriverApp());
}

class NaaviDriverApp extends StatelessWidget {
  const NaaviDriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Naavi Boatman Partner',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const DriverLoginScreen(),
    );
  }
}
