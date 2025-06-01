import type { Locale } from '@/i18n.config';
import en from '@/dictionaries/en.json';
import fr from '@/dictionaries/fr.json';

const dictionaries = {
  en,
  fr,
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale];
}; 