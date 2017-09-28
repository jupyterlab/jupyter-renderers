// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Widget
} from '@phosphor/widgets';

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import '../style/index.css';

namespace Private {
  
  declare function require(moduleName: string): string;
  
  /**
   * Is plotly.js being loaded?.
   */
  export
  let loadingPlotly = false;
  
  /**
   * Load plotly.js browser script.
   */
  export
  function loadPlotly(): void {
    loadingPlotly = true;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = require('raw-loader!plotly.js/dist/plotly.min.js');
    document.head.appendChild(script);
  }
  
}

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
 * The version of this follows the major version of Plotly.
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
    if (!Private.loadingPlotly) Private.loadPlotly();
  }

  /**
   * Render Plotly into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const { data, layout } = model.data[this._mimeType] as any|PlotlySpec;
    // const metadata = model.metadata[this._mimeType] as any || {};
    return Plotly.newPlot(this.node, data, layout)
      .then(() => Plotly.Plots.resize(this.node))
      // .then(plot =>
      //   Plotly.toImage(plot, {
      //     format: 'png',
      //     width: this._width,
      //     height: this._height
      //   }))
      // .then(() => {
      //   const data = url.split(',')[1];
      // });
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: Widget.ResizeMessage) {
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

  private _mimeType: string;
}


/**
 * A mime renderer factory for Plotly data.
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
      fileTypes: ['plotly', 'json'],
      defaultFor: ['plotly']
    }
  }
];

export default extensions;
