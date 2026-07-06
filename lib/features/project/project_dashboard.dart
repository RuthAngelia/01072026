import 'dart:convert';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import '../../core/providers/project_provider.dart';
import '../../core/providers/settings_provider.dart';
import '../../models/landing_page_models.dart';
import '../../core/theme/app_theme_gen.dart';
import '../../services/mock_templates.dart';

class ProjectDashboard extends ConsumerWidget {
  const ProjectDashboard({Key? key}) : super(key: key);

  Future<void> _importProject(BuildContext context, WidgetRef ref) async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['json'],
    );
    if (result != null && result.files.single.bytes != null) {
      final raw = utf8.decode(result.files.single.bytes!);
      try {
        await ref.read(projectsListProvider.notifier).importProjectJson(raw);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Project imported successfully!')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Import failed: $e')),
        );
      }
    }
  }

  void _showNewProjectDialog(BuildContext context, WidgetRef ref) {
    final controller = TextEditingController(text: 'Landing Page Baru');
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Buat Project Baru'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            labelText: 'Nama Project',
            hintText: 'e.g. Landing Page Ebook',
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            onPressed: () {
              if (controller.text.trim().isNotEmpty) {
                ref.read(projectsListProvider.notifier).createNewProject(controller.text.trim());
                ref.read(activeViewProvider.notifier).state = 'Visual Canvas';
                Navigator.of(context).pop();
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppThemeGen.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Buat'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final projects = ref.watch(projectsListProvider);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final width = MediaQuery.of(context).size.width;
    final isCompact = width < 1200;

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          AppThemeGen.gridPattern(),
          SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(40, 32, 40, 120), // Bottom padding for dock space
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Bento Hero Banner with stats
                _buildHeroBanner(context, ref, projects.length, isDark),
                const SizedBox(height: 40),

                // 2. Main layout grid split
                isCompact
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildMainWorkspace(context, ref, projects, isDark),
                          const SizedBox(height: 40),
                          _buildAccessorySidebar(context, ref, isDark),
                        ],
                      )
                    : Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 7,
                            child: _buildMainWorkspace(context, ref, projects, isDark),
                          ),
                          const SizedBox(width: 40),
                          Expanded(
                            flex: 3,
                            child: _buildAccessorySidebar(context, ref, isDark),
                          ),
                        ],
                      ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Bento Hero Banner Widget with Sage & Terracotta accents
  Widget _buildHeroBanner(BuildContext context, WidgetRef ref, int totalProjects, bool isDark) {
    final theme = Theme.of(context);
    return ClipRRect(
      borderRadius: BorderRadius.circular(28),
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppThemeGen.primary.withOpacity(isDark ? 0.35 : 0.9),
              AppThemeGen.secondary.withOpacity(isDark ? 0.25 : 0.8),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          border: Border.all(
            color: const Color(0xFF5F8575).withOpacity(0.2),
            width: 1.5,
          ),
        ),
        child: Stack(
          children: [
            // Abstract warm glow blob
            Positioned(
              right: -40,
              top: -40,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppThemeGen.accent.withOpacity(0.25),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(48),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white24,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          '🎨 CREATIVE WORKSPACE',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Build beautiful landing pages\nwithout writing code.',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 36,
                      fontWeight: FontWeight.w900,
                      height: 1.1,
                      letterSpacing: -1.0,
                    ),
                  ),
                  const SizedBox(height: 36),
                  Row(
                    children: [
                      ElevatedButton.icon(
                        onPressed: () => _showNewProjectDialog(context, ref),
                        icon: const Icon(Icons.add_circle_outline),
                        label: const Text('New Project'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: AppThemeGen.primary,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                      ),
                      const SizedBox(width: 16),
                      OutlinedButton.icon(
                        onPressed: () => _importProject(context, ref),
                        icon: const Icon(Icons.drive_folder_upload, color: Colors.white),
                        label: const Text('Import Canvas', style: TextStyle(color: Colors.white)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Colors.white38, width: 1.5),
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 48),
                  // Statistics Bento elements
                  Row(
                    children: [
                      _buildHeroStat('$totalProjects Active', 'Projects', isDark),
                      _buildStatDivider(),
                      _buildHeroStat('4 Presets', 'Templates', isDark),
                      _buildStatDivider(),
                      _buildHeroStat('28 Total', 'Exports', isDark),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroStat(String title, String label, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
        ),
        Text(
          label,
          style: TextStyle(color: isDark ? Colors.white60 : Colors.white70, fontSize: 11),
        ),
      ],
    );
  }

  Widget _buildStatDivider() {
    return Container(
      height: 24,
      width: 1,
      color: Colors.white30,
      margin: const EdgeInsets.symmetric(horizontal: 24),
    );
  }

  // Left Panel Workspace
  Widget _buildMainWorkspace(BuildContext context, WidgetRef ref, List<LandingPageData> projects, bool isDark) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Horizontal Template Carousel Title
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Featured Templates',
              style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900, letterSpacing: -0.5),
            ),
            TextButton.icon(
              onPressed: () {
                ref.read(activeViewProvider.notifier).state = 'Templates Gallery';
              },
              icon: const Icon(Icons.arrow_forward, size: 16, color: AppThemeGen.secondary),
              label: const Text('All Presets', style: TextStyle(color: AppThemeGen.secondary, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
        const SizedBox(height: 18),
        // Horizontal Carousel
        SizedBox(
          height: 200,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              _buildHorizontalTemplate(
                context,
                ref,
                title: 'Ebook Creator Stack',
                desc: 'Dirancang khusus untuk penjualan produk digital, lengkap dengan timeline bonus.',
                gradient: const [Color(0xFF5F8575), Color(0xFFD97D64)],
                category: 'Ebook',
                difficulty: 'Easy',
              ),
              const SizedBox(width: 16),
              _buildHorizontalTemplate(
                context,
                ref,
                title: 'SaaS Alpha Waitlist',
                desc: 'Desain minimalis dengan form pendaftaran newsletter dan list brand logo.',
                gradient: const [Color(0xFFD97D64), Color(0xFFE6C280)],
                category: 'SaaS',
                difficulty: 'Popular',
              ),
              const SizedBox(width: 16),
              _buildHorizontalTemplate(
                context,
                ref,
                title: 'Live Workshop Ticket',
                desc: 'Dilengkapi pricing coret detail serta FAQ objection terintegrasi.',
                gradient: const [Color(0xFFE6C280), Color(0xFF5F8575)],
                category: 'Course',
                difficulty: 'Pro',
              ),
            ],
          ),
        ),
        const SizedBox(height: 48),

        // Recent Canvas Projects
        Text(
          'Your Creative Canvas',
          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900, letterSpacing: -0.5),
        ),
        const SizedBox(height: 20),
        projects.isEmpty
            ? _buildWorkspaceEmptyState(context, ref)
            : GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: projects.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 24,
                  mainAxisSpacing: 24,
                  childAspectRatio: 1.4,
                ),
                itemBuilder: (context, index) {
                  final item = projects[index];
                  return _buildProjectCard(context, ref, item, isDark);
                },
              ),
      ],
    );
  }

  Widget _buildHorizontalTemplate(
    BuildContext context,
    WidgetRef ref, {
    required String title,
    required String desc,
    required List<Color> gradient,
    required String category,
    required String difficulty,
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      width: 300,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF21362F) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.06) : const Color(0xFF5F8575).withOpacity(0.1),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF162520).withOpacity(0.02),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: InkWell(
          onTap: () {
            ref.read(projectsListProvider.notifier).createNewProject(title);
            final activeProj = ref.read(activeProjectProvider);
            final populatedCopyProj = MockTemplates.applyTemplateCopy(activeProj, category);
            ref.read(activeProjectProvider.notifier).updateState(populatedCopyProj);
            ref.read(activeViewProvider.notifier).state = 'Visual Canvas';
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Template Gradient Header
              Container(
                height: 90,
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: gradient),
                ),
                padding: const EdgeInsets.all(16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        category,
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                      ),
                    ),
                    const Icon(Icons.favorite_border, color: Colors.white, size: 18),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 4),
                    Text(
                      desc,
                      style: const TextStyle(color: Colors.grey, fontSize: 11),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProjectCard(BuildContext context, WidgetRef ref, LandingPageData item, bool isDark) {
    final theme = Theme.of(context);
    final brand = item.brand;
    final primaryColor = Color(int.parse(brand.primaryColor.replaceFirst('#', '0xFF')));

    return Card(
      child: InkWell(
        onTap: () {
          ref.read(activeProjectProvider.notifier).loadProject(item);
          ref.read(activeViewProvider.notifier).state = 'Visual Canvas';
        },
        borderRadius: BorderRadius.circular(24),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Visual Header row
              Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: primaryColor.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Center(child: Icon(Icons.circle, color: primaryColor, size: 12)),
                  ),
                  const Spacer(),
                  // Tags / Settings
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isDark ? Colors.white.withOpacity(0.04) : const Color(0xFF5F8575).withOpacity(0.05),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: isDark ? Colors.white.withOpacity(0.06) : const Color(0xFF5F8575).withOpacity(0.08),
                      ),
                    ),
                    child: Text(
                      item.basicInfo.category,
                      style: const TextStyle(color: AppThemeGen.primary, fontSize: 9, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 8),
                  PopupMenuButton<String>(
                    icon: const Icon(Icons.more_vert, size: 16, color: Colors.grey),
                    onSelected: (val) {
                      if (val == 'duplicate') {
                        ref.read(projectsListProvider.notifier).duplicateProject(item);
                      } else if (val == 'delete') {
                        ref.read(projectsListProvider.notifier).deleteProject(item.project.id);
                      }
                    },
                    itemBuilder: (context) => [
                      const PopupMenuItem(value: 'duplicate', child: Text('Duplicate')),
                      const PopupMenuItem(value: 'delete', child: Text('Delete', style: TextStyle(color: Colors.red))),
                    ],
                  ),
                ],
              ),
              const Spacer(),
              Text(
                item.project.name,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, letterSpacing: -0.2),
              ),
              const SizedBox(height: 4),
              Text(
                'Edited: ${item.project.updatedAt.split("T")[0]}',
                style: const TextStyle(fontSize: 11, color: Colors.grey),
              ),
              const Spacer(),
              // Visual progress builder
              Row(
                children: [
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: 0.85,
                        backgroundColor: isDark ? Colors.white.withOpacity(0.04) : Colors.grey.shade100,
                        color: AppThemeGen.secondary,
                        minHeight: 6,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    '85%',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppThemeGen.secondary),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWorkspaceEmptyState(BuildContext context, WidgetRef ref) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(48),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        children: [
          const Icon(Icons.cloud_queue, size: 48, color: Colors.grey),
          const SizedBox(height: 16),
          const Text('No landing pages in this workspace yet', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: () => _showNewProjectDialog(context, ref),
            style: ElevatedButton.styleFrom(backgroundColor: AppThemeGen.primary, foregroundColor: Colors.white),
            child: const Text('Create Landing Page'),
          ),
        ],
      ),
    );
  }

  // Right Panel Accessory Sidebar (Bento Box accessory items)
  Widget _buildAccessorySidebar(BuildContext context, WidgetRef ref, bool isDark) {
    return Column(
      children: [
        // Daily tip card
        Card(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppThemeGen.secondary.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.lightbulb_outline, color: AppThemeGen.secondary, size: 18),
                    ),
                    const SizedBox(width: 12),
                    const Text('Daily Design Tip', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  ],
                ),
                const SizedBox(height: 18),
                const Text(
                  'Make your Hero call-to-action button color highly contrasted with the background. It improves conversion rates up to 25%!',
                  style: TextStyle(color: Colors.grey, fontSize: 12, height: 1.4),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),

        // Quick Actions Bento Widget
        Card(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Workspace Shortcuts', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 18),
                _buildShortcutRow('Create Project', 'Ctrl + N'),
                _buildShortcutRow('Open Preview', 'Ctrl + P'),
                _buildShortcutRow('Search Canvas', 'Ctrl + K'),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),

        // Trending Palette widget
        Card(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Trending Color Palette', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 18),
                Row(
                  children: [
                    _buildColorSquare(const Color(0xFF5F8575)),
                    _buildColorSquare(const Color(0xFFD97D64)),
                    _buildColorSquare(const Color(0xFFE6C280)),
                    _buildColorSquare(const Color(0xFFF4F1EA)),
                    const Spacer(),
                    const Text('Organic Sand', style: TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildShortcutRow(String label, String keys) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: Colors.grey.withOpacity(0.08), borderRadius: BorderRadius.circular(6)),
            child: Text(keys, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
          ),
        ],
      ),
    );
  }

  Widget _buildColorSquare(Color col) {
    return Container(
      width: 24,
      height: 24,
      margin: const EdgeInsets.only(right: 4),
      decoration: BoxDecoration(
        color: col,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: Colors.black.withOpacity(0.04)),
      ),
    );
  }
}
