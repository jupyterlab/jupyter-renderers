# Jupyter Renderers

[![Binder](https://beta.mybinder.org/badge.svg)](https://mybinder.org/v2/gh/jupyterlab/jupyter-renderers/master?urlpath=lab/tree/notebooks)

This is a [monorepo](https://github.com/lerna/lerna#what-does-a-lerna-repo-look-like) that consists of generic renderers for common file types and mime types as well as renderer extensions for [JupyterLab](https://github.com/jupyterlab/jupyterlab).

## Packages

| Name        | Mime types           | File extensions |
| ----------- | -------------------- | --------------- |
| [fasta-extension](packages/fasta-extension) | `application/vnd.fasta.fasta` | `.fasta` |
| [geojson-extension](packages/geojson-extension) | `application/geo+json` | `.geojson`, `.geo.json` |
| [katex-extension](packages/katex-extension) | N/A | N/A |
| [plotly-extension](packages/plotly-extension) | `application/vnd.plotly.v1+json` | `.plotly`, `.plotly.json` |
| [vega3-extension](packages/vega3-extension) | `application/vnd.vega.v3+json`, `application/vnd.vegalite.v2+json`| `.vg`, `.vl`, `.vg.json`, `.vl.json` |

## Install

* fasta-extension: `jupyter labextension install @jupyterlab/fasta-extension`
* geojson-extension: `jupyter labextension install @jupyterlab/geojson-extension`
* katex-extension: `jupyter labextension install @jupyterlab/katex-extension`
* plotly-extension: `jupyter labextension install @jupyterlab/plotly-extension`
* vega3-extension: `jupyter labextension install @jupyterlab/vega3-extension`

## Contributing

### Developer install

Requires the [yarn](https://yarnpkg.com/) package manager.

```bash
git clone https://github.com/jupyterlab/jupyter-renderers.git
cd jupyter-renderers
yarn install
yarn run build
```

### Link extensions with JupyterLab

Link geojson-extension:

```bash
jupyter labextension link packages/geojson-extension
```

Link all extensions in `packages`:

```bash
yarn run link
```

### Rebuilding extensions

After making changes to the source packages, the packages must be rebuilt:

```bash
# Rebuild the source
yarn run build

# Rebuild the JupyterLab staging directory
jupyter lab build
```

You may also watch the `jupyter-renderers` directory for changes and automatically rebuild:

```
# In one terminal tab, watch the jupyter-renderers directory
yarn run watch

# In another terminal tab, run jupyterlab with the watch flag
jupyter lab --watch
```

### Publishing packages

```bash
yarn run publish
# If publishing a package for the first time
npm access public @jupyterlab/<extension name>
```
