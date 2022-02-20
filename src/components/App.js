import React, { useEffect, useRef, useState } from 'react';

import {
  CenterCircle16,
  LogoGithub16,
  Translate16,
  View16
} from '@carbon/icons-react';

import PreviewModal from './PreviewModal';
import TranslationsModal from './TranslationsModal';

import { fitViewport } from '../utils/ViewerUtil';

import { createModeler } from '../utils/ModelerUtil';

import { Button, ButtonSet } from 'carbon-components-react';

import initialDiagram from '../../resources/diagram.bpmn';

import './app.scss';

const DEEPL_AUTH_KEY = process.env.DEEPL_AUTH_KEY === 'false' ? null : process.env.DEEPL_AUTH_KEY;

export default function App() {
  const [ diagram, _ ] = useState(initialDiagram);
  const [ translationsModalOpen, setTranslationsModalOpen ] = useState(false);
  const [ previewModalOpen, setPreviewModalOpen ] = useState(false);

  const containerRef = useRef();
  const propertiesPanelParentRef = useRef();

  const [ modeler, setModeler ] = useState();

  const [ deeplAuthenticationKey, setDeeplAuthenticationKey ] = useState(DEEPL_AUTH_KEY);

  useEffect(() => {
    (async () => {
      const modeler = createModeler(containerRef.current, propertiesPanelParentRef.current);

      await modeler.importXML(diagram);

      fitViewport(modeler.get('canvas'));

      setModeler(modeler);
    })();
  }, []);

  const openTranslationsModal = () => {
    setTranslationsModalOpen(true);
  };

  const openPreviewModal = async () => {
    setPreviewModalOpen(true);
  };

  return (
    <>
      <div className="modeler-container" ref={ containerRef }>
        <ButtonSet className="app-controls">
          <Button iconDescription="Center Diagram" tooltipAlignment="center" tooltipPosition="left" size="sm" kind="secondary" renderIcon={ CenterCircle16 } hasIconOnly onClick={ () => fitViewport(modeler.get('canvas')) } />
        </ButtonSet>
        <ButtonSet className="app-buttons">
          <Button size="sm" kind="secondary" onClick={ openTranslationsModal } renderIcon={ Translate16 }>Add Translations</Button>
          <Button size="sm" kind="secondary" onClick={ openPreviewModal } renderIcon={ View16 }>Open Preview</Button>
          <Button size="sm" kind="secondary" onClick={ () => window.open('https://github.com/philippfromme/bpmn-js-i18n') } renderIcon={ LogoGithub16 }>
            View on GitHub
          </Button>
        </ButtonSet>
      </div>
      <div className="properties-panel-container" ref={ propertiesPanelParentRef }></div>
      {
        translationsModalOpen && (
          <TranslationsModal
            modeler={ modeler }
            onClose={ () => setTranslationsModalOpen(false) }
            deeplAuthenticationKey={ deeplAuthenticationKey }
            setDeeplAuthenticationKey={ setDeeplAuthenticationKey } />
        )
      }
      {
        previewModalOpen && <PreviewModal modeler={ modeler } onClose={ () => setPreviewModalOpen(false) } />
      }
    </>
  );
}