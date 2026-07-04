import { LandingPageData } from "../types";

export function getCheckoutRedirectUrl(
  data: LandingPageData,
  offerCtaUrl?: string,
  offerName?: string,
  offerPrice?: string,
  offerCheckoutType?: "global" | "direct" | "whatsapp" | "shopee",
  offerCustomUrl?: string
): string {
  const type = (offerCheckoutType && offerCheckoutType !== "global") 
    ? offerCheckoutType 
    : (data.basicInfo.checkoutType || "direct");
  
  if (type === "whatsapp") {
    let baseUrl = (offerCheckoutType === "whatsapp" && offerCustomUrl) ? offerCustomUrl : (data.basicInfo.whatsappUrl || "");
    if (baseUrl && !baseUrl.startsWith("http")) {
      let cleanNum = baseUrl.replace(/\D/g, "");
      if (cleanNum.startsWith("0")) {
        cleanNum = "62" + cleanNum.slice(1);
      }
      baseUrl = `https://wa.me/${cleanNum}`;
    }
    
    if (!baseUrl) return "#";
    
    let message = `Halo, saya tertarik untuk membeli produk *${data.basicInfo.productName}*`;
    if (offerName) {
      message += ` - Paket *${offerName}*`;
    }
    if (offerPrice) {
      message += ` seharga *${offerPrice}*`;
    }
    message += `. Bagaimana langkah pembayaran selanjutnya? Terima kasih.`;
    
    const connector = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${connector}text=${encodeURIComponent(message)}`;
  }
  
  if (type === "shopee") {
    const shopeeLink = (offerCheckoutType === "shopee" && offerCustomUrl) ? offerCustomUrl : (data.basicInfo.shopeeUrl || "https://shopee.co.id");
    return shopeeLink;
  }
  
  // direct
  if (offerCheckoutType === "direct" && offerCustomUrl) {
    return offerCustomUrl;
  }
  if (offerCtaUrl && offerCtaUrl !== "#" && offerCtaUrl.trim() !== "") {
    return offerCtaUrl;
  }
  return data.basicInfo.checkoutUrl || "#";
}

export function generateHTML(data: LandingPageData): string {
  const { brand, basicInfo, hero, benefits, productBridge, bonuses, testimonials, offers, objections, footer, sectionOrder } = data;

  const fontHeaderImport = brand.fontHeading ? `@import url('https://fonts.googleapis.com/css2?family=${brand.fontHeading.replace(/ /g, "+")}:wght@400;500;600;700;800;900&display=swap');` : '';
  const fontBodyImport = brand.fontBody ? `@import url('https://fonts.googleapis.com/css2?family=${brand.fontBody.replace(/ /g, "+")}:wght@400;500;600;700&display=swap');` : '';

  // Icon mapping helper to SVG
  const getIconSVG = (name: string) => {
    switch (name) {
      case "CheckCircle":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      case "Layers":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>`;
      case "TrendingUp":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`;
      case "Sparkles":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`;
      case "Zap":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`;
      case "Award":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 2a4 4 0 118 0M3 9a2 2 0 100-4 2 2 0 000 4zm18 0a2 2 0 100-4 2 2 0 000 4z"></path></svg>`;
      case "BookOpen":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`;
      case "Target":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;
      case "Shield":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`;
      case "Coffee":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>`;
      case "Users":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
      case "Globe":
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>`;
      default:
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }
  };

  // Render HTML segments in correct section order
  let bodyContent = "";

  // Render Top Bar/Nav Header
  bodyContent += `
  <nav class="sticky top-0 z-50 backdrop-blur-md border-b" style="background-color: ${brand.backgroundColor}e6; border-color: ${brand.primaryColor}20;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        ${brand.logoUrl ? `<img src="${brand.logoUrl}" class="h-8 max-w-[120px] object-contain" />` : `
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black" style="background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor});">
          ${brand.brandName ? brand.brandName[0].toUpperCase() : 'L'}
        </div>
        `}
        <span class="font-extrabold text-lg tracking-tight" style="color: ${brand.textColor}; font-family: ${brand.fontHeading};">${brand.brandName || "LandingPage"}</span>
      </div>
      <div class="flex items-center gap-4">
        ${basicInfo.whatsappUrl ? `
        <a href="${basicInfo.whatsappUrl}" target="_blank" rel="noopener" class="text-xs sm:text-sm font-semibold hover:opacity-80 transition-opacity hidden sm:block" style="color: ${brand.textColor};">Tanya Kami</a>
        ` : ""}
        <a href="#offers" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-transform active:scale-95" style="background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor});">
          Beli Sekarang
        </a>
      </div>
    </div>
  </nav>
  `;

  sectionOrder.forEach((sectionId) => {
    if (sectionId === "hero" && hero.enabled) {
      if (data.project.template === "picktime") {
        bodyContent += `
        <header class="relative py-16 sm:py-20 overflow-hidden border-b bg-gradient-to-b from-slate-50 to-white" style="border-color: #e2e8f0;">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
              <div class="lg:col-span-6 space-y-6">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 font-mono">
                  ✨ ${hero.badgeText || "SMART SCHEDULING"}
                </span>
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900" style="font-family: ${brand.fontHeading};">
                  ${hero.headline}
                </h1>
                <p class="text-sm sm:text-base opacity-80 leading-relaxed max-w-xl text-slate-600">
                  ${hero.subheadline}
                </p>
                
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href="#offers" class="px-6 py-3.5 rounded-xl text-center text-white font-extrabold text-sm shadow-lg shadow-indigo-500/10 hover:brightness-110 active:scale-[0.98] transition-all" style="background: ${brand.primaryColor};">
                    ${hero.ctaText || "Dapatkan Akses Sekarang"}
                  </a>
                  ${basicInfo.whatsappUrl ? `
                  <a href="${basicInfo.whatsappUrl}" target="_blank" rel="noopener" class="px-6 py-3.5 rounded-xl text-center font-bold text-sm border hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-slate-700 border-slate-200">
                    <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.975 14.067.953 11.453.951c-5.438 0-9.864 4.372-9.868 9.8c-.001 1.714.452 3.39 1.311 4.877L1.87 20.36l4.777-1.206z"/></svg>
                    Tanya Lewat WhatsApp
                  </a>
                  ` : ""}
                </div>

                ${hero.agitateTitle || hero.agitateDescription ? `
                <div class="p-5 rounded-2xl border bg-indigo-50/20 border-indigo-100/60 max-w-xl">
                  <h3 class="text-xs font-black tracking-wider uppercase text-indigo-800 flex items-center gap-2 mb-1.5 font-mono">
                    ⚠️ ${hero.agitateTitle}
                  </h3>
                  <p class="text-xs text-slate-500 leading-relaxed">
                    ${hero.agitateDescription}
                  </p>
                </div>
                ` : ""}
              </div>

              <!-- Interactive Calendar Widget Column -->
              <div class="lg:col-span-6 flex justify-center w-full">
                <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 text-left relative overflow-hidden">
                  <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h4 class="font-extrabold text-sm text-slate-900">Jadwalkan Demo Gratis</h4>
                      <p class="text-[10px] text-slate-400 font-medium mt-0.5">Pilih tanggal & waktu yang tepat untuk Anda</p>
                    </div>
                    <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">● Online</span>
                  </div>

                  <!-- Date Slots -->
                  <div>
                    <span class="text-[10px] font-black tracking-wider uppercase text-slate-400 font-mono">PILIH TANGGAL</span>
                    <div class="grid grid-cols-4 gap-2 mt-2">
                      <button onclick="selectDate(0)" id="date-btn-0" class="p-2.5 rounded-2xl border text-center transition-all bg-indigo-600 border-indigo-600 text-white cursor-pointer">
                        <span class="block text-[9px] font-bold tracking-widest uppercase opacity-75 font-mono">SEN</span>
                        <span class="block text-sm font-black mt-0.5">14</span>
                      </button>
                      <button onclick="selectDate(1)" id="date-btn-1" class="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-800 text-center transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer">
                        <span class="block text-[9px] font-bold tracking-widest uppercase opacity-75 text-slate-400 font-mono">SEL</span>
                        <span class="block text-sm font-black mt-0.5">15</span>
                      </button>
                      <button onclick="selectDate(2)" id="date-btn-2" class="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-800 text-center transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer">
                        <span class="block text-[9px] font-bold tracking-widest uppercase opacity-75 text-slate-400 font-mono">RAB</span>
                        <span class="block text-sm font-black mt-0.5">16</span>
                      </button>
                      <button onclick="selectDate(3)" id="date-btn-3" class="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-800 text-center transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer">
                        <span class="block text-[9px] font-bold tracking-widest uppercase opacity-75 text-slate-400 font-mono">KAM</span>
                        <span class="block text-sm font-black mt-0.5">17</span>
                      </button>
                    </div>
                  </div>

                  <!-- Time Slots -->
                  <div>
                    <span class="text-[10px] font-black tracking-wider uppercase text-slate-400 font-mono">PILIH SLOT WAKTU</span>
                    <div class="grid grid-cols-3 gap-2 mt-2">
                      <button onclick="selectTime('09:00')" id="time-btn-09-00" class="py-2 rounded-xl text-[11px] font-black text-center transition-all border border-indigo-600 bg-indigo-50 text-indigo-700 cursor-pointer">09:00 WIB</button>
                      <button onclick="selectTime('11:00')" id="time-btn-11-00" class="py-2 rounded-xl text-[11px] font-black text-center transition-all border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">11:00 WIB</button>
                      <button onclick="selectTime('14:00')" id="time-btn-14-00" class="py-2 rounded-xl text-[11px] font-black text-center transition-all border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">14:00 WIB</button>
                    </div>
                  </div>

                  <!-- Form and CTA -->
                  <div class="pt-2 flex flex-col gap-2">
                    <input type="text" id="booking-name" placeholder="Nama Lengkap Anda" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
                    <button onclick="confirmBooking()" class="w-full bg-slate-900 text-white font-black py-3 rounded-xl text-xs hover:bg-slate-800 transition-all cursor-pointer">Jadwalkan Pertemuan Sekarang</button>
                  </div>

                  <!-- Success Overlay -->
                  <div id="booking-success-overlay" class="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 translate-y-full opacity-0 pointer-events-none">
                    <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 mb-3 animate-bounce">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h5 class="text-sm font-black text-slate-950">Pertemuan Berhasil Dijadwalkan!</h5>
                    <p class="text-[10px] text-slate-500 max-w-xs mt-1">Konfirmasi dan link video-call telah dikirimkan ke email Anda. Sampai jumpa!</p>
                    <button onclick="resetBooking()" class="mt-4 px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-200 cursor-pointer">Jadwalkan Ulang</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        `;
      } else {
        bodyContent += `
        <header class="relative py-16 sm:py-24 overflow-hidden border-b" style="border-color: ${brand.primaryColor}10;">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div class="lg:col-span-7 space-y-6">
                ${hero.badgeText ? `
                <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider text-white" style="background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor});">
                  ${hero.badgeText}
                </span>
                ` : ""}
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none" style="color: ${brand.textColor}; font-family: ${brand.fontHeading};">
                  ${hero.headline}
                </h1>
                <p class="text-base sm:text-lg opacity-80 leading-relaxed max-w-2xl" style="color: ${brand.textColor};">
                  ${hero.subheadline}
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 pt-2">
                  <a href="${hero.ctaUrl && hero.ctaUrl.startsWith('#') ? hero.ctaUrl : getCheckoutRedirectUrl(data, hero.ctaUrl)}" class="px-8 py-4 rounded-xl text-center text-white font-extrabold text-base shadow-xl hover:opacity-90 active:scale-[0.98] transition-all" style="background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor});">
                    ${hero.ctaText || "Dapatkan Akses Sekarang"}
                  </a>
                  ${basicInfo.whatsappUrl ? `
                  <a href="${basicInfo.whatsappUrl}" target="_blank" rel="noopener" class="px-8 py-4 rounded-xl text-center font-bold text-base border hover:bg-black/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2" style="color: ${brand.textColor}; border-color: ${brand.primaryColor}40;">
                    <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.975 14.067.953 11.453.951c-5.438 0-9.864 4.372-9.868 9.8c-.001 1.714.452 3.39 1.311 4.877L1.87 20.36l4.777-1.206z"/></svg>
                    Tanya Lewat WhatsApp
                  </a>
                  ` : ""}
                </div>

                <!-- Problem Setup / Agitate Section -->
                ${hero.agitateTitle || hero.agitateDescription ? `
                <div class="mt-8 p-6 rounded-2xl border" style="background-color: ${brand.primaryColor}05; border-color: ${brand.primaryColor}15;">
                  <h3 class="text-lg font-bold flex items-center gap-2 mb-2" style="color: ${brand.primaryColor};">
                    <svg class="w-5 h-5 shrink-0 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    ${hero.agitateTitle}
                  </h3>
                  <p class="text-sm opacity-80 leading-relaxed" style="color: ${brand.textColor};">
                    ${hero.agitateDescription}
                  </p>
                </div>
                ` : ""}
              </div>

              <div class="lg:col-span-5 flex justify-center">
                ${hero.mockupImage ? `
                <img src="${hero.mockupImage}" class="w-full max-w-sm rounded-3xl shadow-2xl border border-black/10 transform rotate-2 hover:rotate-0 transition-transform duration-500" />
                ` : `
                <div class="w-full max-w-sm aspect-[4/3] rounded-3xl bg-slate-100 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-300 relative">
                  <svg class="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span class="text-sm font-bold text-slate-700 block mb-1">${basicInfo.productName || "Product Mockup"}</span>
                  <span class="text-xs text-slate-500">Ganti gambar mockup di Editor tab Hero</span>
                </div>
                `}
              </div>
            </div>
          </div>
        </header>
        `;
      }
    }

    if (sectionId === "benefits" && benefits.enabled) {
      if (data.project.template === "picktime") {
        bodyContent += `
        <section class="py-16 sm:py-20 border-b bg-white text-left" style="border-color: #e2e8f0;">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span class="text-[9px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black uppercase tracking-widest font-mono border border-indigo-100">🚀 MANFAAT DAHSYAT</span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900" style="font-family: ${brand.fontHeading};">
                ${benefits.headline}
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
                ${benefits.introText}
              </p>
            </div>

            <!-- Bento-box style grid compilation -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
              ${benefits.items.map((item, idx) => {
                const isWide = idx === 0 || idx === 3;
                const gridSpan = isWide ? 'md:col-span-8' : 'md:col-span-4';
                return `
                <div class="${gridSpan} p-6 rounded-3xl border bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between border-slate-200/80">
                  <div class="space-y-4">
                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-indigo-600 shadow-md shadow-indigo-500/10 shrink-0">
                      ${getIconSVG(item.icon)}
                    </div>
                    <div>
                      <h3 class="text-sm font-black text-slate-950 font-sans">
                        ${item.title}
                      </h3>
                      <p class="text-xs text-slate-500 leading-relaxed mt-1.5 font-medium">
                        ${item.description}
                      </p>
                    </div>
                  </div>
                  <div class="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span class="text-[9px] font-black text-indigo-600 tracking-wider font-mono">FITUR PREMIUM</span>
                    <svg class="w-4 h-4 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>
                `;
              }).join("")}
            </div>
          </div>
        </section>
        `;
      } else {
        bodyContent += `
        <section class="py-16 sm:py-24 border-b" style="border-color: ${brand.primaryColor}10;">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" style="color: ${brand.textColor}; font-family: ${brand.fontHeading};">
                ${benefits.headline}
              </h2>
              <p class="text-base sm:text-lg opacity-75" style="color: ${brand.textColor};">
                ${benefits.introText}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${benefits.items.map((item) => `
              <div class="p-8 rounded-2xl border bg-white/50 backdrop-blur-sm shadow-md flex flex-col justify-between" style="border-color: ${brand.primaryColor}15;">
                <div class="space-y-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor});">
                    ${getIconSVG(item.icon)}
                  </div>
                  <h3 class="text-xl font-bold font-sans" style="color: ${brand.textColor};">
                    ${item.title}
                  </h3>
                  <p class="text-sm opacity-80 leading-relaxed" style="color: ${brand.textColor};">
                    ${item.description}
                  </p>
                </div>
              </div>
              `).join("")}
            </div>
          </div>
        </section>
        `;
      }
    }

    if (sectionId === "productBridge" && productBridge.enabled) {
      if (data.project.template === "picktime") {
        bodyContent += `
        <section class="py-16 sm:py-20 border-b bg-gradient-to-b from-white to-slate-50 text-left" style="border-color: #e2e8f0;">
          <div class="max-w-5xl mx-auto px-4 sm:px-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              
              <!-- Left Column: Custom Sync Integration Mockup -->
              <div class="md:col-span-5 flex justify-center">
                <div class="w-full max-w-[280px] bg-white rounded-3xl p-5 shadow-xl border border-slate-100 space-y-4">
                  <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span class="text-[9px] font-black text-indigo-600 tracking-wider font-mono">STATUS KONEKSI</span>
                    <span class="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Aktif</span>
                  </div>

                  <!-- Integration Icons Flow -->
                  <div class="flex items-center justify-between py-2 relative">
                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-indigo-50 -z-10"></div>
                    <div class="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
                      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg text-white font-black text-xs animate-pulse">⚡</div>
                    <div class="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
                      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span class="text-slate-500 font-bold">Google Calendar</span>
                      <span class="text-emerald-600 font-black">Tersinkron</span>
                    </div>
                    <div class="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span class="text-slate-500 font-bold">Zoom Meetings</span>
                      <span class="text-emerald-600 font-black">Tersinkron</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Step List -->
              <div class="md:col-span-7 space-y-6">
                <h2 class="text-xl sm:text-2xl font-black tracking-tight text-slate-900" style="font-family: ${brand.fontHeading};">
                  ${productBridge.headline}
                </h2>
                
                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <div class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-indigo-50 text-indigo-600 font-black text-xs mt-1">1</div>
                    <div>
                      <span class="font-black text-[9px] text-slate-400 uppercase font-mono tracking-wider block">Langkah Kesatu:</span>
                      <p class="text-xs font-bold text-slate-700 mt-0.5">${productBridge.featureText}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-indigo-50 text-indigo-600 font-black text-xs mt-1">2</div>
                    <div>
                      <span class="font-black text-[9px] text-slate-400 uppercase font-mono tracking-wider block">Langkah Kedua:</span>
                      <p class="text-xs font-bold text-slate-700 mt-0.5">${productBridge.benefitText}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-indigo-100/60 text-indigo-700 font-black text-xs mt-1">3</div>
                    <div>
                      <span class="font-black text-[9px] text-indigo-600 uppercase font-mono tracking-wider block">Artinya Bagi Hidup Anda:</span>
                      <p class="text-sm font-black text-indigo-600 mt-1">${productBridge.meaningText}</p>
                    </div>
                  </div>
                </div>

                <div class="pt-2">
                  <a href="${productBridge.ctaUrl && productBridge.ctaUrl.startsWith('#') ? productBridge.ctaUrl : getCheckoutRedirectUrl(data, productBridge.ctaUrl)}" class="px-5 py-3 rounded-xl text-xs font-black text-white shadow-md shadow-indigo-500/10 hover:brightness-110 active:scale-95 transition-all inline-block" style="background: ${brand.primaryColor};">
                    ${productBridge.ctaText}
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
        `;
      } else {
        bodyContent += `
        <section class="py-16 sm:py-24 border-b relative" style="border-color: ${brand.primaryColor}10;">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div class="lg:col-span-5 flex justify-center">
                ${productBridge.mockupImage ? `
                <img src="${productBridge.mockupImage}" class="w-full max-w-xs rounded-2xl shadow-xl border" />
                ` : `
                <div class="w-full max-w-xs aspect-[4/5] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center">
                  <svg class="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  <span class="text-xs font-bold text-slate-600 block">${basicInfo.productName || "Product Bundle"}</span>
                </div>
                `}
              </div>

              <div class="lg:col-span-7 space-y-6">
                <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" style="color: ${brand.textColor}; font-family: ${brand.fontHeading};">
                  ${productBridge.headline}
                </h2>
                
                <div class="space-y-4">
                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 rounded-full shrink-0 flex items-center justify-center bg-red-100 text-red-500 font-bold text-xs mt-1">1</div>
                    <div>
                      <h4 class="font-bold text-sm text-slate-500 uppercase font-mono">Fitur / Desain:</h4>
                      <p class="text-base font-semibold" style="color: ${brand.textColor};">${productBridge.featureText}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 rounded-full shrink-0 flex items-center justify-center bg-blue-100 text-blue-500 font-bold text-xs mt-1">2</div>
                    <div>
                      <h4 class="font-bold text-sm text-slate-500 uppercase font-mono">Manfaat yang Didapat:</h4>
                      <p class="text-base font-semibold" style="color: ${brand.textColor};">${productBridge.benefitText}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="w-5 h-5 rounded-full shrink-0 flex items-center justify-center bg-emerald-100 text-emerald-500 font-bold text-xs mt-1">3</div>
                    <div>
                      <h4 class="font-bold text-sm text-slate-500 uppercase font-mono">Artinya Bagi Hidup Anda:</h4>
                      <p class="text-lg font-bold" style="color: ${brand.primaryColor};">${productBridge.meaningText}</p>
                    </div>
                  </div>
                </div>

                <div class="pt-4">
                  <a href="${productBridge.ctaUrl && productBridge.ctaUrl.startsWith('#') ? productBridge.ctaUrl : getCheckoutRedirectUrl(data, productBridge.ctaUrl)}" class="px-8 py-3.5 rounded-xl text-center text-white font-extrabold text-base shadow-xl inline-block hover:opacity-90 transition-opacity" style="background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor});">
                    ${productBridge.ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        `;
      }
    }

    if (sectionId === "bonuses" && bonuses.enabled) {
      bodyContent += `
      <section class="py-16 sm:py-24 border-b" style="border-color: ${brand.primaryColor}10; background-color: ${brand.primaryColor}03;">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 animate-bounce">
              🎁 Bonus Spesial Tambahan
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" style="color: ${brand.textColor}; font-family: ${brand.fontHeading};">
              ${bonuses.headline}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            ${bonuses.items.map((bonus) => `
            <div class="p-6 rounded-2xl border bg-white shadow-lg relative overflow-hidden flex flex-col md:flex-row gap-6 items-center" style="border-color: ${brand.primaryColor}15;">
              <div class="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                GRATIS (Senilai ${bonus.originalPrice})
              </div>
              <div class="w-24 h-24 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                ${bonus.image ? `<img src="${bonus.image}" class="w-full h-full object-cover rounded-xl" />` : `
                <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 2a4 4 0 118 0M3 9a2 2 0 100-4 2 2 0 000 4zm18 0a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                `}
              </div>
              <div class="space-y-2 text-center md:text-left">
                <h3 class="font-bold text-lg text-slate-900">${bonus.title}</h3>
                <p class="text-xs text-slate-500 leading-relaxed">${bonus.description}</p>
              </div>
            </div>
            `).join("")}
          </div>
        </div>
      </section>
      `;
    }

    if (sectionId === "testimonials" && testimonials.enabled) {
      bodyContent += `
      <section class="py-16 sm:py-24 border-b bg-white" style="border-color: ${brand.primaryColor}10;">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" style="color: ${brand.textColor}; font-family: ${brand.fontHeading};">
              ${testimonials.headline}
            </h2>
            <p class="text-base sm:text-lg opacity-75" style="color: ${brand.textColor};">
              ${testimonials.supportingText}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            ${testimonials.items.map((item) => `
            <div class="p-8 rounded-2xl border bg-slate-50/50 shadow-md flex flex-col justify-between" style="border-color: ${brand.primaryColor}10;">
              <div class="space-y-4">
                <div class="flex items-center gap-1">
                  ${Array.from({ length: item.rating }).map(() => `
                  <svg class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  `).join("")}
                </div>
                <p class="text-sm italic text-slate-700 leading-relaxed">
                  "${item.comment}"
                </p>
              </div>
              <div class="flex items-center gap-4 pt-6 border-t border-slate-150 mt-6">
                <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                  ${item.avatar ? `<img src="${item.avatar}" class="w-full h-full object-cover rounded-full" />` : item.name[0]}
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900">${item.name}</h4>
                  <p class="text-[11px] text-slate-500">${item.role}</p>
                </div>
              </div>
            </div>
            `).join("")}
          </div>
        </div>
      </section>
      `;
    }

    if (sectionId === "offers" && offers.enabled) {
      bodyContent += `
      <section id="offers" class="py-16 sm:py-24 border-b scroll-mt-20" style="border-color: ${brand.primaryColor}10; background-color: ${brand.primaryColor}05;">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" style="color: ${brand.textColor}; font-family: ${brand.fontHeading};">
              ${offers.headline}
            </h2>
            <p class="text-base sm:text-lg opacity-75" style="color: ${brand.textColor};">
              ${offers.subheadline}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            ${offers.items.map((offer) => `
            <div class="p-8 rounded-3xl border bg-white flex flex-col justify-between shadow-xl relative transition-transform hover:-translate-y-1 ${offer.popular ? 'ring-2 ring-offset-4' : ''}" style="${offer.popular ? `border-color: ${brand.primaryColor}; --tw-ring-color: ${brand.primaryColor};` : `border-color: ${brand.primaryColor}20;`}">
              ${offer.popular ? `
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md" style="background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor});">
                PILIHAN TERPOPULER
              </div>
              ` : ""}
              
              <div class="space-y-6">
                <div>
                  <h3 class="text-2xl font-black text-slate-900">${offer.name}</h3>
                  <p class="text-xs text-slate-500 mt-1">${offer.description}</p>
                </div>

                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-black text-slate-900">${offer.price}</span>
                  ${offer.originalPrice ? `
                  <span class="text-sm text-slate-400 line-through">${offer.originalPrice}</span>
                  ` : ""}
                </div>

                <ul class="space-y-3 pt-6 border-t border-slate-100">
                  ${offer.features.map((feat) => `
                  <li class="flex items-start gap-3 text-xs text-slate-600">
                    <svg class="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>${feat}</span>
                  </li>
                  `).join("")}
                </ul>
              </div>

              <div class="pt-8 flex flex-col gap-2.5">
                <a href="${getCheckoutRedirectUrl(data, offer.ctaUrl, offer.name, offer.price, offer.checkoutType, offer.customUrl)}" class="w-full block text-center py-3.5 px-4 rounded-xl text-sm font-extrabold text-white shadow-lg transition-transform active:scale-95" style="background: linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor});">
                  ${offer.ctaText}
                </a>
                ${basicInfo.whatsappUrl ? `
                <a href="${getCheckoutRedirectUrl(data, offer.ctaUrl, offer.name, offer.price, 'whatsapp', offer.checkoutType === 'whatsapp' ? offer.customUrl : undefined)}" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 text-center py-3 px-4 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-all active:scale-95">
                  <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.015 14.077 1.01 11.603 1.01c-5.41 0-9.82 4.363-9.824 9.795a9.69 9.69 0 001.5 5.1l-.988 3.605 3.756-.966z"/></svg>
                  <span>Pesan / Tanya via WhatsApp</span>
                </a>
                ` : ""}
              </div>
            </div>
            `).join("")}
          </div>
        </div>
      </section>
      `;
    }

    if (sectionId === "objections" && objections.enabled) {
      bodyContent += `
      <section class="py-16 sm:py-24 border-b bg-white" style="border-color: ${brand.primaryColor}10;">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 space-y-4">
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight" style="color: ${brand.textColor}; font-family: ${brand.fontHeading};">
              ${objections.headline}
            </h2>
          </div>

          <div class="space-y-4">
            ${objections.items.map((faq, idx) => `
            <div class="border rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors" style="border-color: ${brand.primaryColor}15;">
              <button onclick="toggleFaq(${idx})" class="w-full text-left p-6 flex justify-between items-center focus:outline-none">
                <span class="font-bold text-base text-slate-900">${faq.question}</span>
                <svg id="faq-icon-${idx}" class="w-5 h-5 text-slate-400 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div id="faq-content-${idx}" class="hidden px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t pt-4 border-slate-100">
                ${faq.answer}
              </div>
            </div>
            `).join("")}
          </div>
        </div>
      </section>
      `;
    }
  });

  // Footer Section
  if (footer.enabled) {
    bodyContent += `
    <footer class="py-12 border-t" style="background-color: ${brand.backgroundColor}; border-color: ${brand.primaryColor}10;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
          <span class="font-black text-lg" style="color: ${brand.primaryColor}; font-family: ${brand.fontHeading};">${brand.brandName || "LandingPage"}</span>
          <span class="text-xs text-slate-400">${footer.copyrightText}</span>
        </div>
        <div class="flex flex-wrap gap-6 text-xs text-slate-500 font-semibold justify-center">
          ${footer.links.map((link) => `<a href="${link.url}" class="hover:underline">${link.label}</a>`).join("")}
        </div>
      </div>
    </footer>
    `;
  }

  // Final Composite HTML Page
  return `<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${basicInfo.productName || "Landing Page"}</title>
  
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    ${fontHeaderImport}
    ${fontBodyImport}
    
    body {
      background-color: ${brand.backgroundColor};
      color: ${brand.textColor};
      font-family: ${brand.fontBody ? `'${brand.fontBody}', sans-serif` : 'sans-serif'};
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${brand.fontHeading ? `'${brand.fontHeading}', sans-serif` : 'sans-serif'};
    }
  </style>
</head>
<body class="min-h-screen selection:bg-[${brand.primaryColor}] selection:text-white">

  ${bodyContent}

  <script>
    function toggleFaq(index) {
      const content = document.getElementById('faq-content-' + index);
      const icon = document.getElementById('faq-icon-' + index);
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
      } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
      }
    }

    let activeDateIdx = 0;
    let activeTimeStr = '09:00';

    function selectDate(idx) {
      // Reset past active
      const pastActive = document.getElementById('date-btn-' + activeDateIdx);
      if (pastActive) {
        pastActive.className = "p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-800 text-center transition-all hover:bg-slate-50 hover:border-slate-300 cursor-pointer";
        const dayLabel = pastActive.querySelector('span:first-child');
        if (dayLabel) dayLabel.className = "block text-[9px] font-bold tracking-widest uppercase opacity-75 text-slate-400 font-mono";
      }

      activeDateIdx = idx;

      // Set new active
      const newActive = document.getElementById('date-btn-' + idx);
      if (newActive) {
        newActive.className = "p-2.5 rounded-2xl border text-center transition-all bg-indigo-600 border-indigo-600 text-white cursor-pointer";
        const dayLabel = newActive.querySelector('span:first-child');
        if (dayLabel) dayLabel.className = "block text-[9px] font-bold tracking-widest uppercase opacity-75 font-mono";
      }
    }

    function selectTime(timeStr) {
      // Reset past active time
      const pastActiveTime = document.getElementById('time-btn-' + activeTimeStr.replace(':', '-'));
      if (pastActiveTime) {
        pastActiveTime.className = "py-2 rounded-xl text-[11px] font-black text-center transition-all border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer";
      }

      activeTimeStr = timeStr;

      // Set new active time
      const newActiveTime = document.getElementById('time-btn-' + timeStr.replace(':', '-'));
      if (newActiveTime) {
        newActiveTime.className = "py-2 rounded-xl text-[11px] font-black text-center transition-all border border-indigo-600 bg-indigo-50 text-indigo-700 cursor-pointer";
      }
    }

    function confirmBooking() {
      const nameInput = document.getElementById('booking-name');
      if (!nameInput || !nameInput.value.trim()) {
        alert('Silakan masukkan nama lengkap Anda terlebih dahulu.');
        if (nameInput) nameInput.focus();
        return;
      }

      const overlay = document.getElementById('booking-success-overlay');
      if (overlay) {
        overlay.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
        overlay.classList.add('translate-y-0', 'opacity-100');
      }
    }

    function resetBooking() {
      const overlay = document.getElementById('booking-success-overlay');
      if (overlay) {
        overlay.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
        overlay.classList.remove('translate-y-0', 'opacity-100');
      }
      const nameInput = document.getElementById('booking-name');
      if (nameInput) nameInput.value = '';
    }
  </script>
</body>
</html>`;
}
