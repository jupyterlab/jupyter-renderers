// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Widget } from '@phosphor/widgets';

import { Message } from '@phosphor/messaging';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import * as Plotly from 'plotly.js/dist/plotly';

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
 * The version of this follows the major version of Plotly.
 */
export const MIME_TYPE = 'application/vnd.plotly.v1+json';

interface PlotlySpec {
  data: Plotly.Data;
  layout: Plotly.Layout;
  frames?: Plotly.Frame[];
}

export class RenderedPlotly extends Widget implements IRenderMime.IRenderer {
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
    const { data, layout, frames } = model.data[this._mimeType] as
      | any
      | PlotlySpec;
    // const metadata = model.metadata[this._mimeType] as any || {};
    return Plotly.newPlot(this.node, data, layout).then(plot => {
      if (frames) {
        return Plotly.addFrames(this.node, frames).then(() => {
          Plotly.animate(this.node);
          this.update();
          return Plotly.toImage(plot, {
            format: 'png',
            width: this.node.offsetWidth,
            height: this.node.offsetHeight
          }).then((url: string) => {
            const imageData = url.split(',')[1];
            model.setData({ data: { ...data, 'image/png': imageData } });
          });
        });
      }
      this.update();
      return Plotly.toImage(plot, {
        format: 'png',
        width: this.node.offsetWidth,
        height: this.node.offsetHeight
      }).then((url: string) => {
        const imageData = url.split(',')[1];
        model.setData({ data: { ...data, 'image/png': imageData } });
      });
    });
  }

  /**
   * A message handler invoked on an `'after-show'` message.
   */
  protected onAfterShow(msg: Message): void {
    this.update();
  }

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: Widget.ResizeMessage): void {
    this.update();
  }

  /**
   * A message handler invoked on an `'update-request'` message.
   */
  protected onUpdateRequest(msg: Message): void {
    if (this.isVisible) {
      Plotly.redraw(this.node).then(() => {
        Plotly.Plots.resize(this.node);
      });
    }
  }

  private _mimeType: string;
}

/**
 * A mime renderer factory for Plotly data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new RenderedPlotly(options)
};

const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    id: '@jupyterlab/plotly-extension:factory',
    rendererFactory,
    rank: 0,
    dataType: 'json',
    fileTypes: [
      {
        name: 'plotly',
        mimeTypes: [MIME_TYPE],
        extensions: ['.plotly', '.plotly.json'],
        iconClass: CSS_ICON_CLASS
      }
    ],
    documentWidgetFactoryOptions: {
      name: 'Plotly',
      primaryFileType: 'plotly',
      fileTypes: ['plotly', 'json'],
      defaultFor: ['plotly']
    }
  }
];

export default extensions;
