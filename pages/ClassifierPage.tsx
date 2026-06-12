import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, 
  Loader2, 
  Download, 
  FileJson, 
  Save, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Share2,
  Code,
  Palette,
  Megaphone,
  Plus,
  X,
  Edit2,
  Check,
  BrainCircuit,
  FileDown
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { classifyExpertise } from '../services/geminiService';
import { mockBackend } from '../lib/mock-backend';
import { ExpertiseClassification, User } from '../types';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';

const EXAMPLES = [
  {
    role: 'Software Engineer',
    icon: Code,
    text: "I am a senior full-stack software engineer with 10 years of experience building high-performance web applications in React, TypeScript, and Node.js. I specialize in cloud-native microservices architecture, serverless APIs, web performance optimization, and mentoring engineering teams. I am highly devoted to clean code principles and developer tooling."
  },
  {
    role: 'Brand Designer',
    icon: Palette,
    text: "I am a senior brand designer and illustrator dedicated to shaping modern visual identities. With over 8 years in the creative industry, I design minimalist graphic systems, UI/UX layouts, and editorial typography for rising technology startups. My design philosophy bridges elegant aesthetic principles with human-centered product usability."
  },
  {
    role: 'Growth Marketer',
    icon: Megaphone,
    text: "I am a growth marketing manager with a stellar track record in scaling early-stage SaaS platforms. I specialize in SEO keyword strategy, high-yield search engine marketing (SEM) campaigns, product-led growth (PLG) mechanics, and marketing attribution analytics. I focus on driving customer acquisition through data-driven experiments."
  }
];

const ClassifierPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user] = useState<User | null>(mockBackend.getCurrentUser());
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExpertiseClassification | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Tag editing support states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newTagValue, setNewTagValue] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleClassify = async () => {
    if (!inputText.trim()) {
      toast.error(i18n.language === 'id' ? "Silakan isi teks untuk dianalisis." : "Please enter some text to analyze.");
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setIsSaved(false);
    setEditingIndex(null);
    setIsAddingTag(false);

    try {
      const classification = await classifyExpertise(inputText);
      setResult(classification);
      toast.success(i18n.language === 'id' ? "Analisis brand berhasil diselesaikan!" : "Analysis complete!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to analyze brand.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (user && result) {
      mockBackend.saveHistory(user.id, inputText, result);
      setIsSaved(true);
      
      // Dispatch event to refresh live statistics on home panel
      window.dispatchEvent(new Event('subscription_change'));
      toast.success(t('success_save'));
    }
  };

  // ADD TAG
  const handleAddTag = () => {
    if (!result) return;
    if (!newTagValue.trim()) {
      setIsAddingTag(false);
      return;
    }

    if (result.expertiseAreas.includes(newTagValue.trim())) {
      toast.error(i18n.language === 'id' ? "Spesialisasi ini sudah ada." : "This expertise already exists.");
      return;
    }

    const updatedAreas = [...result.expertiseAreas, newTagValue.trim()];
    setResult({
      ...result,
      expertiseAreas: updatedAreas
    });
    setNewTagValue('');
    setIsAddingTag(false);
    setIsSaved(false); // Reset saved indicator so they can save modification
    
    toast.success(
      i18n.language === 'id' 
        ? `Berhasil menambahkan spesialisasi: "${newTagValue.trim()}"` 
        : `Added expertise: "${newTagValue.trim()}"`
    );
  };

  // DELETE TAG
  const handleDeleteTag = (indexToDelete: number) => {
    if (!result) return;
    const removedTag = result.expertiseAreas[indexToDelete];
    const updatedAreas = result.expertiseAreas.filter((_, idx) => idx !== indexToDelete);
    
    setResult({
      ...result,
      expertiseAreas: updatedAreas
    });
    setIsSaved(false); // Reset saved status to trigger save reminder
    
    toast.success(
      i18n.language === 'id' 
        ? `Spesialisasi "${removedTag}" berhasil dihapus` 
        : `Removed expertise "${removedTag}"`
    );
  };

  // EDIT TAG
  const startEditingTag = (index: number) => {
    if (!result) return;
    setEditingIndex(index);
    setEditingValue(result.expertiseAreas[index]);
  };

  const saveEditedTag = (indexToEdit: number) => {
    if (!result) return;
    if (!editingValue.trim()) {
      handleDeleteTag(indexToEdit);
      setEditingIndex(null);
      return;
    }

    const oldTag = result.expertiseAreas[indexToEdit];
    const updatedAreas = [...result.expertiseAreas];
    updatedAreas[indexToEdit] = editingValue.trim();

    setResult({
      ...result,
      expertiseAreas: updatedAreas
    });
    setEditingIndex(null);
    setIsSaved(false);

    toast.success(
      i18n.language === 'id' 
        ? `Mengubah "${oldTag}" menjadi "${editingValue.trim()}"` 
        : `Updated "${oldTag}" to "${editingValue.trim()}"`
    );
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("BrandVision AI: Personal Brand Profile", 25, 25);
    
    doc.setFontSize(14);
    doc.text("AI Summary:", 25, 45);
    doc.setFontSize(11);
    const splitSummary = doc.splitTextToSize(result.summary, 160);
    doc.text(splitSummary, 25, 53);

    doc.setFontSize(14);
    doc.text("Classified Expertise Areas:", 25, 90);
    doc.setFontSize(11);
    result.expertiseAreas.forEach((area, i) => {
      doc.text(`• ${area}`, 25, 100 + (i * 9));
    });

    doc.save(`brand-profile-${Date.now()}.pdf`);
    toast.success(i18n.language === 'id' ? "PDF Berhasil diunduh!" : "PDF exported successfully!");
  };

  const exportExcel = () => {
    if (!result) return;
    const data = [
      { Kategori: "Brand Summary", Nilai: result.summary },
      ...result.expertiseAreas.map((area, i) => ({ Kategori: `Area Keahlian ${i+1}`, Nilai: area }))
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Keahlian Brand");
    XLSX.writeFile(wb, `brand-profile-${Date.now()}.xlsx`);
    toast.success(i18n.language === 'id' ? "Berkas Excel berhasil diekspor!" : "Excel exported successfully!");
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `Brand Summary: ${result.summary}\nExpertise Areas: ${result.expertiseAreas.join(', ')}`;
    navigator.clipboard.writeText(text);
    toast.success(i18n.language === 'id' ? "Teks disalin ke papan klip!" : "Copied description summary!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Intro Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3.5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
          {i18n.language === 'id' ? "Klasifikasi Spesialisasi AI" : t('classify')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto font-medium">
          {i18n.language === 'id' 
            ? "Tempel bio profesional, keterampilan, atau pengalaman Anda untuk mengekstrak personal branding cerdas."
            : "Paste your professional bio, skills, or experience to generate your real-time AI brand profile."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isProcessing && !result && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-left">
                <CardTitle className="flex items-center gap-2 text-md font-bold text-slate-800 dark:text-white">
                  <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  <span>{i18n.language === 'id' ? "Masukan Rincian Profil" : "Input Professional Profile"}</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {i18n.language === 'id' 
                    ? "Semakin rinci masukan teks Anda, semakin akurat hasil analisis model klasifikasi."
                    : "The more details you provide, the more precise the classification mapping will be."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <Textarea 
                  placeholder={t('input_placeholder')}
                  className="min-h-[220px] text-base leading-relaxed resize-none border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 bg-transparent transition-colors shadow-inner"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                
                <div className="pt-2 space-y-3 text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    {i18n.language === 'id' ? "Butuh Inspirasi? Pilih Profil Contoh:" : "Need Inspiration? Click a Profile Demo:"}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {EXAMPLES.map((eg, idx) => {
                      const IconComponent = eg.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputText(eg.text);
                            toast.success(
                              i18n.language === 'id' 
                                ? `Menggunakan profil contoh: ${eg.role}` 
                                : `Populated details with template `
                            );
                          }}
                          type="button"
                          className="flex flex-col items-start text-left p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-indigo-500/40 dark:hover:border-indigo-500/30 hover:shadow-sm transition-all duration-300 group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-extrabold text-xs text-slate-700 dark:text-slate-350">{eg.role}</span>
                          </div>
                          <p className="text-[11px] text-slate-450 dark:text-slate-400 line-clamp-3 leading-relaxed">
                            {eg.text}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 dark:bg-slate-955/20 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center p-4">
                <div className="text-xs font-mono font-bold text-slate-400">
                  {inputText.length} characters
                </div>
                <Button 
                  onClick={handleClassify} 
                  disabled={!inputText.trim()}
                  className="gap-2 px-8 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>{i18n.language === 'id' ? "Mulai Klasifikasi" : t('classify')}</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* PROCESSING LOADER AND COGNITIVE MESSAGE LOOPS */}
        {isProcessing && (
          <motion.div
            key="processing-loader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl min-h-[350px] shadow-sm text-center"
          >
            <div className="relative flex items-center justify-center w-20 h-20 mb-6 shrink-0">
              <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-indigo-600/10 opacity-75"></span>
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950 rounded-2xl border border-indigo-150 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
            </div>
            
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
              {i18n.language === 'id' ? "Model AI Menganalisis Profil..." : "Processing Custom AI Profiler..."}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-2 animate-pulse">
              {i18n.language === 'id' ? "Mengonfigurasi data spesialisasi brand..." : "MAPPING SYNAPSE HIGHLIGHTS..."}
            </p>
          </motion.div>
        )}

        {/* RESULTS SCREEN - WITH EDITABLE TAG SYSTEM */}
        {result && !isProcessing && (
          <motion.div
            key="results-dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden text-left">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <Badge className="bg-indigo-600 text-white font-extrabold text-[9px] hover:bg-indigo-600 rounded-full py-0.5 px-2.5">
                    NEURAL CLASSIFIER COMPLETE
                  </Badge>
                  
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="icon" onClick={copyToClipboard} className="w-8 h-8 rounded-lg border-slate-200 text-slate-500">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white mt-4">
                  {i18n.language === 'id' ? "Hasil Klasifikasi Brand" : t('results')}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                
                {/* Brand Summary Box */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {i18n.language === 'id' ? "Ringkasan Profil Brand" : t('brand_summary')}
                  </h4>
                  <p className="text-base md:text-lg font-medium leading-relaxed italic text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950/60 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                    "{result.summary}"
                  </p>
                </div>

                {/* Editable tags segment */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {i18n.language === 'id' ? "Keahlian Spesifik Diklasifikasi" : t('expertise_areas')}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      {i18n.language === 'id' ? "*Klik ganda pada keahlian untuk mengedit" : "*Double click tag to edit value"}
                    </span>
                  </div>

                  {/* Tags Pillbox */}
                  <div className="flex flex-wrap gap-2.5 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    {result.expertiseAreas.map((area, idx) => {
                      const isEditing = editingIndex === idx;
                      return (
                        <div key={idx} className="relative group inline-flex">
                          {isEditing ? (
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                saveEditedTag(idx);
                              }}
                              className="flex items-center gap-1 bg-white dark:bg-slate-900 border-indigo-550 border rounded-xl px-2 py-1 shadow-sm"
                            >
                              <input 
                                type="text"
                                className="text-xs font-bold bg-transparent border-none outline-none text-slate-800 dark:text-white w-28 h-5 focus:ring-0 focus:outline-none"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                autoFocus
                              />
                              <button type="submit" className="text-emerald-500 hover:text-emerald-600 shrink-0">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          ) : (
                            <Badge 
                              variant="outline" 
                              className="px-3.5 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-xs gap-1.5 pl-3 group-hover:border-indigo-400/40 group-hover:shadow-xs transition duration-150"
                            >
                              <span 
                                onDoubleClick={() => startEditingTag(idx)}
                                className="cursor-pointer select-none"
                                title="Double Click to Edit"
                              >
                                {area}
                              </span>
                              
                              <button 
                                onClick={() => startEditingTag(idx)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-500 transition duration-100 shrink-0"
                              >
                                <Edit2 className="w-2.5 h-2.5" />
                              </button>

                              <button 
                                onClick={() => handleDeleteTag(idx)}
                                className="text-slate-400 hover:text-red-500 transition duration-100 shrink-0 pl-0.5 border-l border-slate-100 dark:border-slate-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )}
                        </div>
                      );
                    })}

                    {/* Simple tag additions form wrapper */}
                    {isAddingTag ? (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddTag();
                        }}
                        className="flex items-center gap-1 bg-white dark:bg-slate-900 border-indigo-500 border rounded-xl px-2 py-1 shadow-sm"
                      >
                        <input 
                          type="text"
                          placeholder={i18n.language === 'id' ? "Tambah Keahlian" : "Add custom..."}
                          className="text-xs font-bold bg-transparent border-none outline-none text-slate-805 dark:text-white w-28 h-5 focus:ring-0 focus:outline-none"
                          value={newTagValue}
                          onChange={(e) => setNewTagValue(e.target.value)}
                          onBlur={handleAddTag}
                          autoFocus
                        />
                        <button type="submit" className="text-indigo-500">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <Button 
                        variant="dashed" 
                        size="sm" 
                        onClick={() => setIsAddingTag(true)}
                        className="rounded-xl px-3 py-1.5 h-8 font-bold text-xs gap-1 cursor-pointer border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-450 dark:border-slate-800 dark:hover:border-indigo-900 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{i18n.language === 'id' ? "Tambah Spesialisasi" : "Add Area"}</span>
                      </Button>
                    )}
                  </div>
                </div>

              </CardContent>
              
              <CardFooter className="flex flex-wrap gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 pt-5 pb-5">
                <Button variant="outline" className="gap-1.5 h-10 px-4 rounded-xl border-slate-200 cursor-pointer font-bold text-xs" onClick={exportPDF}>
                  <FileDown className="w-4 h-4 text-slate-500" />
                  <span>{t('export_pdf')}</span>
                </Button>
                <Button variant="outline" className="gap-1.5 h-10 px-4 rounded-xl border-slate-200 cursor-pointer font-bold text-xs" onClick={exportExcel}>
                  <FileJson className="w-4 h-4 text-slate-500" />
                  <span>{t('export_excel')}</span>
                </Button>
                
                <Button 
                  className={cn(
                    "gap-1.5 h-10 px-6 rounded-xl font-bold text-xs cursor-pointer ml-auto",
                    isSaved ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border border-emerald-200/50" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  )} 
                  onClick={handleSave}
                  disabled={isSaved}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{i18n.language === 'id' ? "Tersimpan" : "Saved"}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-indigo-200" />
                      <span>{t('save_history')}</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <div className="flex justify-center">
              <Button variant="ghost" className="gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-650 cursor-pointer font-bold text-xs" onClick={() => {
                setResult(null);
                setInputText('');
                setIsSaved(false);
              }}>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{i18n.language === 'id' ? "Mulai Ulang Analisis" : "Start Over"}</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide Tips Boxes */}
      {!result && !isProcessing && (
        <div className="grid md:grid-cols-3 gap-5 text-left">
          <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs">
            <CardContent className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-indigo-505" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-slate-850 dark:text-slate-205 mb-1">{i18n.language === 'id' ? "Tips: Lebih Spesifik" : "Tip: Be Specific"}</p>
                <p className="text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">{i18n.language === 'id' ? "Masukkan alat khusus, metodologi kerja, dan kontribusi nyata." : "Include specific tools, methodologies, and achievements for better results."}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs">
            <CardContent className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-indigo-505" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-slate-850 dark:text-slate-205 mb-1">{i18n.language === 'id' ? "Tips: Kata Kunci Industri" : "Tip: Use Keywords"}</p>
                <p className="text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">{i18n.language === 'id' ? "Mesin AI kami melacak jargon keahlian standar global." : "The AI looks for industry-standard keywords to categorize your expertise."}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs">
            <CardContent className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-indigo-505" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-slate-850 dark:text-slate-205 mb-1">{i18n.language === 'id' ? "Tips: Tulis Secara Alami" : "Tip: Keep it Real"}</p>
                <p className="text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">{i18n.language === 'id' ? "Bio otentik deskriptif menghasilkan pemetaan emosi yang pas." : "Authentic bios generate more compelling and accurate brand summaries."}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClassifierPage;
