export interface HomeContent {
  seoTitle: string;
  metaDescription: string;
  hero: { eyebrow: string; h1: string; subheading: string };
  introduction: { eyebrow: string; heading: string; paragraphs: string[] };
  principles: Array<{ heading: string; text: string }>;
  services: { eyebrow: string; heading: string; introduction: string };
  localSections: Array<{
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    bullets?: string[];
    imageIndex?: number;
    imageAlt?: string;
  }>;
  process: Array<{ heading: string; text: string }>;
  pricing: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    factors: Array<{ heading: string; text: string }>;
  };
  faq: Array<{ question: string; answer: string }>;
}

export interface SupportingContent {
  about: {
    seoTitle: string;
    metaDescription: string;
    h1: string;
    introduction: string;
    sections: Array<{ heading: string; paragraphs: string[] }>;
    values: Array<{ heading: string; text: string }>;
  };
  contact: {
    seoTitle: string;
    metaDescription: string;
    h1: string;
    introduction: string;
    expectations: string[];
  };
}
