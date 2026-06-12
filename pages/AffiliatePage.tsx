import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  DollarSign, 
  Share2, 
  Copy, 
  TrendingUp, 
  Gift,
  ArrowUpRight,
  CheckCircle2,
  Info,
  QrCode,
  Sparkles,
  Award,
  CirclePercent,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { mockBackend } from '../lib/mock-backend';
import { User, AffiliateData } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const AffiliatePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user] = useState<User | null>(mockBackend.getCurrentUser());
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [isProcessingpayout, setIsProcessingPayout] = useState(false);

  const fetchAffiliateStats = () => {
    if (user) {
      setAffiliate(mockBackend.getAffiliateData(user.id));
    }
  };

  useEffect(() => {
    fetchAffiliateStats();
  }, [user]);

  const copyReferralCode = () => {
    if (affiliate) {
      navigator.clipboard.writeText(affiliate.referralCode);
      toast.success(
        i18n.language === 'id' 
          ? `Kode referal "${affiliate.referralCode}" disalin!` 
          : `Referral code "${affiliate.referralCode}" copied to clipboard!`
      );
    }
  };

  const copyReferralLink = () => {
    if (affiliate) {
      const link = `https://brandvision.ai/register?ref=${affiliate.referralCode}`;
      navigator.clipboard.writeText(link);
      toast.success(
        i18n.language === 'id' 
          ? "Tautan kemitraan berhasil disalin!" 
          : "Referral partner link copied to clipboard!"
      );
    }
  };

  const handleRequestPayout = async () => {
    if (!affiliate) return;
    const balance = affiliate.pendingCommission || 0;
    
    if (balance < 50) {
      toast.error(
        i18n.language === 'id' 
          ? `Batas minimum penarikan adalah $50.00. Saldo Anda saat ini: $${balance.toFixed(2)}` 
          : `Minimum payout threshold is $50.00. Your current balance is $${balance.toFixed(2)}`
      );
      return;
    }

    setIsProcessingPayout(true);
    toast.message(
      i18n.language === 'id' ? "Memvalidasi pengajuan saldo..." : "Validating secure withdrawal routes...",
      { description: i18n.language === 'id' ? "Silakan tunggu sebentar." : "Routing to connected PayPal/Stripe account." }
    );

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate deduction and register transaction
      toast.success(
        i18n.language === 'id' 
          ? `Penarikan sebesar $${balance.toFixed(2)} berhasil diajukan! Dana akan dikirim ke akun utama Anda.` 
          : `Successfully requested payout of $${balance.toFixed(2)}! Funds will clear in your connected account.`
      );
      
      // Clear balance locally for demonstration
      setAffiliate({
        ...affiliate,
        pendingCommission: 0
      });
    } catch {
      toast.error("Withdrawal routing failed. Please try again later.");
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const stats = [
    { 
      label: i18n.language === 'id' ? "Total Referal" : "Total Referrals", 
      value: affiliate?.referrals || 0, 
      desc: i18n.language === 'id' ? "Akun yang didaftarkan" : "Registered partner users",
      icon: Users, 
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" 
    },
    { 
      label: i18n.language === 'id' ? "Akumulasi Komisi" : "Total Commission", 
      value: `$${(affiliate?.totalCommission || 0).toFixed(2)}`, 
      desc: i18n.language === 'id' ? "Laba bersih terkumpul" : "Overall lifetime earnings",
      icon: DollarSign, 
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" 
    },
    { 
      label: i18n.language === 'id' ? "Saldo Tertunda" : "Pending Payout", 
      value: `$${(affiliate?.pendingCommission || 0).toFixed(2)}`, 
      desc: i18n.language === 'id' ? "Dapat ditarik" : "Available to request",
      icon: TrendingUp, 
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" 
    },
    { 
      label: i18n.language === 'id' ? "Rasio Konversi" : "Conversion Rate", 
      value: "14.2%", 
      desc: i18n.language === 'id' ? "Klik vs pendaftaran" : "Visit clicks converted",
      icon: ArrowUpRight, 
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40" 
    },
  ];

  return (
    <div className="space-y-8 pb-12 text-left">
      
      {/* Header segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-3.5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-150 bg-clip-text text-transparent">
            {i18n.language === 'id' ? "Program Kemitraan Affiliate" : "Affiliate Program Workspace"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {i18n.language === 'id' 
              ? "Bagikan BrandVision AI ke jaringan Anda dan nikmati komisi berulang sebesar 30% selamanya." 
              : "Share BrandVision AI and command 30% recurring lifetime commissions on premium subscriptions."}
          </p>
        </div>
        
        <Button 
          onClick={handleRequestPayout}
          disabled={isProcessingpayout}
          className="gap-2 h-11 px-6 rounded-2xl cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
        >
          {isProcessingpayout ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <DollarSign className="w-4 h-4 text-indigo-205" />
          )}
          <span>{i18n.language === 'id' ? "Tarik Saldo Komisi" : "Request Payout"}</span>
        </Button>
      </div>

      {/* Metrics Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100/10", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl.5 font-extrabold text-slate-800 dark:text-white mt-0.5">{stat.value}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{stat.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Referral segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-2 border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-505 shrink-0" />
              <span>{i18n.language === 'id' ? "Tautan Referal Pribadi Anda" : "Your Referral Link"}</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1 font-medium">
              {i18n.language === 'id' ? "Bagikan tautan unik ini di artikel, sosmed, atau LinkedIn untuk mengunci rujukan karir." : "Share this with your professional circle and earn lifetime revenue."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input 
                  readOnly 
                  value={`https://brandvision.ai/register?ref=${affiliate?.referralCode || "BV9821"}`} 
                  className="pr-24 bg-slate-50 dark:bg-slate-950 border-slate-200 h-11 rounded-2xl text-xs font-mono font-bold"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 text-indigo-600 hover:text-indigo-700 font-bold text-xs rounded-xl cursor-pointer"
                  onClick={copyReferralLink}
                >
                  <Copy className="w-3.5 h-3.5 mr-1" /> 
                  <span>{i18n.language === 'id' ? "Salin" : "Copy"}</span>
                </Button>
              </div>
              <Button variant="outline" size="icon" className="w-11 h-11 rounded-2xl text-slate-500 border-slate-200 hover:bg-slate-50">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/10 space-y-2">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Referral Code</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono font-extrabold text-slate-800 dark:text-white">{affiliate?.referralCode}</span>
                  <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-slate-100 rounded-lg" onClick={copyReferralCode}>
                    <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/10 space-y-2">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Commission Tier Rate</p>
                <div className="flex items-center justify-between">
                  <span className="text-md font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                    <CirclePercent className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>30% Lifetime recurring</span>
                  </span>
                  <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 border border-emerald-200/20 rounded-full font-bold text-[9px]">ACTIVE</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 flex items-center gap-2">
                <Gift className="w-4 h-4 text-indigo-505" />
                <span>{i18n.language === 'id' ? "Mekanisme Kerja Komisi" : "How The System Operates"}</span>
              </h4>
              
              <div className="grid gap-3.5">
                {[
                  i18n.language === 'id' ? "Sebarkan link atau kupon referal unik Anda ke klien atau teman." : "Share your unique referral link or code on LinkedIn, Twitter, or your blog.",
                  i18n.language === 'id' ? "Rekan Anda mendaftar dan mendapatkan potongan gratis 10% di bulan pertama." : "Your friends sign up and get a 10% discount on their first billing cycle.",
                  i18n.language === 'id' ? "Anda mendapat komisi 30% dari biaya berlangganan Pro mereka selamanya." : "You earn 30% recurring commission for as long as they stay premium Pro models.",
                  i18n.language === 'id' ? "Pembayaran otomatis dikirimkan setiap awal bulan jika saldo Anda melebihi $50.00." : "Payouts are routed directly to your billing parameters on the 1st of every month."
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <div className="w-5.5 h-5.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0 font-bold flex items-center justify-center text-[10px]">
                      {i + 1}
                    </div>
                    <p className="font-medium pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right payout progress card widget */}
        <div className="space-y-6">
          <Card className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-md font-bold text-slate-800 dark:text-white">
                {i18n.language === 'id' ? "Target Penarikan" : "Payout Threshold"}
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1 font-medium">Minimum cashout balance is $50.00</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              <div className="text-center space-y-1.5 p-4.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-2xl">
                <p className="text-3.5xl font-extrabold text-slate-900 dark:text-white tracking-tight">${(affiliate?.pendingCommission || 0).toFixed(2)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{i18n.language === 'id' ? "Saldo Anda Sekarang" : "Available balance"}</p>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>{i18n.language === 'id' ? "Progres Target" : "Payout Progress"}</span>
                  <span>{Math.min(100, ((affiliate?.pendingCommission || 0) / 50) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={((affiliate?.pendingCommission || 0) / 50) * 100} className="h-2 bg-slate-100 dark:bg-slate-800" />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/10 flex gap-3 text-left">
                <Info className="w-4 h-4 text-indigo-505 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {i18n.language === 'id' 
                    ? "Pembayaran dikirim setiap tanggal 1. Pastikan rincian akun bank/PayPal Anda lengkap di halaman pengaturan." 
                    : "Revenue clearings process automatically on the 1st. Ensure your deposit accounts are set in settings."}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="bg-slate-50/20 pt-4 pb-4 border-t border-slate-100 dark:border-slate-800">
              <Button 
                onClick={handleRequestPayout}
                disabled={(affiliate?.pendingCommission || 0) < 50 || isProcessingpayout}
                className="w-full h-10 rounded-xl cursor-pointer text-xs font-bold bg-indigo-600 hover:bg-indigo-705 text-white shadow-xs"
              >
                <span>{i18n.language === 'id' ? "Tarik Dana Sekarang" : "Request Payout Now"}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default AffiliatePage;
