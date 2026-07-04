import React, { useState, useEffect } from "react";
import { LandingPageData } from "./types";
import { DEFAULT_PROJECT_DATA, TEMPLATE_PRESETS } from "./data";
import { EditorTabs } from "./components/EditorTabs";
import { LandingPagePreview } from "./components/LandingPagePreview";
import { generateHTML } from "./components/HtmlExporter";
import JSZip from "jszip";
import { 
  Sparkles, Plus, Copy, Trash2, Edit3, Save, Download, 
  Upload, Eye, Monitor, Smartphone, Maximize2, Minimize2, 
  ChevronRight, RefreshCw, FileCode, CheckCircle2, AlertCircle,
  Globe, ExternalLink, ChevronsUpDown, CheckCircle, Info, Layers, 
  Gift, Star, Zap, HelpCircle, Settings, Menu, Clipboard, Palette,
  ZoomIn, ZoomOut, ChevronDown, MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY = "landingpage_generator_projects";
const ACTIVE_ID_KEY = "landingpage_generator_active_id";

export default function App() {
  const [projects, setProjects] = useState<LandingPageData[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>("");
  const [activeEditorTab, setActiveEditorTab] = useState<number>(0);
  
  // Interface/viewport configurations
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [fullscreenMode, setFullscreenMode] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview" | "projects">("editor");
  const [importError, setImportError] = useState<string>("");
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [tempProjectName, setTempProjectName] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving">("saved");
  const [zoom, setZoom] = useState<number>(100);
  
  // Custom dropdown states
  const [projectDropdownOpen, setProjectDropdownOpen] = useState<boolean>(false);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState<boolean>(false);

  // Publishing states
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishedUrl, setPublishedUrl] = useState<string>("");
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  // Grouped Steps list configurations
  const stepsList = [
    // Phase 1: Foundation
    { label: "Basic Info", icon: Info, index: 0, phase: "01 FOUNDATION", desc: "Produk & model checkout" },
    { label: "Styles & Design", icon: Palette, index: 8, phase: "01 FOUNDATION", desc: "Tipografi & warna brand" },
    { label: "Section Manager", icon: Settings, index: 9, phase: "01 FOUNDATION", desc: "Urutan visual landing page" },
    
    // Phase 2: Copywriting Core
    { label: "Hero & Problem", icon: Sparkles, index: 1, phase: "02 COPYWRITING CORE", desc: "Headline & agitate masalah" },
    { label: "Core Benefits", icon: CheckCircle, index: 2, phase: "02 COPYWRITING CORE", desc: "3 pilar penawaran Anda" },
    { label: "Product Bridge", icon: Layers, index: 3, phase: "02 COPYWRITING CORE", desc: "Fitur ke emosional buyer" },
    
    // Phase 3: Conversions
    { label: "Bonus Section", icon: Gift, index: 4, phase: "03 CONVERSIONS", desc: "Urgensi bonus penunjang" },
    { label: "Testimonials", icon: Star, index: 5, phase: "03 CONVERSIONS", desc: "Ulasan nyata sosial proof" },
    { label: "Offer & Pricing", icon: Zap, index: 6, phase: "03 CONVERSIONS", desc: "Tabel paket pembelian" },
    { label: "Objections & FAQ", icon: HelpCircle, index: 7, phase: "03 CONVERSIONS", desc: "Penangkal keraguan pembeli" }
  ];

  // Load projects on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const activeId = localStorage.getItem(ACTIVE_ID_KEY);
    
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as LandingPageData[];
        if (parsed.length > 0) {
          setProjects(parsed);
          const found = parsed.find(p => p.project.id === activeId);
          setActiveProjectId(found ? found.project.id : parsed[0].project.id);
          return;
        }
      } catch (e) {
        console.error("Failed to parse stored projects", e);
      }
    }

    // fallback initialize with default template
    const initialProject = { ...DEFAULT_PROJECT_DATA };
    setProjects([initialProject]);
    setActiveProjectId(initialProject.project.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([initialProject]));
    localStorage.setItem(ACTIVE_ID_KEY, initialProject.project.id);
  }, []);

  // Sync / Auto-save
  const activeProject = projects.find(p => p.project.id === activeProjectId) || projects[0];

  // Synchronize generated HTML to backend server dynamically
  const syncLiveHtml = async (projectData: LandingPageData) => {
    if (!projectData) return;
    try {
      const html = generateHTML(projectData);
      await fetch("/api/live-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectData.project.id, html })
      });
    } catch (err) {
      console.warn("Real-time preview sync failed:", err);
    }
  };

  // Sync to backend /live on project change or on mount
  useEffect(() => {
    if (activeProject) {
      syncLiveHtml(activeProject);
    }
  }, [activeProjectId, activeProject]);

  const handleProjectChange = (updatedProject: LandingPageData) => {
    setAutoSaveStatus("saving");
    const updatedList = projects.map(p => 
      p.project.id === updatedProject.project.id ? {
        ...updatedProject,
        project: { ...updatedProject.project, updatedAt: new Date().toISOString() }
      } : p
    );
    setProjects(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    
    // Sync live html immediately
    syncLiveHtml(updatedProject);

    setTimeout(() => {
      setAutoSaveStatus("saved");
    }, 400);
  };

  // Create new project
  const createNewProject = () => {
    const newId = `project-${Date.now()}`;
    const newProj: LandingPageData = {
      ...DEFAULT_PROJECT_DATA,
      project: {
        id: newId,
        name: "Landing Page Baru",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        template: "modern"
      }
    };
    const updatedList = [newProj, ...projects];
    setProjects(updatedList);
    setActiveProjectId(newId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    localStorage.setItem(ACTIVE_ID_KEY, newId);
    setActiveEditorTab(0);
    setProjectDropdownOpen(false);
  };

  // Duplicate project
  const duplicateProject = (p: LandingPageData) => {
    const newId = `project-${Date.now()}`;
    const dupProj: LandingPageData = {
      ...JSON.parse(JSON.stringify(p)),
      project: {
        id: newId,
        name: `${p.project.name} - Salinan`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        template: p.project.template
      }
    };
    const updatedList = [dupProj, ...projects];
    setProjects(updatedList);
    setActiveProjectId(newId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    localStorage.setItem(ACTIVE_ID_KEY, newId);
  };

  // Delete project
  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (projects.length <= 1) {
      alert("Anda harus menyisakan minimal satu project!");
      return;
    }
    if (confirm("Apakah Anda yakin ingin menghapus project ini secara permanen?")) {
      const filtered = projects.filter(p => p.project.id !== id);
      setProjects(filtered);
      if (activeProjectId === id) {
        const nextActive = filtered[0].project.id;
        setActiveProjectId(nextActive);
        localStorage.setItem(ACTIVE_ID_KEY, nextActive);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  };

  // Rename Project
  const saveRename = (id: string) => {
    if (!tempProjectName.trim()) return;
    const updatedList = projects.map(p => 
      p.project.id === id ? {
        ...p,
        project: { ...p.project, name: tempProjectName.trim(), updatedAt: new Date().toISOString() }
      } : p
    );
    setProjects(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    setRenamingProjectId(null);
  };

  // Export Data JSON
  const downloadJSONData = () => {
    if (!activeProject) return;
    const blob = new Blob([JSON.stringify(activeProject, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProject.project.name.replace(/ /g, "_")}_config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON configuration
  const handleJSONImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.project && parsed.brand && parsed.basicInfo && parsed.hero) {
          // Valid landing page data schema
          const newId = `project-${Date.now()}`;
          const importedProj: LandingPageData = {
            ...parsed,
            project: {
              ...parsed.project,
              id: newId,
              name: parsed.project.name + " (Imported)",
              updatedAt: new Date().toISOString()
            }
          };
          const updatedList = [importedProj, ...projects];
          setProjects(updatedList);
          setActiveProjectId(newId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
          localStorage.setItem(ACTIVE_ID_KEY, newId);
          alert("Konfigurasi landing page berhasil diimport!");
        } else {
          setImportError("Skema JSON tidak valid. Pastikan file adalah hasil export LandingPage Generator.");
        }
      } catch (err) {
        setImportError("Gagal membaca file JSON. Pastikan format file benar.");
      }
    };
    reader.readAsText(file);
  };

  // Download Landing Page HTML
  const downloadHtmlPage = () => {
    if (!activeProject) return;
    const htmlString = generateHTML(activeProject);
    const blob = new Blob([htmlString], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `index.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download complete project folder as ZIP
  const downloadFolderZip = async () => {
    if (!activeProject) return;
    try {
      const zip = new JSZip();
      
      // 1. Generate index.html content
      const htmlString = generateHTML(activeProject);
      zip.file("index.html", htmlString);
      
      // 2. Generate config.json content
      const configJson = JSON.stringify(activeProject, null, 2);
      zip.file("config.json", configJson);
      
      // 3. Create README.txt
      const readmeText = `===========================================================
LANDING PAGE PROJECT FOLDER: ${activeProject.project.name}
===========================================================

Folder ini berisi file-file website Landing Page Anda yang siap pakai dan dipublikasikan.

Isi Folder:
1. index.html - File utama website Anda. Semua desain, konten, gambar (Base64), dan script telah dibundel secara self-contained (mandiri). Cukup klik dua kali file ini untuk membukanya di browser!
2. config.json - File backup konfigurasi. Anda dapat meng-import file ini kembali ke LandingPage Generator jika ingin melakukan perubahan di masa depan.

Cara Menggunakan / Mempublikasikan:
-----------------------------------------------------------
A. Membuka Secara Lokal (Offline):
   Cukup ekstarak file ZIP ini, lalu klik dua kali file "index.html" untuk melihat hasilnya di browser Anda.

B. Upload ke Hosting Gratis (Netlify / Vercel):
   1. Ekstrak ZIP ini ke komputer Anda.
   2. Buka https://app.netlify.com/drop (Netlify Drop) atau https://vercel.com.
   3. Tarik dan lepaskan (Drag & Drop) folder hasil ekstrak yang berisi "index.html" tersebut.
   4. Website Anda langsung online secara instan dan gratis dengan domain kustom!

C. Upload ke cPanel / Hosting Pribadi:
   1. Masuk ke cPanel atau File Manager hosting Anda.
   2. Masuk ke direktori public_html (atau subdomain Anda).
   3. Upload file "index.html" ini ke direktori tersebut.

Dibuat dengan LandingPage Creator. Hak Cipta Dilindungi.
===========================================================`;
      
      zip.file("README.txt", readmeText);
      
      // Generate ZIP blob
      const content = await zip.generateAsync({ type: "blob" });
      
      // Trigger download
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeProject.project.name.replace(/[^a-zA-Z0-9]/g, "_")}_landingpage_project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mendownload folder ZIP:", err);
      alert("Gagal membuat download folder project. Silakan coba kembali.");
    }
  };

  // Publish / Host project online
  const publishProject = async () => {
    if (!activeProject) return;
    setIsPublishing(true);
    try {
      const html = generateHTML(activeProject);
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: activeProject.project.id, html })
      });
      const result = await response.json();
      if (result.success) {
        const absoluteUrl = window.location.origin + result.path;
        setPublishedUrl(absoluteUrl);
        setShowPublishModal(true);
      } else {
        alert("Gagal mempublikasikan landing page: " + (result.error || "Terjadi kesalahan"));
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghubungi server untuk mempublikasikan landing page.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset form to default
  const resetForm = () => {
    if (confirm("Apakah Anda yakin ingin mereset konten form project ini ke default template? Semua isi perubahan Anda saat ini akan ditimpa.")) {
      handleProjectChange({
        ...DEFAULT_PROJECT_DATA,
        project: {
          ...activeProject.project,
          updatedAt: new Date().toISOString()
        }
      });
      setActiveEditorTab(0);
    }
  };

  // Get type icon helper for project switcher
  const getCategoryEmoji = (type: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("ebook") || t.includes("buku")) return "📘";
    if (t.includes("video") || t.includes("course") || t.includes("kelas")) return "🎥";
    if (t.includes("schedule") || t.includes("time") || t.includes("konsul")) return "⏱️";
    if (t.includes("saas") || t.includes("software") || t.includes("aplikasi")) return "⚡";
    return "📦";
  };

  const getActiveTabLabel = () => {
    const stepObj = stepsList.find(s => s.index === activeEditorTab);
    return stepObj ? stepObj.label : "Form Editor";
  };

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-zinc-500">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
          <p className="text-sm font-mono tracking-wider uppercase">Memasang Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans select-none antialiased relative">
      
      {/* 1. TOP STUDIO NAVIGATION HEADER */}
      <header className="h-14 shrink-0 border-b border-zinc-800 bg-[#09090b] px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          {/* Logo brand & system designation */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
              <span className="text-xs">⚡</span>
            </div>
            <div>
              <span className="text-xs font-semibold tracking-tight text-zinc-100 font-sans block">L-Page Studio</span>
              <span className="text-[9px] block text-zinc-500 font-mono">Workspace Canvas</span>
            </div>
          </div>

          <span className="text-zinc-850 text-sm font-light hidden lg:inline">/</span>

          {/* Active Workspace Selector - Dropdown Trigger */}
          <div className="relative">
            <button 
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className={`text-left px-2.5 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-2 border cursor-pointer ${projectDropdownOpen ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
            >
              <div className="min-w-0">
                <span className="text-xs font-medium text-zinc-200 block truncate max-w-[150px]">{activeProject.project.name}</span>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            </button>
            
            <AnimatePresence>
              {projectDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProjectDropdownOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 4, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.99 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-60 bg-[#09090b] border border-zinc-800 rounded-lg p-2 shadow-xl z-40 space-y-1"
                  >
                    <div className="flex items-center justify-between px-1.5 pb-2 border-b border-zinc-800">
                      <span className="text-[9px] font-medium text-zinc-500 tracking-wider">Your Landing Pages ({projects.length})</span>
                      <button 
                        onClick={createNewProject}
                        className="py-1 px-2 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center gap-1 text-[10px] font-medium cursor-pointer transition-all"
                      >
                        <Plus className="w-3 h-3" /> New
                      </button>
                    </div>

                    <div className="space-y-0.5 max-h-60 overflow-y-auto premium-scroll pr-1">
                      {projects.map((p) => {
                        const isActive = p.project.id === activeProjectId;
                        const isRenaming = renamingProjectId === p.project.id;

                        return (
                          <div 
                            key={p.project.id}
                            onClick={() => {
                              if (!isRenaming) {
                                setActiveProjectId(p.project.id);
                                localStorage.setItem(ACTIVE_ID_KEY, p.project.id);
                                setProjectDropdownOpen(false);
                              }
                            }}
                            className={`p-2 rounded-md text-left cursor-pointer transition-colors duration-150 relative group/item flex items-center justify-between gap-2.5 ${isActive ? 'bg-zinc-900 text-white border border-zinc-800' : 'hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'}`}
                          >
                            {isRenaming ? (
                              <div className="flex gap-1.5 items-center w-full" onClick={e => e.stopPropagation()}>
                                <input 
                                  type="text" 
                                  value={tempProjectName} 
                                  onChange={(e) => setTempProjectName(e.target.value)}
                                  className="w-full bg-zinc-950 border border-zinc-850 text-[11px] text-white rounded px-2.5 py-1 focus:border-zinc-700 focus:outline-none"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveRename(p.project.id);
                                  }}
                                />
                                <button 
                                  onClick={() => saveRename(p.project.id)}
                                  className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded cursor-pointer transition-colors shrink-0"
                                >
                                  <Save className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="min-w-0">
                                  <span className="text-[11px] font-medium block truncate leading-tight">{p.project.name}</span>
                                  <span className="text-[9px] text-zinc-500 block truncate mt-0.5">{getCategoryEmoji(p.basicInfo.productType)} {p.basicInfo.productType || "Landing Page"}</span>
                                </div>
                                <div className="opacity-0 group-hover/item:opacity-100 flex gap-1 transition-opacity shrink-0" onClick={e => e.stopPropagation()}>
                                  <button 
                                    onClick={() => {
                                      setRenamingProjectId(p.project.id);
                                      setTempProjectName(p.project.name);
                                    }}
                                    className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
                                    title="Rename"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={() => duplicateProject(p)}
                                    className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
                                    title="Duplicate"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  <button 
                                    onClick={(e) => deleteProject(p.project.id, e)}
                                    className="p-1 hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sync Indicator with Pulsing Node */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <span className="relative flex h-1.5 w-1.5">
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${autoSaveStatus === "saved" ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {autoSaveStatus === "saved" ? "Stage Synced" : "Saving..."}
          </span>
        </div>

        {/* Global Primary CTA Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setActionsDropdownOpen(!actionsDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg border border-zinc-800 font-medium text-xs transition-all cursor-pointer"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4 text-zinc-400" />
              <span>Utilities</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            
            <AnimatePresence>
              {actionsDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-45" onClick={() => setActionsDropdownOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 4, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.99 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 bg-[#09090b] border border-zinc-800 rounded-lg p-1.5 shadow-xl z-50 space-y-0.5"
                  >
                    <a 
                      href="/live" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2.5 py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md font-medium text-xs transition-colors cursor-pointer"
                      onClick={() => setActionsDropdownOpen(false)}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Open Live Site</span>
                    </a>

                    <button 
                      onClick={() => {
                        downloadFolderZip();
                        setActionsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md font-medium text-xs transition-colors text-left cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Download ZIP</span>
                    </button>

                    <button 
                      onClick={() => {
                        publishProject();
                        setActionsDropdownOpen(false);
                      }}
                      disabled={isPublishing}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-md font-medium text-xs transition-colors text-left disabled:opacity-50 cursor-pointer"
                    >
                      <Globe className={`w-3.5 h-3.5 text-zinc-500 ${isPublishing ? "animate-spin" : ""}`} />
                      <span>{isPublishing ? "Publishing..." : "Go Live"}</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setFullscreenMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg border border-zinc-800 font-medium text-xs transition-all cursor-pointer"
            title="Preview Landing Page in Fullscreen"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>Preview</span>
          </button>

          <button 
            onClick={downloadHtmlPage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg font-semibold text-xs transition-all cursor-pointer border border-zinc-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Code</span>
          </button>
        </div>
      </header>

      {/* 2. RESPONSIVE SUB-BAR FOR MOBILE COMPASS */}
      <div className="lg:hidden h-11 border-b border-zinc-800 bg-[#09090b] grid grid-cols-3 text-center sticky top-14 z-20">
        <button 
          onClick={() => setMobileTab("projects")}
          className={`text-[10px] font-semibold tracking-wider focus:outline-none transition-all ${mobileTab === "projects" ? 'text-zinc-100 border-b border-zinc-100 bg-zinc-900/50' : 'text-zinc-500'}`}
        >
          Workspaces
        </button>
        <button 
          onClick={() => setMobileTab("editor")}
          className={`text-[10px] font-semibold tracking-wider focus:outline-none transition-all ${mobileTab === "editor" ? 'text-zinc-100 border-b border-zinc-100 bg-zinc-900/50' : 'text-zinc-500'}`}
        >
          Control Deck
        </button>
        <button 
          onClick={() => setMobileTab("preview")}
          className={`text-[10px] font-semibold tracking-wider focus:outline-none transition-all ${mobileTab === "preview" ? 'text-zinc-100 border-b border-zinc-100 bg-zinc-900/50' : 'text-zinc-500'}`}
        >
          Visual Canvas
        </button>
      </div>

      {/* 3. ASYMMETRIC STUDIO WORKSPACE LAYOUT */}
      <main className="flex-1 overflow-hidden flex relative z-10">
        
        {/* MOBILE WORKSPACE DRAWER PANEL */}
        {mobileTab === "projects" && (
          <div className="lg:hidden w-full bg-[#09090b] p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xs font-semibold text-zinc-400 tracking-tight">Active Workspace Inventory</h3>
              <div className="space-y-2">
                {projects.map((p) => (
                  <div 
                    key={p.project.id} 
                    onClick={() => {
                      setActiveProjectId(p.project.id);
                      setMobileTab("editor");
                    }}
                    className={`p-4 rounded-lg cursor-pointer border ${p.project.id === activeProjectId ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-zinc-950 border-zinc-900 text-zinc-400'}`}
                  >
                    <span className="font-semibold text-xs block">{p.project.name}</span>
                    <span className="text-[10px] text-zinc-500 mt-1 block">{p.basicInfo.productType || "Landing Page"}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-850 mt-6">
              <button 
                onClick={createNewProject}
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Landing Page</span>
              </button>
            </div>
          </div>
        )}

        {/* LEFT COMPONENT: THE FIGMA-LIKE INFINITE GRID CANVAS STAGE */}
        <div className={`flex-1 relative overflow-hidden bg-[#0c0c0e] bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:20px_20px] flex flex-col items-center justify-center p-6 lg:p-12 ${mobileTab === "preview" ? 'flex w-full' : 'hidden lg:flex'}`}>

          {/* FLOATING STAGE CONTROLLER POD */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-zinc-950 border border-zinc-800 p-1 rounded-lg flex items-center gap-3 shadow-xl">
            
            {/* Zoom Widget */}
            <div className="bg-zinc-900 px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-zinc-800">
              <button 
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span 
                onClick={() => setZoom(100)}
                className="text-[10px] font-mono text-zinc-400 cursor-pointer hover:text-white px-1.5 transition-colors"
                title="Reset Zoom to 100%"
              >
                {zoom}%
              </span>
              <button 
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Device Mode Widget */}
            <div className="bg-zinc-900 p-0.5 border border-zinc-800 rounded-md flex gap-0.5">
              <button 
                onClick={() => setViewMode("desktop")} 
                className={`p-1.5 px-3 rounded transition-all text-xs focus:outline-none cursor-pointer flex items-center gap-1.5 ${viewMode === "desktop" ? 'bg-zinc-800 text-white font-medium border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Desktop Layout Simulator"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium">Desktop</span>
              </button>
              <button 
                onClick={() => setViewMode("mobile")} 
                className={`p-1.5 px-3 rounded transition-all text-xs focus:outline-none cursor-pointer flex items-center gap-1.5 ${viewMode === "mobile" ? 'bg-zinc-800 text-white font-medium border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Mobile Phone Simulator"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium">Mobile</span>
              </button>
            </div>

            {/* Expand Fullscreen Button */}
            <button 
              onClick={() => setFullscreenMode(true)}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-md border border-zinc-800 transition-all cursor-pointer"
              title="Expand Canvas to Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* THE DEVICE PREVIEW SIMULATOR FRAME */}
          <div className="relative z-10 w-full flex flex-col justify-start max-h-[82vh] max-w-5xl transition-all duration-300">
            {/* Minimalist Window Frame Header */}
            <div className="shrink-0 w-full bg-zinc-950 border-t border-x border-zinc-800 rounded-t-lg px-4 py-2 flex items-center justify-between gap-4">
              {/* Dots */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
                <span className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
              
              {/* Secure connection URL bar */}
              <div className="flex-1 max-w-xs bg-zinc-900 border border-zinc-800 rounded px-3 py-0.5 text-center text-[10px] text-zinc-400 truncate flex items-center justify-center gap-1.5">
                <Globe className="w-3 h-3 text-zinc-500 shrink-0" />
                <span className="font-normal tracking-tight text-zinc-300">{activeProject.project.name.toLowerCase().replace(/\s+/g, "-")}.com</span>
              </div>

              {/* Status Spec Indicator */}
              <span className="text-[9px] font-mono text-zinc-600 shrink-0">
                {viewMode === "desktop" ? "1280px Desktop" : "375px Mobile"}
              </span>
            </div>

            {/* Frame Sandbox Body */}
            <div className="relative w-full bg-[#09090b] border-b border-x border-zinc-800 rounded-b-lg overflow-y-auto premium-scroll flex justify-center items-start min-h-[420px] p-4 lg:p-6">
              <div 
                className="transition-transform duration-200 origin-top w-full"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  maxWidth: viewMode === "mobile" ? "375px" : "100%"
                }}
              >
                <LandingPagePreview 
                  data={activeProject}
                  viewMode={viewMode}
                />
              </div>
            </div>
          </div>

          {/* Stage helper metadata */}
          <p className="absolute bottom-4 left-6 text-[9px] font-mono text-zinc-600 tracking-tight">
            ⚡ Zoom: {zoom}% &bull; Scroll within container to explore
          </p>
        </div>

        {/* RIGHT COMPONENT: THE MODULIZED CREATOR CONTROL DECK */}
        <div className={`w-[450px] shrink-0 border-l border-zinc-800 bg-[#09090b] flex flex-col z-10 ${mobileTab === "editor" ? 'flex w-full' : 'hidden lg:flex'}`}>
          
          {/* CONTROL DECK HEADER */}
          <div className="p-4 border-b border-zinc-800 bg-[#09090b] shrink-0">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Control Deck</span>
              <h2 className="text-sm font-semibold text-zinc-100 tracking-tight mt-0.5">{getActiveTabLabel()}</h2>
            </div>
          </div>

          {/* DUAL WORKSPACE PANEL: VERTICAL STEP RIBBON + FORM CONTAINER */}
          <div className="flex-1 overflow-hidden flex">
            
            {/* STEP NAVIGATION VERTICAL RIBBON (56px width) */}
            <div className="w-14 shrink-0 border-r border-zinc-900 bg-[#09090b] py-4 flex flex-col items-center justify-between overflow-y-auto premium-scroll">
              <div className="flex flex-col items-center gap-2.5 w-full">
                {stepsList.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = activeEditorTab === step.index;

                  const isCompleted = (() => {
                    if (step.index === 0) return !!activeProject.basicInfo.productName;
                    if (step.index === 1) return activeProject.hero.enabled;
                    if (step.index === 2) return activeProject.benefits.enabled;
                    if (step.index === 3) return activeProject.productBridge.enabled;
                    if (step.index === 4) return activeProject.bonuses.enabled;
                    if (step.index === 5) return activeProject.testimonials.enabled;
                    if (step.index === 6) return activeProject.offers.enabled;
                    if (step.index === 7) return activeProject.objections.enabled;
                    return true;
                  })();

                  return (
                    <button
                      key={step.index}
                      onClick={() => setActiveEditorTab(step.index)}
                      className={`relative w-9 h-9 rounded-md flex items-center justify-center transition-all duration-150 group shrink-0 focus:outline-none cursor-pointer ${isActive ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
                      title={`${step.label} - ${step.desc}`}
                    >
                      <StepIcon className="w-4 h-4" />

                      {/* Tooltip on hover */}
                      <div className="absolute right-full mr-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0 bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 shadow-xl z-50 w-40 text-left">
                        <span className="text-xs font-semibold text-zinc-100 block leading-normal">{step.label}</span>
                        <span className="text-[10px] text-zinc-500 block leading-normal mt-0.5">{step.desc}</span>
                      </div>

                      {/* Completed indicator node */}
                      {isCompleted && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Quick Info button at the base of the ribbon */}
              <div className="text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer mt-4" title="Workspace Tips">
                <Info className="w-4 h-4" />
              </div>
            </div>

            {/* THE SPACIOUS ACTIVE FORM VIEWPORT (386px width) */}
            <div className="flex-1 overflow-y-auto premium-scroll p-6 space-y-6 bg-[#09090b]/30">
              
              {/* Help tip card mapping active tab */}
              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider">Objective</span>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  {stepsList.find(s => s.index === activeEditorTab)?.desc || "Configure this section to construct your custom page content."}
                </p>
              </div>

              {/* Render editor tabs component */}
              <div className="bg-transparent p-0">
                <EditorTabs 
                  data={activeProject} 
                  onChange={handleProjectChange} 
                  activeTab={activeEditorTab}
                  setActiveTab={setActiveEditorTab}
                />
              </div>

            </div>

          </div>

          {/* CONTROL DECK UTILITIES DRAWER (RESET, BACKUP, RESTORE) */}
          <div className="p-4 border-t border-zinc-800 bg-[#09090b] shrink-0 space-y-3">
            
            {/* Quick reset actions */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-zinc-500 font-mono tracking-wider">Recovery</span>
              <button 
                onClick={resetForm}
                className="text-xs text-zinc-500 hover:text-rose-400 transition-all flex items-center gap-1 cursor-pointer"
                title="Reset all content in active workspace to templates defaults"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                <span>Reset Active State</span>
              </button>
            </div>

            {/* Backup / Restore controls */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={downloadJSONData}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs rounded-lg transition-all cursor-pointer"
                title="Backup full configurations as .json file"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Backup JSON</span>
              </button>
              
              <label className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs rounded-lg cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                <span>Restore JSON</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleJSONImport}
                  className="hidden" 
                />
              </label>
            </div>

            {importError && (
              <div className="text-xs text-red-400 bg-red-950/20 p-3 rounded-lg border border-red-900/30 flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* 4. FULLSCREEN PREVIEW CANVAS STAGE EXPERIMENT OVERLAY */}
      <AnimatePresence>
        {fullscreenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#09090b] z-50 flex flex-col"
          >
            {/* Dark glass control bar */}
            <div className="h-14 shrink-0 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Immersive Stage</span>
                <span className="text-zinc-800 font-light">|</span>
                <span className="text-xs text-zinc-100 font-medium">{activeProject.project.name}</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Mode Selector inside fullscreen */}
                <div className="bg-zinc-900 p-0.5 border border-zinc-800 rounded-md flex gap-0.5">
                  <button 
                    onClick={() => setViewMode("desktop")} 
                    className={`p-1 px-3 rounded text-[10px] font-medium uppercase transition-all focus:outline-none cursor-pointer ${viewMode === "desktop" ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Desktop
                  </button>
                  <button 
                    onClick={() => setViewMode("mobile")} 
                    className={`p-1 px-3 rounded text-[10px] font-medium uppercase transition-all focus:outline-none cursor-pointer ${viewMode === "mobile" ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Mobile
                  </button>
                </div>

                <button 
                  onClick={() => setFullscreenMode(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 font-medium text-xs transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Exit Immersive Stage</span>
                </button>
              </div>
            </div>

            {/* Immersive Sandbox Screen */}
            <div className="flex-1 overflow-y-auto premium-scroll p-8 bg-[#0c0c0e] bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:24px_24px] flex justify-center items-start relative">
              <div className="w-full max-w-5xl shadow-2xl border border-zinc-800 rounded-lg overflow-hidden mt-4 bg-zinc-950">
                <LandingPagePreview 
                  data={activeProject}
                  viewMode={viewMode}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. PUBLISHED SUCCESS MODAL PANEL */}
      <AnimatePresence>
        {showPublishModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0b0b14] border border-white/[0.08] rounded-3xl p-6 lg:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              {/* Background gradient decorative flares */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-12 h-12 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base lg:text-lg font-extrabold text-white tracking-tight uppercase">
                    Landing Page Is Now Online!
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Congratulations! Your landing page is fully published and ready to maximize conversions worldwide.
                  </p>
                </div>

                {/* Published Link Capsule */}
                <div className="w-full bg-[#05050b] border border-white/[0.05] rounded-2xl p-3.5 flex items-center justify-between gap-3 mt-1 shadow-inner">
                  <input 
                    type="text" 
                    readOnly 
                    value={publishedUrl}
                    className="bg-transparent border-none text-[11px] text-emerald-400 font-mono focus:outline-none flex-1 truncate select-all"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(publishedUrl);
                      alert("Link successfully copied to clipboard!");
                    }}
                    className="px-3.5 py-2 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 rounded-xl font-bold text-[10px] border border-white/[0.04] cursor-pointer transition-colors flex items-center gap-1 shrink-0 bouncy-hover"
                  >
                    <Clipboard className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy</span>
                  </button>
                </div>

                {/* Action controls */}
                <div className="flex w-full gap-3 pt-2">
                  <a 
                    href={publishedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all bouncy-hover cursor-pointer border border-white/[0.08]"
                  >
                    <span>Launch Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button 
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1 py-3 px-4 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 font-bold text-xs rounded-xl border border-white/[0.04] transition-colors cursor-pointer bouncy-hover"
                  >
                    Close
                  </button>
                </div>

                {/* Marketing & Promotion tips list */}
                <div className="w-full text-left bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 space-y-2 mt-1">
                  <h4 className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider font-mono">🚀 Dynamic Marketing Recommendations:</h4>
                  <ul className="space-y-1.5 text-[10px] text-zinc-500 list-disc list-inside font-medium leading-relaxed">
                    <li>Share this link in your <strong>Instagram Bio, TikTok, or WhatsApp Business</strong>.</li>
                    <li>Utilize this clean page directly in your <strong>Meta (Facebook) or Google Ads campaigns</strong>.</li>
                    <li>Send it directly to prospective customers during chats for direct, high-trust closing.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

