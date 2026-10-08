import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants.dart';

class DriverApiService {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('driver_token');
  }

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('driver_token', token);
  }

  static Future<Map<String, dynamic>> sendOtp(String phone) async {
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/auth/send-otp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phone': phone}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/auth/verify-otp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'phone': phone, 'otp': otp, 'role': 'DRIVER'}),
    );
    final data = jsonDecode(response.body);
    if (data['success'] == true && data['token'] != null) {
      await saveToken(data['token']);
    }
    return data;
  }

  static Future<Map<String, dynamic>> toggleDuty() async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/drivers/toggle-duty'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> getDashboard() async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('${AppConstants.baseUrl}/drivers/dashboard'),
      headers: {
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> acceptBooking(String bookingId) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/drivers/accept'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'bookingId': bookingId}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> rejectBooking(String bookingId) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/drivers/reject'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'bookingId': bookingId}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> startRide(String bookingId) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/drivers/start-ride'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'bookingId': bookingId}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> completeRide(String bookingId, double cashCollected) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('${AppConstants.baseUrl}/drivers/complete-ride'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'bookingId': bookingId, 'cashCollected': cashCollected}),
    );
    return jsonDecode(response.body);
  }
}
