import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import BpmnI18nSchema from 'bpmn-i18n-moddle/resources/bpmn-i18n.json';

import BpmnInternationalizationModelerModule from '../../lib/modeler';
import BpmnInternationalizationViewerModule from '../../lib/viewer';

import BpmnInternationalizationPreviewModule from './custom';

import fileDrop from 'file-drops';

import exampleXML from '../resources/example.bpmn';

const url = new URL(window.location.href);

const persistent = url.searchParams.has('p');

const initialDiagram = (() => {
  try {
    return persistent && localStorage['diagram-xml'] || exampleXML;
  } catch (err) {
    return exampleXML;
  }
})();

function hideDropMessage() {
  const dropMessage = document.querySelector('.drop-message');

  dropMessage.style.display = 'none';
}

if (persistent) {
  hideDropMessage();
}

const ExampleModule = {
  __init__: [
    [ 'eventBus', 'bpmnjs', function(eventBus, bpmnjs) {

      if (persistent) {
        eventBus.on('commandStack.changed', function() {
          bpmnjs.saveXML().then(result => {
            localStorage['diagram-xml'] = result.xml;
          });
        });
      }
    } ]
  ]
};

const modeler = new BpmnModeler({
  container: '#container',
  additionalModules: [
    BpmnInternationalizationModelerModule,
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    ExampleModule
  ],
  keyboard: {
    bindTo: document
  },
  moddleExtensions: {
    i18n: BpmnI18nSchema
  },
  propertiesPanel: {
    parent: '#properties-panel-container'
  }
});

window.saveXML = async () => {
  const { xml } = await modeler.saveXML({ format: true });

  console.log(xml);
};

modeler.openDiagram = function(diagram) {
  return this.importXML(diagram)
    .then(({ warnings }) => {
      if (warnings.length) {
        console.warn(warnings);
      }

      if (persistent) {
        localStorage['diagram-xml'] = diagram;
      }

      this.get('canvas').zoom('fit-viewport');
    })
    .catch(err => {
      console.error(err);
    });
};

document.body.addEventListener('dragover', fileDrop('Open BPMN diagram', function(files) {

  // files = [ { name, contents }, ... ]

  if (files.length) {
    hideDropMessage();
    modeler.openDiagram(files[0].contents);
  }

}), false);

modeler.openDiagram(initialDiagram);

const openPreview = document.querySelector('.open-preview'),
      preview = document.querySelector('.preview'),
      previewContainer = document.querySelector('.preview-container');

let viewer;

openPreview.addEventListener('click', async () => {
  preview.classList.remove('preview-hidden');

  viewer = new BpmnViewer({
    container: previewContainer,
    additionalModules: [
      BpmnInternationalizationPreviewModule,
      BpmnInternationalizationViewerModule
    ],
    keyboard: {
      bindTo: document
    },
    moddleExtensions: {
      i18n: BpmnI18nSchema
    },
    propertiesPanel: {
      parent: '#properties-panel-container'
    }
  });

  const { xml } = await modeler.saveXML();

  await viewer.importXML(xml);
});

preview.addEventListener('click', function({ target }) {
  if (target !== preview) {
    return;
  }

  preview.classList.add('preview-hidden');

  if (viewer) {
    viewer.destroy();
  }
});

window.addEventListener('keydown', function({ key }) {
  if (preview.classList.contains('preview-hidden') || key !== 'Escape') {
    return;
  }

  preview.classList.add('preview-hidden');

  if (viewer) {
    viewer.destroy();
  }
});