import { LabIcon } from '@jupyterlab/ui-components';
import layersSvgstr from '../style/icons/layers-32px.svg';
import mapSvgstr from '../style/icons/geojson.svg';

export const layersIcon = new LabIcon({
  name: '@jupyterlab/geojson-extension:layers',
  svgstr: layersSvgstr
});

export const mapIcon = new LabIcon({
  name: '@jupyterlab/geojson-extension:map',
  svgstr: mapSvgstr
});
