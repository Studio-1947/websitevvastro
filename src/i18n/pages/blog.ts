import type { Entry } from '../types';

/**
 * Blog: index hero/filter + the shared category labels (reused on the index
 * cards and each post's own eyebrow). Post titles, excerpts and article
 * bodies are left as authored — several posts are already written natively
 * in Bengali, Hindi or Nepali by their authors (a deliberate bilingual
 * voice), and the rest run long-form essay content out of scope for this
 * pass (matching the same call made for career postings).
 */
export const blog: Record<string, Entry> = {
  'blog.hero.eyebrow': { hi: 'स्टूडियो 1947 जर्नल', bn: 'স্টুডিও ১৯৪৭ জার্নাল', ne: 'स्टुडियो १९४७ जर्नल' },
  'blog.hero.title': {
    hi: 'कहानियां, विचार और दृष्टिकोण।',
    bn: 'গল্প, ধারণা ও দৃষ্টিভঙ্গি।',
    ne: 'कथा, विचार र दृष्टिकोणहरू।',
  },
  'blog.hero.sub': {
    hi: 'हम स्थानीय ज्ञान का उत्सव मनाते हैं। यहां पारंपरिक ज्ञान, डिज़ाइन, संस्कृति और समुदायों के बारे में कुछ कहानियां हैं।',
    bn: 'আমরা স্থানীয় জ্ঞান উদযাপন করি। এখানে ঐতিহ্যবাহী জ্ঞান, ডিজাইন, সংস্কৃতি ও সম্প্রদায় সম্পর্কে কিছু গল্প রইল।',
    ne: 'हामी स्थानीय ज्ञानको उत्सव मनाउँछौं। यहाँ परम्परागत ज्ञान, डिजाइन, संस्कृति र समुदायहरूबारे केही कथाहरू छन्।',
  },
  'blog.allPosts': { hi: 'सभी पोस्ट', bn: 'সব পোস্ট', ne: 'सबै पोस्टहरू' },

  'blog.cat.designThinking': { hi: 'डिज़ाइन थिंकिंग', bn: 'ডিজাইন থিংকিং', ne: 'डिजाइन थिंकिङ' },
  'blog.cat.folkTale': { hi: 'लोक कथा', bn: 'লোককাহিনী', ne: 'लोककथा' },
  'blog.cat.foodCulture': { hi: 'भोजन और संस्कृति', bn: 'খাদ্য ও সংস্কৃতি', ne: 'खानपान र संस्कृति' },
  'blog.cat.genderEquality': { hi: 'लैंगिक समानता', bn: 'লিঙ্গ সমতা', ne: 'लैंगिक समानता' },
  'blog.cat.identity': { hi: 'पहचान', bn: 'পরিচয়', ne: 'पहिचान' },
  'blog.cat.indigenousFestival': { hi: 'स्वदेशी त्योहार', bn: 'আদিবাসী উৎসব', ne: 'आदिवासी पर्व' },
  'blog.cat.localSolution': { hi: 'स्थानीय समाधान', bn: 'স্থানীয় সমাধান', ne: 'स्थानीय समाधान' },
  'blog.cat.memoir': { hi: 'संस्मरण', bn: 'স্মৃতিকথা', ne: 'संस्मरण' },
  'blog.cat.shortFiction': { hi: 'लघु कथा', bn: 'ছোট গল্প', ne: 'छोटो कथा' },
  'blog.cat.traditionalCraft': { hi: 'पारंपरिक शिल्प', bn: 'ঐতিহ্যবাহী কারুশিল্প', ne: 'परम्परागत शिल्प' },
  'blog.cat.traditionalKnowledge': { hi: 'पारंपरिक ज्ञान', bn: 'ঐতিহ্যবাহী জ্ঞান', ne: 'परम्परागत ज्ञान' },
  'blog.cat.foodHeritage': { hi: 'भोजन और विरासत', bn: 'খাদ্য ও ঐতিহ্য', ne: 'खानपान र सम्पदा' },
  'blog.cat.culture': { hi: 'संस्कृति', bn: 'সংস্কৃতি', ne: 'संस्कृति' },
  'blog.cat.cultureHeritage': { hi: 'संस्कृति और विरासत', bn: 'সংস্কৃতি ও ঐতিহ্য', ne: 'संस्कृति र सम्पदा' },
  'blog.cat.traditionalFestival': { hi: 'पारंपरिक त्योहार', bn: 'ঐতিহ্যবাহী উৎসব', ne: 'परम्परागत पर्व' },
  'blog.cat.blog': { hi: 'ब्लॉग', bn: 'ব্লগ', ne: 'ब्लग' },
  'blog.cat.design': { hi: 'डिज़ाइन', bn: 'ডিজাইন', ne: 'डिजाइन' },
  'blog.cat.story': { hi: 'कहानी', bn: 'গল্প', ne: 'कथा' },
};
