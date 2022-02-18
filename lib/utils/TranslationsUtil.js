import { getExtensionElementsList } from './ExtensionElementsUtil';

export function getTranslation(businessObject, language) {
  return getTranslations(businessObject).find(translation => {
    return translation.get('xml:lang') === language;
  });
}

export function getTranslations(businessObject) {
  return getExtensionElementsList(businessObject, 'i18n:Translation').filter(translation => {
    const target = translation.get('target');

    return !target || target === '@name';
  });
}