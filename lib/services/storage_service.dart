import 'package:hive_flutter/hive_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/landing_page_models.dart';

class StorageService {
  static const String _projectsBoxName = 'projects';
  static const String _settingsThemeKey = 'theme_mode';

  late final Box _projectsBox;
  late final SharedPreferences _prefs;

  // Singleton instance
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  Future<void> init() async {
    await Hive.initFlutter();
    _projectsBox = await Hive.openBox(_projectsBoxName);
    _prefs = await SharedPreferences.getInstance();
  }

  // Save project
  Future<void> saveProject(LandingPageData data) async {
    final updatedData = data.copyWith(
      project: data.project.copyWith(
        updatedAt: DateTime.now().toIso8601String(),
      ),
    );
    await _projectsBox.put(updatedData.project.id, updatedData.toRawJson());
  }

  // Get project by ID
  LandingPageData? getProject(String id) {
    final raw = _projectsBox.get(id) as String?;
    if (raw == null) return null;
    return LandingPageData.fromRawJson(raw);
  }

  // Get all projects
  List<LandingPageData> getAllProjects() {
    final list = <LandingPageData>[];
    for (var key in _projectsBox.keys) {
      final raw = _projectsBox.get(key) as String?;
      if (raw != null) {
        list.add(LandingPageData.fromRawJson(raw));
      }
    }
    // Sort by updated time desc
    list.sort((a, b) => b.project.updatedAt.compareTo(a.project.updatedAt));
    return list;
  }

  // Delete project
  Future<void> deleteProject(String id) async {
    await _projectsBox.delete(id);
  }

  // Theme settings
  bool isDarkMode() {
    return _prefs.getBool(_settingsThemeKey) ?? false;
  }

  Future<void> setDarkMode(bool value) async {
    await _prefs.setBool(_settingsThemeKey, value);
  }
}
