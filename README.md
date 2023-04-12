# Jupyter Renderers

![Github Actions Status](https://github.com/jupyterlab/jupyter-renderers/workflows/CI/badge.svg)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jupyterlab/jupyter-renderers/master?urlpath=lab/tree/notebooks)

This is a
[monorepo](https://github.com/lerna/lerna#what-does-a-lerna-repo-look-like) that
consists of [JupyterLab](https://github.com/jupyterlab/jupyterlab) _mimerender extensions_ for common file and MIME types.

## Packages

| Name                                              | Mime types                                                         | File extensions                                            | Info                                                                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [fasta-extension](packages/fasta-extension)       | `application/vnd.fasta.fasta`                                      | `.fasta`                                                   | [![Version](https://img.shields.io/pypi/v/jupyterlab-fasta?style=flat-square)](https://pypi.org/project/jupyterlab-fasta/)      |
| [geojson-extension](packages/geojson-extension)   | `application/geo+json`                                             | `.geojson`, `.geo.json`                                    | [![Version](https://img.shields.io/pypi/v/jupyterlab-geojson?style=flat-square)](https://pypi.org/project/jupyterlab-geojson)   |
| [katex-extension](packages/katex-extension)       | N/A                                                                | N/A                                                        | [![Version](https://img.shields.io/pypi/v/jupyterlab-katex?style=flat-square)](https://pypi.org/project/jupyterlab-katex)       |
| [mathjax2-extension](packages/mathjax2-extension) | N/A                                                                | N/A                                                        | [![Version](https://img.shields.io/pypi/v/jupyterlab-mathjax2?style=flat-square)](https://pypi.org/project/jupyterlab-mathjax2) |
| [vega3-extension](packages/vega3-extension)       | `application/vnd.vega.v3+json`, `application/vnd.vegalite.v2+json` | `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` | [![Version](https://img.shields.io/pypi/v/jupyterlab-vega3?style=flat-square)](https://pypi.org/project/jupyterlab-vega3)       |

## Looking for plotly-extension?

[@jupyterlab/plotly-extension](https://www.npmjs.com/package/@jupyterlab/plotly-extension) is being deprecated. Please use the Plotly-supported [jupyterlab-plotly](https://www.npmjs.com/package/jupyterlab-plotly). See the [plotly.py README](https://github.com/plotly/plotly.py#jupyterlab-support-python-35) for more info.

## Install

With JupyterLab 3.0 and above, it is possible to install the prebuilt extensions with `pip`:

```bash
pip install jupyterlab-fasta
pip install jupyterlab-geojson
pip install jupyterlab-katex
pip install jupyterlab-mathjax2
pip install jupyterlab-vega3
```

## Contributing

If you would like to contribute to the project, please read our [contributor documentation](https://github.com/jupyterlab/jupyterlab/blob/master/CONTRIBUTING.md).

JupyterLab follows the official [Jupyter Code of Conduct](https://github.com/jupyter/governance/blob/master/conduct/code_of_conduct.md).

## Requirements

- Node.js >= 18 (see [Installing Node.js and jlpm](https://github.com/jupyterlab/jupyterlab/blob/master/CONTRIBUTING.md#installing-nodejs-and-jlpm) in the JupyterLab docs)

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

You may also watch a particular extension directory for changes and automatically rebuild:

```bash
# In one terminal tab, watch the jupyter-fasta directory
cd packages/fasta-extension
jlpm run watch

# Run JupyterLab in another terminal
jupyter lab
```

### Publishing packages

Build all Python packages:

```
rm -rf dist/*
jlpm build-py
twine upload dist/jupyterlab*
```

### Creating icons

To create a JupyterLab icon for a new MIME or file type, you can use the Sketch
file in this repo or [fork the file on
Figma](https://www.figma.com/file/c2TwOvxAAXCzDccrybQKapZK/icons?node-id=0%3A1)
and export your icon as an SVG. See the [GeoJSON icon](https://github.com/jupyterlab/jupyter-renderers/tree/master/packages/geojson-extension/style) for reference.
