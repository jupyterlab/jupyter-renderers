// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ILatexTypesetter } from '@jupyterlab/rendermime';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { IMacros, renderMathInElement } from './autorender';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import '../style/index.css';

const katexPluginId = '@jupyterlab/katex-extension:plugin';

interface IOptions {
  macros?: IMacros;
}

const options: IOptions = {};

/**
 * The KaTeX Typesetter.
 */
export class KatexTypesetter implements IRenderMime.ILatexTypesetter {
  /**
   * Typeset the math in a node.
   */
  typeset(node: HTMLElement): void {
    renderMathInElement(node, options);
  }
}

/**
 * The KaTex extension.
 */
const katexPlugin: JupyterFrontEndPlugin<ILatexTypesetter> = {
  id: katexPluginId,
  requires: [ISettingRegistry],
  provides: ILatexTypesetter,
  activate: (
    jupyterlab: JupyterFrontEnd,
    settingRegistry: ISettingRegistry
  ) => {
    /**
     * Update the setting values.
     */
    function updateSettings(settings: ISettingRegistry.ISettings): void {
      const macros = settings.get('macros').composite as IMacros;
      options.macros = macros;
    }

    settingRegistry
      .load(katexPluginId)
      .then((settings) => {
        settings.changed.connect(updateSettings);
        updateSettings(settings);
      })
      .catch((reason: Error) => {
        console.error(reason.message);
      });
    return new KatexTypesetter();
  },
  autoStart: true,
};

export default katexPlugin;
