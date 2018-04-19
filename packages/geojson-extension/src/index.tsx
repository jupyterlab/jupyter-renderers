// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Widget
} from '@phosphor/widgets';

import {
  Message
} from '@phosphor/messaging';

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import mapboxgl = require('mapbox-gl');

import bbox from '@turf/bbox';

import 'leaflet/dist/leaflet.css';

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
export
const MIME_TYPE = 'application/geo+json';

mapboxgl.accessToken = 'pk.eyJ1IjoibWlja3QiLCJhIjoiLXJIRS1NbyJ9.EfVT76g4A5dyuApW_zuIFQ';


export
class RenderedGeoJSON extends Widget implements IRenderMime.IRenderer {
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
    // Dispose of leaflet map
    this._map.remove();
    this._map = null;
    super.dispose();
  }

  /**
   * Render GeoJSON into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    const data = model.data[this._mimeType] as any | GeoJSON.GeoJsonObject;
    // const metadata = model.metadata[this._mimeType] as any || {};
    this._map = new mapboxgl.Map({
      container: this.node,
      style: 'mapbox://styles/mapbox/streets-v9?optimize=true',
      zoom: 10
    });
    return new Promise<void>((resolve, reject) => {
      // Add GeoJSON layer to map
      this._map.on('style.load', () => {
        this._map.addSource('geojson', {
          type: 'geojson',
          data
        });
        const [minX, minY, maxX, maxY] = bbox(data);
        this._map.fitBounds([[minX, minY], [maxX, maxY]], { maxZoom: 15, padding: 100 });
        this._map.addLayer({
          id: 'geojson-points',
          type: 'circle',
          source: 'geojson',
          paint: {
            'circle-color': 'red',
            'circle-stroke-color': 'white',
            'circle-stroke-width': { stops: [[0,0.1], [18,3]], base: 1.2 },
            'circle-radius': { stops: [[15,3], [18,5]], base: 1.2 }
          }
        });
        this.update();
        resolve();
      });
    });
  }
  
  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    // If in a notebook context
    // if (this.parent.hasClass('jp-OutputArea-child')) {
    //   // Disable scroll zoom by default to avoid conflicts with notebook scroll
    //   this._map.scrollZoom.disable();
    //   // Enable scroll zoom on map focus
    //   this._map.on('blur', (event: Event) => {
    //     this._map.scrollZoom.disable();
    //   });
    //   // Disable scroll zoom on blur
    //   this._map.on('focus', (event: Event) => {
    //     this._map.scrollZoom.enable();
    //   });
    // }
    // this.update();
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
    if (this._map && this.isVisible) {
      this._map.resize();
    }
  }

  private _map: mapboxgl.Map;
  // private _geoJSONLayer: mapboxgl.GeoJSONSource;
  private _mimeType: string;
}


/**
 * A mime renderer factory for GeoJSON data.
 */
export
const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new RenderedGeoJSON(options)
};


const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    id: '@jupyterlab/geojson-extension:factory',
    rendererFactory,
    rank: 0,
    dataType: 'json',
    fileTypes: [{
      name: 'geojson',
      mimeTypes: [MIME_TYPE],
      extensions: ['.geojson', '.geo.json'],
      iconClass: CSS_ICON_CLASS
    }],
    documentWidgetFactoryOptions: {
      name: 'GeoJSON',
      primaryFileType: 'geojson',
      fileTypes: ['geojson', 'json'],
      defaultFor: ['geojson']
    }
  }
];

export default extensions;
