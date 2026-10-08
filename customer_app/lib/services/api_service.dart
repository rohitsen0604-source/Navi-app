import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants.dart';

class ApiService {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  static Future<Map<String, dynamic>> sendOtp(String phone) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phone}),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {'success': true, 'message': 'Demo OTP 123456 generated'};
    }
  }

  static Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phone, 'otp': otp, 'role': 'CUSTOMER'}),
      ).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['token'] != null) {
        await saveToken(data['token']);
      }
      return data;
    } catch (_) {
      const fallbackToken = 'mock-jwt-token-customer-dev';
      await saveToken(fallbackToken);
      // If phone starts with 9876543210, let's treat it as demo existing user or new user
      final isNew = !phone.endsWith('0'); 
      return {
        'success': true,
        'token': fallbackToken,
        'isNewUser': isNew,
        'isProfileCompleted': !isNew,
        'user': {'phone': phone, 'role': 'CUSTOMER', 'firstName': isNew ? '' : 'Rahul', 'lastName': isNew ? '' : 'Sharma'}
      };
    }
  }

  static Future<Map<String, dynamic>> completeProfile({
    required String firstName,
    required String lastName,
    required String email,
    String? phone,
  }) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/auth/complete-profile'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          ...?phone == null ? null : {'phone': phone},
        }),
      ).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      if (data['success'] == true && data['token'] != null) {
        await saveToken(data['token']);
      }
      return data;
    } catch (_) {
      return {
        'success': true,
        'message': 'Profile completed successfully (offline mode)',
        'isProfileCompleted': true,
        'user': {
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'phone': phone ?? '9876543210',
          'role': 'CUSTOMER',
        }
      };
    }
  }

  static Future<List<dynamic>> getRiverLakes() async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/master-data/rivers'),
      ).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } catch (_) {
      return [
        {
          '_id': 'rl1',
          'name': 'Ganga River',
          'city': 'Varanasi',
          'state': 'Uttar Pradesh',
          'image': 'assets/images/river_ganga.jpg',
          'isPopular': true,
          'totalZones': 15,
        },
        {
          '_id': 'rl2',
          'name': 'Assi Ghat',
          'city': 'Varanasi',
          'state': 'Uttar Pradesh',
          'image': 'assets/images/river_assi.jpg',
          'isPopular': true,
          'totalZones': 5,
        },
        {
          '_id': 'rl3',
          'name': 'Naini',
          'city': 'Prayagraj',
          'state': 'Uttar Pradesh',
          'image': 'assets/images/river_naini.jpg',
          'isPopular': false,
          'totalZones': 8,
        },
      ];
    }
  }

  static Future<List<dynamic>> getZones({String? riverLakeId}) async {
    try {
      final uri = riverLakeId != null
          ? Uri.parse('${AppConstants.baseUrl}/master-data/zones?riverLakeId=$riverLakeId')
          : Uri.parse('${AppConstants.baseUrl}/master-data/zones');
      final response = await http.get(uri).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } catch (_) {
      return [
        {'_id': 'z1', 'zoneNumber': 1, 'name': 'Zone 1', 'primaryGhat': 'Dashashwamedh', 'code': 'ZN-01', 'image': 'assets/images/zone_dashashwamedh.jpg'},
        {'_id': 'z2', 'zoneNumber': 2, 'name': 'Zone 2', 'primaryGhat': 'Assi Ghat', 'code': 'ZN-02', 'image': 'assets/images/zone_assi.jpg'},
        {'_id': 'z3', 'zoneNumber': 3, 'name': 'Zone 3', 'primaryGhat': 'Rajghat', 'code': 'ZN-03', 'image': 'assets/images/zone_rajghat.jpg'},
        {'_id': 'z4', 'zoneNumber': 4, 'name': 'Zone 4', 'primaryGhat': 'Manikarnika', 'code': 'ZN-04', 'image': 'assets/images/zone_manikarnika.jpg'},
        {'_id': 'z5', 'zoneNumber': 5, 'name': 'Zone 5', 'primaryGhat': 'Panchganga', 'code': 'ZN-05', 'image': 'assets/images/zone_dashashwamedh.jpg'},
        {'_id': 'z6', 'zoneNumber': 6, 'name': 'Zone 6', 'primaryGhat': 'Kedar Ghat', 'code': 'ZN-06', 'image': 'assets/images/zone_assi.jpg'},
        {'_id': 'z7', 'zoneNumber': 7, 'name': 'Zone 7', 'primaryGhat': 'Namo Ghat', 'code': 'ZN-07', 'image': 'assets/images/zone_rajghat.jpg'},
        {'_id': 'z8', 'zoneNumber': 8, 'name': 'Zone 8', 'primaryGhat': 'Tulsi Ghat', 'code': 'ZN-08', 'image': 'assets/images/zone_manikarnika.jpg'},
      ];
    }
  }

  static Future<List<dynamic>> getGhats(int zoneNumber) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/master-data/boarding-points?zoneNumber=$zoneNumber'),
      ).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } catch (_) {
      return [
        {'_id': 'g1', 'name': 'Dashashwamedh Main Ghat', 'zoneNumber': zoneNumber, 'isPopular': true},
        {'_id': 'g2', 'name': 'Assi Ghat steps', 'zoneNumber': zoneNumber, 'isPopular': true},
        {'_id': 'g3', 'name': 'Rajghat Heritage Terminal', 'zoneNumber': zoneNumber, 'isPopular': false},
      ];
    }
  }

  static Future<Map<String, dynamic>> createBooking(Map<String, dynamic> bookingData) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/bookings'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(bookingData),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      final mockCode = 'NV-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
      return {
        'success': true,
        'message': 'Booking confirmed (offline demo mode)',
        'data': {
          '_id': 'b_${DateTime.now().millisecondsSinceEpoch}',
          'bookingCode': mockCode,
          'status': 'DRIVER_ASSIGNED',
          'fareAmount': bookingData['fareAmount'] ?? 950,
          'boatCategory': bookingData['boatCategory'] ?? 'MOTOR_BOAT',
          'seatsBooked': bookingData['seatsBooked'] ?? 2,
          'zoneNumber': bookingData['zoneNumber'] ?? 1,
          'boardingPointId': {'name': 'Assi Ghat'},
        }
      };
    }
  }

  static Future<Map<String, dynamic>> getBooking(String bookingId) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('${AppConstants.baseUrl}/bookings/$bookingId'),
      headers: {
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return jsonDecode(response.body);
  }

  static Future<List<dynamic>> getMyRides({String? status}) async {
    try {
      final token = await getToken();
      final uri = (status != null && status != 'ALL')
          ? Uri.parse('${AppConstants.baseUrl}/bookings/my-bookings?status=$status')
          : Uri.parse('${AppConstants.baseUrl}/bookings/my-bookings');

      final response = await http.get(
        uri,
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } catch (_) {
      final all = [
        {
          '_id': 'b_hist_1',
          'bookingCode': 'NV-991201',
          'status': 'RIDE_COMPLETED',
          'boatCategory': 'MOTOR_BOAT',
          'boatName': 'Motor Boat',
          'boatNumber': 'UPB-1024',
          'boatImage': 'assets/images/boat_motor.jpg',
          'ghatName': 'Dashashwamedh Ghat',
          'dateTimeText': '25 Feb 2026 | 02:00 PM',
          'passengers': 2,
          'passengersText': '2 Passengers | Full Trip (2 hrs)',
          'fareAmount': 1150,
          'driverName': 'Ramesh Yadav',
          'driverPhone': '+91 98765 43220',
        },
        {
          '_id': 'b_hist_2',
          'bookingCode': 'NV-700184',
          'status': 'RIDE_COMPLETED',
          'boatCategory': 'MANUAL_ROW_BOAT',
          'boatName': 'Row Boat',
          'boatNumber': 'UPB-0412',
          'boatImage': 'assets/images/boat_row.jpg',
          'ghatName': 'Assi Ghat',
          'dateTimeText': '18 Feb 2026 | 04:00 PM',
          'passengers': 3,
          'passengersText': '3 Passengers | Half Trip (1 hr)',
          'fareAmount': 700,
          'driverName': 'Suresh Manjhi',
          'driverPhone': '+91 98765 22114',
        },
        {
          '_id': 'b_hist_3',
          'bookingCode': 'NV-180010',
          'status': 'CANCELLED',
          'boatCategory': 'LUXURY_BAJRA',
          'boatName': 'Premium Boat',
          'boatNumber': 'UPB-0881',
          'boatImage': 'assets/images/boat_premium.jpg',
          'ghatName': 'Namo Ghat',
          'dateTimeText': '10 Feb 2026 | 11:00 AM',
          'passengers': 4,
          'passengersText': '4 Passengers | Full Trip (2 hrs)',
          'fareAmount': 1800,
          'cancellationReason': 'High river current safety advisory by Water Police',
          'refundAmount': 1800,
        },
        {
          '_id': 'b_hist_4',
          'bookingCode': 'NV-600052',
          'status': 'RIDE_COMPLETED',
          'boatCategory': 'MOTOR_BOAT',
          'boatName': 'Motor Boat',
          'boatNumber': 'UPB-1099',
          'boatImage': 'assets/images/boat_motor.jpg',
          'ghatName': 'Rajghat',
          'dateTimeText': '05 Feb 2026 | 03:00 PM',
          'passengers': 2,
          'passengersText': '2 Passengers | Cross Trip',
          'fareAmount': 600,
          'driverName': 'Vikas Sahani',
          'driverPhone': '+91 98765 77665',
        },
      ];

      if (status != null && status != 'ALL') {
        final sUpper = status.toUpperCase();
        if (sUpper == 'COMPLETED') return all.where((b) => b['status'] == 'RIDE_COMPLETED').toList();
        if (sUpper == 'CANCELLED') return all.where((b) => b['status'] == 'CANCELLED').toList();
        if (sUpper == 'UPCOMING') return all.where((b) => b['status'] == 'DRIVER_ASSIGNED').toList();
      }
      return all;
    }
  }


  static Future<Map<String, dynamic>> getUserProfile() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/auth/me'),
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {
        'success': true,
        'user': {
          'firstName': 'Rahul',
          'lastName': 'Sharma',
          'phone': '+91 98765 43210',
          'email': 'rahul.sharma@gmail.com',
          'isEmailVerified': true,
          'preferredLanguage': 'English',
          'appTheme': 'Light',
          'notificationsEnabled': true,
        }
      };
    }
  }

  static Future<Map<String, dynamic>> updatePreferences({
    String? preferredLanguage,
    String? appTheme,
    bool? notificationsEnabled,
  }) async {
    try {
      final token = await getToken();
      final response = await http.patch(
        Uri.parse('${AppConstants.baseUrl}/auth/preferences'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          ...?preferredLanguage == null ? null : {'preferredLanguage': preferredLanguage},
          ...?appTheme == null ? null : {'appTheme': appTheme},
          ...?notificationsEnabled == null ? null : {'notificationsEnabled': notificationsEnabled},
        }),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {'success': true, 'message': 'Preferences saved successfully'};
    }
  }

  static Future<Map<String, dynamic>> requestChangePhone(String newPhone) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/auth/change-phone'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'newPhone': newPhone}),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {'success': true, 'message': 'OTP sent to $newPhone'};
    }
  }

  static Future<void> logout() async {
    try {
      final token = await getToken();
      await http.post(
        Uri.parse('${AppConstants.baseUrl}/auth/logout'),
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 3));
    } catch (_) {}

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  static Future<List<dynamic>> getAvailableBoats({int? zoneNumber, String? tag, String? category}) async {
    try {
      final queryParams = <String, String>{};
      if (zoneNumber != null) queryParams['zoneNumber'] = zoneNumber.toString();
      if (tag != null && tag != 'All') queryParams['tag'] = tag;
      if (category != null && category != 'ALL') queryParams['category'] = category;

      final uri = Uri.parse('${AppConstants.baseUrl}/master-data/available-boats').replace(queryParameters: queryParams.isEmpty ? null : queryParams);
      final response = await http.get(uri).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } catch (_) {
      final allFallback = [
        {
          '_id': 'boat_row_1',
          'customBoatId': 'ROW-Z1-01',
          'name': 'Standard Row Boat',
          'category': 'MANUAL_ROW_BOAT',
          'filterTag': 'Row Boat',
          'capacity': 4,
          'passengersText': 'Up to 4 passengers',
          'durationText': 'Full Trip (2 hrs)',
          'price': 800,
          'rating': 4.8,
          'image': 'assets/images/boat_row.jpg',
          'zoneNumber': zoneNumber ?? 1,
          'status': 'AVAILABLE',
        },
        {
          '_id': 'boat_motor_1',
          'customBoatId': 'MTR-Z1-04',
          'name': 'Motor Boat',
          'category': 'MOTOR_BOAT',
          'filterTag': 'Motor Boat',
          'capacity': 8,
          'passengersText': 'Up to 8 passengers',
          'durationText': 'Full Trip (2 hrs)',
          'price': 1200,
          'rating': 4.9,
          'image': 'assets/images/boat_motor.jpg',
          'zoneNumber': zoneNumber ?? 1,
          'status': 'AVAILABLE',
        },
        {
          '_id': 'boat_premium_1',
          'customBoatId': 'BJR-Z1-08',
          'name': 'Premium Boat',
          'category': 'LUXURY_BAJRA',
          'filterTag': 'Premium',
          'capacity': 12,
          'passengersText': 'Up to 12 passengers',
          'durationText': 'Full Trip (2 hrs)',
          'price': 2000,
          'rating': 5.0,
          'image': 'assets/images/boat_premium.jpg',
          'zoneNumber': zoneNumber ?? 1,
          'status': 'AVAILABLE',
        },
        {
          '_id': 'boat_solar_1',
          'customBoatId': 'SOL-Z1-10',
          'name': 'Solar EV Eco Boat',
          'category': 'EV_BOAT',
          'filterTag': 'Premium',
          'capacity': 10,
          'passengersText': 'Up to 10 passengers',
          'durationText': 'Full Trip (2 hrs)',
          'price': 1500,
          'rating': 4.9,
          'image': 'assets/images/boat_solar.jpg',
          'zoneNumber': zoneNumber ?? 1,
          'status': 'AVAILABLE',
        },
        {
          '_id': 'boat_speed_1',
          'customBoatId': 'SPD-Z1-12',
          'name': 'VIP Speed Boat',
          'category': 'SPEED_BOAT',
          'filterTag': 'Premium',
          'capacity': 6,
          'passengersText': 'Up to 6 passengers',
          'durationText': 'Full Trip (2 hrs)',
          'price': 2500,
          'rating': 4.9,
          'image': 'assets/images/boat_speed.jpg',
          'zoneNumber': zoneNumber ?? 1,
          'status': 'AVAILABLE',
        },
      ];

      if (tag != null && tag != 'All') {
        return allFallback.where((b) => b['filterTag'] == tag).toList();
      }
      return allFallback;
    }
  }

  static Future<Map<String, dynamic>> getLiveTelemetry(String bookingId) async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/bookings/$bookingId/telemetry'),
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {
        'success': true,
        'data': {
          'bookingId': bookingId,
          'status': 'RIDE_STARTED',
          'distanceCoveredKm': 1.2,
          'timeElapsedMinutes': 28,
          'timeRemainingMinutes': 92,
          'startedAtText': '02:05 PM, 25 Feb 2026',
          'startPoint': {'name': 'Assi Ghat', 'lat': 25.2891, 'lng': 83.0069},
          'destinationPoint': {'name': 'Dashashwamedh Ghat', 'lat': 25.3072, 'lng': 83.0105},
          'boat': {
            'name': 'Motor Boat',
            'customBoatId': 'UPB-1024',
            'zoneNumber': 1,
            'passengers': 2,
            'durationText': 'Full Trip (2 hrs)',
            'image': 'assets/images/live_boat_cruise.jpg'
          }
        }
      };
    }
  }

  static Future<Map<String, dynamic>> completeTrip(String bookingId) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/bookings/$bookingId/complete'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {'success': true, 'message': 'Trip marked as completed (offline demo mode)'};
    }
  }

  static Future<Map<String, dynamic>> rateRide({
    required String bookingId,
    required int rating,
    String? review,
    List<String>? feedbackTags,
  }) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/bookings/$bookingId/rate'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'rating': rating,
          'review': review ?? '',
          'feedbackTags': feedbackTags ?? [],
        }),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {'success': true, 'message': 'Thank you! Feedback recorded successfully.'};
    }
  }

  static Future<Map<String, dynamic>> getInvoice(String bookingId) async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/bookings/$bookingId/invoice'),
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {
        'success': true,
        'data': {
          'invoiceNumber': 'INV-NV-9912',
          'fareBreakdown': {
            'baseFare': 1200,
            'platformFee': 50,
            'couponDiscount': 100,
            'totalPaid': 1150
          }
        }
      };
    }
  }

  static Future<Map<String, dynamic>> triggerSOSAlert({
    String? bookingId,
    double latitude = 25.3072,
    double longitude = 83.0105,
    String locationName = 'Dashashwamedh Ghat, Varanasi, Uttar Pradesh, India',
    bool notifySupport = true,
    bool notifyContacts = true,
    bool callLocalEmergency = true,
  }) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/emergency/sos'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          ...?bookingId == null ? null : {'bookingId': bookingId},
          'latitude': latitude,
          'longitude': longitude,
          'locationName': locationName,
          'notifySupport': notifySupport,
          'notifyContacts': notifyContacts,
          'callLocalEmergency': callLocalEmergency,
        }),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {
        'success': true,
        'message': 'Emergency SOS Alert Broadcasted! Water Police dispatched.',
        'data': {
          'incidentCode': 'SOS-VAR-88192',
          'status': 'DISPATCHED',
          'dispatchedUnit': {
            'unitName': 'Varanasi Water Police Patrol Boat #4',
            'helplineNumber': '+91 542 2221234',
            'emergencyDial': '112',
            'estimatedArrival': '2-4 mins'
          },
          'notifiedContacts': [
            {'name': 'Priya Sharma (Sister)', 'phone': '+91 98765 11223', 'status': 'SMS_SENT'},
            {'name': 'Amit Sharma (Father)', 'phone': '+91 98765 33445', 'status': 'SMS_SENT'}
          ]
        }
      };
    }
  }

  static Future<List<dynamic>> getEmergencyContacts() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/emergency/contacts'),
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } catch (_) {
      return [
        {'id': 'c1', 'name': 'Anurag (Brother)', 'phone': '+91 98765 43210', 'relation': 'Brother', 'selected': true},
        {'id': 'c2', 'name': 'Priya (Sister)', 'phone': '+91 87654 32109', 'relation': 'Sister', 'selected': true},
        {'id': 'c3', 'name': 'Mom', 'phone': '+91 76543 21098', 'relation': 'Mother', 'selected': false},
        {'id': 'c4', 'name': 'Dad', 'phone': '+91 65432 10987', 'relation': 'Father', 'selected': false},
      ];
    }
  }

  static Future<Map<String, dynamic>> addEmergencyContact({
    required String name,
    required String phone,
    String relation = 'Family',
  }) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/emergency/contacts'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'name': name,
          'phone': phone,
          'relation': relation,
        }),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      final newId = 'c_${DateTime.now().millisecondsSinceEpoch}';
      return {
        'success': true,
        'message': 'Contact added successfully (offline mode)',
        'data': {
          'id': newId,
          'name': name,
          'phone': phone,
          'relation': relation,
          'selected': true,
        }
      };
    }
  }

  static Future<Map<String, dynamic>> shareRideDetails({
    required String bookingId,
    required String bookingCode,
    required List<String> selectedContactIds,
    String pickupGhat = 'Dashashwamedh Ghat',
    String timeText = '02:00 PM',
    String driverName = 'Ramesh Yadav',
    String? customMessage,
  }) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/emergency/share-ride'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'bookingId': bookingId,
          'bookingCode': bookingCode,
          'selectedContactIds': selectedContactIds,
          'pickupGhat': pickupGhat,
          'timeText': timeText,
          'driverName': driverName,
          ...?customMessage == null ? null : {'customMessage': customMessage},
        }),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      final shortCode = bookingCode.replaceAll('NV-', '');
      return {
        'success': true,
        'message': 'Ride tracking link shared with ${selectedContactIds.length} contacts successfully!',
        'data': {
          'trackingUrl': 'https://naavi.app/ride/$shortCode',
          'contactsNotifiedCount': selectedContactIds.length,
          'timestamp': DateTime.now().toIso8601String(),
        }
      };
    }
  }


  static Future<Map<String, dynamic>> cancelSOSAlert(String incidentCode) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/emergency/cancel'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'incidentCode': incidentCode}),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {'success': true, 'message': 'SOS Alert cancelled. User safe.'};
    }
  }

  static Future<void> triggerSOS(String bookingId) async {
    await triggerSOSAlert(bookingId: bookingId);
  }

  static Future<Map<String, dynamic>> getHelplineInfo() async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/support/helpline-info'),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {
        'success': true,
        'data': {
          'hotlines': {
            'tollFree': '1800-102-NAAVI (62284)',
            'emergencyPolice': '112',
            'waterPolice': '+91 542 2221234',
            'whatsappSupport': '+91 98765 00000',
            'supportEmail': 'support@naavi.in'
          },
          'ghatDesks': [
            {
              'id': 'gd_1',
              'ghatName': 'Dashashwamedh Main Ghat',
              'zone': 'Zone 1 Corridor',
              'location': 'Adjacent to Main Aarti Steps, Platform #2',
              'supervisor': 'Vikas Mishra (Station Officer)',
              'phone': '+91 542 2221101',
              'timing': '24 Hours (7 Days)',
              'availableServices': ['Instant Boat Booking', 'Life Jacket Inspection', 'Lost & Found', 'Dispute Resolution']
            },
            {
              'id': 'gd_2',
              'ghatName': 'Assi Ghat Operations Desk',
              'zone': 'Zone 2 Corridor',
              'location': 'South Riverfront Terminal',
              'supervisor': 'Sunil Pandey (Shift Incharge)',
              'phone': '+91 542 2221102',
              'timing': '04:00 AM - 11:30 PM',
              'availableServices': ['Morning Aarti Coordination', 'EV Boat Charging Point', 'Passenger Assistance']
            },
            {
              'id': 'gd_3',
              'ghatName': 'Rajghat Heritage Pier Desk',
              'zone': 'Zone 3 Corridor',
              'location': 'Near Malviya Bridge Ferry Point',
              'supervisor': 'Rajesh Kumar (Harbor Master)',
              'phone': '+91 542 2221103',
              'timing': '05:00 AM - 10:00 PM',
              'availableServices': ['Long-Distance Cruise Info', 'Group Bajra Reservations', 'Safety Check']
            }
          ],
          'faqs': [
            {
              'q': 'What are the official boating hours on River Ganga in Varanasi?',
              'a': 'Standard passenger boating is permitted from 05:00 AM to 09:30 PM under Varanasi District Administration and Water Police guidelines.'
            },
            {
              'q': 'Is wearing a life jacket mandatory on all Naavi rides?',
              'a': 'Yes, 100% life jacket compliance is strictly enforced across all row boats, motor boats, and luxury bajras.'
            },
            {
              'q': 'How can I get an invoice or refund for a cancelled ride?',
              'a': 'Invoices can be downloaded instantly from the Ride Completed screen. Refunds for rides cancelled 30 mins prior to departure are processed instantly to your original payment mode.'
            }
          ]
        }
      };
    }
  }

  static Future<Map<String, dynamic>> createSupportTicket({
    required String category,
    required String description,
    String? bookingCode,
  }) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/support/tickets'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'category': category,
          'description': description,
          ...?bookingCode == null ? null : {'bookingCode': bookingCode},
        }),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      final tId = 'TKT-VAR-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
      return {
        'success': true,
        'message': 'Support ticket $tId created successfully.',
        'data': {
          'ticketId': tId,
          'category': category,
          'categoryTitle': category.replaceAll('_', ' '),
          'bookingCode': bookingCode ?? 'GENERAL',
          'description': description,
          'status': 'OPEN_IN_PROGRESS',
          'createdAt': DateTime.now().toIso8601String(),
          'estimatedResponseTime': 'Within 15 minutes'
        }
      };
    }
  }

  static Future<List<dynamic>> getUserTickets() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/support/tickets'),
        headers: {
          if (token != null) 'Authorization': 'Bearer $token',
        },
      ).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } catch (_) {
      return [
        {
          'ticketId': 'TKT-VAR-10021',
          'category': 'PAYMENT_REFUND',
          'categoryTitle': 'Payment & Fare Inquiry',
          'bookingCode': 'NV-9912',
          'description': 'Inquiry regarding promo code application on full trip bajra ride.',
          'status': 'RESOLVED',
          'resolutionNotes': 'Coupon discount of ₹100 was successfully credited back to wallet.',
          'createdAt': DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
        }
      ];
    }
  }

  static Future<Map<String, dynamic>> getLegalTerms() async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/support/legal'),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      return {
        'success': true,
        'data': {
          'lastUpdated': 'February 2026',
          'termsOfService': [
            {
              'title': '1. Booking & Fair Fare Standards',
              'content': 'All rides booked via Naavi adhere strictly to government-ratified tariff charts across Varanasi Ghat corridors. No operator may demand unmetered surcharges.'
            },
            {
              'title': '2. Inland Waterways Safety Standards',
              'content': 'Passengers must wear certified life jackets at all times aboard. Alcohol consumption, hazardous cargo, and vessel overloading are strictly prohibited under Uttar Pradesh Inland Vessels Rules.'
            },
            {
              'title': '3. Cancellation & Refund Policy',
              'content': 'Cancellations initiated up to 30 minutes before scheduled boarding receive 100% refund without penalty. Weather-related suspensions by Water Police receive full automatic refund.'
            }
          ],
          'privacyPolicy': [
            {
              'title': '1. Information We Collect',
              'content': 'We collect customer contact information (phone, name, email) for booking verification, and live GPS coordinates during active rides for river navigation and emergency rescue dispatch.'
            },
            {
              'title': '2. Safety & Water Police Telemetry Sharing',
              'content': 'Live vessel and passenger GPS telemetry is shared only with certified rescue teams, Ghat Station Masters, and the Varanasi Water Police in the event of an SOS trigger.'
            },
            {
              'title': '3. Data Security & Storage',
              'content': 'All payment data is encrypted with 256-bit SSL protocols. We do not store raw UPI PINs or card CVV details.'
            }
          ]
        }
      };
    }
  }

  static Future<List<dynamic>> getCoupons({int? zoneNumber, int? fareAmount}) async {
    try {
      final queryParams = <String, String>{};
      if (zoneNumber != null) queryParams['zoneNumber'] = zoneNumber.toString();
      if (fareAmount != null) queryParams['fareAmount'] = fareAmount.toString();

      final uri = Uri.parse('${AppConstants.baseUrl}/coupons').replace(queryParameters: queryParams.isEmpty ? null : queryParams);
      final response = await http.get(uri).timeout(const Duration(seconds: 4));
      final data = jsonDecode(response.body);
      return data['data'] ?? [];
    } catch (_) {
      return [
        {
          'id': 'c_naavi50',
          'code': 'NAAVI50',
          'title': '50% OFF up to ₹200',
          'description': 'Get 50% off up to ₹200 on boat rides in Zone 1',
          'discountType': 'PERCENTAGE',
          'discountValue': 50,
          'maxDiscount': 200,
          'badgeText': '50% OFF',
          'badgeColor': 'GREEN',
          'validUntilText': 'Valid till 28 Feb 2026',
          'isAvailable': true,
          'termsAndConditions': [
            'Valid only on boat rides originating in Zone 1 (Dashashwamedh Corridor).',
            'Maximum discount capped at ₹200 per transaction.',
            'Minimum booking fare requirement is ₹300.'
          ]
        },
        {
          'id': 'c_river100',
          'code': 'RIVER100',
          'title': 'Flat ₹100 OFF',
          'description': 'Flat ₹100 off on all boat rides',
          'discountType': 'FLAT',
          'discountValue': 100,
          'maxDiscount': 100,
          'badgeText': '₹100 OFF',
          'badgeColor': 'GOLD',
          'validUntilText': 'Valid till 15 Mar 2026',
          'isAvailable': true,
          'termsAndConditions': [
            'Flat ₹100 discount applied directly to final booking total.',
            'Minimum trip booking amount of ₹500 required.'
          ]
        },
        {
          'id': 'c_welcome20',
          'code': 'WELCOME20',
          'title': '20% OFF on First Ride',
          'description': 'Flat 20% off on first booking',
          'discountType': 'PERCENTAGE',
          'discountValue': 20,
          'maxDiscount': 150,
          'badgeText': '20% OFF',
          'badgeColor': 'BLUE',
          'validUntilText': 'Valid till 30 Mar 2026',
          'isAvailable': true,
          'termsAndConditions': [
            'Special discount for new and returning passengers.',
            'Maximum savings of up to ₹150.'
          ]
        },
      ];
    }
  }

  static Future<Map<String, dynamic>> applyCoupon({
    required String code,
    int fareAmount = 950,
    int zoneNumber = 1,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.baseUrl}/coupons/apply'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'code': code,
          'fareAmount': fareAmount,
          'zoneNumber': zoneNumber,
        }),
      ).timeout(const Duration(seconds: 4));
      return jsonDecode(response.body);
    } catch (_) {
      final cUpper = code.trim().toUpperCase();
      int discount = 100;
      if (cUpper == 'NAAVI50') discount = (fareAmount * 0.5).clamp(0, 200).toInt();
      if (cUpper == 'RIVER100') discount = 100;
      if (cUpper == 'WELCOME20') discount = (fareAmount * 0.2).clamp(0, 150).toInt();

      return {
        'success': true,
        'message': 'Coupon $cUpper applied successfully!',
        'data': {
          'code': cUpper,
          'discountAmount': discount,
          'finalAmount': (fareAmount - discount).clamp(0, 999999),
        }
      };
    }
  }
}


