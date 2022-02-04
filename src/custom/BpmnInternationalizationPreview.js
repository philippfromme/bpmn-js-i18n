import ISO from 'iso-639-1';

const HIGH_PRIORITY = 5000;

export default class BpmnInternationalizationUI {
  constructor(bpmnInternationalization, canvas, eventBus) {
    this._bpmnInternationalization = bpmnInternationalization;

    this._container = null;
    this._select = null;

    eventBus.on('import.done', HIGH_PRIORITY, () => {
      canvas.zoom('fit-viewport');

      const container = this._container = document.createElement('div');

      container.classList.add('preview-language');

      const label = document.createElement('span');

      label.textContent = 'Language';

      container.appendChild(label);

      canvas.getContainer().appendChild(container);
    });

    eventBus.on([ 'import.done', 'elements.changed' ], () => this.updateSelect());
  }

  updateSelect() {
    if (this._select) {
      this._select.remove();
    }

    const select = this._select = document.createElement('select');

    // TODO: fix, not working
    const selectedLanguage = this._bpmnInternationalization.getLanguages().indexOf(this._bpmnInternationalization.getLanguage());

    select.selectedIndex = selectedLanguage;

    select.classList.add('preview-language-select');

    select.addEventListener('change', ({ target }) => {
      const { value: language } = target;

      this._bpmnInternationalization.translateDiagram(language);
    });

    this._bpmnInternationalization.getLanguages().forEach(language => {
      const option = document.createElement('option');

      option.value = language;
      option.textContent = ISO.getName(language) ? `${ language } (${ ISO.getName(language) })` : language;

      select.appendChild(option);
    });

    this._container.appendChild(select);
  }
}

BpmnInternationalizationUI.$inject = [
  'bpmnInternationalization',
  'canvas',
  'eventBus'
];