import BpmnModeler from 'bpmn-js/lib/Modeler';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import BpmnI18nSchema from 'bpmn-i18n-moddle/resources/bpmn-i18n.json';

import ModelerModule from '../../../lib/modeler';

export function createModeler(container, propertiesPanelParent) {
  return new BpmnModeler({
    container,
    additionalModules: [
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      ModelerModule
    ],
    keyboard: {
      bindTo: document
    },
    moddleExtensions: {
      i18n: BpmnI18nSchema
    },
    propertiesPanel: {
      parent: propertiesPanelParent
    }
  });
}