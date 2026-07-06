import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/project_provider.dart';
import '../../core/providers/settings_provider.dart';
import '../../models/landing_page_models.dart';
import '../../core/theme/app_theme_gen.dart';
import '../../services/mock_templates.dart';

class LivePreview extends ConsumerWidget {
  const LivePreview({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(activeProjectProvider);
    final device = ref.watch(previewDeviceProvider);
    final theme = Theme.of(context);

    double frameWidth = double.infinity;
    double frameHeight = double.infinity;

    if (device == 'Mobile') {
      frameWidth = 375;
      frameHeight = 720;
    } else if (device == 'Tablet') {
      frameWidth = 768;
      frameHeight = 900;
    }

    return Container(
      color: theme.scaffoldBackgroundColor,
      child: Column(
        children: [
          // Switcher Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: BoxDecoration(
              color: theme.cardColor,
              border: Border(bottom: BorderSide(color: Colors.grey.shade100)),
            ),
            child: Row(
              children: [
                const Text('Live Preview Canvas', style: TextStyle(fontWeight: FontWeight.bold)),
                const Spacer(),
                _buildDeviceButton(ref, 'Desktop', Icons.desktop_windows, device == 'Desktop'),
                const SizedBox(width: 8),
                _buildDeviceButton(ref, 'Tablet', Icons.tablet_mac, device == 'Tablet'),
                const SizedBox(width: 8),
                _buildDeviceButton(ref, 'Mobile', Icons.phone_android, device == 'Mobile'),
              ],
            ),
          ),

          // Preview Canvas
          Expanded(
            child: Center(
              child: device == 'Desktop'
                  ? _buildLandingContent(context, data, false)
                  : Container(
                      width: frameWidth,
                      height: frameHeight,
                      margin: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 32,
                            offset: const Offset(0, 16),
                          ),
                        ],
                        border: Border.all(color: Colors.black.withOpacity(0.8), width: 8),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: _buildLandingContent(context, data, true),
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeviceButton(
    WidgetRef ref,
    String label,
    IconData icon,
    bool isActive,
  ) {
    return IconButton(
      icon: Icon(icon, color: isActive ? AppThemeGen.primary : Colors.grey),
      tooltip: '$label View',
      onPressed: () {
        ref.read(previewDeviceProvider.notifier).state = label;
      },
    );
  }

  Widget _buildLandingContent(BuildContext context, LandingPageData data, bool isMobile) {
    final primaryColor = Color(int.parse(data.brand.primaryColor.replaceFirst('#', '0xFF')));
    final secondaryColor = Color(int.parse(data.brand.secondaryColor.replaceFirst('#', '0xFF')));
    final bgColor = Color(int.parse(data.brand.backgroundColor.replaceFirst('#', '0xFF')));
    final textColor = Color(int.parse(data.brand.textColor.replaceFirst('#', '0xFF')));

    final template = MockTemplates.templates.firstWhere(
      (t) => t.id == data.selectedTemplateId,
      orElse: () => MockTemplates.templates.first,
    );
    final sections = template.sectionOrder.split(',');
    final widgetsList = <Widget>[];

    for (final sec in sections) {
      switch (sec.trim()) {
        case 'hero':
          if (data.hero.enabled) {
            widgetsList.add(_buildHeroPreview(data.hero, template, primaryColor, secondaryColor, textColor, isMobile));
          }
          break;
        case 'benefits':
          if (data.benefits.enabled) {
            widgetsList.add(_buildBenefitsPreview(data.benefits, template, primaryColor, textColor, isMobile));
          }
          break;
        case 'bridge':
          if (data.productBridge.enabled) {
            widgetsList.add(_buildBridgePreview(data.productBridge, template, primaryColor, secondaryColor, textColor, isMobile));
          }
          break;
        case 'bonuses':
          if (data.bonuses.enabled) {
            widgetsList.add(_buildBonusesPreview(data.bonuses, template, primaryColor, textColor, isMobile));
          }
          break;
        case 'testimonials':
          if (data.testimonials.enabled) {
            widgetsList.add(_buildTestimonialsPreview(data.testimonials, template, primaryColor, textColor, isMobile));
          }
          break;
        case 'offer':
          if (data.offer.enabled) {
            widgetsList.add(_buildOfferPreview(data.offer, template, primaryColor, secondaryColor, textColor, isMobile));
          }
          break;
        case 'faq':
          if (data.faq.enabled) {
            widgetsList.add(_buildFAQPreview(data.faq, template, primaryColor, textColor));
          }
          break;
        case 'footer':
          if (data.footer.enabled) {
            widgetsList.add(_buildFooterPreview(data.footer, template, primaryColor, textColor, isMobile));
          }
          break;
      }
    }

    return Container(
      color: bgColor,
      child: SingleChildScrollView(
        child: Column(
          children: widgetsList,
        ),
      ),
    );
  }

  // Dynamic Button Builder based on template.buttonStyle
  Widget _buildActionButton({
    required String text,
    required Color primary,
    required Color secondary,
    required String buttonStyle,
    required double radius,
    required VoidCallback onTap,
  }) {
    final r = buttonStyle == 'Pill' ? 99.0 : radius;

    switch (buttonStyle) {
      case 'Gradient':
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [primary, secondary]),
            borderRadius: BorderRadius.circular(r),
          ),
          child: ElevatedButton(
            onPressed: onTap,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.transparent,
              shadowColor: Colors.transparent,
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(r)),
            ),
            child: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        );
      case 'Outline':
        return OutlinedButton(
          onPressed: onTap,
          style: OutlinedButton.styleFrom(
            side: BorderSide(color: primary, width: 1.5),
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(r)),
          ),
          child: Text(text, style: TextStyle(color: primary, fontWeight: FontWeight.bold)),
        );
      case 'Solid':
      case 'Pill':
      default:
        return ElevatedButton(
          onPressed: onTap,
          style: ElevatedButton.styleFrom(
            backgroundColor: primary,
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(r)),
          ),
          child: Text(text, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        );
    }
  }

  // Dynamic Card decoration based on template.cardStyle
  Decoration _buildCardDecoration(LandingPageTemplate temp, Color cardBg) {
    final radius = temp.borderRadius;
    final isDark = temp.backgroundColor.contains('162520') || temp.backgroundColor.contains('21362F');

    switch (temp.cardStyle) {
      case 'Glassmorphism':
        return BoxDecoration(
          color: isDark ? Colors.white.withOpacity(0.04) : Colors.white.withOpacity(0.4),
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(color: Colors.white.withOpacity(0.12), width: 1.5),
        );
      case 'Shadow':
        return BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(radius),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 16,
              offset: const Offset(0, 6),
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

  // 1. Dynamic Hero Layout Renderer
  Widget _buildHeroPreview(
    HeroSection hero,
    LandingPageTemplate temp,
    Color primary,
    Color secondary,
    Color textCol,
    bool isMobile,
  ) {
    final radius = temp.borderRadius;
    final fontHeading = temp.fontHeading;
    final fontBody = temp.fontBody;

    // Centered layout
    if (temp.heroLayout == 'Centered' || isMobile) {
      return Container(
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: isMobile ? 48 : 80),
        child: Column(
          children: [
            Text(
              hero.headline,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: fontHeading,
                fontSize: isMobile ? 24 : 40,
                fontWeight: FontWeight.w900,
                color: textCol,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              hero.subheadline,
              textAlign: TextAlign.center,
              style: TextStyle(fontFamily: fontBody, fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 32),
            _buildActionButton(
              text: hero.ctaText,
              primary: primary,
              secondary: secondary,
              buttonStyle: temp.buttonStyle,
              radius: radius,
              onTap: () {},
            ),
            const SizedBox(height: 48),
            // Mockup preview container below
            Container(
              height: 200,
              width: double.infinity,
              constraints: const BoxConstraints(maxWidth: 600),
              decoration: _buildCardDecoration(temp, Colors.grey.shade50),
              child: const Center(
                child: Icon(Icons.art_track, color: Colors.grey, size: 48),
              ),
            ),
          ],
        ),
      );
    }

    // Split Left layout
    if (temp.heroLayout == 'SplitLeft') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 80),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    hero.headline,
                    style: TextStyle(
                      fontFamily: fontHeading,
                      fontSize: 38,
                      fontWeight: FontWeight.w900,
                      color: textCol,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    hero.subheadline,
                    style: TextStyle(fontFamily: fontBody, fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 32),
                  _buildActionButton(
                    text: hero.ctaText,
                    primary: primary,
                    secondary: secondary,
                    buttonStyle: temp.buttonStyle,
                    radius: radius,
                    onTap: () {},
                  ),
                ],
              ),
            ),
            const SizedBox(width: 48),
            Expanded(
              child: Container(
                height: 300,
                decoration: _buildCardDecoration(temp, Colors.grey.shade50),
                child: const Center(
                  child: Icon(Icons.art_track, color: Colors.grey, size: 48),
                ),
              ),
            ),
          ],
        ),
      );
    }

    // Split Right layout
    if (temp.heroLayout == 'SplitRight') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 80),
        child: Row(
          children: [
            Expanded(
              child: Container(
                height: 300,
                decoration: _buildCardDecoration(temp, Colors.grey.shade50),
                child: const Center(
                  child: Icon(Icons.art_track, color: Colors.grey, size: 48),
                ),
              ),
            ),
            const SizedBox(width: 48),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    hero.headline,
                    style: TextStyle(
                      fontFamily: fontHeading,
                      fontSize: 38,
                      fontWeight: FontWeight.w900,
                      color: textCol,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    hero.subheadline,
                    style: TextStyle(fontFamily: fontBody, fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 32),
                  _buildActionButton(
                    text: hero.ctaText,
                    primary: primary,
                    secondary: secondary,
                    buttonStyle: temp.buttonStyle,
                    radius: radius,
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    // Glow Accent / Radial Glow Layout
    if (temp.heroLayout == 'GlowAccent') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 90),
        decoration: BoxDecoration(
          gradient: RadialGradient(
            colors: [primary.withOpacity(0.08), Colors.transparent],
            radius: 0.8,
          ),
        ),
        child: Column(
          children: [
            Text(
              hero.headline,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: fontHeading,
                fontSize: 42,
                fontWeight: FontWeight.w900,
                color: textCol,
                height: 1.1,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              hero.subheadline,
              textAlign: TextAlign.center,
              style: TextStyle(fontFamily: fontBody, fontSize: 15, color: Colors.grey),
            ),
            const SizedBox(height: 36),
            _buildActionButton(
              text: hero.ctaText,
              primary: primary,
              secondary: secondary,
              buttonStyle: temp.buttonStyle,
              radius: radius,
              onTap: () {},
            ),
          ],
        ),
      );
    }

    // Minimal input waitlist layout
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 80),
      child: Column(
        children: [
          Text(
            hero.headline,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: fontHeading,
              fontSize: 38,
              fontWeight: FontWeight.w900,
              color: textCol,
            ),
          ),
          const SizedBox(height: 28),
          // E-mail input form inline or stacked
          Container(
            constraints: const BoxConstraints(maxWidth: 450),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(radius),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Row(
              children: [
                const Icon(Icons.email_outlined, color: Colors.grey, size: 20),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text('Enter email...', style: TextStyle(color: Colors.grey, fontSize: 13)),
                ),
                _buildActionButton(
                  text: hero.ctaText,
                  primary: primary,
                  secondary: secondary,
                  buttonStyle: temp.buttonStyle,
                  radius: radius,
                  onTap: () {},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 2. Benefits Section with custom card style decoration
  Widget _buildBenefitsPreview(
    BenefitsSection benefits,
    LandingPageTemplate temp,
    Color primary,
    Color textCol,
    bool isMobile,
  ) {
    final fontHeading = temp.fontHeading;
    final fontBody = temp.fontBody;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
      child: Column(
        children: [
          Text(
            benefits.title,
            style: TextStyle(fontFamily: fontHeading, fontSize: 24, fontWeight: FontWeight.bold, color: textCol),
          ),
          const SizedBox(height: 8),
          Text(benefits.subtitle, style: TextStyle(fontFamily: fontBody, color: Colors.grey, fontSize: 13)),
          const SizedBox(height: 40),
          isMobile
              ? Column(
                  children: benefits.items
                      .map((item) => Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: _buildBenefitCard(item, temp, primary),
                          ))
                      .toList(),
                )
              : Row(
                  children: benefits.items
                      .map((item) => Expanded(
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                              child: _buildBenefitCard(item, temp, primary),
                            ),
                          ))
                      .toList(),
                ),
        ],
      ),
    );
  }

  Widget _buildBenefitCard(BenefitItem item, LandingPageTemplate temp, Color primary) {
    final isDark = temp.backgroundColor.contains('162520') || temp.backgroundColor.contains('21362F');
    final cardBg = isDark ? const Color(0xFF21362F) : Colors.white;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: _buildCardDecoration(temp, cardBg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.bolt, color: primary, size: 28),
          const SizedBox(height: 16),
          Text(item.title, style: TextStyle(fontFamily: temp.fontHeading, fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          Text(item.description, style: TextStyle(fontFamily: temp.fontBody, color: Colors.grey, fontSize: 13)),
        ],
      ),
    );
  }

  // 3. Product Bridge Preview
  Widget _buildBridgePreview(
    ProductBridge bridge,
    LandingPageTemplate temp,
    Color primary,
    Color secondary,
    Color textCol,
    bool isMobile,
  ) {
    final radius = temp.borderRadius;

    final content = [
      Expanded(
        flex: isMobile ? 0 : 1,
        child: Column(
          crossAxisAlignment: isMobile ? CrossAxisAlignment.center : CrossAxisAlignment.start,
          children: [
            Text(
              bridge.title,
              style: TextStyle(fontFamily: temp.fontHeading, fontSize: 24, fontWeight: FontWeight.bold, color: textCol),
              textAlign: isMobile ? TextAlign.center : TextAlign.start,
            ),
            const SizedBox(height: 16),
            Text(
              bridge.description,
              style: TextStyle(fontFamily: temp.fontBody, color: Colors.grey, fontSize: 14),
              textAlign: isMobile ? TextAlign.center : TextAlign.start,
            ),
            const SizedBox(height: 24),
            _buildActionButton(
              text: bridge.ctaText,
              primary: primary,
              secondary: secondary,
              buttonStyle: temp.buttonStyle,
              radius: radius,
              onTap: () {},
            ),
          ],
        ),
      ),
      if (!isMobile) const SizedBox(width: 48),
      Expanded(
        flex: isMobile ? 0 : 1,
        child: Container(
          height: 240,
          margin: EdgeInsets.only(top: isMobile ? 24 : 0),
          decoration: _buildCardDecoration(temp, Colors.grey.shade50),
          child: const Center(
            child: Text('Product Mockup Workspace', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
          ),
        ),
      ),
    ];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
      child: isMobile ? Column(children: content.map((e) => e as Widget).toList()) : Row(children: content),
    );
  }

  // 4. Bonuses Preview
  Widget _buildBonusesPreview(
    BonusSection bonuses,
    LandingPageTemplate temp,
    Color primary,
    Color textCol,
    bool isMobile,
  ) {
    final isDark = temp.backgroundColor.contains('162520') || temp.backgroundColor.contains('21362F');
    final cardBg = isDark ? const Color(0xFF21362F) : Colors.grey.shade50;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
      child: Column(
        children: [
          Text(bonuses.title, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 22, fontWeight: FontWeight.bold, color: textCol)),
          const SizedBox(height: 32),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: bonuses.items.length,
            separatorBuilder: (_, __) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final item = bonuses.items[index];
              return Container(
                padding: const EdgeInsets.all(20),
                decoration: _buildCardDecoration(temp, cardBg),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: Colors.red.shade100, borderRadius: BorderRadius.circular(6)),
                      child: Text(item.value, style: TextStyle(color: Colors.red.shade800, fontWeight: FontWeight.bold, fontSize: 11)),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.title, style: TextStyle(fontFamily: temp.fontHeading, fontWeight: FontWeight.bold)),
                          Text(item.description, style: TextStyle(fontFamily: temp.fontBody, color: Colors.grey, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // 5. Testimonials Preview
  Widget _buildTestimonialsPreview(
    TestimonialsSection testimonials,
    LandingPageTemplate temp,
    Color primary,
    Color textCol,
    bool isMobile,
  ) {
    final isDark = temp.backgroundColor.contains('162520') || temp.backgroundColor.contains('21362F');
    final cardBg = isDark ? const Color(0xFF21362F) : Colors.white;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
      child: Column(
        children: [
          Text(testimonials.title, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 22, fontWeight: FontWeight.bold, color: textCol)),
          const SizedBox(height: 32),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: testimonials.items.length,
            separatorBuilder: (_, __) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final item = testimonials.items[index];
              return Container(
                padding: const EdgeInsets.all(24),
                decoration: _buildCardDecoration(temp, cardBg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(children: [Icon(Icons.star, color: Colors.amber, size: 16)]),
                    const SizedBox(height: 12),
                    Text('"${item.content}"', style: TextStyle(fontFamily: temp.fontBody, fontStyle: FontStyle.italic, fontSize: 13)),
                    const SizedBox(height: 16),
                    Text(item.name, style: TextStyle(fontFamily: temp.fontHeading, fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(item.role, style: TextStyle(fontFamily: temp.fontBody, color: Colors.grey, fontSize: 11)),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // 6. Offer Preview
  Widget _buildOfferPreview(
    OfferSection offer,
    LandingPageTemplate temp,
    Color primary,
    Color secondary,
    Color textCol,
    bool isMobile,
  ) {
    final isDark = temp.backgroundColor.contains('162520') || temp.backgroundColor.contains('21362F');
    final cardBg = isDark ? const Color(0xFF21362F) : Colors.white;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(40),
        decoration: _buildCardDecoration(temp, cardBg),
        child: Column(
          children: [
            Text(offer.title, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(offer.description, style: TextStyle(fontFamily: temp.fontBody, color: Colors.grey)),
            const SizedBox(height: 24),
            Text(offer.price, style: const TextStyle(decoration: TextDecoration.lineThrough, color: Colors.grey)),
            Text(offer.discountPrice, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 36, fontWeight: FontWeight.w900, color: primary)),
            const SizedBox(height: 24),
            _buildActionButton(
              text: offer.ctaText,
              primary: primary,
              secondary: secondary,
              buttonStyle: temp.buttonStyle,
              radius: temp.borderRadius,
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }

  // 7. FAQ Preview
  Widget _buildFAQPreview(
    FAQSection faq,
    LandingPageTemplate temp,
    Color primary,
    Color textCol,
  ) {
    final isDark = temp.backgroundColor.contains('162520') || temp.backgroundColor.contains('21362F');
    final cardBg = isDark ? const Color(0xFF21362F) : Colors.white;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
      child: Column(
        children: [
          Text(faq.title, style: TextStyle(fontFamily: temp.fontHeading, fontSize: 22, fontWeight: FontWeight.bold, color: textCol)),
          const SizedBox(height: 32),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: faq.items.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final item = faq.items[index];
              return Container(
                padding: const EdgeInsets.all(20),
                decoration: _buildCardDecoration(temp, cardBg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item.question, style: TextStyle(fontFamily: temp.fontHeading, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text(item.answer, style: TextStyle(fontFamily: temp.fontBody, color: Colors.grey, fontSize: 13)),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // 8. Footer Preview
  Widget _buildFooterPreview(
    FooterSection footer,
    LandingPageTemplate temp,
    Color primary,
    Color textCol,
    bool isMobile,
  ) {
    return Container(
      color: Colors.grey.shade900,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
      width: double.infinity,
      child: Column(
        children: [
          Text(
            footer.copyrightText,
            style: const TextStyle(color: Colors.grey, fontSize: 12),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
