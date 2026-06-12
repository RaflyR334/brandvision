import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe,
  BarChart3,
  Users,
  MessageSquare,
  AlertTriangle,
  XCircle,
  Lightbulb,
  TrendingUp,
  Star,
  Sun,
  Moon,
  Camera,
  Hash,
  AtSign,
  Music,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  Menu,
  X,
  Target,
  Languages
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockBackend } from '../lib/mock-backend';
import { toast } from 'sonner';

// Bilingual translations map since our landing page needs full EN/ID content
const LOCAL_CONTENT = {
  en: {
    hero: {
      badge: "Powered by Contech",
      title: "Define Your Signature Professional Identity",
      subtitle: "Stop blending in. Let BrandVision AI extract your elite expertise, generate stunning brand summaries, and craft a compelling profile in seconds.",
      ctaStart: "Get Started Free",
      ctaDemo: "Try Interactive Demo",
    },
    nav: {
      problems: "Problems & Solutions",
      demo: "Interactive Demo",
      testimonials: "Testimonials",
      pricing: "Pricing",
      dashboard: "Dashboard",
    },
    problemsSection: {
      tag: "The Challenge",
      title: "The Friction in Modern Personal Branding",
      subtitle: "Standing out is harder than ever. Professionals face key obstacles that block their career growth and authority status.",
      problems: [
        {
          title: "Articulating Your Value is Hard",
          description: "Struggling to summarize years of multi-disciplinary work into a clean, concise value proposition."
        },
        {
          title: "Generics Cause Invisible Profiles",
          description: "Using standard buzzwords (like 'passionate team player' or 'motivated innovator') makes you blend into the noise."
        },
        {
          title: "Time-Consuming Manual CV Writing",
          description: "Spending exhausting hours drafting biographies for LinkedIn, portfolios, speaking gigs, or business RFPs."
        }
      ],
      solutions: [
        {
          title: "Autonomous Expertise Extraction",
          description: "Our advanced AI models analyze your experience and raw bios to pinpoint core authority domains with stellar accuracy."
        },
        {
          title: "High-Impact Summary Generation",
          description: "Receive copy-ready summaries written in polished, high-converting marketing language specialized for professionals."
        },
        {
          title: "Instant Professional PDF Exports",
          description: "Download beautifully styled PDF profiles or resume insights to send immediately to prospective clients or employers."
        }
      ]
    },
    demoSection: {
      title: "See How It Works In Real Time",
      subtitle: "Click the simulation play button to watch BrandVision AI parse a raw biography and map premium authority tags in seconds.",
      playLabel: "Play Live Simulation",
      resetLabel: "Reset",
      statusIdle: "Simulator Idle. Press Play.",
      statusTyping: "Entering professional bio...",
      statusAnalyzing: "Analyzing with Gemini deep modeling...",
      statusFinished: "Success! Authority Profile crafted.",
      sampleInput: "Hi, I am Alex Rivera. I have 6 years of experience in product design, focusing on user research, Framer interactive prototyping, SaaS dashboards, and leading cross-functional teams in agile settings. I also speak at design meetups and mentor junior UI designers.",
      resultHeader: "Identity Captured",
      resultSummaryLabel: "Brand Authority Summary",
    },
    testimonials: {
      title: "Trusted by Modern Leaders Globally",
      subtitle: "See how designers, engineers, entrepreneurs, and consultants leverage AI to skyrocket their digital profile visibility.",
      items: [
        {
          name: "Sarah Chen",
          role: "Marketing Director @ TechVibe",
          content: "The expertise classification is spot on! It is like having a private, professional branding consultant available 24/7.",
          achievement: "+40% LinkedIn Profile Views"
        },
        {
          name: "Faisal Rahman",
          role: "Senior Full Stack Dev @ Contech",
          content: "I always struggled to summarize my engineering specialties. BrandVision highlighted skills I didn't even think to emphasize!",
          achievement: "Sourced 3 high-paying contracts"
        },
        {
          name: "Alex Rivera",
          role: "Lead Product Designer",
          content: "The resume and summary export is absolute gold. My personal website landing page was written entirely by BrandVision.",
          achievement: "Perfect speaker bio generated"
        },
        {
          name: "Nabila Jasmine",
          role: "B2B SaaS Consultant",
          content: "Structuring my services based on the identified authority domains helped me confidently raise my consulting rates.",
          achievement: "Consulting rate up 25%"
        }
      ]
    },
    pricing: {
      title: "Supercharge Your Profile Visibility",
      subtitle: "Choose the package tailored to your career phase. Cancel anytime.",
      monthly: "Monthly Billing",
      annually: "Annual Billing",
      save: "Save 20%",
      freeName: "Starter Tier",
      freePrice: "Free",
      freeDesc: "Perfect for testing the AI and establishing your fundamental career direction.",
      proName: "Pro Brand",
      proPriceMonth: "$19",
      proPriceYear: "$15",
      proDesc: "For ambitious experts aiming to command attention and export outstanding portfolios.",
      entName: "Enterprise Brand",
      entPriceMonth: "$59",
      entPriceYear: "$45",
      entDesc: "For teams, agencies, and elite builders demanding custom models and human support.",
      currentBtn: "Daftar Akun Gratis",
      upgradeBtn: "Mulai Akses Pro",
      entBtn: "Hubungi Enterprise",
      features: {
        basic: "3 AI Classifications / month",
        unlimited: "Unlimited AI Classifications",
        basicPDF: "Standard Web Profile view",
        pdf: "Premium PDF Exporter Layouts",
        excel: "Excel Skill Map Exporting",
        history: "Persistent History Records",
        gemini: "Gemini Pro Premium Model",
        support: "Priority 24/7 Support",
        analytics: "Advanced Profile Analytics",
        entSupport: "Dedicated 1-on-1 Account Manager",
        entCustom: "Custom PDF Cover & Theme Designs",
        entTeams: "Multi-seat Collaborative Accounts"
      },
      enterpriseTitle: "Need custom enterprise features?",
      enterpriseBtn: "Contact Enterprise"
    }
  },
  id: {
    hero: {
      badge: "Ditenagai oleh Gemini Engine",
      title: "Temukan Identitas Profesional Utama Anda",
      subtitle: "Jangan hanya menumpuk CV. Biarkan BrandVision AI mengekstrak keahlian elit Anda, menulis ringkasan brand berkelas, dan merancang profil memikat.",
      ctaStart: "Mulai Gratis Sekarang",
      ctaDemo: "Coba Demo Interaktif",
    },
    nav: {
      problems: "Masalah & Solusi",
      demo: "Demo Interaktif",
      testimonials: "Testimoni",
      pricing: "Harga",
      dashboard: "Dasbor",
    },
    problemsSection: {
      tag: "Tantangan",
      title: "Kendala Personal Branding Modern",
      subtitle: "Menonjol di lanskap digital lebih sulit dari sebelumnya. Para ahli kerap menghadapi hambatan krusial ini.",
      problems: [
        {
          title: "Sulit Merumuskan Nilai Diri",
          description: "Kesulitan merangkum kerja keras multidisiplin selama bertahun-tahun menjadi proposisi nilai yang bersih dan ringkas."
        },
        {
          title: "Profil Terlalu Umum / Klise",
          description: "Kalimat pasaran seperti 'pekerja keras' atau 'berdedikasi' membuat profil Anda tenggelam dalam kebisingan pasar."
        },
        {
          title: "CV Manual yang Melelahkan",
          description: "Menghabiskan waktu berjam-jam menyusun teks profil untuk LinkedIn, portofolio pribadi, atau lamaran bisnis."
        }
      ],
      solutions: [
        {
          title: "Ekstraksi Keahlian Presisi",
          description: "Model AI kami mengurai riwayat Anda untuk memetakan domain kompetensi yang benar-benar bernilai tinggi."
        },
        {
          title: "Ringkasan Otoritas Berdaya Jual",
          description: "Dapatkan narasi deskripsi diri kreatif dalam bahasa profesional berkonversi tinggi yang siap disalin."
        },
        {
          title: "Ekspor PDF Instan dan Eksklusif",
          description: "Download dokumen ringkasan keahlian berdesain elegan untuk langsung dikirim ke calon pencari jasa Anda."
        }
      ]
    },
    demoSection: {
      title: "Lihat Cara Kerja Secara Real-Time",
      subtitle: "Klik tombol play di simulator kami untuk melihat bagaimana BrandVision AI mengolah bio mentah menjadi peta klasifikasi.",
      playLabel: "Putar Simulasi",
      resetLabel: "Selesai",
      statusIdle: "Simulator Idle. Klik Play.",
      statusTyping: "Mengetik bio profesional...",
      statusAnalyzing: "Mengekstrak keahlian dengan Gemini...",
      statusFinished: "Sukses! Profil Otoritas siap digunakan.",
      sampleInput: "Hi, saya Alex Rivera. Saya memiliki 6 tahun pengalaman di product design, berfokus pada user research, membuat prototipe interaktif di Framer, dashboard SaaS, dan memimpin tim lintas fungsi. Saya juga sering menjadi pembicara dalam acara desain dan membimbing desainer UI junior.",
      resultHeader: "Identitas Ditemukan",
      resultSummaryLabel: "Ringkasan Otoritas Brand",
    },
    testimonials: {
      title: "Dicintai 10,000+ Profesional Global",
      subtitle: "Simak bagaimana para spesialis meningkatkan visibilitas digital dan meraih karir impian mereka.",
      items: [
        {
          name: "Sarah Chen",
          role: "Marketing Director @ TechVibe",
          content: "Klasifikasi keahliannya sangat akurat! Seperti memiliki penasihat brand marketing pribadi yang siap membimbing Anda 24/7.",
          achievement: "+40% Tampilan Profil LinkedIn"
        },
        {
          name: "Faisal Rahman",
          role: "Senior Full Stack Dev @ Contech",
          content: "Saya selalu kesulitan merangkum portofolio coding saya. BrandVision berhasil memetakan kepakaran utama dengan cemerlang!",
          achievement: "Mendapat 3 tawaran kerja eksklusif"
        },
        {
          name: "Alex Rivera",
          role: "Lead Product Designer",
          content: "Fitur download CV dan summary ini sangat luar biasa. Teks website portofolio saya generated seutuhnya oleh sistem ini.",
          achievement: "Bio pembicara sukses dirancang"
        },
        {
          name: "Nabila Jasmine",
          role: "Konsultan B2B SaaS",
          content: "Menyusun strategi penawaran klien berbekal klaster keahlian dari AI ini memudahkan saya menaikkan tarif jasa.",
          achievement: "Tarif jasa naik 25% percaya diri"
        }
      ]
    },
    pricing: {
      title: "Investasikan Karir dan Otoritas Anda",
      subtitle: "Pilih paket yang paling cocok untuk fase pertumbuhan karir Anda. Batalkan kapan saja.",
      monthly: "Tagihan Bulanan",
      annually: "Tagihan Tahunan",
      save: "Hemat 20%",
      freeName: "Paket Starter",
      freePrice: "Gratis",
      freeDesc: "Sangat baik untuk mengevaluasi fitur AI dasar dan arah awal branding Anda.",
      proName: "Pro Brand",
      proPriceMonth: "Rp 290k",
      proPriceYear: "Rp 230k",
      proDesc: "Bagi profesional ambisius yang ingin menonjol total dan mengunduh berkas portfolio kelas atas.",
      entName: "Paket Enterprise",
      entPriceMonth: "Rp 890k",
      entPriceYear: "Rp 690k",
      entDesc: "Bagi tim besar, agensi konsultasi, dan eksekutif elit yang memerlukan integrasi custom dan konsultasi privat.",
      currentBtn: "Daftar Akun Gratis",
      upgradeBtn: "Mulai Akses Pro",
      entBtn: "Hubungi Enterprise",
      features: {
        basic: "3 Klasifikasi AI / bulan",
        unlimited: "Klasifikasi AI Tanpa Batas",
        basicPDF: "Akses Web Profile standar",
        pdf: "Desain Ekspor PDF Premium",
        excel: "Ekspor Pemetaan Skill Excel",
        history: "Penyimpanan Riwayat Berkelanjutan",
        gemini: "Premium Model Gemini Pro",
        support: "Dukungan Prioritas 24/7",
        analytics: "Analisis Profil Lanjutan",
        entSupport: "Konsultan Akun Dedikasi 1-on-1",
        entCustom: "Kustomisasi Tema & Tampilan PDF",
        entTeams: "Akses Multi-Akun Kolaboratif Berkelompok"
      },
      enterpriseTitle: "Butuh fitur kustom skala perusahaan?",
      enterpriseBtn: "Hubungi Enterprise"
    }
  }
};

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const currentUser = mockBackend.getCurrentUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation states
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pricing Interval Toggle
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annually'>('monthly');

  // Simulation State for the interactive Video/Demo
  const [simStatus, setSimStatus] = useState<'idle' | 'typing' | 'analyzing' | 'finished'>('idle');
  const [simText, setSimText] = useState('');
  const [simOutput, setSimOutput] = useState<{
    expertise: string[];
    summary: string;
  } | null>(null);

  // Real Video Demo Modal Status & Step walkthrough states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDemoStep, setVideoDemoStep] = useState<number>(0);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'refund' | 'contact' | null>(null);

  const lang = (i18n.language && i18n.language.startsWith('id')) ? 'id' : 'en';
  const text = LOCAL_CONTENT[lang];

  const videoSteps = [
    {
      title: lang === 'id' ? "1. Input Data & Riwayat" : "1. Input Bio & Experience",
      desc: lang === 'id' ? "Tuliskan riwayat hidup Anda ke sistem secara sederhana." : "Simply write or paste your career history into the system.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      stats: { label: lang === 'id' ? "Status Input" : "Input Status", val: lang === 'id' ? "Selesai diunggah" : "Loaded Successfully", color: "text-indigo-500" }
    },
    {
      title: lang === 'id' ? "2. Pemetaan Otoritas AI" : "2. AI Authority Extraction",
      desc: lang === 'id' ? "Gemini AI Core memetakan keahlian Anda ke dalam domain klasifikasi otoritas premium." : "Gemini AI Core structures your experience into high-value signature skill domains.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      stats: { label: lang === 'id' ? "Proses Klasifikasi" : "Classification Rate", val: "99.4% Presisi", color: "text-emerald-500" }
    },
    {
      title: lang === 'id' ? "3. Desain Portofolio Web" : "3. Deploy Web Profile",
      desc: lang === 'id' ? "Menghasilkan landing page profile publik dengan link unik yang siap dibagikan." : "Instantly deploy a stunning, public-facing web profile with specialized badges.",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
      stats: { label: lang === 'id' ? "Link Publik" : "Public URL", val: "brandvision.ai/username", color: "text-indigo-500" }
    },
    {
      title: lang === 'id' ? "4. Ekspor PDF & Excel" : "4. Export PDF & Excel",
      desc: lang === 'id' ? "Unduh sertifikasi ringkasan otoritas brand dalam bentuk PDF berkelas atau data Excel." : "Export presentation-ready PDF report portfolios and custom Excel skill spreadsheets.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      stats: { label: lang === 'id' ? "Format Ekspor" : "Export Formats", val: "PDF Premium & Spreadsheet", color: "text-amber-500" }
    }
  ];

  // Automatic playback effect of simulated video steps when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoDemoStep((prev) => (prev + 1) % 4);
      }, 5500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVideoPlaying]);

  // Auto-hide Navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine background backdrop transition
      setIsScrolled(currentScrollY > 20);

      // Scroll direction for visible navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle Demo Quick Access
  const handleDemoLogin = () => {
    try {
      mockBackend.login('demo@brandvision.ai', 'demo_password');
      toast.success(lang === 'id' ? "Selamat datang di Demo!" : "Welcome to the demo!");
      navigate('/dashboard');
    } catch (error) {
      toast.error(lang === 'id' ? "Gagal masuk ke Demo. Silakan muat ulang." : "Demo account not found. Try refreshing.");
    }
  };

  // Scroll smoothly to specific element ID
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Run the beautiful typing & AI modeling simulation inside the Demo section
  const startSimulation = () => {
    if (simStatus !== 'idle') return;
    
    setSimStatus('typing');
    setSimText('');
    setSimOutput(null);

    const fullText = text.demoSection.sampleInput;
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setSimText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        
        // Advance to AI analysis phase
        setSimStatus('analyzing');
        
        setTimeout(() => {
          setSimStatus('finished');
          setSimOutput({
            expertise: lang === 'id' ? [
              "Framer Interactive Prototyping",
              "SaaS Product Dashboard Design",
              "Advanced UX Research Modeling",
              "Agile Creative Team Leadership"
            ] : [
              "Interactive Framer Prototyping",
              "SaaS Analytics Dashboard Design",
              "Advanced UX Research Methodologies",
              "Agile Product Team Leadership"
            ],
            summary: lang === 'id' ? 
              "Alex Rivera adalah Lead Product UI/UX Designer berkaliber tinggi dengan keahlian mendalam dalam arsitektur dashboard SaaS kompleks, riset kegunaan empiris, prototipe fungsional tinggi, serta berpengalaman menginspirasi dan membimbing tim kreatif agar konsisten merealisasikan target produk bisnis." :
              "Alex Rivera is an outstanding Lead Interactive Product Designer holding signature expertise in complex SaaS dashboard styling, empirical user research, Framer structural prototypes, and a proven pedigree of mentoring designers or championing agile cross-disciplinary product workflows."
          });
          toast.success(lang === 'id' ? "Simulsi AI Selesai!" : "AI Simulation Complete!");
        }, 3200);
      }
    }, 15);
  };

  const resetSimulation = () => {
    setSimStatus('idle');
    setSimText('');
    setSimOutput(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary/30 transition-colors duration-500 overflow-x-hidden">
      
      {/* Dynamic Scrolled Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="container max-w-[1440px] mx-auto px-4 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-600 to-indigo-500 dark:from-white dark:via-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                BrandVision AI
              </span>
              <p className="text-[10px] uppercase font-mono tracking-widest text-indigo-500 font-bold -mt-1">
                Contech Network
              </p>
            </div>
          </div>

          {/* Desktop Nav Anchors */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => scrollToSection('problems')} 
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {text.nav.problems}
            </button>
            <button 
              onClick={() => scrollToSection('demo')} 
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {text.nav.demo}
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {text.nav.testimonials}
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {text.nav.pricing}
            </button>
          </div>

          {/* Desktop Right Settings & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switch */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => i18n.changeLanguage(lang === 'id' ? 'en' : 'id')}
              className="gap-2 border-slate-200 dark:border-slate-800"
              title="Change Language"
            >
              <Languages className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{lang.toUpperCase()}</span>
            </Button>

            {/* Dark & Light Theme Switch */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 text-slate-500 hover:text-slate-950 dark:hover:text-white"
              title="Toggle Theme"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <span className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            {currentUser ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/15">
                  {text.nav.dashboard} <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/15">
                    {t('get_started')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Quick Controls */}
          <div className="flex lg:hidden items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 text-slate-700 dark:text-slate-300 bg-slate-100/40 dark:bg-slate-900/40 rounded-xl"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

        </div>

      </nav>

      {/* Mobile Navigation Beautiful Burger Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Blur backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden"
            />

            {/* Slide-out drawer container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[290px] sm:w-[320px] z-50 shadow-2xl border-l border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col justify-between lg:hidden font-sans select-none"
              style={{ 
                backgroundColor: resolvedTheme === 'dark' ? '#090b14' : '#ffffff',
                color: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a'
              }}
            >
              <div className="space-y-6">
                {/* Top Close Row */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}>
                    <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                      <Sparkles className="text-white w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-tight bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-400 bg-clip-text text-transparent">
                        BrandVision AI
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8.5 h-8.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Navigation Anchors */}
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => { scrollToSection('problems'); setIsMobileMenuOpen(false); }} 
                    className="flex items-center gap-3.5 text-left py-3 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-650 dark:text-slate-300 hover:bg-indigo-50/50 dark:hover:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{text.nav.problems}</span>
                  </button>
                  <button 
                    onClick={() => { scrollToSection('demo'); setIsMobileMenuOpen(false); }} 
                    className="flex items-center gap-3.5 text-left py-3 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-650 dark:text-slate-300 hover:bg-indigo-50/50 dark:hover:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all"
                  >
                    <Play className="w-4 h-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
                    <span>{text.nav.demo}</span>
                  </button>
                  <button 
                    onClick={() => { scrollToSection('testimonials'); setIsMobileMenuOpen(false); }} 
                    className="flex items-center gap-3.5 text-left py-3 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-650 dark:text-slate-300 hover:bg-indigo-50/50 dark:hover:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all"
                  >
                    <Star className="w-4 h-4 text-pink-500 fill-pink-500/10 shrink-0" />
                    <span>{text.nav.testimonials}</span>
                  </button>
                  <button 
                    onClick={() => { scrollToSection('pricing'); setIsMobileMenuOpen(false); }} 
                    className="flex items-center gap-3.5 text-left py-3 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-650 dark:text-slate-300 hover:bg-indigo-50/50 dark:hover:bg-slate-900/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all"
                  >
                    <Target className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{text.nav.pricing}</span>
                  </button>
                </div>
              </div>

              {/* Bottom System Switches / Actions */}
              <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-5">
                <div className="flex items-center justify-between gap-3 px-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">{lang === 'id' ? "Konfigurasi" : "Controls"}</span>
                  <div className="flex items-center gap-1.5">
                    {/* Language Quick Access */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => i18n.changeLanguage(lang === 'id' ? 'en' : 'id')}
                      className="h-8.5 text-[10px] font-extrabold gap-1 px-2.5 border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>{lang.toUpperCase()}</span>
                    </Button>

                    {/* Dark/Light Quick Switch */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                      className="w-8.5 h-8.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                    >
                      {mounted && resolvedTheme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  {currentUser ? (
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full h-10.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/15 cursor-pointer">
                        {text.nav.dashboard}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                        <Button variant="outline" className="w-full h-10 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer">
                          {t('login')}
                        </Button>
                      </Link>
                      <Link to="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                        <Button className="w-full h-10.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/15 cursor-pointer">
                          {t('get_started')}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-slate-950 dark:via-[#090b14] dark:to-slate-950 overflow-hidden">
        {/* Futuristic Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Floating Glowing Aura */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-teal-400/10 blur-[90px] rounded-full -z-10 pointer-events-none" />

        <div className="container max-w-[1440px] mx-auto px-4 text-center">
          
          <Badge 
            variant="outline" 
            className="mb-6 py-1.5 px-4 text-xs font-semibold uppercase tracking-wider border-indigo-200 dark:border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-spin-slow text-indigo-500" />
            {text.hero.badge}
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-6xl xl:text-7.5xl font-black tracking-tight mb-6 max-w-5xl mx-auto leading-tight md:leading-none text-slate-900 dark:text-white px-2">
            {text.hero.title}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            {text.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {currentUser ? (
              <Link to="/dashboard">
                <Button size="lg" className="h-13 px-8 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-xl shadow-indigo-600/30">
                  {text.nav.dashboard} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth/register">
                <Button size="lg" className="h-13 px-8 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-xl shadow-indigo-600/30">
                  {text.hero.ctaStart} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            )}

            <Button 
              size="lg" 
              variant="outline" 
              className="h-13 px-8 text-base font-semibold border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur"
              onClick={() => scrollToSection('demo')}
            >
              {text.hero.ctaDemo}
            </Button>
          </div>

          {/* Simple Direct Access Link and Trust banner */}
          <div className="mt-8 flex justify-center items-center">
            <button 
              onClick={handleDemoLogin} 
              className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-indigo-500/40 hover:decoration-indigo-500 underline-offset-4 flex items-center gap-1 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              {lang === 'id' ? "Buka Akses Klik Demo Langsung" : "Bypass with Quick Demo Log"}
            </button>
          </div>

          {/* Interactive Hero Dashboard Mockup Frame */}
          <div className="mt-16 md:mt-24 relative max-w-[1200px] mx-auto rounded-3xl border border-slate-200 dark:border-slate-800/85 p-2 bg-slate-100/40 dark:bg-slate-900/40 backdrop-blur-md shadow-2xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-3xl opacity-15 blur-2xl pointer-events-none" />
            
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 md:p-6 text-left shadow-inner flex flex-col font-sans select-none">
              
              {/* Mockup Browser Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-4 text-xs font-mono text-slate-405 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-md border border-slate-100 dark:border-slate-850/60 hidden sm:inline-block">
                    brandvision.ai/app/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
                    Active
                  </span>
                </div>
              </div>

              {/* Mockup Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Profile Card (Col Span 5) */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                          F
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Faisal Rahman</h4>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold tracking-tight">Senior Full Stack Developer</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Jakarta, ID • Member since 2026</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Brand Tagline */}
                      <div>
                        <span className="text-[9px] font-black uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                          Authority Identity Title
                        </span>
                        <div className="bg-white dark:bg-slate-950 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-100 shadow-sm leading-relaxed">
                          🚀 Elite SaaS Architect & Distributed Systems Specialist
                        </div>
                      </div>

                      {/* Extracted Core Competencies Badges */}
                      <div>
                        <span className="text-[9px] font-black uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 block mb-1.5">
                          Extracted Competency Clusters
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100/80 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/65 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            Scalable REST APIs
                          </span>
                          <span className="bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100/80 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/65 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            Database Optimization
                          </span>
                          <span className="bg-purple-50 dark:bg-purple-950 hover:bg-purple-100/80 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/65 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            Enterprise React / Vite
                          </span>
                          <span className="bg-pink-50 dark:bg-pink-950 hover:bg-pink-100/80 text-pink-700 dark:text-pink-300 border border-pink-100 dark:border-pink-900/65 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            Agile Team Mentorship
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-450 dark:text-slate-500">
                    <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Web Portfolio Live</span>
                    <span className="font-mono text-[10px] text-indigo-500 font-bold">bv.ai/faisal-rahman</span>
                  </div>
                </div>

                {/* Right Analytics Card (Col Span 7) */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/70 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-5">
                    
                    {/* Generative Summary Box */}
                    <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-teal-500/5 border border-indigo-500/10 dark:border-indigo-500/15 p-4">
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-white dark:bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800 text-[9px] font-black tracking-wider text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="w-2.5 h-2.5" /> AI SUMMARY
                      </div>
                      <h5 className="font-black text-slate-900 dark:text-white text-xs mb-2">
                        Professional Brand Statement
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-305 leading-relaxed font-serif italic">
                        "{lang === 'id' 
                          ? 'Faisal Rahman adalah Lead Engineer kawakan dengan ketajaman teknis superior dalam menyusun sistem web bernilai transaksi tinggi, mengoptimalkan basis data relasional kompleks, serta memimpin tim teknis yang lincah menuju standar rekayasa kelas dunia.'
                          : 'Faisal Rahman is a seasoned Lead Engineer holding exceptional technical pedigree in engineering high-transaction web systems, restructuring large business databases, and spearheading agile development groups toward peak operational excellence.'
                        }"
                      </p>
                    </div>

                    {/* Quality Insights Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-905 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Profile strength</span>
                          <span className="text-xs font-black text-emerald-500">98%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }} />
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-905 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Market Match</span>
                          <span className="text-xs font-black text-indigo-500">Tier A+</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '95%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-500 border border-slate-200/60 dark:border-slate-800/50">
                        📄 CV-Export.pdf
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-500 border border-slate-200/60 dark:border-slate-800/50">
                        📊 SkillMap.xlsx
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Problems & Solutions Standard section */}
      <section id="problems" className="py-24 md:py-32 bg-slate-100/60 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-900 relative">
        <div className="container max-w-[1440px] mx-auto px-4">
          
          <div className="text-center mb-16 md:mb-20">
            <Badge variant="outline" className="mb-3 py-1 px-3 border-amber-200 dark:border-amber-500/20 bg-amber-500/5 text-amber-600">
              {text.problemsSection.tag}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
              {text.problemsSection.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
              {text.problemsSection.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            
            {/* PROBLEM COLUMN: Styled in deep elegant WARNING RED colors */}
            <div className="bg-red-500/5 border border-red-200/60 dark:border-red-950/80 rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -z-10" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-950/50 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-200">
                  {lang === 'id' ? "Sisi Gelap: Hambatan Branding" : "The Threat: Standard Branding Friction"}
                </h3>
              </div>

              <div className="space-y-6">
                {text.problemsSection.problems.map((prob, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1 w-5 h-5 rounded-full border border-red-200 dark:border-red-900/80 bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-500 flex-shrink-0">
                      <XCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {prob.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                        {prob.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOLUTION COLUMN: Styled in lush GROWTH GREEN colors */}
            <div className="bg-emerald-500/5 border border-emerald-200/60 dark:border-emerald-950/80 rounded-2xl p-6 md:p-8 relative overflow-hidden backdrop-blur-sm shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Lightbulb className="w-5 h-5 text-emerald-500 animate-bounce-slow" />
                </div>
                <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-200">
                  {lang === 'id' ? "Solusi Terbaik: BrandVision AI" : "The Solution: BrandVision AI Automation"}
                </h3>
              </div>

              <div className="space-y-6">
                {text.problemsSection.solutions.map((sol, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1 w-5 h-5 rounded-full border border-emerald-200 dark:border-emerald-900/80 bg-emerald-100 dark:bg-emerald-950/65 flex items-center justify-center text-emerald-500 flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {sol.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                        {sol.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive Video Demo Simulation Section */}
      <section id="demo" className="py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="container max-w-[1440px] mx-auto px-4">
          
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-3 py-1 px-3 border-indigo-200 dark:border-indigo-500/20 bg-indigo-500/5 text-indigo-600">
              Live Interactive Demo
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
              {text.demoSection.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {text.demoSection.subtitle}
            </p>
          </div>

          {/* Interactive Workspace Mockup */}
          <div className="max-w-[1200px] mx-auto border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 flex flex-col">
            
            {/* Simulated Desktop Window Bar */}
            <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400 dark:bg-red-500/70" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 dark:bg-amber-500/70" />
                <span className="w-3.5 h-3.5 rounded-full bg-green-400 dark:bg-green-500/70" />
              </div>
              <div className="bg-slate-200/50 dark:bg-slate-900 text-[11px] font-mono px-6 py-0.5 rounded-lg text-slate-500 dark:text-slate-400 border border-slate-300/20">
                brandvision-workspace-simulator.sh
              </div>
              <div className="w-12 h-2" />
            </div>

            {/* Split Panel Screen */}
            <div className="grid md:grid-cols-5 min-h-[380px]">
              
              {/* Input Area */}
              <div className="md:col-span-3 p-5 md:p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 font-mono">
                      {lang === 'id' ? "INPUT BIO MENTAH" : "RAW BIO INPUT"}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[160px] relative">
                    {simStatus === 'idle' ? (
                      <p className="text-sm italic text-slate-400">
                        {lang === 'id' 
                          ? "Klik tombol play di bawah untuk memulai visualisasi analisis..." 
                          : "Click prompt below or play button to see typing simulation..."}
                      </p>
                    ) : (
                      <p className="text-sm font-mono leading-relaxed text-slate-700 dark:text-slate-300">
                        {simText}
                        <span className="inline-block w-2-line bg-indigo-500 h-4 ml-0.5 animate-pulse" />
                      </p>
                    )}
                  </div>
                </div>

                {/* Simulated Panel Controller Action Row */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  {simStatus === 'idle' ? (
                    <Button 
                      onClick={startSimulation}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 w-full md:w-auto"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      {text.demoSection.playLabel}
                    </Button>
                  ) : (
                    <Button 
                      onClick={resetSimulation}
                      variant="outline"
                      className="border-slate-200 dark:border-slate-800 font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 w-full md:w-auto"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-500" />
                      {text.demoSection.resetLabel}
                    </Button>
                  )}
                  <span className="hidden md:inline-flex items-center text-xs text-slate-400 font-mono">
                    Status: {
                      simStatus === 'idle' && text.demoSection.statusIdle ||
                      simStatus === 'typing' && text.demoSection.statusTyping ||
                      simStatus === 'analyzing' && text.demoSection.statusAnalyzing ||
                      simStatus === 'finished' && text.demoSection.statusFinished
                    }
                  </span>
                </div>
              </div>

              {/* Output Response Area */}
              <div className="md:col-span-2 p-5 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 font-mono">
                      {text.demoSection.resultHeader}
                    </span>
                    {simStatus === 'analyzing' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-500 animate-pulse font-mono">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                        AI MAP...
                      </span>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {simStatus === 'idle' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center py-10"
                      >
                        <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                        <span className="text-xs text-slate-400 font-medium">Waiting for simulation triggers</span>
                      </motion.div>
                    )}

                    {simStatus === 'typing' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4 py-4"
                      >
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-5/6" />
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                        </div>
                        <p className="text-xs text-slate-400 italic">Receiving rich character strings...</p>
                      </motion.div>
                    )}

                    {simStatus === 'analyzing' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3 py-4"
                      >
                        <div className="h-8 bg-indigo-500/10 rounded-lg flex items-center px-3 gap-2 border border-indigo-500/20">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold font-mono">Gemini Mapping Vector...</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded w-full animate-pulse" />
                          <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded w-11/12 animate-pulse" />
                        </div>
                      </motion.div>
                    )}

                    {simStatus === 'finished' && simOutput && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {simOutput.expertise.map((tag, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-none hover:bg-slate-200 text-[10px] font-mono"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                          <h5 className="text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">
                            {text.demoSection.resultSummaryLabel}
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                            {simOutput.summary}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {simStatus === 'finished' && (
                  <Button 
                    size="sm" 
                    onClick={handleDemoLogin}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-500/20 flex gap-1.5 items-center justify-center"
                  >
                    <Check className="w-4 h-4" />
                    {lang === 'id' ? "Coba Dashboard Asli Sekarang" : "Accredit Profile & Log In"}
                  </Button>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Real Video Walkthrough Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-850/60 transition-colors relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container max-w-[1440px] mx-auto px-4 relative z-10">
          
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 py-1 px-3 border-emerald-200 dark:border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs rounded-full">
              {lang === 'id' ? "Video Walkthrough Produk" : "Product Video Walkthrough"}
            </Badge>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
              {lang === 'id' ? "Saksikan Bagaimana BrandVision AI Bekerja" : "Watch BrandVision AI in Action"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {lang === 'id' 
                ? "Tonton video demonstrasi singkat untuk melihat proses instan integrasi keahlian pribadi menjadi portfolio digital yang siap cetak."
                : "Watch a quick product preview session to see how we instantly refine your raw bio into premium digital and print portfolios."}
            </p>
          </div>

          {/* Interactive video container */}
          <div className="max-w-[1200px] mx-auto relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video group">
            {/* Background Thumbnail Image */}
            <img 
              src="/src/assets/images/video_thumbnail_dashboard_1781254732981.jpg" 
              alt="BrandVision Walkthrough Thumbnail" 
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />

            {/* Pulsing Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Button
                onClick={() => {
                  setIsVideoPlaying(true);
                  setVideoDemoStep(0);
                }}
                className="w-20 h-20 rounded-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 hover:scale-110 text-white shadow-2xl transition-all duration-300 flex items-center justify-center p-0 cursor-pointer border border-white/20 active:scale-95"
              >
                <Play className="w-8 h-8 fill-white ml-1.5 text-white" />
              </Button>
              <span className="text-white font-extrabold text-sm tracking-wider uppercase drop-shadow">
                {lang === 'id' ? "PUTAR REKAMAN PREVIEW" : "PLAY DEMO WALKTHROUGH"}
              </span>
              <span className="text-slate-400 text-xs px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur">
                1:32 Min HD Walkthrough
              </span>
            </div>

            {/* Bottom floating elements for aesthetic detail */}
            <div className="absolute bottom-5 left-6 right-6 flex justify-between items-center text-white/50 text-[11px] font-mono select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>PREVIEW MODE ACTIVE</span>
              </div>
              <div>1080P HD</div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Standard Section: exactly 4 Cards */}
      <section id="testimonials" className="py-24 md:py-32 bg-slate-100/50 dark:bg-[#0c0e17] transition-colors relative">
        <div className="container max-w-[1440px] mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
              {text.testimonials.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
              {text.testimonials.subtitle}
            </p>
          </div>

          {/* Grid Layout containing EXACTLY 4 Testimonials */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {text.testimonials.items.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group rounded-3xl p-6 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 border border-slate-200/60 dark:border-slate-800/80 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual decoration: giant quote symbol in the corner */}
                <div className="absolute right-4 bottom-4 text-slate-100 dark:text-slate-900/15 font-black text-8xl pointer-events-none select-none leading-none font-serif opacity-30 group-hover:opacity-60 transition-opacity">
                  ”
                </div>
                
                <div className="relative z-10 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Stars Rating */}
                    <div className="flex gap-1 mb-5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base italic mb-6 leading-relaxed">
                      "{item.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/85 mt-auto">
                    {/* Beautiful Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/20">
                        {item.name.charAt(0)}
                      </div>
                      {/* Active Status Pulse Dot */}
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">
                        {item.name}
                      </h4>
                      <p className="text-slate-450 dark:text-slate-400 text-xs font-semibold">
                        {item.role}
                      </p>
                      {/* Metric Tag badge */}
                      <span className="inline-flex mt-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {item.achievement}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Pricing Standard Section */}
      <section id="pricing" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors">
        <div className="container max-w-[1440px] mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
              {text.pricing.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
              {text.pricing.subtitle}
            </p>

            {/* Monthly / Annual Toggle switch */}
            <div className="inline-flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 mt-8 gap-1.5">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingInterval === 'monthly'
                    ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {text.pricing.monthly}
              </button>
              <button
                onClick={() => setBillingInterval('annually')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  billingInterval === 'annually'
                    ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {text.pricing.annually}
                <span className="bg-amber-500/10 text-amber-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                  {text.pricing.save}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1440px] mx-auto items-stretch mt-12">
            
            {/* Starter Tier Card */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full transform transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 flex flex-col h-full justify-between flex-1">
                <div className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-slate-550 dark:text-slate-400 font-bold uppercase tracking-widest text-[11px] mb-1">
                      {text.pricing.freeName}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {text.pricing.freePrice}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-4 min-h-[40px]">
                      {text.pricing.freeDesc}
                    </p>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800 my-4" />

                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{text.pricing.features.basic}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{text.pricing.features.basicPDF}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-350 dark:text-slate-600 text-sm line-through decoration-slate-200 dark:decoration-slate-800">
                      <X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 flex-shrink-0" />
                      <span>{text.pricing.features.excel}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-350 dark:text-slate-600 text-sm line-through decoration-slate-200 dark:decoration-slate-800">
                      <X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 flex-shrink-0" />
                      <span>{text.pricing.features.support}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto pt-6">
                  <Link to="/auth/register" className="w-full block">
                    <Button variant="outline" className="w-full font-semibold border-indigo-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 py-6 text-sm">
                      {text.pricing.currentBtn}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Pro Brand Tier Card - Highlighted and Premium */}
            <Card className="bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-xl relative overflow-hidden flex flex-col h-full transform transition-all duration-300 hover:shadow-2xl md:scale-[1.03] z-10">
              {/* Premium Corner Ribbon */}
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black uppercase py-1 px-5 translate-x-4 translate-y-2 rotate-45 shadow-sm">
                POPULAR
              </div>

              <CardContent className="p-8 flex flex-col h-full justify-between flex-1">
                <div className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-widest text-[11px] mb-1">
                      {text.pricing.proName}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {billingInterval === 'monthly' 
                          ? text.pricing.proPriceMonth 
                          : (lang === 'id' ? "Rp 2.760k" : "$180")
                        }
                      </span>
                      <span className="text-slate-450 dark:text-slate-400 text-xs font-semibold">
                        / {billingInterval === 'monthly' 
                            ? (lang === 'id' ? "bulan" : "month") 
                            : (lang === 'id' ? "tahun" : "year")
                          }
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-4 min-h-[40px]">
                      {text.pricing.proDesc}
                    </p>
                    <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 block mt-1">
                      {billingInterval === 'annually' ? (lang === 'id' ? "*Ditagih tahunan (Lebih hemat)" : "*Billed annually (Saves 20%)") : (lang === 'id' ? "*Ditagih bulanan" : "*Billed monthly")}
                    </span>
                  </div>

                  <hr className="border-indigo-100 dark:border-indigo-950 my-4" />

                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-white">{text.pricing.features.unlimited}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{text.pricing.features.pdf}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{text.pricing.features.excel}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{text.pricing.features.gemini}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{text.pricing.features.support}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto pt-6">
                  <Link to="/auth/register" className="w-full block">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/30 py-6 text-sm">
                      {text.pricing.upgradeBtn}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Tier Card */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full transform transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 flex flex-col h-full justify-between flex-1">
                <div className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-slate-550 dark:text-slate-400 font-bold uppercase tracking-widest text-[11px] mb-1">
                      {text.pricing.entName || "Enterprise"}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {billingInterval === 'monthly' 
                          ? text.pricing.entPriceMonth 
                          : (lang === 'id' ? "Rp 8.280k" : "$540")
                        }
                      </span>
                      <span className="text-slate-450 dark:text-slate-400 text-xs font-semibold">
                        / {billingInterval === 'monthly' 
                            ? (lang === 'id' ? "bulan" : "month") 
                            : (lang === 'id' ? "tahun" : "year")
                          }
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-4 min-h-[40px]">
                      {text.pricing.entDesc || "Specialized custom solution."}
                    </p>
                    <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 block mt-1">
                      {billingInterval === 'annually' ? (lang === 'id' ? "*Ditagih tahunan (Lebih hemat)" : "*Billed annually (Saves 20%)") : (lang === 'id' ? "*Ditagih bulanan" : "*Billed monthly")}
                    </span>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800 my-4" />

                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-white">{lang === 'id' ? "Akses Model Custom" : "Custom Models Access"}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{text.pricing.features.entSupport || "Dedicated Account Manager"}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{text.pricing.features.entCustom || "Custom Cover & Brand Theme"}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{text.pricing.features.entTeams || "Multi-seat Collaborative"}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/support')}
                    className="w-full font-semibold border-indigo-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 py-6 text-sm"
                  >
                    {text.pricing.entBtn || "Daftar Enterprise"}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Enterprise prompt */}
          <div className="mt-14 text-center">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {text.pricing.enterpriseTitle}{' '}
              <button 
                onClick={() => navigate('/support')} 
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                {text.pricing.enterpriseBtn}
              </button>
            </span>
          </div>

        </div>
      </section>

      {/* Modern High-Impact Call to Action (CTA) Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-900 to-slate-900 dark:from-slate-950 dark:to-indigo-950/70 text-white relative overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,#4338ca_0%,transparent_70%)] opacity-40 pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-bold px-3 py-1 text-xs uppercase tracking-wider">
            Ready to Accelerate?
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight max-w-3xl mx-auto">
            {lang === 'id' ? "Sertifikasi Karakter Brand Profesional Anda Sekarang!" : "Unlock Your Unfair Professional Advantage Now"}
          </h2>
          
          <p className="text-indigo-200/90 mb-10 max-w-xl mx-auto text-base md:text-lg">
            {lang === 'id' 
              ? "Gabung bersama ribuan ahli yang sudah beralih dari CV generik menuju otoritas karir tak tergoyahkan." 
              : "Command higher rates, impress employers, and claim the career status you have rightfully optimized."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {currentUser ? (
              <Link to="/dashboard">
                <Button size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-base shadow-xl font-bold">
                  {text.nav.dashboard}
                </Button>
              </Link>
            ) : (
              <Link to="/auth/register">
                <Button size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white text-base shadow-xl font-bold">
                  {text.hero.ctaStart}
                </Button>
              </Link>
            )}
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleDemoLogin} 
              className="h-12 px-8 bg-transparent hover:bg-white/10 text-white border-white/20 text-base font-bold"
            >
              View Quick Demo Workspace
            </Button>
          </div>
        </div>
      </section>

      {/* Styled Footer Block focusing heavily on BrandVision AI with precise Social Links */}
      <footer className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
        <div className="container max-w-[1440px] mx-auto px-4">
          
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 mb-12">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white w-4.5 h-4.5" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">BrandVision AI</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                An advanced AI-powered expertise classifier mapping professional authorities, bios, and credential indices in collaboration with Gemini Core.
              </p>

              {/* SOCIAL MEDIA SECTION: 100% Correct Contech Links */}
              <div className="mt-6">
                <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-3">Contech Ecosystem Profiles</h5>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="https://www.instagram.com/contech.id/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/80 shadow-sm"
                    title="Instagram"
                  >
                    <Camera className="w-4 h-4" />
                  </a>

                  <a 
                    href="https://www.threads.com/@contech.id?hl=id" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/80 shadow-sm"
                    title="Threads"
                  >
                    <AtSign className="w-4 h-4" />
                  </a>

                  <a 
                    href="https://x.com/contechofficial" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/80 shadow-sm"
                    title="X"
                  >
                    <Hash className="w-4 h-4" />
                  </a>

                  <a 
                    href="https://web.facebook.com/contech.id." 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/80 shadow-sm"
                    title="Facebook"
                  >
                    <Users className="w-4 h-4" />
                  </a>

                  <a 
                    href="https://www.tiktok.com/@contech.id" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/80 shadow-sm"
                    title="TikTok"
                  >
                    <Music className="w-4 h-4" />
                  </a>

                  <a 
                    href="https://www.youtube.com/@contechid1288" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700/80 shadow-sm"
                    title="YouTube"
                  >
                    <Play className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('problems')} className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left">{text.nav.problems}</button></li>
                <li><button onClick={() => scrollToSection('demo')} className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left">{text.nav.demo}</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left">{text.nav.pricing}</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left">{text.nav.testimonials}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/auth/login" className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left">{t('login')}</Link></li>
                <li><Link to="/auth/register" className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left">{t('register')}</Link></li>
                <li><Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left">{t('dashboard')}</Link></li>
                <li><Link to="/subscription" className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left">{t('subscription')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Legal Documents</h4>
              <ul className="space-y-2 text-sm flex flex-col items-start">
                <li>
                  <button 
                    onClick={() => setActiveLegalModal('privacy')} 
                    className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left"
                  >
                    {lang === 'id' ? "Kebijakan Privasi" : "Privacy Policy"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveLegalModal('terms')} 
                    className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left"
                  >
                    {lang === 'id' ? "Syarat & Ketentuan" : "Terms of Service"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveLegalModal('refund')} 
                    className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left"
                  >
                    {lang === 'id' ? "Kebijakan Pengembalian" : "Refund Policy"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveLegalModal('contact')} 
                    className="hover:text-indigo-600 dark:hover:text-white text-slate-500 dark:text-slate-400 transition-colors text-left"
                  >
                    {lang === 'id' ? "Hubungi Kami" : "Contact Us"}
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs text-slate-400 dark:text-slate-500">
            <div>
              © {new Date().getFullYear()} BrandVision AI. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

      {/* Legal & Document Dialog Modals */}
      <AnimatePresence>
        {activeLegalModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            id="legal-modal"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  {activeLegalModal === 'privacy' && (lang === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy')}
                  {activeLegalModal === 'terms' && (lang === 'id' ? 'Syarat & Ketentuan' : 'Terms of Service')}
                  {activeLegalModal === 'refund' && (lang === 'id' ? 'Kebijakan Pengembalian' : 'Refund Policy')}
                  {activeLegalModal === 'contact' && (lang === 'id' ? 'Kontak Kami' : 'Contact Us')}
                </h3>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setActiveLegalModal(null)}
                  className="rounded-full w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4">
                {activeLegalModal === 'privacy' && (
                  lang === 'id' ? (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-white">Terakhir diperbarui: Juni 2026</p>
                      <p>Di BrandVision AI, kami sangat menghargai privasi dan keamanan data Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat mengoperasikan software kami.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">1. Data yang Kami Simpan</h4>
                      <p>Kami menyimpan informasi profil dasar seperti Nama Lengkap, Alamat Email, Riwayat Karir, deskripsi bio yang Anda inputkan, dan data preferensi klasifikasi kompetensi Anda secara aman menggunakan Firebase Firestore Database.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">2. Pemrosesan Data Kecerdasan Buatan</h4>
                      <p>Analisis ekstrasi keahlian pribadi diproses secara aman melalui Google Gemini API Core di sisi server. Kami menjamin data pribadi Anda TIDAK digunakan untuk melatih model kecerdasan buatan pihak ketiga dan dijaga kerahasiaannya.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">3. Keamanan Informasi</h4>
                      <p>Seluruh transmisi data dienkripsi dengan standar industri SSL/TLS. Akses akun dilindungi sistem Firebase Authentication kelas dunia demi mencegah kebocoran informasi.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-white">Last updated: June 2026</p>
                      <p>At BrandVision AI, we deeply care about your privacy and data security. This Privacy Policy outlines how we collect, process, and protect your information as you interact with our website and application services.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">1. Information We Store</h4>
                      <p>We securely persist essential biographical records, credentials, names, and emails within encrypted Cloud Firestore database volumes based on Firebase Authentication protocols.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">2. Artificial Intelligence Processing</h4>
                      <p>All core skill extraction operations are managed exclusively in a server-side setting utilizing official Gemini Pro API credits. Your biographical data is strictly private and is never used to train third-party public models.</p>
                    </>
                  )
                )}

                {activeLegalModal === 'terms' && (
                  lang === 'id' ? (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-white">Terakhir diperbarui: Juni 2026</p>
                      <p>Dengan membuat akun atau menggunakan layanan BrandVision AI, Anda dianggap menyetujui seluruh ketentuan dan aturan penggunaan berikut secara sadar:</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">1. Kelayakan Akun</h4>
                      <p>Anda bertanggung jawab penuh menjaga kerahasiaan kata sandi akun Anda dan dilarang membagikan detail login kepada pihak luar tanpa izin resmi.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">2. Verifikasi Data</h4>
                      <p>Meskipun klasifikasi Gemini AI kami memiliki akurasi superior, Anda setuju untuk tetap memeriksa ulang seluruh riwayat ekspor PDF dan ringkasan keahlian secara manual sebelum menggunakannya untuk tujuan komersial atau rekrutmen profesional.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">3. Batasan Konten dan Penyalahgunaan</h4>
                      <p>Dilarang menggunakan perangkat lunak kami untuk memalsukan kredensial profesional, menyebarkan resume fiktif, atau memanipulasi riwayat hidup untuk tujuan penipuan karir.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-white">Last updated: June 2026</p>
                      <p>Welcome to BrandVision AI! By creating an account or accessing our services, you fully agree to terms outlined below:</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">1. Account Security</h4>
                      <p>It is your sole responsibility to guard credentials safe and private. Credentials must not be shared or leaked to external nodes.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">2. Automated Output Acknowledgment</h4>
                      <p>While our neural classifiers maintain exceptional precision rates, you acknowledge that all AI-generated text or PDF resumes must be manually verified prior to recruiting or professional consulting application.</p>
                    </>
                  )
                )}

                {activeLegalModal === 'refund' && (
                  lang === 'id' ? (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-white">Kebijakan Pengembalian Dana</p>
                      <p>Kami meyakini keandalan dan kualitas optimal BrandVision AI untuk karir Anda. Demi kenyamanan Anda, kami menawarkan jaminan kepuasan berkelanjutan:</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">1. Jaminan 14 Hari Uang Kembali</h4>
                      <p>Jika dalam waktu 14 hari pertama berlangganan Anda merasa tidak puas dengan hasil klasifikasi profil atau fungsionalitas software kami, Anda berhak mengajukan refund penuh 100% tanpa potongan.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">2. Syarat Pengajuan Refund</h4>
                      <p>Pengajuan pengembalian dana sangat mudah. Cukup kirimkan email ke tim support kami (support@brandvision.ai) dengan menyertakan detail email akun yang terdaftar. Tim kami akan memverifikasi dan mengirimkan dana kembali dalam kurun waktu 3-5 hari kerja.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-white">Refund & Billing Policy</p>
                      <p>Customer satisfaction remains our highest priority. To guarantee your confidence in BrandVision Pro, we offer a clean risk-free framework:</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">1. 14-Day Money-Back Guarantee</h4>
                      <p>If you are not thoroughly satisfied with the quality of your profile summaries, PDF brand reports, or platform features during your first 14 days, you may claim a full 100% refund.</p>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">2. Seamless Process</h4>
                      <p>Drop a request with your account registration ID to support@brandvision.ai, and our billing operators will revert back and process your full sum within 3-5 business days.</p>
                    </>
                  )
                )}

                {activeLegalModal === 'contact' && (
                  lang === 'id' ? (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-white">Hubungi Tim Kami</p>
                      <p>Butuh bantuan teknis, pertanyaan lisensi corporate, atau sekadar berdiskusi mengenai personal branding? Tim BrandVision AI siap mendampingi perjalanan karir Anda:</p>
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 mt-4">
                        <p className="text-sm">📧 <strong>Email Support:</strong> <span className="text-indigo-600 dark:text-indigo-400 hover:underline">support@brandvision.ai</span></p>
                        <p className="text-sm">📍 <strong>Lokasi Kami:</strong> Jakarta, Indonesia</p>
                        <p className="text-sm">🕒 <strong>Jam Operasional:</strong> Senin - Jumat, 09:00 - 18:00 WIB</p>
                      </div>
                      <p className="mt-4 text-xs text-slate-450 dark:text-slate-400">Tim bantuan prioritas kami rata-rata membalas seluruh tiket dalam waktu kurang dari 2 jam.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900 dark:text-white">Get in Touch with our Support Team</p>
                      <p>Have an inquiry about team volume billing, technical guidance, or feedback about our classifier? Reach us anytime:</p>
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 mt-4">
                        <p className="text-sm">📧 <strong>Official Email:</strong> <span className="text-indigo-600 dark:text-indigo-400 hover:underline">support@brandvision.ai</span></p>
                        <p className="text-sm">📍 <strong>Headquarters:</strong> Jakarta, Indonesia</p>
                        <p className="text-sm">🕒 <strong>Operating Hours:</strong> Monday - Friday, 09:00 AM - 06:00 PM UTC+7</p>
                      </div>
                    </>
                  )
                )}
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 flex justify-end bg-slate-50 dark:bg-slate-950/20">
                <Button 
                  onClick={() => setActiveLegalModal(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6"
                >
                  {lang === 'id' ? 'Tutup Dokumen' : 'Close Document'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Demo Walkthrough Playback Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 shadow-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden flex flex-col shadow-2xl relative"
            >
              <div className="absolute right-4 top-4 z-25">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsVideoPlaying(false)}
                  className="rounded-full w-9 h-9 p-0 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Player Top Title Bar */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-widest uppercase">
                      BrandVision AI Walkthrough Demonstrator
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base md:text-lg">
                    {lang === 'id' ? "Simulasi Pengoperasian Sistem Secara Real-Time" : "Real-Time Product Operations Demo Walkthrough"}
                  </h3>
                </div>
              </div>

              {/* Player Screen Area */}
              <div className="grid md:grid-cols-3 bg-slate-100 dark:bg-slate-950/60 min-h-[420px]">
                
                {/* Left Side: Simulated video stream rendering */}
                <div className="md:col-span-2 p-6 flex flex-col justify-center items-center bg-white dark:bg-slate-950 relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />

                  {/* Active step screen preview content */}
                  <div className="w-full h-full flex flex-col justify-between relative z-10 min-h-[300px]">
                    
                    {/* Simulated Frame Header */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-900/60 px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800/85 mb-4 select-none">
                      <div>SCREEN_INDEX: 0{videoDemoStep + 1} // ACTIVE</div>
                      <div>60 FPS // BUFFERED</div>
                    </div>

                    {/* Step Visual Representation */}
                    <div className="flex-grow flex items-center justify-center p-4">
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={videoDemoStep}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex flex-col items-center justify-center text-center space-y-4"
                        >
                          {videoDemoStep === 0 && (
                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl max-w-sm w-full text-left font-mono text-xs text-indigo-600 dark:text-indigo-300 shadow-xl relative overflow-hidden">
                              <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                              <p className="text-slate-500 mb-2">// raw_user_bio.txt</p>
                              <p className="text-slate-700 dark:text-slate-350 leading-relaxed">
                                "Saya Faisal, 5 tahun mengelola sistem SaaS. Berpengalaman di React, Laravel, merancang REST API, memimpin tim, dan menyukai analisis basis data. Saat ini ingin naik level posisi sebagai Engineering Manager..."
                              </p>
                              <div className="w-2 h-4 bg-indigo-400 dark:bg-indigo-450 mt-2 animate-pulse inline-block" />
                            </div>
                          )}

                          {videoDemoStep === 1 && (
                            <div className="flex flex-col items-center space-y-4">
                              <div className="relative w-20 h-20">
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                              </div>
                              <div className="font-mono text-xs text-slate-500 dark:text-slate-400 space-y-1 animate-pulse">
                                <p className="text-indigo-600 dark:text-indigo-400 font-bold">GEMINI AI MODEL PROCESSING</p>
                                <p>Extracting competence clusters...</p>
                                <p>Structuring career summary...</p>
                              </div>
                            </div>
                          )}

                          {videoDemoStep === 2 && (
                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl w-full max-w-md text-left space-y-3 shadow-xl">
                              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
                                <span className="text-emerald-600 dark:text-emerald-500 text-xs font-bold font-mono">CLASSIFICATION SUCCESSFUL</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 justify-start">
                                <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 text-[10px] font-bold px-2.5 py-0.5 rounded-md">Software Engineering Master</span>
                                <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/60 text-[10px] font-bold px-2.5 py-0.5 rounded-md">Architectural Mastery</span>
                                <span className="bg-pink-50 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/60 text-[10px] font-bold px-2.5 py-0.5 rounded-md">Project Management</span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                "Sangat handal dalam restrukturisasi data bernilai tinggi, optimasi REST API, dan memimpin tim developer tingkat lanjut."
                              </p>
                            </div>
                          )}

                          {videoDemoStep === 3 && (
                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-center space-y-4 max-w-sm shadow-xl">
                              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                                <Check className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="text-slate-900 dark:text-white font-extrabold text-sm">{lang === 'id' ? "Sertifikasi Brand Berhasil" : "Asset Generation Completed"}</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{lang === 'id' ? "Unduhan PDF & Excel siap digunakan" : "PDF and Spreadsheet exports are compiled"}</p>
                              </div>
                              <div className="flex gap-2 justify-center">
                                <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 px-3 py-1 rounded">faisal_report.pdf</div>
                                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-emerald-900/40 px-3 py-1 rounded">faisal_skills.xlsx</div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Bottom playback controller progress layout */}
                    <div className="space-y-3 pt-4 select-none">
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono font-medium">
                        <div>0:{(videoDemoStep * 20).toString().padStart(2, '0')}</div>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          <span>STEP AUTOMAIN ACTIVE</span>
                        </div>
                        <div>1:32</div>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000"
                          style={{ width: `${((videoDemoStep + 1) / 4) * 100}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Side: Navigation tabs & Controls */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900/40 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-black text-slate-500 dark:text-slate-455 tracking-wider uppercase mb-4 font-mono">
                      {lang === 'id' ? "LANGKAH ALUR KERJA" : "DEMO OPERATIONS FLOW"}
                    </h4>
                    
                    <div className="space-y-3">
                      {videoSteps.map((step, idx) => (
                        <button
                          key={idx}
                          onClick={() => setVideoDemoStep(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 block relative overflow-hidden ${
                            videoDemoStep === idx 
                              ? 'bg-indigo-600 border-indigo-600 shadow-md text-white' 
                              : 'bg-transparent border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {videoDemoStep === idx && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                          )}
                          <h5 className="font-extrabold text-xs tracking-tight">{step.title}</h5>
                          <p className="text-[11px] leading-snug mt-1 opacity-85">{step.desc}</p>
                          
                          {videoDemoStep === idx && (
                            <div className="mt-2 text-[9px] font-bold font-mono text-indigo-250 dark:text-indigo-305 text-white/90">
                              {step.stats.label}: {step.stats.val}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Player button actions bar */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setVideoDemoStep((prev) => (prev - 1 + 4) % 4)}
                      className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-white font-medium"
                    >
                      {lang === 'id' ? "Kembali" : "Previous"}
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setVideoDemoStep((prev) => (prev + 1) % 4)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow"
                    >
                      {lang === 'id' ? "Lanjut" : "Next Step"}
                    </Button>
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LandingPage;
