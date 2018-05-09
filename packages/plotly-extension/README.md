# plotly-extension

A JupyterLab extension for rendering Plotly charts

![demo](http://g.recordit.co/Hq3qZhqkFG.gif)

## Requirements

* JupyterLab ^0.30.0
* Node.js >= 5
* plotly.py >= 2.0.0 (optional)

## Install

```bash
jupyter labextension install @jupyterlab/plotly-extension
```

## Usage

To render Plotly JSON in IPython:

```python
from IPython.display import display

def Plotly(data=[], layout={}):
    bundle = {}
    bundle['application/vnd.plotly.v1+json'] = {
        'data': data,
        'layout': layout,
    }
    display(bundle, raw=True)

data = [
    {'x': [1999, 2000, 2001, 2002], 'y': [10, 15, 13, 17], 'type': 'scatter'},
    {'x': [1999, 2000, 2001, 2002], 'y': [16, 5, 11, 9], 'type': 'scatter'}
]

layout = {
    'title': 'Sales Growth',
    'xaxis': {'title': 'Year', 'showgrid': False, 'zeroline': False},
    'yaxis': {'title': 'Percent', 'showline': False}
}

Plotly(data, layout)
```

To render using the [plotly Python library](https://github.com/plotly/plotly.py):

```python
import plotly
from plotly.offline import iplot

trace = plotly.graph_objs.Heatmap(z=[[1, 20, 30],
                      [20, 1, 60],
                      [30, 60, 1]])

fig = dict(data=[trace])

iplot(fig)
```

To render a `.plotly` or `.plotly.json` file, simply open it.

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
jupyter labextension link packages/plotly-extension
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
