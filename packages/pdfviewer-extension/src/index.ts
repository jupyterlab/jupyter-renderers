// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  ILayoutRestorer, JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  IInstanceTracker
} from '@jupyterlab/apputils';

import {
  IDocumentRegistry
} from '@jupyterlab/docregistry';

import {
  PDFViewer, PDFViewerFactory, IPDFTracker
} from '@jupyterlab/pdfviewer';

/**
 * The file extension for pdfs
 */
const PDF_EXTENSION = '.pdf';

/**
 * The name of the factory that creates image widgets.
 */
const FACTORY = 'PDF';

/**
 * The image file handler extension.
 */
const plugin: JupyterLabPlugin<IPDFTracker> = {
  activate,
  id: 'jupyter.extensions.pdf-handler',
  requires: [IDocumentRegistry, ILayoutRestorer],
  provides: IPDFTracker
  autoStart: true
};


/**
 * Export the plugin as default.
 */
export default plugin;


/**
 * Activate the image widget extension.
 */
function activate(app: JupyterLab, registry: IDocumentRegistry, restorer: ILayoutRestorer): IPDFTracker {
  const namespace = 'pdf-widget';
  const factory = new ImageViewerFactory({
    name: FACTORY,
    modelName: 'pdf',
    fileExtensions: [PDF_EXTENSION],
    defaultFor: [PDF_EXTENSION],
    readOnly: true
  });
  const tracker = new InstanceTracker<PDFViewer>({ namespace });

  // Handle state restoration.
  restorer.restore(tracker, {
    command: 'file-operations:open',
    args: widget => ({ path: widget.context.path, factory: FACTORY }),
    name: widget => widget.context.path
  });

  registry.addWidgetFactory(factory);

  factory.widgetCreated.connect((sender, widget) => {
    // Notify the instance tracker if restore data needs to update.
    widget.context.pathChanged.connect(() => { tracker.save(widget); });
    tracker.add(widget);
  });

  return tracker;
}
