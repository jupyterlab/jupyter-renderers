# jupyterlab-geojson

A JupyterLab extension for rendering GeoJSON

![demo](http://g.recordit.co/SsWJCpKIJy.gif)

## Requirements

- JupyterLab >= 3.0

## Install

```bash
pip install jupyterlab-geojson
```

## Usage

To render GeoJSON output in IPython:

```python
from IPython.display import GeoJSON

GeoJSON({
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [-118.4563712, 34.0163116]
    }
})
```

To use a specific tileset:

```python
GeoJSON(
    data={
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-118.4563712, 34.0163116]
        }
    }, url_template="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=[MAPBOX_ACCESS_TOKEN]",
    layer_options={
        "id": "mapbox.streets",
        "attribution" : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
)
```

To render GeoJSON on Mars:

```python
GeoJSON(
  data={
      "type": "Feature",
      "geometry": {
          "type": "Point",
          "coordinates": [11.8, -45.04]
      }
  }, url_template="http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/{basemap_id}/{z}/{x}/{y}.png",
  layer_options={
      "basemap_id": "celestia_mars-shaded-16k_global",
      "attribution" : "Celestia/praesepe",
      "tms": True,
      "minZoom" : 0,
      "maxZoom" : 5
  }
)
```

To render a `.geojson` or `.geo.json` file, simply open it.

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab-geojson directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Uninstall

```bash
pip uninstall jupyterlab-geojson
```
