# jupyterlab-vega3

A JupyterLab extension for rendering Vega 3 and Vega-Lite 2

**Vega 3 is deprecated. The latest version comes by default with JupyterLab. Only use this extension if you have specifications that do not work with the latest version.**

![demo](http://g.recordit.co/USoTkuCOfR.gif)

## Requirements

- JupyterLab >= 3.0

## Install

```bash
pip install jupyterlab-vega3
```

## Usage

To render Vega-Lite output in IPython:

```python
from IPython.display import display

display({
    "application/vnd.vegalite.v2+json": {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "description": "A simple bar chart with embedded data.",
        "data": {
            "values": [
                {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
                {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
                {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
            ]
        },
        "mark": "bar",
        "encoding": {
            "x": {"field": "a", "type": "ordinal"},
            "y": {"field": "b", "type": "quantitative"}
        }
    }
}, raw=True)
```

Using the [altair library](https://github.com/altair-viz/altair):

```python
import altair as alt

cars = alt.load_dataset('cars')

chart = alt.Chart(cars).mark_point().encode(
    x='Horsepower',
    y='Miles_per_Gallon',
    color='Origin',
)

chart
```

Provide vega-embed options via metadata:

```python
from IPython.display import display

display({
    "application/vnd.vegalite.v2+json": {
        "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
        "description": "A simple bar chart with embedded data.",
        "data": {
            "values": [
                {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
                {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
                {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
            ]
        },
        "mark": "bar",
        "encoding": {
            "x": {"field": "a", "type": "ordinal"},
            "y": {"field": "b", "type": "quantitative"}
        }
    }
}, metadata={
    "application/vnd.vegalite.v2+json": {
        "embed_options": {
            "actions": False
        }
    }
}, raw=True)
```

Provide vega-embed options via altair:

```python
import altair as alt

alt.renderers.enable('default', embed_options={'actions': False})

cars = alt.load_dataset('cars')

chart = alt.Chart(cars).mark_point().encode(
    x='Horsepower',
    y='Miles_per_Gallon',
    color='Origin',
)

chart
```

To render a `.vl`, `.vg`, `vl.json` or `.vg.json` file, simply open it:

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab-vega3 directory
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
pip uninstall jupyterlab-vega3
```
