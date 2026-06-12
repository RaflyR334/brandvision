import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Check, 
  Zap, 
  Clock, 
  CreditCard, 
  FileText, 
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
  Building2,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/table';
import { mockBackend } from '../lib/mock-backend';
import { User, Transaction } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const SubscriptionPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(mockBackend.getCurrentUser());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserDataAndTransactions = () => {
    const currentUser = mockBackend.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setTransactions(mockBackend.getTransactions(currentUser.id));
    }
  };

  useEffect(() => {
    loadUserDataAndTransactions();

    // Dynamically sync subscription updates across panels
    const handleSubChange = () => {
      loadUserDataAndTransactions();
    };
    window.addEventListener('subscription_change', handleSubChange);
    return () => {
      window.removeEventListener('subscription_change', handleSubChange);
    };
  }, []);

  const handleUpgrade = async () => {
    if (!user) return;
    setIsLoading(true);
    toast.message(
      i18n.language === 'id' ? "Menghubungkan ke gateway pembayaran..." : "Connecting to secure billing ledger...",
      { description: i18n.language === 'id' ? "Silakan tunggu sekitar 2 detik." : "Processing sandbox credentials." }
    );
    
    try {
      // Simulate payment processing latency
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      mockBackend.upgradeToPro(user.id);
      
      // Dispatch system-wide synchronized events so headers, sidebars update immediately
      window.dispatchEvent(new Event('subscription_change'));
      
      toast.success(
        i18n.language === 'id' 
          ? "Pembayaran Berhasil! Selamat Datang di Pro." 
          : "Upgrade successful! Welcome to the premium Brand tier."
      );
    } catch (error) {
      toast.error(i18n.language === 'id' ? "Pembayaran gagal. Coba lagi." : "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = user?.subscription || 'free';

  const plans = [
    {
      id: 'free',
      name: i18n.language === 'id' ? "Paket Starter" : "Starter Tier",
      price: "$0",
      period: i18n.language === 'id' ? "/selamanya" : "/forever",
      description: i18n.language === 'id' ? "Sangat baik untuk mengevaluasi fitur AI dasar" : "Perfect for testing fundamentally",
      features: [
        { name: i18n.language === 'id' ? "10 Klasifikasi per bulan" : "10 Classifications per month", unlocked: true },
        { name: i18n.language === 'id' ? "Deteksi AI Dasar" : "Basic AI Detection", unlocked: true },
        { name: i18n.language === 'id' ? "Unduh PDF Hasil" : "Export PDF Portfolio", unlocked: false },
        { name: i18n.language === 'id' ? "Ekspor Riwayat Excel" : "Export Excel Spreadsheet", unlocked: false },
        { name: i18n.language === 'id' ? "Auto-Save Klasifikasi" : "History Auto-Save Log", unlocked: false },
        { name: i18n.language === 'id' ? "Dukungan Prioritas 24/7" : "Priority Human Support", unlocked: false }
      ],
      current: currentPlan === 'free',
      buttonText: i18n.language === 'id' ? "Paket Berjalan" : "Current Sandbox Plan",
      buttonVariant: "outline" as const,
      disabled: true,
      highlight: false,
      style: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
    },
    {
      id: 'pro',
      name: "Pro Brand",
      price: "$19",
      period: i18n.language === 'id' ? "/bulan" : "/month",
      description: i18n.language === 'id' ? "Bagi profesional berambisi menonjol total" : "For ambitious experts aiming to command attention",
      features: [
        { name: i18n.language === 'id' ? "Klasifikasi Tanpa Batas" : "Unlimited Classifications", unlocked: true },
        { name: i18n.language === 'id' ? "Analisis AI Lanjutan" : "Advanced AI Analysis Plus", unlocked: true },
        { name: i18n.language === 'id' ? "Unduh PDF Hasil" : "Export PDF Portfolio", unlocked: true },
        { name: i18n.language === 'id' ? "Ekspor Riwayat Excel" : "Export Excel Spreadsheet", unlocked: true },
        { name: i18n.language === 'id' ? "Auto-Save Klasifikasi" : "History Auto-Save Log", unlocked: true },
        { name: i18n.language === 'id' ? "Dukungan Prioritas 24/7" : "Priority Human Support", unlocked: true }
      ],
      current: currentPlan === 'pro',
      buttonText: currentPlan === 'pro' ? (i18n.language === 'id' ? "Paket Berjalan" : "Active Pro Plan") : (i18n.language === 'id' ? "Mulai Akses Pro" : "Upgrade to Pro Brand"),
      buttonVariant: "default" as const,
      disabled: currentPlan === 'pro',
      highlight: true,
      style: "border-indigo-500 dark:border-indigo-650 ring-1 ring-indigo-100 dark:ring-indigo-950/50 bg-white dark:bg-slate-900 shadow-lg shadow-indigo-600/10"
    },
    {
      id: 'enterprise',
      name: i18n.language === 'id' ? "Paket Enterprise" : "Enterprise Brand",
      price: "$59",
      period: i18n.language === 'id' ? "/bulan" : "/month",
      description: i18n.language === 'id' ? "Bagi tim besar, agensi konsultasi, dan eksekutif" : "For agencies and teams demanding collaborative bounds",
      features: [
        { name: i18n.language === 'id' ? "Semua Keunggulan Paket Pro" : "Everything included in Pro", unlocked: true },
        { name: i18n.language === 'id' ? "Akses Multi-Seat Kolaboratif" : "Multi-seat Collaborative Accounts", unlocked: true },
        { name: i18n.language === 'id' ? "Desain PDF dengan Kustom Tema" : "Custom PDF Themes & Covers", unlocked: true },
        { name: i18n.language === 'id' ? "Integrasi Model Custom" : "Custom Language Models", unlocked: true },
        { name: i18n.language === 'id' ? "Manajer Akun Prioritas Pribadi" : "Dedicated 1-on-1 account manager", unlocked: true },
        { name: i18n.language === 'id' ? "Dukungan Zoom Langsung" : "Direct Live Call Support", unlocked: true }
      ],
      current: false,
      buttonText: i18n.language === 'id' ? "Hubungi Penjualan" : "Contact Enterprise",
      buttonVariant: "outline" as const,
      disabled: false,
      highlight: false,
      style: "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20"
    }
  ];

  return (
    <div className="space-y-12 pb-12 text-left">
      
      {/* Pricing header content */}
      <div className="text-center space-y-3">
        <Badge className="bg-indigo-600 text-white font-extrabold text-[9px] hover:bg-indigo-600 rounded-full py-0.5 px-3">
          BILLING SERVICE
        </Badge>
        <h1 className="text-3.5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
          {i18n.language === 'id' ? "Investasikan Karir & Reputasi Anda" : "Simple, Transparent Pricing"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto font-medium">
          {i18n.language === 'id' 
            ? "Pilih paket yang paling cocok untuk fase pertumbuhan karir Anda. Batalkan atau tingkatkan kapan saja." 
            : "Choose the package tailored to your career phase. Cancel or upgrade at any time."}
        </p>
      </div>

      {/* The replicated three cards from Landing Page */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex"
          >
            <Card className={cn(
              "relative flex flex-col border-2 rounded-3xl w-full justify-between overflow-hidden transition-all duration-350 hover:shadow-md",
              plan.style
            )}>
              {plan.highlight && (
                <div className="absolute top-0 right-0">
                  <span className="bg-indigo-600 text-white font-extrabold text-[9px] uppercase px-4 py-1.5 rounded-bl-3xl tracking-widest inline-block shadow-sm">
                    POPULAR
                  </span>
                </div>
              )}
              
              <div>
                <CardHeader className="pb-4">
                  <span className="text-md font-bold text-slate-800 dark:text-white uppercase tracking-wider block">
                    {plan.name}
                  </span>
                  <CardDescription className="text-xs text-slate-400 font-semibold mt-1 min-h-8">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4 flex items-baseline gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <span className="text-3xl.5 md:text-4.5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">
                    {i18n.language === 'id' ? "Apa yang didapat:" : "What's Included:"}
                  </span>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {feature.unlocked ? (
                          <div className="p-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" title="Locked in Free">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className={cn(!feature.unlocked && "text-slate-400 dark:text-slate-500 line-through decoration-slate-200/40")}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <CardFooter className="pt-6 pb-6 border-t border-slate-50 dark:border-slate-850">
                <Button 
                  className={cn(
                    "w-full h-11 text-xs font-bold rounded-2xl transition-transform duration-150 cursor-pointer",
                    plan.current 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold border border-slate-200/50 dark:border-slate-700" 
                      : plan.id === 'pro' 
                        ? "bg-indigo-600 hover:bg-indigo-705 text-white shadow-md shadow-indigo-600/10 hover:scale-[1.01]" 
                        : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-100"
                  )} 
                  variant={plan.buttonVariant}
                  disabled={plan.disabled || isLoading}
                  onClick={() => {
                    if (plan.id === 'pro') {
                      handleUpgrade();
                    } else if (plan.id === 'enterprise') {
                      toast.info(
                        i18n.language === 'id' 
                          ? "Sales Hub: Hubungi bellcorpadm@gmail.com untuk mengatur integrasi multi-seat." 
                          : "Contact bellcorpadm@gmail.com to establish multi-seat integration."
                      );
                    }
                  }}
                >
                  {isLoading && plan.id === 'pro' ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{i18n.language === 'id' ? "Memproses..." : "Processing..."}</span>
                    </span>
                  ) : (
                    <span>{plan.buttonText}</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modern Locked Matrix Table Comparison */}
      <Card className="max-w-4xl mx-auto border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden mt-10">
        <div className="p-6 border-b border-slate-150 dark:border-slate-800">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
            {i18n.language === 'id' ? "Komparasi Fitur & Pembatasan" : "Full Feature Comparison Matrix"}
          </h3>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-medium">
            {i18n.language === 'id' ? "Bandingkan limitasi Sandbox dengan fitur premium Pro secara detail" : "Direct visual overview of sandbox constraints vs pro availability"}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/20">
              <TableRow className="border-none">
                <TableHead className="py-3 px-6 text-slate-450 dark:text-slate-500 font-bold text-xs uppercase">{i18n.language === 'id' ? "Fitur Layanan" : "Service Feature"}</TableHead>
                <TableHead className="py-3 px-6 text-slate-450 dark:text-slate-500 font-bold text-xs uppercase">{i18n.language === 'id' ? "Starter (Gratis)" : "Starter (Free)"}</TableHead>
                <TableHead className="py-3 px-6 text-slate-450 dark:text-slate-500 font-bold text-xs uppercase">{i18n.language === 'id' ? "Pro Brand ($19)" : "Pro Brand ($19)"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
              
              <TableRow className="border-none">
                <TableCell className="py-3.5 px-6 font-bold text-xs text-slate-700 dark:text-slate-300">
                  {i18n.language === 'id' ? "Batas Scan Klasifikasi" : "Monthly Scan Limit"}
                </TableCell>
                <TableCell className="py-3.5 px-6">
                  <Badge variant="outline" className="text-[10px] text-red-500 border-red-200">10 Scans / mo</Badge>
                </TableCell>
                <TableCell className="py-3.5 px-6">
                  <Badge variant="success" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-none">
                    {i18n.language === 'id' ? "Tanpa Batas" : "UNLIMITED"}
                  </Badge>
                </TableCell>
              </TableRow>

              <TableRow className="border-none">
                <TableCell className="py-3.5 px-6 font-bold text-xs text-slate-705 dark:text-slate-300">
                  {i18n.language === 'id' ? "Ekspor PDF Portofolio" : "Printable PDF export option"}
                </TableCell>
                <TableCell className="py-3.5 px-6 text-slate-400">
                  <span className="flex items-center gap-1.5 text-xs text-red-500">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>Locked</span>
                  </span>
                </TableCell>
                <TableCell className="py-3.5 px-6 text-slate-800 dark:text-slate-20 w-fit">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                    <Unlock className="w-3.5 h-3.5 shrink-0" />
                    <span>Unlocked</span>
                  </span>
                </TableCell>
              </TableRow>

              <TableRow className="border-none">
                <TableCell className="py-3.5 px-6 font-bold text-xs text-slate-705 dark:text-slate-300">
                  {i18n.language === 'id' ? "Ekspor Excel Klasifikasi" : "Spreadsheet download export"}
                </TableCell>
                <TableCell className="py-3.5 px-6 text-slate-400">
                  <span className="flex items-center gap-1.5 text-xs text-red-500">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>Locked</span>
                  </span>
                </TableCell>
                <TableCell className="py-3.5 px-6">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                    <Unlock className="w-3.5 h-3.5 shrink-0" />
                    <span>Unlocked</span>
                  </span>
                </TableCell>
              </TableRow>

              <TableRow className="border-none">
                <TableCell className="py-3.5 px-6 font-bold text-xs text-slate-705 dark:text-slate-300">
                  {i18n.language === 'id' ? "Edit Tag Spesialisasi Tambahan" : "Add/Edit custom tags"}
                </TableCell>
                <TableCell className="py-3.5 px-6 text-slate-400">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Support Limited</span>
                  </span>
                </TableCell>
                <TableCell className="py-3.5 px-6">
                  <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                    <Unlock className="w-3.5 h-3.5 shrink-0" />
                    <span>Unlocked (Full)</span>
                  </span>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Real-time Invoice Ledger History */}
      <div className="max-w-4xl mx-auto space-y-5">
        <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-800 dark:text-white">
          <Clock className="w-5.5 h-5.5 text-indigo-550 shrink-0" />
          <span>{i18n.language === 'id' ? "Aktivitas tagihan & Transaksi" : "Billing Ledger"}</span>
        </h2>
        
        {/* Desktop Table View */}
        <Card className="hidden md:block border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800">
              <TableRow className="border-none">
                <TableHead className="py-3 px-6 text-slate-450 dark:text-slate-500 font-bold text-xs uppercase">Invoice ID</TableHead>
                <TableHead className="py-3 px-6 text-slate-455 dark:text-slate-500 font-bold text-xs uppercase">Plan</TableHead>
                <TableHead className="py-3 px-6 text-slate-455 dark:text-slate-500 font-bold text-xs uppercase">Amount</TableHead>
                <TableHead className="py-3 px-6 text-slate-455 dark:text-slate-500 font-bold text-xs uppercase">Date</TableHead>
                <TableHead className="py-3 px-6 text-slate-455 dark:text-slate-500 font-bold text-xs uppercase">Status</TableHead>
                <TableHead className="py-3 px-6 text-slate-455 dark:text-slate-500 font-bold text-xs uppercase text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {transactions.map((t) => (
                <TableRow key={t.id} className="border-none hover:bg-slate-50/25 dark:hover:bg-slate-850/10">
                  <TableCell className="py-4 px-6 font-mono font-bold text-xs">INV-{t.id.substring(0, 8).toUpperCase()}</TableCell>
                  <TableCell className="py-4 px-6 font-bold text-xs capitalize text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-505" />
                      {t.plan}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 font-extrabold text-xs text-slate-800 dark:text-white">${t.amount.toFixed(2)}</TableCell>
                  <TableCell className="py-4 px-6 font-semibold text-xs text-slate-450 dark:text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant={t.status === 'success' ? 'success' : 'destructive'} className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-md",
                      t.status === 'success' ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-500/10 text-rose-500 hover:bg-red-500/10"
                    )}>
                      {t.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right pr-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        toast.success(i18n.language === 'id' ? "Kwitansi PDF berhasil diunduh." : "Receipt PDF statement downloaded.");
                      }}
                      className="gap-1.5 text-slate-450 hover:text-indigo-600 rounded-lg h-8 cursor-pointer font-bold text-[11px]"
                    >
                      <FileText className="w-3.5 h-3.5" /> 
                      <span>Receipt</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow className="border-none">
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                    No transactions ledger recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Mobile Cards View */}
        <div className="md:hidden space-y-4">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 p-5 rounded-2.5xl shadow-sm text-left space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">INV-{t.id.substring(0, 8).toUpperCase()}</p>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mt-1 capitalize">{t.plan} Plan</h3>
                </div>
                <Badge variant={t.status === 'success' ? 'success' : 'destructive'} className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-md",
                  t.status === 'success' ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-500/10 text-rose-500 hover:bg-red-500/10"
                )}>
                  {t.status.toUpperCase()}
                </Badge>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <div>
                  <span className="text-slate-450 dark:text-slate-500 font-semibold">{new Date(t.createdAt).toLocaleDateString()}</span>
                  <p className="text-base font-black text-slate-905 dark:text-white mt-0.5">${t.amount.toFixed(2)}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    toast.success(i18n.language === 'id' ? "Kwitansi PDF berhasil diunduh." : "Receipt PDF statement downloaded.");
                  }}
                  className="gap-1 px-3 h-8 text-[11px] font-bold rounded-lg cursor-pointer text-slate-500 border-slate-200"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> 
                  <span>Receipt</span>
                </Button>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800 py-12 px-4 rounded-2.5xl text-center">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No transactions ledger recorded.</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default SubscriptionPage;
