import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { JSONObject } from '@lumino/coreutils';
import { Message } from '@lumino/messaging';
import { Widget } from '@lumino/widgets';
import DataExplorer, { Props } from '@nteract/data-explorer';

/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'mimerenderer-tabular-data-resource';

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'application/vnd.dataresource+json';

/**
 * Find NotebookPanel widget instance up the widget hierarchy, it has `context` property
 * which could be used to save notebook
 * @link https://github.com/jupyterlab/jupyterlab/blob/7fb018558f9c812e3e2a3355fb6ab7c1a30486d8/packages/notebook/src/panel.ts#L177
 */
const findNotebookPanel = (widget: Widget): any => {
  let currentWidget: Widget | null = widget;
  while (currentWidget) {
    if (
      currentWidget.constructor &&
      currentWidget.constructor.name === 'NotebookPanel'
    ) {
      return currentWidget;
    }
    currentWidget = currentWidget.parent;
  }
  return null;
};

/**
 * A widget for rendering tabular-data-resource (TDR).
 */
export class DataExplorerWidget extends Widget
  implements IRenderMime.IRenderer {
  /**
   * Construct a new output widget.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
  }

  /**
   * Render tabular-data-resource into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    // If Data Explorer is rendered, no need to re-render it, it could take care of itself
    if (this._hasRendered) {
      return Promise.resolve();
    }
    this._hasRendered = true;

    const data = model.data[this._mimeType] as JSONObject;
    this.node.textContent = JSON.stringify(data);

    // Capture Data Explorer metadata change and save them to notebook file so we can restore it
    const onMetadataChange = (data: any) => {
      model.setData({
        metadata: {
          ...model.metadata,
          dataExplorer: data
        }
      });

      const notebookPanel = findNotebookPanel(this);
      if (notebookPanel) {
        notebookPanel.context
          .save()
          .then(
            () => console.log('Save success.'),
            (reason: Error) =>
              console.error('Save fails due to error: ', reason)
          );
      }
    };

    return new Promise<void>(resolve => {
      // Use an interval timer to render Data Explorer once the current node is rendered in the screen.
      // This is to avoid empty plot issue in Semiotic ResponsiveFrame
      // @link https://github.com/nteract/semiotic/blob/v1.20.3/src/components/ResponsiveFrame.tsx#L81-L91
      const timer = setInterval(() => {
        if (this.node.offsetWidth === 0 && this.node.offsetHeight === 0) {
          return;
        }

        clearInterval(timer);
        ReactDOM.render(
          <DataExplorer
            data={(data as unknown) as Props['data']}
            metadata={
              ((model.metadata.dataExplorer as unknown) as Props['metadata']) ||
              {}
            }
            mediaType={MIME_TYPE}
            initialView={'grid'}
            onMetadataChange={onMetadataChange}
          />,
          this.node,
          resolve
        );
      }, 1000 / 60);
    });
  }

  /**
   * Called before the widget is detached from the DOM.
   */
  protected onBeforeDetach(msg: Message): void {
    // Unmount the component so it can tear down.
    ReactDOM.unmountComponentAtNode(this.node);
  }

  private _mimeType: string;
  private _hasRendered = false;
}

/**
 * A mime renderer factory for tabular-data-resource data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new DataExplorerWidget(options)
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: 'nteract-data-explorer:plugin',
  rendererFactory,
  rank: 0,
  dataType: 'json',
  fileTypes: [
    {
      name: 'tabular-data-resource',
      mimeTypes: [MIME_TYPE],
      // Files with suffixes .tdr.json or .tdrjson will be open by nteract data explorer by default
      extensions: ['.tdr.json', '.tdrjson']
    }
  ],
  documentWidgetFactoryOptions: {
    name: 'nteract Data Explorer',
    primaryFileType: 'tabular-data-resource',
    fileTypes: ['tabular-data-resource'],
    defaultFor: ['tabular-data-resource']
  }
};

export default extension;
