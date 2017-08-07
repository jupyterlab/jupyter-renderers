// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  Widget
} from '@phosphor/widgets';

import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import '../style/index.css';


/**
 * The MIME type for PDF.
 */
export
const MIME_TYPE = 'application/pdf';

/**
 * The class name added to a pdf-viewer.
 */
const PDF_CLASS = 'jp-PDFViewer';


export
class RenderedPDF extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering PDF/PDF-Lite.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super({ node: Private.createNode() });
    this.addClass(PDF_CLASS);
  }

  /**
   * Render PDF into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    let data = model.data[MIME_TYPE] as string;
    let src = `data:${MIME_TYPE};base64,${data}`;
    this.node.querySelector('embed').setAttribute('src', src);
    this.node.querySelector('embed').setAttribute('type', MIME_TYPE);
    return Promise.resolve(void 0);
  }
}


/**
 * A mime renderer factory for PDF data.
 */
export
const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new RenderedPDF(options)
};


const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    name: 'PDF',
    modelName: 'PDF',
    rendererFactory,
    rank: 0,
    dataType: 'string',
    fileTypes: [{
      name: 'PDF',
      fileFormat: 'base64',
      mimeTypes: [MIME_TYPE],
      extensions: ['.pdf']
    }],
    documentWidgetFactoryOptions: {
      name: 'PDF',
      primaryFileType: 'PDF',
      fileTypes: ['PDF'],
      defaultFor: ['PDF']
    }
  }
];

export default extensions;


/**
 * A namespace for PDF widget private data.
 */
namespace Private {
  /**
   * Create the node for the PDF widget.
   */
  export
  function createNode(): HTMLElement {
    let node = document.createElement('div');
    let pdf = document.createElement('embed');
    pdf.className = PDF_CLASS;
    node.appendChild(pdf);
    return node;
  }
}
