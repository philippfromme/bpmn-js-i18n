import BpmnInternationalizationViewerModules from 'lib/viewer';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';

import BpmnI18nSchema from 'bpmn-i18n-moddle/resources/bpmn-i18n.json';

import {
  bootstrapViewer,
  inject
} from 'test/TestHelper';


describe('viewer extension', function() {

  describe('basic', function() {

    const diagram = require('./simple.bpmn');

    beforeEach(bootstrapViewer(diagram, {
      additionalModules: [
        ...(NavigatedViewer.prototype._modules),
        BpmnInternationalizationViewerModules
      ],
      moddleExtensions: {
        i18n: BpmnI18nSchema
      }
    }));


    it('should get language', inject(function(bpmnInternationalization) {

      // when
      const language = bpmnInternationalization.getLanguage();

      // then
      expect(language).to.eql('en');
    }));


    it('should get all languages', inject(function(bpmnInternationalization) {

      // when
      const languages = bpmnInternationalization.getLanguages();

      // then
      expect(languages).to.eql([ 'en', 'de' ]);
    }));


    it('should get default language', inject(function(bpmnInternationalization) {

      // when
      const defaultLanguage = bpmnInternationalization.getDefaultLanguage();

      // then
      expect(defaultLanguage).to.eql('en');
    }));


    it('should translate diagram', inject(function(bpmnInternationalization) {

      // when
      bpmnInternationalization.translateDiagram('de');

      // then
      const language = bpmnInternationalization.getLanguage();

      expect(language).to.eql('de');
    }));

  });

});