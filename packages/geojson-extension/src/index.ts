// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Widget } from '@lumino/widgets';

import { Message } from '@lumino/messaging';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import {view} from 'geoverview';

import '../style/index.css';

/**
 * The CSS class to add to the GeoJSON Widget.
 */
const CSS_CLASS = 'jp-RenderedGeoJSON';

/**
 * The CSS class for a GeoJSON icon.
 */
const CSS_ICON_CLASS = 'jp-MaterialIcon jp-GeoJSONIcon';

/**
 * The MIME type for GeoJSON.
 */
export const MIME_TYPE = 'application/geo+json';

export class RenderedGeoJSON extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering GeoJSON.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this.addClass(CSS_CLASS);
    this._mimeType = options.mimeType;
  }

  /**
   * Dispose of the widget.
   */
  dispose(): void {
    super.dispose();
  }

  /**
   * Render GeoJSON into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const data = model.data[this._mimeType] as any;
    return new Promise<void>((resolve, reject) => {
      const map = view(data);
      this.node.appendChild(map.next().value);
      map.next();
      this.update();
      resolve();
    });
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this.update();
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
    // Update map size after update
    if (this.isVisible) {
    }
  }

  private _mimeType: string;
}

/**
 * A mime renderer factory for GeoJSON data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: (options) => new RenderedGeoJSON(options),
};

const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    id: '@jupyterlab/geojson-extension:factory',
    rendererFactory,
    rank: 0,
    dataType: 'json',
    fileTypes: [
      {
        name: 'geojson',
        mimeTypes: [MIME_TYPE],
        extensions: ['.geojson', '.geo.json'],
        iconClass: CSS_ICON_CLASS,
      },
    ],
    documentWidgetFactoryOptions: {
      name: 'GeoJSON',
      primaryFileType: 'geojson',
      fileTypes: ['geojson', 'json'],
      defaultFor: ['geojson'],
    },
  },
];

export default extensions;
