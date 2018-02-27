// Type definitions for vega-loader 2.0.4
// Project: https://github.com/vega/vega-loader
// Definitions by: Grant Nestor <https://github.com/gnestor>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.6.2

import * as Vega from 'vega'
import {
  Mode,
  Loader
} from 'vega-embed';


declare module 'vega' {

  interface ILoaderOptions {
    baseURL?: string;
    mode?: Mode;
    defaultProtocol?: 'http'|'https';
    headers?: Object;
  }

  type dataType = 'boolean'|'integer'|'number'|'date'|'string';

  interface ISchema {
    type?: 'json'|'csv'|'tsv'|'topojson';
    property?: string;
    parse?: { [key: string]: dataType };
  }

  interface ITypeParsers {
    boolean: (value: any) => boolean|null;
    integer: (value: any) => number|null;
    number: (value: any) => number|null;
    date: (value: any) => Date|null;
    string: (value: any) => string|null;
  }

  type Format = (data: string, options?: { [key: string]: any }) => string;

  interface ILoader {
    load: (uri: string, options?: ILoaderOptions) => Promise<string>;
    sanitize: (uri: string, options?: ILoaderOptions) => Promise<{ href: string, [key: string]: any }>;
    http: (uri: string, options?: ILoaderOptions) => Promise<string>;
    read: (data: string, schema?: ISchema) => Promise<string>;
    file: (filename: string) => Promise<string>;
    inferType: (values: any[], field?: (value: any) => any) => dataType;
    inferTypes: (data: Object[], fields?: string[]) => { [key: string]: dataType };
    typeParsers: ITypeParsers;
    formats: (name: string, format?: Format) => Format|null;
  }
	
	function loader(options: ILoaderOptions): ILoader;

}
