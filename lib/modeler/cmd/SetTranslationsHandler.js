import ISO from 'iso-639-1';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import { getTranslation } from '../../utils/TranslationsUtil';

import { createElement } from '../../utils/ElementUtil';
import { without } from 'min-dash';

export default class SetTranslationsHandler {
  constructor(bpmnFactory, commandStack, elementRegistry) {
    this._bpmnFactory = bpmnFactory;
    this._commandStack = commandStack;
    this._elementRegistry = elementRegistry;
  }

  preExecute(context) {
    const {
      language,
      translations
    } = context;

    if (!language || !language.length || !ISO.validate(language)) {
      console.log(`${ language } is not a valid ISO-631-1 language code`);

      return;
    }

    // create or update translation for each element
    this._elementRegistry.forEach(element => {
      const { id } = element;

      const businessObject = getBusinessObject(element);

      let extensionElements = businessObject.get('extensionElements');

      let translation = getTranslation(businessObject, language);

      // (0) remove translation
      if (translations === null) {

        console.log('removing translation', translation);

        if (translation) {
          this._commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: extensionElements,
            properties: {
              values: without(extensionElements.get('values'), translation)
            }
          });
        }

        return;
      }

      if (!translations[ id ]) {
        return;
      }

      if (translation) {

        // (1) update translation
        this._commandStack.execute('element.updateModdleProperties', {
          element,
          moddleElement: translation,
          properties: {
            body: translations[ id ]
          }
        });
      } else {

        // (2) create translation
        // (2.1) ensure extension elements
        if (!extensionElements) {
          extensionElements = createElement(
            'bpmn:ExtensionElements',
            { values: [] },
            businessObject,
            this._bpmnFactory
          );

          this._commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: businessObject,
            properties: { extensionElements }
          });
        }

        // (2.2) create i18n:Translation
        translation = createElement('i18n:Translation', {
          body: translations[ id ],
          'xml:lang': language
        }, extensionElements, this._bpmnFactory);

        // (2.3) add translation to extension elements
        this._commandStack.execute('element.updateModdleProperties', {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [ ...extensionElements.get('values'), translation ]
          }
        });
      }


    });
  }
}

SetTranslationsHandler.$inject = [
  'bpmnFactory',
  'commandStack',
  'elementRegistry'
];