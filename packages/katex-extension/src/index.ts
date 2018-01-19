// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ILatexTypesetter
} from '@jupyterlab/rendermime';

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import {
  renderMathInElement
} from './autorender';

import '../style/index.css';

/**
 * The KaTeX Typesetter.
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
const katexPlugin: JupyterLabPlugin<ILatexTypesetter> = {
  id: 'jupyter.extensions.katex',
  provides: ILatexTypesetter,
  activate: () => new KatexTypesetter(),
  autoStart: true
}

export default katexPlugin;
