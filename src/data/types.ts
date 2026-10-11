export interface ServiceSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Service {
  slug: string;
  navigationLabel: string;
  formValue: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  imageKey: string;
  primaryKeywordCluster: string[];
  intro: string;
  sections: ServiceSection[];
  faq: Array<{ question: string; answer: string }>;
}

export interface SiteConfig {
  id: string;
  niche: {
    name: string;
    schemaType: string;
    primaryKeyword: string;
    primaryCta: string;
    projectFieldLabel: string;
    projectFieldType: "textarea" | "number" | "select";
    projectFieldOptions?: string[];
  };
  cloudflareProject: string;
  leadDeliveryEmail: string;
  leadNotifyEmail: string;
  market: {
    localContextLabel: string;
    localContextSummary: string;
    serviceSeasonality: string;
    customerTypes: string[];
    serviceAreaPolicy: "single-city";
    latitude: number;
    longitude: number;
  };
  design: {
    primary: string;
    primaryDark: string;
    accent: string;
    ink: string;
    paper: string;
    stickyHeader: boolean;
  };
  assets: {
    logo?: string;
    hero: string;
    process: string;
    services: Record<string, string>;
    sections?: string[];
  };
  business: {
    name: string;
    phoneDisplay: string;
    phoneTel: string;
    email: string;
    city: string;
    region: string;
    regionName: string;
    country: string;
    domain: string;
    url: string;
    priceRange: string;
    serviceAreaLabel: string;
  };
  hours: Array<{
    days: string[];
    label: string;
    opens?: string;
    closes?: string;
  }>;
  outboundLinks?: Array<{
    id: string;
    href: string;
    label: string;
  }>;
}
