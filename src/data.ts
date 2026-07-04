import { LandingPageData } from "./types";

export const FONT_PRESETS = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans, sans-serif" },
  { name: "Space Grotesk", value: "Space Grotesk, sans-serif" },
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "JetBrains Mono", value: "JetBrains Mono, monospace" }
];

export const TEMPLATE_PRESETS = [
  {
    id: "modern",
    name: "Modern Clean (Indigo & Cyan)",
    brand: {
      brandName: "SaaS Blueprint",
      logoUrl: "",
      primaryColor: "#4f46e5",
      secondaryColor: "#06b6d4",
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      fontHeading: "Plus Jakarta Sans",
      fontBody: "Inter"
    }
  },
  {
    id: "dark",
    name: "Midnight Cyber (Violet & Neon)",
    brand: {
      brandName: "SaaS Blueprint",
      logoUrl: "",
      primaryColor: "#a855f7",
      secondaryColor: "#10b981",
      backgroundColor: "#0f172a",
      textColor: "#f1f5f9",
      fontHeading: "Space Grotesk",
      fontBody: "Inter"
    }
  },
  {
    id: "warm",
    name: "Warm Editorial (Amber & Orange)",
    brand: {
      brandName: "SaaS Blueprint",
      logoUrl: "",
      primaryColor: "#d97706",
      secondaryColor: "#ea580c",
      backgroundColor: "#fffdfa",
      textColor: "#292524",
      fontHeading: "Playfair Display",
      fontBody: "Inter"
    }
  },
  {
    id: "soft",
    name: "Soft Pastel (Rose & Pink)",
    brand: {
      brandName: "SaaS Blueprint",
      logoUrl: "",
      primaryColor: "#e11d48",
      secondaryColor: "#db2777",
      backgroundColor: "#fff1f2",
      textColor: "#4c0519",
      fontHeading: "Plus Jakarta Sans",
      fontBody: "Inter"
    }
  },
  {
    id: "picktime",
    name: "Picktime Premium (Sleek SaaS - Violet & Indigo)",
    brand: {
      brandName: "Picktime SAAS",
      logoUrl: "",
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      backgroundColor: "#f8fafc",
      textColor: "#0f172a",
      fontHeading: "Plus Jakarta Sans",
      fontBody: "Inter"
    }
  }
];

export const DEFAULT_PROJECT_DATA: LandingPageData = {
  project: {
    id: "default-project",
    name: "Ebook SaaS Blueprint",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    template: "modern"
  },
  brand: {
    brandName: "SaaS Blueprint",
    logoUrl: "",
    primaryColor: "#4f46e5",
    secondaryColor: "#06b6d4",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    fontHeading: "Plus Jakarta Sans",
    fontBody: "Inter"
  },
  basicInfo: {
    productName: "SaaS Launch Blueprint",
    productType: "Ebook & Video Course",
    targetAudience: "Developer, Freelancer, & Creator Independen",
    checkoutUrl: "https://checkout.yourproduct.com/buy",
    whatsappUrl: "https://wa.me/628123456789",
    shopeeUrl: "https://shopee.co.id",
    checkoutType: "direct"
  },
  hero: {
    enabled: true,
    badgeText: "🔥 RILIS TERBARU - DISKON 50%",
    headline: "Bangun Bisnis Micro-SaaS Pertamamu Tanpa Bingung Mulai Dari Mana",
    subheadline: "Panduan lengkap langkah-demi-langkah dari ideasi, pembuatan produk, hingga mendapatkan 100 pelanggan berbayar pertama dalam waktu 30 hari.",
    mockupImage: "",
    agitateTitle: "Mengapa 95% Developer Gagal Meluncurkan Produk?",
    agitateDescription: "Mereka terlalu fokus menulis kode, mengabaikan validasi pasar, dan tidak tahu cara melakukan pemasaran. Jangan biarkan kerja kerasmu berakhir sia-sia.",
    ctaText: "Dapatkan Akses Sekarang",
    ctaUrl: "#offers"
  },
  benefits: {
    enabled: true,
    headline: "Apa Saja yang Akan Anda Pelajari?",
    introText: "Kurikulum praktis yang disusun khusus untuk membantu Anda melompati semua trial-and-error selama bertahun-tahun.",
    items: [
      {
        id: "b1",
        title: "Metodologi Validasi Kilat",
        description: "Cara memvalidasi ide produk Anda dalam 48 jam sebelum menulis satu baris kode pun.",
        icon: "CheckCircle"
      },
      {
        id: "b2",
        title: "Arsitektur Boilerplate Siap Pakai",
        description: "Gunakan template kode kami untuk setup sistem pembayaran, autentikasi, dan database dalam 5 menit.",
        icon: "Layers"
      },
      {
        id: "b3",
        title: "Formula Marketing Tanpa Budget",
        description: "Dapatkan traffic organik dari platform seperti HackerNews, Reddit, dan X secara gratis.",
        icon: "TrendingUp"
      }
    ]
  },
  productBridge: {
    enabled: true,
    headline: "Memperkenalkan SaaS Launch Blueprint",
    mockupImage: "",
    featureText: "Paket Belajar Komparatif Terlengkap",
    benefitText: "Membantu Anda bertransformasi dari seorang coder menjadi seorang Solo Founder yang mandiri secara finansial.",
    meaningText: "Artinya, Anda tidak perlu lagi bergantung pada klien freelance yang rewel atau pekerjaan korporat 9-to-5.",
    ctaText: "Lihat Paket Pembelian",
    ctaUrl: "#offers"
  },
  bonuses: {
    enabled: true,
    headline: "Bonus Eksklusif Jika Anda Membeli Hari Ini",
    items: [
      {
        id: "bn1",
        image: "",
        title: "SaaS Boilerplate Template (React & Node.js)",
        originalPrice: "Rp 499.000",
        description: "Kode sumber siap pakai untuk mempercepat pembuatan SaaS Anda."
      },
      {
        id: "bn2",
        image: "",
        title: "Komunitas Discord Eksklusif",
        originalPrice: "Rp 299.000",
        description: "Gabung dengan ratusan solo founder lainnya untuk bertukar pikiran dan kolaborasi."
      }
    ]
  },
  testimonials: {
    enabled: true,
    headline: "Kisah Sukses Mereka yang Sudah Memulai",
    supportingText: "Berikut testimoni jujur dari pembaca kami yang berhasil merilis SaaS mereka.",
    items: [
      {
        id: "t1",
        name: "Andi Wijaya",
        role: "Fullstack Developer",
        avatar: "",
        comment: "Buku ini merubah cara pandang saya. Minggu lalu saya meluncurkan SaaS mini pertama saya dan hari ini sudah mendapat 3 pelanggan berbayar pertama!",
        rating: 5
      },
      {
        id: "t2",
        name: "Siti Rahma",
        role: "UI/UX Designer",
        avatar: "",
        comment: "Sangat direkomendasikan bagi yang ingin lepas dari jerat freelance. Langkah-langkahnya sangat praktikal dan tidak bertele-tele.",
        rating: 5
      }
    ]
  },
  offers: {
    enabled: true,
    headline: "Investasi Terbaik untuk Masa Depan Anda",
    subheadline: "Pilih paket yang paling sesuai dengan kebutuhan belajar Anda sekarang.",
    items: [
      {
        id: "o1",
        name: "Ebook Only",
        price: "Rp 149.000",
        originalPrice: "Rp 299.000",
        description: "Buku digital SaaS Blueprint setebal 180 halaman format PDF & EPUB.",
        features: [
          "Buku Digital (PDF/EPUB)",
          "Akses Update Selamanya",
          "Semua Template Spreadsheet Checklist"
        ],
        ctaText: "Beli Paket Ebook",
        ctaUrl: "https://checkout.yourproduct.com/ebook",
        popular: false
      },
      {
        id: "o2",
        name: "Founder Bundle",
        price: "Rp 299.000",
        originalPrice: "Rp 599.000",
        description: "Paket lengkap ebook ditambah video walkthrough 10 jam dan source code boilerplate.",
        features: [
          "Semua Benefit Ebook Only",
          "Video Walkthrough (10 Jam)",
          "Boilerplate React & Node.js",
          "Grup Discord Premium",
          "Prioritas Email Support"
        ],
        ctaText: "Beli Paket Founder",
        ctaUrl: "https://checkout.yourproduct.com/founder",
        popular: true
      }
    ]
  },
  objections: {
    enabled: true,
    headline: "Pertanyaan yang Sering Diajukan (FAQ)",
    items: [
      {
        id: "q1",
        question: "Apakah materi ini ramah pemula?",
        answer: "Ya, betul. Kami menjelaskan konsep dari dasar. Namun, memiliki pemahaman dasar tentang pemrograman web akan sangat membantu Anda mengikuti bagian teknis."
      },
      {
        id: "q2",
        question: "Apakah ada jaminan uang kembali?",
        answer: "Tentu saja. Jika Anda merasa materi kami tidak memberikan manfaat, hubungi kami dalam waktu 14 hari setelah pembelian untuk refund 100% tanpa ribet."
      },
      {
        id: "q3",
        question: "Bagaimana cara mengakses bonusnya?",
        answer: "Semua bonus, tautan repositori boilerplate, dan undangan Discord eksklusif akan dikirimkan otomatis ke email Anda sesaat setelah pembayaran berhasil dikonfirmasi."
      }
    ]
  },
  footer: {
    enabled: true,
    copyrightText: "© 2026 SaaS Blueprint. Hak Cipta Dilindungi Undang-Undang.",
    links: [
      { id: "fl1", label: "Syarat & Ketentuan", url: "#" },
      { id: "fl2", label: "Kebijakan Privasi", url: "#" },
      { id: "fl3", label: "Kontak Support", url: "#" }
    ]
  },
  sectionOrder: ["hero", "benefits", "productBridge", "bonuses", "testimonials", "offers", "objections"]
};
