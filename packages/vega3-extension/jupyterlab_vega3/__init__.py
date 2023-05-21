from ._version import __version__


def _jupyter_labextension_paths():
    return [{
        "src": "labextension",
        "dest": "@jupyterlab/vega3-extension"
    }]
