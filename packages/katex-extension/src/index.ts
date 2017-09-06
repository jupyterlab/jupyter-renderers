// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import {
  renderMathInElement
} from './autorender';

import '../style/index.css';

/**
 * The MathJax Typesetter.
 */
export
class KatexTypesetter implements IRenderMime.ILatexTypesetter {
  /**
   * Typeset the math in a node.
   */
  typeset(node: HTMLElement): void {
    renderMathInElement(node);
  }
}

/**
 * The KaTex extension.
 */
const katexPlugin: JupyterLabPlugin<void> = {
  id: 'jupyter.extensions.katex',
  requires: [],
  activate: (app: JupyterLab) => {
    const typesetter = new KatexTypesetter();
    app.rendermime.latexTypesetter = typesetter;
  },
  autoStart: true
}

export default katexPlugin;
