import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/storage_service.dart';

final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, bool>((ref) {
  return ThemeModeNotifier();
});

class ThemeModeNotifier extends StateNotifier<bool> {
  final StorageService _storage = StorageService();

  ThemeModeNotifier() : super(false) {
    state = _storage.isDarkMode();
  }

  void toggleTheme() {
    state = !state;
    _storage.setDarkMode(state);
  }
}

// Track active view state on screen (e.g. 'Dashboard', 'Projects', 'Editor', 'Settings')
final activeViewProvider = StateProvider<String>((ref) => 'Workspace');

// Track active editor step tab index
final activeEditorTabProvider = StateProvider<int>((ref) => 0);

// Track selected preview device frame: 'Desktop', 'Tablet', 'Mobile'
final previewDeviceProvider = StateProvider<String>((ref) => 'Desktop');
