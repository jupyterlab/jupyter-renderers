# jupyterlab-katex

An extension for JupyterLab that provides [KaTeX](https://khan.github.io/KaTeX/) rendering for math.

The default LaTeX renderer in JupyterLab uses [MathJax](https://www.mathjax.org/),
which, while powerful, can be slow to render complex equations.
This extension substitutes the MathJax renderer with the KaTeX renderer.
KaTeX is much faster, at the cost of being less full-featured than MathJax.
If you want faster math processing and the subset of LaTeX provided by KaTeX is
sufficient for your purposes, this may be the extension for you!

If you equations are not rendering properly with this extension,
you probably will want to fall back to MathJax.

## Prerequisites

* JupyterLab 0.28

## Installation

To install this extension into JupyterLab (requires node 5 or later), enter the following in your terminal:

```bash
jupyter labextension install jupyterlab-katex
```

## Development

From the `jupyterlab-katex` directory, run

```bash
npm install
npm run build
jupyter labextension link .
```

You can then watch the `src` directory for changes by running
```bash
npm run watch
```
Launch JupyterLab in watch mode (`jupyter lab --watch`), and
it wil automatically pick up changes to the built assets
of this extension and rebuild the application.
