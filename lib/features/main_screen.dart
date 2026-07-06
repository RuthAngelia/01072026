import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/widgets/sidebar.dart';
import '../core/providers/settings_provider.dart';
import '../core/providers/project_provider.dart';
import 'project/project_dashboard.dart';
import 'editor/editor_workspace.dart';
import 'preview/live_preview.dart';
import 'export/export_panel.dart';
import 'settings/settings_screen.dart';
import '../core/theme/app_theme_gen.dart';
import '../services/mock_templates.dart';
import '../models/landing_page_models.dart';

class MainScreen extends ConsumerWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeView = ref.watch(activeViewProvider);
    final width = MediaQuery.of(context).size.width;
    final isMobile = width < 900;

    return Scaffold(
      body: SafeArea(
        child: isMobile
            ? Column(
                children: [
                  Expanded(child: _buildBodyContent(activeView, isMobile)),
                  _buildBottomNavBar(ref, activeView),
                ],
              )
            : Stack(
                children: [
                  Positioned.fill(
                    child: _buildBodyContent(activeView, isMobile),
                  ),
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: const Sidebar(),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _buildBodyContent(String activeView, bool isMobile) {
    switch (activeView) {
      case 'Workspace':
        return const ProjectDashboard();
      case 'Templates Gallery':
        return const TemplatesGalleryScreen();
      case 'Visual Canvas':
        return isMobile
            ? const EditorWorkspace()
            : Row(
                children: [
                  const Expanded(flex: 4, child: EditorWorkspace()),
                  const VerticalDivider(width: 1, thickness: 1),
                  const Expanded(flex: 5, child: LivePreview()),
                ],
              );
      case 'Asset Library':
        return const AssetLibraryScreen();
      case 'Publish Center':
        return const ExportPanel();
      case 'Settings':
        return const SettingsScreen();
      default:
        return const ProjectDashboard();
    }
  }

  Widget _buildBottomNavBar(WidgetRef ref, String activeView) {
    int index = 0;
    switch (activeView) {
      case 'Workspace':
        index = 0;
        break;
      case 'Templates Gallery':
        index = 1;
        break;
      case 'Visual Canvas':
        index = 2;
        break;
      case 'Asset Library':
        index = 3;
        break;
      case 'Publish Center':
        index = 4;
        break;
    }

    return BottomNavigationBar(
      currentIndex: index,
      onTap: (val) {
        String view = 'Workspace';
        switch (val) {
          case 0:
            view = 'Workspace';
            break;
          case 1:
            view = 'Templates Gallery';
            break;
          case 2:
            view = 'Visual Canvas';
            break;
          case 3:
            view = 'Asset Library';
            break;
          case 4:
            view = 'Publish Center';
            break;
        }
        ref.read(activeViewProvider.notifier).state = view;
      },
      type: BottomNavigationBarType.fixed,
      selectedItemColor: Theme.of(ref.context).primaryColor,
      unselectedItemColor: Colors.grey,
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.space_dashboard), label: 'Workspace'),
        BottomNavigationBarItem(icon: Icon(Icons.auto_awesome_mosaic), label: 'Templates'),
        BottomNavigationBarItem(icon: Icon(Icons.design_services), label: 'Canvas'),
        BottomNavigationBarItem(icon: Icon(Icons.folder_special), label: 'Assets'),
        BottomNavigationBarItem(icon: Icon(Icons.rocket_launch), label: 'Publish'),
      ],
    );
  }
}

// Templates Gallery Screen Widget
class TemplatesGalleryScreen extends ConsumerStatefulWidget {
  const TemplatesGalleryScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<TemplatesGalleryScreen> createState() => _TemplatesGalleryScreenState();
}

class _TemplatesGalleryScreenState extends ConsumerState<TemplatesGalleryScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'All';
  String _selectedStyle = 'All';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    // Get all 50 templates
    final allTemplates = MockTemplates.templates;

    // Filter templates based on queries
    final filtered = allTemplates.where((t) {
      final matchesSearch = t.name.toLowerCase().contains(_searchQuery.toLowerCase()) || 
                            t.style.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                            t.category.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesCategory = _selectedCategory == 'All' || t.category == _selectedCategory;
      final matchesStyle = _selectedStyle == 'All' || t.style == _selectedStyle;
      return matchesSearch && matchesCategory && matchesStyle;
    }).toList();

    final categories = ['All', 'SaaS', 'AI Startup', 'Ebook', 'Course', 'Agency', 'Portfolio', 'Personal Brand', 'Digital Product', 'Mobile App', 'Local Business'];
    final styles = ['All', 'Minimal Editorial', 'Luxury', 'Modern SaaS', 'Apple-inspired', 'Swiss', 'Brutalism', 'Neo Brutalism', 'Soft UI', 'Organic', 'Playful', 'Corporate'];

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          AppThemeGen.gridPattern(),
          SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(40, 40, 40, 120),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Text(
                  'Templates Gallery',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Browse and search through 50+ professionally designed layout presets.',
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 32),

                // Search & Filter controls Bento box
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Row 1: Search Query input
                        TextField(
                          onChanged: (val) => setState(() => _searchQuery = val),
                          decoration: InputDecoration(
                            hintText: 'Search presets by keyword, style, category...',
                            prefixIcon: const Icon(Icons.search, color: AppThemeGen.primary),
                            fillColor: isDark ? Colors.white.withOpacity(0.04) : Colors.grey.shade50,
                          ),
                        ),
                        const SizedBox(height: 16),
                        
                        // Row 2: Category chips horizontal scroll
                        const Text('Categories', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                        const SizedBox(height: 6),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: categories.map((cat) {
                              final isActive = _selectedCategory == cat;
                              return Padding(
                                padding: const EdgeInsets.only(right: 8),
                                child: ChoiceChip(
                                  label: Text(cat),
                                  selected: isActive,
                                  onSelected: (val) {
                                    if (val) setState(() => _selectedCategory = cat);
                                  },
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Row 3: Design style chips horizontal scroll
                        const Text('Design Styles', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
                        const SizedBox(height: 6),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: styles.map((st) {
                              final isActive = _selectedStyle == st;
                              return Padding(
                                padding: const EdgeInsets.only(right: 8),
                                child: ChoiceChip(
                                  label: Text(st),
                                  selected: isActive,
                                  onSelected: (val) {
                                    if (val) setState(() => _selectedStyle = st);
                                  },
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                // Layout results grid
                filtered.isEmpty
                    ? const Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 48),
                          child: Text('No templates match your filters.', style: TextStyle(color: Colors.grey)),
                        ),
                      )
                    : GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: filtered.length,
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 24,
                          mainAxisSpacing: 24,
                          childAspectRatio: 1.3,
                        ),
                        itemBuilder: (context, index) {
                          final item = filtered[index];
                          return _buildLargeTemplateCard(context, ref, item);
                        },
                      ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLargeTemplateCard(BuildContext context, WidgetRef ref, LandingPageTemplate item) {
    return _TemplateCard(item: item, ref: ref);
  }
}

class _TemplateCard extends StatefulWidget {
  final LandingPageTemplate item;
  final WidgetRef ref;

  const _TemplateCard({Key? key, required this.item, required this.ref}) : super(key: key);

  @override
  State<_TemplateCard> createState() => _TemplateCardState();
}

class _TemplateCardState extends State<_TemplateCard> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final item = widget.item;

    final primaryColor = Color(int.parse(item.primaryColor.replaceFirst('#', '0xFF')));
    final secondaryColor = Color(int.parse(item.secondaryColor.replaceFirst('#', '0xFF')));
    final bgColor = Color(int.parse(item.backgroundColor.replaceFirst('#', '0xFF')));
    final textColor = Color(int.parse(item.textColor.replaceFirst('#', '0xFF')));

    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: AnimatedScale(
        scale: _isHovered ? 1.04 : 1.0,
        duration: const Duration(milliseconds: 250),
        child: AnimatedPhysicalModel(
          duration: const Duration(milliseconds: 250),
          shape: BoxShape.rectangle,
          borderRadius: BorderRadius.circular(24),
          color: isDark ? const Color(0xFF21362F) : Colors.white,
          shadowColor: Colors.black,
          elevation: _isHovered ? 12 : 1,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Browser Preview Frame Container
              Expanded(
                flex: 4,
                child: Container(
                  clipBehavior: Clip.antiAlias,
                  decoration: const BoxDecoration(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(24),
                      topRight: Radius.circular(24),
                    ),
                  ),
                  child: Stack(
                    children: [
                      // 1. Live Miniature landing page wrapped in FittedBox
                      Positioned.fill(
                        child: FittedBox(
                          fit: BoxFit.cover,
                          child: SizedBox(
                            width: 800,
                            height: 600,
                            child: _buildMiniLandingPage(item, primaryColor, secondaryColor, bgColor, textColor),
                          ),
                        ),
                      ),
                      
                      // 2. Browser Header Outline (Address bar look)
                      Positioned(
                        top: 0,
                        left: 0,
                        right: 0,
                        child: Container(
                          height: 24,
                          decoration: BoxDecoration(
                            color: Colors.grey.withOpacity(0.08),
                            border: Border(bottom: BorderSide(color: Colors.grey.withOpacity(0.12))),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 10),
                          child: Row(
                            children: [
                              _dot(Colors.red),
                              const SizedBox(width: 4),
                              _dot(Colors.yellow),
                              const SizedBox(width: 4),
                              _dot(Colors.green),
                              const SizedBox(width: 20),
                              Expanded(
                                child: Container(
                                  height: 14,
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.4),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Center(
                                    child: Text(
                                      'https://${item.name.replaceAll(" ", "").toLowerCase()}.com',
                                      style: const TextStyle(fontSize: 8, color: Colors.grey),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // 3. Hover Overlay Buttons
                      if (_isHovered)
                        Positioned.fill(
                          child: Container(
                            color: Colors.black.withOpacity(0.45),
                            child: Center(
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  ElevatedButton(
                                    onPressed: () => _useTemplate(),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppThemeGen.primary,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    child: const Text('Use Template', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              
              // Text Content body
              Expanded(
                flex: 3,
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            item.name,
                            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppThemeGen.primary.withOpacity(0.08),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              item.category,
                              style: const TextStyle(color: AppThemeGen.primary, fontSize: 9, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Style: ${item.style}. Typography heading is ${item.fontHeading} and body is ${item.fontBody}. Rounded corners are ${item.borderRadius.toInt()}px.',
                        style: const TextStyle(color: Colors.grey, fontSize: 11),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _dot(Color col) {
    return Container(
      width: 6,
      height: 6,
      decoration: BoxDecoration(color: col, shape: BoxShape.circle),
    );
  }

  void _useTemplate() {
    final ref = widget.ref;
    final item = widget.item;

    ref.read(projectsListProvider.notifier).createNewProject(item.name);
    final activeProj = ref.read(activeProjectProvider);
    final brandOverride = activeProj.brand.copyWith(
      primaryColor: item.primaryColor,
      secondaryColor: item.secondaryColor,
      backgroundColor: item.backgroundColor,
      textColor: item.textColor,
      borderRadius: item.borderRadius,
      fontHeading: item.fontHeading,
      fontBody: item.fontBody,
      buttonStyle: item.buttonStyle,
    );
    final populatedCopyProj = MockTemplates.applyTemplateCopy(activeProj, item.category);
    ref.read(activeProjectProvider.notifier).updateState(
      populatedCopyProj.copyWith(
        brand: brandOverride,
        selectedTemplateId: item.id,
      ),
    );
    ref.read(activeViewProvider.notifier).state = 'Visual Canvas';
  }

  // Live Miniature page tree renderer based on category
  Widget _buildMiniLandingPage(
    LandingPageTemplate temp,
    Color primary,
    Color secondary,
    Color bg,
    Color textCol,
  ) {
    final fontHeading = temp.fontHeading;
    final fontBody = temp.fontBody;
    final radius = temp.borderRadius;

    String logoName = "AuraGen";
    String heroTitle = "Intelligent AI Copilot for Teams";
    String heroSub = "Automate team collaboration, write cleaner docs, and ship features 3x faster.";
    String ctaText = "Start Free Trial";
    
    List<Widget> pageContent = [];

    if (temp.category == 'SaaS' || temp.category == 'AI Startup') {
      logoName = "Nexus.AI";
      heroTitle = "All-in-One Workspace for Engineering Teams";
      heroSub = "Centralize your code logs, tasks backlog, and team updates in a unified dashboard.";
      ctaText = "Start for Free";

      pageContent = [
        _miniHero(heroTitle, heroSub, ctaText, primary, secondary, temp, radius),
        const SizedBox(height: 20),
        _miniDashboardMockup(primary, radius),
        const SizedBox(height: 32),
        _miniClientLogos(),
        const SizedBox(height: 32),
        _miniSectionHeader("Engineered for Speed", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniFeaturesGrid(primary, radius, temp),
        const SizedBox(height: 32),
        _miniTestimonial("Sarah Jenkins", "VP of Product, Linear", "Nexus completely revolutionized our design system delivery.", radius, temp),
        const SizedBox(height: 32),
        _miniPricingCard("Pro SaaS Plan", "\$29/mo", primary, secondary, radius, temp),
      ];
    } else if (temp.category == 'Ebook') {
      logoName = "VisualPress";
      heroTitle = "Master Visual Layout & Typography Principles";
      heroSub = "Learn step-by-step frameworks to build stunning user interfaces in this 250-page guide.";
      ctaText = "Download Free Chapter";

      pageContent = [
        _miniSplitHero(
          title: heroTitle,
          sub: heroSub,
          cta: ctaText,
          primary: primary,
          secondary: secondary,
          temp: temp,
          radius: radius,
          rightSide: _miniBookMockup(primary, secondary),
        ),
        const SizedBox(height: 32),
        _miniSectionHeader("What's Inside the Book", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniChaptersList(primary, radius, temp),
        const SizedBox(height: 32),
        _miniSectionHeader("Meet the Author", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniAuthorSection(primary, radius, temp),
        const SizedBox(height: 32),
        _miniSectionHeader("Premium Launch Bonuses", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniBonusesSection(primary, radius, temp),
      ];
    } else if (temp.category == 'Course') {
      logoName = "DevAcademy";
      heroTitle = "Complete Flutter Clean Architecture Bootcamp";
      heroSub = "Learn Riverpod, SQLite sync, and production clean structures by building 5 complex apps.";
      ctaText = "Enroll Today";

      pageContent = [
        _miniHero(heroTitle, heroSub, ctaText, primary, secondary, temp, radius),
        const SizedBox(height: 20),
        _miniVideoMockup(primary, radius),
        const SizedBox(height: 32),
        _miniSectionHeader("Bootcamp Curriculum", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniCurriculumTimeline(primary, radius, temp),
        const SizedBox(height: 32),
        _miniSectionHeader("Lead Instructor", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniInstructorBio(primary, radius, temp),
      ];
    } else if (temp.category == 'Agency' || temp.category == 'Portfolio') {
      logoName = "PixelStudio";
      heroTitle = "We Build Custom Premium Web Interfaces";
      heroSub = "Converting digital startups into industry leaders with boutique design assets & interaction code.";
      ctaText = "Book Discovery Call";

      pageContent = [
        _miniSplitHero(
          title: heroTitle,
          sub: heroSub,
          cta: ctaText,
          primary: primary,
          secondary: secondary,
          temp: temp,
          radius: radius,
          rightSide: _miniPortfolioGrid(radius),
          leftAlignText: true,
        ),
        const SizedBox(height: 32),
        _miniSectionHeader("Our Studio Services", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniServicesGrid(primary, radius, temp),
        const SizedBox(height: 32),
        _miniSectionHeader("Recent Case Studies", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniCaseStudies(primary, radius, temp),
      ];
    } else {
      logoName = "BeanRoasters";
      heroTitle = "Premium Single-Origin Organic Coffee & Pastries";
      heroSub = "Start your day with ethically sourced beans roasted fresh daily in our local cafe lounge.";
      ctaText = "Order Delivery Online";

      pageContent = [
        _miniHero(heroTitle, heroSub, ctaText, primary, secondary, temp, radius),
        const SizedBox(height: 20),
        _miniCoffeeMockup(primary, radius),
        const SizedBox(height: 32),
        _miniSectionHeader("Daily Coffee Highlights", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniCoffeeMenu(primary, radius, temp),
        const SizedBox(height: 32),
        _miniSectionHeader("Book a Workspace Table", fontHeading, textCol),
        const SizedBox(height: 12),
        _miniReservationForm(primary, radius, temp),
      ];
    }

    return Container(
      color: bg,
      padding: const EdgeInsets.only(top: 36),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
            child: Row(
              children: [
                Text(logoName, style: TextStyle(fontFamily: fontHeading, fontWeight: FontWeight.bold, color: textCol, fontSize: 13)),
                const Spacer(),
                Text('Features', style: TextStyle(fontFamily: fontBody, fontSize: 8, color: Colors.grey)),
                const SizedBox(width: 10),
                Text('Pricing', style: TextStyle(fontFamily: fontBody, fontSize: 8, color: Colors.grey)),
                const SizedBox(width: 12),
                _buildMiniButton("Sign In", primary, secondary, temp.buttonStyle, radius, compact: true),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: Colors.black12),
          
          Expanded(
            child: SingleChildScrollView(
              physics: const NeverScrollableScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    ...pageContent,
                    const SizedBox(height: 40),
                    const Divider(height: 1, thickness: 1, color: Colors.black12),
                    const SizedBox(height: 16),
                    Text(
                      '© 2026 $logoName Studio. All rights reserved.',
                      style: TextStyle(fontFamily: fontBody, color: Colors.grey, fontSize: 7),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniButton(String text, Color primary, Color secondary, String buttonStyle, double radius, {bool compact = false}) {
    final r = buttonStyle == 'Pill' ? 99.0 : radius;
    final pad = compact ? const EdgeInsets.symmetric(horizontal: 10, vertical: 4) : const EdgeInsets.symmetric(horizontal: 16, vertical: 8);
    final fs = compact ? 8.0 : 10.0;

    switch (buttonStyle) {
      case 'Gradient':
        return Container(
          padding: pad,
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [primary, secondary]),
            borderRadius: BorderRadius.circular(r),
          ),
          child: Text(text, style: TextStyle(color: Colors.white, fontSize: fs, fontWeight: FontWeight.bold)),
        );
      case 'Outline':
        return Container(
          padding: pad,
          decoration: BoxDecoration(
            border: Border.all(color: primary, width: 1.5),
            borderRadius: BorderRadius.circular(r),
          ),
          child: Text(text, style: TextStyle(color: primary, fontSize: fs, fontWeight: FontWeight.bold)),
        );
      case 'Solid':
      case 'Pill':
      default:
        return Container(
          padding: pad,
          decoration: BoxDecoration(
            color: primary,
            borderRadius: BorderRadius.circular(r),
          ),
          child: Text(text, style: TextStyle(color: Colors.white, fontSize: fs, fontWeight: FontWeight.bold)),
        );
    }
  }

  Decoration _buildCardDecorationMini(LandingPageTemplate temp, Color cardBg) {
    final radius = temp.borderRadius / 2;
    switch (temp.cardStyle) {
      case 'Glassmorphism':
        return BoxDecoration(
          color: Colors.white.withOpacity(0.3),
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(color: Colors.white.withOpacity(0.2), width: 1),
        );
      case 'Shadow':
        return BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(radius),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        );
      case 'Minimal':
      default:
        return BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(color: Colors.grey.withOpacity(0.12)),
        );
    }
  }

  Widget _miniHero(String title, String sub, String cta, Color primary, Color secondary, LandingPageTemplate temp, double radius) {
    return Column(
      children: [
        Text(
          title,
          textAlign: TextAlign.center,
          style: TextStyle(fontFamily: temp.fontHeading, fontSize: 18, fontWeight: FontWeight.w900, height: 1.1, color: Color(int.parse(temp.textColor.replaceFirst('#', '0xFF')))),
        ),
        const SizedBox(height: 6),
        Text(
          sub,
          textAlign: TextAlign.center,
          style: TextStyle(fontFamily: temp.fontBody, fontSize: 9, color: Colors.grey),
        ),
        const SizedBox(height: 12),
        _buildMiniButton(cta, primary, secondary, temp.buttonStyle, radius),
      ],
    );
  }

  Widget _miniSplitHero({
    required String title,
    required String sub,
    required String cta,
    required Color primary,
    required Color secondary,
    required LandingPageTemplate temp,
    required double radius,
    required Widget rightSide,
    bool leftAlignText = true,
  }) {
    final textCol = Color(int.parse(temp.textColor.replaceFirst('#', '0xFF')));
    return Row(
      children: [
        Expanded(
          flex: 4,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(fontFamily: temp.fontHeading, fontSize: 16, fontWeight: FontWeight.w900, height: 1.1, color: textCol),
              ),
              const SizedBox(height: 6),
              Text(
                sub,
                style: TextStyle(fontFamily: temp.fontBody, fontSize: 8, color: Colors.grey),
              ),
              const SizedBox(height: 12),
              _buildMiniButton(cta, primary, secondary, temp.buttonStyle, radius),
            ],
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          flex: 3,
          child: rightSide,
        ),
      ],
    );
  }

  Widget _miniSectionHeader(String text, String font, Color textCol) {
    return Text(
      text,
      style: TextStyle(fontFamily: font, fontSize: 11, fontWeight: FontWeight.bold, color: textCol),
    );
  }

  Widget _miniDashboardMockup(Color primary, double radius) {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E24),
        borderRadius: BorderRadius.circular(radius / 2),
        border: Border.all(color: Colors.white10),
      ),
      padding: const EdgeInsets.all(8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(width: 4, height: 4, decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle)),
              const SizedBox(width: 3),
              Container(width: 4, height: 4, decoration: const BoxDecoration(color: Colors.yellow, shape: BoxShape.circle)),
              const SizedBox(width: 3),
              Container(width: 4, height: 4, decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle)),
            ],
          ),
          const SizedBox(height: 8),
          Expanded(
            child: Row(
              children: [
                Container(width: 30, color: Colors.white.withOpacity(0.04)),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(width: 80, height: 8, color: Colors.white.withOpacity(0.08)),
                      const SizedBox(height: 8),
                      Expanded(
                        child: Row(
                          children: [
                            Expanded(child: Container(color: primary.withOpacity(0.12))),
                            const SizedBox(width: 8),
                            Expanded(child: Container(color: Colors.white.withOpacity(0.04))),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _miniClientLogos() {
    return const Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        Text('slack', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 8)),
        Text('linear', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 8)),
        Text('stripe', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 8)),
        Text('vercel', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 8)),
      ],
    );
  }

  Widget _miniFeaturesGrid(Color primary, double radius, LandingPageTemplate temp) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 8,
      mainAxisSpacing: 8,
      childAspectRatio: 1.6,
      children: [
        _miniFeatureCard("Real-time Sync", "Instant updates", primary, temp),
        _miniFeatureCard("AI Analytics", "Pipeline insights", primary, temp),
        _miniFeatureCard("Secure Storage", "SOC2 compliance", primary, temp),
        _miniFeatureCard("Quick Integrations", "Slack, Notion, Jira", primary, temp),
      ],
    );
  }

  Widget _miniFeatureCard(String title, String desc, Color primary, LandingPageTemplate temp) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: _buildCardDecorationMini(temp, Colors.white),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.bolt, color: primary, size: 10),
          const SizedBox(height: 4),
          Text(title, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 8, fontWeight: FontWeight.bold)),
          Text(desc, style: TextStyle(fontFamily: temp.fontBody, fontSize: 7, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _miniTestimonial(String name, String role, String content, double radius, LandingPageTemplate temp) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: _buildCardDecorationMini(temp, Colors.white),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(children: [Icon(Icons.star, color: Colors.amber, size: 8)]),
          const SizedBox(height: 4),
          Text('"$content"', style: TextStyle(fontFamily: temp.fontBody, fontSize: 8, fontStyle: FontStyle.italic)),
          const SizedBox(height: 6),
          Text(name, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 8, fontWeight: FontWeight.bold)),
          Text(role, style: TextStyle(fontFamily: temp.fontBody, fontSize: 7, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _miniPricingCard(String name, String price, Color primary, Color secondary, double radius, LandingPageTemplate temp) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _buildCardDecorationMini(temp, Colors.white).copyWith(
        border: Border.all(color: primary, width: 1),
      ),
      child: Column(
        children: [
          Text(name, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 9, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(price, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 16, fontWeight: FontWeight.w900, color: primary)),
          const SizedBox(height: 10),
          _buildMiniButton("Subscribe Now", primary, secondary, temp.buttonStyle, radius, compact: true),
        ],
      ),
    );
  }

  Widget _miniBookMockup(Color primary, Color secondary) {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [primary, secondary]),
        borderRadius: const BorderRadius.only(
          topRight: Radius.circular(8),
          bottomRight: Radius.circular(8),
          topLeft: Radius.circular(2),
          bottomLeft: Radius.circular(2),
        ),
      ),
      child: const Center(
        child: Text('EBOOK', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 10)),
      ),
    );
  }

  Widget _miniChaptersList(Color primary, double radius, LandingPageTemplate temp) {
    return Column(
      children: [
        _miniChapterItem("Ch 1. Visual Hierarchy rules", temp),
        const SizedBox(height: 4),
        _miniChapterItem("Ch 2. Responsive Figma layouts", temp),
        const SizedBox(height: 4),
        _miniChapterItem("Ch 3. Typography pairing grids", temp),
      ],
    );
  }

  Widget _miniChapterItem(String text, LandingPageTemplate temp) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: _buildCardDecorationMini(temp, Colors.white),
      child: Row(
        children: [
          const Icon(Icons.menu_book, size: 8, color: Colors.grey),
          const SizedBox(width: 6),
          Text(text, style: TextStyle(fontFamily: temp.fontBody, fontSize: 8)),
        ],
      ),
    );
  }

  Widget _miniAuthorSection(Color primary, double radius, LandingPageTemplate temp) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(color: primary.withOpacity(0.08), shape: BoxShape.circle),
          child: Icon(Icons.person, color: primary, size: 16),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Joy, Lead Designer', style: TextStyle(fontFamily: temp.fontHeading, fontSize: 8, fontWeight: FontWeight.bold)),
              Text('Former Google senior interface architect with 10+ years experience.', style: TextStyle(fontFamily: temp.fontBody, fontSize: 7, color: Colors.grey)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _miniBonusesSection(Color primary, double radius, LandingPageTemplate temp) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: _buildCardDecorationMini(temp, Colors.grey.shade50),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
            decoration: BoxDecoration(color: Colors.red.shade100, borderRadius: BorderRadius.circular(4)),
            child: Text('FREE', style: TextStyle(color: Colors.red.shade800, fontWeight: FontWeight.bold, fontSize: 7)),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Figma UI Kit Asset Bundle', style: TextStyle(fontFamily: temp.fontHeading, fontSize: 8, fontWeight: FontWeight.bold)),
                Text('100+ landing widgets included.', style: TextStyle(fontFamily: temp.fontBody, fontSize: 7, color: Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _miniVideoMockup(Color primary, double radius) {
    return Container(
      height: 90,
      color: Colors.grey.shade200,
      child: Center(
        child: Icon(Icons.play_circle_fill, color: primary, size: 28),
      ),
    );
  }

  Widget _miniCurriculumTimeline(Color primary, double radius, LandingPageTemplate temp) {
    return Column(
      children: [
        _miniTimelineNode("Mod 1. Riverpod state flow", temp),
        const SizedBox(height: 6),
        _miniTimelineNode("Mod 2. SQLite local sync", temp),
      ],
    );
  }

  Widget _miniTimelineNode(String title, LandingPageTemplate temp) {
    return Row(
      children: [
        Container(width: 4, height: 4, decoration: const BoxDecoration(color: Colors.grey, shape: BoxShape.circle)),
        const SizedBox(width: 8),
        Text(title, style: TextStyle(fontFamily: temp.fontBody, fontSize: 8)),
      ],
    );
  }

  Widget _miniInstructorBio(Color primary, double radius, LandingPageTemplate temp) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(color: primary.withOpacity(0.08), shape: BoxShape.circle),
          child: Icon(Icons.school, color: primary, size: 16),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Joy, Instructor', style: TextStyle(fontFamily: temp.fontHeading, fontSize: 8, fontWeight: FontWeight.bold)),
              Text('Teaching clean code structures to 20,000+ app developers globally.', style: TextStyle(fontFamily: temp.fontBody, fontSize: 7, color: Colors.grey)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _miniPortfolioGrid(double radius) {
    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: [
        _miniPortfolioTile(Colors.teal.shade100),
        _miniPortfolioTile(Colors.amber.shade100),
        _miniPortfolioTile(Colors.red.shade100),
        _miniPortfolioTile(Colors.blue.shade100),
      ],
    );
  }

  Widget _miniPortfolioTile(Color color) {
    return Container(
      width: 40,
      height: 35,
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(4)),
    );
  }

  Widget _miniServicesGrid(Color primary, double radius, LandingPageTemplate temp) {
    return Column(
      children: [
        _miniChapterItem("UI/UX Visual Design layouts", temp),
        const SizedBox(height: 4),
        _miniChapterItem("Flutter Web responsive coding", temp),
      ],
    );
  }

  Widget _miniCaseStudies(Color primary, double radius, LandingPageTemplate temp) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: _buildCardDecorationMini(temp, Colors.white),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Linear Platform Redesign', style: TextStyle(fontFamily: temp.fontHeading, fontSize: 8, fontWeight: FontWeight.bold)),
          Text('+140% signups boost in 2 weeks', style: TextStyle(fontFamily: temp.fontBody, fontSize: 7, color: primary, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _miniCoffeeMockup(Color primary, double radius) {
    return Container(
      height: 90,
      color: Colors.grey.shade100,
      child: Center(
        child: Icon(Icons.local_cafe, color: primary, size: 24),
      ),
    );
  }

  Widget _miniCoffeeMenu(Color primary, double radius, LandingPageTemplate temp) {
    return Row(
      children: [
        Expanded(child: _miniMenuItem("Latte", "\$4.5", temp)),
        const SizedBox(width: 8),
        Expanded(child: _miniMenuItem("Matcha", "\$5.0", temp)),
      ],
    );
  }

  Widget _miniMenuItem(String name, String price, LandingPageTemplate temp) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: _buildCardDecorationMini(temp, Colors.white),
      child: Column(
        children: [
          Text(name, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 8, fontWeight: FontWeight.bold)),
          Text(price, style: const TextStyle(fontSize: 7, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _miniReservationForm(Color primary, double radius, LandingPageTemplate temp) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: _buildCardDecorationMini(temp, Colors.white),
      child: Column(
        children: [
          Container(
            height: 16,
            decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(4)),
            child: const Center(child: Text('Date & Time picker', style: TextStyle(fontSize: 6, color: Colors.grey))),
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 4),
            width: double.infinity,
            decoration: BoxDecoration(color: primary, borderRadius: BorderRadius.circular(4)),
            child: const Center(child: Text('Book Now', style: TextStyle(color: Colors.white, fontSize: 7, fontWeight: FontWeight.bold))),
          ),
        ],
      ),
    );
  }
}

// Asset Library Screen Widget
class AssetLibraryScreen extends StatelessWidget {
  const AssetLibraryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final assets = [
      {'name': 'Company Logo Dark', 'type': 'Logo Image', 'size': '45 KB'},
      {'name': 'Hero Product Mockup', 'type': 'Product Mockup', 'size': '420 KB'},
      {'name': 'Client Portrait Sarah', 'type': 'Avatar Image', 'size': '28 KB'},
      {'name': 'Ebook Mockup 3D', 'type': 'Bonus Image', 'size': '310 KB'},
    ];

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          AppThemeGen.gridPattern(),
          SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(40, 40, 40, 120),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Asset Library',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Kelola seluruh file media logo, mockup, dan gambar testimoni di storage lokal.',
                          style: TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.cloud_upload),
                      label: const Text('Upload Asset'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppThemeGen.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Folder Grids
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: assets.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 4,
                    crossAxisSpacing: 20,
                    mainAxisSpacing: 20,
                    childAspectRatio: 1.15,
                  ),
                  itemBuilder: (context, index) {
                    final item = assets[index];
                    return Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: AppThemeGen.primary.withOpacity(0.08),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.image, color: AppThemeGen.primary, size: 24),
                            ),
                            const Spacer(),
                            Text(
                              item['name']!,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(item['type']!, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                                Text(item['size']!, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
