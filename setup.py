"""
jupyterlab-renderers setup
"""
import json
from pathlib import Path

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    skip_if_exists
)
import setuptools

HERE = Path(__file__).parent.resolve()

# The name of the project
name = "jupyterlab-renderers"
package = name.replace('-', '_')

package_data_spec = {
    package: ["*"],
}

labextension_names = [
    "@jupyterlab/fasta-extension",
    "@jupyterlab/geojson-extension",
    "@jupyterlab/katex-extension",
    "@jupyterlab/mathjax3-extension",
    "@jupyterlab/vega2-extension",
    "@jupyterlab/vega3-extension",
]

lab_path = (HERE / name / "labextensions")

# Representative files that should exist after a successful build
jstargets = []
data_files_spec = []

for labext_name in labextension_names:
    ext_path = lab_path / labext_name
    data_files_spec += [
        ("share/jupyter/labextensions/%s" % labext_name, str(ext_path), "**"),
        ("share/jupyter/labextensions/%s" % labext_name, str(HERE), "install.json"),
    ]
    jstargets += [
        str(ext_path / "package.json"),
    ]

cmdclass = create_cmdclass("jsdeps",
    package_data_spec=package_data_spec,
    data_files_spec=data_files_spec
)

js_command = combine_commands(
    install_npm(HERE, build_cmd="build:prod", npm=["jlpm"]),
    ensure_targets(jstargets),
)

is_repo = (HERE / ".git").exists()
if is_repo:
    cmdclass["jsdeps"] = js_command
else:
    cmdclass["jsdeps"] = skip_if_exists(jstargets, js_command)

long_description = (HERE / "README.md").read_text()

setup_args = dict(
    name=name,
    # TODO: do not hardcode here
    version='3.0.0',
    url="https://github.com/jupyterlab/jupyter-renderers",
    author="Project Jupyter",
    author_email="jupyter@googlegroups.com",
    description="JupyterLab mimerender extensions for common file and MIME types.",
    license="BSD-3-Clause",
    long_description=long_description,
    long_description_content_type="text/markdown",
    cmdclass=cmdclass,
    packages=setuptools.find_packages(),
    install_requires=[
        "jupyterlab~=3.0",
    ],
    zip_safe=False,
    include_package_data=True,
    python_requires=">=3.6",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab", "JupyterLab3"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Framework :: Jupyter",
    ],
)


if __name__ == "__main__":
    setuptools.setup(**setup_args)
