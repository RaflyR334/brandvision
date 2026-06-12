import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Briefcase, 
  MessageSquare, 
  Globe, 
  FileText, 
  Camera, 
  Save, 
  Sparkles,
  Loader2,
  CheckCircle2,
  Info,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { mockBackend } from '../lib/mock-backend';
import { User } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  // 4 Custom Fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [portfolioWebsite, setPortfolioWebsite] = useState('');
  
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(i18n.language === 'id' ? "Ukuran gambar tidak boleh melebih 2MB" : "Image size cannot exceed 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setAvatar(event.target.result);
          toast.success(
            i18n.language === 'id' 
              ? "Foto profil diunggah! Ingatlah untuk mengeklik 'Simpan Perubahan' di sebelah kanan untuk memperbarui secara dinamik." 
              : "Profile photo uploaded! Remember to click 'Save Changes' to apply."
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Avatar Options for interactive selection
  const avatarPresets = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John&mood[]=happy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane&mood[]=happy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&mood[]=happy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&mood[]=happy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&mood[]=happy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Eva&mood[]=happy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&mood[]=happy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&mood[]=happy',
  ];

  const fetchProfile = () => {
    const currentUser = mockBackend.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setName(currentUser.name || '');
      setBio(''); // Handled locally or mock bio
      setPhoneNumber(currentUser.phoneNumber || '');
      setLinkedinUrl(currentUser.linkedinUrl || '');
      setTwitterHandle(currentUser.twitterHandle || '');
      setPortfolioWebsite(currentUser.portfolioWebsite || '');
      setAvatar(currentUser.avatar || '');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Smooth UX transition
      
      const updated = mockBackend.updateUserProfile(user.id, {
        name,
        avatar,
        phoneNumber,
        linkedinUrl,
        twitterHandle,
        portfolioWebsite
      });

      setUser(updated);
      
      // Dispatch events to refresh parent components/Layout globally
      window.dispatchEvent(new Event('profile_update'));

      toast.success(
        i18n.language === 'id' 
          ? "Profil Anda berhasil diperbarui!" 
          : "Your profile has been updated successfully!"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300 text-left">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3.5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
          {i18n.language === 'id' ? "Profil Pengguna" : "My Professional Identity"}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {i18n.language === 'id' 
            ? "Kelola portofolio personal, detail kontak profesional, dan pembersihan records database Anda." 
            : "Manage your professional contact details, personal brand assets, and database storage tools."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar update & Premium status */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600 relative" />
            <CardContent className="pt-0 px-6 pb-6 text-center relative -mt-14">
              <div className="flex flex-col items-center">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Avatar className="w-28 h-28 border-4 border-white dark:border-slate-900 shadow-xl rounded-full bg-slate-50">
                    <AvatarImage src={avatar || ""} />
                    <AvatarFallback className="bg-indigo-600 text-white text-3xl font-extrabold">
                      {name ? name.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="mt-4 space-y-1.5">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">{name || "Akar Pengguna"}</h3>
                  <p className="text-xs font-mono text-slate-450 dark:text-slate-500 font-bold uppercase">{user?.email}</p>
                  
                  <div className="pt-2">
                    {user?.subscription === 'pro' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 text-[10px] font-bold tracking-wider rounded-full uppercase">
                        <Sparkles className="w-3 h-3 fill-current" />
                        PRO SUBSCRIPTION
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border text-[10px] font-bold tracking-wider rounded-full uppercase">
                        SANDBOX FREE PLAN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Interactive Avatar presets selection */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest text-left mb-3">
                  {i18n.language === 'id' ? "PILIH AVATAR INSTAN" : "QUICK AVATAR SELECTOR"}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {avatarPresets.map((preset, index) => {
                    const isSelected = avatar === preset;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setAvatar(preset);
                          toast.info(i18n.language === 'id' ? "Avatar dipilih! Klik 'Simpan Perubahan' di kanan." : "Avatar preset selected! Save changes below to update.");
                        }}
                        className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer bg-slate-50 flex items-center justify-center ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-100 dark:border-slate-800'}`}
                      >
                        <img src={preset} alt={`avatar-${index}`} className="w-10 h-10 object-cover" />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-9 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/40"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{i18n.language === 'id' ? "Unggah Foto Lokal" : "Upload Local Photo"}</span>
                  </Button>
                </div>

                <div className="mt-4 text-left">
                  <Label htmlFor="custom-avatar" className="text-xs font-semibold text-slate-500">
                    {i18n.language === 'id' ? "Atau Tautan Gambar Kustom" : "Or Custom Image URL"}
                  </Label>
                  <Input 
                    id="custom-avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/your-photo.png"
                    className="mt-1 h-9 bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/60 text-xs rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Columns: Main Form and Database management */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Account details form */}
          <form onSubmit={handleUpdateProfile}>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/30 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/80 px-6 py-5">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-indigo-500" />
                  <span>{i18n.language === 'id' ? "Informasi Personal" : "Personal Information"}</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 font-medium">
                  {i18n.language === 'id' 
                    ? "Kelola semua detail identitas dasar dan info publik profil Anda." 
                    : "Formulate your contact cards and update essential personal records."}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-6 py-6 space-y-6">
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="fullName" className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {i18n.language === 'id' ? "Nama Lengkap" : "Full Name"}
                    </Label>
                    <Input 
                      id="fullName" 
                      required
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 h-11 rounded-xl text-xs font-semibold focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {i18n.language === 'id' ? "Alamat Email" : "Email Address"}
                    </Label>
                    <div className="relative">
                      <Input 
                        id="email" 
                        readOnly
                        value={user?.email || ""} 
                        className="bg-slate-100/60 dark:bg-slate-950/40 text-slate-450 dark:text-slate-500 border-slate-100 dark:border-slate-800/80 h-11 rounded-xl text-xs font-mono select-none"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 tracking-wider">READ-ONLY</span>
                    </div>
                  </div>
                </div>

                {/* THE 4 EXTRA INDEPENDENT CUSTOM INPUTS requested by user */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-5">
                  <h4 className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-505" />
                    <span>{i18n.language === 'id' ? "Detail Profesional Tambahan (4 Kolom Kustom)" : "Professional Handles (4 Custom Fields)"}</span>
                  </h4>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Field 1: WhatsApp / Phone Number */}
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="phone" className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{i18n.language === 'id' ? "Nomor Telepon / WhatsApp" : "Phone / WhatsApp Number"}</span>
                      </Label>
                      <Input 
                        id="phone" 
                        placeholder="+62 812-3456-7890"
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 h-11 rounded-xl text-xs font-semibold focus:ring-indigo-500"
                      />
                    </div>

                    {/* Field 2: LinkedIn Profile URL */}
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="linkedin" className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{i18n.language === 'id' ? "Profil LinkedIn" : "LinkedIn Profile URL"}</span>
                      </Label>
                      <Input 
                        id="linkedin" 
                        placeholder="https://linkedin.com/in/username"
                        value={linkedinUrl} 
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 h-11 rounded-xl text-xs font-semibold focus:ring-indigo-500"
                      />
                    </div>

                    {/* Field 3: Twitter/X handle */}
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="twitter" className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{i18n.language === 'id' ? "Username Twitter / X" : "Twitter / X Username"}</span>
                      </Label>
                      <Input 
                        id="twitter" 
                        placeholder="@username"
                        value={twitterHandle} 
                        onChange={(e) => setTwitterHandle(e.target.value)}
                        className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 h-11 rounded-xl text-xs font-semibold focus:ring-indigo-500"
                      />
                    </div>

                    {/* Field 4: Portfolio Website URL */}
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="portfolio" className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{i18n.language === 'id' ? "Website / Portofolio Pribadi" : "Personal Portfolio / Website"}</span>
                      </Label>
                      <Input 
                        id="portfolio" 
                        placeholder="https://myportfolio.com"
                        value={portfolioWebsite} 
                        onChange={(e) => setPortfolioWebsite(e.target.value)}
                        className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 h-11 rounded-xl text-xs font-semibold focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

              </CardContent>
              
              <CardFooter className="bg-slate-50/10 border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-705 text-white h-11 px-6 rounded-xl text-xs font-bold gap-2 cursor-pointer transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{i18n.language === 'id' ? "Menyimpan..." : "Saving details..."}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-indigo-200" />
                      <span>{i18n.language === 'id' ? "Simpan Perubahan" : "Save Changes"}</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>

        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
