/**
  Copyright (c) Jupyter Development Team.
  Distributed under the terms of the Modified BSD License.
*/

import {
  Message,
} from '@phosphor/messaging';

import {
  PanelLayout
} from '@phosphor/widgets';

import {
  Widget
} from '@phosphor/widgets';

import {
  ActivityMonitor
} from '@jupyterlab/coreutils';

import {
  JSONObject
} from '@phosphor/coreutils';

import {
  DocumentRegistry, 
  ABCWidgetFactory
} from '@jupyterlab/docregistry';

import {
  MimeModel, 
  RenderMime
} from '@jupyterlab/rendermime';

import * as leaflet from 'leaflet';


/**
 * The class name added to a Jupyter GeoJSONViewer.
 */
const GEOJSON_CLASS = 'jp-GeoJSONViewer';


/**
 * The class name added to a Jupyter GeoJSONViewer.
 */
const RENDERED_GEOJSON_CLASS = 'jp-RenderedGeoJSON';


/**
 * The timeout to wait for change activity to have ceased before rendering.
 */
const RENDER_TIMEOUT = 1000;


/**
 * The mime type of GeoJSON.
 */
export const MIME_TYPE = 'application/geo+json';


/**
 * Set base path for leaflet images.
 */
leaflet.Icon.Default.imagePath = 'https://unpkg.com/leaflet/dist/images/';


/**
 * The url template that leaflet tile layers.
 * See http://leafletjs.com/reference-1.0.3.html#tilelayer
 */
const URL_TEMPLATE: string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';


/**
 * The options for leaflet tile layers.
 * See http://leafletjs.com/reference-1.0.3.html#tilelayer
 */
const LAYER_OPTIONS: JSONObject = {
  attribution: 'Map data (c) <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  minZoom: 0,
  maxZoom: 18
};


/**
 * A widget for displaying GeoJSON.
 */
export
class RenderedGeoJSON extends Widget {
  /**
   * Construct a new GeoJSON widget.
   */
  constructor(options: RenderMime.IRenderOptions) {
    super(options);
    this.addClass(RENDERED_GEOJSON_CLASS);
    const data = options.model.data.get(options.mimeType) as JSONObject | GeoJSON.GeoJsonObject;
    const metadata = options.model.metadata.get(options.mimeType) as JSONObject || {};
    this._map = leaflet.map(this.node).fitWorld();
    this._map.scrollWheelZoom.disable();
    leaflet.tileLayer(
      metadata.url_template as string || URL_TEMPLATE, 
      metadata.layer_options as JSONObject || LAYER_OPTIONS
    ).addTo(this._map);
    this._geoJSONLayer = leaflet.geoJSON(data as GeoJSON.GeoJsonObject).addTo(this._map);
    this._map.fitBounds(this._geoJSONLayer.getBounds());
    this._map.invalidateSize();
  }
  
  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    this._map.remove();
    this._map = null;
    // this._geoJSONLayer = null;
    super.dispose();
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  onAfterAttach(msg: Message): void {
    this._map.fitBounds(this._geoJSONLayer.getBounds());
    this._map.invalidateSize();
  }
  
  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: Widget.ResizeMessage) {
    this._width = msg.width;
    this._height = msg.height;
    this._map.fitBounds(this._geoJSONLayer.getBounds());
    this._map.invalidateSize();
  }

  private _map: leaflet.Map;
  private _geoJSONLayer: leaflet.GeoJSON;
  private _width = -1;
  private _height = -1;
}

/**
 * A mime renderer for GeoJSON.
 */
export
class GeoJSONRenderer implements RenderMime.IRenderer {
  /**
   * The mimeTypes this renderer accepts.
   */
  mimeTypes = [MIME_TYPE];

  /**
   * Whether the renderer can render given the render options.
   */
  canRender(options: RenderMime.IRenderOptions): boolean {
    return this.mimeTypes.indexOf(options.mimeType) !== -1;
  }

  /**
   * Render the transformed mime bundle.
   */
  render(options: RenderMime.IRenderOptions): Widget {
    return new RenderedGeoJSON(options);
  }

  /**
   * Whether the renderer will sanitize the data given the render options.
   */
  wouldSanitize(options: RenderMime.IRenderOptions): boolean {
    return !options.model.trusted;
  }
}


/**
 * A widget for rendered GeoJSON.
 */
export
class GeoJSONViewer extends Widget {
  /**
   * Construct a new GeoJSON widget.
   */
  constructor(context: DocumentRegistry.Context, rendermime: RenderMime) {
    super();
    this.addClass(GEOJSON_CLASS);
    this.layout = new PanelLayout();
    this.title.label = context.path.split('/').pop();
    this._rendermime = rendermime;
    rendermime.resolver = context;
    this._context = context;

    context.pathChanged.connect(this._onPathChanged, this);

    // Throttle the rendering rate of the widget.
    this._monitor = new ActivityMonitor({
      signal: context.model.contentChanged,
      timeout: RENDER_TIMEOUT
    });
    this._monitor.activityStopped.connect(this.update, this);    
  }

  /**
   * The GeoJSON widget's context.
   */
  get context(): DocumentRegistry.Context {
    return this._context;
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._monitor.dispose();
    super.dispose();
  }

  /**
   * Handle `'activate-request'` messages.
   */
  protected onActivateRequest(msg: Message): void {
    this.node.tabIndex = -1;
    this.node.focus();
  }

  /**
   * Handle an `after-attach` message to the widget.
   */
  protected onAfterAttach(msg: Message): void {
    this.update();
  }
  
  /**
   * Handle an `update-request` message to the widget.
   */
  protected onUpdateRequest(msg: Message): void {
    const context = this._context;
    const model = context.model;
    if (model.toString() === '') return;
    let data = {};
    try {
      data = {
        [MIME_TYPE]: JSON.parse(model.toString())
      };
    } catch (error) {
      data = {
        'application/vnd.jupyter.stderr': error.message
      };
    }
    const mimeModel = new MimeModel({ data, trusted: false });
    const widget = this._rendermime.render(mimeModel);
    const layout = this.layout as PanelLayout;
    if (layout.widgets.length) {
      layout.widgets[0].dispose();
    }
    layout.addWidget(widget);
  }

  /**
   * Handle a path change.
   */
  private _onPathChanged(): void {
    this.title.label = this._context.path.split('/').pop();
  }

  private _context: DocumentRegistry.Context = null;
  private _monitor: ActivityMonitor<any, any> = null;
  private _rendermime: RenderMime = null;
}


/**
 * A widget factory for GeoJSON.
 */
export
class GeoJSONViewerFactory extends ABCWidgetFactory<GeoJSONViewer, DocumentRegistry.IModel> {
  /**
   * Construct a new GeoJSON widget factory.
   */
  constructor(options: GeoJSONViewerFactory.IOptions) {
    super(options);
    this._rendermime = options.rendermime;
  }

  /**
   * Create a new widget given a context.
   */
  protected createNewWidget(context: DocumentRegistry.Context): GeoJSONViewer {
    return new GeoJSONViewer(context, this._rendermime.clone());
  }

  private _rendermime: RenderMime = null;
}


/**
 * A namespace for `GeoJSONViewerFactory` statics.
 */
export
namespace GeoJSONViewerFactory {
  /**
   * The options used to create a GeoJSON widget factory.
   */
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    /**
     * A rendermime instance.
     */
    rendermime: RenderMime;
  }
}
