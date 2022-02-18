import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import SetTranslationsHandler from './cmd/SetTranslationsHandler';

export default class Translations {
  constructor(commandStack, elementRegistry) {
    this._commandStack = commandStack;
    this._elementRegistry = elementRegistry;

    commandStack.registerHandler('setTranslations', SetTranslationsHandler);
  }

  getTranslationsJSON() {
    return this._elementRegistry.getAll().reduce((translations, element) => {
      const { id } = element;

      const businessObject = getBusinessObject(element);

      const name = businessObject.get('name');

      if (!name || !name.length) {
        return translations;
      }

      return {
        ...translations,
        [ id ]: name
      };
    }, {});
  }

  setTranslations(language, translations) {
    this._commandStack.execute('setTranslations', {
      language,
      translations
    });
  }
}

Translations.$inject = [
  'commandStack',
  'elementRegistry'
];