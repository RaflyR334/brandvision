import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { 
  Lock, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  ShieldCheck, 
  CheckCircle2,
  Settings,
  Languages,
  Eye,
  MessageSquare,
  Trash2,
  RefreshCcw,
  AlertTriangle,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { mockBackend } from '../lib/mock-backend';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Form states for password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Config States
  const [bellEnabled, setBellEnabled] = useState(true);
  const [toastEnabled, setToastEnabled] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  // Database Maintenance State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Load state from local storage
    setBellEnabled(localStorage.getItem('bell_notifications_enabled') !== 'false');
    setToastEnabled(localStorage.getItem('toast_notifications_enabled') !== 'false');
  }, []);

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === 'dark';

  const handleToggleTheme = (checked: boolean) => {
    const nextTheme = checked ? 'dark' : 'light';
    setTheme(nextTheme);
    toast.success(
      i18n.language === 'id' 
        ? `Mode ${checked ? "Gelap" : "Terang"} diaktifkan` 
        : `${checked ? "Dark" : "Light"} mode enabled successfully`
    );
  };

  const handleToggleBell = (checked: boolean) => {
    setBellEnabled(checked);
    localStorage.setItem('bell_notifications_enabled', String(checked));
    
    // Dispatch system-wide event so the layout or notification systems react instantly
    window.dispatchEvent(new Event('settings_change'));

    toast.success(
      checked 
        ? (i18n.language === 'id' ? "Lonceng notifikasi header diaktifkan." : "Header notification bell enabled.")
        : (i18n.language === 'id' ? "Lonceng notifikasi dinonaktifkan." : "Header notification bell deactivated.")
    );
  };

  const handleToggleToast = (checked: boolean) => {
    setToastEnabled(checked);
    localStorage.setItem('toast_notifications_enabled', String(checked));

    // If enabled, toast a confirmation. If disabled, do nothing (toasts are now suppressed!)
    if (checked) {
      toast.success(
        i18n.language === 'id' ? "Pop-up toast notifikasi diaktifkan!" : "Toast notification pop-ups activated!"
      );
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(i18n.language === 'id' ? "Mohon lengkapi seluruh kolom password." : "Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(i18n.language === 'id' ? "Konfirmasi password baru tidak cocok." : "New password confirmations do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        i18n.language === 'id' ? "Password akun Anda berhasil diperbarui!" : "Account password updated successfully!"
      );

      // Clean up inputs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error("An error occurred during password change.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Wipe all user data
  const handleDeleteAllData = async () => {
    const user = mockBackend.getCurrentUser();
    if (!user) return;
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1505));
      mockBackend.deleteAllUserData(user.id);
      
      // Refresh context globally
      window.dispatchEvent(new Event('profile_update'));
      window.dispatchEvent(new Event('subscription_change'));
      
      setShowDeleteModal(false);
      toast.success(
        i18n.language === 'id'
          ? "Semua data klasifikasi, riwayat, dan aktivitas Anda telah dihapus secara permanen!"
          : "All your classification histories, metrics, and activity logs have been permanently erased!"
      );
    } catch {
      toast.error("An error occurred during data removal.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Re-seed default database records
  const handleResetToSeeder = async () => {
    const user = mockBackend.getCurrentUser();
    if (!user) return;
    setIsSeeding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1805));
      mockBackend.resetToDefaultSeed(user.id);
      
      // Refresh context globally
      window.dispatchEvent(new Event('profile_update'));
      window.dispatchEvent(new Event('subscription_change'));
      
      setShowSeedModal(false);
      toast.success(
        i18n.language === 'id'
          ? "Database dipulihkan ke data seeder semula! Semua demo record aktif kembali."
          : "System database successfully restored to default seeded records!"
      );
    } catch {
      toast.error("An error occurred during data seeding.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-305 text-left">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3.5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
          {i18n.language === 'id' ? "Pengaturan Aplikasi" : "Application Settings"}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {i18n.language === 'id' 
            ? "Kelola preferensi visual, keamanan kredensial, dan filter notifikasi realtime Anda." 
            : "Configure visual interfaces, account security rules, and real-time notification filters."}
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-8">
        
        {/* Modern Tabs Bar */}
        <TabsList className="h-auto bg-slate-100/70 dark:bg-slate-950/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 max-w-2xl w-full flex flex-wrap md:flex-nowrap gap-1">
          <TabsTrigger value="notifications" className="text-xs font-bold py-2.5 rounded-xl flex-1">
            <div className="flex items-center justify-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{i18n.language === 'id' ? "Notifikasi" : "Notifications"}</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="appearance" className="text-xs font-bold py-2.5 rounded-xl flex-1">
            <div className="flex items-center justify-center gap-2">
              <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span>{i18n.language === 'id' ? "Tampilan" : "Appearance"}</span>
            </div>
          </TabsTrigger>

          <TabsTrigger value="security" className="text-xs font-bold py-2.5 rounded-xl flex-1">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{i18n.language === 'id' ? "Keamanan" : "Security"}</span>
            </div>
          </TabsTrigger>

          <TabsTrigger value="system" className="text-xs font-bold py-2.5 rounded-xl flex-1">
            <div className="flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
              <span>{i18n.language === 'id' ? "Sistem" : "System DB"}</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* 1. Notifications configuration Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/30 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/80 px-6 py-5">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-500" />
                <span>{i18n.language === 'id' ? "Atur Notifikasi Sistem" : "Notification System Controls"}</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 font-medium">
                {i18n.language === 'id' 
                  ? "Tentukan kanal notifikasi mana yang ingin Anda tampilkan atau sembunyikan." 
                  : "Mute or allow dynamic real-time communication channels on your dashboard."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-6 divide-y divide-slate-100 dark:divide-slate-800/80">
              
              {/* Toggle 1: Bell Icon in Header */}
              <div className="flex items-center justify-between py-5 first:pt-0">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {i18n.language === 'id' ? "Lonceng Notifikasi Header" : "Header Notification Bell"}
                  </Label>
                  <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed font-semibold">
                    {i18n.language === 'id' 
                      ? "Aktifkan atau nonaktifkan ikon lonceng notifikasi berwarna biru di header atas." 
                      : "Control if the notification pull-drawer icon appears on the global header navigation bar."}
                  </p>
                </div>
                <Switch checked={bellEnabled} onCheckedChange={handleToggleBell} />
              </div>

              {/* Toggle 2: Toast Notifikasi */}
              <div className="flex items-center justify-between py-5">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {i18n.language === 'id' ? "Pop-up Toast Notifikasi" : "Toast Notification Pop-ups"}
                  </Label>
                  <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed font-semibold">
                    {i18n.language === 'id' 
                      ? "Tampilkan pesan melayang singkat di sudut layar ketika tindakan sukses dieksekusi." 
                      : "Display animated float messages at the bottom-right for system events (e.g. save details)."}
                  </p>
                </div>
                <Switch checked={toastEnabled} onCheckedChange={handleToggleToast} />
              </div>

              {/* Toggle 3: Email Reports / Weekly News */}
              <div className="flex items-center justify-between py-5 last:pb-0">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {i18n.language === 'id' ? "Laporan Kinerja Mingguan" : "Weekly Report Backups"}
                  </Label>
                  <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed font-semibold">
                    {i18n.language === 'id' 
                      ? "Kirimkan ringkasan aktivitas klasifikasi brand digital Anda ke kotak masuk email." 
                      : "Receive an automated summary newsletter containing overall digital metrics and referral payouts."}
                  </p>
                </div>
                <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Appearance & Localization Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/30 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/80 px-6 py-5">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" />
                <span>{i18n.language === 'id' ? "Tema & Kebahasaan" : "Theme & Localization Settings"}</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 font-medium">
                {i18n.language === 'id' 
                  ? "Atur bahasa antarmuka aplikasi dan atur preferensi kontras layar." 
                  : "Customize user-interface display parameters, theme modes, and global languages."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-6 space-y-6">
              
              {/* Dark mode switch */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {isDarkMode ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>{i18n.language === 'id' ? "Mode Gelap (Dark Mode)" : "Dark Contrast Mode"}</span>
                  </Label>
                  <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed font-semibold">
                    {i18n.language === 'id' 
                      ? "Ubah tampilan antarmuka ke palet warna gelap yang ramah di mata." 
                      : "Switch screen contrast to dim-dark cosmic space canvases, protecting eye comfort in low-light environments."}
                  </p>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={handleToggleTheme} />
              </div>

              {/* Language Selector */}
              <div className="space-y-2.5 text-left pt-2">
                <Label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-indigo-500" />
                  <span>{i18n.language === 'id' ? "Bahasa Aplikasi" : "System Language"}</span>
                </Label>
                <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mb-3">
                  {i18n.language === 'id'
                    ? "Tentukan bahasa utama pelokalan untuk semua halaman aplikasi dashboard."
                    : "Select the primary localization language for overall texts, tables, and system guides."}
                </p>
                
                <Select 
                  defaultValue={i18n.language} 
                  onValueChange={(val) => {
                    i18n.changeLanguage(val);
                    toast.success(
                      val === 'id' 
                        ? "Bahasa berhasil diubah ke Bahasa Indonesia!" 
                        : "Language successfully updated to English!"
                    );
                  }}
                >
                  <SelectTrigger className="w-full md:w-[260px] bg-slate-50/50 dark:bg-slate-950/55 border-slate-200 dark:border-slate-800 h-11 rounded-xl text-xs font-bold focus:ring-indigo-500">
                    <SelectValue placeholder="System Language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-800">
                    <SelectItem value="en" className="text-xs font-semibold">English (US)</SelectItem>
                    <SelectItem value="id" className="text-xs font-semibold">Bahasa Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Account / Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/30 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/80 px-6 py-5">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" />
                <span>{i18n.language === 'id' ? "Ubah Password Akun" : "Account Password Security"}</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 font-medium">
                {i18n.language === 'id' 
                  ? "Atur ulang password lama Anda untuk keamanan berkala akun Anda." 
                  : "Change or renew passwords regular to prevent credential leaks."}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="px-6 py-6 space-y-5">
                
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="current-password" className="text-xs font-bold text-slate-600 dark:text-slate-350">
                    {i18n.language === 'id' ? "Password Sekarang" : "Current Password"}
                  </Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 h-11 rounded-xl text-xs font-medium focus:ring-slate-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="new-password" className="text-xs font-bold text-slate-600 dark:text-slate-350">
                      {i18n.language === 'id' ? "Password Baru" : "New Password"}
                    </Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 h-11 rounded-xl text-xs font-medium focus:ring-slate-500"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="confirm-password" className="text-xs font-bold text-slate-600 dark:text-slate-350">
                      {i18n.language === 'id' ? "Konfirmasi Password Baru" : "Confirm New Password"}
                    </Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 h-11 rounded-xl text-xs font-medium focus:ring-slate-500"
                    />
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-slate-50/10 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isUpdatingPassword}
                  className="bg-indigo-600 hover:bg-indigo-705 text-white h-11 px-6 rounded-xl text-xs font-bold gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4 text-indigo-300" />
                  <span>{isUpdatingPassword ? (i18n.language === 'id' ? "Memproses..." : "Renewing...") : (i18n.language === 'id' ? "Perbarui Password" : "Save Password")}</span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* 4. Database Maintenance / System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card className="border border-red-100 dark:border-red-950/20 shadow-sm bg-red-500/5 dark:bg-red-550/5 rounded-3xl overflow-hidden">
            <CardHeader className="bg-red-50/20 dark:bg-red-950/10 border-b border-red-100/40 dark:border-red-950/20 px-6 py-5">
              <CardTitle className="text-base font-bold text-red-650 dark:text-red-405 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span>{i18n.language === 'id' ? "Alat Pemeliharaan Database" : "Database System Maintenance"}</span>
              </CardTitle>
              <CardDescription className="text-xs text-red-600/60 dark:text-red-400/50 font-medium">
                {i18n.language === 'id' 
                  ? "Atur ulang riwayat Anda atau pulihkan seeder database demo yang orisinal." 
                  : "Cautionary: Irreversible actions regarding your persistent local sandbox databases."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Seed Data Block */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2 text-left">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md border border-indigo-100/10">
                      <RefreshCcw className="w-3 h-3 animate-spin duration-1000" />
                      Restore Seed
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white pt-1">
                      {i18n.language === 'id' ? "Seeder Data ke Semula" : "Restore Seeder Defaults"}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed font-semibold">
                      {i18n.language === 'id' 
                        ? "Kembalikan database Anda seperti semula dengan data dummy demo (admin, affiliator, sample-history, notifications)." 
                        : "Refresh all fields back to active demo simulation databases with user records."}
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => setShowSeedModal(true)}
                    className="mt-6 w-full h-10 border border-indigo-300 hover:border-indigo-400 text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    {i18n.language === 'id' ? "Jalankan Data Seeder" : "Restore Seeded Database"}
                  </Button>
                </div>

                {/* Delete/Clear Data Block */}
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-2 text-left">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-red-650 dark:text-red-405 uppercase bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-md border border-red-100/10">
                      <Trash2 className="w-3 h-3" />
                      Danger Zone
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white pt-1">
                      {i18n.language === 'id' ? "Hapus Semua Data" : "Wipe Personal History"}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 leading-relaxed font-semibold">
                      {i18n.language === 'id' 
                        ? "Hapus semua klasifikasi riwayat, logs, komisi afiliasi, dan notifikasi." 
                        : "Permanently erase your active history folders, credentials and diagnostic analytics."}
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => setShowDeleteModal(true)}
                    className="mt-6 w-full h-10 bg-red-600 hover:bg-red-705 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                  >
                    {i18n.language === 'id' ? "Hapus Seluruh Data" : "Wipe All My Data"}
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* CONFIRMATION POP UP MODALS */}
      
      {/* 1. Reset Seeder Confirmation Dialog */}
      <Dialog open={showSeedModal} onOpenChange={setShowSeedModal}>
        <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border border-indigo-100/30">
              <RefreshCcw className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {i18n.language === 'id' ? "Konfirmasi Restore Database" : "Confirm Database Restore"}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500 leading-relaxed">
              {i18n.language === 'id' 
                ? "Apakah Anda yakin ingin memulihkan seeder database orisinal? Tindakan ini akan mengosongkan perubahan lokal saat ini dan memulihkan Demo Account default." 
                : "This will clean current changes and restore default simulation records (including dummy transactions and analytics). This process is instantaneous."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3 sm:gap-0 flex flex-col-reverse sm:flex-row justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowSeedModal(false)}
              className="rounded-xl h-10 text-xs font-bold border-slate-200 dark:border-slate-800"
            >
              {i18n.language === 'id' ? "Batal" : "Cancel"}
            </Button>
            <Button 
              type="button" 
              disabled={isSeeding}
              onClick={handleResetToSeeder}
              className="bg-indigo-600 hover:bg-indigo-705 text-white rounded-xl h-10 text-xs font-bold"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  <span>Seeding...</span>
                </>
              ) : (
                i18n.language === 'id' ? "Ya, Restore Data" : "Confirm Restore"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Wipe All Data Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl border border-red-500/10 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center border border-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {i18n.language === 'id' ? "Konfirmasi Penghapusan Permanen" : "Confirm Permanent Destruction"}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500 leading-relaxed">
              {i18n.language === 'id' 
                ? "PERINGATAN! Tindakan ini TIDAK dapat dibatalkan. Mengonfirmasi ini akan menghapus permanen seluruh riwayat klasifikasi brand Anda, riwayat afiliasi, dan log sistem secara permanen." 
                : "WARNING! This action cannot be undone. Confirming will permanently erase all your mapped classifications, history lists, pending payouts and activities."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3 sm:gap-0 flex flex-col-reverse sm:flex-row justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
              className="rounded-xl h-10 text-xs font-bold border-slate-200 dark:border-slate-800"
            >
              {i18n.language === 'id' ? "Batal" : "Cancel"}
            </Button>
            <Button 
              type="button" 
              disabled={isDeleting}
              onClick={handleDeleteAllData}
              className="bg-red-650 hover:bg-red-705 text-white rounded-xl h-10 text-xs font-bold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  <span>Wiping...</span>
                </>
              ) : (
                i18n.language === 'id' ? "Ya, Hapus Semua" : "Yes, Erase Everything"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
};

export default SettingsPage;
