import 'package:flutter/foundation.dart';

class AppConstants {
  static const String liveServerUrl = 'https://navi-app-8vqo.onrender.com';
  static const String localServerUrl = 'http://localhost:5000';
  static const String androidEmulatorUrl = 'http://10.0.2.2:5000';

  // Automatically detects local host for desktop/web and emulator for android in debug mode
  static String get activeServerUrl {
    if (kDebugMode) {
      if (defaultTargetPlatform == TargetPlatform.android && !kIsWeb) {
        return androidEmulatorUrl;
      }
      return localServerUrl;
    }
    return liveServerUrl;
  }

  static String get baseUrl => '$activeServerUrl/api';
  static String get socketUrl => activeServerUrl;

  static const String appName = 'Naavi';
  static const String tagline = 'River & Lake Boat Booking';

  static const List<String> boatCategories = [
    'MOTOR_BOAT',
    'MANUAL_ROW_BOAT',
    'LUXURY_BAJRA',
    'SPEED_BOAT',
    'EV_BOAT'
  ];

  static const List<String> tripTypes = [
    'FULL_TRIP',
    'HALF_TRIP',
    'CROSS_GHAT',
    'EVENT'
  ];
}
