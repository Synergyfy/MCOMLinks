
export interface HomeSettings {
    // Navbar
    navLogoMain: string;
    navLogoAccent: string;
    navLinks: string[];
    navSignInText: string;
    navGetStartedText: string;
    navGetStartedLink: string;

    // Hero Section
    heroBadge: string;
    heroTitle: string;
    heroTitleGradient: string;
    heroDesc: string;
    heroPrimaryCTA: string;
    heroPrimaryLink: string;
    heroSecondaryCTA: string;
    
    // Marquee
    marqueeItems: string[];

    // Features Section
    featuresBadge: string;
    featuresTitle: string;
    featuresTitleGradient: string;
    featuresDesc: string;
    featuresList: { title: string; desc: string }[];
    
    // How It Works
    howItWorksBadge: string;
    howItWorksTitle: string;
    howItWorksTitleGradient: string;
    steps: { title: string; desc: string }[];
    howItWorksStatValue: string;
    howItWorksStatLabel: string;
    howItWorksCTA: string;
    
    // Final CTA
    finalBadge: string;
    finalTitle: string;
    finalTitleGradient: string;
    finalDesc: string;
    finalCTA: string;
    finalLink: string;

    // Footer
    footerDesc: string;
    footerPlatformDesc: string;
    footerCopyright: string;
}

const DEFAULT_SETTINGS: HomeSettings = {
    navLogoMain: "MCOMQ",
    navLogoAccent: ".LINKS",
    navLinks: ["Home", "Platform", "Solutions", "Pricing", "About"],
    navSignInText: "Sign In",
    navGetStartedText: "Get Started",
    navGetStartedLink: "/signup",

    heroBadge: "✦ Your High Street Reimagined as an McomQlinks High Street",
    heroTitle: "Mcom Digital Billboard Engine",
    heroTitleGradient: "Billboard",
    heroDesc: "If you are a local high street business owner, you can now claim and register your very own 24/7 Hyperlocal Mcom Expo storefront.",
    heroPrimaryCTA: "Show and Tell with McomQlinks",
    heroPrimaryLink: "/signup",
    heroSecondaryCTA: "Watch Demo",

    marqueeItems: ["HIGH STREET STOREFRONT PROMOS", "EXPO", "EVENTS", "WORKSHOPS", "EXPO LIVE STREAMING EVENTS"],
    
    featuresBadge: "✦ McomQlinks Promo Show and Tell",
    featuresTitle: "Hyperlocal Digital McomQlinks Storefront",
    featuresTitleGradient: "McomQlinks",
    featuresDesc: "McomQlinks is a sequential delivery engine designed to maximize engagement and remove manual friction from local commerce.",
    featuresList: [
        {
            title: "Hyperlocal Ad Campaigns",
            desc: "Registered businesses can run seasonal ad campaigns in hyperlocal or nearby areas, shown sequentially to promote products and services across McomQlinks storefronts."
        },
        {
            title: "Mcom Seasonal Automation",
            desc: "Set your campaign dates and relax. The system automatically switches between Winter, Spring, and Summer promotions."
        },
        {
            title: "Centralized Control",
            desc: "Manage an entire high street from one dashboard. Update templates and rules globally in seconds."
        },
        {
            title: "Real-Time Engagement Analytics",
            desc: "Track every scan, click, and claim. Turn engagement data into actionable growth for local commerce."
        }
    ],
    
    howItWorksBadge: "✦ The McomQlinks Process",
    howItWorksTitle: "Click, Scan, or Tap Your Storefront",
    howItWorksTitleGradient: "Your Storefront",
    steps: [
        { title: "Customer Scans QR", desc: "A customer triggers the engine with a simple QR scan or NFC tap at the physical storefront." },
        { title: "Sequential Promo & Expo Logic", desc: "Our system fetches the next valid offer in the queue based on your campaign and seasonal rules." },
        { title: "Automated Results & Analytics", desc: "A fresh deal is delivered to the customer, and you collect valuable engagement data in real-time." }
    ],
    howItWorksStatValue: "99.9%",
    howItWorksStatLabel: "Uptime Reliability",
    howItWorksCTA: "Explore Architecture",
    
    finalBadge: "✦ Ready?",
    finalTitle: "Ready to Engage with the McomQlinks High Street?",
    finalTitleGradient: "McomQlinks High Street?",
    finalDesc: "Join thousands of businesses using the McomQlinks Promo Expo to automate their marketing.",
    finalCTA: "Start Your Journey",
    finalLink: "/signup",

    footerDesc: "Revitalizing local commerce with automated, sequential digital billboard technology for National, Nearby, and Hyperlocal Mcom Promo Expos.",
    footerPlatformDesc: "Active members benefit from our 'done for you' hyperlocal and sequential promo campaigns, managed by our virtual team of agents, account managers, and consultants.",
    footerCopyright: "© 2026 McomQlinks. All rights reserved. Built for the future of commerce."
};

export const getHomeSettings = (): HomeSettings => {
    const saved = localStorage.getItem('mcom_home_settings');
    if (!saved) return DEFAULT_SETTINGS;
    // Merge with defaults to ensure new fields are always present
    return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
};

export const saveHomeSettings = (settings: HomeSettings) => {
    localStorage.setItem('mcom_home_settings', JSON.stringify(settings));
};

export const resetHomeSettings = () => {
    localStorage.removeItem('mcom_home_settings');
    return DEFAULT_SETTINGS;
};
