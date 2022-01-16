import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import TranslationProperty from './TranslationProperty';

import {
  createElement
} from './utils/ElementUtil';

import {
  getExtensionElementsList
} from './utils/ExtensionElementsUtil';

import { without } from 'min-dash';

import ISO from 'iso-639-1';


export default function TranslationsProps({ element, injector }) {
  const businessObject = getBusinessObject(element);

  const translations = getTranslations(businessObject) || [];

  const bpmnFactory = injector.get('bpmnFactory'),
        commandStack = injector.get('commandStack');

  const items = translations.map((translation, index) => {
    const id = element.id + '-i18n-translation-' + index;

    return {
      id,
      label: getLabel(translation),
      entries: TranslationProperty({
        idPrefix: id,
        element,
        translation
      }),
      autoFocusEntry: id + '-language',
      remove: removeFactory({ commandStack, element, translation })
    };
  });

  return {
    items,
    add: addFactory({ bpmnFactory, commandStack, element })
  };
}

function addFactory({ bpmnFactory, commandStack, element }) {
  return function(event) {
    event.stopPropagation();

    const commands = [];

    const businessObject = getBusinessObject(element);

    let extensionElements = businessObject.get('extensionElements');

    // (1) ensure extension elements
    if (!extensionElements) {
      extensionElements = createElement(
        'bpmn:ExtensionElements',
        { values: [] },
        businessObject,
        bpmnFactory
      );

      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: { extensionElements }
        }
      });
    }

    // (2) create i18n:Translation
    const translation = createElement('i18n:Translation', {}, extensionElements, bpmnFactory);

    // (3) add translation to extension elements
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: extensionElements,
        properties: {
          values: [ ...extensionElements.get('values'), translation ]
        }
      }
    });

    // (5) commit all updates
    commandStack.execute('properties-panel.multi-command-executor', commands);
  };
}

function removeFactory({ commandStack, element, translation }) {
  return function(event) {
    event.stopPropagation();

    const commands = [];

    const businessObject = getBusinessObject(element),
          extensionElements = businessObject.get('extensionElements');

    const values = without(extensionElements.get('values'), translation);

    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: extensionElements,
        properties: {
          values
        }
      }
    });

    if (!values.length) {
      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: {
            extensionElements: undefined
          }
        }
      });
    }

    commandStack.execute('properties-panel.multi-command-executor', commands);
  };
}


// helper //////////////////

function getTranslations(businessObject) {
  return getExtensionElementsList(businessObject, 'i18n:Translation').filter(translation => {
    const target = translation.get('target');

    return !target || target === '@name';
  });
}

function getLabel(translation) {
  const language = translation.get('xml:lang');

  if (!language) {
    return '';
  }

  return ISO.getName(language) || language;
}