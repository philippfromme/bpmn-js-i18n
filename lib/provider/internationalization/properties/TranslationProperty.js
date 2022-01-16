import { TextFieldEntry } from '@bpmn-io/properties-panel';

import { useService } from 'bpmn-js-properties-panel';

import { validateIsoLanguageCode } from './utils/ValidationUtil';

export default function TranslationProperty(props) {
  const {
    idPrefix,
    element,
    translation
  } = props;

  const entries = [{
    id: idPrefix + '-language',
    component: <LanguageProperty idPrefix={ idPrefix } element={ element } translation={ translation } />
  }, {
    id: idPrefix + '-body',
    component: <BodyProperty idPrefix={ idPrefix } element={ element } translation={ translation } />
  }];

  return entries;
}

function LanguageProperty(props) {
  const {
    idPrefix,
    element,
    translation
  } = props;

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: translation,
      properties: {
        'xml:lang': value
      }
    });
  };

  const getValue = () => {
    return translation.get('xml:lang');
  };

  return TextFieldEntry({
    element: translation,
    id: idPrefix + '-language',
    label: translate('Language'),
    getValue,
    setValue,
    debounce,
    validate: validateIsoLanguageCode
  });
}

function BodyProperty(props) {
  const {
    idPrefix,
    element,
    translation
  } = props;

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: translation,
      properties: {
        body: value
      }
    });
  };

  const getValue = () => {
    return translation.get('body');
  };

  return TextFieldEntry({
    element: translation,
    id: idPrefix + '-body',
    label: translate('Translation'),
    getValue,
    setValue,
    debounce
  });
}