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
| [vega3-extension](packages/vega3-extension) | `application/vnd.vega.v3+json`, `application/vnd.vegalite.v2+json`| `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` |

## Install

* fasta-extension: `jupyter labextension install @jupyterlab/fasta-extension`
* geojson-extension: `jupyter labextension install @jupyterlab/geojson-extension`
* katex-extension: `jupyter labextension install @jupyterlab/katex-extension`
* plotly-extension: `jupyter labextension install @jupyterlab/plotly-extension`
* vega3-extension: `jupyter labextension install @jupyterlab/vega3-extension`

## Contributing

Developing JupyterLab extensions involves using [yarn](https://yarnpkg.com),
a Javascript package manager. JupyterLab distributes a pinned version
of yarn that is aliased to `jlpm`, which is used in many of the following instructions.

### Building the renderer extensions

```bash
git clone https://github.com/jupyterlab/jupyter-renderers.git
cd jupyter-renderers
jlpm install
jlpm run build
```

### Local installations of the extensions

Example installing the geojson-extension:

```bash
jupyter labextension install packages/geojson-extension
```

Install all extensions in `packages`:

```bash
jlpm run link
```

### Rebuilding extensions

After making changes to the source packages, the packages must be rebuilt:

```bash
# Rebuild the source
jlpm run build

# Rebuild the JupyterLab staging directory
jupyter lab build
```

You may also watch the `jupyter-renderers` directory for changes and automatically rebuild:

```
# In one terminal tab, watch the jupyter-renderers directory
jlpm run watch

# In another terminal tab, run jupyterlab with the watch flag
jupyter lab --watch
```

### Publishing packages

```bash
jlpm run publish
# If publishing a package for the first time
npm access public @jupyterlab/<extension name>
```
