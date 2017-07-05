# Jupyter Renderers

<!-- This is a [monorepo](https://github.com/lerna/lerna#what-does-a-lerna-repo-look-like) that consists of generic renderers for common file types and mime types as well as renderer extensions for both [JupyterLab](https://github.com/jupyterlab/jupyterlab) and [Jupyter Notebook](https://github.com/jupyter/notebook). -->

This is a [monorepo](https://github.com/lerna/lerna#what-does-a-lerna-repo-look-like) that consists of generic renderers for common file types and mime types as well as renderer extensions for both [JupyterLab](https://github.com/jupyterlab/jupyterlab)

## Packages

| Name        | Mime types           | File extensions |
| ----------- | -------------------- | --------------- |
| geojsonviewer | `application/geo+json` | `.geojson`, `.geo.json` |
| jsonviewer | `application/json` | `.json`, `.ipynb` |
| plotlyviewer | `application/vnd.plotly.v1+json` | `.plotly`, `.plotly.json` |

## Install

```
git clone https://github.com/gnestor/jupyter-renderers.git
cd jupyter-renderers
npm install
npm run build
```

## Link extensions with JupyterLab

Link geojsonviewer:

```
jupyter labextension link ./packages/geojsonviewer
```

## Developing JupyterLab extensions

After making changes to the source of the extension or renderer packages, the packages must be rebuilt:

```
# Rebuild the source
npm run build

# Rebuild the JupyterLab staging directory
jupyter lab build
```
