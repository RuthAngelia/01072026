import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import '../../core/providers/project_provider.dart';
import '../../core/providers/settings_provider.dart';
import '../../models/landing_page_models.dart';
import '../../core/theme/app_theme_gen.dart';
import '../../services/mock_templates.dart';

class EditorWorkspace extends ConsumerWidget {
  const EditorWorkspace({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeTab = ref.watch(activeEditorTabProvider);
    final data = ref.watch(activeProjectProvider);

    final tabs = [
      '✨ AI Suggestions',
      'Basic Info',
      'Hero',
      'Benefits',
      'Product Bridge',
      'Bonus',
      'Testimonials',
      'Offer',
      'Objection (FAQ)',
      'Theme Settings',
    ];

    return Container(
      color: Colors.white,
      child: Column(
        children: [
          // Tab navigation bar
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: List.generate(tabs.length, (index) {
                final isActive = activeTab == index;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(tabs[index]),
                    selected: isActive,
                    onSelected: (val) {
                      if (val) {
                        ref.read(activeEditorTabProvider.notifier).state = index;
                      }
                    },
                    selectedColor: AppThemeGen.primary.withOpacity(0.12),
                    labelStyle: TextStyle(
                      color: isActive ? AppThemeGen.primary : Colors.grey.shade600,
                      fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                );
              }),
            ),
          ),
          const Divider(height: 1),

          // Scrollable Editor Form Panel
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: _buildFormContent(context, ref, activeTab, data),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormContent(
    BuildContext context,
    WidgetRef ref,
    int tabIndex,
    LandingPageData data,
  ) {
    switch (tabIndex) {
      case 0:
        return _buildAiSuggestionsForm(ref, data);
      case 1:
        return _buildBasicInfoForm(ref, data);
      case 2:
        return _buildHeroForm(ref, data);
      case 3:
        return _buildBenefitsForm(ref, data);
      case 4:
        return _buildBridgeForm(ref, data);
      case 5:
        return _buildBonusForm(ref, data);
      case 6:
        return _buildTestimonialsForm(ref, data);
      case 7:
        return _buildOfferForm(ref, data);
      case 8:
        return _buildObjectionForm(ref, data);
      case 9:
        return _buildThemeForm(context, ref, data);
      default:
        return const Center(child: Text('Editor form panel'));
    }
  }

  Widget _buildSectionHeader({
    required String title,
    required bool enabled,
    required ValueChanged<bool?> onToggle,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        const SizedBox(width: 16),
        Row(
          children: [
            const Text('Aktifkan Section', style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(width: 8),
            Switch(
              value: enabled,
              onChanged: onToggle,
              activeColor: AppThemeGen.primary,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBasicInfoForm(WidgetRef ref, LandingPageData data) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Project Identity', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: data.project.name,
          decoration: const InputDecoration(labelText: 'Nama Project (Internal)'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(project: data.project.copyWith(name: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: data.basicInfo.title,
          decoration: const InputDecoration(labelText: 'Judul Halaman (Browser Title)'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(basicInfo: data.basicInfo.copyWith(title: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: data.basicInfo.description,
          maxLines: 3,
          decoration: const InputDecoration(labelText: 'Deskripsi Meta (SEO)'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(basicInfo: data.basicInfo.copyWith(description: val)),
                );
          },
        ),
      ],
    );
  }

  Widget _buildHeroForm(WidgetRef ref, LandingPageData data) {
    final hero = data.hero;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          title: 'Hero Configuration',
          enabled: hero.enabled,
          onToggle: (val) {
            if (val != null) {
              ref.read(activeProjectProvider.notifier).updateState(
                    data.copyWith(hero: hero.copyWith(enabled: val)),
                  );
            }
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: hero.headline,
          decoration: const InputDecoration(labelText: 'Headline Utama'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(hero: hero.copyWith(headline: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: hero.subheadline,
          maxLines: 2,
          decoration: const InputDecoration(labelText: 'Subheadline'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(hero: hero.copyWith(subheadline: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                initialValue: hero.ctaText,
                decoration: const InputDecoration(labelText: 'Teks Tombol CTA'),
                onChanged: (val) {
                  ref.read(activeProjectProvider.notifier).updateState(
                        data.copyWith(hero: hero.copyWith(ctaText: val)),
                      );
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                initialValue: hero.ctaTarget,
                decoration: const InputDecoration(labelText: 'Target Link (e.g. #offer)'),
                onChanged: (val) {
                  ref.read(activeProjectProvider.notifier).updateState(
                        data.copyWith(hero: hero.copyWith(ctaTarget: val)),
                      );
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBenefitsForm(WidgetRef ref, LandingPageData data) {
    final benefits = data.benefits;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          title: 'Benefits Grid',
          enabled: benefits.enabled,
          onToggle: (val) {
            if (val != null) {
              ref.read(activeProjectProvider.notifier).updateState(
                    data.copyWith(benefits: benefits.copyWith(enabled: val)),
                  );
            }
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: benefits.title,
          decoration: const InputDecoration(labelText: 'Judul Section'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(benefits: benefits.copyWith(title: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: benefits.subtitle,
          decoration: const InputDecoration(labelText: 'Subtitle Section'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(benefits: benefits.copyWith(subtitle: val)),
                );
          },
        ),
        const SizedBox(height: 32),
        const Text('Daftar Fitur/Benefit', style: TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: benefits.items.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final item = benefits.items[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  TextFormField(
                    initialValue: item.title,
                    decoration: const InputDecoration(labelText: 'Nama Fitur'),
                    onChanged: (val) {
                      final updatedItems = List<BenefitItem>.from(benefits.items);
                      updatedItems[index] = BenefitItem(
                        title: val,
                        description: item.description,
                        iconName: item.iconName,
                      );
                      ref.read(activeProjectProvider.notifier).updateState(
                            data.copyWith(benefits: benefits.copyWith(items: updatedItems)),
                          );
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    initialValue: item.description,
                    decoration: const InputDecoration(labelText: 'Deskripsi Singkat'),
                    onChanged: (val) {
                      final updatedItems = List<BenefitItem>.from(benefits.items);
                      updatedItems[index] = BenefitItem(
                        title: item.title,
                        description: val,
                        iconName: item.iconName,
                      );
                      ref.read(activeProjectProvider.notifier).updateState(
                            data.copyWith(benefits: benefits.copyWith(items: updatedItems)),
                          );
                    },
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildBridgeForm(WidgetRef ref, LandingPageData data) {
    final bridge = data.productBridge;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          title: 'Product Bridge / Mockup Showcase',
          enabled: bridge.enabled,
          onToggle: (val) {
            if (val != null) {
              ref.read(activeProjectProvider.notifier).updateState(
                    data.copyWith(productBridge: bridge.copyWith(enabled: val)),
                  );
            }
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: bridge.title,
          decoration: const InputDecoration(labelText: 'Judul Section Jembatan'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(productBridge: bridge.copyWith(title: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: bridge.description,
          maxLines: 4,
          decoration: const InputDecoration(labelText: 'Copy Deskripsi Jembatan'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(productBridge: bridge.copyWith(description: val)),
                );
          },
        ),
      ],
    );
  }

  Widget _buildBonusForm(WidgetRef ref, LandingPageData data) {
    final bonuses = data.bonuses;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          title: 'Bonuses Stack',
          enabled: bonuses.enabled,
          onToggle: (val) {
            if (val != null) {
              ref.read(activeProjectProvider.notifier).updateState(
                    data.copyWith(bonuses: bonuses.copyWith(enabled: val)),
                  );
            }
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: bonuses.title,
          decoration: const InputDecoration(labelText: 'Judul Section Bonus'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(bonuses: bonuses.copyWith(title: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: bonuses.items.length,
          separatorBuilder: (_, __) => const SizedBox(height: 16),
          itemBuilder: (context, index) {
            final item = bonuses.items[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12)),
              child: Column(
                children: [
                  TextFormField(
                    initialValue: item.title,
                    decoration: const InputDecoration(labelText: 'Judul Bonus'),
                    onChanged: (val) {
                      final list = List<BonusItem>.from(bonuses.items);
                      list[index] = BonusItem(title: val, value: item.value, description: item.description, imageUrl: item.imageUrl);
                      ref.read(activeProjectProvider.notifier).updateState(data.copyWith(bonuses: bonuses.copyWith(items: list)));
                    },
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          initialValue: item.value,
                          decoration: const InputDecoration(labelText: 'Nilai Bonus (e.g. Rp 100k)'),
                          onChanged: (val) {
                            final list = List<BonusItem>.from(bonuses.items);
                            list[index] = BonusItem(title: item.title, value: val, description: item.description, imageUrl: item.imageUrl);
                            ref.read(activeProjectProvider.notifier).updateState(data.copyWith(bonuses: bonuses.copyWith(items: list)));
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextFormField(
                          initialValue: item.description,
                          decoration: const InputDecoration(labelText: 'Deskripsi singkat bonus'),
                          onChanged: (val) {
                            final list = List<BonusItem>.from(bonuses.items);
                            list[index] = BonusItem(title: item.title, value: item.value, description: val, imageUrl: item.imageUrl);
                            ref.read(activeProjectProvider.notifier).updateState(data.copyWith(bonuses: bonuses.copyWith(items: list)));
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildTestimonialsForm(WidgetRef ref, LandingPageData data) {
    final testimonials = data.testimonials;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          title: 'Social Proof / Testimonials',
          enabled: testimonials.enabled,
          onToggle: (val) {
            if (val != null) {
              ref.read(activeProjectProvider.notifier).updateState(
                    data.copyWith(testimonials: testimonials.copyWith(enabled: val)),
                  );
            }
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: testimonials.title,
          decoration: const InputDecoration(labelText: 'Judul Section Testimonial'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(testimonials: testimonials.copyWith(title: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: testimonials.items.length,
          separatorBuilder: (_, __) => const SizedBox(height: 16),
          itemBuilder: (context, index) {
            final item = testimonials.items[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12)),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          initialValue: item.name,
                          decoration: const InputDecoration(labelText: 'Nama Pengulas'),
                          onChanged: (val) {
                            final list = List<TestimonialItem>.from(testimonials.items);
                            list[index] = TestimonialItem(name: val, role: item.role, content: item.content, avatarUrl: item.avatarUrl, rating: item.rating);
                            ref.read(activeProjectProvider.notifier).updateState(data.copyWith(testimonials: testimonials.copyWith(items: list)));
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextFormField(
                          initialValue: item.role,
                          decoration: const InputDecoration(labelText: 'Pekerjaan / Role'),
                          onChanged: (val) {
                            final list = List<TestimonialItem>.from(testimonials.items);
                            list[index] = TestimonialItem(name: item.name, role: val, content: item.content, avatarUrl: item.avatarUrl, rating: item.rating);
                            ref.read(activeProjectProvider.notifier).updateState(data.copyWith(testimonials: testimonials.copyWith(items: list)));
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    initialValue: item.content,
                    maxLines: 2,
                    decoration: const InputDecoration(labelText: 'Isi Review Testimonial'),
                    onChanged: (val) {
                      final list = List<TestimonialItem>.from(testimonials.items);
                      list[index] = TestimonialItem(name: item.name, role: item.role, content: val, avatarUrl: item.avatarUrl, rating: item.rating);
                      ref.read(activeProjectProvider.notifier).updateState(data.copyWith(testimonials: testimonials.copyWith(items: list)));
                    },
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildOfferForm(WidgetRef ref, LandingPageData data) {
    final offer = data.offer;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          title: 'Offer Stack Card',
          enabled: offer.enabled,
          onToggle: (val) {
            if (val != null) {
              ref.read(activeProjectProvider.notifier).updateState(
                    data.copyWith(offer: offer.copyWith(enabled: val)),
                  );
            }
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: offer.title,
          decoration: const InputDecoration(labelText: 'Judul Penawaran'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(offer: offer.copyWith(title: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                initialValue: offer.price,
                decoration: const InputDecoration(labelText: 'Harga Normal'),
                onChanged: (val) {
                  ref.read(activeProjectProvider.notifier).updateState(
                        data.copyWith(offer: offer.copyWith(price: val)),
                      );
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                initialValue: offer.discountPrice,
                decoration: const InputDecoration(labelText: 'Harga Diskon / Promo'),
                onChanged: (val) {
                  ref.read(activeProjectProvider.notifier).updateState(
                        data.copyWith(offer: offer.copyWith(discountPrice: val)),
                      );
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: offer.description,
          decoration: const InputDecoration(labelText: 'Copy Keterangan CTA'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(offer: offer.copyWith(description: val)),
                );
          },
        ),
      ],
    );
  }

  Widget _buildObjectionForm(WidgetRef ref, LandingPageData data) {
    final faq = data.faq;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(
          title: 'FAQ / Objection List',
          enabled: faq.enabled,
          onToggle: (val) {
            if (val != null) {
              ref.read(activeProjectProvider.notifier).updateState(
                    data.copyWith(faq: faq.copyWith(enabled: val)),
                  );
            }
          },
        ),
        const SizedBox(height: 24),
        TextFormField(
          initialValue: faq.title,
          decoration: const InputDecoration(labelText: 'Judul FAQ Section'),
          onChanged: (val) {
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(faq: faq.copyWith(title: val)),
                );
          },
        ),
        const SizedBox(height: 24),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: faq.items.length,
          separatorBuilder: (_, __) => const SizedBox(height: 16),
          itemBuilder: (context, index) {
            final item = faq.items[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12)),
              child: Column(
                children: [
                  TextFormField(
                    initialValue: item.question,
                    decoration: const InputDecoration(labelText: 'Pertanyaan'),
                    onChanged: (val) {
                      final list = List<FAQItem>.from(faq.items);
                      list[index] = FAQItem(question: val, answer: item.answer);
                      ref.read(activeProjectProvider.notifier).updateState(data.copyWith(faq: faq.copyWith(items: list)));
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    initialValue: item.answer,
                    maxLines: 2,
                    decoration: const InputDecoration(labelText: 'Jawaban Penjelas'),
                    onChanged: (val) {
                      final list = List<FAQItem>.from(faq.items);
                      list[index] = FAQItem(question: item.question, answer: val);
                      ref.read(activeProjectProvider.notifier).updateState(data.copyWith(faq: faq.copyWith(items: list)));
                    },
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildThemeForm(BuildContext context, WidgetRef ref, LandingPageData data) {
    final brand = data.brand;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Visual Theme & Color Configurations', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 24),
        _buildColorPickerRow(
          context,
          label: 'Primary Accent Color',
          colorHex: brand.primaryColor,
          onColorChanged: (color) {
            final colorString = '#${color.value.toRadixString(16).substring(2).toUpperCase()}';
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(brand: brand.copyWith(primaryColor: colorString)),
                );
          },
        ),
        const SizedBox(height: 20),
        _buildColorPickerRow(
          context,
          label: 'Secondary Accent Color',
          colorHex: brand.secondaryColor,
          onColorChanged: (color) {
            final colorString = '#${color.value.toRadixString(16).substring(2).toUpperCase()}';
            ref.read(activeProjectProvider.notifier).updateState(
                  data.copyWith(brand: brand.copyWith(secondaryColor: colorString)),
                );
          },
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                initialValue: brand.fontHeading,
                decoration: const InputDecoration(labelText: 'Font Heading (Google Fonts)'),
                onChanged: (val) {
                  ref.read(activeProjectProvider.notifier).updateState(
                        data.copyWith(brand: brand.copyWith(fontHeading: val)),
                      );
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                initialValue: brand.fontBody,
                decoration: const InputDecoration(labelText: 'Font Body (Google Fonts)'),
                onChanged: (val) {
                  ref.read(activeProjectProvider.notifier).updateState(
                        data.copyWith(brand: brand.copyWith(fontBody: val)),
                      );
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: DropdownButtonFormField<double>(
                value: brand.borderRadius,
                decoration: const InputDecoration(labelText: 'Corner Border Radius'),
                items: [0.0, 8.0, 12.0, 16.0, 24.0]
                    .map((val) => DropdownMenuItem(value: val, child: Text('${val.toInt()} px')))
                    .toList(),
                onChanged: (val) {
                  if (val != null) {
                    ref.read(activeProjectProvider.notifier).updateState(
                          data.copyWith(brand: brand.copyWith(borderRadius: val)),
                        );
                  }
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: DropdownButtonFormField<String>(
                value: brand.buttonStyle,
                decoration: const InputDecoration(labelText: 'Tombol Style'),
                items: ['Solid', 'Gradient', 'Outline']
                    .map((val) => DropdownMenuItem(value: val, child: Text(val)))
                    .toList(),
                onChanged: (val) {
                  if (val != null) {
                    ref.read(activeProjectProvider.notifier).updateState(
                          data.copyWith(brand: brand.copyWith(buttonStyle: val)),
                        );
                  }
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildColorPickerRow(
    BuildContext context, {
    required String label,
    required String colorHex,
    required ValueChanged<Color> onColorChanged,
  }) {
    Color pickerColor = Color(int.parse(colorHex.replaceFirst('#', '0xFF')));

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
              const SizedBox(height: 4),
              Text(colorHex, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        ),
        const SizedBox(width: 16),
        GestureDetector(
          onTap: () {
            showDialog(
              context: context,
              builder: (context) => AlertDialog(
                title: const Text('Pilih Warna'),
                content: SingleChildScrollView(
                  child: ColorPicker(
                    pickerColor: pickerColor,
                    onColorChanged: onColorChanged,
                  ),
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Selesai'),
                  ),
                ],
              ),
            );
          },
          child: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: pickerColor,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.grey.shade200, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAiSuggestionsForm(WidgetRef ref, LandingPageData data) {
    final suggestions = ref.watch(designSuggestionsProvider);
    final templates = MockTemplates.templates;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'AI Design Suggestions',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        const SizedBox(height: 6),
        const Text(
          'Browse 8 unique AI-generated variations based on your page content, matching organic styles, asymmetrical layout structures, and curated warm color systems.',
          style: TextStyle(color: Colors.grey, fontSize: 12, height: 1.4),
        ),
        const SizedBox(height: 24),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: suggestions.length,
          separatorBuilder: (_, __) => const SizedBox(height: 20),
          itemBuilder: (context, index) {
            final suggestion = suggestions[index];
            final templateId = suggestion.selectedTemplateId;
            final template = templates.firstWhere((t) => t.id == templateId);

            final primaryColor = Color(int.parse(suggestion.brand.primaryColor.replaceFirst('#', '0xFF')));
            final secondaryColor = Color(int.parse(suggestion.brand.secondaryColor.replaceFirst('#', '0xFF')));
            final bgColor = Color(int.parse(suggestion.brand.backgroundColor.replaceFirst('#', '0xFF')));

            return Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Concept #${index + 1}: ${template.style}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppThemeGen.primary.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            template.category,
                            style: const TextStyle(color: AppThemeGen.primary, fontSize: 9, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        _buildColorDot(primaryColor),
                        _buildColorDot(secondaryColor),
                        _buildColorDot(bgColor),
                        const SizedBox(width: 12),
                        Text(
                          'Fonts: ${suggestion.brand.fontHeading} / ${suggestion.brand.fontBody}',
                          style: const TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                    ElevatedButton(
                      onPressed: () {
                        final populatedCopy = MockTemplates.applyTemplateCopy(suggestion, template.category);
                        ref.read(activeProjectProvider.notifier).updateState(populatedCopy);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Applied Design Concept #${index + 1}!')),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppThemeGen.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text('Apply Concept'),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildColorDot(Color col) {
    return Container(
      width: 16,
      height: 16,
      margin: const EdgeInsets.only(right: 6),
      decoration: BoxDecoration(
        color: col,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.grey.shade300, width: 0.5),
      ),
    );
  }
}
