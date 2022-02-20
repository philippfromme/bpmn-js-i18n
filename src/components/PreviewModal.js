import React, { useEffect, useRef, useState } from 'react';

import { Dropdown, Modal } from 'carbon-components-react';

import {
  createViewer,
  fitViewport
} from '../utils/ViewerUtil';

import ISO from 'iso-639-1';

import { Loading } from 'carbon-components-react';

import './preview-modal.scss';

export default function PreviewModal(props) {
  const {
    modeler,
    onClose
  } = props;

  const containerRef = useRef();

  const [ viewer, setViewer ] = useState();

  const [ imported, setImported ] = useState(false);

  const [ languages, setLanguages ] = useState([]);

  const [ selectedLanguage, setSelectedLanguage ] = useState();

  useEffect(() => {
    const viewer = createViewer(containerRef.current);

    (async () => {
      const { xml } = await modeler.saveXML({ format: true });

      await viewer.importXML(xml);

      setViewer(viewer);

      fitViewport(viewer.get('canvas'));

      const languages = viewer.get('translator').getLanguages();

      setLanguages(languages);

      setSelectedLanguage(viewer.get('translator').getDefaultLanguage());

      setImported(true);
    })();

    return () => viewer.destroy();
  }, []);

  const onChange = ({ selectedItem }) => {
    if (!selectedItem) {
      return;
    }

    const { id: language } = selectedItem;

    setSelectedLanguage(language);

    viewer.get('translator').translateDiagram(language);
  };

  const items = languages.map(language => {
    const text = ISO.getName(language) ? `${ language } (${ ISO.getName(language) })` : language;

    return {
      id: language,
      text: text
    };
  });

  return (
    <Modal
      className="preview-modal"
      modalHeading="Preview"
      open={ true }
      passiveModal={ true }
      size="lg"
      onRequestClose={ onClose }>
      <div className="viewer-container" ref={ containerRef }></div>
      {
        !imported && (
          <div className="preview-modal-loader">
            <Loading small={ true } withOverlay={ false } />
          </div>
        )
      }
      {
        languages && languages.length && selectedLanguage ? (
          <div className="preview-modal-language">
            <Dropdown
              size="sm"
              id="preview-modal-language-select"
              titleText="Select Language"
              direction="top"
              initialSelectedItem={ items.find(({ id }) => id === selectedLanguage) }
              onChange={ onChange }
              items={ items }
              itemToString={ (item) => (item ? item.text : '') }
              label="Select Language" />
          </div>
        ) : null
      }
    </Modal>
  );
}