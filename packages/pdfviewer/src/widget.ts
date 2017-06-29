// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  ABCWidgetFactory, DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';


/**
 * The class name added to a pdf-viewer.
 */
const PDF_CLASS = 'jp-PDFViewer';


/**
 * A widget for PDFs.
 */
export
class PDFViewer extends Widget {
  /**
   * Construct a new PDF widget.
   */
  constructor(context: DocumentRegistry.Context) {
    super({ node: Private.createNode() });
    this._context = context;
    this.node.tabIndex = -1;
    this.addClass(PDF_CLASS);

    this._onTitleChanged();
    context.pathChanged.connect(this._onTitleChanged, this);

    context.ready.then(() => {
      this._render();
      context.model.contentChanged.connect(this.update, this);
      context.fileChanged.connect(this.update, this);
    });
  }

  /**
   * The pdf widget's context.
   */
  get context(): DocumentRegistry.Context {
    return this._context;
  }

  /**
   * Dispose of the resources used by the widget.
   */
  dispose(): void {
    this._context = null;
    super.dispose();
  }

  /**
   * Handle `update-request` messages for the widget.
   */
  protected onUpdateRequest(msg: Message): void {
    let context = this._context;
    if (this.isDisposed || !context.isReady) {
      return;
    }
    this._render();
  }

  /**
   * Handle `'activate-request'` messages.
   */
  protected onActivateRequest(msg: Message): void {
    this.node.focus();
  }

  /**
   * Handle a change to the title.
   */
  private _onTitleChanged(): void {
    this.title.label = this._context.path.split('/').pop();
  }

  /**
   * Render the widget content.
   */
  private _render(): void {
    let cm = this._context.contentsModel;
    let content = this._context.model.toString();
    let src = `data:application/pdf;${cm.format},${content}`;
    this.node.querySelector('element').setAttribute('src', src);
  }

  private _context: DocumentRegistry.Context;
}


/**
 * A widget factory for PDF-viewers.
 */
export
class PDFViewerFactory extends ABCWidgetFactory<PDFViewer, DocumentRegistry.IModel> {
  /**
   * Create a new widget given a context.
   */
  protected createNewWidget(context: DocumentRegistry.IContext<DocumentRegistry.IModel>): PDFViewer {
    return new PDFViewer(context);
  }
}

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
    node.appendChild(pdf);
    return node;
  }
}
