import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import ko from './locales/ko';
import en from './locales/en';
import jp from './locales/jp';
import zh from './locales/zh';
import th from './locales/th';

const locales = RNLocalize.getLocales();
const country = RNLocalize.getCountry();
const currentLocale = locales.find(i => i.countryCode === country);

const DEFAULT_LOCALE = 'en';

console.log('locales', locales);
console.log('country', country);
console.log('currentLocale', currentLocale);
console.log(RNLocalize.findBestAvailableLanguage(['en', 'ko-KR']));

if (currentLocale) {
  I18n.locale = currentLocale.languageCode || DEFAULT_LOCALE;
  I18n.defaultLocale = currentLocale.languageCode || DEFAULT_LOCALE;
}

I18n.fallbacks = true;
I18n.translations = {
  ko: ko,
  en: en,
  zh: zh,
  jp: jp,
  th: th
};

export default I18n;
