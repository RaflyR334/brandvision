import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTheme } from 'next-themes';
import { 
  Sparkles, 
  Loader2, 
  Eye, 
  EyeOff, 
  Globe, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Lock, 
  ArrowLeft, 
  Sun, 
  Moon,
  ShieldCheck,
  FileText,
  Languages
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { toast } from 'sonner';
import { mockBackend } from '../lib/mock-backend';
import { motion, AnimatePresence } from 'framer-motion';

// Separate validation schemas for Login and Register
const loginSchema = z.object({
  email: z.string().email("Format email tidak valid / Invalid email format"),
  password: z.string().min(6, "Password minimal 6 karakter / Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter / Name must be at least 2 characters"),
  phoneNumber: z.string().min(8, "Nomor telepon minimal 8 angka / Phone number must be at least 8 digits"),
  email: z.string().email("Format email tidak valid / Invalid email format"),
  password: z.string().min(8, "Password minimal 8 karakter / Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Konfirmasi password minimal 8 karakter / Password verification must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok / Password confirmation does not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/auth/login';
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  // States for Popup Modals (Terms & Privacy)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy'>('terms');

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === 'dark';

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      mockBackend.login(data.email, data.password);
      
      toast.success(
        i18n.language === 'id' 
          ? "Selamat datang kembali!" 
          : "Welcome back to your workspace!"
      );
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        i18n.language === 'id'
          ? "Akun tidak ditemukan atau password salah."
          : (error instanceof Error ? error.message : "Authentication failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Save number to phoneNumber using updated register method
      mockBackend.register(data.name, data.email, data.password, data.phoneNumber);
      
      toast.success(
        i18n.language === 'id'
          ? "Registrasi sukses! Selamat datang."
          : "Account registered successfully! Welcome aboard."
      );
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const currentLang = i18n.language;

  const handleOpenModal = (type: 'terms' | 'privacy') => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="h-screen max-h-screen w-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden p-3 md:p-6 lg:p-8 select-none">
      {/* Dynamic Background Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Controls Toolbar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 py-1.5 z-20 shrink-0">
        <Link to="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-1.5 text-xs font-bold rounded-2xl h-9.5 px-3.5 bg-white/40 dark:bg-slate-900/45 border border-slate-200/50 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>{currentLang === 'id' ? "Kembali" : "Back to Home"}</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {/* Quick Language Toggle */}
          <Select 
            value={currentLang} 
            onValueChange={(val) => {
              i18n.changeLanguage(val);
              toast.success(
                val === 'id' 
                  ? "Bahasa diubah ke Bahasa Indonesia!" 
                  : "Language updated to English!"
              );
            }}
          >
            <SelectTrigger className="h-9.5 w-[110px] bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/60 text-xs font-bold rounded-2xl py-1 px-2.5">
              <Languages className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-800">
              <SelectItem value="en" className="text-xs font-semibold">EN (US)</SelectItem>
              <SelectItem value="id" className="text-xs font-semibold">ID (Indo)</SelectItem>
            </SelectContent>
          </Select>

          {/* Theme Toggle Button */}
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => {
              const nextTh = isDarkMode ? 'light' : 'dark';
              setTheme(nextTh);
              toast.success(
                currentLang === 'id' 
                  ? `Mode ${nextTh === 'dark' ? "Gelap" : "Terang"} diaktifkan!` 
                  : `${nextTh === 'dark' ? "Dark" : "Light"} mode enabled!`
              );
            }}
            className="w-9.5 h-9.5 bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl hover:bg-white dark:hover:bg-slate-900 cursor-pointer text-slate-500 shadow-xs"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-505" />}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center my-auto z-10 w-full min-h-0">
        <div className="w-full max-w-[420px] flex flex-col min-h-0">
          
          {/* Logo Heading */}
          <div className="text-center space-y-1 mb-3.5 shrink-0 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-1.5 justify-center">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <Sparkles className="text-white w-4.5 h-4.5 animate-pulse" />
              </div>
              <span className="text-xl md:text-2.5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                BrandVision AI
              </span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider pt-0.5">
              {currentLang === 'id' ? "PENGKLASIFIKASI KEAHLIAN NEURAL" : "NEURAL EXPERTISE CLASSIFIER"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col min-h-0"
              >
                <Card className="border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[24px] shadow-xl dark:shadow-none p-1 overflow-hidden text-left flex flex-col min-h-0">
                  <CardHeader className="space-y-1 px-5 pt-4 pb-2 shrink-0">
                    <CardTitle className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {currentLang === 'id' ? "Masuk ke Akun" : "Welcome Back"}
                    </CardTitle>
                    <CardDescription className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-tight">
                      {currentLang === 'id' 
                        ? "Masukkan kredensial Anda untuk mengakses dashboard analitik." 
                        : "Enter your registered credentials to access your live metrics dashboard."}
                    </CardDescription>
                  </CardHeader>

                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="flex flex-col min-h-0 overflow-hidden">
                    <CardContent className="space-y-3 px-5 pb-3 pt-1.5 overflow-y-auto max-h-[38dvh] md:max-h-none scrollbar-none">
                      {/* Email field */}
                      <div className="space-y-1">
                        <Label htmlFor="email-login" className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-350">
                          {currentLang === 'id' ? "Alamat Email" : "Email Address"}
                        </Label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input 
                            id="email-login" 
                            type="email" 
                            placeholder={currentLang === 'id' ? "nama@contoh.id" : "name@example.com"}
                            disabled={isLoading}
                            {...loginForm.register('email')}
                            className="bg-transparent border-slate-200 dark:border-slate-800 pl-9.5 h-10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all placeholder:text-slate-400/80"
                          />
                        </div>
                        {loginForm.formState.errors.email && (
                          <p className="text-[10px] font-bold text-red-500 mt-0.5 pl-0.5">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password field */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password-login" className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-350">
                            Password
                          </Label>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input 
                            id="password-login" 
                            type={showPassword ? "text" : "password"} 
                            placeholder={currentLang === 'id' ? "Sandi Anda" : "Your Password"}
                            disabled={isLoading}
                            {...loginForm.register('password')}
                            className="bg-transparent border-slate-200 dark:border-slate-800 pl-9.5 pr-9.5 h-10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all placeholder:text-slate-400/80"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-[10px] font-bold text-red-500 mt-0.5 pl-0.5">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3 px-5 pb-4 pt-1 shrink-0">
                      <div className="flex flex-col gap-2 w-full">
                        <Button 
                          type="submit" 
                          className="w-full h-10 md:h-11 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all shadow-md shadow-indigo-650/10" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                              <span>{currentLang === 'id' ? "Memvalidasi..." : "Verifying..."}</span>
                            </>
                          ) : (
                            currentLang === 'id' ? "Masuk Sekarang" : "Sign In"
                          )}
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="w-full h-9.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-800/40 border border-indigo-200/40 dark:border-slate-800/80 cursor-pointer transition-all"
                          onClick={() => {
                            mockBackend.login('demo@brandvision.ai', 'demo_password');
                            toast.success(
                              currentLang === 'id' 
                                ? "Selamat datang di Demo Account!" 
                                : "Welcome! Loaded simulation sandbox successfully."
                            );
                            navigate('/dashboard');
                          }}
                        >
                          {currentLang === 'id' ? "Gunakan Akun Demo" : "Try Demo Account"}
                        </Button>
                      </div>

                      <p className="text-center text-xs text-slate-405 dark:text-slate-400 font-semibold pt-1">
                        {currentLang === 'id' ? "Belum memiliki akun? " : "Don't have an account? "}
                        <Link 
                          to="/auth/register" 
                          className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline"
                        >
                          {currentLang === 'id' ? "Daftar di sini" : "Register here"}
                        </Link>
                      </p>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col min-h-0"
              >
                <Card className="border border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[24px] shadow-xl dark:shadow-none p-1 overflow-hidden text-left flex flex-col min-h-0">
                  <CardHeader className="space-y-0.5 px-5 pt-3.5 pb-1.5 shrink-0">
                    <CardTitle className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {currentLang === 'id' ? "Daftar Akun Baru" : "Register Account"}
                    </CardTitle>
                    <CardDescription className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-tight">
                      {currentLang === 'id' 
                        ? "Lengkapi detail formulir di bawah ini untuk memulai registrasi." 
                        : "Complete the credentials fields below to initialize your cloud workspace profile."}
                    </CardDescription>
                  </CardHeader>

                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="flex flex-col min-h-0 overflow-hidden">
                    <CardContent className="space-y-1.5 md:space-y-2.5 px-5 pb-2.5 pt-1 overflow-y-auto max-h-[42dvh] md:max-h-none scrollbar-thin">
                      
                      {/* Name input */}
                      <div className="space-y-0.5">
                        <Label htmlFor="name-register" className="text-[10px] md:text-xs font-bold text-slate-650 dark:text-slate-350">
                          {currentLang === 'id' ? "Nama Lengkap" : "Full Name"}
                        </Label>
                        <div className="relative">
                          <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input 
                            id="name-register" 
                            type="text" 
                            placeholder={currentLang === 'id' ? "Nama Anda" : "John Doe"}
                            disabled={isLoading}
                            {...registerForm.register('name')}
                            className="bg-transparent border-slate-200 dark:border-slate-800 pl-9.5 h-9.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all placeholder:text-slate-400/70"
                          />
                        </div>
                        {registerForm.formState.errors.name && (
                          <p className="text-[9px] font-bold text-red-500 mt-0.5">
                            {registerForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Phone Number input */}
                      <div className="space-y-0.5">
                        <Label htmlFor="phone-register" className="text-[10px] md:text-xs font-bold text-slate-650 dark:text-slate-350">
                          {currentLang === 'id' ? "Nomor Telepon" : "Phone Number"}
                        </Label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input 
                            id="phone-register" 
                            type="text" 
                            placeholder={currentLang === 'id' ? "Contoh: +6281234..." : "e.g., +1 234 567 890"}
                            disabled={isLoading}
                            {...registerForm.register('phoneNumber')}
                            className="bg-transparent border-slate-200 dark:border-slate-800 pl-9.5 h-9.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all placeholder:text-slate-400/70"
                          />
                        </div>
                        {registerForm.formState.errors.phoneNumber && (
                          <p className="text-[9px] font-bold text-red-500 mt-0.5">
                            {registerForm.formState.errors.phoneNumber.message}
                          </p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-0.5">
                        <Label htmlFor="email-register" className="text-[10px] md:text-xs font-bold text-slate-650 dark:text-slate-350">
                          {currentLang === 'id' ? "Alamat Email" : "Email Address"}
                        </Label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input 
                            id="email-register" 
                            type="email" 
                            placeholder={currentLang === 'id' ? "nama@contoh.id" : "name@example.com"}
                            disabled={isLoading}
                            {...registerForm.register('email')}
                            className="bg-transparent border-slate-200 dark:border-slate-800 pl-9.5 h-9.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all placeholder:text-slate-400/70"
                          />
                        </div>
                        {registerForm.formState.errors.email && (
                          <p className="text-[9px] font-bold text-red-500 mt-0.5">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password input */}
                      <div className="space-y-0.5">
                        <Label htmlFor="password-register" className="text-[10px] md:text-xs font-bold text-slate-650 dark:text-slate-350">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input 
                            id="password-register" 
                            type={showPassword ? "text" : "password"} 
                            placeholder={currentLang === 'id' ? "Min. 8 karakter" : "Min. 8 characters"}
                            disabled={isLoading}
                            {...registerForm.register('password')}
                            className="bg-transparent border-slate-200 dark:border-slate-800 pl-9.5 pr-9.5 h-9.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all placeholder:text-slate-400/70"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="text-[9px] font-bold text-red-500 mt-0.5">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password input */}
                      <div className="space-y-0.5">
                        <Label htmlFor="confirm-register" className="text-[10px] md:text-xs font-bold text-slate-650 dark:text-slate-350">
                          {currentLang === 'id' ? "Konfirmasi Password" : "Confirm Password"}
                        </Label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <Input 
                            id="confirm-register" 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder={currentLang === 'id' ? "Ulangi password" : "Repeat password"}
                            disabled={isLoading}
                            {...registerForm.register('confirmPassword')}
                            className="bg-transparent border-slate-200 dark:border-slate-800 pl-9.5 pr-10 h-9.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 transition-all placeholder:text-slate-400/70"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="text-[9px] font-bold text-red-500 mt-0.5">
                            {registerForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                    </CardContent>

                    <CardFooter className="flex flex-col space-y-2.5 px-5 pb-3.5 pt-1 shrink-0 animate-in fade-in duration-300">
                      <Button 
                        type="submit" 
                        className="w-full h-10 md:h-11 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-all shadow-md shadow-indigo-650/10" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                            <span>{currentLang === 'id' ? "Membuat akun..." : "Generating account..."}</span>
                          </>
                        ) : (
                          currentLang === 'id' ? "Daftar Akun" : "Register Account"
                        )}
                      </Button>

                      <p className="text-center text-xs text-slate-405 dark:text-slate-400 font-semibold pt-0.5">
                        {currentLang === 'id' ? "Sudah memiliki akun? " : "Already have an account? "}
                        <Link 
                          to="/auth/login" 
                          className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline"
                        >
                          {currentLang === 'id' ? "Masuk di sini" : "Log in here"}
                        </Link>
                      </p>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer copyright and Interactive Terms popup triggers */}
      <footer className="w-full py-1.5 text-center text-[11px] text-slate-400 dark:text-slate-500 mt-auto shrink-0 border-t border-slate-100/50 dark:border-slate-900/60">
        <div className="flex flex-col items-center gap-0.5">
          <p>
            {currentLang === 'id' ? "Dengan mengeklik Lanjutkan, Anda menyetujui " : "By clicking continue, you agree to our "}
            <button 
              type="button" 
              onClick={() => handleOpenModal('terms')}
              className="underline text-indigo-505 dark:text-indigo-450 hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold cursor-pointer focus:outline-hidden"
            >
              {currentLang === 'id' ? "Syarat Layanan" : "Terms of Service"}
            </button>
            {" "}
            {currentLang === 'id' ? "dan" : "and"}
            {" "}
            <button 
              type="button" 
              onClick={() => handleOpenModal('privacy')}
              className="underline text-indigo-505 dark:text-indigo-450 hover:text-indigo-600 dark:hover:text-indigo-300 font-semibold cursor-pointer focus:outline-hidden"
            >
              {currentLang === 'id' ? "Kebijakan Privasi" : "Privacy Policy"}
            </button>
            .
          </p>
          <p className="text-[10px] text-slate-400/70 dark:text-slate-600 font-mono">
            &copy; 12026 BrandVision AI. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Interactive POP-UP Modals for Terms & Privacy */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 text-left">
          <DialogHeader className="space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center border border-indigo-100/20 shrink-0">
              {modalType === 'terms' ? (
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <DialogTitle className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {modalType === 'terms' ? (
                currentLang === 'id' ? "Syarat & Ketentuan Layanan" : "Terms of Service & Agreements"
              ) : (
                currentLang === 'id' ? "Kebijakan Privasi Data" : "Data Privacy & Safekeeping Policy"
              )}
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-slate-400">
              {currentLang === 'id' 
                ? `Diperbarui terakhir Juni 2026. Menjamin integrasi sandbox AI yang aman.`
                : `Last updated June 12, 12026. Securing and validating offline integrity parameters.`}
            </DialogDescription>
          </DialogHeader>

          {/* Conditional content of modal details */}
          <div className="space-y-4 my-2 text-slate-650 dark:text-slate-300 leading-relaxed text-xs font-medium">
            {modalType === 'terms' ? (
              <>
                <p>
                  {currentLang === 'id' 
                    ? "Syarat Layanan ini mengatur akses, pendaftaran, dan seluruh visualisasi personal brand di bawah domain BrandVision AI."
                    : "These terms govern your active access, registration, and visual identity synthesis processed by BrandVision AI."}
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 dark:bg-indigo-400 mt-1.5 shrink-0" />
                    <p>
                      <strong>{currentLang === 'id' ? "Ketepatan AI: " : "AI Projections: "}</strong>
                      {currentLang === 'id'
                        ? "Seluruh saran, summary, dan bidang ilmu dihasilkan berbasis model optimisasi bahasa semata-berharga saran visual."
                        : "Our localized NLP outputs represent analytical predictions based purely on user bios, curated for reference purposes."}
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 dark:bg-indigo-400 mt-1.5 shrink-0" />
                    <p>
                      <strong>{currentLang === 'id' ? "Simpanan Mandiri: " : "Independent Vaults: "}</strong>
                      {currentLang === 'id'
                        ? "Setiap kredensial, logs, rincian afiliasi komisi disimpan dalam sandboxing browser (Local Storage) masing-masing."
                        : "Telemetry values, referral links, and passwords remain in your browser state, maintaining offline integrity."}
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 dark:bg-indigo-400 mt-1.5 shrink-0" />
                    <p>
                      <strong>{currentLang === 'id' ? "Penyalahgunaan API: " : "API Floods: "}</strong>
                      {currentLang === 'id'
                        ? "Sistem melarang manipulasi skrip atau requests banjir demi kelancaran simulasi digital multi user."
                        : "You agree not to bypass sandboxed variables, scrape server outputs, or load test local endpoints."}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>
                  {currentLang === 'id'
                    ? "Kami sangat menjaga integritas kerahasiaan personal data Anda agar tetap aman."
                    : "We maintain bulletproof transparency regarding your digital identity attributes with stellar compliance."}
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <p>
                      <strong>{currentLang === 'id' ? "Simpanan Kredensial: " : "Local Sealing: "}</strong>
                      {currentLang === 'id'
                        ? "Nomor telepon, nama, email, password terdaftar hanya diamankan demi keperluan sesi masuk lokal Anda."
                        : "We cache names, phone inputs, email references solely to orchestrate secure local user-specific accounts."}
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <p>
                      <strong>{currentLang === 'id' ? "Pembersihan Data: " : "Erase sovereignty: "}</strong>
                      {currentLang === 'id'
                        ? "Anda memiliki hak mutlak menghapus seluruh database, logs, dan riwayat kapan pun dari halaman Pengaturan."
                        : "You hold absolute rights to purge all dashboard metrics, referral logs, and tokens under Settings instantly."}
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <p>
                      <strong>{currentLang === 'id' ? "Log Telemetri: " : "Performance telemetry: "}</strong>
                      {currentLang === 'id'
                        ? "Aktivitas lokal seperti ekspor PDF direkam hanya untuk menggambar grafik dashboard Anda sendiri secara visual."
                        : "Interactive events like file printing or layout views are logged entirely to map interactive dashboard charts."}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
            <Button 
              type="button" 
              onClick={() => setModalOpen(false)}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-white rounded-xl h-10 px-6 text-xs font-bold cursor-pointer"
            >
              {currentLang === 'id' ? "Saya Mengerti" : "I Understand"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
