import TranslationPropertiesProvider from './provider/internationalization/TranslationPropertiesProvider';
import Translations from './Translations';

export default {
  __init__: [
    'translationPropertiesProvider',
    'translations'
  ],
  translationPropertiesProvider: [ 'type', TranslationPropertiesProvider ],
  translations: [ 'type', Translations ]
};