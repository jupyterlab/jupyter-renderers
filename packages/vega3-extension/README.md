# vega3-extension

A JupyterLab extension for rendering Vega 3 and Vega-lite 2

![demo](http://g.recordit.co/JmaWb6crQj.gif)

## Prerequisites

* JupyterLab ^0.30.0

## Usage

To render Vega 3 or Vega-lite 2 output in IPython:

```python
from IPython.display import display

display({
    "application/vnd.vega-lite.v2+json": {
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

To render a `.vg`, `.vl`, `.vg.json`, `.vl.json` file, simply open it:

## Install

```bash
jupyter labextension install @jupyterlab/vega3-extension
```

## Development

```bash
# Clone the repo to your local environment
git clone https://github.com/jupyterlab/jupyter-renderers.git
cd jupyter-renderers
# Install dependencies
jlpm install
# Build Typescript source
jlpm run build
# Link your development version of the extension with JupyterLab
jupyter labextension install packages/vega3-extension
# Rebuild Typescript source after making changes
jlpm run build
# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the jupyter-renderers directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
# Watch the jupyter-renderers directory
jlpm run watch
```

## Uninstall

```bash
jupyter labextension uninstall @jupyterlab/vega3-extension
```
