import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppThemeGen {
  AppThemeGen._();

  static const Color primary = Color(0xFF5F8575);     // Sage Green
  static const Color secondary = Color(0xFFD97D64);   // Terracotta
  static const Color accent = Color(0xFFE6C280);      // Soft Gold

  static const Color bgLight = Color(0xFFF4F1EA);     // Sand
  static const Color bgDark = Color(0xFF162520);      // Dark Forest
  static const Color cardLight = Color(0xFFFBFBF9);   // Cream
  static const Color cardDark = Color(0xFF21362F);    // Dark Sage Card

  // Creative gradients (Warm / Organic)
  static const LinearGradient premiumGradient = LinearGradient(
    colors: [primary, secondary, accent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static ThemeData themeData(bool isDark) {
    final background = isDark ? bgDark : bgLight;
    final card = isDark ? cardDark : cardLight;
    final textTheme = isDark ? ThemeData.dark().textTheme : ThemeData.light().textTheme;

    return ThemeData(
      useMaterial3: true,
      brightness: isDark ? Brightness.dark : Brightness.light,
      colorSchemeSeed: primary,
      scaffoldBackgroundColor: background,
      cardColor: card,
      textTheme: GoogleFonts.plusJakartaSansTextTheme(textTheme),
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        iconTheme: IconThemeData(color: isDark ? Colors.white : bgDark),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: card,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(color: isDark ? Colors.white.withOpacity(0.06) : Colors.grey.shade200),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: isDark ? Colors.white.withOpacity(0.04) : Colors.grey.shade50,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: isDark ? Colors.white.withOpacity(0.1) : Colors.grey.shade200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: isDark ? Colors.white.withOpacity(0.1) : Colors.grey.shade200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
      ),
    );
  }

  // Organic Dot Pattern Overlay
  static Widget gridPattern() {
    return Positioned.fill(
      child: CustomPaint(
        painter: DotPainter(),
      ),
    );
  }
}

class DotPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFD97D64).withOpacity(0.06)
      ..style = PaintingStyle.fill;

    const step = 28.0;

    for (double x = 14; x < size.width; x += step) {
      for (double y = 14; y < size.height; y += step) {
        canvas.drawCircle(Offset(x, y), 1.5, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
