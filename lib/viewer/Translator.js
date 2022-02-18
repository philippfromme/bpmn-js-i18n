import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import {
  hasExternalLabel,
  isLabel
} from 'bpmn-js/lib/util/LabelUtil';

import { assign, pick } from 'min-dash';

import { getTranslations } from '../utils/TranslationsUtil';

const DEFAULT_LANGUAGE = 'en';

export default class Translator {
  constructor(bpmnjs, elementRegistry, eventBus, graphicsFactory, textRenderer) {
    this._bpmnjs = bpmnjs;
    this._elementRegistry = elementRegistry;
    this._eventBus = eventBus;
    this._graphicsFactory = graphicsFactory;
    this._textRenderer = textRenderer;

    this._defaultLanguageNames = {};

    eventBus.on('import.done', () => {
      this._language = this.getDefaultLanguage();
    });
  }

  getLanguage() {
    return this._language;
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

  getDefaultLanguage() {
    return this._bpmnjs.getDefinitions().get('xml:lang') || DEFAULT_LANGUAGE;
  }

  translateDiagram(language) {
    this._language = language;

    const defaultLanguage = this.getDefaultLanguage();

    if (language !== defaultLanguage) {
      this._saveDefaultLanguageNames();
    }

    this._elementRegistry.forEach(element => {
      this._translateElement(element, language);
    });
  }

  _translateElement(element, language) {
    const defaultLanguage = this.getDefaultLanguage();

    const businessObject = getBusinessObject(element);

    const id = businessObject.get('id');

    if (!this._defaultLanguageNames[ id ]) {
      return;
    }

    let translation;

    if (language === defaultLanguage) {
      translation = this._defaultLanguageNames[ id ];
    } else {
      const translations = getTranslations(businessObject);

      translation = translations.find(value => value.get('xml:lang') === language);

      if (translation) {
        translation = translation.get('body');
      }
    }

    if (!translation) {
      return;
    }

    // (1) temporarily set name to translation
    businessObject.set('name', translation);

    // (2) rerender element
    this._rerenderElement(element);

    // (3) relayout external label
    if (hasExternalLabel(element) || isLabel(element)) {
      const label = element.label || element;

      const labelBounds = pick(label, [ 'x', 'y', 'width', 'height' ]);

      const newLabelBounds = this._textRenderer.getExternalLabelBounds(label, translation);

      // (3.1) temporarily set label bounds to translation label bounds
      assign(label, newLabelBounds);

      // (3.2) rerender label
      this._rerenderElement(label);

      // (3.3) update outline
      this._eventBus.fire('shape.changed', {
        element: label,
        gfx: this._elementRegistry.getGraphics(label)
      });

      // (3.4) reset label bounds 🤡
      assign(label, labelBounds);
    }

    // (4) reset name 🤡
    businessObject.set('name', this._defaultLanguageNames[ id ]);
  }

  _rerenderElement(element) {
    const gfx = this._elementRegistry.getGraphics(element);

    const type = isConnection(element) ? 'connection' : 'shape';

    this._graphicsFactory.update(type, element, gfx);
  }

  _saveDefaultLanguageNames() {
    this._elementRegistry.forEach(element => {
      const businessObject = getBusinessObject(element);

      const name = businessObject.get('name');

      if (name && name.length) {
        const id = businessObject.get('id');

        this._defaultLanguageNames[ id ] = name;
      }
    });
  }
}

Translator.$inject = [
  'bpmnjs',
  'elementRegistry',
  'eventBus',
  'graphicsFactory',
  'textRenderer'
];

function isConnection(element) {
  return !!element.waypoints;
}