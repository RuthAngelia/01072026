import React, { useState, useRef } from "react";
import { LandingPageData } from "../types";
import { FONT_PRESETS, TEMPLATE_PRESETS } from "../data";
import { 
  Sparkles, Info, Star, Plus, Trash2, ArrowUp, ArrowDown, 
  Settings, Image as ImageIcon, CheckCircle, Gift, Palette,
  Globe, HelpCircle, Layers, TrendingUp, Zap, Award, BookOpen, 
  Target, Shield, Coffee, Users, ExternalLink, HelpCircle as HelpIcon,
  ChevronsUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EditorTabsProps {
  data: LandingPageData;
  onChange: (updatedData: LandingPageData) => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

// Icon list preset for Benefits section
const ICON_LIST = [
  { name: "CheckCircle", icon: CheckCircle },
  { name: "Layers", icon: Layers },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Sparkles", icon: Sparkles },
  { name: "Zap", icon: Zap },
  { name: "Award", icon: Award },
  { name: "BookOpen", icon: BookOpen },
  { name: "Target", icon: Target },
  { name: "Shield", icon: Shield },
  { name: "Coffee", icon: Coffee },
  { name: "Users", icon: Users },
  { name: "Globe", icon: Globe }
];

export const EditorTabs: React.FC<EditorTabsProps> = ({ data, onChange, activeTab, setActiveTab }) => {
  // Helper to deep update state
  const updateField = (section: keyof LandingPageData, field: string, value: any) => {
    const updated = {
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value
      }
    };
    onChange(updated);
  };

  // Reusable Form Group with Icon, Label, and Hover state
  const InputField: React.FC<{
    label: string;
    helper?: string;
    icon?: React.ComponentType<any>;
    rightElement?: React.ReactNode;
    children: React.ReactNode;
  }> = ({ label, helper, icon: Icon, rightElement, children }) => {
    return (
      <div className="space-y-1.5 group/field w-full">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400 group-focus-within/field:text-zinc-200 transition-colors duration-150">
            {label}
          </label>
          {rightElement}
        </div>
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-zinc-500 group-focus-within/field:text-zinc-300 transition-colors duration-150 pointer-events-none z-10">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="w-full">
            {children}
          </div>
        </div>
        {helper && (
          <p className="text-[10px] text-zinc-500 leading-normal">{helper}</p>
        )}
      </div>
    );
  };

  // Reusable Drag and Drop Base64 File Uploader
  const FileUploader: React.FC<{
    label: string;
    onUpload: (base64: string) => void;
    currentImage: string;
  }> = ({ label, onUpload, currentImage }) => {
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onUpload(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(true);
    };

    const handleDragLeave = () => {
      setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    return (
      <div className="space-y-1.5 w-full">
        <label className="text-xs font-medium text-zinc-400 block">{label}</label>
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-150 ${dragging ? 'border-zinc-500 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="image/*" 
            className="hidden" 
          />
          {currentImage ? (
            <div className="space-y-2 w-full">
              <div className="relative group max-w-xs mx-auto">
                <img src={currentImage} alt="Uploaded" className="h-16 max-w-full object-contain mx-auto rounded border border-zinc-800" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 rounded transition-opacity flex items-center justify-center">
                  <span className="text-[10px] text-white font-medium">Replace Image</span>
                </div>
              </div>
              <span className="text-[9px] text-zinc-500 block">Click or drag to replace</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-1">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-xs text-zinc-300 font-medium">Click or drag image here</p>
              <p className="text-[10px] text-zinc-500">PNG, JPG, WebP (max 2MB)</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Section Ordering Reorder function
  const moveSection = (index: number, direction: "up" | "down") => {
    const updatedOrder = [...data.sectionOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < updatedOrder.length) {
      const temp = updatedOrder[index];
      updatedOrder[index] = updatedOrder[targetIndex];
      updatedOrder[targetIndex] = temp;
      onChange({ ...data, sectionOrder: updatedOrder });
    }
  };

  // Section Label mapping
  const getSectionLabel = (id: string) => {
    switch (id) {
      case "hero": return "1. Hero / Problem Setup";
      case "benefits": return "2. Present Benefit";
      case "productBridge": return "3. Product Bridging";
      case "bonuses": return "4. Bonus Section";
      case "testimonials": return "5. Social Proof / Testimonials";
      case "offers": return "6. Offer Stack / Pricing";
      case "objections": return "7. Handling Objection / FAQ";
      default: return id;
    }
  };

  return (
    <div className="w-full">
      {/* Editor Main Content Body with subtle fade in transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >

          {/* 1. Basic Info */}
          {activeTab === 0 && (
            <div className="space-y-5">
              <div className="glass-card p-6 space-y-5 border-zinc-800/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight font-sans">Product Information</h3>
                    <p className="text-[11px] text-zinc-400 font-medium">Define the digital product you want to offer.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Nama Produk" helper="Nama utama produk atau jasa Anda." icon={Info}>
                    <input 
                      type="text" 
                      value={data.basicInfo.productName} 
                      onChange={(e) => updateField("basicInfo", "productName", e.target.value)}
                      placeholder="e.g. SaaS Launch Blueprint"
                      className="premium-input w-full pl-10"
                    />
                  </InputField>

                  <InputField label="Tipe Produk" helper="e.g. Video Course, Ebook, Layanan, Software." icon={Layers}>
                    <input 
                      type="text" 
                      value={data.basicInfo.productType} 
                      onChange={(e) => updateField("basicInfo", "productType", e.target.value)}
                      placeholder="e.g. Ebook & Video Course"
                      className="premium-input w-full pl-10"
                    />
                  </InputField>
                </div>

                <InputField label="Target Audiens" helper="Gambarkan secara spesifik siapa pembeli ideal Anda." icon={Users}>
                  <input 
                    type="text" 
                    value={data.basicInfo.targetAudience} 
                    onChange={(e) => updateField("basicInfo", "targetAudience", e.target.value)}
                    placeholder="e.g. Developer, Freelancer, & Creator Independen"
                    className="premium-input w-full pl-10"
                  />
                </InputField>
              </div>

              <div className="glass-card p-6 space-y-5 border-zinc-800/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight font-sans">Checkout Integration</h3>
                    <p className="text-[11px] text-zinc-400 font-medium">Configure redirect routes when purchasing.</p>
                  </div>
                </div>

                <InputField label="Metode Checkout Utama" helper="Saluran default untuk memproses pembayaran." icon={Globe}>
                  <select
                    value={data.basicInfo.checkoutType || "direct"}
                    onChange={(e) => updateField("basicInfo", "checkoutType", e.target.value)}
                    className="premium-select w-full pl-10"
                  >
                    <option value="direct">🔗 Direct Link (Website, Link Pembayaran, atau Link Custom)</option>
                    <option value="whatsapp">💬 WhatsApp Chat (Auto-generate chat sesuai paket pembelian)</option>
                    <option value="shopee">🛍️ Shopee (Halaman Produk atau Toko Shopee Anda)</option>
                  </select>
                </InputField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                  {(data.basicInfo.checkoutType === "direct" || !data.basicInfo.checkoutType) && (
                    <InputField label="URL Checkout Utama (Direct Website)" helper="Website eksternal / payment gateway Anda." icon={ExternalLink}>
                      <input 
                        type="text" 
                        value={data.basicInfo.checkoutUrl} 
                        onChange={(e) => updateField("basicInfo", "checkoutUrl", e.target.value)}
                        placeholder="https://checkout.yourproduct.com/buy"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  )}

                  {data.basicInfo.checkoutType === "whatsapp" && (
                    <InputField label="Nomor WhatsApp Utama" helper="Format: 628123456789 (Tanpa + atau spasi)." icon={Coffee}>
                      <input 
                        type="text" 
                        value={data.basicInfo.whatsappUrl} 
                        onChange={(e) => updateField("basicInfo", "whatsappUrl", e.target.value)}
                        placeholder="e.g. 628123456789"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  )}

                  {data.basicInfo.checkoutType === "shopee" && (
                    <InputField label="URL Toko / Produk Shopee" helper="Halaman link produk Shopee Anda." icon={Gift}>
                      <input 
                        type="text" 
                        value={data.basicInfo.shopeeUrl || ""} 
                        onChange={(e) => updateField("basicInfo", "shopeeUrl", e.target.value)}
                        placeholder="https://shopee.co.id/nama-produk-anda"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  )}

                  <InputField label="WhatsApp Bantuan (Hero Section)" helper="Tombol chat di sebelah CTA utama untuk konsultasi." icon={HelpCircle}>
                    <input 
                      type="text" 
                      value={data.basicInfo.whatsappUrl} 
                      onChange={(e) => updateField("basicInfo", "whatsappUrl", e.target.value)}
                      placeholder="e.g. https://wa.me/628123456789"
                      className="premium-input w-full pl-10"
                    />
                  </InputField>
                </div>
              </div>
            </div>
          )}

          {/* 2. Hero Section */}
          {activeTab === 1 && (
            <div className="space-y-5">
              <div className="glass-card p-4 flex items-center justify-between border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight font-sans">Enable Hero Section</h3>
                    <p className="text-[10px] text-zinc-400 font-medium">Show the opening header banner section.</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateField("hero", "enabled", !data.hero.enabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none cursor-pointer flex items-center ${data.hero.enabled ? 'bg-zinc-200' : 'bg-zinc-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-150 ${data.hero.enabled ? 'translate-x-4 bg-zinc-950' : 'translate-x-0 bg-zinc-500'}`} />
                </button>
              </div>

              {data.hero.enabled && (
                <div className="glass-card p-6 space-y-5 border-zinc-800/80">
                  <InputField label="Teks Badge Atas" helper="Label kecil di atas Headline utama." icon={Sparkles}>
                    <input 
                      type="text" 
                      value={data.hero.badgeText} 
                      onChange={(e) => updateField("hero", "badgeText", e.target.value)}
                      placeholder="e.g. 🔥 RILIS TERBARU - DISKON 50%"
                      className="premium-input w-full pl-10"
                    />
                  </InputField>

                  <InputField label="Headline Utama (Penawaran Utama)" helper="Gunakan teknik copywriting hook yang memikat." icon={Sparkles}>
                    <textarea 
                      value={data.hero.headline} 
                      onChange={(e) => updateField("hero", "headline", e.target.value)}
                      placeholder="Masukkan Headline utama yang memikat..."
                      rows={3}
                      className="premium-input w-full"
                    />
                  </InputField>

                  <InputField label="Sub-Headline" helper="Penjelasan ringkas pelengkap Headline." icon={Info}>
                    <textarea 
                      value={data.hero.subheadline} 
                      onChange={(e) => updateField("hero", "subheadline", e.target.value)}
                      placeholder="Jelaskan produk Anda lebih mendalam..."
                      rows={2}
                      className="premium-input w-full"
                    />
                  </InputField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Teks Tombol CTA" helper="Label di tombol beli utama." icon={Zap}>
                      <input 
                        type="text" 
                        value={data.hero.ctaText} 
                        onChange={(e) => updateField("hero", "ctaText", e.target.value)}
                        placeholder="e.g. Dapatkan Akses Sekarang"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                    <InputField label="Target Anchor Link CTA" helper="Tujuan scroll ketika tombol diklik." icon={Globe}>
                      <input 
                        type="text" 
                        value={data.hero.ctaUrl} 
                        onChange={(e) => updateField("hero", "ctaUrl", e.target.value)}
                        placeholder="e.g. #offers"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <h4 className="text-xs font-bold text-red-400 uppercase font-mono tracking-wider">Agitasi Masalah (Problem Setup)</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <InputField label="Judul Isu / Masalah" helper="Pertanyaan menggelitik yang memicu kesadaran audiens." icon={Award}>
                        <input 
                          type="text" 
                          value={data.hero.agitateTitle} 
                          onChange={(e) => updateField("hero", "agitateTitle", e.target.value)}
                          placeholder="e.g. Mengapa 95% Developer Gagal?"
                          className="premium-input w-full pl-10"
                        />
                      </InputField>
                      <InputField label="Deskripsi Penderitaan Masalah" helper="Bongkar rasa takut/kesulitan yang sering dihadapi target audiens." icon={Award}>
                        <textarea 
                          value={data.hero.agitateDescription} 
                          onChange={(e) => updateField("hero", "agitateDescription", e.target.value)}
                          placeholder="Jelaskan penderitaan pembeli jika tidak memakai produk ini..."
                          rows={2}
                          className="premium-input w-full"
                        />
                      </InputField>
                    </div>
                  </div>

                  <div className="pt-2">
                    <FileUploader 
                      label="Mockup Gambar Utama / Produk" 
                      onUpload={(base64) => updateField("hero", "mockupImage", base64)} 
                      currentImage={data.hero.mockupImage} 
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Benefits */}
          {activeTab === 2 && (
            <div className="space-y-5">
              <div className="glass-card p-4 flex items-center justify-between border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Aktifkan Section Benefits</h3>
                    <p className="text-[10px] text-zinc-500">Tampilkan keunggulan atau apa yang akan dipelajari.</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateField("benefits", "enabled", !data.benefits.enabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none cursor-pointer flex items-center ${data.benefits.enabled ? 'bg-zinc-200' : 'bg-zinc-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-150 ${data.benefits.enabled ? 'translate-x-4 bg-zinc-950' : 'translate-x-0 bg-zinc-500'}`} />
                </button>
              </div>

              {data.benefits.enabled && (
                <div className="glass-card p-6 space-y-6 border-zinc-800/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Headline Section" helper="Judul bagian penawaran manfaat." icon={CheckCircle}>
                      <input 
                        type="text" 
                        value={data.benefits.headline} 
                        onChange={(e) => updateField("benefits", "headline", e.target.value)}
                        placeholder="e.g. Apa Saja yang Akan Anda Pelajari?"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                    <InputField label="Teks Pengantar" helper="Sub-kalimat penjelas sebelum poin-poin." icon={Info}>
                      <input 
                        type="text" 
                        value={data.benefits.introText} 
                        onChange={(e) => updateField("benefits", "introText", e.target.value)}
                        placeholder="e.g. Kurikulum praktis yang disusun khusus..."
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-zinc-400 font-mono uppercase tracking-widest">Daftar Poin Benefit (Maksimal 3)</span>
                    </div>

                    <div className="space-y-4">
                      {data.benefits.items.map((item, idx) => (
                        <div key={item.id} className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 space-y-3 relative group">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                            <span className="text-[10px] font-mono font-bold text-indigo-400">BENEFIT #{idx + 1}</span>
                            {data.benefits.items.length > 1 && (
                              <button 
                                onClick={() => {
                                  const updatedItems = data.benefits.items.filter(it => it.id !== item.id);
                                  updateField("benefits", "items", updatedItems);
                                }}
                                className="text-red-500 hover:text-red-400 text-[10px] font-bold font-mono uppercase flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                              <InputField label="Judul Benefit" icon={Info}>
                                <input 
                                  type="text" 
                                  value={item.title} 
                                  onChange={(e) => {
                                    const updatedItems = [...data.benefits.items];
                                    updatedItems[idx].title = e.target.value;
                                    updateField("benefits", "items", updatedItems);
                                  }}
                                  className="premium-input w-full pl-10"
                                />
                              </InputField>
                            </div>
                            <div>
                              <InputField label="Pilih Icon">
                                <select 
                                  value={item.icon} 
                                  onChange={(e) => {
                                    const updatedItems = [...data.benefits.items];
                                    updatedItems[idx].icon = e.target.value;
                                    updateField("benefits", "items", updatedItems);
                                  }}
                                  className="premium-select w-full"
                                >
                                  {ICON_LIST.map((ic) => (
                                    <option key={ic.name} value={ic.name}>{ic.name}</option>
                                  ))}
                                </select>
                              </InputField>
                            </div>
                          </div>

                          <InputField label="Deskripsi Detail">
                            <textarea 
                              value={item.description} 
                              onChange={(e) => {
                                const updatedItems = [...data.benefits.items];
                                updatedItems[idx].description = e.target.value;
                                updateField("benefits", "items", updatedItems);
                              }}
                              rows={2}
                              className="premium-input w-full"
                            />
                          </InputField>
                        </div>
                      ))}
                    </div>

                    {data.benefits.items.length < 3 && (
                      <button 
                        onClick={() => {
                          const newBenefit = {
                            id: `b-${Date.now()}`,
                            title: "Benefit Baru",
                            description: "Ubah deskripsi poin benefit ini untuk menjelaskan nilai tambah dari produk Anda.",
                            icon: "CheckCircle"
                          };
                          updateField("benefits", "items", [...data.benefits.items, newBenefit]);
                        }}
                        className="w-full border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-900/10 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 cursor-pointer transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" /> Tambah Benefit Poin
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Product Bridge */}
          {activeTab === 3 && (
            <div className="space-y-5">
              <div className="glass-card p-4 flex items-center justify-between border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Aktifkan Section Product Bridge</h3>
                    <p className="text-[10px] text-zinc-500">Hubungkan masalah pembeli langsung ke solusi Anda.</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateField("productBridge", "enabled", !data.productBridge.enabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none cursor-pointer flex items-center ${data.productBridge.enabled ? 'bg-zinc-200' : 'bg-zinc-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-150 ${data.productBridge.enabled ? 'translate-x-4 bg-zinc-950' : 'translate-x-0 bg-zinc-500'}`} />
                </button>
              </div>

              {data.productBridge.enabled && (
                <div className="glass-card p-6 space-y-5 border-zinc-800/80">
                  <InputField label="Headline Section" helper="Judul presentasi produk digital." icon={Layers}>
                    <input 
                      type="text" 
                      value={data.productBridge.headline} 
                      onChange={(e) => updateField("productBridge", "headline", e.target.value)}
                      placeholder="e.g. Memperkenalkan SaaS Launch Blueprint"
                      className="premium-input w-full pl-10"
                    />
                  </InputField>

                  <div className="space-y-4 border-t border-zinc-900 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <h4 className="text-xs font-bold text-indigo-400 uppercase font-mono tracking-wider">Konsep Bridging 3 Langkah (Fitur -&gt; Manfaat -&gt; Arti Hidup)</h4>
                    </div>

                    <InputField label="1. Desain / Bentuk Fitur (What is it?)" helper="Gambarkan wujud produk." icon={Layers}>
                      <input 
                        type="text" 
                        value={data.productBridge.featureText} 
                        onChange={(e) => updateField("productBridge", "featureText", e.target.value)}
                        placeholder="e.g. Kurikulum komparatif dari puluhan modul digital..."
                        className="premium-input w-full pl-10"
                      />
                    </InputField>

                    <InputField label="2. Manfaat Fungsional (What does it do?)" helper="Gambarkan kegunaan langsung bagi pembeli." icon={TrendingUp}>
                      <input 
                        type="text" 
                        value={data.productBridge.benefitText} 
                        onChange={(e) => updateField("productBridge", "benefitText", e.target.value)}
                        placeholder="e.g. Membantu Anda merintis bisnis micro-SaaS tanpa bingung..."
                        className="premium-input w-full pl-10"
                      />
                    </InputField>

                    <InputField label="3. Arti Hidup / Dampak Emosional (Why care?)" helper="Gambarkan kebebasan emosional yang diraih." icon={Target}>
                      <input 
                        type="text" 
                        value={data.productBridge.meaningText} 
                        onChange={(e) => updateField("productBridge", "meaningText", e.target.value)}
                        placeholder="e.g. Artinya, Anda bisa berhenti mengandalkan klien freelance..."
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
                    <InputField label="Teks Button CTA" helper="Label pada tombol bridging." icon={Zap}>
                      <input 
                        type="text" 
                        value={data.productBridge.ctaText} 
                        onChange={(e) => updateField("productBridge", "ctaText", e.target.value)}
                        placeholder="e.g. Lihat Paket Pembelian"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                    <InputField label="Anchor URL CTA" helper="Tujuan scroll." icon={Globe}>
                      <input 
                        type="text" 
                        value={data.productBridge.ctaUrl} 
                        onChange={(e) => updateField("productBridge", "ctaUrl", e.target.value)}
                        placeholder="e.g. #offers"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  </div>

                  <div className="pt-2">
                    <FileUploader 
                      label="Gambar Mockup Bundel / Feature Bridge" 
                      onUpload={(base64) => updateField("productBridge", "mockupImage", base64)} 
                      currentImage={data.productBridge.mockupImage} 
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Bonus Section */}
          {activeTab === 4 && (
            <div className="space-y-5">
              <div className="glass-card p-4 flex items-center justify-between border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <Gift className="w-4 h-4 text-pink-400" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Aktifkan Section Bonus</h3>
                    <p className="text-[10px] text-zinc-500">Tambah hadiah eksklusif penambah nafsu beli pembeli.</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateField("bonuses", "enabled", !data.bonuses.enabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none cursor-pointer flex items-center ${data.bonuses.enabled ? 'bg-zinc-200' : 'bg-zinc-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-150 ${data.bonuses.enabled ? 'translate-x-4 bg-zinc-950' : 'translate-x-0 bg-zinc-500'}`} />
                </button>
              </div>

              {data.bonuses.enabled && (
                <div className="glass-card p-6 space-y-6 border-zinc-800/80">
                  <InputField label="Headline Section" helper="Judul penawaran bonus." icon={Gift}>
                    <input 
                      type="text" 
                      value={data.bonuses.headline} 
                      onChange={(e) => updateField("bonuses", "headline", e.target.value)}
                      placeholder="e.g. Bonus Eksklusif Jika Anda Membeli Hari Ini"
                      className="premium-input w-full pl-10"
                    />
                  </InputField>

                  <div className="pt-4 border-t border-zinc-900 space-y-4">
                    <span className="text-[11px] font-bold text-zinc-400 font-mono uppercase tracking-widest">Daftar Item Bonus</span>

                    <div className="space-y-4">
                      {data.bonuses.items.map((bonus, idx) => (
                        <div key={bonus.id} className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 space-y-4">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                            <span className="text-[10px] font-mono font-bold text-pink-400">BONUS #{idx + 1}</span>
                            <button 
                              onClick={() => {
                                const updatedItems = data.bonuses.items.filter(it => it.id !== bonus.id);
                                updateField("bonuses", "items", updatedItems);
                              }}
                              className="text-red-500 hover:text-red-400 text-[10px] font-bold font-mono uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InputField label="Nama Bonus" icon={Info}>
                              <input 
                                type="text" 
                                value={bonus.title} 
                                onChange={(e) => {
                                  const updated = [...data.bonuses.items];
                                  updated[idx].title = e.target.value;
                                  updateField("bonuses", "items", updated);
                                }}
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                            <InputField label="Estimasi Nilai (Harga Asli)" helper="e.g. Rp 499.000" icon={Target}>
                              <input 
                                type="text" 
                                value={bonus.originalPrice} 
                                onChange={(e) => {
                                  const updated = [...data.bonuses.items];
                                  updated[idx].originalPrice = e.target.value;
                                  updateField("bonuses", "items", updated);
                                }}
                                placeholder="e.g. Rp 499.000"
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                          </div>

                          <InputField label="Deskripsi Singkat">
                            <textarea 
                              value={bonus.description} 
                              onChange={(e) => {
                                const updated = [...data.bonuses.items];
                                updated[idx].description = e.target.value;
                                updateField("bonuses", "items", updated);
                              }}
                              rows={2}
                              className="premium-input w-full"
                            />
                          </InputField>

                          <FileUploader 
                            label="Gambar / Thumbnail Bonus" 
                            onUpload={(base64) => {
                              const updated = [...data.bonuses.items];
                              updated[idx].image = base64;
                              updateField("bonuses", "items", updated);
                            }} 
                            currentImage={bonus.image} 
                          />
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        const newBonus = {
                          id: `bn-${Date.now()}`,
                          title: "Bonus Spesial Baru",
                          originalPrice: "Rp 199.000",
                          description: "Ganti deskripsi bonus untuk melengkapi daya pikat dan urgensi konversi.",
                          image: ""
                        };
                        updateField("bonuses", "items", [...data.bonuses.items, newBonus]);
                      }}
                      className="w-full border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-900/10 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 cursor-pointer transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" /> Tambah Item Bonus
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. Testimonials */}
          {activeTab === 5 && (
            <div className="space-y-5">
              <div className="glass-card p-4 flex items-center justify-between border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Aktifkan Section Testimonial</h3>
                    <p className="text-[10px] text-zinc-500">Tampilkan ulasan nyata dari pembeli terdahulu.</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateField("testimonials", "enabled", !data.testimonials.enabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none cursor-pointer flex items-center ${data.testimonials.enabled ? 'bg-zinc-200' : 'bg-zinc-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-150 ${data.testimonials.enabled ? 'translate-x-4 bg-zinc-950' : 'translate-x-0 bg-zinc-500'}`} />
                </button>
              </div>

              {data.testimonials.enabled && (
                <div className="glass-card p-6 space-y-6 border-zinc-800/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Headline Section" helper="Judul section bukti sosial." icon={Star}>
                      <input 
                        type="text" 
                        value={data.testimonials.headline} 
                        onChange={(e) => updateField("testimonials", "headline", e.target.value)}
                        placeholder="e.g. Kisah Sukses Pembaca Kami"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                    <InputField label="Teks Pendukung" helper="Kalimat ajakan membaca testimoni." icon={Info}>
                      <input 
                        type="text" 
                        value={data.testimonials.supportingText} 
                        onChange={(e) => updateField("testimonials", "supportingText", e.target.value)}
                        placeholder="e.g. Berikut testimonial jujur dari pembaca..."
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 space-y-4">
                    <span className="text-[11px] font-bold text-zinc-400 font-mono uppercase tracking-widest">Daftar Testimonial</span>

                    <div className="space-y-4">
                      {data.testimonials.items.map((test, idx) => (
                        <div key={test.id} className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 space-y-4">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                            <span className="text-[10px] font-mono font-bold text-amber-500">TESTIMONIAL #{idx + 1}</span>
                            <button 
                              onClick={() => {
                                const updated = data.testimonials.items.filter(it => it.id !== test.id);
                                updateField("testimonials", "items", updated);
                              }}
                              className="text-red-500 hover:text-red-400 text-[10px] font-bold font-mono uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <InputField label="Nama Klien" icon={Info}>
                              <input 
                                type="text" 
                                value={test.name} 
                                onChange={(e) => {
                                  const updated = [...data.testimonials.items];
                                  updated[idx].name = e.target.value;
                                  updateField("testimonials", "items", updated);
                                }}
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                            <InputField label="Pekerjaan / Jabatan" icon={Info}>
                              <input 
                                type="text" 
                                value={test.role} 
                                onChange={(e) => {
                                  const updated = [...data.testimonials.items];
                                  updated[idx].role = e.target.value;
                                  updateField("testimonials", "items", updated);
                                }}
                                placeholder="e.g. Solo Founder"
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                            <InputField label="Rating Bintang">
                              <select 
                                value={test.rating} 
                                onChange={(e) => {
                                  const updated = [...data.testimonials.items];
                                  updated[idx].rating = parseInt(e.target.value);
                                  updateField("testimonials", "items", updated);
                                }}
                                className="premium-select w-full"
                              >
                                <option value={5}>⭐⭐⭐⭐⭐ 5 Bintang</option>
                                <option value={4}>⭐⭐⭐⭐ 4 Bintang</option>
                                <option value={3}>⭐⭐⭐ 3 Bintang</option>
                              </select>
                            </InputField>
                          </div>

                          <InputField label="Komentar / Kutipan Testimoni">
                            <textarea 
                              value={test.comment} 
                              onChange={(e) => {
                                const updated = [...data.testimonials.items];
                                updated[idx].comment = e.target.value;
                                updateField("testimonials", "items", updated);
                              }}
                              rows={2}
                              className="premium-input w-full"
                            />
                          </InputField>

                          <FileUploader 
                            label="Foto Avatar User (Opsional)" 
                            onUpload={(base64) => {
                              const updated = [...data.testimonials.items];
                              updated[idx].avatar = base64;
                              updateField("testimonials", "items", updated);
                            }} 
                            currentImage={test.avatar} 
                          />
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        const newTest = {
                          id: `t-${Date.now()}`,
                          name: "Klien Baru",
                          role: "SaaS Founder",
                          avatar: "",
                          comment: "Panduan ini sangat membantu saya melompati semua trial-and-error.",
                          rating: 5
                        };
                        updateField("testimonials", "items", [...data.testimonials.items, newTest]);
                      }}
                      className="w-full border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-900/10 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 cursor-pointer transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" /> Tambah Testimoni
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. Offers */}
          {activeTab === 6 && (
            <div className="space-y-5">
              <div className="glass-card p-4 flex items-center justify-between border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Aktifkan Section Pricing / Penawaran</h3>
                    <p className="text-[10px] text-zinc-500">Buat paket harga terstruktur untuk konversi maksimal.</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateField("offers", "enabled", !data.offers.enabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none cursor-pointer flex items-center ${data.offers.enabled ? 'bg-zinc-200' : 'bg-zinc-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-150 ${data.offers.enabled ? 'translate-x-4 bg-zinc-950' : 'translate-x-0 bg-zinc-500'}`} />
                </button>
              </div>

              {data.offers.enabled && (
                <div className="glass-card p-6 space-y-6 border-zinc-800/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Headline Section" helper="Judul utama tabel harga." icon={Zap}>
                      <input 
                        type="text" 
                        value={data.offers.headline} 
                        onChange={(e) => updateField("offers", "headline", e.target.value)}
                        placeholder="e.g. Investasi Terbaik untuk Anda"
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                    <InputField label="Sub-Headline Section" helper="Keterangan pendukung urgensi harga." icon={Info}>
                      <input 
                        type="text" 
                        value={data.offers.subheadline} 
                        onChange={(e) => updateField("offers", "subheadline", e.target.value)}
                        placeholder="e.g. Pilih paket pembelajaran yang sesuai..."
                        className="premium-input w-full pl-10"
                      />
                    </InputField>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 space-y-4">
                    <span className="text-[11px] font-bold text-zinc-400 font-mono uppercase tracking-widest">Daftar Paket Pembelian</span>

                    <div className="space-y-5">
                      {data.offers.items.map((offer, idx) => (
                        <div key={offer.id} className="bg-zinc-950/50 p-5 rounded-xl border border-zinc-900 space-y-4">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                            <span className="text-[10px] font-mono font-bold text-cyan-400">PAKET PENAWARAN #{idx + 1}</span>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={offer.popular} 
                                  onChange={(e) => {
                                    const updated = [...data.offers.items];
                                    updated.forEach((item, index) => {
                                      item.popular = index === idx ? e.target.checked : false;
                                    });
                                    updateField("offers", "items", updated);
                                  }}
                                  className="rounded bg-zinc-950 border-zinc-800 text-indigo-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-zinc-300 font-mono uppercase tracking-wider">POPULER</span>
                              </label>
                              <button 
                                onClick={() => {
                                  const updated = data.offers.items.filter(it => it.id !== offer.id);
                                  updateField("offers", "items", updated);
                                }}
                                className="text-red-500 hover:text-red-400 text-[10px] font-bold font-mono uppercase flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <InputField label="Nama Paket" icon={Info}>
                              <input 
                                type="text" 
                                value={offer.name} 
                                onChange={(e) => {
                                  const updated = [...data.offers.items];
                                  updated[idx].name = e.target.value;
                                  updateField("offers", "items", updated);
                                }}
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                            <InputField label="Harga Promo (Aktif)" helper="Format bebas, e.g. Rp 299k" icon={Zap}>
                              <input 
                                type="text" 
                                value={offer.price} 
                                onChange={(e) => {
                                  const updated = [...data.offers.items];
                                  updated[idx].price = e.target.value;
                                  updateField("offers", "items", updated);
                                }}
                                placeholder="e.g. Rp 299.000"
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                            <InputField label="Harga Asli (Coret)" helper="Harga sebelum promo" icon={Target}>
                              <input 
                                type="text" 
                                value={offer.originalPrice} 
                                onChange={(e) => {
                                  const updated = [...data.offers.items];
                                  updated[idx].originalPrice = e.target.value;
                                  updateField("offers", "items", updated);
                                }}
                                placeholder="e.g. Rp 599.000"
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                          </div>

                          <InputField label="Deskripsi Pendek Paket" helper="Satu kalimat penggugah minat." icon={Info}>
                            <input 
                              type="text" 
                              value={offer.description} 
                              onChange={(e) => {
                                const updated = [...data.offers.items];
                                updated[idx].description = e.target.value;
                                updateField("offers", "items", updated);
                              }}
                              placeholder="Sangat cocok untuk pemula..."
                              className="premium-input w-full pl-10"
                            />
                          </InputField>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-900/40">
                            <InputField label="Saluran Checkout Khusus Paket" helper="Gunakan link checkout kustom jika ada.">
                              <select 
                                value={offer.checkoutType || "global"} 
                                onChange={(e) => {
                                  const updated = [...data.offers.items];
                                  updated[idx].checkoutType = e.target.value as any;
                                  updateField("offers", "items", updated);
                                }}
                                className="premium-select w-full"
                              >
                                <option value="global">🌐 Ikuti Setelan Global ({data.basicInfo.checkoutType || "direct"})</option>
                                <option value="direct">🔗 Custom Direct Link / E-commerce</option>
                                <option value="whatsapp">💬 Custom WhatsApp Chat</option>
                                <option value="shopee">🛍️ Custom Shopee Link</option>
                              </select>
                            </InputField>

                            <InputField label="Teks Button Paket" helper="e.g. Pilih Paket Gold">
                              <input 
                                type="text" 
                                value={offer.ctaText} 
                                onChange={(e) => {
                                  const updated = [...data.offers.items];
                                  updated[idx].ctaText = e.target.value;
                                  updateField("offers", "items", updated);
                                }}
                                placeholder="e.g. Beli Paket Founder"
                                className="premium-input w-full"
                              />
                            </InputField>
                          </div>

                          {(offer.checkoutType && offer.checkoutType !== "global") && (
                            <InputField 
                              label={
                                offer.checkoutType === "direct" ? "Custom URL Checkout (Direct Link)" :
                                offer.checkoutType === "whatsapp" ? "Nomor WhatsApp Khusus Paket ini (Format: 628xxx)" :
                                "URL Produk Shopee Khusus Paket ini"
                              }
                              icon={ExternalLink}
                            >
                              <input 
                                type="text" 
                                value={offer.customUrl || ""} 
                                onChange={(e) => {
                                  const updated = [...data.offers.items];
                                  updated[idx].customUrl = e.target.value;
                                  updateField("offers", "items", updated);
                                }}
                                placeholder={
                                  offer.checkoutType === "direct" ? "https://checkout.link.com" :
                                  offer.checkoutType === "whatsapp" ? "e.g. 628123456789 atau kosong" :
                                  "https://shopee.co.id/..."
                                }
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                          )}

                          {(!offer.checkoutType || offer.checkoutType === "global") && (
                            <InputField label="Default URL Fallback Paket" icon={ExternalLink}>
                              <input 
                                type="text" 
                                value={offer.ctaUrl} 
                                onChange={(e) => {
                                  const updated = [...data.offers.items];
                                  updated[idx].ctaUrl = e.target.value;
                                  updateField("offers", "items", updated);
                                }}
                                placeholder="https://..."
                                className="premium-input w-full pl-10"
                              />
                            </InputField>
                          )}

                          <InputField label="Fitur / Checklist Paket (Pisahkan dengan koma)" helper="Poin-poin spesifikasi yang didapatkan.">
                            <textarea 
                              value={offer.features.join(", ")} 
                              onChange={(e) => {
                                const updated = [...data.offers.items];
                                updated[idx].features = e.target.value.split(",").map(f => f.trim()).filter(Boolean);
                                updateField("offers", "items", updated);
                              }}
                              rows={2}
                              placeholder="Benefit 1, Benefit 2, Benefit 3"
                              className="premium-input w-full"
                            />
                          </InputField>
                        </div>
                      ))}
                    </div>

                    {data.offers.items.length < 3 && (
                      <button 
                        onClick={() => {
                          const newOffer = {
                            id: `o-${Date.now()}`,
                            name: "Paket Baru",
                            price: "Rp 199.000",
                            originalPrice: "Rp 399.000",
                            description: "Paket pembelajar dasar.",
                            features: ["Materi Inti", "Akses Komunitas"],
                            ctaText: "Beli Paket Ini",
                            ctaUrl: "#",
                            popular: false
                          };
                          updateField("offers", "items", [...data.offers.items, newOffer]);
                        }}
                        className="w-full border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-900/10 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 cursor-pointer transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" /> Tambah Paket Baru
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 8. Objections / FAQ */}
          {activeTab === 7 && (
            <div className="space-y-5">
              <div className="glass-card p-4 flex items-center justify-between border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-orange-400" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Aktifkan Section FAQ</h3>
                    <p className="text-[10px] text-zinc-500">Jawab keraguan calon pembeli secara langsung.</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateField("objections", "enabled", !data.objections.enabled)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none cursor-pointer flex items-center ${data.objections.enabled ? 'bg-zinc-200' : 'bg-zinc-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-150 ${data.objections.enabled ? 'translate-x-4 bg-zinc-950' : 'translate-x-0 bg-zinc-500'}`} />
                </button>
              </div>

              {data.objections.enabled && (
                <div className="glass-card p-6 space-y-6 border-zinc-800/80">
                  <InputField label="Headline Section" helper="Judul utama FAQ." icon={HelpCircle}>
                    <input 
                      type="text" 
                      value={data.objections.headline} 
                      onChange={(e) => updateField("objections", "headline", e.target.value)}
                      placeholder="e.g. Pertanyaan yang Sering Diajukan"
                      className="premium-input w-full pl-10"
                    />
                  </InputField>

                  <div className="pt-4 border-t border-zinc-900 space-y-4">
                    <span className="text-[11px] font-bold text-zinc-400 font-mono uppercase tracking-widest">Daftar Tanya Jawab (Accordion FAQ)</span>

                    <div className="space-y-4">
                      {data.objections.items.map((faq, idx) => (
                        <div key={faq.id} className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-900 space-y-3">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                            <span className="text-[10px] font-mono font-bold text-orange-400">PERTANYAAN #{idx + 1}</span>
                            <button 
                              onClick={() => {
                                const updated = data.objections.items.filter(it => it.id !== faq.id);
                                updateField("objections", "items", updated);
                              }}
                              className="text-red-500 hover:text-red-400 text-[10px] font-bold font-mono uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>

                          <InputField label="Pertanyaan" helper="Kebingungan atau objection umum calon pembeli." icon={HelpIcon}>
                            <input 
                              type="text" 
                              value={faq.question} 
                              onChange={(e) => {
                                const updated = [...data.objections.items];
                                updated[idx].question = e.target.value;
                                updateField("objections", "items", updated);
                              }}
                              placeholder="e.g. Apakah ada jaminan refund?"
                              className="premium-input w-full pl-10"
                            />
                          </InputField>

                          <InputField label="Jawaban Singkat, Tegas, & Menenangkan">
                            <textarea 
                              value={faq.answer} 
                              onChange={(e) => {
                                const updated = [...data.objections.items];
                                updated[idx].answer = e.target.value;
                                updateField("objections", "items", updated);
                              }}
                              rows={2}
                              placeholder="Tentu saja, kami memberikan jaminan 14 hari..."
                              className="premium-input w-full"
                            />
                          </InputField>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        const newFaq = {
                          id: `q-${Date.now()}`,
                          question: "Apakah materi ini langsung bisa saya akses?",
                          answer: "Ya, betul sekali. Begitu konfirmasi transaksi terverifikasi, detail login akan langsung terkirim otomatis."
                        };
                        updateField("objections", "items", [...data.objections.items, newFaq]);
                      }}
                      className="w-full border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 hover:bg-zinc-900/10 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 cursor-pointer transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" /> Tambah FAQ
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9. Theme / Styles */}
          {activeTab === 8 && (
            <div className="space-y-5">
              <div className="glass-card p-6 space-y-6 border-zinc-800/80">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Template & Preset Desain</h4>
                  <p className="text-[10px] text-zinc-500">Pilih palet warna bawaan yang sangat serasi.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATE_PRESETS.map((preset) => (
                    <button 
                      key={preset.id}
                      onClick={() => {
                        onChange({
                          ...data,
                          project: {
                            ...data.project,
                            template: preset.id as any
                          },
                          brand: {
                            ...data.brand,
                            ...preset.brand
                          }
                        });
                      }}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between hover:border-indigo-500 transition-all duration-300 cursor-pointer ${data.project.template === preset.id ? 'border-indigo-600 bg-indigo-600/10 active-ring-glow' : 'border-zinc-800 bg-zinc-950/40'}`}
                    >
                      <span className="text-xs font-bold text-white block mb-2">{preset.name}</span>
                      <div className="flex gap-1.5">
                        <span className="w-4.5 h-4.5 rounded-md shadow-sm border border-black/20" style={{ backgroundColor: preset.brand.primaryColor }} title="Primary" />
                        <span className="w-4.5 h-4.5 rounded-md shadow-sm border border-black/20" style={{ backgroundColor: preset.brand.secondaryColor }} title="Secondary" />
                        <span className="w-4.5 h-4.5 rounded-md shadow-sm border border-zinc-800" style={{ backgroundColor: preset.brand.backgroundColor }} title="Background" />
                        <span className="w-4.5 h-4.5 rounded-md shadow-sm border border-black/20" style={{ backgroundColor: preset.brand.textColor }} title="Text" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-zinc-900 pt-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider">Kustom Font & Warna Brand</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Font Judul (Heading)" icon={Palette}>
                      <select 
                        value={data.brand.fontHeading} 
                        onChange={(e) => updateField("brand", "fontHeading", e.target.value)}
                        className="premium-select w-full"
                      >
                        {FONT_PRESETS.map((font) => (
                          <option key={font.name} value={font.name}>{font.name}</option>
                        ))}
                      </select>
                    </InputField>
                    <InputField label="Font Konten (Body)" icon={Palette}>
                      <select 
                        value={data.brand.fontBody} 
                        onChange={(e) => updateField("brand", "fontBody", e.target.value)}
                        className="premium-select w-full"
                      >
                        {FONT_PRESETS.map((font) => (
                          <option key={font.name} value={font.name}>{font.name}</option>
                        ))}
                      </select>
                    </InputField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <InputField label="Warna Utama (Primary)">
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0 cursor-pointer">
                          <input 
                            type="color" 
                            value={data.brand.primaryColor} 
                            onChange={(e) => updateField("brand", "primaryColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-6 h-6 rounded-md" style={{ backgroundColor: data.brand.primaryColor }} />
                        </div>
                        <input 
                          type="text" 
                          value={data.brand.primaryColor} 
                          onChange={(e) => updateField("brand", "primaryColor", e.target.value)}
                          placeholder="#4f46e5"
                          className="premium-input flex-1 font-mono uppercase"
                        />
                      </div>
                    </InputField>

                    <InputField label="Warna Sekunder (Secondary)">
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0 cursor-pointer">
                          <input 
                            type="color" 
                            value={data.brand.secondaryColor} 
                            onChange={(e) => updateField("brand", "secondaryColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-6 h-6 rounded-md" style={{ backgroundColor: data.brand.secondaryColor }} />
                        </div>
                        <input 
                          type="text" 
                          value={data.brand.secondaryColor} 
                          onChange={(e) => updateField("brand", "secondaryColor", e.target.value)}
                          placeholder="#06b6d4"
                          className="premium-input flex-1 font-mono uppercase"
                        />
                      </div>
                    </InputField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Warna Canvas (Background)">
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0 cursor-pointer">
                          <input 
                            type="color" 
                            value={data.brand.backgroundColor} 
                            onChange={(e) => updateField("brand", "backgroundColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-6 h-6 rounded-md" style={{ backgroundColor: data.brand.backgroundColor }} />
                        </div>
                        <input 
                          type="text" 
                          value={data.brand.backgroundColor} 
                          onChange={(e) => updateField("brand", "backgroundColor", e.target.value)}
                          placeholder="#ffffff"
                          className="premium-input flex-1 font-mono uppercase"
                        />
                      </div>
                    </InputField>

                    <InputField label="Warna Teks (Typography)">
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center shrink-0 cursor-pointer">
                          <input 
                            type="color" 
                            value={data.brand.textColor} 
                            onChange={(e) => updateField("brand", "textColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="w-6 h-6 rounded-md" style={{ backgroundColor: data.brand.textColor }} />
                        </div>
                        <input 
                          type="text" 
                          value={data.brand.textColor} 
                          onChange={(e) => updateField("brand", "textColor", e.target.value)}
                          placeholder="#1e293b"
                          className="premium-input flex-1 font-mono uppercase"
                        />
                      </div>
                    </InputField>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. Section Ordering */}
          {activeTab === 9 && (
            <div className="space-y-5">
              <div className="glass-card p-6 space-y-5 border-zinc-800/80">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Urutan Section Landing Page</h4>
                    <p className="text-[11px] text-zinc-500">Sesuaikan struktur story flow landing page Anda dengan menggeser letak section.</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {data.sectionOrder.map((sectionId, idx) => {
                    const label = getSectionLabel(sectionId);
                    return (
                      <div key={sectionId} className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex items-center justify-between gap-4 transition-all duration-200 hover:border-zinc-700">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] bg-zinc-850 text-zinc-400 rounded font-bold font-mono px-2 py-1 border border-zinc-800">{idx + 1}</span>
                          <span className="text-xs font-bold text-zinc-200">{label}</span>
                        </div>
                        
                        <div className="flex gap-1.5">
                          <button 
                            disabled={idx === 0}
                            onClick={() => moveSection(idx, "up")}
                            className="p-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 rounded-lg cursor-pointer transition-colors"
                            title="Geser Atas"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            disabled={idx === data.sectionOrder.length - 1}
                            onClick={() => moveSection(idx, "down")}
                            className="p-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 rounded-lg cursor-pointer transition-colors"
                            title="Geser Bawah"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
