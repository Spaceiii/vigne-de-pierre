interface Wine {
  slug: string;
  name: string;
  description: string;
}

interface WineTranslation {
  id: number;
  languageId: number;
  wineSlug: string;
  name: string;
  description: string;
  tasting: string;
  conservation: string;
  suggestion: string;
  rangeSlug: string;
  price: number;
}

interface RangeTranslationWithWines {
  name: string
  description: string
  languageId: number
  slug: string
  wines?: Array<{
    name: string
    nativeName: string
    price: number
  }>
}

/**
 * Interface for the response from the /wine/translation/{code} endpoint
 * Keys are range slugs and values are objects containing range information and an array of wine objects with translations
 */
interface WinesByRange {
  [rangeSlug: string]: {
    name: string;
    description: string;
    wines: Array<{
      name: string;
      description: string;
      tasting: string;
      conservation: string;
      suggestion: string;
      wineSlug: string;
      nativeName: string;
      price: number;
    }>;
  };
}

export type { Wine, WineTranslation, WinesByRange, RangeTranslationWithWines }
