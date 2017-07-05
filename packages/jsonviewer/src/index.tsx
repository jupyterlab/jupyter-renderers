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
 * The MIME type for Vega.
 *
 * #### Notes
 * The version of this follows the major version of Vega.
 */
export
const MIME_TYPE = 'application/json';


export
class RenderedJSON extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering Vega/Vega-Lite.
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
class JSONRendererFactory implements IRenderMime.IRendererFactory {
  /**
   * The mimeTypes this renderer accepts.
   */
  mimeTypes = [MIME_TYPE];

  /**
   * * Whether the renderer can create a renderer given the render options.
   */
  canCreateRenderer(options: IRenderMime.IRendererOptions): boolean {
    return this.mimeTypes.indexOf(options.mimeType) !== -1;
  }

  /**
   * Render the transformed mime bundle.
   */
  createRenderer(options: IRenderMime.IRendererOptions): IRenderMime.IRenderer {
    return new RenderedJSON(options);
  }

  /**
   * Whether the renderer will sanitize the data given the render options.
   */
  wouldSanitize(options: IRenderMime.IRendererOptions): boolean {
    return false;
  }
}


const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    mimeType: MIME_TYPE,
    rendererFactory: new JSONRendererFactory(),
    rank: 0,
    dataType: 'json',
    documentWidgetFactoryOptions: {
      name: 'JSON',
      fileExtensions: ['.json', '.ipynb'],
      defaultFor: ['.json'],
      readOnly: true
    }
  }
];

export default extensions;
