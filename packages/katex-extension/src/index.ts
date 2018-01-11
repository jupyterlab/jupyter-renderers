// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ILatexTypesetter
} from '@jupyterlab/rendermime';

import {
  renderMathInElement
} from './autorender';

import '../style/index.css';

/**
 * The KaTeX Typesetter.
 */
export
class KatexTypesetter implements ILatexTypesetter {
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
const katexPlugin: JupyterLabPlugin<ILatexTypesetter> = {
  id: 'jupyter.extensions.katex',
  requires: [],
  activate: () => new KatexTypesetter(),
  autoStart: true
}

export default katexPlugin;
