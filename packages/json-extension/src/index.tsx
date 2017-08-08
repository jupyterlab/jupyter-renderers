// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Widget
} from '@phosphor/widgets';

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import {
  Component
} from './component';

import '../style/index.css';


/**
 * The CSS class to add to the JSON Widget.
 */
const CSS_CLASS = 'jp-RenderedJSON';

/**
 * The MIME type for JSON.
 */
export
const MIME_TYPE = 'application/json';


export
class RenderedJSON extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering JSON.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this.addClass(CSS_CLASS);
    this._mimeType = options.mimeType;
  }

  /**
   * Render JSON into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const data = model.data[this._mimeType] as any;
    const metadata = model.metadata[this._mimeType] as any || {};
    const props = { data, metadata, theme: 'cm-s-jupyter' };
    return new Promise<void>((resolve, reject) => {
      ReactDOM.render(<Component {...props} />, this.node, () => {
        resolve(undefined);
      });
    });
  }

  private _mimeType: string;
}


/**
 * A mime renderer factory for GeoJSON data.
 */
export
const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new RenderedJSON(options)
};


const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    name: 'JSON',
    rendererFactory,
    rank: 0,
    dataType: 'json',
    documentWidgetFactoryOptions: {
      name: 'JSON',
      primaryFileType: 'json',
      fileTypes: ['json', 'notebook'],
      defaultFor: ['json']
    }
  }
];

export default extensions;
