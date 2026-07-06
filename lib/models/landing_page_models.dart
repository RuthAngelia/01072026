import 'dart:convert';

class LandingPageData {
  final Project project;
  final Brand brand;
  final BasicInfo basicInfo;
  final HeroSection hero;
  final BenefitsSection benefits;
  final ProductBridge productBridge;
  final BonusSection bonuses;
  final TestimonialsSection testimonials;
  final OfferSection offer;
  final FAQSection faq;
  final FooterSection footer;
  final String selectedTemplateId;

  const LandingPageData({
    required this.project,
    required this.brand,
    required this.basicInfo,
    required this.hero,
    required this.benefits,
    required this.productBridge,
    required this.bonuses,
    required this.testimonials,
    required this.offer,
    required this.faq,
    required this.footer,
    required this.selectedTemplateId,
  });

  factory LandingPageData.initial() {
    return LandingPageData(
      project: Project(
        id: 'default',
        name: 'Landing Page Baru',
        createdAt: DateTime.now().toIso8601String(),
        updatedAt: DateTime.now().toIso8601String(),
      ),
      brand: const Brand(
        name: 'AuraGen',
        logoUrl: '',
        primaryColor: '#6366F1',
        secondaryColor: '#8B5CF6',
        backgroundColor: '#F8FAFC',
        textColor: '#0F172A',
        borderRadius: 16.0,
        shadow: 'Soft',
        fontHeading: 'Outfit',
        fontBody: 'Plus Jakarta Sans',
        buttonStyle: 'Gradient',
      ),
      basicInfo: const BasicInfo(
        title: 'Produk Saya',
        description: 'Deskripsi singkat tentang produk luar biasa ini.',
        category: 'Ebook',
      ),
      hero: const HeroSection(
        enabled: true,
        headline: 'Ubah Pengunjung Menjadi Pembeli Dengan AI',
        subheadline: 'Buat landing page berkualitas tinggi dalam hitungan menit tanpa ribet coding.',
        ctaText: 'Mulai Sekarang',
        ctaTarget: '#offer',
        imageUrl: '',
        showGradients: true,
      ),
      benefits: const BenefitsSection(
        enabled: true,
        title: 'Mengapa Memilih Kami?',
        subtitle: 'Fitur terbaik yang dirancang khusus untuk meningkatkan konversi Anda.',
        items: [
          BenefitItem(title: 'Proses Instan', description: 'Hasilkan aset dalam 5 detik saja.', iconName: 'bolt'),
          BenefitItem(title: 'Tanpa Coding', description: 'Gunakan editor visual yang sangat intuitif.', iconName: 'code_off'),
          BenefitItem(title: 'Ekspor Siap Pakai', description: 'Unduh file ZIP berisi HTML dan CSS bersih.', iconName: 'download'),
        ],
      ),
      productBridge: const ProductBridge(
        enabled: true,
        title: 'Memperkenalkan Solusi Terbaik',
        description: 'Jembatan produk membantu audiens memahami bagaimana produk Anda menyelesaikan masalah utama mereka secara elegan.',
        imageUrl: '',
        ctaText: 'Pelajari Selengkapnya',
      ),
      bonuses: const BonusSection(
        enabled: true,
        title: 'Bonus Eksklusif Untuk Anda',
        items: [
          BonusItem(
            title: 'Template Siap Pakai',
            value: 'Rp 250.000',
            description: '10 template landing page siap pakai untuk berbagai industri.',
            imageUrl: '',
          ),
          BonusItem(
            title: 'Ebook Panduan Konversi',
            value: 'Rp 150.000',
            description: 'Strategi menulis copy yang menghasilkan penjualan tinggi.',
            imageUrl: '',
          ),
        ],
      ),
      testimonials: const TestimonialsSection(
        enabled: true,
        title: 'Kata Mereka Yang Sudah Mencoba',
        items: [
          TestimonialItem(
            name: 'Sarah Juanda',
            role: 'Digital Marketer',
            content: 'Landing page generator ini menghemat waktu saya hingga 80%. Hasil ekspor HTML-nya sangat bersih dan cepat di-load.',
            avatarUrl: '',
            rating: 5.0,
          ),
          TestimonialItem(
            name: 'Budi Hartono',
            role: 'UMKM Owner',
            content: 'Sangat mudah digunakan bahkan untuk saya yang tidak mengerti teknologi. Penjualan produk saya meningkat setelah menggunakan landing page baru ini.',
            avatarUrl: '',
            rating: 4.8,
          ),
        ],
      ),
      offer: const OfferSection(
        enabled: true,
        title: 'Dapatkan Akses Sekarang',
        price: 'Rp 499.000',
        discountPrice: 'Rp 199.000',
        description: 'Penawaran terbatas! Dapatkan produk utama beserta seluruh bonus hari ini.',
        ctaText: 'Beli Sekarang',
        features: [
          'Akses penuh ke modul produk',
          '2 Bonus eksklusif senilai Rp 400k',
          'Dukungan update selamanya',
          'Garansi uang kembali 14 hari',
        ],
      ),
      faq: const FAQSection(
        enabled: true,
        title: 'Pertanyaan Yang Sering Diajukan',
        items: [
          FAQItem(
            question: 'Apakah saya bisa menggunakan domain sendiri?',
            answer: 'Ya, hasil ekspor berupa file HTML & CSS standar yang bisa Anda upload ke hosting mana saja atau platform gratis seperti Netlify dan GitHub Pages.',
          ),
          FAQItem(
            question: 'Apakah ada biaya langganan?',
            answer: 'Tidak, aplikasi ini berjalan secara lokal dan Anda bebas menghasilkan landing page sebanyak yang Anda mau.',
          ),
        ],
      ),
      footer: const FooterSection(
        enabled: true,
        copyrightText: '© 2026 LandingPage Generator. All rights reserved.',
        links: ['Syarat & Ketentuan', 'Kebijakan Privasi'],
      ),
      selectedTemplateId: 'template_1',
    );
  }

  LandingPageData copyWith({
    Project? project,
    Brand? brand,
    BasicInfo? basicInfo,
    HeroSection? hero,
    BenefitsSection? benefits,
    ProductBridge? productBridge,
    BonusSection? bonuses,
    TestimonialsSection? testimonials,
    OfferSection? offer,
    FAQSection? faq,
    FooterSection? footer,
    String? selectedTemplateId,
  }) {
    return LandingPageData(
      project: project ?? this.project,
      brand: brand ?? this.brand,
      basicInfo: basicInfo ?? this.basicInfo,
      hero: hero ?? this.hero,
      benefits: benefits ?? this.benefits,
      productBridge: productBridge ?? this.productBridge,
      bonuses: bonuses ?? this.bonuses,
      testimonials: testimonials ?? this.testimonials,
      offer: offer ?? this.offer,
      faq: faq ?? this.faq,
      footer: footer ?? this.footer,
      selectedTemplateId: selectedTemplateId ?? this.selectedTemplateId,
    );
  }

  factory LandingPageData.fromRawJson(String str) => LandingPageData.fromJson(json.decode(str));

  String toRawJson() => json.encode(toJson());

  factory LandingPageData.fromJson(Map<String, dynamic> json) {
    return LandingPageData(
      project: Project.fromJson(json['project']),
      brand: Brand.fromJson(json['brand']),
      basicInfo: BasicInfo.fromJson(json['basicInfo']),
      hero: HeroSection.fromJson(json['hero']),
      benefits: BenefitsSection.fromJson(json['benefits']),
      productBridge: ProductBridge.fromJson(json['productBridge']),
      bonuses: BonusSection.fromJson(json['bonuses']),
      testimonials: TestimonialsSection.fromJson(json['testimonials']),
      offer: OfferSection.fromJson(json['offer']),
      faq: FAQSection.fromJson(json['faq']),
      footer: FooterSection.fromJson(json['footer']),
      selectedTemplateId: json['selectedTemplateId'] as String? ?? 'template_1',
    );
  }

  Map<String, dynamic> toJson() => {
        'project': project.toJson(),
        'brand': brand.toJson(),
        'basicInfo': basicInfo.toJson(),
        'hero': hero.toJson(),
        'benefits': benefits.toJson(),
        'productBridge': productBridge.toJson(),
        'bonuses': bonuses.toJson(),
        'testimonials': testimonials.toJson(),
        'offer': offer.toJson(),
        'faq': faq.toJson(),
        'footer': footer.toJson(),
        'selectedTemplateId': selectedTemplateId,
      };
  }

class Project {
  final String id;
  final String name;
  final String createdAt;
  final String updatedAt;

  const Project({
    required this.id,
    required this.name,
    required this.createdAt,
    required this.updatedAt,
  });

  Project copyWith({
    String? id,
    String? name,
    String? createdAt,
    String? updatedAt,
  }) {
    return Project(
      id: id ?? this.id,
      name: name ?? this.name,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['id'] as String,
      name: json['name'] as String,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}

class Brand {
  final String name;
  final String logoUrl;
  final String primaryColor;
  final String secondaryColor;
  final String backgroundColor;
  final String textColor;
  final double borderRadius;
  final String shadow;
  final String fontHeading;
  final String fontBody;
  final String buttonStyle;

  const Brand({
    required this.name,
    required this.logoUrl,
    required this.primaryColor,
    required this.secondaryColor,
    required this.backgroundColor,
    required this.textColor,
    required this.borderRadius,
    required this.shadow,
    required this.fontHeading,
    required this.fontBody,
    required this.buttonStyle,
  });

  Brand copyWith({
    String? name,
    String? logoUrl,
    String? primaryColor,
    String? secondaryColor,
    String? backgroundColor,
    String? textColor,
    double? borderRadius,
    String? shadow,
    String? fontHeading,
    String? fontBody,
    String? buttonStyle,
  }) {
    return Brand(
      name: name ?? this.name,
      logoUrl: logoUrl ?? this.logoUrl,
      primaryColor: primaryColor ?? this.primaryColor,
      secondaryColor: secondaryColor ?? this.secondaryColor,
      backgroundColor: backgroundColor ?? this.backgroundColor,
      textColor: textColor ?? this.textColor,
      borderRadius: borderRadius ?? this.borderRadius,
      shadow: shadow ?? this.shadow,
      fontHeading: fontHeading ?? this.fontHeading,
      fontBody: fontBody ?? this.fontBody,
      buttonStyle: buttonStyle ?? this.buttonStyle,
    );
  }

  factory Brand.fromJson(Map<String, dynamic> json) {
    return Brand(
      name: json['name'] as String,
      logoUrl: json['logoUrl'] as String? ?? '',
      primaryColor: json['primaryColor'] as String,
      secondaryColor: json['secondaryColor'] as String,
      backgroundColor: json['backgroundColor'] as String,
      textColor: json['textColor'] as String,
      borderRadius: (json['borderRadius'] as num).toDouble(),
      shadow: json['shadow'] as String,
      fontHeading: json['fontHeading'] as String,
      fontBody: json['fontBody'] as String,
      buttonStyle: json['buttonStyle'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'logoUrl': logoUrl,
        'primaryColor': primaryColor,
        'secondaryColor': secondaryColor,
        'backgroundColor': backgroundColor,
        'textColor': textColor,
        'borderRadius': borderRadius,
        'shadow': shadow,
        'fontHeading': fontHeading,
        'fontBody': fontBody,
        'buttonStyle': buttonStyle,
      };
}

class BasicInfo {
  final String title;
  final String description;
  final String category;

  const BasicInfo({
    required this.title,
    required this.description,
    required this.category,
  });

  BasicInfo copyWith({
    String? title,
    String? description,
    String? category,
  }) {
    return BasicInfo(
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
    );
  }

  factory BasicInfo.fromJson(Map<String, dynamic> json) {
    return BasicInfo(
      title: json['title'] as String,
      description: json['description'] as String,
      category: json['category'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'title': title,
        'description': description,
        'category': category,
      };
}

class HeroSection {
  final bool enabled;
  final String headline;
  final String subheadline;
  final String ctaText;
  final String ctaTarget;
  final String imageUrl;
  final bool showGradients;

  const HeroSection({
    required this.enabled,
    required this.headline,
    required this.subheadline,
    required this.ctaText,
    required this.ctaTarget,
    required this.imageUrl,
    required this.showGradients,
  });

  HeroSection copyWith({
    bool? enabled,
    String? headline,
    String? subheadline,
    String? ctaText,
    String? ctaTarget,
    String? imageUrl,
    bool? showGradients,
  }) {
    return HeroSection(
      enabled: enabled ?? this.enabled,
      headline: headline ?? this.headline,
      subheadline: subheadline ?? this.subheadline,
      ctaText: ctaText ?? this.ctaText,
      ctaTarget: ctaTarget ?? this.ctaTarget,
      imageUrl: imageUrl ?? this.imageUrl,
      showGradients: showGradients ?? this.showGradients,
    );
  }

  factory HeroSection.fromJson(Map<String, dynamic> json) {
    return HeroSection(
      enabled: json['enabled'] as bool? ?? true,
      headline: json['headline'] as String,
      subheadline: json['subheadline'] as String,
      ctaText: json['ctaText'] as String,
      ctaTarget: json['ctaTarget'] as String,
      imageUrl: json['imageUrl'] as String? ?? '',
      showGradients: json['showGradients'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'headline': headline,
        'subheadline': subheadline,
        'ctaText': ctaText,
        'ctaTarget': ctaTarget,
        'imageUrl': imageUrl,
        'showGradients': showGradients,
      };
}

class BenefitItem {
  final String title;
  final String description;
  final String iconName;

  const BenefitItem({
    required this.title,
    required this.description,
    required this.iconName,
  });

  factory BenefitItem.fromJson(Map<String, dynamic> json) {
    return BenefitItem(
      title: json['title'] as String,
      description: json['description'] as String,
      iconName: json['iconName'] as String? ?? 'bolt',
    );
  }

  Map<String, dynamic> toJson() => {
        'title': title,
        'description': description,
        'iconName': iconName,
      };
}

class BenefitsSection {
  final bool enabled;
  final String title;
  final String subtitle;
  final List<BenefitItem> items;

  const BenefitsSection({
    required this.enabled,
    required this.title,
    required this.subtitle,
    required this.items,
  });

  BenefitsSection copyWith({
    bool? enabled,
    String? title,
    String? subtitle,
    List<BenefitItem>? items,
  }) {
    return BenefitsSection(
      enabled: enabled ?? this.enabled,
      title: title ?? this.title,
      subtitle: subtitle ?? this.subtitle,
      items: items ?? this.items,
    );
  }

  factory BenefitsSection.fromJson(Map<String, dynamic> json) {
    return BenefitsSection(
      enabled: json['enabled'] as bool? ?? true,
      title: json['title'] as String,
      subtitle: json['subtitle'] as String,
      items: (json['items'] as List).map((i) => BenefitItem.fromJson(i)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'title': title,
        'subtitle': subtitle,
        'items': items.map((i) => i.toJson()).toList(),
      };
}

class ProductBridge {
  final bool enabled;
  final String title;
  final String description;
  final String imageUrl;
  final String ctaText;

  const ProductBridge({
    required this.enabled,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.ctaText,
  });

  ProductBridge copyWith({
    bool? enabled,
    String? title,
    String? description,
    String? imageUrl,
    String? ctaText,
  }) {
    return ProductBridge(
      enabled: enabled ?? this.enabled,
      title: title ?? this.title,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      ctaText: ctaText ?? this.ctaText,
    );
  }

  factory ProductBridge.fromJson(Map<String, dynamic> json) {
    return ProductBridge(
      enabled: json['enabled'] as bool? ?? true,
      title: json['title'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String? ?? '',
      ctaText: json['ctaText'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'title': title,
        'description': description,
        'imageUrl': imageUrl,
        'ctaText': ctaText,
      };
}

class BonusItem {
  final String title;
  final String value;
  final String description;
  final String imageUrl;

  const BonusItem({
    required this.title,
    required this.value,
    required this.description,
    required this.imageUrl,
  });

  factory BonusItem.fromJson(Map<String, dynamic> json) {
    return BonusItem(
      title: json['title'] as String,
      value: json['value'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'title': title,
        'value': value,
        'description': description,
        'imageUrl': imageUrl,
      };
}

class BonusSection {
  final bool enabled;
  final String title;
  final List<BonusItem> items;

  const BonusSection({
    required this.enabled,
    required this.title,
    required this.items,
  });

  BonusSection copyWith({
    bool? enabled,
    String? title,
    List<BonusItem>? items,
  }) {
    return BonusSection(
      enabled: enabled ?? this.enabled,
      title: title ?? this.title,
      items: items ?? this.items,
    );
  }

  factory BonusSection.fromJson(Map<String, dynamic> json) {
    return BonusSection(
      enabled: json['enabled'] as bool? ?? true,
      title: json['title'] as String,
      items: (json['items'] as List).map((i) => BonusItem.fromJson(i)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'title': title,
        'items': items.map((i) => i.toJson()).toList(),
      };
}

class TestimonialItem {
  final String name;
  final String role;
  final String content;
  final String avatarUrl;
  final double rating;

  const TestimonialItem({
    required this.name,
    required this.role,
    required this.content,
    required this.avatarUrl,
    required this.rating,
  });

  factory TestimonialItem.fromJson(Map<String, dynamic> json) {
    return TestimonialItem(
      name: json['name'] as String,
      role: json['role'] as String,
      content: json['content'] as String,
      avatarUrl: json['avatarUrl'] as String? ?? '',
      rating: (json['rating'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'role': role,
        'content': content,
        'avatarUrl': avatarUrl,
        'rating': rating,
      };
}

class TestimonialsSection {
  final bool enabled;
  final String title;
  final List<TestimonialItem> items;

  const TestimonialsSection({
    required this.enabled,
    required this.title,
    required this.items,
  });

  TestimonialsSection copyWith({
    bool? enabled,
    String? title,
    List<TestimonialItem>? items,
  }) {
    return TestimonialsSection(
      enabled: enabled ?? this.enabled,
      title: title ?? this.title,
      items: items ?? this.items,
    );
  }

  factory TestimonialsSection.fromJson(Map<String, dynamic> json) {
    return TestimonialsSection(
      enabled: json['enabled'] as bool? ?? true,
      title: json['title'] as String,
      items: (json['items'] as List).map((i) => TestimonialItem.fromJson(i)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'title': title,
        'items': items.map((i) => i.toJson()).toList(),
      };
}

class OfferSection {
  final bool enabled;
  final String title;
  final String price;
  final String discountPrice;
  final String description;
  final String ctaText;
  final List<String> features;

  const OfferSection({
    required this.enabled,
    required this.title,
    required this.price,
    required this.discountPrice,
    required this.description,
    required this.ctaText,
    required this.features,
  });

  OfferSection copyWith({
    bool? enabled,
    String? title,
    String? price,
    String? discountPrice,
    String? description,
    String? ctaText,
    List<String>? features,
  }) {
    return OfferSection(
      enabled: enabled ?? this.enabled,
      title: title ?? this.title,
      price: price ?? this.price,
      discountPrice: discountPrice ?? this.discountPrice,
      description: description ?? this.description,
      ctaText: ctaText ?? this.ctaText,
      features: features ?? this.features,
    );
  }

  factory OfferSection.fromJson(Map<String, dynamic> json) {
    return OfferSection(
      enabled: json['enabled'] as bool? ?? true,
      title: json['title'] as String,
      price: json['price'] as String,
      discountPrice: json['discountPrice'] as String,
      description: json['description'] as String,
      ctaText: json['ctaText'] as String,
      features: List<String>.from(json['features'] as List),
    );
  }

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'title': title,
        'price': price,
        'discountPrice': discountPrice,
        'description': description,
        'ctaText': ctaText,
        'features': features,
      };
}

class FAQItem {
  final String question;
  final String answer;

  const FAQItem({
    required this.question,
    required this.answer,
  });

  factory FAQItem.fromJson(Map<String, dynamic> json) {
    return FAQItem(
      question: json['question'] as String,
      answer: json['answer'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'question': question,
        'answer': answer,
      };
}

class FAQSection {
  final bool enabled;
  final String title;
  final List<FAQItem> items;

  const FAQSection({
    required this.enabled,
    required this.title,
    required this.items,
  });

  FAQSection copyWith({
    bool? enabled,
    String? title,
    List<FAQItem>? items,
  }) {
    return FAQSection(
      enabled: enabled ?? this.enabled,
      title: title ?? this.title,
      items: items ?? this.items,
    );
  }

  factory FAQSection.fromJson(Map<String, dynamic> json) {
    return FAQSection(
      enabled: json['enabled'] as bool? ?? true,
      title: json['title'] as String,
      items: (json['items'] as List).map((i) => FAQItem.fromJson(i)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'title': title,
        'items': items.map((i) => i.toJson()).toList(),
      };
}

class FooterSection {
  final bool enabled;
  final String copyrightText;
  final List<String> links;

  const FooterSection({
    required this.enabled,
    required this.copyrightText,
    required this.links,
  });

  FooterSection copyWith({
    bool? enabled,
    String? copyrightText,
    List<String>? links,
  }) {
    return FooterSection(
      enabled: enabled ?? this.enabled,
      copyrightText: copyrightText ?? this.copyrightText,
      links: links ?? this.links,
    );
  }

  factory FooterSection.fromJson(Map<String, dynamic> json) {
    return FooterSection(
      enabled: json['enabled'] as bool? ?? true,
      copyrightText: json['copyrightText'] as String,
      links: List<String>.from(json['links'] as List),
    );
  }

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'copyrightText': copyrightText,
        'links': links,
      };
}

class LandingPageTemplate {
  final String id;
  final String name;
  final String category;
  final String style;
  final String heroLayout;
  final String sectionOrder;
  final String primaryColor;
  final String secondaryColor;
  final String accentColor;
  final String backgroundColor;
  final String textColor;
  final String cardColor;
  final String fontHeading;
  final String fontBody;
  final double borderRadius;
  final String buttonStyle;
  final String cardStyle;
  final String spacing;
  final String complexity;

  const LandingPageTemplate({
    required this.id,
    required this.name,
    required this.category,
    required this.style,
    required this.heroLayout,
    required this.sectionOrder,
    required this.primaryColor,
    required this.secondaryColor,
    required this.accentColor,
    required this.backgroundColor,
    required this.textColor,
    required this.cardColor,
    required this.fontHeading,
    required this.fontBody,
    required this.borderRadius,
    required this.buttonStyle,
    required this.cardStyle,
    required this.spacing,
    required this.complexity,
  });

  factory LandingPageTemplate.fromJson(Map<String, dynamic> json) {
    return LandingPageTemplate(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      style: json['style'] as String,
      heroLayout: json['heroLayout'] as String,
      sectionOrder: json['sectionOrder'] as String,
      primaryColor: json['primaryColor'] as String,
      secondaryColor: json['secondaryColor'] as String,
      accentColor: json['accentColor'] as String,
      backgroundColor: json['backgroundColor'] as String,
      textColor: json['textColor'] as String,
      cardColor: json['cardColor'] as String,
      fontHeading: json['fontHeading'] as String,
      fontBody: json['fontBody'] as String,
      borderRadius: (json['borderRadius'] as num).toDouble(),
      buttonStyle: json['buttonStyle'] as String,
      cardStyle: json['cardStyle'] as String,
      spacing: json['spacing'] as String,
      complexity: json['complexity'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'category': category,
        'style': style,
        'heroLayout': heroLayout,
        'sectionOrder': sectionOrder,
        'primaryColor': primaryColor,
        'secondaryColor': secondaryColor,
        'accentColor': accentColor,
        'backgroundColor': backgroundColor,
        'textColor': textColor,
        'cardColor': cardColor,
        'fontHeading': fontHeading,
        'fontBody': fontBody,
        'borderRadius': borderRadius,
        'buttonStyle': buttonStyle,
        'cardStyle': cardStyle,
        'spacing': spacing,
        'complexity': complexity,
      };
}
