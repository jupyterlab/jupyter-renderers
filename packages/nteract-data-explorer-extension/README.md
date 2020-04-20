# nteract-data-explorer-extension

A JupyterLab extension for rendering tabular-data-resource files based on [nteract Data Explorer](https://github.com/nteract/data-explorer).

![demo](http://g.recordit.co/SsWJCpKIJy.gif)

## Prerequisites

- JupyterLab >=1.1.1

## Install

```bash
jupyter labextension install @jupyterlab/nteract-data-explorer-extension
```

## Usage

To render tabular-data-resource output in IPython:

```python
from IPython.display import display

display({
    "application/vnd.dataresource+json": {
      "data": [
        {
          "Country": "Switzerland",
          "Happiness Score": 7.587,
          "index": 0
        },
        {
          "Country": "Iceland",
          "Happiness Score": 7.561,
          "index": 1
        }
      ],
      "schema": {
        "fields": [
         {
          "name": "index",
          "type": "integer"
         },
         {
          "name": "Country",
          "type": "string"
         },
         {
          "name": "Happiness Score",
          "type": "number"
         }
        ],
        "pandas_version": "0.20.0",
        "primaryKey": [
          "index"
        ]
      }
    }
}, raw=True)
```

A more convenient way is to read from CSV files

```python
import pandas as pd
pd.options.display.html.table_schema = True
df = pd.read_csv('path/to/csv/file')
df
```

To render a `.tdrjson` or `.tdr.json` file, simply open it.

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
git clone https://github.com/jupyterlab/jupyter-renderers.git
cd jupyter-renderers

# Install dependencies
jlpm

# Build Typescript source
jlpm build

# Link your development version of the extension with JupyterLab
jupyter labextension link packages/nteract-data-explorer-extension

# Rebuild Typescript source after making changes
jlpm build

# Rebuild JupyterLab after making any changes
jupyter lab build
```

You can watch the jupyter-renderers directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch

# Watch the jupyter-renderers directory in another terminal tab
jlpm watch
```

### Uninstall

```bash
jupyter labextension uninstall @jupyterlab/nteract-data-explorer-extension
```
