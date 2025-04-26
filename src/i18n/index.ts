import en from './en.json';
import de from './de.json';

const translations = { en, de };

function getByPath(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function t(locale: string, key: string): string {
  const dict = translations[locale as keyof typeof translations];
  return getByPath(dict, key) ?? key;
}
