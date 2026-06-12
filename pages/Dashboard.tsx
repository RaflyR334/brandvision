import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Sparkles, 
  History, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Zap,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Tv,
  Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { mockBackend } from '../lib/mock-backend';
import { User, HistoryItem, ActivityLog } from '../types';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import Onboarding from '../components/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [user, setUser] = useState<User | null>(mockBackend.getCurrentUser());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  
  // Real-time fluctuating state variables
  const [liveStrength, setLiveStrength] = useState(84.6);
  const [latency, setLatency] = useState(38);
  const [requestsLastMin, setRequestsLastMin] = useState(14);
  const [liveChartData, setLiveChartData] = useState([
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 12 },
    { name: 'Fri', count: 8 },
    { name: 'Sat', count: 3 },
    { name: 'Sun', count: 2 },
  ]);

  useEffect(() => {
    const loadState = () => {
      const currentUser = mockBackend.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const loadedHistory = mockBackend.getHistory(currentUser.id);
        setHistory(loadedHistory);
        setLogs(mockBackend.getActivityLogs(currentUser.id));
        
        // Populate chart data based on history count variations or simulated load patterns
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const isNewUser = loadedHistory.length === 0;
        const baseCounts = isNewUser ? [0, 0, 0, 0, 0, 0, 0] : [3, 5, 4, 8, 6, 2, 2];
        const loadedCount = loadedHistory.length;
        
        if (!isNewUser) {
          // Inject current real history counts into today's item (assuming current day is Friday)
          baseCounts[4] = Math.max(baseCounts[4], loadedCount);
        }
        setLiveChartData(days.map((day, ix) => ({
          name: day,
          count: baseCounts[ix]
        })));
      }
    };

    loadState();

    // Listen to plan toggles and edits
    window.addEventListener('subscription_change', loadState);
    return () => {
      window.removeEventListener('subscription_change', loadState);
    };
  }, []);

  // Real-time stats simulation hook
  useEffect(() => {
    const statsTimer = setInterval(() => {
      // Fluctuate brand strength by ±0.2%
      setLiveStrength(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return parseFloat(Math.min(99.9, Math.max(70.0, prev + delta)).toFixed(1));
      });

      // Fluctuate latency
      setLatency(prev => {
        const delta = Math.round((Math.random() - 0.5) * 6);
        return Math.min(120, Math.max(15, prev + delta));
      });

      // Fluctuate active connection flows
      setRequestsLastMin(prev => {
        const delta = Math.round((Math.random() - 0.5) * 4);
        return Math.min(48, Math.max(5, prev + delta));
      });
    }, 4500);

    return () => clearInterval(statsTimer);
  }, []);

  const stats = [
    { 
      label: i18n.language === 'id' ? "Total Klasifikasi" : "Total Classifications", 
      value: history.length, 
      change: `+${history.length > 0 ? history.length * 15 : 0}%`, 
      trend: "up", 
      icon: Zap,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      description: i18n.language === 'id' ? "Dihitung dari riwayat profil" : "Derived from your profile history"
    },
    { 
      label: i18n.language === 'id' ? "Kekuatan Brand (Live)" : "Brand Strength (Live)", 
      value: `${liveStrength}%`, 
      change: "+0.4%", 
      trend: "up", 
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: i18n.language === 'id' ? "Metrik konsistensi brand aktif" : "Real-time consistency sentiment score"
    },
    { 
      label: i18n.language === 'id' ? "Referral Aktif" : "Total Referrals", 
      value: mockBackend.getAffiliateData(user?.id || '').referrals, 
      change: "0%", 
      trend: "neutral", 
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: i18n.language === 'id' ? "Komisi terafiliasi" : "Joined via affiliate links"
    },
    { 
      label: i18n.language === 'id' ? "Sisa Kredit Scan" : "Credits Left", 
      value: user?.subscription === 'pro' ? "∞" : `${Math.max(0, 10 - history.length)} / 10`, 
      change: user?.subscription === 'pro' ? "UNLIMITED" : "SANDBOX", 
      trend: "neutral", 
      icon: Sparkles,
      color: "text-fuchsia-500",
      bg: "bg-fuchsia-500/10",
      description: user?.subscription === 'pro' ? "Sirkulasi Pro Aktif" : "Basic trial limitations"
    },
  ];

  // Recharts styling parameters derived from Theme state
  const primaryStroke = isDark ? '#818cf8' : '#4f46e5';
  const primaryFill = isDark ? 'rgba(129, 140, 248, 0.15)' : 'rgba(79, 70, 229, 0.08)';
  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
  const axisColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-8 pb-12">
      <Onboarding />

      {/* Dynamic Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 justify-between p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3.5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
              {i18n.language === 'id' ? `Selamat Datang, ${user?.name}` : `Welcome back, ${user?.name}`}
            </h1>
            <span className="flex h-3.5 w-3.5 items-center justify-center relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {i18n.language === 'id' 
              ? "Dashboard analitik real-time Anda untuk melacak klasifikasi brand personal."
              : "Your custom real-time analytics panel tracking neural personal brand expertise metrics."}
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/classify">
            <Button className="h-11 px-5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/15 font-bold text-xs gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
              <span>{i18n.language === 'id' ? "Klasifikasi Baru" : "New Classification"}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="border-none bg-white dark:bg-slate-900 shadow-sm shadow-slate-100/55 dark:shadow-none hover:shadow-md transition-shadow duration-300 rounded-3xl overflow-hidden group">
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2.5 rounded-2xl group-hover:scale-110 transition-transform duration-350", stat.bg)}>
                    <stat.icon className={cn("w-5.5 h-5.5", stat.color)} />
                  </div>
                  {stat.change && (
                    <Badge variant={stat.trend === 'up' ? 'success' : 'outline'} className={cn(
                      "gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full",
                      stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400" : "text-indigo-500 border-indigo-200 dark:border-indigo-900"
                    )}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : null}
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-505 block">{stat.label}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2.5xl font-extrabold text-slate-800 dark:text-white tracking-tight">{stat.value}</span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 italic pt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Analytical Chart & Subscription Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Card */}
        <Card className="lg:col-span-2 border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl text-left">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                  {i18n.language === 'id' ? "Tren Penggunaan & Detak Server" : "Usage Activity & Pulse"}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {i18n.language === 'id' ? "Skala aktivitas pemetaan neural brand mingguan" : "Activity frequencies of processed expertise classification queries"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block shrink-0" />
                <span>LATENCY: {latency}ms</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] w-full pt-4 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primaryStroke} stopOpacity={0.25}/>
                    <stop offset="100%" stopColor={primaryStroke} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: axisColor, fontWeight: '600' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: axisColor, fontWeight: '600' }} 
                  dx={-10} 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                  itemStyle={{ color: primaryStroke, fontWeight: 'bold', fontSize: '12px' }}
                  labelStyle={{ fontWeight: '800', fontSize: '11px', color: '#94a3b8' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={primaryStroke} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={2.5} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Status Card */}
        <Card className="border-none bg-gradient-to-br from-indigo-600 via-indigo-750 to-indigo-900 text-white rounded-3xl overflow-hidden relative shadow-lg shadow-indigo-600/10 text-left flex flex-col justify-between">
          <div className="absolute -top-6 -right-6 p-4 opacity-10">
            <Zap className="w-40 h-40 text-white" />
          </div>
          
          <CardHeader className="relative z-10">
            <Badge className="bg-white/10 text-white hover:bg-white/20 border-none font-bold text-[9px] w-fit mb-2">
              {user?.subscription === 'pro' ? "PRO ACCOUNT" : "SANDBOX STANDARD"}
            </Badge>
            <CardTitle className="text-white text-xl font-extrabold">{i18n.language === 'id' ? "Status Keanggotaan" : "Membership Status"}</CardTitle>
            <CardDescription className="text-indigo-200 font-semibold text-xs mt-1">
              {user?.subscription === 'pro' 
                ? (i18n.language === 'id' ? "Semua fitur ekosistem tidak terbatas" : "Unrestricted neural ecosystem processing tools")
                : (i18n.language === 'id' ? "Anda menggunakan paket Gratis" : "Currently confined to sandbox limits")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5 relative z-10 mt-auto pb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-100">
                <span>{i18n.language === 'id' ? "Pencadangan Bulanan" : "Monthly Space Allocated"}</span>
                <span>{user?.subscription === 'pro' ? (i18n.language === 'id' ? "Tak Terbatas" : "Unlimited") : `${Math.min(100, Math.round((history.length / 10) * 100))}%`}</span>
              </div>
              <Progress value={user?.subscription === 'pro' ? 100 : Math.min(100, (history.length / 10) * 100)} className="bg-white/20 h-2 rounded-full" />
            </div>
            
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-indigo-105 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{i18n.language === 'id' ? "Deteksi Klasifikasi AI" : "AI Classification Algorithms"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-indigo-105 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{i18n.language === 'id' ? "Ekspor PDF & Excel Riwayat" : "Unlimited Exports to PDF"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-indigo-105 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{i18n.language === 'id' ? "Dukungan Prioritas 24/7" : "Priority Affiliate Commissions"}</span>
              </div>
            </div>

            {user?.subscription !== 'pro' ? (
              <Link to="/subscription" className="block pt-2">
                <Button variant="secondary" className="w-full h-11 text-xs font-bold bg-white text-indigo-900 hover:bg-slate-50 hover:scale-[1.02] transform transition rounded-2xl border-none">
                  {i18n.language === 'id' ? "Tingkatkan Ke Pro" : "Upgrade to Pro"}
                </Button>
              </Link>
            ) : (
              <div className="pt-2">
                <div className="w-full bg-white/10 dark:bg-black/10 border border-white/10 py-2.5 px-4 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-4 h-4" />
                    {i18n.language === 'id' ? "Paket Pro Aktif" : "Pro Features Available"}
                  </span>
                  <p className="font-mono text-[10px] text-indigo-200">Unlimited Tier</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid: Recent History & Actions Log streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent History Card */}
        <Card className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl text-left">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-lg font-extrabold text-slate-800 dark:text-white">
                {i18n.language === 'id' ? "Klasifikasi Terbaru" : "Recent History"}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                {i18n.language === 'id' ? "Hasil analisis profil Anda" : "Your latest brand classifications"}
              </CardDescription>
            </div>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="gap-1 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                <span>{i18n.language === 'id' ? "Lihat Semua" : "View All"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-3.5">
              {history.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-slate-50 dark:border-transparent transition-all duration-200">
                  <div className="w-9 h-9 rounded-xl bg-indigo-55/10 bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 border border-indigo-200/20">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-grow min-w-0 text-left">
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{item.result.summary}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.result.expertiseAreas.slice(0, 3).map((area, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[9px] font-bold py-0.5 px-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">{area}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">
                    {i18n.language === 'id' ? "Belum ada klasifikasi." : "No history classifications mapped."}
                  </p>
                  <Link to="/classify" className="mt-2.5 inline-block">
                    <Button size="sm" variant="outline" className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold cursor-pointer">
                      {i18n.language === 'id' ? "Mulai Sekarang" : "Start Classifying"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Activity Log Stream */}
        <Card className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-3xl text-left">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-800 dark:text-white">
                  {i18n.language === 'id' ? "Arus Jaringan Log" : "Active Session Stream"}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {i18n.language === 'id' ? "Aktivitas instrumen akun langsung" : "Real-time query actions stream on your profile account"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">{requestsLastMin} rps</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-4">
              {logs.slice(0, 5).map((log, ix) => (
                <div key={log.id || ix} className="flex items-center gap-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-sm animate-pulse" />
                  <div className="flex-grow text-left">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100">{log.action}:</span>{' '}
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{log.details}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm font-semibold">
                  {i18n.language === 'id' ? "Belum ada log log tercatat." : "Session telemetry has not started."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
