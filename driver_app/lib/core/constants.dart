import 'package:flutter/foundation.dart';

class AppConstants {
  // Automatically detects platform:
  // - Chrome / Web / Windows / macOS / iOS: http://localhost:5000/api
  // - Android Emulator: http://10.0.2.2:5000/api
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:5000/api';
    return defaultTargetPlatform == TargetPlatform.android
        ? 'http://10.0.2.2:5000/api'
        : 'http://localhost:5000/api';
  }

  static String get socketUrl {
    if (kIsWeb) return 'http://localhost:5000';
    return defaultTargetPlatform == TargetPlatform.android
        ? 'http://10.0.2.2:5000'
        : 'http://localhost:5000';
  }
  
  static const String appName = 'Naavi Driver';
}
