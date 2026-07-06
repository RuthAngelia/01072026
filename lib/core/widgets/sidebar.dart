import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/settings_provider.dart';
import '../theme/app_theme_gen.dart';

class Sidebar extends ConsumerWidget {
  const Sidebar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeView = ref.watch(activeViewProvider);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final menus = [
      {'title': 'Workspace', 'icon': Icons.space_dashboard_outlined, 'activeIcon': Icons.space_dashboard},
      {'title': 'Templates Gallery', 'icon': Icons.auto_awesome_mosaic_outlined, 'activeIcon': Icons.auto_awesome_mosaic},
      {'title': 'Visual Canvas', 'icon': Icons.design_services_outlined, 'activeIcon': Icons.design_services},
      {'title': 'Asset Library', 'icon': Icons.folder_special_outlined, 'activeIcon': Icons.folder_special},
      {'title': 'Publish Center', 'icon': Icons.rocket_launch_outlined, 'activeIcon': Icons.rocket_launch},
      {'title': 'Settings', 'icon': Icons.tune_outlined, 'activeIcon': Icons.tune},
    ];

    return Center(
      child: Container(
        margin: const EdgeInsets.only(bottom: 24),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isDark
              ? const Color(0xFF21362F).withOpacity(0.8)
              : Colors.white.withOpacity(0.85),
          borderRadius: BorderRadius.circular(32),
          border: Border.all(
            color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFF5F8575).withOpacity(0.12),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF162520).withOpacity(0.06),
              blurRadius: 32,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(32),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Workspace Selector Popup Button
                _buildWorkspaceButton(context, isDark),
                const SizedBox(width: 8),
                Container(width: 1, height: 28, color: Colors.grey.withOpacity(0.2)),
                const SizedBox(width: 8),

                // Center Menu Icons
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: menus.map((menu) {
                    final title = menu['title'] as String;
                    final icon = menu['icon'] as IconData;
                    final activeIcon = menu['activeIcon'] as IconData;
                    final isActive = activeView == title;

                    return _DockItem(
                      title: title,
                      icon: icon,
                      activeIcon: activeIcon,
                      isActive: isActive,
                      onTap: () {
                        ref.read(activeViewProvider.notifier).state = title;
                      },
                    );
                  }).toList(),
                ),

                const SizedBox(width: 8),
                Container(width: 1, height: 28, color: Colors.grey.withOpacity(0.2)),
                const SizedBox(width: 8),

                // User Profile Button
                _buildProfileAvatar(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildWorkspaceButton(BuildContext context, bool isDark) {
    return PopupMenuButton<String>(
      tooltip: 'Pilih Workspace',
      icon: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppThemeGen.primary.withOpacity(0.08),
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.blur_on, color: AppThemeGen.primary, size: 18),
      ),
      onSelected: (val) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Switched to $val')),
        );
      },
      itemBuilder: (context) => [
        const PopupMenuItem(value: 'Personal Workspace', child: Text('✨ Personal Workspace')),
        const PopupMenuItem(value: 'Startup Workspace', child: Text('🚀 Startup Workspace')),
      ],
    );
  }

  Widget _buildProfileAvatar(BuildContext context) {
    return Tooltip(
      message: 'Joy (Creator Pro)',
      child: CircleAvatar(
        radius: 18,
        backgroundColor: AppThemeGen.secondary,
        child: const Text(
          'J',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
        ),
      ),
    );
  }
}

class _DockItem extends StatefulWidget {
  final String title;
  final IconData icon;
  final IconData activeIcon;
  final bool isActive;
  final VoidCallback onTap;

  const _DockItem({
    Key? key,
    required this.title,
    required this.icon,
    required this.activeIcon,
    required this.isActive,
    required this.onTap,
  }) : super(key: key);

  @override
  State<_DockItem> createState() => _DockItemState();
}

class _DockItemState extends State<_DockItem> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: Tooltip(
        message: widget.title,
        child: InkWell(
          onTap: widget.onTap,
          borderRadius: BorderRadius.circular(24),
          child: AnimatedScale(
            scale: _isHovered ? 1.15 : 1.0,
            duration: const Duration(milliseconds: 180),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: widget.isActive ? AppThemeGen.primary.withOpacity(0.08) : Colors.transparent,
                shape: BoxShape.circle,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    widget.isActive ? widget.activeIcon : widget.icon,
                    color: widget.isActive ? AppThemeGen.secondary : Colors.grey,
                    size: 22,
                  ),
                  if (widget.isActive) ...[
                    const SizedBox(height: 2),
                    Container(
                      width: 4,
                      height: 4,
                      decoration: const BoxDecoration(
                        color: AppThemeGen.secondary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
