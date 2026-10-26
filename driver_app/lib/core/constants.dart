import 'package:flutter/foundation.dart';

class AppConstants {
  static const String liveServerUrl = 'https://naavibackend.onrender.com';
  static const String localServerUrl = 'http://localhost:5000';
  static const String androidEmulatorUrl = 'http://10.0.2.2:5000';

  // Set to true to connect directly to the deployed Render backend
  static const bool useLiveBackend = true;

  static String? _customServerUrl;
  static void setServerUrl(String? url) => _customServerUrl = url;

  // Automatically points to live Render server, or local when useLiveBackend is false
  static String get activeServerUrl {
    if (_customServerUrl != null && _customServerUrl!.isNotEmpty) {
      return _customServerUrl!;
    }
    if (useLiveBackend) {
      return liveServerUrl;
    }
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

  static const String appName = 'Naavi Driver Partner';
  static const String tagline = 'Boatman & Waterway Partner Fleet';
}

