// Specs: https://mjml.io/documentation/#mjml-section
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-section';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
      defaults: {
        name: 'Section',
        draggable: '[data-gjs-type=mj-body],[data-gjs-type=mj-wrapper]',
        droppable: '[data-gjs-type=mj-column]',
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'vertical-align': 'top',
          'text-align': 'center',
        },
        stylable: [
          'vertical-align', 'text-align',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'background-color', 'background-url', 'background-repeat', 'background-size',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color'
        ],
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'div',
      attributes: {
        style: 'pointer-events: all;',
        'data-type': 'mj-section',
      },

      getMjmlTemplate() {
        let parentView = this.model.parent().view;
        if (parentView.getInnerMjmlTemplate) {
          let mjmlBody = coreMjmlView.getInnerMjmlTemplate.call(parentView);
          return {
            start: `<mjml><mj-body>${mjmlBody.start}`,
            end: `${mjmlBody.end}</mj-body></mjml>`,
          };
        } else {
          return {
            start: `<mjml><mj-body>`,
            end: `</mj-body></mjml>`,
          };
        }
      },

      getChildrenSelector() {
        return 'table > tbody > tr > td';
      },

      getTemplateFromEl(sandboxEl) {
        /*
         * mj-section can be rendered inside mj-body or mj-wrapper.
         * Since getMjmlTemplate uses parentView to render the template,
         * the parent might be a mj-wrapper.
         *
         * So the template that gets renreder can be:
         *
         * mjml -> mj-body -> mj-section or
         * mjml -> mj-body -> mj-wrapper -> mj-section
         *
         * In case of latter, we need a different query selector,
         * which is one more level nested.
         */

        const parent = this.model.parent();

        if (parent.get('type') === 'mj-wrapper')
          return sandboxEl.querySelector('table > tbody > tr > td').innerHTML;
        else
          return sandboxEl.firstChild.innerHTML;
      },

      init() {
        coreMjmlView.init.call(this);
        this.listenTo(this.model.get('components'), 'add remove', this.render);
      },
    },
  });
};
