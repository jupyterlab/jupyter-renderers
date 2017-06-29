// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  ILayoutRestorer, JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  InstanceTracker
} from '@jupyterlab/apputils';

import {
  IDocumentRegistry
} from '@jupyterlab/docregistry';

import {
  PDFViewer, PDFViewerFactory, IPDFTracker
} from '@jupyterlab/pdfviewer';

/**
 * The list of file extensions for PDFs.
 */
const EXTENSIONS = ['.pdf'];

/**
 * The name of the factory that creates PDF widgets.
 */
const FACTORY = 'PDF';

/**
 * The PDF file handler extension.
 */
const plugin: JupyterLabPlugin<IPDFTracker> = {
  activate,
  id: 'jupyter.extensions.PDF-handler',
  provides: IPDFTracker,
  requires: [IDocumentRegistry, ILayoutRestorer],
  autoStart: true
};


/**
 * Export the plugin as default.
 */
export default plugin;


/**
 * Activate the PDF widget extension.
 */
function activate(app: JupyterLab, registry: IDocumentRegistry, restorer: ILayoutRestorer): IPDFTracker {
  const namespace = 'PDF-widget';
  const factory = new PDFViewerFactory({
    name: FACTORY,
    modelName: 'base64',
    fileExtensions: EXTENSIONS,
    defaultFor: EXTENSIONS,
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
