# Jupyter Renderers

![Github Actions Status](https://github.com/jupyterlab/jupyter-renderers/workflows/CI/badge.svg)
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
| [vega2-extension](packages/vega2-extension)       | `application/vnd.vega.v2+json`, `application/vnd.vegalite.v1+json` | `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` | [![Version](https://img.shields.io/npm/v/@jupyterlab/vega2-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega2-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/vega2-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega2-extension)             |
| [vega3-extension](packages/vega3-extension)       | `application/vnd.vega.v3+json`, `application/vnd.vegalite.v2+json` | `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` | [![Version](https://img.shields.io/npm/v/@jupyterlab/vega3-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega3-extension) [![Downloads](https://img.shields.io/npm/dm/@jupyterlab/vega3-extension.svg)](https://www.npmjs.com/package/@jupyterlab/vega3-extension)             |

## Looking for plotly-extension?

[@jupyterlab/plotly-extension](https://www.npmjs.com/package/@jupyterlab/plotly-extension) is being deprecated. Please use the Plotly-supported [jupyterlab-plotly](https://www.npmjs.com/package/jupyterlab-plotly). See the [plotly.py README](https://github.com/plotly/plotly.py#jupyterlab-support-python-35) for more info.

## Install

With JupyterLab 3.0, it is possible to install all the extensions at once with `pip` or `conda`:

```bash
pip install jupyterlab-renderers
```

It is possible to install the extension individually:

- fasta-extension: `jupyter labextension install @jupyterlab/fasta-extension`
- geojson-extension: `jupyter labextension install @jupyterlab/geojson-extension`
- katex-extension: `jupyter labextension install @jupyterlab/katex-extension`
- mathjax3-extension: `jupyter labextension install @jupyterlab/mathjax3-extension`
- vega2-extension: `jupyter labextension install @jupyterlab/vega2-extension`
- vega3-extension: `jupyter labextension install @jupyterlab/vega3-extension`

JupyterLab 2.x only supports installing the extensions with the `jupyter labextension install` command.

## Contributing

If you would like to contribute to the project, please read our [contributor documentation](https://github.com/jupyterlab/jupyterlab/blob/master/CONTRIBUTING.md).

JupyterLab follows the official [Jupyter Code of Conduct](https://github.com/jupyter/governance/blob/master/conduct/code_of_conduct.md).

## Requirements

- Node.js >= 4 (see [Installing Node.js and jlpm](https://github.com/jupyterlab/jupyterlab/blob/master/CONTRIBUTING.md#installing-nodejs-and-jlpm) in the JupyterLab docs)

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
git clone https://github.com/jupyterlab/jupyter-renderers.git
cd jupyter-renderers

# install the fasta extension
cd packages/fasta-extension

# Install package in development mode
pip install -e .

# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite

# Rebuild the extensions TypeScript source after making changes
jlpm run build
```

### Rebuilding extensions

After making changes to the source packages, the packages must be rebuilt:

```bash
# Rebuild all the extensions at once
jlpm run build

# To rebuilt a particular extension, for example the fasta extension
cd packages/fasta-extension
jlpm run build
```

You may also watch the `jupyter-renderers` directory for changes and automatically rebuild:

```bash
# In one terminal tab, watch the jupyter-renderers directory
jlpm run watch

# Run JupyterLab in another terminal
jupyter lab
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
and export your icon as an SVG. See the [GeoJSON icon](https://github.com/jupyterlab/jupyter-renderers/tree/master/packages/geojson-extension/style) for reference.
