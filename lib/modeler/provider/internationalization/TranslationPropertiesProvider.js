import {
  DefaultLanguageProps,
  TranslationsProps
} from './properties';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import { Group, ListGroup } from '@bpmn-io/properties-panel';

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {Injector} injector
 * @param {Function} translate
 */
export default function TranslationPropertiesProvider(injector, translate) {

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  this.getGroups = function(element) {

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function(groups) {

      if (is(element, 'bpmn:Process') || is(element, 'bpmn:Collaboration')) {
        groups.push(createDefaultLanguageGroup(element, injector, translate));
      }

      if (is(element, 'bpmn:FlowElement')) {
        groups.push(createTranslationsGroup(element, injector, translate));
      }

      console.log('groups', groups);

      return groups;
    };
  };

  const propertiesPanel = injector.get('propertiesPanel', false);

  if (propertiesPanel) {
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
  }
}

TranslationPropertiesProvider.$inject = [
  'injector',
  'translate'
];

function createDefaultLanguageGroup(element, injector, translate) {
  const defaultLanguageGroup = {
    id: 'i18n-default-language',
    label: translate('i18n'),
    component: Group,
    entries: DefaultLanguageProps({ element, injector })
  };

  return defaultLanguageGroup;
}

function createTranslationsGroup(element, injector, translate) {
  const translationsGroup = {
    id: 'i18n-translations',
    label: translate('i18n - Translations'),
    component: ListGroup,
    ...TranslationsProps({ element, injector })
  };

  return translationsGroup;
}