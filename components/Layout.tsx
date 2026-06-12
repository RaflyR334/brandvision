import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  CreditCard, 
  Users, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Sparkles,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Check,
  ShieldCheck,
  Languages,
  User as UserIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { mockBackend } from '../lib/mock-backend';
import { User, Notification } from '../types';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const [user, setUser] = useState<User | null>(mockBackend.getCurrentUser());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [bellNotificationsEnabled, setBellNotificationsEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const refreshUserDataAndNotifications = () => {
    const currentUser = mockBackend.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setNotifications(mockBackend.getNotifications(currentUser.id));
    }
  };

  const refreshSettings = () => {
    setBellNotificationsEnabled(localStorage.getItem('bell_notifications_enabled') !== 'false');
  };

  useEffect(() => {
    refreshUserDataAndNotifications();
    refreshSettings();
    
    // Listen for custom subscription-change events to keep UI synchronized
    const handleSubChange = () => {
      refreshUserDataAndNotifications();
    };
    
    window.addEventListener('subscription_change', handleSubChange);
    window.addEventListener('settings_change', refreshSettings);
    window.addEventListener('profile_update', refreshUserDataAndNotifications);
    
    return () => {
      window.removeEventListener('subscription_change', handleSubChange);
      window.removeEventListener('settings_change', refreshSettings);
      window.removeEventListener('profile_update', refreshUserDataAndNotifications);
    };
  }, []);

  useEffect(() => {
    if (!user && location.pathname !== '/' && !location.pathname.startsWith('/auth')) {
      navigate('/');
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    mockBackend.logout();
    setUser(null);
    toast.success(i18n.language === 'id' ? "Berhasil keluar" : "Logged out successfully");
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
    toast.success(newLang === 'id' ? "Bahasa diubah ke Indonesia" : "Language set to English");
  };

  const handleTogglePro = (checked: boolean) => {
    if (!user) return;
    const nextPlan = checked ? 'pro' : 'free';
    mockBackend.setSubscriptionPlan(user.id, nextPlan);
    
    // Dispatch system events so other open pages dynamically sync their state immediately
    window.dispatchEvent(new Event('subscription_change'));
    
    toast.success(
      nextPlan === 'pro' 
        ? (i18n.language === 'id' ? "Premium Pro Aktif! Akun ditingkatkan." : "Premium Pro Active! Account upgraded.")
        : (i18n.language === 'id' ? "Free Plan Aktif! Fitur akan dibatasi." : "Free Plan Active! Features are now limited.")
    );
  };

  const handleMarkAllRead = () => {
    if (!user) return;
    notifications.forEach(n => {
      if (!n.read) {
        mockBackend.markNotificationRead(n.id);
      }
    });
    refreshUserDataAndNotifications();
    toast.success(i18n.language === 'id' ? "Semua notifikasi ditandai dibaca" : "All notifications marked as read");
  };

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: Sparkles, label: t('classify'), path: '/classify' },
    { icon: History, label: t('history'), path: '/history' },
    { icon: CreditCard, label: t('subscription'), path: '/subscription' },
    { icon: Users, label: t('affiliate'), path: '/affiliate' },
    { icon: Settings, label: t('settings'), path: '/settings' },
    { icon: HelpCircle, label: t('faq'), path: '/support' },
  ];

  if (!user && location.pathname !== '/' && !location.pathname.startsWith('/auth')) {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col md:flex-row text-slate-800 dark:text-slate-100 font-sans transition-colors duration-350">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-slate-900 border-slate-150/40 dark:border-slate-800/80 z-30 sticky top-0 transition-colors">
        <Link to="/" className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/10 overflow-hidden bg-indigo-600">
            <img src="/logo.png" alt="BrandVision Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-950 to-indigo-600 dark:from-white dark:to-indigo-305 bg-clip-text text-transparent">BrandVision</span>
        </Link>
        
        <div className="flex items-center gap-1.5">
          {/* Language control button */}
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="w-8.5 h-8.5 text-slate-505 dark:text-slate-400">
            <Languages className="w-4.5 h-4.5" />
          </Button>

          {/* Theme switcher */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="w-8.5 h-8.5 text-slate-505 dark:text-slate-400">
            {mounted && resolvedTheme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-indigo-505" />}
          </Button>

          {/* User profile dropdown directly on modern mobile header */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8.5 w-8.5 rounded-full relative outline-none cursor-pointer">
                <Avatar className="w-8 h-8 border border-indigo-200/50 dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-950">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 mt-1 shadow-xl">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-lg py-2 text-xs font-semibold cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4 text-slate-400" />
                {i18n.language === 'id' ? "Profil Saya" : "My Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/subscription')} className="rounded-lg py-2 text-xs font-semibold cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4 text-slate-400" />
                {i18n.language === 'id' ? "Informasi Tagihan" : "Billing Details"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg py-2 cursor-pointer text-red-500 text-xs font-semibold">
                <LogOut className="mr-2 h-4 w-4 text-red-405" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* FIXED, NON-SCROLL STICKY SIDEBAR (for desktop, persists at 100vh) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-205/85 dark:border-slate-800/80 h-screen sticky top-0 shrink-0 select-none">
        <div className="h-full flex flex-col p-4 justify-between">
          <div>
            {/* Sidebar Logo */}
            <Link to="/" className="hidden md:flex items-center gap-2.5 mb-8 px-2 py-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 overflow-hidden bg-indigo-600">
                <img src="/logo.png" alt="BrandVision Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-950 to-slate-800 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">BrandVision</span>
                <p className="text-[9px] uppercase font-mono font-bold text-indigo-500 tracking-wider -mt-1">Contech Network</p>
              </div>
            </Link>

            {/* Sidebar Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative",
                      isActive 
                        ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/15" 
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 transition-transform duration-200 group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500")} />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* LOWER SIDEBAR - Pro switch & Logout stays fixed at the bottom */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Toggle Pro Plan Panel */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  PRO PLAN
                </span>
                <Badge variant={user?.subscription === 'pro' ? "default" : "outline"} className={cn("text-[9px] px-2 py-0.5 font-bold", user?.subscription === 'pro' ? "bg-indigo-600 text-white hover:bg-indigo-600" : "text-slate-400")}>
                  {user?.subscription === 'pro' ? 'ACTIVE' : 'FREE'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                  {i18n.language === 'id' ? "Aktifkan Fitur" : "Enable Features"}
                </span>
                <Switch 
                  id="pro-toggle"
                  checked={user?.subscription === 'pro'}
                  onCheckedChange={handleTogglePro}
                />
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start gap-3 h-11 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 rounded-xl font-semibold"
            >
              <LogOut className="w-4.5 h-4.5 text-slate-400 hover:text-red-500" />
              <span>{t('logout')}</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER (Includes beautifully designed Header & Content) */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">
        
        {/* DESKTOP HEADER (Modern, beautiful navigation/control rail) */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 h-18 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/40 z-30 sticky top-0 transition-colors">
          
          {/* Breadcrumb Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md uppercase border border-indigo-100/30">
              {location.pathname.substring(1) || 'App'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {user?.subscription === 'pro' ? 'PRO Plan' : 'Free Sandbox'}
            </span>
          </div>

          {/* Quick Actions Panel: Bell Notification, Theme, Language & User Dropdown */}
          <div className="flex items-center gap-4">
            
            {/* 1. Language toggler */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLanguage} 
              className="gap-2 border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs px-3 h-9 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{i18n.language.toUpperCase()}</span>
            </Button>

            {/* 2. Theme switcher with Next-Themes */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-sm text-slate-500"
              title="Change Theme"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </Button>

            {/* 3. Notification system with beautiful dropdown drawer */}
            {bellNotificationsEnabled && (
              <DropdownMenu open={isNotifOpen} onOpenChange={setIsNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-9 h-9 border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl relative shadow-sm text-slate-500">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl mt-1 overflow-hidden">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {i18n.language === 'id' ? "Notifikasi" : "Notifications"}
                    </span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {i18n.language === 'id' ? "Tandai dibaca" : "Read all"}
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-450 dark:text-slate-500">
                        {i18n.language === 'id' ? "Tidak ada notifikasi" : "No notifications yet."}
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={cn(
                            "p-3.5 text-left transition-colors",
                            notif.read ? "bg-transparent" : "bg-indigo-50/20 dark:bg-indigo-950/15"
                          )}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className={cn("text-xs font-bold", notif.read ? "text-slate-700 dark:text-slate-300" : "text-indigo-600 dark:text-indigo-400")}>
                              {notif.title}
                            </span>
                            {!notif.read && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[9px] font-mono text-slate-400 mt-1.5 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Space line spacer */}
            <span className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* 4. Beautiful Account dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="h-10 hover:bg-slate-100 dark:hover:bg-slate-800/80 p-1 pl-2.5 pr-1.5 rounded-full flex items-center gap-2 border border-transparent hover:border-slate-300 dark:hover:border-slate-800 outline-none transition-colors duration-200 cursor-pointer">
                  <div className="flex flex-col items-end text-right select-none pr-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user?.name}</span>
                    <span className="text-[10px] font-bold text-indigo-500 capitalize">{user?.role}</span>
                  </div>
                  <Avatar className="w-8 h-8 border ring-1 ring-slate-100 dark:ring-slate-800">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                      {user?.name ? user.name.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 mt-1.5 shadow-xl">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl mb-1.5 text-left">
                  <span className="text-xs font-mono font-bold text-slate-400 block uppercase">Log In as</span>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block truncate">{user?.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 block truncate">{user?.email}</span>
                </div>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-lg py-2 cursor-pointer text-xs font-semibold">
                  <UserIcon className="mr-2.5 h-4 w-4 text-slate-400" />
                  {i18n.language === 'id' ? "Profil Saya" : "My Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-lg py-2 cursor-pointer text-xs font-semibold">
                  <Settings className="mr-2.5 h-4 w-4 text-slate-400" />
                  {i18n.language === 'id' ? "Pengaturan Aplikasi" : "App Settings"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/subscription')} className="rounded-lg py-2 cursor-pointer text-xs font-semibold">
                  <CreditCard className="mr-2.5 h-4 w-4 text-slate-400" />
                  {i18n.language === 'id' ? "Informasi Tagihan" : "Billing Details"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg py-2 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold">
                  <LogOut className="mr-2.5 h-4 w-4 text-red-400" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        {/* Dynamic Inner page container */}
        <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto outline-none pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (fixed floating pill background) */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 h-16 bg-white opacity-100 dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800/90 rounded-2.5xl shadow-2xl z-40 flex items-center justify-around px-1 py-1 select-none">
        
        {/* Item 1: Dashboard */}
        <Link 
          to="/dashboard" 
          className={cn(
            "flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all duration-150 active:scale-95",
            location.pathname === '/dashboard' ? "text-indigo-600 dark:text-indigo-400 font-extrabold" : "text-slate-400 hover:text-slate-650"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-bold tracking-tight">{t('dashboard')}</span>
        </Link>

        {/* Item 2: Classify */}
        <Link 
          to="/classify" 
          className={cn(
            "flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all duration-150 active:scale-95",
            location.pathname === '/classify' ? "text-indigo-600 dark:text-indigo-400 font-extrabold" : "text-slate-400 hover:text-slate-650"
          )}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-bold tracking-tight">{i18n.language === 'id' ? "Klasifikasi" : "Classify"}</span>
        </Link>

        {/* Item 3: History */}
        <Link 
          to="/history" 
          className={cn(
            "flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all duration-150 active:scale-95",
            location.pathname === '/history' ? "text-indigo-600 dark:text-indigo-400 font-extrabold" : "text-slate-400 hover:text-slate-650"
          )}
        >
          <History className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-bold tracking-tight">{i18n.language === 'id' ? "Riwayat" : "History"}</span>
        </Link>

        {/* Item 4: More/Lainnya */}
        <button
          onClick={() => setIsMobileMoreOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all duration-150 active:scale-95 outline-none cursor-pointer",
            isMobileMoreOpen ? "text-indigo-600 dark:text-indigo-400 font-extrabold" : "text-slate-400 hover:text-slate-650"
          )}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[9px] mt-1 font-bold tracking-tight">{i18n.language === 'id' ? "Lainnya" : "More"}</span>
        </button>
      </div>

      {/* Mobile "More" Drawer bottom sheet */}
      {isMobileMoreOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileMoreOpen(false)}
            className="fixed inset-0 z-45 bg-slate-950/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          />

          {/* Bottom Sheet wrapper (opaque, solid, beautiful menu cards) */}
          <div className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white opacity-100 dark:bg-slate-900 dark:opacity-100 rounded-t-[28px] z-50 shadow-2xl border-t border-slate-200/80 dark:border-slate-800/95 p-6 flex flex-col overflow-y-auto md:hidden animate-in slide-in-from-bottom duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-1.5">
                <LayoutDashboard className="text-indigo-600 w-4.5 h-4.5" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {i18n.language === 'id' ? "Navigasi Menu" : "System Navigation"}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMoreOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-200"
              >
                <X className="w-4.5 h-4.5" />
              </Button>
            </div>

            {/* Menu options grid layout */}
            <div className="grid grid-cols-2 gap-3.5 mb-5">
              
              {/* Option: Subscription */}
              <Link 
                to="/subscription" 
                onClick={() => setIsMobileMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-150 active:scale-95",
                  location.pathname === '/subscription' 
                    ? "bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-500/55 text-indigo-600 dark:text-indigo-400 font-extrabold" 
                    : "bg-slate-50/50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                )}
              >
                <CreditCard className="w-5.5 h-5.5 mb-2 text-indigo-500" />
                <span className="text-xs font-bold">{i18n.language === 'id' ? "Subscription" : "Billing & Pro"}</span>
              </Link>

              {/* Option: Affiliate */}
              <Link 
                to="/affiliate" 
                onClick={() => setIsMobileMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-150 active:scale-95",
                  location.pathname === '/affiliate' 
                    ? "bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-500/55 text-indigo-600 dark:text-indigo-400 font-extrabold" 
                    : "bg-slate-50/50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                )}
              >
                <Users className="w-5.5 h-5.5 mb-2 text-indigo-500" />
                <span className="text-xs font-bold">{i18n.language === 'id' ? "Afiliasi" : "Affiliate"}</span>
              </Link>

              {/* Option: Settings */}
              <Link 
                to="/settings" 
                onClick={() => setIsMobileMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-150 active:scale-95",
                  location.pathname === '/settings' 
                    ? "bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-500/55 text-indigo-600 dark:text-indigo-400 font-extrabold" 
                    : "bg-slate-50/50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                )}
              >
                <Settings className="w-5.5 h-5.5 mb-2 text-indigo-500" />
                <span className="text-xs font-bold">{i18n.language === 'id' ? "Pengaturan" : "Settings"}</span>
              </Link>

              {/* Option: Support */}
              <Link 
                to="/support" 
                onClick={() => setIsMobileMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-150 active:scale-95",
                  location.pathname === '/support' 
                    ? "bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-500/55 text-indigo-600 dark:text-indigo-400 font-extrabold" 
                    : "bg-slate-50/50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                )}
              >
                <HelpCircle className="w-5.5 h-5.5 mb-2 text-indigo-500" />
                <span className="text-xs font-bold">{i18n.language === 'id' ? "Bantuan" : "Support & FAQ"}</span>
              </Link>
            </div>

            {/* Pro Plan Switch component */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150/40 dark:border-slate-800/90 mb-5 select-none text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-705 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-500 animate-pulse" />
                  PRO PLAN LICENSE
                </span>
                <Badge variant={user?.subscription === 'pro' ? "default" : "outline"} className={cn("text-[9px] px-2 py-0.5 font-bold", user?.subscription === 'pro' ? "bg-indigo-600 text-white" : "text-slate-400")}>
                  {user?.subscription === 'pro' ? 'ACTIVE' : 'FREE'}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {i18n.language === 'id' ? "Dapatkan Fitur Premium" : "Toggle License Access"}
                </span>
                <Switch 
                  id="mobile-pro-plan-toggle"
                  checked={user?.subscription === 'pro'}
                  onCheckedChange={(checked) => {
                    handleTogglePro(checked);
                    setIsMobileMoreOpen(false);
                  }}
                />
              </div>
            </div>

            {/* Logout button row */}
            <Button 
              variant="ghost" 
              onClick={() => {
                handleLogout();
                setIsMobileMoreOpen(false);
              }}
              className="w-full justify-center gap-2.5 h-11 text-red-550 dark:text-red-400 bg-red-50/25 dark:bg-red-950/15 border border-red-100/20 rounded-xl font-bold text-xs cursor-pointer active:scale-95"
            >
              <LogOut className="w-4.5 h-4.5 text-red-500" />
              <span>{t('logout')}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
