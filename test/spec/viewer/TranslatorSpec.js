import ViewerModule from 'lib/viewer';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';

import BpmnI18nSchema from 'bpmn-i18n-moddle/resources/bpmn-i18n.json';

import {
  bootstrapViewer,
  inject
} from 'test/TestHelper';

import diagram from '../../fixtures/bpmn/diagram.bpmn';


describe('viewer - Translator', function() {

  describe('basic', function() {

    beforeEach(bootstrapViewer(diagram, {
      additionalModules: [
        ...(NavigatedViewer.prototype._modules),
        ViewerModule
      ],
      moddleExtensions: {
        i18n: BpmnI18nSchema
      }
    }));


    it('should get language', inject(function(translator) {

      // when
      const language = translator.getLanguage();

      // then
      expect(language).to.eql('en');
    }));


    it('should get all languages', inject(function(translator) {

      // when
      const languages = translator.getLanguages();

      // then
      expect(languages).to.eql([ 'en', 'de' ]);
    }));


    it('should get default language', inject(function(translator) {

      // when
      const defaultLanguage = translator.getDefaultLanguage();

      // then
      expect(defaultLanguage).to.eql('en');
    }));


    it('should translate diagram', inject(function(translator) {

      // when
      translator.translateDiagram('de');

      // then
      const language = translator.getLanguage();

      expect(language).to.eql('de');
    }));

  });

});