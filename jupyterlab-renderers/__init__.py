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
    ]
