// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  IInstanceTracker
} from '@jupyterlab/apputils';

import {
  Token
} from '@phosphor/coreutils';

import {
  PDFViewer
} from './widget';

import '../style/index.css';

export * from './widget';


/**
 * A class that tracks PDF widgets.
 */
export
interface IPDFTracker extends IInstanceTracker<PDFViewer> {}


/* tslint:disable */
/**
 * The PDF tracker token.
 */
export
const IPDFTracker = new Token<IPDFTracker>('jupyter.extensios.pdf-tracker');
/* tslint:enable */
