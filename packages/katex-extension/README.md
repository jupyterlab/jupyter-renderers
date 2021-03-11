# jupyterlab-katex

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

- JupyterLab >= 3.0

## Install

```bash
pip install jupyterlab-katex
```

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyterlab-katex directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Uninstall

```bash
pip uninstall jupyterlab-katex
```
