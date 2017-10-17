# Jupyter Renderers

[![Binder](https://beta.mybinder.org/badge.svg)](https://beta.mybinder.org/v2/gh/jupyterlab/jupyter-renderers/master)

This is a [monorepo](https://github.com/lerna/lerna#what-does-a-lerna-repo-look-like) that consists of generic renderers for common file types and mime types as well as renderer extensions for [JupyterLab](https://github.com/jupyterlab/jupyterlab).

## Packages

| Name        | Mime types           | File extensions |
| ----------- | -------------------- | --------------- |
| [geojson-extension](packages/geojson-extension) | `application/geo+json` | `.geojson`, `.geo.json` |
| [json-extension](packages/json-extension) | `application/json` | `.json`, `.ipynb` |
| [plotly-extension](packages/plotly-extension) | `application/vnd.plotly.v1+json` | `.plotly`, `.plotly.json` |
| [vdom-extension](packages/vdom-extension) | `application/vdom.v1+json` | `.vdom`, `.vdom.json` |

## Install

* geojson-extension: `jupyter labextension install @jupyterlab/geojson-extension`
* json-extension: `jupyter labextension install @jupyterlab/json-extension`
* plotly-extension: `jupyter labextension install @jupyterlab/plotly-extension`
* vdom-extension: `jupyter labextension install @jupyterlab/vdom-extension`

## Contributing

### Developer install

```
git clone https://github.com/jupyterlab/jupyter-renderers.git
cd jupyter-renderers
npm install
npm run build
```

### Link extensions with JupyterLab

Link geojson-extension:

```
jupyter labextension link packages/geojson-extension
```

### Rebuilding extensions

After making changes to the source of the extension or renderer packages, the packages must be rebuilt:

```
# Rebuild the source
npm run build

# Rebuild the JupyterLab staging directory
jupyter lab build
```

You may also watch the `jupyter-renderers` directory for changes and automatically rebuild:

```
# In one terminal tab, watch the jupyter-renderers directory
lerna run watch

# In another terminal tab, run jupyterlab with the watch flag
jupyter lab --watch
```
