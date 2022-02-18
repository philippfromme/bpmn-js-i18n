import ModelerModule from 'lib/modeler';
import Modeler from 'bpmn-js/lib/modeler';

import BpmnI18nSchema from 'bpmn-i18n-moddle/resources/bpmn-i18n.json';

import { getTranslation } from '../../../lib/utils/TranslationsUtil';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import diagram from '../../fixtures/bpmn/diagram.bpmn';


describe('modeler - Translations', function() {

  describe('basic', function() {

    beforeEach(bootstrapModeler(diagram, {
      additionalModules: [
        ...(Modeler.prototype._modules),
        ModelerModule
      ],
      moddleExtensions: {
        i18n: BpmnI18nSchema
      }
    }));


    it('should get all languages', inject(function(translations) {

      // when
      const languages = translations.getLanguages();

      // then
      expect(languages).to.eql([ 'en', 'de' ]);
    }));


    describe('#getTranslations', function() {

      it('should get translations JSON (default language)', inject(function(translations) {

        // when
        const translationsJSON = translations.getTranslationsJSON();

        // then
        expect(translationsJSON).to.eql({
          'SubProcess_0gc6evc': 'Cash Withdrawal',
          'Task_1upmjgh': 'Prepare Cash',
          'Task_128fg2b': 'Charge Account',
          'Task_16oagb5': 'Issue Money',
          'StartEvent_0j9yk1o': 'Cash Amount Selected',
          'EndEvent_1e8gne7': 'Cash Issued',
          'StartEvent_1': 'ATM Transaction Needed',
          'IntermediateThrowEvent_02yoqsl': 'Cash Withdrawn',
          'Task_1xu25p5': 'Check For Further Interactions',
          'IntermediateCatchEvent_09tc0wh': 'New Interaction Requested',
          'IntermediateCatchEvent_087fl8m': 'No Further Interaction Requested',
          'IntermediateCatchEvent_12qf66u': '30 seconds elapsed',
          'Task_0e0mu6c': 'Return Card',
          'EndEvent_0swhjpo': 'ATM Transaction Finsihed',
          'UserTask_1': 'Insert Card',
          'Task_0p47z7h': 'Select Amount',
          'ExclusiveGateway_13kuced': 'Selected Interaction?',
          'Task_1ept7kl': 'Account Balance Information',
          'StartEvent_13lmuqn': 'Account Balance Requested',
          'Task_180wh31': 'Display Balance',
          'IntermediateThrowEvent_10vhtou': 'Balance checked',
          'EndEvent_1qnlj46': 'Account Balance displayed',
          'Task_0po6mda': 'Select Interaction',
          'Task_1u7pqoy': 'Timeout',
          'BoundaryEvent_Error': 'Error',
          'BoundaryEvent_07intkn': 'Message received',
          'SequenceFlow_1qdqk69': 'Cash Withdrawal',
          'SequenceFlow_091wldx': 'Account Balance',
        });
      }));


      it('should get translations (de)', inject(function(translations) {

        // when
        const language = 'de';

        const translationsJSON = translations.getTranslationsJSON(language);

        // then
        expect(translationsJSON).to.eql({
          'SubProcess_0gc6evc': 'Cash Withdrawal',
          'Task_1upmjgh': 'Prepare Cash',
          'Task_128fg2b': 'Charge Account',
          'Task_16oagb5': 'Issue Money',
          'StartEvent_0j9yk1o': 'Cash Amount Selected',
          'EndEvent_1e8gne7': 'Cash Issued',
          'StartEvent_1': 'ATM-Transaktion erforderlich',
          'IntermediateThrowEvent_02yoqsl': 'Cash Withdrawn',
          'Task_1xu25p5': 'Check For Further Interactions',
          'IntermediateCatchEvent_09tc0wh': 'New Interaction Requested',
          'IntermediateCatchEvent_087fl8m': 'No Further Interaction Requested',
          'IntermediateCatchEvent_12qf66u': '30 seconds elapsed',
          'Task_0e0mu6c': 'Return Card',
          'EndEvent_0swhjpo': 'ATM Transaction Finsihed',
          'UserTask_1': 'Karte einschieben',
          'Task_0p47z7h': 'Select Amount',
          'ExclusiveGateway_13kuced': 'Selected Interaction?',
          'Task_1ept7kl': 'Account Balance Information',
          'StartEvent_13lmuqn': 'Account Balance Requested',
          'Task_180wh31': 'Display Balance',
          'IntermediateThrowEvent_10vhtou': 'Balance checked',
          'EndEvent_1qnlj46': 'Account Balance displayed',
          'Task_0po6mda': 'Select Interaction',
          'Task_1u7pqoy': 'Timeout',
          'BoundaryEvent_Error': 'Error',
          'BoundaryEvent_07intkn': 'Message received',
          'SequenceFlow_1qdqk69': 'Cash Withdrawal',
          'SequenceFlow_091wldx': 'Account Balance',
        });
      }));

    });


    describe('#setTranslations', function() {

      describe('should create translation', function() {

        const language = 'se';

        let businessObject;

        beforeEach(inject(function(elementRegistry, translations) {

          // given
          const startEvent = elementRegistry.get('StartEvent_1');

          businessObject = getBusinessObject(startEvent);

          // assume
          const translation = getTranslation(businessObject, language);

          expect(translation).not.to.exist;

          // when
          translations.setTranslations(language, {
            'StartEvent_1': 'Behövs för ATM-transaktioner'
          });
        }));

        it('do', function() {

          // then
          const translation = getTranslation(businessObject, language);

          expect(translation).to.exist;
          expect(translation.get('xml:lang')).to.equal(language);
          expect(translation.get('body')).to.equal('Behövs för ATM-transaktioner');
        });


        it('undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          const translation = getTranslation(businessObject, language);

          expect(translation).not.to.exist;
        }));


        it('redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const translation = getTranslation(businessObject, language);

          expect(translation).to.exist;
          expect(translation.get('xml:lang')).to.equal(language);
          expect(translation.get('body')).to.equal('Behövs för ATM-transaktioner');
        }));

      });


      describe('should update translation', function() {

        const language = 'de';

        let businessObject;

        beforeEach(inject(function(elementRegistry, translations) {

          // given
          const startEvent = elementRegistry.get('StartEvent_1');

          businessObject = getBusinessObject(startEvent);

          // assume
          const translation = getTranslation(businessObject, language);

          expect(translation).to.exist;
          expect(translation.get('xml:lang')).to.equal(language);
          expect(translation.get('body')).to.equal('ATM-Transaktion erforderlich');

          // when
          translations.setTranslations(language, {
            'StartEvent_1': 'Automated Teller Machine Transaktion erforderlich'
          });
        }));


        it('do', function() {

          // then
          const translation = getTranslation(businessObject, language);

          expect(translation).to.exist;
          expect(translation.get('xml:lang')).to.equal(language);
          expect(translation.get('body')).to.equal('Automated Teller Machine Transaktion erforderlich');
        });


        it('undo', inject(function(commandStack) {

          // when
          commandStack.undo();

          // then
          const translation = getTranslation(businessObject, language);

          expect(translation).to.exist;
          expect(translation.get('xml:lang')).to.equal(language);
          expect(translation.get('body')).to.equal('ATM-Transaktion erforderlich');
        }));


        it('redo', inject(function(commandStack) {

          // when
          commandStack.undo();
          commandStack.redo();

          // then
          const translation = getTranslation(businessObject, language);

          expect(translation).to.exist;
          expect(translation.get('xml:lang')).to.equal(language);
          expect(translation.get('body')).to.equal('Automated Teller Machine Transaktion erforderlich');
        }));

      });


      it('should not set translations if language is not a valid ISO-631-1 language code', inject(
        function(elementRegistry, translations) {

          // given
          const language = 'foo';

          const startEvent = elementRegistry.get('StartEvent_1');

          const businessObject = getBusinessObject(startEvent);

          // when
          translations.setTranslations(language, {
            'StartEvent_1': 'Behövs för ATM-transaktioner'
          });

          // then
          const translation = getTranslation(businessObject, language);

          expect(translation).not.to.exist;
        }
      ));

    });


    describe('#setDefaultLanguage', function() {

      const language = 'de';

      beforeEach(inject(function(translations) {

        // assume
        const defaultLanguage = translations.getDefaultLanguage();

        expect(defaultLanguage).to.equal('en');

        // when
        translations.setDefaultLanguage(language);
      }));


      it('do', inject(function(translations) {

        // then
        const defaultLanguage = translations.getDefaultLanguage();

        expect(defaultLanguage).to.equal(language);
      }));


      it('undo', inject(function(commandStack, translations) {

        // when
        commandStack.undo();

        // then
        const defaultLanguage = translations.getDefaultLanguage();

        expect(defaultLanguage).to.equal('en');
      }));


      it('redo', inject(function(commandStack, translations) {

        // when
        commandStack.undo();
        commandStack.redo();

        // then
        const defaultLanguage = translations.getDefaultLanguage();

        expect(defaultLanguage).to.equal(language);
      }));

    });


    it('should not set default language if language is not a valid ISO-631-1 language code', inject(
      function(translations) {

        // given
        const language = 'foo';

        // when
        translations.setDefaultLanguage(language);

        // then
        const defaultLanguage = translations.getDefaultLanguage();

        expect(defaultLanguage).to.equal('en');
      }
    ));

  });

});