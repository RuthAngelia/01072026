import React, { useState } from "react";
import { LandingPageData } from "../types";
import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { getCheckoutRedirectUrl } from "./HtmlExporter";

interface PreviewProps {
  data: LandingPageData;
  viewMode: "desktop" | "mobile";
}

export const LandingPagePreview: React.FC<PreviewProps> = ({ data, viewMode }) => {
  const { brand, basicInfo, hero, benefits, productBridge, bonuses, testimonials, offers, objections, footer, sectionOrder } = data;

  // State to hold FAQ accordion expansion index
  const [activeFaq, setActiveFaq] = useState<Record<string, boolean>>({});

  // Picktime scheduler preview states
  const [selectedDateIdx, setSelectedDateIdx] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [schedulerTimezone, setSchedulerTimezone] = useState<string>("Asia/Jakarta (GMT+7)");
  const [bookingName, setBookingName] = useState<string>("");
  const [schedulerStatus, setSchedulerStatus] = useState<"idle" | "booked">("idle");
  const [annualBilling, setAnnualBilling] = useState<boolean>(false);

  // Render icons dynamically
  const renderIcon = (name: string, className?: string) => {
    const IconComponent = (Icons as any)[name];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Icons.CheckCircle className={className} />;
  };

  // Google Fonts dynamic stylesheet injector
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(brand.fontHeading || "Space Grotesk")}:wght@400;500;600;700;800;900&family=${encodeURIComponent(brand.fontBody || "Inter")}:wght@400;500;600;700&display=swap`;

  const isDarkTemplate = data.project.template === "dark";
  const isWarmTemplate = data.project.template === "warm";
  const isSoftTemplate = data.project.template === "soft";
  const isPicktimeTemplate = data.project.template === "picktime";

  const previewStyles = {
    backgroundColor: brand.backgroundColor || "#ffffff",
    color: brand.textColor || "#1e293b",
    fontFamily: `'${brand.fontBody || "Inter"}', sans-serif`,
  };

  const headingStyles = {
    fontFamily: `'${brand.fontHeading || "Space Grotesk"}', sans-serif`,
  };

  const primaryBtnStyles = {
    background: `linear-gradient(135deg, ${brand.primaryColor || "#4f46e5"}, ${brand.secondaryColor || "#06b6d4"})`,
  };

  const badgeStyles = {
    background: `linear-gradient(135deg, ${brand.primaryColor || "#4f46e5"}15, ${brand.secondaryColor || "#06b6d4"}15)`,
    color: brand.primaryColor || "#4f46e5",
    borderColor: `${brand.primaryColor || "#4f46e5"}30`,
  };

  const getLightBg = (hex: string, opacity = "05") => {
    return `${hex}${opacity}`;
  };

  const toggleFaq = (id: string) => {
    setActiveFaq(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "hero":
        if (!hero.enabled) return null;
        if (isPicktimeTemplate) {
          const scheduleDates = [
            { day: "Sen", date: "6 Jul" },
            { day: "Sel", date: "7 Jul" },
            { day: "Rab", date: "8 Jul" },
            { day: "Kam", date: "9 Jul" },
            { day: "Jum", date: "10 Jul" }
          ];
          const scheduleTimes = ["09:00", "11:30", "14:00", "16:30"];

          return (
            <header key="hero" className="relative py-20 lg:py-28 overflow-hidden border-b bg-white" style={{ borderColor: "#f1f5f9" }}>
              {/* Premium geometric layout accents */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-70 pointer-events-none" />
              <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-sky-50/40 rounded-full blur-[120px] pointer-events-none" />

              <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-8 text-left">
                    {hero.badgeText && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase font-mono shadow-sm">
                        <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                        {hero.badgeText}
                      </span>
                    )}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-slate-900" style={headingStyles}>
                      {hero.headline}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
                      {hero.subheadline}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a href={hero.ctaUrl && hero.ctaUrl.startsWith("#") ? hero.ctaUrl : getCheckoutRedirectUrl(data, hero.ctaUrl)} className="px-7 py-4 rounded-2xl text-center text-white font-extrabold text-xs shadow-xl shadow-indigo-600/10 hover:brightness-110 active:scale-95 transition-smooth flex items-center justify-center gap-2" style={primaryBtnStyles}>
                        <span>{hero.ctaText || "Mulai Penjadwalan"}</span>
                        <Icons.ArrowRight className="w-4 h-4" />
                      </a>
                      {basicInfo.whatsappUrl && (
                        <a href={basicInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-7 py-4 rounded-2xl text-center font-bold text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 active:scale-95 transition-smooth flex items-center justify-center gap-2 shadow-sm">
                          <Icons.MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                          Hubungi Penjualan
                        </a>
                      )}
                    </div>

                    {/* Problem / Agitate Alert */}
                    {(hero.agitateTitle || hero.agitateDescription) && (
                      <div className="p-5 rounded-3xl border border-rose-100 bg-rose-50/30 mt-8 max-w-xl shadow-sm">
                        <h3 className="text-xs font-black flex items-center gap-2 text-rose-700 mb-1.5">
                          <Icons.AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
                          {hero.agitateTitle}
                        </h3>
                        <p className="text-xs text-rose-600/90 leading-relaxed font-medium">
                          {hero.agitateDescription}
                        </p>
                      </div>
                    )}

                    {/* Calendar Sync badges */}
                    <div className="space-y-3 pt-6 border-t border-slate-100 max-w-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Dukungan Kalender Instan:</p>
                      <div className="flex flex-wrap items-center gap-4 text-slate-400">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><Icons.Calendar className="w-4 h-4 text-indigo-500" /> Google Calendar</span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><Icons.Clock className="w-4 h-4 text-purple-500" /> Apple iCal</span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><Icons.Video className="w-4 h-4 text-blue-500" /> Zoom Integration</span>
                      </div>
                    </div>
                  </div>

                  {/* Picktime Interactive Scheduler Widget - Redesigned ultra-premium */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-[350px] bg-white border border-slate-100 rounded-[32px] shadow-2xl p-6 relative overflow-hidden transition-smooth hover:shadow-indigo-100 hover:scale-[1.01] duration-300">
                      
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                      {/* Header Widget */}
                      <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                              P
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-black text-slate-900 leading-none">Konsultasi Live</h4>
                            <p className="text-[9px] text-slate-400 mt-1 font-mono font-bold uppercase tracking-wider">Sesi 30 Menit</p>
                          </div>
                        </div>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100/60 px-2.5 py-0.5 rounded-full font-black">GRATIS</span>
                      </div>

                      {schedulerStatus === "booked" ? (
                        <div className="py-8 text-center space-y-4">
                          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                            <Icons.CheckCircle className="w-7 h-7 text-emerald-500" />
                          </div>
                          <div className="space-y-2 px-1 text-center">
                            <h5 className="text-sm font-black text-slate-900">Pertemuan Terjadwal!</h5>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                              Halo <strong>{bookingName || "Tamu"}</strong>, slot Anda berhasil dipesan untuk tanggal <strong>{scheduleDates[selectedDateIdx].date}</strong> jam <strong>{selectedTimeSlot} WIB</strong>.
                            </p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-left space-y-1.5 max-w-xs mx-auto">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">📅 LINK INTEGRASI:</span>
                            <ul className="text-[9px] text-slate-600 space-y-1 list-inside list-disc">
                              <li className="font-medium">Link Zoom dikirim otomatis ke email</li>
                              <li className="font-medium">Pengingat instan dikirim ke WA</li>
                            </ul>
                          </div>
                          <button 
                            onClick={() => {
                              setSchedulerStatus("idle");
                              setSelectedTimeSlot("");
                              setBookingName("");
                            }}
                            className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                          >
                            Reschedule Pertemuan
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Timezone Selector */}
                          <div className="space-y-1 text-left">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">Zona Waktu:</label>
                            <div className="relative">
                              <select 
                                value={schedulerTimezone}
                                onChange={(e) => setSchedulerTimezone(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] text-slate-700 focus:outline-none appearance-none cursor-pointer font-bold"
                              >
                                <option>Asia/Jakarta (GMT+7)</option>
                                <option>Asia/Makassar (GMT+8)</option>
                                <option>Asia/Jayapura (GMT+9)</option>
                                <option>US/Pacific (GMT-8)</option>
                              </select>
                              <Icons.ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                            </div>
                          </div>

                          {/* Calendar Days */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">Pilih Tanggal:</label>
                            <div className="grid grid-cols-5 gap-1.5">
                              {scheduleDates.map((item, idx) => (
                                <button 
                                  key={idx}
                                  onClick={() => {
                                    setSelectedDateIdx(idx);
                                    setSelectedTimeSlot("");
                                  }}
                                  className={`py-2.5 rounded-xl flex flex-col items-center border transition-smooth cursor-pointer ${selectedDateIdx === idx ? "border-indigo-600 bg-indigo-50/40 text-indigo-700 shadow-sm" : "border-slate-50 bg-slate-50/50 hover:bg-slate-50 text-slate-600"}`}
                                >
                                  <span className="text-[8px] font-black uppercase font-mono">{item.day}</span>
                                  <span className="text-xs font-black mt-1 font-mono">{item.date.split(" ")[0]}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Available Time Slots */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">Jam Tersedia ({schedulerTimezone.split(" ")[0]}):</label>
                            <div className="grid grid-cols-2 gap-2">
                              {scheduleTimes.map((time) => (
                                <button 
                                  key={time}
                                  onClick={() => setSelectedTimeSlot(time)}
                                  className={`py-2 rounded-xl border text-[10px] font-black transition-smooth cursor-pointer text-center ${selectedTimeSlot === time ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/15" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700"}`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Action Booking */}
                          {selectedTimeSlot && (
                            <div className="pt-3 border-t border-slate-50 space-y-2 text-left animate-fadeIn">
                              <div className="space-y-1">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-mono">Nama Anda:</label>
                                <input 
                                  type="text" 
                                  value={bookingName}
                                  onChange={(e) => setBookingName(e.target.value)}
                                  placeholder="Nama lengkap Anda..."
                                  className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-[10px] text-slate-800 focus:outline-none font-bold"
                                />
                              </div>
                              <button 
                                onClick={() => {
                                  if (!bookingName.trim()) {
                                    alert("Silakan masukkan nama Anda!");
                                    return;
                                  }
                                  setSchedulerStatus("booked");
                                }}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] rounded-xl shadow-lg shadow-indigo-600/10 active:scale-95 transition-smooth flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Icons.Check className="w-3.5 h-3.5" />
                                <span>Klaim Sesi Jam {selectedTimeSlot}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </header>
          );
        } else {
          // Standard / custom redesigned hero matching branding colors
          const heroThemeBg = isDarkTemplate ? "bg-[#030612] border-slate-900/60" : "bg-white border-slate-100";
          return (
            <header key="hero" className={`relative py-20 sm:py-28 overflow-hidden border-b ${heroThemeBg}`}>
              
              {/* Complex premium visual grids and ambient spots */}
              {isDarkTemplate ? (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
                  <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
                  <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[100px] opacity-15 pointer-events-none" style={{ background: brand.primaryColor || "#6366f1" }} />
                </>
              )}

              <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                  <div className="md:col-span-7 space-y-6 text-left">
                    {hero.badgeText && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-white uppercase shadow-sm border border-white/10" style={primaryBtnStyles}>
                        {hero.badgeText}
                      </span>
                    )}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]" style={{ ...headingStyles, color: brand.textColor }}>
                      {hero.headline}
                    </h1>
                    <p className="text-sm sm:text-base leading-relaxed opacity-80" style={{ color: brand.textColor }}>
                      {hero.subheadline}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a href={hero.ctaUrl && hero.ctaUrl.startsWith("#") ? hero.ctaUrl : getCheckoutRedirectUrl(data, hero.ctaUrl)} className="px-7 py-3.5 rounded-2xl text-center text-white font-black text-xs shadow-xl shadow-indigo-600/10 hover:brightness-110 active:scale-95 transition-smooth cursor-pointer" style={primaryBtnStyles}>
                        {hero.ctaText || "Beli Sekarang"}
                      </a>
                      {basicInfo.whatsappUrl && (
                        <a href={basicInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 rounded-2xl text-center font-bold text-xs border hover:bg-black/5 active:scale-95 transition-smooth flex items-center justify-center gap-2" style={{ color: brand.textColor, borderColor: getLightBg(brand.primaryColor, "30") }}>
                          <Icons.MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                          Tanya WhatsApp
                        </a>
                      )}
                    </div>

                    {/* Problem / Agitate Alert */}
                    {(hero.agitateTitle || hero.agitateDescription) && (
                      <div className="p-5 rounded-2xl border mt-8 shadow-sm backdrop-blur-md" style={{ backgroundColor: getLightBg(brand.primaryColor, "04"), borderColor: getLightBg(brand.primaryColor, "15") }}>
                        <h3 className="text-xs font-black flex items-center gap-2 mb-1.5" style={{ color: brand.primaryColor }}>
                          <Icons.AlertTriangle className="w-4 h-4 text-red-500 animate-pulse shrink-0" />
                          {hero.agitateTitle}
                        </h3>
                        <p className="text-xs opacity-85 leading-relaxed font-medium">
                          {hero.agitateDescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Redesigned Image Frame with screen reflections */}
                  <div className="md:col-span-5 flex justify-center">
                    {hero.mockupImage ? (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                        <img src={hero.mockupImage} alt="Product Mockup" className="w-full max-w-[270px] rounded-3xl shadow-2xl border border-white/10 hover:scale-[1.03] transition-smooth duration-500 relative z-10" />
                      </div>
                    ) : (
                      <div className="w-full max-w-[270px] aspect-[4/3] rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 shadow-sm">
                        <Icons.Image className="w-8 h-8 text-slate-300 mb-2" />
                        <span className="text-xs font-extrabold text-slate-700 block mb-1">{basicInfo.productName || "Product Mockup"}</span>
                        <span className="text-[10px] text-slate-400">Pilih gambar mockup di editor</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>
          );
        }

      case "benefits":
        if (!benefits.enabled) return null;
        if (isPicktimeTemplate) {
          return (
            <section key="benefits" className="py-20 border-b bg-white text-left" style={{ borderColor: "#f1f5f9" }}>
              <div className="max-w-5xl mx-auto px-6 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-black uppercase tracking-widest font-mono border border-indigo-100">⚡ INVESTASI VALUE</span>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900" style={headingStyles}>
                    {benefits.headline}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    {benefits.introText}
                  </p>
                </div>

                {/* Redesigned Bento Grid with card scaling */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {benefits.items.map((item, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <div 
                        key={item.id} 
                        className={`p-6 rounded-3xl border transition-smooth hover:-translate-y-1.5 hover:shadow-xl duration-300 flex flex-col justify-between ${isFirst ? "bg-slate-950 text-white border-slate-900 shadow-xl shadow-slate-950/10" : "bg-slate-50/50 text-slate-800 border-slate-100"}`}
                      >
                        <div className="space-y-4">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isFirst ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                            {renderIcon(item.icon, "w-5 h-5")}
                          </div>
                          <h3 className={`text-base font-black ${isFirst ? "text-white" : "text-slate-900"}`} style={headingStyles}>
                            {item.title}
                          </h3>
                          <p className={`text-xs leading-relaxed font-medium ${isFirst ? "text-slate-300" : "text-slate-450"}`}>
                            {item.description}
                          </p>
                        </div>
                        <div className="pt-5 flex items-center gap-1.5 text-[9px] font-black text-indigo-600 font-mono uppercase tracking-widest">
                          <span>Pelajari Selengkapnya</span>
                          <Icons.ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        } else {
          const benefitThemeBg = isDarkTemplate ? "bg-[#02050f] border-slate-900/60" : "bg-white border-slate-100";
          return (
            <section key="benefits" className={`py-20 border-b ${benefitThemeBg}`}>
              <div className="max-w-5xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...headingStyles, color: brand.textColor }}>
                    {benefits.headline}
                  </h2>
                  <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                    {benefits.introText}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {benefits.items.map((item) => (
                    <div key={item.id} className="p-6 rounded-3xl border backdrop-blur-md shadow-sm hover:shadow-md transition-smooth flex flex-col justify-between" style={{ backgroundColor: isDarkTemplate ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.60)", borderColor: getLightBg(brand.primaryColor, "15") }}>
                      <div className="space-y-4">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-600/5" style={primaryBtnStyles}>
                          {renderIcon(item.icon, "w-5 h-5")}
                        </div>
                        <h3 className="text-base font-black" style={{ ...headingStyles, color: brand.textColor }}>
                          {item.title}
                        </h3>
                        <p className="text-xs opacity-80 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

      case "productBridge":
        if (!productBridge.enabled) return null;
        if (isPicktimeTemplate) {
          return (
            <section key="productBridge" className="py-20 border-b bg-slate-50/20 text-left" style={{ borderColor: "#f1f5f9" }}>
              <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left: Ofspace style Sync Integration Card */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full max-w-[280px] bg-white border border-slate-100 rounded-[32px] p-6 shadow-xl relative overflow-hidden space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <span className="text-[9px] font-black font-mono text-indigo-600 uppercase tracking-widest">Konektivitas Live</span>
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center"><Icons.Video className="w-3.5 h-3.5 text-indigo-600" /></div>
                            <span className="text-[10px] font-black text-slate-800">Zoom Meetings</span>
                          </div>
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60">Aktif</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center"><Icons.Slack className="w-3.5 h-3.5 text-purple-600" /></div>
                            <span className="text-[10px] font-black text-slate-800">Slack Alerts</span>
                          </div>
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60">Aktif</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center"><Icons.Calendar className="w-3.5 h-3.5 text-blue-600" /></div>
                            <span className="text-[10px] font-black text-slate-800">Google Calendar</span>
                          </div>
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60">Aktif</span>
                        </div>
                      </div>

                      <div className="bg-indigo-50 border border-indigo-100/50 p-3 rounded-2xl text-center">
                        <span className="text-[9px] font-black text-indigo-700 leading-snug block">✓ Sinkronisasi Cloud 100% Aman</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Steps */}
                  <div className="lg:col-span-7 space-y-8">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-tight" style={headingStyles}>
                      {productBridge.headline}
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-smooth hover:shadow-md">
                        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-indigo-50 text-indigo-600 font-black text-xs font-mono border border-indigo-100">1</div>
                        <div className="space-y-0.5 text-left">
                          <span className="font-black text-[9px] text-slate-400 uppercase font-mono block">Fitur Utama:</span>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{productBridge.featureText}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-smooth hover:shadow-md">
                        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-purple-50 text-purple-600 font-black text-xs font-mono border border-purple-100">2</div>
                        <div className="space-y-0.5 text-left">
                          <span className="font-black text-[9px] text-slate-400 uppercase font-mono block">Manfaat Utama:</span>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{productBridge.benefitText}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4.5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-smooth hover:shadow-md">
                        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-emerald-50 text-emerald-600 font-black text-xs font-mono border border-emerald-100">3</div>
                        <div className="space-y-0.5 text-left">
                          <span className="font-black text-[9px] text-slate-400 uppercase font-mono block">Dampak Instan:</span>
                          <p className="text-xs sm:text-sm font-black leading-relaxed" style={{ color: brand.primaryColor }}>{productBridge.meaningText}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-left">
                      <a href={productBridge.ctaUrl && productBridge.ctaUrl.startsWith("#") ? productBridge.ctaUrl : getCheckoutRedirectUrl(data, productBridge.ctaUrl)} className="px-6 py-3.5 rounded-2xl text-xs font-black text-white shadow-xl shadow-indigo-600/10 inline-flex items-center gap-2 hover:brightness-110 active:scale-95 transition-smooth" style={primaryBtnStyles}>
                        <span>{productBridge.ctaText}</span>
                        <Icons.ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          );
        } else {
          const bridgeThemeBg = isDarkTemplate ? "bg-[#030612] border-slate-900/60" : "bg-white border-slate-100";
          return (
            <section key="productBridge" className={`py-20 border-b ${bridgeThemeBg}`}>
              <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 flex justify-center">
                    {productBridge.mockupImage ? (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-3xl blur-2xl opacity-15" />
                        <img src={productBridge.mockupImage} alt="Bridge Mockup" className="w-full max-w-[220px] rounded-3xl shadow-xl border relative z-10 hover:scale-[1.02] transition-smooth duration-500" />
                      </div>
                    ) : (
                      <div className="w-full max-w-[220px] aspect-[4/5] bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center shadow-sm">
                        <Icons.BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                        <span className="text-[10px] font-bold text-slate-500">{basicInfo.productName || "Product Bundle"}</span>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-7 space-y-6 text-left">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...headingStyles, color: brand.textColor }}>
                      {productBridge.headline}
                    </h2>
                    
                    <div className="space-y-3.5">
                      <div className="flex items-start gap-3 p-3 rounded-2xl" style={{ backgroundColor: isDarkTemplate ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
                        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-indigo-50/60 text-indigo-600 font-bold text-[10px] mt-0.5 border border-indigo-100">1</div>
                        <div>
                          <span className="font-black text-[9px] text-slate-400 uppercase font-mono block">Fitur Utama:</span>
                          <p className="text-xs font-semibold opacity-90 mt-0.5">{productBridge.featureText}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-2xl" style={{ backgroundColor: isDarkTemplate ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
                        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-sky-50/60 text-sky-600 font-bold text-[10px] mt-0.5 border border-sky-100">2</div>
                        <div>
                          <span className="font-black text-[9px] text-slate-400 uppercase font-mono block">Manfaat Utama:</span>
                          <p className="text-xs font-semibold opacity-90 mt-0.5">{productBridge.benefitText}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-2xl" style={{ backgroundColor: isDarkTemplate ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)" }}>
                        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-emerald-50/60 text-emerald-600 font-bold text-[10px] mt-0.5 border border-emerald-100">3</div>
                        <div>
                          <span className="font-black text-[9px] text-slate-400 uppercase font-mono block">Arti Bagi Anda:</span>
                          <p className="text-base font-black leading-snug" style={{ color: brand.primaryColor }}>{productBridge.meaningText}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <a href={productBridge.ctaUrl && productBridge.ctaUrl.startsWith("#") ? productBridge.ctaUrl : getCheckoutRedirectUrl(data, productBridge.ctaUrl)} className="px-6 py-3 rounded-2xl text-xs font-black text-white shadow-lg shadow-indigo-600/10 hover:brightness-110 active:scale-95 transition-smooth" style={primaryBtnStyles}>
                        {productBridge.ctaText}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }

      case "bonuses":
        if (!bonuses.enabled) return null;
        const bonusThemeBg = isDarkTemplate ? "bg-[#02040c]" : "bg-slate-50/30";
        return (
          <section key="bonuses" className={`py-20 border-b ${bonusThemeBg}`} style={{ borderColor: getLightBg(brand.primaryColor, "15") }}>
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  🎁 BONUS GRATIS SPESIAL
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...headingStyles, color: brand.textColor }}>
                  {bonuses.headline}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {bonuses.items.map((bonus) => (
                  <div key={bonus.id} className="p-5 rounded-3xl border flex gap-4 items-center relative overflow-hidden bg-white/5 shadow-md backdrop-blur-md transition-smooth hover:scale-[1.01]" style={{ borderColor: getLightBg(brand.primaryColor, "15") }}>
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl font-mono uppercase tracking-wider shadow-sm">
                      Senilai {bonus.originalPrice}
                    </div>
                    <div className="w-16 h-16 shrink-0 bg-slate-50/50 rounded-2xl flex items-center justify-center border border-slate-100">
                      {bonus.image ? (
                        <img src={bonus.image} alt="Bonus" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Icons.Gift className="w-6 h-6 text-indigo-500" />
                      )}
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="font-black text-sm text-slate-900 leading-tight">{bonus.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{bonus.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "testimonials":
        if (!testimonials.enabled) return null;
        const testThemeBg = isDarkTemplate ? "bg-[#030612] border-slate-900/60" : "bg-white border-slate-100";
        return (
          <section key="testimonials" className={`py-20 border-b ${testThemeBg}`}>
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-black uppercase tracking-widest font-mono border border-indigo-100/60">🗣️ SOCIAL PROOF</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...headingStyles, color: brand.textColor }}>
                  {testimonials.headline}
                </h2>
                <p className="text-xs sm:text-sm opacity-80 font-medium">
                  {testimonials.supportingText}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {testimonials.items.map((item) => (
                  <div key={item.id} className="p-6 rounded-3xl border shadow-sm hover:shadow-md transition-smooth flex flex-col justify-between" style={{ backgroundColor: isDarkTemplate ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.7)", borderColor: getLightBg(brand.primaryColor, "15") }}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Icons.Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs italic text-slate-600 leading-relaxed font-medium text-left">
                        "{item.comment}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100/60 mt-5">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-black text-indigo-600 text-xs overflow-hidden shrink-0 border border-slate-200">
                        {item.avatar ? (
                          <img src={item.avatar} alt={item.name} className="w-full h-full object-cover rounded-full" />
                        ) : item.name[0]}
                      </div>
                      <div className="text-left">
                        <h4 className="font-black text-xs text-slate-900 leading-none">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case "offers":
        if (!offers.enabled) return null;
        if (isPicktimeTemplate) {
          const getDisplayPrice = (priceStr: string, isAnnual: boolean) => {
            if (!isAnnual) return priceStr;
            const match = priceStr.match(/(\d[\d\.]*)/);
            if (match) {
              const rawNum = parseInt(match[0].replace(/\./g, ""), 10);
              if (!isNaN(rawNum)) {
                const discounted = Math.round(rawNum * 0.8);
                const formatted = new Intl.NumberFormat("id-ID").format(discounted);
                return priceStr.replace(match[0], formatted);
              }
            }
            return priceStr;
          };

          return (
            <section id="offers" key="offers" className="py-20 border-b scroll-mt-10 bg-slate-50/30" style={{ borderColor: "#f1f5f9" }}>
              <div className="max-w-5xl mx-auto px-6 space-y-12 text-left">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-black uppercase tracking-widest font-mono border border-indigo-100">💰 INVESTASI TERBAIK</span>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900" style={headingStyles}>
                    {offers.headline}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    {offers.subheadline}
                  </p>

                  {/* Pricing Toggle - Redesigned sleek capsule */}
                  <div className="pt-4 flex justify-center">
                    <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-sm">
                      <button 
                        onClick={() => setAnnualBilling(false)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black transition-smooth cursor-pointer ${!annualBilling ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Bulanan
                      </button>
                      <button 
                        onClick={() => setAnnualBilling(true)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black transition-smooth cursor-pointer flex items-center gap-1.5 ${annualBilling ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <span>Tahunan</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${annualBilling ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'}`}>Hemat 20%</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
                  {offers.items.map((offer) => {
                    const priceToDisplay = getDisplayPrice(offer.price, annualBilling);
                    const isPremium = offer.popular;
                    return (
                      <div 
                        key={offer.id} 
                        className={`p-6 rounded-[32px] border flex flex-col justify-between relative transition-smooth hover:shadow-xl duration-300 ${isPremium ? 'bg-white border-indigo-600 shadow-indigo-100 shadow-2xl scale-[1.01]' : 'bg-white border-slate-100 shadow-md'}`}
                      >
                        {isPremium && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md shadow-indigo-500/10" style={primaryBtnStyles}>
                            REKOMENDASI UTAMA
                          </div>
                        )}
                        
                        <div className="space-y-4 text-left">
                          <div>
                            <h3 className="text-lg font-black text-slate-950 leading-none">{offer.name}</h3>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed">{offer.description}</p>
                          </div>

                          <div className="flex items-baseline gap-1.5 border-b border-slate-50 pb-4">
                            <span className="text-3xl font-black text-slate-950">{priceToDisplay}</span>
                            <span className="text-[10px] text-slate-400 font-bold">/ {annualBilling ? "bulan" : "bulan"}</span>
                            {offer.originalPrice && !annualBilling && (
                              <span className="text-xs text-slate-450 line-through ml-1">{offer.originalPrice}</span>
                            )}
                          </div>

                          <ul className="space-y-2.5 pt-2">
                            {offer.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-[10px] text-slate-600 font-medium">
                                <Icons.Check className="w-3.5 h-3.5 shrink-0 text-indigo-600 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-6 space-y-2">
                          <a href={getCheckoutRedirectUrl(data, offer.ctaUrl, offer.name, priceToDisplay, offer.checkoutType, offer.customUrl)} className="w-full block text-center py-3 px-4 rounded-xl text-xs font-black text-white shadow-lg shadow-indigo-500/10 hover:brightness-110 active:scale-95 transition-smooth" style={primaryBtnStyles}>
                            {offer.ctaText}
                          </a>
                          {basicInfo.whatsappUrl && (
                            <a 
                              href={getCheckoutRedirectUrl(data, offer.ctaUrl, offer.name, priceToDisplay, "whatsapp", offer.checkoutType === "whatsapp" ? offer.customUrl : undefined)}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center justify-center gap-1.5 text-center py-2 px-4 rounded-xl text-[10px] font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/60 transition-smooth active:scale-95 cursor-pointer"
                            >
                              <Icons.MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Tanya Detail via WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        } else {
          const offerThemeBg = isDarkTemplate ? "bg-[#02050f] border-slate-900/60" : "bg-slate-50/30";
          return (
            <section id="offers" key="offers" className={`py-20 border-b scroll-mt-10 ${offerThemeBg}`} style={{ borderColor: getLightBg(brand.primaryColor, "15") }}>
              <div className="max-w-5xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ ...headingStyles, color: brand.textColor }}>
                    {offers.headline}
                  </h2>
                  <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                    {offers.subheadline}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
                  {offers.items.map((offer) => (
                    <div key={offer.id} className={`p-6 rounded-[32px] border bg-white flex flex-col justify-between shadow-xl relative transition-smooth hover:scale-[1.01] ${offer.popular ? 'ring-2' : ''}`} style={offer.popular ? { borderColor: brand.primaryColor, ringColor: brand.primaryColor } : { borderColor: getLightBg(brand.primaryColor, "15") }}>
                      {offer.popular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow" style={primaryBtnStyles}>
                          BEST VALUE
                        </div>
                      )}
                      
                      <div className="space-y-4 text-left">
                        <div>
                          <h3 className="text-base font-black text-slate-950 leading-none">{offer.name}</h3>
                          <p className="text-[10px] text-slate-450 mt-1.5 font-medium leading-relaxed">{offer.description}</p>
                        </div>

                        <div className="flex items-baseline gap-1.5 border-b border-slate-50 pb-4">
                          <span className="text-2xl font-black text-slate-950">{offer.price}</span>
                          {offer.originalPrice && (
                            <span className="text-xs text-slate-400 line-through ml-1">{offer.originalPrice}</span>
                          )}
                        </div>

                        <ul className="space-y-2.5 pt-2">
                          {offer.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[10px] text-slate-650 font-medium">
                              <Icons.Check className="w-3.5 h-3.5 shrink-0 text-indigo-600 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 space-y-2">
                        <a href={getCheckoutRedirectUrl(data, offer.ctaUrl, offer.name, offer.price, offer.checkoutType, offer.customUrl)} className="w-full block text-center py-3 px-4 rounded-xl text-xs font-black text-white shadow-md hover:brightness-110 transition-smooth" style={primaryBtnStyles}>
                          {offer.ctaText}
                        </a>
                        {basicInfo.whatsappUrl && (
                          <a 
                            href={getCheckoutRedirectUrl(data, offer.ctaUrl, offer.name, offer.price, "whatsapp", offer.checkoutType === "whatsapp" ? offer.customUrl : undefined)}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 text-center py-2 px-4 rounded-xl text-[10px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 transition-colors active:scale-95"
                          >
                            <Icons.MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Pesan via WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

      case "objections":
        if (!objections.enabled) return null;
        const faqThemeBg = isDarkTemplate ? "bg-[#030612] border-slate-900/60" : "bg-white border-slate-100";
        return (
          <section key="objections" className={`py-20 border-b ${faqThemeBg}`} style={{ borderColor: getLightBg(brand.primaryColor, "15") }}>
            <div className="max-w-2xl mx-auto px-6">
              <div className="text-center mb-10">
                <span className="text-[9px] bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-black uppercase tracking-widest font-mono border border-indigo-100/60">❓ FAQ</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3" style={{ ...headingStyles, color: brand.textColor }}>
                  {objections.headline}
                </h2>
              </div>

              <div className="space-y-3.5">
                {objections.items.map((faq) => {
                  const isOpen = !!activeFaq[faq.id];
                  return (
                    <div key={faq.id} className="border rounded-2xl bg-slate-50/50 overflow-hidden shadow-sm hover:border-slate-300 transition-colors duration-200" style={{ borderColor: getLightBg(brand.primaryColor, "15") }}>
                      <button onClick={() => toggleFaq(faq.id)} className="w-full text-left p-4.5 flex justify-between items-center focus:outline-none hover:bg-slate-50 transition-colors">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900">{faq.question}</span>
                        <Icons.ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t pt-3.5 border-slate-100/60 text-left font-medium">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-hidden flex flex-col items-center">
      {/* Dynamic Font Loader Link */}
      <link rel="stylesheet" href={googleFontsUrl} />

      <div className={`w-full transition-all duration-300 ${viewMode === "mobile" ? "max-w-[340px] border-8 border-slate-900 rounded-[32px] overflow-hidden shadow-2xl my-4" : "max-w-full"}`}>
        <div style={previewStyles} className="min-h-[500px] w-full text-left">
          
          {/* Miniature Header/NavBar */}
          <nav className="sticky top-0 z-40 backdrop-blur-md border-b flex items-center justify-between p-3.5 shadow-sm" style={{ backgroundColor: `${brand.backgroundColor}e6`, borderColor: `${brand.primaryColor}15` }}>
            <div className="flex items-center gap-2">
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt="Logo" className="h-6 max-w-[80px] object-contain" />
              ) : (
                <div className="w-6 h-6 rounded bg-gradient-to-br flex items-center justify-center text-[10px] font-black text-white" style={badgeStyles}>
                  {brand.brandName ? brand.brandName[0].toUpperCase() : 'L'}
                </div>
              )}
              <span className="font-black text-xs tracking-tight" style={{ ...headingStyles, color: brand.textColor }}>{brand.brandName}</span>
            </div>
            <a href="#offers" className="px-4 py-2 rounded-xl text-[10px] font-black text-white shadow" style={primaryBtnStyles}>
              Beli
            </a>
          </nav>

          {/* Sequential body segments */}
          {sectionOrder.map(renderSection)}

          {/* Miniature Footer */}
          {footer.enabled && (
            <footer className="p-8 border-t bg-white" style={{ backgroundColor: brand.backgroundColor, borderColor: getLightBg(brand.primaryColor, "15") }}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-center">
                <div className="space-y-1.5 text-left">
                  <span className="font-black text-xs block" style={{ ...headingStyles, color: brand.primaryColor }}>{brand.brandName}</span>
                  <span className="text-[10px] text-slate-450 block font-medium">{footer.copyrightText}</span>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  {footer.links.map((link) => (
                    <a key={link.id} href={link.url} className="text-[10px] text-slate-450 hover:text-slate-900 font-bold transition-colors">{link.label}</a>
                  ))}
                </div>
              </div>
            </footer>
          )}

        </div>
      </div>
    </div>
  );
};
