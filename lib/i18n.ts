import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "BrandVision AI",
      "tagline": "Personal Expertise Classifier",
      "hero_title": "Define Your Professional Identity with AI",
      "hero_subtitle": "Analyze your bio, skills, and experience to create a compelling personal brand in seconds.",
      "get_started": "Get Started",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "dashboard": "Dashboard",
      "history": "History",
      "settings": "Settings",
      "subscription": "Subscription",
      "affiliate": "Affiliate",
      "pricing": "Pricing",
      "faq": "FAQ",
      "contact": "Contact",
      "classify": "Classify Expertise",
      "input_placeholder": "Paste your bio, skills, or experience here...",
      "processing": "Analyzing your brand...",
      "results": "Your Brand Profile",
      "expertise_areas": "Expertise Areas",
      "brand_summary": "Brand Summary",
      "export_pdf": "Export PDF",
      "export_excel": "Export Excel",
      "save_history": "Save to History",
      "no_history": "No history found. Start classifying!",
      "upgrade_pro": "Upgrade to Pro",
      "pro_features": "Unlock unlimited classifications, PDF exports, and more.",
      "success_save": "Brand profile saved successfully!",
      "error_api": "Failed to analyze brand. Please try again.",
      "onboarding_welcome": "Welcome to BrandVision AI!",
      "onboarding_step1": "Enter your professional details to get started.",
      "onboarding_step2": "Our AI will analyze and categorize your expertise.",
      "onboarding_step3": "Export and share your brand profile with the world.",
      "finish": "Finish"
    }
  },
  id: {
    translation: {
      "app_name": "BrandVision AI",
      "tagline": "Pengklasifikasi Keahlian Pribadi",
      "hero_title": "Tentukan Identitas Profesional Anda dengan AI",
      "hero_subtitle": "Analisis bio, keterampilan, dan pengalaman Anda untuk membuat brand pribadi yang menarik dalam hitungan detik.",
      "get_started": "Mulai Sekarang",
      "login": "Masuk",
      "register": "Daftar",
      "logout": "Keluar",
      "dashboard": "Dasbor",
      "history": "Riwayat",
      "settings": "Pengaturan",
      "subscription": "Langganan",
      "affiliate": "Afiliasi",
      "pricing": "Harga",
      "faq": "Tanya Jawab",
      "contact": "Kontak",
      "classify": "Klasifikasikan Keahlian",
      "input_placeholder": "Tempel bio, keterampilan, atau pengalaman Anda di sini...",
      "processing": "Menganalisis brand Anda...",
      "results": "Profil Brand Anda",
      "expertise_areas": "Bidang Keahlian",
      "brand_summary": "Ringkasan Brand",
      "export_pdf": "Ekspor PDF",
      "export_excel": "Ekspor Excel",
      "save_history": "Simpan ke Riwayat",
      "no_history": "Riwayat tidak ditemukan. Mulai klasifikasi!",
      "upgrade_pro": "Tingkatkan ke Pro",
      "pro_features": "Buka klasifikasi tak terbatas, ekspor PDF, dan lainnya.",
      "success_save": "Profil brand berhasil disimpan!",
      "error_api": "Gagal menganalisis brand. Silakan coba lagi.",
      "onboarding_welcome": "Selamat datang di BrandVision AI!",
      "onboarding_step1": "Masukkan detail profesional Anda untuk memulai.",
      "onboarding_step2": "AI kami akan menganalisis dan mengategorikan keahlian Anda.",
      "onboarding_step3": "Ekspor dan bagikan profil brand Anda ke dunia.",
      "finish": "Selesai"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
