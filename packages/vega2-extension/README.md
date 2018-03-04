# vega2-extension

A JupyterLab extension for rendering Vega 2 and Vega-lite 1.

**Vega 2 is deprecated. The latest version comes by default with JupyterLab. Only use this extension if you have specifications that do not work with the latest version.**

## Prerequisites

* JupyterLab ^0.30.0

## Usage

To render Vega 2 or Vega-lite 1 output in IPython:

```python
from IPython.display import display

display({
    "application/vnd.vegalite.v1+json": {
        "$schema": "https://vega.github.io/schema/vega-lite/v1.json",
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

To render a `.vg`, `.vl`, `.vg.json`, `.vl.json` file, simply open it:

## Install

```bash
jupyter labextension install @jupyterlab/vega2-extension
```

## Development

```bash
# Clone the repo to your local environment
git clone https://github.com/jupyterlab/jupyter-renderers.git
cd jupyter-renderers
# Install dependencies
yarn install
# Build Typescript source
yarn run build
# Link your development version of the extension with JupyterLab
jupyter labextension link packages/vega2-extension
# Rebuild Typescript source after making changes
yarn run build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the jupyter-renderers directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
# Watch the jupyter-renderers directory
yarn run watch
```

## Uninstall

```bash
jupyter labextension uninstall @jupyterlab/vega2-extension
```
