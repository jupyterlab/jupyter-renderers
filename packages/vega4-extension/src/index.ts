/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { JSONObject } from '@phosphor/coreutils';

import { Widget } from '@phosphor/widgets';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import vegaEmbed, { Result, EmbedOptions, Mode } from 'vega-embed';

import '../style/index.css';

/**
 * The CSS class to add to the Vega and Vega-Lite widget.
 */
const VEGA_COMMON_CLASS = 'jp-RenderedVegaCommon4';

/**
 * The CSS class to add to the Vega.
 */
const VEGA_CLASS = 'jp-RenderedVega4';

/**
 * The CSS class to add to the Vega-Lite.
 */
const VEGALITE_CLASS = 'jp-RenderedVegaLite2';

/**
 * The MIME type for Vega.
 *
 * #### Notes
 * The version of this follows the major version of Vega.
 */
export const VEGA_MIME_TYPE = 'application/vnd.vega.v4+json';

/**
 * The MIME type for Vega-Lite.
 *
 * #### Notes
 * The version of this follows the major version of Vega-Lite.
 */
export const VEGALITE_MIME_TYPE = 'application/vnd.vegalite.v2+json';

/**
 * A widget for rendering Vega or Vega-Lite data, for usage with rendermime.
 */
export class RenderedVega extends Widget implements IRenderMime.IRenderer {
  private _result: Result;

  /**
   * Create a new widget for rendering Vega/Vega-Lite.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this._resolver = options.resolver;
    this.addClass(VEGA_COMMON_CLASS);
    this.addClass(
      this._mimeType === VEGA_MIME_TYPE ? VEGA_CLASS : VEGALITE_CLASS
    );
  }

  /**
   * Render Vega/Vega-Lite into this widget's node.
   */
  async renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const spec = model.data[this._mimeType] as JSONObject;
    const metadata = model.metadata[this._mimeType] as {
      embed_options?: EmbedOptions;
    };
    const embedOptions =
      metadata && metadata.embed_options ? metadata.embed_options : {};
    const mode: Mode = this._mimeType === VEGA_MIME_TYPE ? 'vega' : 'vega-lite';

    const path = await this._resolver.resolveUrl('');
    const baseURL = await this._resolver.getDownloadUrl(path);

    const el = document.createElement('div');

    // clear the output before attaching a chart
    this.node.innerHTML = '';
    this.node.appendChild(el);

    this._result = await vegaEmbed(el, spec, {
      actions: true,
      defaultStyle: true,
      ...embedOptions,
      mode,
      loader: {
        baseURL,
        http: { credentials: 'same-origin' }
      }
    });

    if (model.data['image/png']) {
      return;
    }

    // Add png representation of vega chart to output
    const imageURL = await this._result.view.toImageURL('png');
    model.setData({
      data: { ...model.data, 'image/png': imageURL.split(',')[1] }
    });
  }

  dispose(): void {
    if (this._result) {
      this._result.view.finalize();
    }
    super.dispose();
  }

  private _mimeType: string;
  private _resolver: IRenderMime.IResolver;
}

/**
 * A mime renderer factory for vega data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [VEGA_MIME_TYPE, VEGALITE_MIME_TYPE],
  createRenderer: options => new RenderedVega(options)
};

const extension: IRenderMime.IExtension = {
  id: '@jupyterlab/vega4-extension:factory',
  rendererFactory,
  rank: 58, // prefer over vega 3 extension
  dataType: 'json',
  documentWidgetFactoryOptions: [
    {
      name: 'Vega 4',
      primaryFileType: 'vega4',
      fileTypes: ['vega4', 'json'],
      defaultFor: ['vega4']
    },
    {
      name: 'Vega-Lite 2',
      primaryFileType: 'vega-lite2',
      fileTypes: ['vega-lite2', 'json']
    }
  ],
  fileTypes: [
    {
      mimeTypes: [VEGA_MIME_TYPE],
      name: 'vega4',
      extensions: ['.vg', '.vg.json', '.vega'],
      iconClass: 'jp-MaterialIcon jp-VegaIcon'
    },
    {
      mimeTypes: [VEGALITE_MIME_TYPE],
      name: 'vega-lite2',
      extensions: ['.vl', '.vl.json', '.vegalite'],
      iconClass: 'jp-MaterialIcon jp-VegaIcon'
    }
  ]
};

export default extension;
