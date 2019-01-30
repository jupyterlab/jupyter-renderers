# Jupyter Renderers

[![Binder](https://beta.mybinder.org/badge.svg)](https://mybinder.org/v2/gh/jupyterlab/jupyter-renderers/master?urlpath=lab/tree/notebooks)

This is a [monorepo](https://github.com/lerna/lerna#what-does-a-lerna-repo-look-like) that consists of generic renderers for common file types and mime types as well as renderer extensions for [JupyterLab](https://github.com/jupyterlab/jupyterlab).

## Packages

| Name                                              | Mime types                                                         | File extensions                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| [fasta-extension](packages/fasta-extension)       | `application/vnd.fasta.fasta`                                      | `.fasta`                                                   |
| [geojson-extension](packages/geojson-extension)   | `application/geo+json`                                             | `.geojson`, `.geo.json`                                    |
| [katex-extension](packages/katex-extension)       | N/A                                                                | N/A                                                        |
| [mathjax3-extension](packages/mathjax3-extension) | N/A                                                                | N/A                                                        |
| [plotly-extension](packages/plotly-extension)     | `application/vnd.plotly.v1+json`                                   | `.plotly`, `.plotly.json`                                  |
| [vega2-extension](packages/vega2-extension)       | `application/vnd.vega.v2+json`, `application/vnd.vegalite.v1+json` | `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` |
| [vega3-extension](packages/vega3-extension)       | `application/vnd.vega.v3+json`, `application/vnd.vegalite.v2+json` | `.vg`, `.vl`, `.vg.json`, `.vl.json`, `.vega`, `.vegalite` |

## Install

* fasta-extension: `jupyter labextension install @jupyterlab/fasta-extension`
* geojson-extension: `jupyter labextension install @jupyterlab/geojson-extension`
* katex-extension: `jupyter labextension install @jupyterlab/katex-extension`
* mathjax3-extension: `jupyter labextension install @jupyterlab/mathjax3-extension`
* plotly-extension: `jupyter labextension install @jupyterlab/plotly-extension`
* vega2-extension: `jupyter labextension install @jupyterlab/vega2-extension`
* vega3-extension: `jupyter labextension install @jupyterlab/vega3-extension`

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
