import 'package:flutter/material.dart';

class AppTheme {
  static const Color primary = Color(0xFFEB4D37); // Naavi Sunrise Coral
  static const Color primaryDark = Color(0xFFD43823);
  static const Color accent = Color(0xFFF97316); // Sunset Amber Accent
  static const Color warmLight = Color(0xFFFFF1EE);
  static const Color warmBorder = Color(0xFFFFD5CE);
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Colors.white;
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color danger = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        primary: primary,
        secondary: accent,
        surface: surface,
      ),
      scaffoldBackgroundColor: background,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: textPrimary),
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
          textStyle: const TextStyle(
            fontSize: 16.5,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.3,
          ),
        ),
      ),
    );
  }
}

