// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Widget
} from '@phosphor/widgets';

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import * as Plotly from 'plotly.js/lib/core';

import '../style/index.css';


/**
 * The CSS class to add to the Plotly Widget.
 */
const CSS_CLASS = 'jp-RenderedPlotly';

/**
 * The CSS class for a Plotly icon.
 */
const CSS_ICON_CLASS = 'jp-MaterialIcon jp-PlotlyIcon';

/**
 * The MIME type for Plotly.
 */
export
const MIME_TYPE = 'application/vnd.plotly.v1+json';

interface PlotlySpec {
  data: Plotly.Data,
  layout: Plotly.Layout
}


export
class RenderedPlotly extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering Plotly.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this.addClass(CSS_CLASS);
    this._mimeType = options.mimeType;
  }

  /**
   * Render Plotly into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const { data, layout } = model.data[this._mimeType] as any|PlotlySpec;
    // const metadata = model.metadata[this._mimeType] as any || {};
    return new Promise<void>((resolve, reject) => {
      Plotly.newPlot(this.node, data, layout)
        .then(() => Plotly.Plots.resize(this.node))
        // .then(plot =>
        //   Plotly.toImage(plot, {
        //     format: 'png',
        //     width: this._width,
        //     height: this._height
        //   }))
        .then(() => {
          // const data = url.split(',')[1];
          resolve(undefined);
        });
    });
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: Widget.ResizeMessage) {
    this._width = msg.width;
    this._height = msg.height;
    Plotly.redraw(this.node)
      .then(() => {
        Plotly.Plots.resize(this.node);
      });
      // .then(plot =>
      //   Plotly.toImage(plot, {
      //     format: 'png',
      //     width: this._width,
      //     height: this._height
      //   }))
      // .then(url => {
      //   const data = url.split(',')[1];
      // });
  }

  private _width = -1;
  private _height = -1;
  private _mimeType: string;
}


/**
 * A mime renderer factory for GeoPlotly data.
 */
export
const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new RenderedPlotly(options)
};


const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    name: 'Plotly',
    rendererFactory,
    rank: 0,
    dataType: 'json',
    fileTypes: [{
      name: 'plotly',
      mimeTypes: [MIME_TYPE],
      extensions: ['.plotly', '.plotly.json'],
      iconClass: CSS_ICON_CLASS
    }],
    documentWidgetFactoryOptions: {
      name: 'Plotly',
      primaryFileType: 'plotly',
      fileTypes: ['plotly'],
      defaultFor: ['plotly']
    }
  }
];

export default extensions;
