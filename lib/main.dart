import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'services/storage_service.dart';
import 'core/theme/app_theme_gen.dart';
import 'core/providers/settings_provider.dart';
import 'features/main_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize storage databases
  await StorageService().init();

  runApp(
    const ProviderScope(
      child: LandingPageGeneratorApp(),
    ),
  );
}

class LandingPageGeneratorApp extends ConsumerWidget {
  const LandingPageGeneratorApp({Key? key}) : super(key: key);

  static final GoRouter _router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const MainScreen(),
      ),
    ],
  );

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = ref.watch(themeModeProvider);

    return MaterialApp.router(
      title: 'LPGene - LandingPage Generator',
      debugShowCheckedModeBanner: false,
      theme: AppThemeGen.themeData(false),
      darkTheme: AppThemeGen.themeData(true),
      themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
      routerConfig: _router,
    );
  }
}
