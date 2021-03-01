# fasta-extension

A JupyterLab extension for rendering
[Fasta](https://en.wikipedia.org/wiki/FASTA_format) data. This extension uses the
[MSA Fasta viewer](http://msa.biojs.net/).

![demo](http://g.recordit.co/temizjae9X.gif)

## Requirements

- JupyterLab ^0.30.0
- Node.js >= 5

## Install

```bash
jupyter labextension install @jupyterlab/fasta-extension
```

## Usage

To render fasta output in IPython:

```python
from IPython.display import display

def Fasta(data=''):
    bundle = {}
    bundle['application/vnd.fasta.fasta'] = data
    bundle['text/plain'] = data
    display(bundle, raw=True)

Fasta(""">SEQUENCE_1
MTEITAAMVKELRESTGAGMMDCKNALSETNGDFDKAVQLLREKGLGKAAKKADRLAAEG
LVSVKVSDDFTIAAMRPSYLSYEDLDMTFVENEYKALVAELEKENEERRRLKDPNKPEHK
IPQFASRKQLSDAILKEAEEKIKEELKAQGKPEKIWDNIIPGKMNSFIADNSQLDSKLTL
MGQFYVMDDKKTVEQVIAEKEKEFGGKIKIVEFICFEVGEGLEKKTEDFAAEVAAQL
>SEQUENCE_2
SATVSEINSETDFVAKNDQFIALTKDTTAHIQSNSLQSVEELHSSTINGVKFEEYLKSQI
ATIGENLVVRRFATLKAGANGVVNGYIHTNGRVGVVIAAACDSAEVASKSRDLLRQICMH""")
```

To render a `.fasta` file, simply open it.
