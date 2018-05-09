declare module '@nteract/transform-vdom' {
  import * as React from 'react';

  interface IVDOMElement {
    tagName: 'string';
    attributes: Object;
    children:
      | IVDOMElement
      | IVDOMElement[]
      | Object
      | string
      | number
      | boolean
      | null;
    key?: number | string | null;
  }

  interface IVDOMProps extends React.Props<VDOM> {
    data: IVDOMElement;
  }

  export default class VDOM extends React.Component<IVDOMProps, {}> {}
}
