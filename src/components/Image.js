// Specs: https://mjml.io/documentation/#mjml-image
import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-image';

  dc.addType(type, {
    isComponent: isComponentType(type),
    extend: 'image',

    model: {
      ...coreMjmlModel,
      defaults: {
        name: 'Image',
        resizable: true,
        highlightable: false,
        draggable: '[data-gjs-type=mj-column]',
        stylable: [
          'width', 'height',
          'padding', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
          'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
          'border', 'border-width', 'border-style', 'border-color',
          'container-background-color', 'align',
        ],
        'style-default': {
          'padding-top': '10px',
          'padding-bottom': '10px',
          'padding-right': '25px',
          'padding-left': '25px',
          'align': 'center',
        },
        traits: ['href', 'rel', 'alt', 'title'],
        void: true,
      },

      getEl() {
        return this.view && this.view.el.querySelector('tr > td > table');
      },
    },

    view: {
      ...coreMjmlView,
      tagName: 'tr',
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%; user-select: none;',
      },

      getMjmlTemplate() {
        return {
          start: `<mjml><mj-body><mj-column>`,
          end: `</mj-column></mj-body></mjml>`,
        };
      },

      getTemplateFromEl(sandboxEl) {
        return sandboxEl.querySelector('tr').innerHTML;
      },

      getChildrenSelector() {
        return 'img';
      },
    },
  });
};
