// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

/**
 * The MathJax Typesetter.
 */
export
class KatexTypesetter implements IRenderMime.ILatexTypesetter {
  /**
   * Typeset the math in a node.
   */
  typeset(node: HTMLElement): void {
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
  }
}

export default katexPlugin;
