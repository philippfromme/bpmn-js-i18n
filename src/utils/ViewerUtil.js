import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';

import BpmnI18nSchema from 'bpmn-i18n-moddle/resources/bpmn-i18n.json';

import ViewerModule from '../../../lib/viewer';

import { gray10, gray80 } from '@carbon/colors';

export function createViewer(container) {
  return new BpmnViewer({
    container,
    additionalModules: [
      ViewerModule
    ],
    keyboard: {
      bindTo: document
    },
    moddleExtensions: {
      i18n: BpmnI18nSchema
    },
    bpmnRenderer: {
      defaultFillColor: gray10,
      defaultStrokeColor: gray80
    }
  });
}

const padding = 100;

/**
 * Fit viewport with padding.
 *
 * @param {Canvas} canvas
 */
export function fitViewport(canvas) {
  const viewbox = canvas.viewbox();

  const {
    inner,
    outer
  } = viewbox;

  let newScale,
      newViewbox;

  if (inner.x >= 0 &&
      inner.y >= 0 &&
      inner.x + inner.width <= outer.width &&
      inner.y + inner.height <= outer.height) {

    newViewbox = {
      x: 0 - padding,
      y: 0 - padding,
      width: Math.max(inner.width + inner.x, outer.width) + (padding * 2),
      height: Math.max(inner.height + inner.y, outer.height) + (padding * 2)
    };
  } else {
    newScale = Math.min(1, outer.width / inner.width, outer.height / inner.height);

    newViewbox = {
      x: inner.x - padding,
      y: inner.y - padding,
      width: outer.width / newScale + (padding * 2),
      height: outer.height / newScale + (padding * 2)
    };
  }

  canvas.viewbox(newViewbox);
}