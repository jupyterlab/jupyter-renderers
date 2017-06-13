/**
  Copyright (c) Jupyter Development Team.
  Distributed under the terms of the Modified BSD License.
*/

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import {
  Component
} from './component';

import {
  Message,
} from '@phosphor/messaging';

import {
  PanelLayout
} from '@phosphor/widgets';

import {
  Widget
} from '@phosphor/widgets';

import {
  ActivityMonitor
} from '@jupyterlab/coreutils';

import {
  JSONObject
} from '@phosphor/coreutils';

import {
  DocumentRegistry, 
  ABCWidgetFactory
} from '@jupyterlab/docregistry';

import {
  MimeModel, 
  RenderMime
} from '@jupyterlab/rendermime';


/**
 * The class name added to a Jupyter JSONViewer.
 */
const JSON_CLASS = 'jp-JSONViewer';


/**
 * The class name added to a Jupyter JSONViewer.
 */
const RENDERED_JSON_CLASS = 'jp-RenderedJSON';


/**
 * The timeout to wait for change activity to have ceased before rendering.
 */
const RENDER_TIMEOUT = 1000;


/**
 * The mime type of JSON.
 */
export const MIME_TYPE = 'application/json';


/**
 * A widget for displaying JSON.
 */
export
class RenderedJSON extends Widget {
  /**
   * Construct a new JSON widget.
   */
  constructor(options: RenderMime.IRenderOptions) {
    super(options);
    this.addClass(RENDERED_JSON_CLASS);
    const data = options.model.data.get(options.mimeType) as JSONObject;
    const metadata = options.model.metadata.get(options.mimeType) as JSONObject || {};
    const props = { data, metadata, theme: 'cm-s-jupyter' };
    ReactDOM.render(<Component {...props} />, this.node);
  }
  
  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    ReactDOM.unmountComponentAtNode(this.node);
    super.dispose();
  }
}

/**
 * A mime renderer for JSON.
 */
export
class JSONRenderer implements RenderMime.IRenderer {
  /**
   * The mimeTypes this renderer accepts.
   */
  mimeTypes = [MIME_TYPE];

  /**
   * Whether the renderer can render given the render options.
   */
  canRender(options: RenderMime.IRenderOptions): boolean {
    return this.mimeTypes.indexOf(options.mimeType) !== -1;
  }

  /**
   * Render the transformed mime bundle.
   */
  render(options: RenderMime.IRenderOptions): Widget {
    return new RenderedJSON(options);
  }

  /**
   * Whether the renderer will sanitize the data given the render options.
   */
  wouldSanitize(options: RenderMime.IRenderOptions): boolean {
    return !options.model.trusted;
  }
}


/**
 * A widget for rendered JSON.
 */
export
class JSONViewer extends Widget {
  /**
   * Construct a new JSON widget.
   */
  constructor(context: DocumentRegistry.Context, rendermime: RenderMime) {
    super();
    this.addClass(JSON_CLASS);
    this.layout = new PanelLayout();
    this.title.label = context.path.split('/').pop();
    this._rendermime = rendermime;
    rendermime.resolver = context;
    this._context = context;

    context.pathChanged.connect(this._onPathChanged, this);

    // Throttle the rendering rate of the widget.
    this._monitor = new ActivityMonitor({
      signal: context.model.contentChanged,
      timeout: RENDER_TIMEOUT
    });
    this._monitor.activityStopped.connect(this.update, this);    
  }

  /**
   * The JSON widget's context.
   */
  get context(): DocumentRegistry.Context {
    return this._context;
  }

  /**
   * Dispose of the resources held by the widget.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._monitor.dispose();
    super.dispose();
  }

  /**
   * Handle `'activate-request'` messages.
   */
  protected onActivateRequest(msg: Message): void {
    this.node.tabIndex = -1;
    this.node.focus();
  }

  /**
   * Handle an `after-attach` message to the widget.
   */
  protected onAfterAttach(msg: Message): void {
    this.update();
  }
  
  /**
   * Handle an `update-request` message to the widget.
   */
  protected onUpdateRequest(msg: Message): void {
    const context = this._context;
    const model = context.model;
    let data = {};
    try {
      data = {
        [MIME_TYPE]: JSON.parse(model.toString())
      };
    } catch (error) {
      data = {
        'application/vnd.jupyter.stderr': error.message
      };
    }
    const mimeModel = new MimeModel({ data, trusted: false });
    const widget = this._rendermime.render(mimeModel);
    const layout = this.layout as PanelLayout;
    if (layout.widgets.length) {
      layout.widgets[0].dispose();
    }
    layout.addWidget(widget);
  }

  /**
   * Handle a path change.
   */
  private _onPathChanged(): void {
    this.title.label = this._context.path.split('/').pop();
  }

  private _context: DocumentRegistry.Context = null;
  private _monitor: ActivityMonitor<any, any> = null;
  private _rendermime: RenderMime = null;
}


/**
 * A widget factory for JSON.
 */
export
class JSONViewerFactory extends ABCWidgetFactory<JSONViewer, DocumentRegistry.IModel> {
  /**
   * Construct a new JSON widget factory.
   */
  constructor(options: JSONViewerFactory.IOptions) {
    super(options);
    this._rendermime = options.rendermime;
  }

  /**
   * Create a new widget given a context.
   */
  protected createNewWidget(context: DocumentRegistry.Context): JSONViewer {
    return new JSONViewer(context, this._rendermime.clone());
  }

  private _rendermime: RenderMime = null;
}


/**
 * A namespace for `JSONViewerFactory` statics.
 */
export
namespace JSONViewerFactory {
  /**
   * The options used to create a JSON widget factory.
   */
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    /**
     * A rendermime instance.
     */
    rendermime: RenderMime;
  }
}
