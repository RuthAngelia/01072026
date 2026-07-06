import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/landing_page_models.dart';
import '../../services/storage_service.dart';
import '../../services/mock_templates.dart';

// Provider for active selected project data
final activeProjectProvider = StateNotifierProvider<ActiveProjectNotifier, LandingPageData>((ref) {
  return ActiveProjectNotifier();
});

class ActiveProjectNotifier extends StateNotifier<LandingPageData> {
  final StorageService _storage = StorageService();
  Timer? _autoSaveTimer;

  // History for Undo/Redo
  final List<LandingPageData> _undoStack = [];
  final List<LandingPageData> _redoStack = [];

  ActiveProjectNotifier() : super(LandingPageData.initial()) {
    // Start auto save check
    _autoSaveTimer = Timer.periodic(const Duration(seconds: 5), (_) => _autoSave());
  }

  void loadProject(LandingPageData project) {
    _undoStack.clear();
    _redoStack.clear();
    state = project;
  }

  void updateState(LandingPageData newState) {
    // Add current to undo stack
    if (_undoStack.isEmpty || _undoStack.last.toRawJson() != state.toRawJson()) {
      _undoStack.add(state);
      if (_undoStack.length > 30) _undoStack.removeAt(0); // Cap history
    }
    _redoStack.clear();
    state = newState;
  }

  void undo() {
    if (_undoStack.isEmpty) return;
    final prev = _undoStack.removeLast();
    _redoStack.add(state);
    state = prev;
  }

  void redo() {
    if (_redoStack.isEmpty) return;
    final next = _redoStack.removeLast();
    _undoStack.add(state);
    state = next;
  }

  bool get canUndo => _undoStack.isNotEmpty;
  bool get canRedo => _redoStack.isNotEmpty;

  void _autoSave() {
    _storage.saveProject(state);
  }

  Future<void> forceSave() async {
    await _storage.saveProject(state);
  }

  @override
  void dispose() {
    _autoSaveTimer?.cancel();
    super.dispose();
  }
}

// Provider for list of all projects
final projectsListProvider = StateNotifierProvider<ProjectsListNotifier, List<LandingPageData>>((ref) {
  return ProjectsListNotifier(ref);
});

class ProjectsListNotifier extends StateNotifier<List<LandingPageData>> {
  final StorageService _storage = StorageService();
  final Ref _ref;

  ProjectsListNotifier(this._ref) : super([]) {
    refresh();
  }

  void refresh() {
    state = _storage.getAllProjects();
  }

  Future<void> createNewProject(String name) async {
    final newId = DateTime.now().millisecondsSinceEpoch.toString();
    final newProjectData = LandingPageData.initial().copyWith(
      project: Project(
        id: newId,
        name: name,
        createdAt: DateTime.now().toIso8601String(),
        updatedAt: DateTime.now().toIso8601String(),
      ),
    );
    await _storage.saveProject(newProjectData);
    refresh();
    _ref.read(activeProjectProvider.notifier).loadProject(newProjectData);
  }

  Future<void> duplicateProject(LandingPageData data) async {
    final dupId = DateTime.now().millisecondsSinceEpoch.toString();
    final dupData = data.copyWith(
      project: Project(
        id: dupId,
        name: '${data.project.name} (Copy)',
        createdAt: DateTime.now().toIso8601String(),
        updatedAt: DateTime.now().toIso8601String(),
      ),
    );
    await _storage.saveProject(dupData);
    refresh();
  }

  Future<void> deleteProject(String id) async {
    await _storage.deleteProject(id);
    refresh();
    // If active was deleted, load a fallback
    final active = _ref.read(activeProjectProvider);
    if (active.project.id == id) {
      if (state.isNotEmpty) {
        _ref.read(activeProjectProvider.notifier).loadProject(state.first);
      } else {
        final initial = LandingPageData.initial();
        await _storage.saveProject(initial);
        refresh();
        _ref.read(activeProjectProvider.notifier).loadProject(initial);
      }
    }
  }

  Future<void> importProjectJson(String rawJson) async {
    try {
      final imported = LandingPageData.fromRawJson(rawJson);
      final uniqueId = DateTime.now().millisecondsSinceEpoch.toString();
      final finalData = imported.copyWith(
        project: imported.project.copyWith(
          id: uniqueId,
          name: '${imported.project.name} (Imported)',
          updatedAt: DateTime.now().toIso8601String(),
        ),
      );
      await _storage.saveProject(finalData);
      refresh();
      _ref.read(activeProjectProvider.notifier).loadProject(finalData);
    } catch (_) {
      rethrow;
    }
  }
}

final designSuggestionsProvider = Provider<List<LandingPageData>>((ref) {
  final activeData = ref.watch(activeProjectProvider);
  
  // Dynamically import templates database
  final templatesList = MockTemplates.templates;
  final suggestions = <LandingPageData>[];
  
  for (int i = 0; i < 8; i++) {
    final idx = (i * 6) % templatesList.length;
    final temp = templatesList[idx];
    
    final brandOverride = activeData.brand.copyWith(
      primaryColor: temp.primaryColor,
      secondaryColor: temp.secondaryColor,
      backgroundColor: temp.backgroundColor,
      textColor: temp.textColor,
      borderRadius: temp.borderRadius,
      fontHeading: temp.fontHeading,
      fontBody: temp.fontBody,
      buttonStyle: temp.buttonStyle,
    );
    
    suggestions.add(
      activeData.copyWith(
        brand: brandOverride,
        selectedTemplateId: temp.id,
      ),
    );
  }
  return suggestions;
});
