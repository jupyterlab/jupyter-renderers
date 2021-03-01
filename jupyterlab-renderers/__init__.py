from ._version import __version__


def _jupyter_labextension_paths():
    return [
        {
            "src": "labextension/@jupyterlab/fasta-extension",
            "dest": "@jupyterlab/fasta-extension",
        },
        {
            "src": "labextension/@jupyterlab/geojson-extension",
            "dest": "@jupyterlab/geojson-extension",
        },
        {
            "src": "labextension/@jupyterlab/katex-extension",
            "dest": "@jupyterlab/katex-extension",
        },
        {
            "src": "labextension/@jupyterlab/mathjax3-extension",
            "dest": "@jupyterlab/mathjax3-extension",
        },
        {
            "src": "labextension/@jupyterlab/vega2-extension",
            "dest": "@jupyterlab/vega2-extension",
        },
        {
            "src": "labextension/@jupyterlab/vega3-extension",
            "dest": "@jupyterlab/vega3-extension",
        },
    ]
