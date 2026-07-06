import '../models/landing_page_models.dart';
import 'package:flutter/material.dart';

class MockTemplates {
  static final List<LandingPageTemplate> templates = _generateTemplates();

  static List<LandingPageTemplate> _generateTemplates() {
    final list = <LandingPageTemplate>[];
    
    final categories = ['SaaS', 'AI Startup', 'Ebook', 'Course', 'Agency', 'Portfolio', 'Personal Brand', 'Digital Product', 'Mobile App', 'Local Business'];
    final styles = ['Minimal Editorial', 'Luxury', 'Modern SaaS', 'Apple-inspired', 'Swiss', 'Brutalism', 'Neo Brutalism', 'Soft UI', 'Organic', 'Playful', 'Corporate'];
    final heroLayouts = ['Centered', 'SplitLeft', 'SplitRight', 'GlowAccent', 'MinimalInput'];
    final fontPairs = [
      {'heading': 'Outfit', 'body': 'Plus Jakarta Sans'},
      {'heading': 'Satoshi', 'body': 'Inter'},
      {'heading': 'General Sans', 'body': 'Manrope'},
      {'heading': 'Outfit', 'body': 'Manrope'},
      {'heading': 'Plus Jakarta Sans', 'body': 'Inter'},
    ];
    final colorPalettes = [
      {'primary': '#5F8575', 'secondary': '#D97D64', 'accent': '#E6C280', 'bg': '#F4F1EA', 'card': '#FBFBF9', 'text': '#1E293B'}, // Sage & Terracotta
      {'primary': '#C87A53', 'secondary': '#E3B89E', 'accent': '#8C9A86', 'bg': '#FAF8F5', 'card': '#FFFFFF', 'text': '#2C1D11'}, // Sand & Clay
      {'primary': '#48695C', 'secondary': '#DCAE1D', 'accent': '#C05C46', 'bg': '#F7F6F2', 'card': '#FFFFFF', 'text': '#1D2B24'}, // Moss & Amber
      {'primary': '#AF7B6B', 'secondary': '#6C7E6A', 'accent': '#DEC3AF', 'bg': '#FAF8F6', 'card': '#FFFFFF', 'text': '#2C201C'}, // Clay & Sage
      {'primary': '#D96E49', 'secondary': '#4A6B5D', 'accent': '#E8A382', 'bg': '#FAF8F5', 'card': '#FDFCFB', 'text': '#1A211D'}, // Burnt Orange
    ];
    final orderPatterns = [
      'hero,benefits,bridge,bonuses,testimonials,offer,faq,footer',
      'hero,bridge,benefits,testimonials,offer,faq,footer',
      'hero,benefits,testimonials,offer,footer',
      'hero,bridge,bonuses,offer,faq,footer',
      'hero,benefits,bridge,testimonials,offer,footer',
    ];

    for (int i = 1; i <= 50; i++) {
      final category = categories[(i - 1) % categories.length];
      final style = styles[(i - 1) % styles.length];
      final heroLayout = heroLayouts[(i - 1) % heroLayouts.length];
      final font = fontPairs[(i - 1) % fontPairs.length];
      final color = colorPalettes[(i - 1) % colorPalettes.length];
      final order = orderPatterns[(i - 1) % orderPatterns.length];
      final radius = ((i % 4) * 8.0) + 8.0; // 8, 16, 24, 32px
      final complexity = i % 3 == 0 ? 'Simple' : (i % 3 == 1 ? 'Medium' : 'Advanced');

      list.add(
        LandingPageTemplate(
          id: 'template_\$i',
          name: 'Preset \${style} #\$i',
          category: category,
          style: style,
          heroLayout: heroLayout,
          sectionOrder: order,
          primaryColor: color['primary']!,
          secondaryColor: color['secondary']!,
          accentColor: color['accent']!,
          backgroundColor: color['bg']!,
          textColor: color['text']!,
          cardColor: color['card']!,
          fontHeading: font['heading']!,
          fontBody: font['body']!,
          borderRadius: radius,
          buttonStyle: i % 2 == 0 ? 'Gradient' : 'Solid',
          cardStyle: i % 3 == 0 ? 'Glassmorphism' : (i % 3 == 1 ? 'Minimal' : 'Shadow'),
          spacing: i % 2 == 0 ? 'Compact' : 'Editorial',
          complexity: complexity,
        ),
      );
    }
    return list;
  }

  static LandingPageData applyTemplateCopy(LandingPageData current, String category) {
    if (category == 'SaaS' || category == 'AI Startup') {
      return current.copyWith(
        hero: const HeroSection(
          enabled: true,
          headline: "Simplify Project Workflows with AI",
          subheadline: "Automate your team's redundant tasks with our unified generative workspace. Trusted by 25,000+ fast-growing organizations.",
          ctaText: "Start Free Trial",
          ctaTarget: "",
          imageUrl: "",
          showGradients: true,
        ),
        benefits: const BenefitsSection(
          enabled: true,
          title: "Engineered for Rapid Innovation",
          subtitle: "Discover how we help technology teams build and ship code 3x faster.",
          items: [
            BenefitItem(title: "Real-time sync", description: "All database changes are synchronized immediately across all client devices.", iconName: "bolt"),
            BenefitItem(title: "Advanced AI analytics", description: "Gain insights into pipeline performance and spot bottlenecks instantly.", iconName: "trending_up"),
            BenefitItem(title: "Enterprise grade security", description: "End-to-end encryption with SAML SSO and SOC2 Type II compliance.", iconName: "security"),
          ],
        ),
        productBridge: const ProductBridge(
          enabled: true,
          title: "Integrate with all your existing tools",
          description: "Connect AuraGen with Slack, Notion, GitHub, Jira, and 200+ integrations to automate operations without changing workflows.",
          ctaText: "Explore Integrations",
          imageUrl: "",
        ),
        bonuses: const BonusSection(
          enabled: true,
          title: "Exclusive Launch Bonuses",
          items: [
            BonusItem(title: "1-on-1 Onboarding", description: "Free onboarding session with a solutions engineer.", value: "FREE", imageUrl: ""),
            BonusItem(title: "Developer Kit", description: "Ready-to-use API code snippets & templates.", value: "\$199", imageUrl: ""),
          ],
        ),
        testimonials: const TestimonialsSection(
          enabled: true,
          title: "Loved by Product Teams Worldwide",
          items: [
            TestimonialItem(name: "Sarah Jenkins", role: "VP of Product, Linear", content: "AuraGen completely revolutionized how our design system is implemented. Highly recommended!", avatarUrl: "", rating: 5.0),
            TestimonialItem(name: "Alex Rivera", role: "CTO, Vercel", content: "The dynamic templates save us dozens of development hours. A portfolio-worthy tool.", avatarUrl: "", rating: 5.0),
          ],
        ),
        offer: const OfferSection(
          enabled: true,
          title: "Start building your future today",
          description: "Get full access to all features, custom templates, integrations, and premium hosting support.",
          price: "\$49 / month",
          discountPrice: "\$29 / month",
          ctaText: "Claim Pro Membership",
          features: ["Unlimited projects", "Custom layouts", "Priority support"],
        ),
        faq: const FAQSection(
          enabled: true,
          title: "Frequently Asked Questions",
          items: [
            FAQItem(question: "Is there a free trial?", answer: "Yes, you can try any plan free for 14 days without entering credit card details."),
            FAQItem(question: "Can I cancel my subscription anytime?", answer: "Absolutely. You can cancel, upgrade, or downgrade from your settings page anytime."),
            FAQItem(question: "How secure is my project data?", answer: "We take security seriously. All project workspace data is encrypted end-to-end both in transit and at rest."),
          ],
        ),
      );
    } else if (category == 'Ebook') {
      return current.copyWith(
        hero: const HeroSection(
          enabled: true,
          headline: "The Ultimate Guide to Product Design",
          subheadline: "Learn the principles of typography, layout, visual design, and Figma workflow in this comprehensive 250-page ebook.",
          ctaText: "Download Free Chapter",
          ctaTarget: "",
          imageUrl: "",
          showGradients: true,
        ),
        benefits: const BenefitsSection(
          enabled: true,
          title: "What You Will Master",
          subtitle: "A proven step-by-step framework to elevate your UI/UX skills.",
          items: [
            BenefitItem(title: "Visual Hierarchy", description: "Master layout theory, whitespace control, and typography pairs.", iconName: "format_size"),
            BenefitItem(title: "Design System Logic", description: "Build scalable tokens, variables, and components inside Figma.", iconName: "layers"),
            BenefitItem(title: "Portfolio Development", description: "Learn how to present your case studies to secure high-paying roles.", iconName: "assignment"),
          ],
        ),
        productBridge: const ProductBridge(
          enabled: true,
          title: "Peek Inside the Ebook Chapters",
          description: "Get high-quality PDF/EPUB copies. Read on Kindle, iPad, or any laptop. Includes interactive worksheets and templates.",
          ctaText: "Download Table of Contents",
          imageUrl: "",
        ),
        bonuses: const BonusSection(
          enabled: true,
          title: "Premium Bundle Add-ons",
          items: [
            BonusItem(title: "Figma UI Kit Bundle", description: "100+ components, cards, forms, and layouts.", value: "FREE", imageUrl: ""),
            BonusItem(title: "Exclusive Discord Access", description: "Private community of 3,000+ designers.", value: "\$49 value", imageUrl: ""),
            BonusItem(title: "Resume & Portfolio Checklist", description: "Audit checklist used by Google designers.", value: "\$19 value", imageUrl: ""),
          ],
        ),
        testimonials: const TestimonialsSection(
          enabled: true,
          title: "What Other Readers Say",
          items: [
            TestimonialItem(name: "Jessica Chen", role: "Junior Designer, Shopify", content: "This book changed everything. I got a designer job 3 weeks after completing the portfolio checklist!", avatarUrl: "", rating: 5.0),
            TestimonialItem(name: "David Kim", role: "Self-taught Developer", content: "The best design book for coders. It explains visual layout in logical terms that make sense.", avatarUrl: "", rating: 5.0),
          ],
        ),
        offer: const OfferSection(
          enabled: true,
          title: "Get the Complete Design Bundle",
          description: "Instant lifetime access to the 250-page ebook, Figma design assets, code templates, and checklist audits.",
          price: "\$39.00",
          discountPrice: "\$19.00",
          ctaText: "Download the Bundle Now",
          features: ["Full PDF/EPUB ebook", "Figma Design system assets", "Resume & Portfolio audits"],
        ),
        faq: const FAQSection(
          enabled: true,
          title: "Ebook Questions & Answers",
          items: [
            FAQItem(question: "What ebook formats are supported?", answer: "You will receive high-res PDF, EPUB, and MOBI files readable on all platforms."),
            FAQItem(question: "Is there a refund policy?", answer: "Yes, we offer a 100% money-back guarantee within 30 days if you do not find the guide helpful."),
            FAQItem(question: "Do I need Figma experience?", answer: "No, the book starts from basic visual design rules and guides you step-by-step."),
          ],
        ),
      );
    } else if (category == 'Course') {
      return current.copyWith(
        hero: const HeroSection(
          enabled: true,
          headline: "Master Full-Stack App Development",
          subheadline: "Learn Flutter, Riverpod, clean architecture, and serverless backend services by building 5 production apps.",
          ctaText: "Enroll in Bootcamp",
          ctaTarget: "",
          imageUrl: "",
          showGradients: true,
        ),
        benefits: const BenefitsSection(
          enabled: true,
          title: "How This Course Is Different",
          subtitle: "No generic hello-world guides. Real-world architectural systems.",
          items: [
            BenefitItem(title: "60+ hours of video lessons", description: "Self-paced HD screencasts with detailed code explanations.", iconName: "play_circle"),
            BenefitItem(title: "Hands-on projects", description: "Build real chat apps, SaaS dashboards, and offline synchronizers.", iconName: "code"),
            BenefitItem(title: "1-on-1 Code Reviews", description: "Get personalized feedback on every pull request from instructors.", iconName: "rate_review"),
          ],
        ),
        productBridge: const ProductBridge(
          enabled: true,
          title: "Meet Your Lead Instructor",
          description: "Joy is a former Google senior engineer with over 10 years of experience building cross-platform products for millions of daily active users.",
          ctaText: "View Instructor Profile",
          imageUrl: "",
        ),
        bonuses: const BonusSection(
          enabled: true,
          title: "Bootcamp Enrollee Perks",
          items: [
            BonusItem(title: "Landing Page UI Code template", description: "Source code of this generator system.", value: "FREE", imageUrl: ""),
            BonusItem(title: "Private Discord Group Chat", description: "Get unblocked in minutes by teaching assistants.", value: "\$199", imageUrl: ""),
          ],
        ),
        testimonials: const TestimonialsSection(
          enabled: true,
          title: "Student Success Stories",
          items: [
            TestimonialItem(name: "Brian Patel", role: "Flutter Developer, Grab", content: "Joy's clean architecture modules are outstanding. They helped me ace my technical interview.", avatarUrl: "", rating: 5.0),
            TestimonialItem(name: "Elena Rostova", role: "Independent Freelancer", content: "I was able to raise my hourly freelancing rate by 40% after refactoring my clients' state management using Riverpod.", avatarUrl: "", rating: 5.0),
          ],
        ),
        offer: const OfferSection(
          enabled: true,
          title: "Enroll in AuraGen Bootcamp",
          description: "Lifetime access to lectures, private code repositories, future updates, and slack channels.",
          price: "\$199.00",
          discountPrice: "\$99.00",
          ctaText: "Get Lifetime Access",
          features: ["60+ hours video lectures", "5 Production-ready apps", "Personal PR reviews"],
        ),
        faq: const FAQSection(
          enabled: true,
          title: "Course FAQs",
          items: [
            FAQItem(question: "How long do I keep access?", answer: "You keep lifetime access to all current and future videos, code repos, and community chats."),
            FAQItem(question: "Is there a certificate of completion?", answer: "Yes, after completing all 5 apps and passing code reviews, you get a verifiable certificate."),
          ],
        ),
      );
    } else if (category == 'Agency' || category == 'Portfolio') {
      return current.copyWith(
        hero: const HeroSection(
          enabled: true,
          headline: "We Design and Build High-Converting Interfaces",
          subheadline: "A boutique product design and development studio helping seed-stage SaaS startups launch modern web applications in weeks.",
          ctaText: "Book Discovery Call",
          ctaTarget: "",
          imageUrl: "",
          showGradients: true,
        ),
        benefits: const BenefitsSection(
          enabled: true,
          title: "Our Core Expertise",
          subtitle: "We take care of visual design, copywriting, interactions, and production code.",
          items: [
            BenefitItem(title: "Visual System Design", description: "Framer/Figma designs that reflect premium brand identities.", iconName: "palette"),
            BenefitItem(title: "Conversion Optimization", description: "Persuasive layouts tailored to maximize user signups.", iconName: "track_changes"),
            BenefitItem(title: "Flutter Web Deployment", description: "Highly responsive, clean, and tree-shaken production builds.", iconName: "web"),
          ],
        ),
        productBridge: const ProductBridge(
          enabled: true,
          title: "Check Our Recent Case Studies",
          description: "We built the workspace platform for Linear and the interactive catalog web apps for Spline. Click below to inspect our code and case details.",
          ctaText: "View Case Studies",
          imageUrl: "",
        ),
        bonuses: const BonusSection(
          enabled: true,
          title: "Premium Client Hand-offs",
          items: [
            BonusItem(title: "Figma Source files", description: "Full design workspace access.", value: "FREE", imageUrl: ""),
            BonusItem(title: "3 Months post-launch support", description: "Bugfixes & minor edits included.", value: "\$1,500", imageUrl: ""),
          ],
        ),
        testimonials: const TestimonialsSection(
          enabled: true,
          title: "Partner Reviews",
          items: [
            TestimonialItem(name: "Marcus Aurelius", role: "CEO, Stoic Tech", content: "The absolute best agency experience. They delivered our Framer SaaS site 4 days ahead of schedule.", avatarUrl: "", rating: 5.0),
          ],
        ),
        offer: const OfferSection(
          enabled: true,
          title: "Partner with AuraGen Studio",
          description: "We have limited slots open for this quarter. Let's discuss your product goals over a free 30-minute call.",
          price: "\$1,499",
          discountPrice: "\$999",
          ctaText: "Book Your Slot Now",
          features: ["Visual UI/UX Designs", "Persuasive copy writing", "Fully coded site"],
        ),
        faq: const FAQSection(
          enabled: true,
          title: "Agency Engagement FAQs",
          items: [
            FAQItem(question: "What is your typical turnaround time?", answer: "Most landing page and visual system engagements are completed within 14 to 21 days."),
            FAQItem(question: "Do you design or code?", answer: "Both. We design in Figma and deliver clean production-ready code in Flutter/React or Framer sites."),
          ],
        ),
      );
    } else {
      return current.copyWith(
        hero: const HeroSection(
          enabled: true,
          headline: "Artisanal Coffee & Fresh Butter Pastries",
          subheadline: "Start your morning with single-origin beans roasted fresh daily in our local roasting house, paired with hot flaky croissants.",
          ctaText: "Order Delivery online",
          ctaTarget: "",
          imageUrl: "",
          showGradients: true,
        ),
        benefits: const BenefitsSection(
          enabled: true,
          title: "Handcrafted With Passion",
          subtitle: "Premium organic ingredients sourced directly from small sustainable farms.",
          items: [
            BenefitItem(title: "100% Organic Arabica", description: "Direct-trade coffee beans sourced ethically from Ethiopia & Sumatra.", iconName: "local_cafe"),
            BenefitItem(title: "Fresh Baked Daily", description: "Pastries baked from scratch by French pastry chefs every single morning.", iconName: "bakery_dining"),
            BenefitItem(title: "Cozy Workspace Lounge", description: "High-speed Wi-Fi, comfortable seats, and quiet environments.", iconName: "wifi"),
          ],
        ),
        productBridge: const ProductBridge(
          enabled: true,
          title: "Our Signature Drink Menu Highlights",
          description: "Try our signature Sea Salt Caramel Cold Brew, Roasted Hazelnut Latte, or Cinnamon Honey Matcha Latte today.",
          ctaText: "View Full Menu",
          imageUrl: "",
        ),
        bonuses: const BonusSection(
          enabled: true,
          title: "Loyalty Member Rewards",
          items: [
            BonusItem(title: "Free welcome espresso", description: "Join our rewards card program.", value: "FREE", imageUrl: ""),
            BonusItem(title: "10th Drink Free stamp", description: "Accumulate stamps automatically.", value: "LOYALTY", imageUrl: ""),
          ],
        ),
        testimonials: const TestimonialsSection(
          enabled: true,
          title: "Guest Experiences",
          items: [
            TestimonialItem(name: "Clara Higgins", role: "Local Resident", content: "The sea salt cold brew here is life-changing. My absolute favorite coffee shop in the neighborhood!", avatarUrl: "", rating: 5.0),
          ],
        ),
        offer: const OfferSection(
          enabled: true,
          title: "Get Our Morning Bundle Special",
          description: "Get 1 Large signature latte and 1 freshly baked butter croissant for a special discount price.",
          price: "\$12.00",
          discountPrice: "\$7.00",
          ctaText: "Order Bundle online",
          features: ["Signature Large Latte", "Fresh Butter Croissant", "Free workspace access"],
        ),
        faq: const FAQSection(
          enabled: true,
          title: "Menu & Venue FAQs",
          items: [
            FAQItem(question: "Do you offer gluten-free or vegan options?", answer: "Yes! We have oat/almond milk options and select gluten-free pastries available daily."),
            FAQItem(question: "Is there workspace parking?", answer: "Yes, free guest parking is available behind the cafe lounge."),
          ],
        ),
      );
    }
  }
}
