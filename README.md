# Jupyter Renderers

[![Binder](https://beta.mybinder.org/badge.svg)](https://mybinder.org/v2/gh/jupyterlab/jupyter-renderers/master?urlpath=lab/tree/notebooks)

This is a
[monorepo](https://github.com/lerna/lerna#what-does-a-lerna-repo-look-like) that
consists of [JupyterLab](https://github.com/jupyterlab/jupyterlab) _mimerender extensions_ for common file and MIME types.

## Packages

| Name                                              | Mime types                                                         | File extensions                                            | Info                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [fasta-extension](packages/fasta-extension)       | `application/vnd.fasta.fasta`                                      | `.fasta`                                                   | [![Version](https://img.shields.io/npm/v/@jupyterlab/fasta-extension.svg)](https://www.npmjs.com/package/@jupyterlab/fasta-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/fasta-extension.svg)](https://www.npmjs.com/package/@jupyterlab/fasta-extension)             |
| [geojson-extension](packages/geojson-extension)   | `application/geo+json`                                             | `.geojson`, `.geo.json`                                    | [![Version](https://img.shields.io/npm/v/@jupyterlab/geojson-extension.svg)](https://www.npmjs.com/package/@jupyterlab/geojson-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/geojson-extension.svg)](https://www.npmjs.com/package/@jupyterlab/geojson-extension)     |
| [katex-extension](packages/katex-extension)       | N/A                                                                | N/A                                                        | [![Version](https://img.shields.io/npm/v/@jupyterlab/katex-extension.svg)](https://www.npmjs.com/package/@jupyterlab/katex-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/katex-extension.svg)](https://www.npmjs.com/package/@jupyterlab/katex-extension)             |
| [mathjax3-extension](packages/mathjax3-extension) | N/A                                                                | N/A                                                        | [![Version](https://img.shields.io/npm/v/@jupyterlab/mathjax3-extension.svg)](https://www.npmjs.com/package/@jupyterlab/mathjax3-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/mathjax3-extension.svg)](https://www.npmjs.com/package/@jupyterlab/mathjax3-extension) |
| [plotly-extension](packages/plotly-extension)     | `application/vnd.plotly.v1+json`                                   | `.plotly`, `.plotly.json`                                  | [![Version](https://img.shields.io/npm/v/@jupyterlab/plotly-extension.svg)](https://www.npmjs.com/package/@jupyterlab/plotly-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/plotly-extension.svg)](https://www.npmjs.com/package/@jupyterlab/plotly-extension)         |
| [vega2-extension](packages/vega2-extension)       | `application/vnd.vega.v2+json`, `application/vnd.vegalite.v1+json` | `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` | [![Version](https://img.shields.io/npm/v/@jupyterlab/vega2-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega2-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/vega2-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega2-extension)             |
| [vega3-extension](packages/vega3-extension)       | `application/vnd.vega.v3+json`, `application/vnd.vegalite.v2+json` | `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` | [![Version](https://img.shields.io/npm/v/@jupyterlab/vega3-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega3-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/vega3-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega3-extension)             |
| [vega4-extension](packages/vega4-extension)       | `application/vnd.vega.v4+json`, `application/vnd.vegalite.v2+json` | `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` | [![Version](https://img.shields.io/npm/v/@jupyterlab/vega4-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega4-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/vega4-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega4-extension)             |

## Install

* fasta-extension: `jupyter labextension install @jupyterlab/fasta-extension`
* geojson-extension: `jupyter labextension install @jupyterlab/geojson-extension`
* katex-extension: `jupyter labextension install @jupyterlab/katex-extension`
* mathjax3-extension: `jupyter labextension install @jupyterlab/mathjax3-extension`
* plotly-extension: `jupyter labextension install @jupyterlab/plotly-extension`
* vega2-extension: `jupyter labextension install @jupyterlab/vega2-extension`
* vega3-extension: `jupyter labextension install @jupyterlab/vega3-extension`
* vega4-extension: `jupyter labextension install @jupyterlab/vega4-extension`

## Contributing

If you would like to contribute to the project, please read our [contributor documentation](https://github.com/jupyterlab/jupyterlab/blob/master/CONTRIBUTING.md).

JupyterLab follows the official [Jupyter Code of Conduct](https://github.com/jupyter/governance/blob/master/conduct/code_of_conduct.md).

## Requirements

* Node.js >= 4 (see [Installing Node.js and jlpm](https://github.com/jupyterlab/jupyterlab/blob/master/CONTRIBUTING.md#installing-nodejs-and-jlpm) in the JupyterLab docs)

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
git clone https://github.com/jupyterlab/jupyter-renderers.git
cd jupyter-renderers
jlpm
jlpm build
```

### Link extensions with JupyterLab

Link geojson-extension:

```bash
jupyter labextension link packages/geojson-extension
```

Link all extensions in `packages`:

```bash
jlpm run link
```

### Rebuilding extensions

After making changes to the source packages, the packages must be rebuilt:

```bash
# Rebuild the source
jlpm build

# Rebuild the JupyterLab staging directory
jupyter lab build
```

You may also watch the `jupyter-renderers` directory for changes and automatically rebuild:

```bash
# In one terminal tab, watch the jupyter-renderers directory
jlpm watch

# In another terminal tab, run jupyterlab with the watch flag
jupyter lab --watch
```

### Publishing packages

```bash
jlpm run publish
# If publishing a package for the first time
npm access public @jupyterlab/<extension name>
```

### Creating icons

To create a JupyterLab icon for a new MIME or file type, you can use the Sketch
file in this repo or [fork the file on
Figma](https://www.figma.com/file/c2TwOvxAAXCzDccrybQKapZK/icons?node-id=0%3A1)
and export your icon as an SVG. See the [Plotly icon](https://github.com/jupyterlab/jupyter-renderers/tree/master/packages/plotly-extension/style) for reference.
