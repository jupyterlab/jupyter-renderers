# katex-extension

A JupyterLab extension for rendering [KaTeX](https://khan.github.io/KaTeX/) math.

The default LaTeX renderer in JupyterLab uses [MathJax](https://www.mathjax.org/),
which, while powerful, can be slow to render complex equations.
This extension substitutes the MathJax renderer with the KaTeX renderer.
KaTeX is much faster, at the cost of being less full-featured than MathJax.
If you want faster math processing and the subset of LaTeX provided by KaTeX is
sufficient for your purposes, this may be the extension for you!

If you equations are not rendering properly with this extension,
you probably will want to fall back to MathJax.

## Requirements

* JupyterLab ^0.28.0
* Node.js >= 5

## Install

```bash
jupyter labextension install @jupyterlab/katex-extension
```

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
jupyter labextension link packages/katex-extension
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
jupyter labextension uninstall @jupyterlab/katex-extension
```
