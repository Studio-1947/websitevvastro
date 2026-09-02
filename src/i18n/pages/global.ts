import type { Entry } from '../types';

/** Site-wide chrome: nav (desktop + mobile), dropdowns, footer. */
export const global: Record<string, Entry> = {
  // ── Top-level nav ────────────────────────────────────────────────────
  'global.nav.aboutUs': { hi: 'हमारे बारे में', bn: 'আমাদের সম্পর্কে', ne: 'हाम्रो बारेमा' },
  'global.nav.portfolio': { hi: 'पोर्टफ़ोलियो', bn: 'পোর্টফোলিও', ne: 'पोर्टफोलियो' },
  'global.nav.solutions': { hi: 'समाधान', bn: 'সমাধান', ne: 'समाधानहरू' },
  'global.nav.products': { hi: 'उत्पाद', bn: 'পণ্য', ne: 'उत्पादनहरू' },
  'global.nav.blogs': { hi: 'ब्लॉग', bn: 'ব্লগ', ne: 'ब्लगहरू' },
  'global.nav.sayHello': { hi: 'नमस्ते कहें', bn: 'হ্যালো বলুন', ne: 'नमस्ते भन्नुहोस्' },

  // ── About Us dropdown ────────────────────────────────────────────────
  'global.dd.about.eyebrow': { hi: 'स्टूडियो 1947 के बारे में', bn: 'স্টুডিও ১৯৪৭ সম্পর্কে', ne: 'स्टुडियो १९४७ बारे' },
  'global.dd.about.heading': {
    hi: 'आपके साथ मिलकर रचने वाले लोग',
    bn: 'আপনার সাথে সহ-সৃষ্টি করা মানুষ',
    ne: 'तपाईंसँगै सह-सिर्जना गर्ने मानिसहरू',
  },
  'global.dd.cta': { hi: 'अवलोकन देखें', bn: 'ওভারভিউ দেখুন', ne: 'सिंहावलोकन हेर्नुहोस्' },
  'global.dd.about.label': { hi: 'कंपनी', bn: 'কোম্পানি', ne: 'कम्पनी' },
  'global.dd.about.ourStory': { hi: 'हमारी कहानी', bn: 'আমাদের গল্প', ne: 'हाम्रो कथा' },
  'global.dd.about.ourTeam': { hi: 'हमारी टीम', bn: 'আমাদের দল', ne: 'हाम्रो टिम' },
  'global.dd.about.ourValues': { hi: 'हमारे मूल्य', bn: 'আমাদের মূল্যবোধ', ne: 'हाम्रा मूल्यहरू' },
  'global.dd.about.careers': { hi: 'करियर', bn: 'ক্যারিয়ার', ne: 'करियर' },

  // ── Solutions dropdown ───────────────────────────────────────────────
  'global.dd.solutions.eyebrow': { hi: 'हमारे समाधान', bn: 'আমাদের সমাধান', ne: 'हाम्रा समाधानहरू' },
  'global.dd.solutions.heading': {
    hi: 'असल दुनिया के असर के लिए बने समाधान',
    bn: 'বাস্তব-বিশ্ব প্রভাবের জন্য তৈরি সমাধান',
    ne: 'वास्तविक-संसार प्रभावका लागि बनाइएका समाधानहरू',
  },
  'global.dd.solutions.label': { hi: 'समाधान', bn: 'সমাধান', ne: 'समाधानहरू' },
  'global.dd.solutions.dataDesignTech': {
    hi: 'डेटा, डिज़ाइन और तकनीक',
    bn: 'ডেটা, ডিজাইন ও প্রযুক্তি',
    ne: 'डेटा, डिजाइन र प्रविधि',
  },
  'global.dd.solutions.commCampaign': {
    hi: 'संचार और अभियान',
    bn: 'যোগাযোগ ও প্রচারাভিযান',
    ne: 'सञ्चार र अभियान',
  },
  'global.dd.solutions.researchSurvey': {
    hi: 'शोध और सर्वेक्षण',
    bn: 'গবেষণা ও জরিপ',
    ne: 'अनुसन्धान र सर्वेक्षण',
  },
  'global.dd.solutions.capacityBuilding': {
    hi: 'क्षमता निर्माण',
    bn: 'সক্ষমতা বৃদ্ধি',
    ne: 'क्षमता विकास',
  },

  // ── Products dropdown ────────────────────────────────────────────────
  'global.dd.products.eyebrow': { hi: 'हमारे उत्पाद', bn: 'আমাদের পণ্য', ne: 'हाम्रा उत्पादनहरू' },
  'global.dd.products.heading': {
    hi: 'हमारे नए उत्पाद देखें',
    bn: 'আমাদের নতুন পণ্য দেখুন',
    ne: 'हाम्रा नयाँ उत्पादनहरू हेर्नुहोस्',
  },
  'global.dd.products.label': { hi: 'उत्पाद', bn: 'পণ্য', ne: 'उत्पादनहरू' },
  'global.dd.products.doptorCampus': { hi: 'डॉप्टर कैंपस मैनेजर', bn: 'ডপ্টর ক্যাম্পাস ম্যানেজার', ne: 'डप्टर क्याम्पस म्यानेजर' },
  'global.dd.products.doptorOffice': { hi: 'डॉप्टर ऑफ़िस मैनेजर', bn: 'ডপ্টর অফিস ম্যানেজার', ne: 'डप्टर अफिस म्यानेजर' },
  'global.dd.products.doptorNgo': { hi: 'डॉप्टर एनजीओ मैनेजर', bn: 'ডপ্টর এনজিও ম্যানেজার', ne: 'डप्टर एनजीओ म्यानेजर' },
  'global.dd.products.inventorySales': {
    hi: 'इन्वेंट्री + सेल्स डैशबोर्ड',
    bn: 'ইনভেন্টরি + সেলস ড্যাশবোর্ড',
    ne: 'इन्भेन्टरी + बिक्री ड्यासबोर्ड',
  },
  'global.dd.products.socialFlow': { hi: 'सोशल फ़्लो', bn: 'সোশ্যাল ফ্লো', ne: 'सोसल फ्लो' },
  'global.dd.products.darjeeling': { hi: '1 दार्जिलिंग', bn: '১ দার্জিলিং', ne: '१ दार्जिलिङ' },
  'global.dd.products.pharmaErp': { hi: 'फ़ार्मा ईआरपी', bn: 'ফার্মা ইআরপি', ne: 'फार्मा ईआरपी' },
  'global.dd.products.soon': { hi: 'जल्द आ रहा है', bn: 'শীঘ্রই আসছে', ne: 'चाँडै आउँदैछ' },

  // ── Footer ───────────────────────────────────────────────────────────
  'global.footer.ourProducts': { hi: 'हमारे उत्पाद', bn: 'আমাদের পণ্য', ne: 'हाम्रा उत्पादनहरू' },
  'global.footer.ourSolutions': { hi: 'हमारे समाधान', bn: 'আমাদের সমাধান', ne: 'हाम्रा समाधानहरू' },
  'global.footer.ourJourney': { hi: 'हमारी यात्रा', bn: 'আমাদের যাত্রা', ne: 'हाम्रो यात्रा' },
  'global.footer.initiatives': { hi: 'पहल', bn: 'উদ্যোগ', ne: 'पहलहरू' },
  'global.footer.blogs': { hi: 'ब्लॉग', bn: 'ব্লগ', ne: 'ब्लगहरू' },
  'global.footer.accessibility': { hi: 'सुगमता', bn: 'অ্যাক্সেসিবিলিটি', ne: 'पहुँचयोग्यता' },
  'global.footer.privacyPolicy': { hi: 'गोपनीयता नीति', bn: 'গোপনীয়তা নীতি', ne: 'गोपनीयता नीति' },
  'global.footer.termsOfService': { hi: 'सेवा की शर्तें', bn: 'পরিষেবার শর্তাবলী', ne: 'सेवाका सर्तहरू' },
  'global.footer.labourPolicy': {
    hi: 'श्रम एवं रोज़गार नीति',
    bn: 'শ্রম ও কর্মসংস্থান নীতি',
    ne: 'श्रम तथा रोजगार नीति',
  },
  'global.footer.career': { hi: 'करियर', bn: 'ক্যারিয়ার', ne: 'करियर' },
  'global.footer.hqLine': {
    hi: 'मुख्यालय<br />मिरिक, दार्जिलिंग में',
    bn: 'সদর দপ্তর<br />মিরিক, দার্জিলিংয়ে',
    ne: 'प्रधान कार्यालय<br />मिरिक, दार्जिलिङमा',
  },
  'global.footer.ctaTitle': {
    hi: 'आइए मिलकर कुछ सार्थक<br />और प्रभावशाली बनाएं।',
    bn: 'চলুন একসাথে কিছু অর্থবহ<br />ও প্রভাবশালী তৈরি করি।',
    ne: 'आउनुहोस् सँगै केही अर्थपूर्ण<br />र प्रभावकारी सिर्जना गरौं।',
  },
  'global.footer.copyBy': { hi: 'द्वारा', bn: 'কর্তৃক', ne: 'द्वारा' },
};
