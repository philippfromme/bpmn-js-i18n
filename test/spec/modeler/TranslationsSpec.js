import ModelerModule from 'lib/modeler';
import Modeler from 'bpmn-js/lib/modeler';

import BpmnI18nSchema from 'bpmn-i18n-moddle/resources/bpmn-i18n.json';

import { getTranslation } from '../../../lib/utils/TranslationsUtil';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';


describe('modeler - Translations', function() {

  describe('basic', function() {

    const diagram = require('./simple.bpmn');

    beforeEach(bootstrapModeler(diagram, {
      additionalModules: [
        ...(Modeler.prototype._modules),
        ModelerModule
      ],
      moddleExtensions: {
        i18n: BpmnI18nSchema
      }
    }));


    it('should get translations JSON', inject(function(translations) {

      // when
      const json = translations.getTranslationsJSON();

      // then
      expect(json).to.eql({
        'SubProcess_0gc6evc': 'Cash Withdrawal',
        'Task_1upmjgh': 'Prepare Cash',
        'Task_128fg2b': 'Charge Account',
        'Task_16oagb5': 'Issue Money',
        'StartEvent_0j9yk1o': 'Cash Amount Selected',
        'StartEvent_0j9yk1o_label': 'Cash Amount Selected',
        'EndEvent_1e8gne7': 'Cash Issued',
        'EndEvent_1e8gne7_label': 'Cash Issued',
        'StartEvent_1': 'ATM Transaction Needed',
        'StartEvent_1_label': 'ATM Transaction Needed',
        'IntermediateThrowEvent_02yoqsl': 'Cash Withdrawn',
        'IntermediateThrowEvent_02yoqsl_label': 'Cash Withdrawn',
        'Task_1xu25p5': 'Check For Further Interactions',
        'IntermediateCatchEvent_09tc0wh': 'New Interaction Requested',
        'IntermediateCatchEvent_09tc0wh_label': 'New Interaction Requested',
        'IntermediateCatchEvent_087fl8m': 'No Further Interaction Requested',
        'IntermediateCatchEvent_087fl8m_label': 'No Further Interaction Requested',
        'IntermediateCatchEvent_12qf66u': '30 seconds elapsed',
        'IntermediateCatchEvent_12qf66u_label': '30 seconds elapsed',
        'Task_0e0mu6c': 'Return Card',
        'EndEvent_0swhjpo': 'ATM Transaction Finsihed',
        'EndEvent_0swhjpo_label': 'ATM Transaction Finsihed',
        'Task_026c0id': 'Insert Card',
        'Task_0p47z7h': 'Select Amount',
        'ExclusiveGateway_13kuced': 'Selected Interaction?',
        'ExclusiveGateway_13kuced_label': 'Selected Interaction?',
        'Task_1ept7kl': 'Account Balance Information',
        'StartEvent_13lmuqn': 'Account Balance Requested',
        'StartEvent_13lmuqn_label': 'Account Balance Requested',
        'Task_180wh31': 'Display Balance',
        'IntermediateThrowEvent_10vhtou': 'Balance checked',
        'IntermediateThrowEvent_10vhtou_label': 'Balance checked',
        'EndEvent_1qnlj46': 'Account Balance displayed',
        'EndEvent_1qnlj46_label': 'Account Balance displayed',
        'Task_0po6mda': 'Select Interaction',
        'Task_1u7pqoy': 'Timeout',
        'BoundaryEvent_Error': 'Error',
        'BoundaryEvent_Error_label': 'Error',
        'BoundaryEvent_07intkn': 'Message received',
        'BoundaryEvent_07intkn_label': 'Message received',
        'SequenceFlow_1qdqk69': 'Cash Withdrawal',
        'SequenceFlow_1qdqk69_label': 'Cash Withdrawal',
        'SequenceFlow_091wldx': 'Account Balance',
        'SequenceFlow_091wldx_label': 'Account Balance'
      });
    }));


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

  });

});