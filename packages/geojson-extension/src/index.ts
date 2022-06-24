// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { defaultSanitizer, Dialog, showDialog } from '@jupyterlab/apputils';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../style/index.css';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import * as providers from './providers.json';
import * as access_d from './access_data.json';
const tilelayers_data: { [key: string]: any } = providers;
const access_data: { [key: string]: any } = access_d;
const nameList: Array<string> = [];
for (const val1 of Object.values(tilelayers_data)) {
  if (Object.keys(val1).includes('url')) {
    const name = val1.name;
    nameList.push(name);
  } else {
    for (const val2 of Object.values(val1)) {
      const name = (val2 as any).name;
      nameList.push(name);
    }
  }
}

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

/**
 * Set base path for leaflet images.
 */

// https://github.com/Leaflet/Leaflet/issues/4968
// Marker file names are hard-coded in the leaflet source causing
// issues with webpack.
// This workaround allows webpack to inline all marker URLs.

delete (leaflet.Icon.Default.prototype as any)['_getIconUrl'];

leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

export class DropDownList extends Widget implements Dialog.IBodyWidget<string> {
  constructor(list: Array<string> = []) {
    super();

    this._selectList = document.createElement('select');
    this.node.appendChild(this._selectList);

    for (let i = 0; i < list.length; i++) {
      const option = document.createElement('option');
      option.value = list[i];
      option.text = list[i];
      this._selectList.appendChild(option);
    }
  }

  getValue(): string {
    return this._selectList.value;
  }
  private _selectList: HTMLSelectElement;
}

export class TextInput extends Widget implements Dialog.IBodyWidget<string> {
  constructor(placeHolder: string) {
    super();
    this._urlInput = document.createElement('input');
    this._urlInput.type = 'password';
    this._urlInput.placeholder = placeHolder;
    this.node.appendChild(this._urlInput);
  }
  getValue(): string {
    return this._urlInput.value;
  }
  private _urlInput: HTMLInputElement;
}

export class RenderedGeoJSON extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering GeoJSON.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this.addClass(CSS_CLASS);
    this._mimeType = options.mimeType;
    // Create leaflet map object
    // trackResize option set to false as it is not needed to track
    // window.resize events since we have individual phosphor resize
    // events.
    this._map = leaflet.map(this.node, {
      trackResize: false,
    });
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
    return new Promise<void>((resolve, reject) => {
      //----------------------------------------------------------------------------

      const tilelayerButton = document.createElement('button');
      tilelayerButton.className = 'button-container';
      this.node.append(tilelayerButton);
      tilelayerButton.style.right = '0px';
      tilelayerButton.innerHTML = 'Dropdown';

      tilelayerButton.onclick = () =>
        showDialog({
          title: 'Select your tilelayer please',
          body: new DropDownList(nameList),
          buttons: [Dialog.cancelButton(), Dialog.okButton()],
        }).then((result) => {
          console.log('result.value: ', result.value);
          const input_name = result.value;

          if (input_name.includes('.')) {
            const APIname = input_name.split('.')[0];
            const subname = input_name.split('.')[1];
            if (Object.keys(access_data).includes(APIname)) {
              showDialog({
                title: '',
                body: new TextInput('Enter the APIkey please'),
                buttons: [Dialog.cancelButton(), Dialog.okButton()],
              }).then((result) => {
                const code = access_data[APIname].keyString;
                tilelayers_data[APIname][subname][code] = result.value;
                const layer = leaflet.tileLayer(
                  tilelayers_data[APIname][subname].url,
                  tilelayers_data[APIname][subname]
                );
                layer.addTo(this._map);
              });
            } else {
              const layer = leaflet.tileLayer(
                tilelayers_data[APIname][subname].url,
                tilelayers_data[APIname][subname]
              );
              layer.addTo(this._map);
            }
          } else {
            const APIname = input_name;
            if (Object.keys(access_data).includes(APIname)) {
              showDialog({
                title: '',
                body: new TextInput('Enter the APIKEY please'),
                buttons: [Dialog.cancelButton(), Dialog.okButton()],
              }).then((result) => {
                const code = access_data[APIname].keyString;
                tilelayers_data[APIname][code] = result.value;
                const layer = leaflet.tileLayer(
                  tilelayers_data[APIname].url,
                  tilelayers_data[APIname]
                );
                layer.addTo(this._map);
              });
            } else {
              const layer = leaflet.tileLayer(
                tilelayers_data[APIname].url,
                tilelayers_data[APIname]
              );
              layer.addTo(this._map);
            }
          }
        });

      // Create GeoJSON layer from data and add to map
      this._geoJSONLayer = leaflet
        .geoJSON(data, {
          onEachFeature: function (feature, layer) {
            if (feature.properties) {
              let popupContent = '<table>';
              for (const p in feature.properties) {
                popupContent +=
                  '<tr><td>' +
                  p +
                  ':</td><td><b>' +
                  feature.properties[p] +
                  '</b></td></tr>';
              }
              popupContent += '</table>';
              layer.bindPopup(defaultSanitizer.sanitize(popupContent));
            }
          },
        })
        .addTo(this._map);
      this.update();
      resolve();
    });
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    if (this.parent.hasClass('jp-OutputArea-child')) {
      // Disable scroll zoom by default to avoid conflicts with notebook scroll
      this._map.scrollWheelZoom.disable();
      // Enable scroll zoom on map focus
      this._map.on('blur', (event) => {
        this._map.scrollWheelZoom.disable();
      });
      // Disable scroll zoom on blur
      this._map.on('focus', (event) => {
        this._map.scrollWheelZoom.enable();
      });
    }
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
      this._map.invalidateSize();
    }
    // Update map size after panel/window is resized
    this._map.fitBounds(this._geoJSONLayer.getBounds());
  }

  private _map: leaflet.Map;
  private _geoJSONLayer: leaflet.GeoJSON;
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
