# Release

## Releasing on npm

To publish the extensions to `npm`, run the following commands:

```
git clean -dfx
yarn
yarn exec lerna version
yarn exec lerna publish from-package -m "Publish"
```

## Releasing on PyPI

With JupyterLab 3.0 it is now possible to distribute extensions a Python packages.

First, create a new environment:

```bash
conda create -q -y -n jupyter-renderers-release -c conda-forge twine nodejs jupyter-packaging yarn jupyterlab
conda activate jupyter-renderers-release
```

To publish all of the extensions on PyPI, run the following command:

```
git clean -dfx
yarn
yarn run build-py
twine upload dist/*
```

To publish only a single extension:

```bash
cd packages/<extension>

# cleanup previous assets
rm -r dist/

# built the assets
python setup.py sdist bdist_wheel

# upload to PyPI
twine upload dist/*
```
