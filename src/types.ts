export interface LandingPageData {
  project: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    template: "modern" | "dark" | "warm" | "cyber" | "soft" | "picktime";
  };

  brand: {
    brandName: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontHeading: string;
    fontBody: string;
  };

  basicInfo: {
    productName: string;
    productType: string;
    targetAudience: string;
    checkoutUrl: string;
    whatsappUrl: string;
    shopeeUrl?: string;
    checkoutType?: "direct" | "whatsapp" | "shopee";
  };

  hero: {
    enabled: boolean;
    badgeText: string;
    headline: string;
    subheadline: string;
    mockupImage: string;
    agitateTitle: string;
    agitateDescription: string;
    ctaText: string;
    ctaUrl: string;
  };

  benefits: {
    enabled: boolean;
    headline: string;
    introText: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };

  productBridge: {
    enabled: boolean;
    headline: string;
    mockupImage: string;
    featureText: string;
    benefitText: string;
    meaningText: string;
    ctaText: string;
    ctaUrl: string;
  };

  bonuses: {
    enabled: boolean;
    headline: string;
    items: Array<{
      id: string;
      image: string;
      title: string;
      originalPrice: string;
      description: string;
    }>;
  };

  testimonials: {
    enabled: boolean;
    headline: string;
    supportingText: string;
    items: Array<{
      id: string;
      name: string;
      role: string;
      avatar: string;
      comment: string;
      rating: number;
    }>;
  };

  offers: {
    enabled: boolean;
    headline: string;
    subheadline: string;
    items: Array<{
      id: string;
      name: string;
      price: string;
      originalPrice: string;
      description: string;
      features: string[];
      ctaText: string;
      ctaUrl: string;
      popular: boolean;
      checkoutType?: "global" | "direct" | "whatsapp" | "shopee";
      customUrl?: string;
    }>;
  };

  objections: {
    enabled: boolean;
    headline: string;
    items: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };

  footer: {
    enabled: boolean;
    copyrightText: string;
    links: Array<{
      id: string;
      label: string;
      url: string;
    }>;
  };

  sectionOrder: string[]; // e.g. ["hero", "benefits", "productBridge", "bonuses", "testimonials", "offers", "objections"]
}
