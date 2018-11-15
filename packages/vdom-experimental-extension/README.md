# vdom-experimental-extension

[![Binder](https://beta.mybinder.org/badge.svg)](https://mybinder.org/v2/gh/gnestor/jupyter-renderers/vdom-experimental?urlpath=lab/tree/notebooks/vdom-experimental-extension.ipynb)

A JupyterLab extension for rendering VirtualDOM using React

![demo](../../../../raw/vdom-experimental/notebooks/vdom-experimental-extension.gif)

## Experimental branch

This branch adds experimental event handling support to
[@jupyterlab/vdom-extension](https://github.com/jupyterlab/jupyterlab/tree/master/packages/vdom-extension).

## Requirements

* JupyterLab ^0.27.0

This branch requires an experimental branch of the
[vdom library](https://github.com/nteract/vdom) to be installed:

```
git clone https://github.com/gnestor/vdom
cd vdom
git checkout vdom-events
pip install -e .
```

## Usage

See [vdom-events.ipynb](../../notebooks/vdom-experimental-extension.ipynb) for
experimental event handling usage.

To render VDOM output in IPython:

```python
from IPython.display import display

def VDOM(data={}):
    bundle = {}
    bundle['application/vdom.v1+json'] = data
    display(bundle, raw=True)

VDOM({
    'tagName': 'div',
    'attributes': {},
    'children': [{
        'tagName': 'h1',
        'attributes': {},
        'children': 'Our Incredibly Declarative Example',
        'key': 0
    }, {
        'tagName': 'p',
        'attributes': {},
        'children': ['Can you believe we wrote this ', {
            'tagName': 'b',
            'attributes': {},
            'children': 'in Python',
            'key': 1
        }, '?'],
        'key': 1
    }, {
        'tagName': 'img',
        'attributes': {
            'src': 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif'
        },
        'key': 2
    }, {
        'tagName': 'p',
        'attributes': {},
        'children': ['What will ', {
            'tagName': 'b',
            'attributes': {},
            'children': 'you',
            'key': 1
        }, ' create next?'],
        'key': 3
    }]
})
```

Using the [vdom Python library](https://github.com/nteract/vdom):

```python
from vdom.helpers import h1, p, img, div, b

div(
    h1('Our Incredibly Declarative Example'),
    p('Can you believe we wrote this ', b('in Python'), '?'),
    img(src="https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif"),
    p('What will ', b('you'), ' create next?'),
)
```

To render a `.vdom` or `.vdom.json` file, simply open it:

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
git clone https://github.com/gnestor/jupyter-renderers.git
cd jupyter-renderers
# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension link packages/vdom-experimental-extension
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
jupyter labextension uninstall @jupyterlab/plotly-extension
```
