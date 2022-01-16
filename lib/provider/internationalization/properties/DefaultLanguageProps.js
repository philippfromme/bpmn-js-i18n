import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import {
  useService
} from 'bpmn-js-properties-panel';

import { validateIsoLanguageCode } from './utils/ValidationUtil';

export default function DefaultLanguageProps(props) {
  const {
    element
  } = props;

  return [
    {
      id: 'i18n-default-language',
      component: <DefaultLanguageProperty element={ element } />,
      isEdited: isTextFieldEntryEdited
    },
  ];
}

function DefaultLanguageProperty(props) {
  const { element } = props;

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const bpmnjs = useService('bpmnjs');

  const definitions = bpmnjs.getDefinitions();

  const getValue = () => {
    return definitions.get('xml:lang') || '';
  };

  const setValue = (value) => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: definitions,
      properties: {
        'xml:lang': value
      }
    });
  };

  return TextFieldEntry({
    element,
    id: 'default-language',
    label: translate('Default language'),
    getValue,
    setValue,
    debounce,
    validate: validateIsoLanguageCode
  });
}