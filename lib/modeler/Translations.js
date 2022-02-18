import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import SetTranslationsHandler from './cmd/SetTranslationsHandler';

import {
  getTranslation,
  getTranslations
} from '../utils/TranslationsUtil';

import { isLabel } from 'bpmn-js/lib/util/LabelUtil';

import ISO from 'iso-639-1';

const DEFAULT_LANGUAGE = 'en';

export default class Translations {
  constructor(bpmnjs, canvas, commandStack, elementRegistry) {
    this._bpmnjs = bpmnjs;
    this._canvas = canvas;
    this._commandStack = commandStack;
    this._elementRegistry = elementRegistry;

    commandStack.registerHandler('setTranslations', SetTranslationsHandler);
  }

  getDefaultLanguage() {
    return this._bpmnjs.getDefinitions().get('xml:lang') || DEFAULT_LANGUAGE;
  }

  setDefaultLanguage(language) {
    if (!ISO.validate(language)) {
      console.log(`${ language } is not a valid ISO-631-1 language code`);

      return;
    }

    const root = this._canvas.getRootElement();

    const definitions = this._bpmnjs.getDefinitions();

    this._commandStack.execute('element.updateModdleProperties', {
      element: root,
      moddleElement: definitions,
      properties: {
        'xml:lang': language
      }
    });
  }

  getLanguages() {
    return this._elementRegistry.getAll().reduce((languages, element) => {
      const translations = getTranslations(getBusinessObject(element));

      translations.forEach(translation => {
        const language = translation.get('xml:lang');

        if (language && !languages.includes(language)) {
          languages.push(language);
        }
      });

      return languages;
    }, [ this.getDefaultLanguage() ]);
  }

  /**
   * @param {string} [language]
   *
   * @returns { { [ key: string]: string } }
   */
  getTranslationsJSON(language) {
    return this._elementRegistry.getAll().reduce((translations, element) => {
      if (isLabel(element)) {
        return translations;
      }

      const { id } = element;

      const businessObject = getBusinessObject(element);

      let name = businessObject.get('name');

      if (language) {
        const translation = getTranslation(businessObject, language);

        name = translation ? translation.get('body') : name;
      }

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
  'bpmnjs',
  'canvas',
  'commandStack',
  'elementRegistry'
];