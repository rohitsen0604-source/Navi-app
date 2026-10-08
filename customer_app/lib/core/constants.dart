class AppConstants {

  static const String liveServerUrl = 'https://navi-app-8vqo.onrender.com';

  static String get baseUrl => '$liveServerUrl/api';
  static String get socketUrl => liveServerUrl;

  
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
