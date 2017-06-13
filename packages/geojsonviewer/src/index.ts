/**
  Copyright (c) Jupyter Development Team.
  Distributed under the terms of the Modified BSD License.
*/

export * from './widget';

import '../style/index.css';

import 'leaflet/dist/leaflet.css';

/**
 * The file extensions of GeoJSON.
 */
export const FILE_EXTENSIONS = ['.geojson', '.geo.json'];


/**
 * The name of the factory that creates geojson widgets.
 */
export const FACTORY = 'GeoJSON';


/**
 * The name of the factory that creates geojson widgets.
 */
export const NAMESPACE = 'rendered-geojson';
