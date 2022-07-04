// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Widget } from '@lumino/widgets';

import { Message } from '@lumino/messaging';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { defaultSanitizer, Dialog, showDialog } from '@jupyterlab/apputils';

import { StringExt } from '@lumino/algorithm';

import { layersIcon } from './icons';

//import { jupyterIcon } from '@jupyterlab/ui-components';

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
for (const [key1, val1] of Object.entries(tilelayers_data)) {
  if (Object.keys(val1).includes('url')) {
    const name = tilelayers_data[key1].name;
    if (name !== undefined && !nameList.includes(name)) {
      nameList.push(name);
    }
  } else {
    for (const key2 of Object.keys(val1)) {
      const name = tilelayers_data[key1][key2].name;
      if (name !== undefined && !nameList.includes(name)) {
        nameList.push(name);
      }
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

export interface IResult {
  /**
   * The value was matched.
   */
  readonly value: string;

  /**
   * The indices of the matched characters.
   */
  readonly indices: ReadonlyArray<number> | null;

  /**
   * The string value of the item to be compared with the query, before applying to theLowerCase.
   */
  readonly valueWithCase: string;
}

/**
 * A text match score with associated with a string value item
 */
interface IScore {
  /**
   * The numerical score for the text match.
   */
  score: number;

  /**
   * The indices of the matched characters.
   */
  indices: number[] | null;

  /**
   * The value associated with the match.
   */
  value: string;

  /**
   * The value associated with the match but with the capital letters included as required for the tilelayer name recognition.
   */
  valueWithCase: string;
}

/**
 * Normalize the query text for a fuzzy search.
 */
function normalizeQuery(text: string): string {
  return text.replace(/\s+/g, '').toLocaleLowerCase();
}
/**
 * Perform a fuzzy search on a single command item.
 */
function fuzzySearch(item: string, query: string): IScore | null {
  // Create the source text to be searched.
  const value = item.toLocaleLowerCase();
  const valueWithCase = item;

  // Set up the match score and indices array.
  let score = Infinity;
  let indices: number[] | null = null;

  // The regex for search word boundaries
  const rgx = /\b\w/g;

  // Search the source by word boundary.

  // Find the next word boundary in the source.
  const rgxMatch = rgx.exec(value);

  // Run the string match on the relevant substring.
  const match = StringExt.matchSumOfDeltas(value, query, rgxMatch.index);

  // Update the match if the score is better.
  if (match && match.score <= score) {
    score = match.score;
    indices = match.indices;
  }

  // Bail if there was no match.
  if (!indices || score === Infinity) {
    return null;
  }

  return { indices, score, value, valueWithCase };
}

/**
 * Search an array of string values for fuzzy matches.
 */
export function search(items: string[], query: string): IResult[] {
  return matchItems(items, query).sort((a, b) => a.score - b.score);
}

/**
 * Perform a fuzzy match on an array of command items.
 */
function matchItems(items: string[], query: string): IScore[] {
  // Normalize the query text to lower case with no whitespace.
  query = normalizeQuery(query);

  // Create the array to hold the scores.
  const scores: IScore[] = [];

  // Iterate over the items and match against the query.
  for (let i = 0, n = items.length; i < n; ++i) {
    const item = items[i];

    // If the query is empty, all items are matched by default.
    if (!query) {
      scores.push({
        indices: null,
        score: 0,
        value: item,
        valueWithCase: item,
      });
      continue;
    }

    // Run the fuzzy search for the item and query.
    const score = fuzzySearch(item, query);

    // Ignore the item if it is not a match.
    if (!score) {
      continue;
    }

    // Add the score to the results.
    scores.push(score);
  }

  // Return the final array of scores.
  return scores;
}

export class TilelayerPalette
  extends Widget
  implements Dialog.IBodyWidget<string>
{
  constructor(list: Array<string> = []) {
    super();
    this.node.style.height = '270px';
    this.node.style.height = '400px';
    this._query = document.createElement('input');
    this._query.type = 'text';
    this._query.style.width = '400px';
    this._query.placeholder = 'Enter your query';
    this.node.appendChild(this._query);

    this._selectList = document.createElement('select');
    this._selectList.style.width = '400px';
    this._selectList.className = 'select-list';

    this._query.addEventListener('keyup', (event) => {
      this._selectList.innerHTML = null;
      const results = search(nameList, this._query.value);
      this.node.appendChild(this._selectList);
      this._selectList.size = results.length;
      for (let i = 0, n = results.length; i < n; ++i) {
        const option = document.createElement('option');
        option.value = results[i].valueWithCase;
        option.text = results[i].valueWithCase;
        this._selectList.appendChild(option);
      }
    });
  }

  getValue(): string {
    return this._selectList.value;
  }
  private _selectList: HTMLSelectElement;
  private _query: HTMLInputElement;
}

export class TextInput extends Widget implements Dialog.IBodyWidget<string> {
  constructor(placeHolder = '') {
    super();
    this.node.style.height = '270px';
    this.node.style.height = '400px';
    this._urlInput = document.createElement('input');
    this._urlInput.type = 'password';
    this._urlInput.style.width = '400px';
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
    const layer = leaflet.tileLayer(
      tilelayers_data['OpenStreetMap']['Mapnik'].url,
      tilelayers_data['OpenStreetMap']['Mapnik']
    );
    layer.addTo(this._map);
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
      const button = document.createElement('button');
      button.className = 'button-container';
      this.node.append(button);
      button.style.right = '0px';
      layersIcon.element({
        container: button,
        height: '32px',
        width: '32px',
        marginRight: '0px',
      });

      button.onclick = () =>
        showDialog({
          title: '',
          body: new TilelayerPalette(nameList),
          buttons: [Dialog.cancelButton(), Dialog.okButton()],
        }).then((result) => {
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
                const APIkey = access_data[APIname].keyString;
                tilelayers_data[APIname][APIkey] = result.value;
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
