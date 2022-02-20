import React, { useEffect, useState } from 'react';

import { fetchLanguages, fetchTranslations } from '../utils/DeeplUtil';

import {
  Button,
  ButtonSet,
  Checkbox,
  CodeSnippet,
  ComboBox,
  DataTable,
  InlineLoading,
  Modal,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TextInput
} from 'carbon-components-react';

import ISO from 'iso-639-1';

import './translations-modal.scss';

export default function TranslationsModal(props) {
  const {
    modeler,
    onClose,
    deeplAuthenticationKey,
    setDeeplAuthenticationKey
  } = props;

  const [ translationsJSON, setTranslationsJSON ] = useState(modeler.get('translations').getTranslationsJSON());
  const [ hasTranslationsForLanguage, setHasTranslationsForLanguage ] = useState(true);

  const [ useDeepl, setUseDeepl ] = useState(false);
  const [ deeplSupportedLanguages, setDeeplSupportedLanguages ] = useState([]);

  const [ fetching, setFetching ] = useState(false);
  const [ _, setFetchedTranslations ] = useState();

  const [ selectedLanguage, setSelectedLanguage ] = useState(modeler.get('translations').getDefaultLanguage());

  const defaultLanguage = modeler.get('translations').getDefaultLanguage();

  useEffect(() => {
    (async () => {
      if (deeplAuthenticationKey) {
        let languages;

        try {
          languages = await fetchLanguages(deeplAuthenticationKey);

          console.log('supported languages fetched', languages);

          setDeeplSupportedLanguages(languages);
        } catch (error) {
          console.log('error fetching languages');
        }
      }
    })();
  }, [ deeplAuthenticationKey ]);

  const onTranslationInput = (id, translation) => {
    const newTranslationsJSON = Object.assign({}, translationsJSON);

    newTranslationsJSON[ id ] = translation;

    setTranslationsJSON(newTranslationsJSON);
  };

  const onTranslateWithDeepl = async () => {
    setFetching(true);

    const defaultLanguage = modeler.get('translations').getDefaultLanguage();

    const translations = await fetchTranslations(translationsJSON, defaultLanguage, selectedLanguage, deeplAuthenticationKey);

    modeler.get('translations').setTranslations(selectedLanguage, translations);

    setTranslationsJSON(translations);

    setFetchedTranslations(translations);

    setFetching(false);
  };

  const addTranslations = () => {
    modeler.get('translations').setTranslations(selectedLanguage, translationsJSON);

    onClose();
  };

  const removeTranslations = () => {
    modeler.get('translations').setTranslations(selectedLanguage, null);

    onClose();
  };

  let languageItems = ISO.getAllCodes()
    .map(code => {
      return {
        id: code,
        text: `${ code } (${ ISO.getName(code) })`
      };
    });

  const hasTranslations = [], hasNoTranslations = [];

  languageItems.forEach((item) => {
    if (modeler.get('translations').getLanguages().includes(item.id)) {
      hasTranslations.push(item);
    } else {
      hasNoTranslations.push(item);

    }
  });

  languageItems = [ ...hasTranslations, ...hasNoTranslations ];

  const onChangeDefaultLanguage = ({ selectedItem }) => {
    if (!selectedItem) {
      selectedItem = languageItems.find(({ id }) => id === defaultLanguage);
    }

    const { id: language } = selectedItem;

    modeler.get('translations').setDefaultLanguage(language);
  };

  const onChangeSelectedLanguage = ({ selectedItem }) => {
    if (!selectedItem) {
      selectedItem = languageItems.find(({ id }) => id === defaultLanguage);
    }

    const { id: language } = selectedItem;

    const languages = modeler.get('translations').getLanguages();

    setHasTranslationsForLanguage(languages.includes(language));

    setTranslationsJSON(modeler.get('translations').getTranslationsJSON(language));

    setSelectedLanguage(language);
  };

  const headers = [
    {
      header: 'Element',
      key: 'element'
    },
    {
      header: 'Translation',
      key: 'translation'
    }
  ];

  const rows = Object.entries(translationsJSON).map(([ id, translation ]) => {
    return {
      id,
      element: id,
      translation
    };
  });

  return (
    <Modal
      className="translations-modal"
      modalHeading="Translations"
      open={ true }
      passiveModal={ true }
      size="lg"
      onRequestClose={ onClose }>
      <ComboBox
        className="translations-modal-select-default-language"
        spellCheck="false"
        size="sm"
        onChange={ onChangeDefaultLanguage }
        light
        id="default-language"
        items={ languageItems }
        initialSelectedItem={ languageItems.find(({ id }) => id === defaultLanguage) }
        placeholder={ 'en (English)' }
        itemToString={ (item) => (item ? item.text : '') }
        titleText="Select Default Language" />
      <ComboBox
        className="translations-modal-select-language"
        spellCheck="false"
        size="sm"
        onChange={ onChangeSelectedLanguage }
        light
        id="language"
        items={ languageItems }
        initialSelectedItem={ languageItems.find(({ id }) => id === selectedLanguage) }
        placeholder={ 'en (English)' }
        itemToString={ (item) => (item ? item.text : '') }
        titleText="Select Language" />
      {
        hasTranslationsForLanguage && (
          <>
            {
              selectedLanguage !== defaultLanguage && <Checkbox labelText="Use DeepL" id="use-deepl" value={ useDeepl } onChange={ (value) => setUseDeepl(value) } />
            }
            {
              useDeepl && selectedLanguage !== defaultLanguage && (
                <TextInput.PasswordInput
                  id="deepl-authentication-key"
                  labelText="Authentication Key"
                  value={ deeplAuthenticationKey }
                  onInput={ ({ target }) => setDeeplAuthenticationKey(target.value) } />
              )
            }
            <ButtonSet className="translations-modal-buttons">
              {
                useDeepl && selectedLanguage !== defaultLanguage && (
                  <>
                    {
                      deeplSupportedLanguages.find(({ language }) => language === selectedLanguage)
                        ? fetching
                          ? <InlineLoading className="deepl-loading" description="Fetching..." status={ 'active' } />
                          : <Button size="sm" kind="secondary" onClick={ onTranslateWithDeepl }>Translate with DeepL</Button>
                        : <Button size="sm" kind="secondary" disabled>Language not supported by DeepL</Button>
                    }
                  </>
                )
              }
              {
                selectedLanguage !== defaultLanguage && <Button size="sm" kind="secondary" onClick={ removeTranslations }>Remove Translations</Button>
              }
              <Button size="sm" kind="primary" onClick={ addTranslations }>Add Translations</Button>
            </ButtonSet>
          </>
        )
      }
      {
        !hasTranslationsForLanguage && <Button size="sm" onClick={ () => setHasTranslationsForLanguage(true) }>Add translations for { ISO.getName(selectedLanguage) }</Button>
      }
      {
        hasTranslationsForLanguage && (
          <Tabs>
            <Tab id="table" label="Table">
              <DataTable rows={ rows } headers={ headers } size="short" isSortable>
                {
                  ({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                    <Table { ...getTableProps() }>
                      <TableHead>
                        <TableRow>
                          {
                            headers.map((header) => (
                              <TableHeader id={ header.key } key={ header } { ...getHeaderProps({ header }) }>
                                { header.header }
                              </TableHeader>
                            ))
                          }
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          rows.map((row) => {
                            const { cells } = row;

                            const [ elementCell, translationCell ] = cells;

                            return (
                              <TableRow key={ row.id } { ...getRowProps({ row }) }>
                                <TableCell key={ elementCell.id }>{ elementCell.value }</TableCell>
                                <TableCell key={ translationCell.id }>
                                  <TextInput
                                    id={ translationCell.id }
                                    size="sm"
                                    spellCheck="false"
                                    labelText="" hideLabel
                                    value={ translationCell.value }
                                    onInput={ ({ target }) => onTranslationInput(elementCell.value, target.value) } />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  )
                }
              </DataTable>
            </Tab>
            <Tab id="json" label="JSON">
              <CodeSnippet type="multi" feedback="Copied to clipboard">
                {
                  JSON.stringify(translationsJSON, null, 2)
                }
              </CodeSnippet>
            </Tab>
          </Tabs>
        )
      }
    </Modal>
  );
}