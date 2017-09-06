# @jupyterlab/katex-extension

An extension for JupyterLab that provides [KaTeX](https://khan.github.io/KaTeX/) rendering for math.

The default LaTeX renderer in JupyterLab uses [MathJax](https://www.mathjax.org/),
which, while powerful, can be slow to render complex equations.
This extension substitutes the MathJax renderer with the KaTeX renderer.
KaTeX is much faster, at the cost of being less full-featured than MathJax.
If you want faster math processing and the subset of LaTeX provided by KaTeX is
sufficient for your purposes, this may be the extension for you!

If you equations are not rendering properly with this extension,
you probably will want to fall back to MathJax.

## Installation

From the `jupyterlab-katex` directory, run
```bash
jupyter labextension link
```
