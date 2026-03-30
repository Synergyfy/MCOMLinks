export interface PromoSettings {
  promoActive: boolean;
  promoStartDate: string;
  promoEndDate: string;
  promoCTALink: string;
  homepagePromoTitle: string;
  homepagePromoDesc: string;
  homepagePromoCTAText: string;
  showPromoTitle: boolean;
  showPromoDesc: boolean;
  showPromoCTA: boolean;
  adminHtmlEmbed: string;
  animationStyle: 'none' | 'bounce' | 'pulse' | 'flash';
}

const PROMO_STORAGE_KEY = 'mcom_promo_config';

const defaultPromo: PromoSettings = {
  promoActive: false,
  promoStartDate: '',
  promoEndDate: '',
  promoCTALink: '/pricing/promo',
  homepagePromoTitle: 'Limited Time Offer 🚀',
  homepagePromoDesc: 'Get our premium plans at a massive discount for a limited time!',
  homepagePromoCTAText: 'Get Started Now',
  showPromoTitle: true,
  showPromoDesc: true,
  showPromoCTA: true,
  adminHtmlEmbed: `
<div style="background: linear-gradient(135deg, #8b5cf6, #2563eb); color: white; padding: 3rem; border-radius: 12px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
  <h2 style="font-size: 2.5rem; margin-bottom: 1rem; font-weight: 800;">Flash Sale! 50% OFF PRO+</h2>
  <p style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem;">Upgrade your high street presence with our exclusive Expo capabilities.</p>
  <div style="font-size: 3rem; font-weight: bold; font-family: monospace; display: inline-block; background: rgba(0,0,0,0.2); padding: 1rem 2rem; border-radius: 8px;">
    48:20:15
  </div>
</div>
`,
  animationStyle: 'none',
};

export const getPromoSettings = (): PromoSettings => {
  const stored = localStorage.getItem(PROMO_STORAGE_KEY);
  if (stored) {
    try {
      return { ...defaultPromo, ...JSON.parse(stored) };
    } catch {
      return defaultPromo;
    }
  }
  return defaultPromo;
};

export const savePromoSettings = (config: PromoSettings): void => {
  localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(config));
};
