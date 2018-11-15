// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Kernel, Session } from '@jupyterlab/services';

import { Widget } from '@phosphor/widgets';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import * as React from 'react';

import * as ReactDOM from 'react-dom';

import VDOM, { IVDOMElement } from '@nteract/transform-vdom';

import serializeEvent from './event-to-object';

import '../style/index.css';

/**
 * The CSS class to add to the VDOM Widget.
 */
const CSS_CLASS = 'jp-RenderedVDOM';

/**
 * The CSS class for a VDOM icon.
 */
const CSS_ICON_CLASS = 'jp-MaterialIcon jp-VDOMIcon';

/**
 * The MIME type for VDOM.
 */
export const MIME_TYPE = 'application/vdom.v1+json';

type IAttributes = { [key: string]: any };

/**
 * A renderer for declarative virtual DOM content.
 */
export class RenderedVDOM extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering DOM.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this.addClass(CSS_CLASS);
    this._mimeType = options.mimeType;
    this._session = Session.listRunning().then(sessionModels => {
      const session = sessionModels.find(
        session => session.path === (options.resolver as any)._session.path
      );
      return Session.connectTo(session);
    });
    // this._session = Session.connectTo(options.resolver._session as Session.ISession)
  }

  /**
   * Dispose of the widget.
   */
  dispose(): void {
    // Dispose of leaflet map
    ReactDOM.unmountComponentAtNode(this.node);
    for (let targetName in this._comms) {
      this._comms[targetName].then(comm => {
        comm.close();
      });
    }
    this._session.then(session => {
      session.dispose();
    });
    super.dispose();
  }

  /**
   * Render VDOM into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    return this._session.then(() => {
      const data = model.data[this._mimeType] as any;
      // const metadata = model.metadata[this._mimeType] as any || {};
      const props = { data: this.getProps(data) };
      ReactDOM.render(<VDOM {...props} />, this.node);
    });
  }

  /**
   * Get props for VDOM component from data.
   * Transform JSON representations of callback functions into callback
   * functions in JS that will send a JSON representation of the DOM event
   * over a comm channel and handle the event on the kernel
   *
   * label_value = 1
   * my_label = label(str(label_value))
   *
   * def handleChange():
   *    label_value += 1
   *    my_label.children = str(label_value)
   *    update_display(my_label, display_id=my_label._display_id)
   *
   * button = create_component('button')
   * my_button = button(name='my_button', onClick=lambda value: handleChange())
   * display(my_button, display_id=my_button._display_id);
   */
  getProps(data: IVDOMElement): IVDOMElement {
    // Handle JSON representations of callback functions in attributes
    const decodeAttributes = (attributes: IAttributes): IAttributes => {
      return Object.keys(attributes).reduce(
        (result: IAttributes, key: string) => {
          const value = attributes[key];
          // If an attribute has `target_name` key
          if (value['target_name']) {
            // Connect to the comm channel
            this._comms[value['target_name']] = this._session.then(session =>
              session.kernel.connectToComm(value['target_name'])
            );
            this._comms[value['target_name']].then(comm => {
              comm.open({});
              comm.onMsg = (msg: any) => {
                console.log('comm.onMsg', msg.content.data);
              };
              comm.onClose = (msg: any) => {
                console.log('comm.onClose', msg.content.data);
              };
            });
            // Replace prop value with a callback function that will send a JSON
            // representation of the DOM event to the kernel over the comm channel
            return {
              ...result,
              [key]: (event: React.SyntheticEvent<any>) => {
                const serializedEvent = serializeEvent(event);
                this._comms[value['target_name']].then(comm => {
                  // console.log('comm.send', event, serializedEvent);
                  comm.send(serializedEvent);
                });
              }
            };
          }
          return { ...result, [key]: value };
        },
        {}
      );
    };
    if (data) {
      if (data.attributes) {
        data.attributes = decodeAttributes(data.attributes);
      }
      if (data.children) {
        if (Array.isArray(data.children)) {
          data.children = data.children.map(child => this.getProps(child));
        }
        if (typeof data.children === 'object') {
          data.children = this.getProps(data.children as IVDOMElement);
        }
      }
    }
    return data;
  }

  private _mimeType: string;
  private _session: Promise<Session.ISession>;
  private _comms: { [key: string]: Promise<Kernel.IComm> } = {};
}

/**
 * A mime renderer factory for VDOM data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new RenderedVDOM(options)
};

const extensions: IRenderMime.IExtension | IRenderMime.IExtension[] = [
  {
    id: '@jupyterlab/vdom-experimental-extension:factory',
    rendererFactory,
    rank: 0,
    dataType: 'json',
    fileTypes: [
      {
        name: 'vdom',
        mimeTypes: [MIME_TYPE],
        extensions: ['.vdom', '.vdom.json'],
        iconClass: CSS_ICON_CLASS
      }
    ],
    documentWidgetFactoryOptions: {
      name: 'VDOM',
      primaryFileType: 'vdom',
      fileTypes: ['vdom', 'json'],
      defaultFor: ['vdom']
    }
  }
];

export default extensions;
