import enTranslation from '../locales/en.json'
import viTranslation from '../locales/vi.json'
import flagAmerica from '../assets/images/small/usa.png'
import flagVietnam from '../assets/images/small/vi.png'

export const getLanguageData = (lang: string) =>
  lang === 'en'
    ? enTranslation
    : viTranslation

export const supportedLanguages = [
  { label: 'English', code: 'en', image: flagAmerica },
  { label: 'Việt Nam', code: 'vi', image: flagVietnam }
]
