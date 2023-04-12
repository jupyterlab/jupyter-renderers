/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { JSONObject, ReadonlyJSONObject } from '@lumino/coreutils';

import { Widget } from '@lumino/widgets';

/**
 * The CSS class to add to the Vega and Vega-Lite widget.
 */
const VEGA_COMMON_CLASS = 'jp-RenderedVegaCommon';

/**
 * The CSS class to add to the Vega.
 */
const VEGA_CLASS = 'jp-RenderedVega';

/**
 * The CSS class to add to the Vega-Lite.
 */
const VEGALITE_CLASS = 'jp-RenderedVegaLite';

/**
 * The MIME type for Vega.
 *
 * #### Notes
 * The version of this follows the major version of Vega.
 */
export const VEGA_MIME_TYPE = 'application/vnd.vega.v2+json';

/**
 * The MIME type for Vega-Lite.
 *
 * #### Notes
 * The version of this follows the major version of Vega-Lite.
 */
export const VEGALITE_MIME_TYPE = 'application/vnd.vegalite.v1+json';

/**
 * A widget for rendering Vega or Vega-Lite data, for usage with rendermime.
 */
export class RenderedVega extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering Vega/Vega-Lite.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this.addClass(VEGA_COMMON_CLASS);

    // Handle things related to the MIME type.
    const mimeType = (this._mimeType = options.mimeType);
    if (mimeType === VEGA_MIME_TYPE) {
      this.addClass(VEGA_CLASS);
      this._mode = 'vega';
    } else {
      this.addClass(VEGALITE_CLASS);
      this._mode = 'vega-lite';
    }
  }

  /**
   * Render Vega/Vega-Lite into this widget's node.
   */
  async renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const data = model.data[this._mimeType] as ReadonlyJSONObject;
    let updatedData: JSONObject;
    if (this._mode === 'vega-lite') {
      updatedData = Private.updateVegaLiteDefaults(data);
    } else {
      updatedData = data as JSONObject;
    }

    const embedSpec = {
      mode: this._mode,
      spec: updatedData
    };

    const embedFunc = await import('vega-embed-v2');
    const result = await embedFunc.default(this.node, embedSpec);
    if (!model.data['image/png']) {
      const imageData = ((await result.view.toImageURL('png')) as string).split(
        ','
      )[1];
      const newData = { ...model.data, 'image/png': imageData };
      model.setData({ data: newData });
    }
  }

  private _mimeType: string;
  private _mode: string;
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
  id: '@jupyterlab/vega2-extension:factory',
  rendererFactory,
  rank: 60,
  dataType: 'json',
  documentWidgetFactoryOptions: [
    {
      name: 'Vega 2',
      primaryFileType: 'vega2',
      fileTypes: ['vega2', 'json'],
      defaultFor: ['vega2']
    },
    {
      name: 'Vega-Lite 1',
      primaryFileType: 'vega-lite1',
      fileTypes: ['vega-lite1', 'json'],
      defaultFor: ['vega-lite1']
    }
  ],
  fileTypes: [
    {
      mimeTypes: [VEGA_MIME_TYPE],
      name: 'vega2',
      extensions: ['.vg', '.vg.json', '.vega'],
      iconClass: 'jp-MaterialIcon jp-VegaIcon'
    },
    {
      mimeTypes: [VEGALITE_MIME_TYPE],
      name: 'vega-lite1',
      extensions: ['.vl', '.vl.json', '.vegalite'],
      iconClass: 'jp-MaterialIcon jp-VegaIcon'
    }
  ]
};

export default extension;

/**
 * Namespace for module privates.
 */
namespace Private {
  /**
   * Default cell config for Vega-Lite.
   */
  const defaultCellConfig: JSONObject = {
    width: 400,
    height: 400 / 1.5
  };

  /**
   * Apply the default cell config to the spec in place.
   *
   * #### Notes
   * This carefully does a shallow copy to avoid copying the potentially
   * large data.
   */
  export function updateVegaLiteDefaults(spec: ReadonlyJSONObject): JSONObject {
    const config = spec.config as JSONObject;
    if (!config) {
      return { ...{ config: { cell: defaultCellConfig } }, ...spec };
    }
    const cell = config.cell as JSONObject;
    if (cell) {
      return {
        ...{
          config: { ...{ cell: { ...defaultCellConfig, ...cell } } },
          ...config
        },
        ...spec
      };
    } else {
      return {
        ...{ config: { ...{ cell: { ...defaultCellConfig } } }, ...config },
        ...spec
      };
    }
  }
}
