export interface ToJSONOptions {
  absolutePaths: boolean | FilterList;
  absoluteBase: string;
  attributes: boolean | FilterList;
  computedStyle: boolean | FilterList;
  cull: boolean;
  deep: boolean | number;
  domProperties: boolean | FilterList;
  htmlOnly: boolean;
  metadata: boolean;
  serialProperties: boolean | FilterList;
  stringify: boolean;
}

export interface ToDOMOptions {
  noMeta: boolean;
}

export interface IndexedObject {
  [key: string]: any;
}

export type Result = IndexedObject;

export type Item = IndexedObject | any[];

export type FilterListShorthand = any[] | boolean;

// export interface FilterListShorthand {
//   [index: number]: string;
//   0: boolean;
// }

export interface FilterListObject {
  values: string[];
  exclude?: boolean;
  [key: string]: FilterListShorthand;
}

export type FilterList = FilterListShorthand | FilterListObject;

/**
 * domJSON is a global variable to store two methods: `.toJSON()` to convert a DOM Node into a JSON object, and `.toDOM()` to turn that JSON object back into a DOM Node
 * @namespace domJSON
 * @global
 */
let domJSON: IndexedObject = {};

/**
 * Default metadata for a JSON object
 * @private
 * @ignore
 */
const metadata = {
  href: window.location.href || null,
  userAgent:
    window.navigator && window.navigator.userAgent
      ? window.navigator.userAgent
      : null,
  version: '0.1.2'
};

/**
 * Default options for creating the JSON object
 * @private
 * @ignore
 */
const defaultsForToJSON = {
  absolutePaths: ['action', 'data', 'href', 'src'],
  attributes: true,
  computedStyle: false,
  cull: true,
  deep: true,
  domProperties: true,
  // filter: false,
  htmlOnly: false,
  metadata: true,
  serialProperties: false,
  stringify: false
};

/**
 * Default options for creating a DOM node from a previously generated domJSON object
 * @private
 * @ignore
 */
const defaultsForToDOM = {
  noMeta: false
};

/**
 * A list of disallowed HTMLElement tags - there is no flexibility here, these cannot be processed by domJSON for security reasons!
 * @private
 * @ignore
 */
const banned = ['link', 'script']; //Consider (maybe) adding the following tags: iframe, html, audio, video, object

/**
 * A list of node properties that must be copied if they exist; there is no user option that will remove these
 * @private
 * @ignore
 */
const required = ['nodeType', 'nodeValue', 'tagName'];

/**
 * A list of node properties to specifically avoid simply copying; there is no user option that will allow these to be copied directly
 * @private
 * @ignore
 */
const ignored = [
  'attributes',
  'childNodes',
  'children',
  'classList',
  'dataset',
  'style'
];

/**
 * A list of serialized read-only nodes to ignore; these can ovewritten if the user specifies the "filter" option
 * @private
 * @ignore
 */
const serials = [
  'innerHTML',
  'innerText',
  'outerHTML',
  'outerText',
  'prefix',
  'text',
  'textContent',
  'wholeText'
];

/**
 * Get all of the unique values (in the order they first appeared) from one or more arrays
 * @param {...Array} constituent An array to combine into a larger array of unique values
 * @private
 * @ignore
 */
function unique<P>(...items: P[]): P[] {
  if (!items.length) {
    return [];
  }
  for (let a = 0; a < items.length; a++) {
    if (items.indexOf(items[a]) < a) {
      items.splice(a, 1);
      a--;
    }
  }
  return items;
}

/**
 * Make a shallow copy of an object or array
 * @param {Object|string[]} item The object/array that will be copied
 * @private
 * @ignore
 */
function copy(item: Item): Item {
  if (item instanceof Array) {
    return [...item];
  } else {
    return { ...item };
  }
}

/**
 * Do a boolean intersection between an array/object and a filter array
 * @param {Object|string[]} item The object/array that will be intersected with the filter
 * @param {boolean|string[]} filter Specifies which properties to select from the "item" (or element to keep, if "item is an array")
 * @private
 * @ignore
 */
function boolInter(item: any[] | FilterListObject, filter: any[]): any[] {
  if (item instanceof Array) {
    return unique((item as any[]).filter(val => filter.indexOf(val) > -1));
  } else {
    return filter.reduce((result, f) => {
      if ((item as FilterListObject)[f]) {
        return { ...result, [f]: (item as FilterListObject)[f] };
      }
      return result;
    }, {});
  }
}

/**
 * Do a boolean difference between an array/object and a filter array
 * @param {Object|string[]} item The object/array that will be differntiated with the filter
 * @param {boolean|string[]} filter Specifies which properties to exclude from the "item" (or element to remove, if "item is an array")
 * @private
 * @ignore
 */
function boolDiff(
  item: any[] | FilterListObject,
  filter: string[]
): any[] | FilterListObject {
  if (item instanceof Array) {
    return unique((item as string[]).filter(val => filter.indexOf(val) === -1));
  } else {
    return filter.reduce((result, f) => {
      if (result[f]) {
        delete result[f];
      }
      return result;
    }, item);
  }
}

/**
 * Determine whether we want to do a boolean intersection or difference
 * @param {Object|string[]} item The object/array that will be differntiated with the filter
 * @param {boolean|Array} filter Specifies which a filter behavior; if it is an array, the first value can be a boolean, indicating whether the filter array is intended for differentiation (true) or intersection (false)
 * @private
 * @ignore
 */
function boolFilter(item: Item, filter: FilterList): Item {
  //A "false" filter means we return an empty copy of item
  if (filter === false) {
    return item instanceof Array ? [] : {};
  }

  if (filter instanceof Array && filter.length) {
    if (typeof filter[0] === 'boolean') {
      if (filter.length == 1) {
        //There is a filter array, but its only a sigle boolean
        if (filter[0] === true) {
          return copy(item);
        } else {
          return item instanceof Array ? [] : {};
        }
      } else {
        //The filter operation has been set explicitly; true = difference
        if (filter[0] === true) {
          return boolDiff(item as any[], filter.slice(1));
        } else {
          return boolInter(item as any[], filter.slice(1));
        }
      }
    } else {
      //There is no explicit operation on the filter, meaning it defaults to an intersection
      return boolInter(item as any[], filter);
    }
  } else {
    return copy(item as FilterListObject);
  }
}

/**
 * Ensure that a FilterList type input is converted into its shorthand array form
 * @param {boolean|FilterList} filterList The FilterList, or boolean, that will converted into the shorthand form
 * @private
 * @ignore
 */
function toShorthand(
  filterList: FilterList | boolean
): FilterListShorthand | boolean {
  let outputArray: FilterListShorthand;
  if (typeof filterList === 'boolean') {
    return filterList;
  } else if (typeof filterList === 'object' && filterList !== null) {
    if (filterList instanceof Array) {
      return filterList.filter(function(v, i) {
        return typeof v === 'string' || (i === 0 && v === true) ? true : false;
      });
    } else {
      if (!(filterList.values instanceof Array)) {
        return false;
      }

      outputArray = filterList.values.filter(function(v) {
        return typeof v === 'string' ? true : false;
      });

      if (!outputArray.length) {
        return false;
      }

      if (filterList.exclude) {
        outputArray.unshift(filterList.exclude);
      }
      return outputArray;
    }
  } else if (filterList) {
    return true;
  }
  return false;
}

/**
 * Check if the supplied string value is a relative path, and convert it to an absolute one if necessary; the segment processing paths leading with "../" was inspired by: http://stackoverflow.com/a/14780463/2230156
 * @param {string} value The value that might be a relative path, and would thus need conversion
 * @param {Object} origin The origin URL from which to which non-absolute paths are relative
 * @private
 * @ignore
 */
function toAbsolute(value: string, origin: string): string {
  let protocol, stack, parts;
  //Sometimes, we get lucky and the DOM Node we're working on already has the absolute URL as a DOM property, so we can just use that
  /*if (node[name]){
    //We can just grab the compiled URL directly from the DOM element - easy peasy
    let sub = node[name].indexOf(value);
    if (sub !== -1) {
      return node[name];
    }
  }*/

  //Check to make sure we don't already have an absolute path, or even a dataURI
  if (value.match(/(?:^data\:|^[\w\-\+\.]*?\:\/\/|^\/\/)/i)) {
    return value;
  }

  //If we are using the root URL, start from there
  if (value.charAt(0) === '/') {
    return origin + value.substr(1);
  }

  //Uh-oh, the relative path is leading with a single or double dot ("./" or "../"); things get a bit harder...
  protocol =
    origin.indexOf('://') > -1
      ? origin.substring(0, origin.indexOf('://') + 3)
      : '';
  stack = (protocol.length ? origin.substring(protocol.length) : origin).split(
    '/'
  );
  parts = value.split('/');

  //The value after the last slash is ALWAYS considered a filename, not a directory, so always have trailing slashes on paths ending at directories!
  stack.pop();

  //Cycle through the relative path, changing the stack as we go
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] == '.') {
      continue;
    }
    if (parts[i] == '..') {
      if (stack.length > 1) {
        stack.pop();
      }
    } else {
      stack.push(parts[i]);
    }
  }
  return protocol + stack.join('/');
}

/**
 * Create a copy of a node's properties, ignoring nasty things like event handles and functions
 * @param {Node} node The DOM Node whose properties will be copied
 * @param {Object} [opts] The options object passed down from the .toJSON() method; includes all options, even those not relevant to this function
 * @private
 * @ignore
 */
function copyJSON(node: any, opts: ToJSONOptions): IndexedObject {
  let copy: IndexedObject = {};
  //Copy all of the node's properties
  for (let n in node) {
    //Make sure this is an own property, and isn't a live javascript function for security reasons
    if (
      typeof node[n] !== 'undefined' &&
      typeof node[n] !== 'function' &&
      n.charAt(0).toLowerCase() === n.charAt(0)
    ) {
      //Only allowed objects are arrays
      if (typeof node[n] !== 'object' || node[n] instanceof Array) {
        //If we are eliminating empty fields, make sure this value is not NULL or UNDEFINED
        if (opts.cull) {
          if (node[n] || node[n] === 0 || node[n] === false) {
            copy[n] = node[n];
          }
        } else {
          copy[n] = node[n];
        }
      }
    }
  }

  copy = boolFilter(copy, opts.domProperties);
  return copy;
}

/**
 * Convert the attributes property of a DOM Node to a JSON ready object
 * @param {Node} node The DOM Node whose attributes will be copied
 * @param {Object} [opts] The options object passed down from the .toJSON() method; includes all options, even those not relevant to this function
 * @private
 * @ignore
 */
function attrJSON(node: any, opts: ToJSONOptions): IndexedObject {
  let attributes: IndexedObject = {};
  let attr = node.attributes;
  let length = attr.length;
  let absAttr: IndexedObject;

  for (let i = 0; i < length; i++) {
    attributes[attr[i].name] = attr[i].value;
  }
  attributes = opts.attributes ? boolFilter(attributes, opts.attributes) : null;

  //Add the attributes object, converting any specified absolute paths along the way
  absAttr = boolFilter(attributes, opts.absolutePaths);
  for (let i in absAttr) {
    attributes[i] = toAbsolute(absAttr[i], opts.absoluteBase);
  }

  return attributes;
}

/**
 * Grab a DOM Node's computed style
 * @param {Node} node The DOM Node whose computed style will be calculated
 * @param {Object} [opts] The options object passed down from the .toJSON() method; includes all options, even those not relevant to this function
 * @private
 * @ignore
 */
function styleJSON(
  node: any,
  opts: ToJSONOptions
): Item | IndexedObject | null {
  //Grab the computed style
  let style: IndexedObject;
  let css: IndexedObject = {};
  if (opts.computedStyle && node.style instanceof CSSStyleDeclaration) {
    style = window.getComputedStyle(node);
  } else {
    return null;
  }

  //Get the relevant properties from the computed style
  for (let k in style) {
    if (
      k !== 'cssText' &&
      !k.match(/\d/) &&
      typeof style[k] === 'string' &&
      style[k].length
    ) {
      //css.push(k+ ': ' +style[k]+ ';');
      css[k] = style[k];
    }
  }

  //Filter the style object
  return opts.computedStyle instanceof Array
    ? boolFilter(css, opts.computedStyle)
    : css;
}

/**
 * Convert a single DOM Node into a simple object
 * @param {Node} node The DOM Node that will be converted
 * @param {Object} [opts] The options object passed down from the .toJSON() method; includes all options, even those not relevant to this function
 * @private
 * @ignore
 */
function toJSON(
  node: any,
  opts: ToJSONOptions,
  depth: number
): Result | string {
  let style,
    kids,
    kidCount,
    thisChild,
    children,
    copy = copyJSON(node, opts);

  //Some tags are not allowed
  if (node.nodeType === 1) {
    for (let b in banned) {
      if (node.tagName.toLowerCase() === banned[b]) {
        return null;
      }
    }
  } else if (node.nodeType === 3 && !node.nodeValue.trim()) {
    //Ignore empty buffer text nodes
    return null;
  }

  //Copy all attributes and styles, if allowed
  if (opts.attributes && node.attributes) {
    copy.attributes = attrJSON(node, opts);
  }
  if (opts.computedStyle && (style = styleJSON(node, opts))) {
    copy.style = style;
  }

  //Should we continue iterating?
  if (
    opts.deep === true ||
    (typeof opts.deep === 'number' && opts.deep > depth)
  ) {
    //We should!
    children = [];
    kids = opts.htmlOnly ? node.children : node.childNodes;
    kidCount = kids.length;
    for (let c = 0; c < kidCount; c++) {
      thisChild = toJSON(kids[c], opts, depth + 1);
      if (thisChild) {
        children.push(thisChild);
      }
    }

    //Append the children in the appropriate place
    copy.childNodes = children;
  }
  return copy;
}

/**
 * Take a DOM node and convert it to simple object literal (or JSON string) with no circular references and no functions or events
 * @param {Node} node The actual DOM Node which will be the starting point for parsing the DOM Tree
 * @param {Object} [opts] A list of all method options
 * @param {boolean|FilterList} [opts.absolutePaths=`'action', 'data', 'href', 'src'`] Only relevant if `opts.attributes` is not `false`; use `true` to convert all relative paths found in attribute values to absolute paths, or specify a `FilterList` of keys to boolean search
 * @param {boolean|FilterList} [opts.attributes=`true`] Use `true` to copy all attribute key-value pairs, or specify a `FilterList` of keys to boolean search
 * @param {boolean|FilterList} [opts.computedStyle=`false`] Use `true` to parse the results of "window.getComputedStyle()" on every node (specify a `FilterList` of CSS properties to be included via boolean search); this operation is VERY costly performance-wise!
 * @param {boolean} [opts.cull=`false`] Use `true` to ignore empty element properties
 * @param {boolean|number} [opts.deep=`true`] Use `true` to iterate and copy all childNodes, or an INTEGER indicating how many levels down the DOM tree to iterate
 * @param {boolean|FilterList} [opts.domProperties=true] 'false' means only 'tagName', 'nodeType', and 'nodeValue' properties will be copied, while a `FilterList` can specify DOM properties to include or exclude in the output (except for ones which serialize the DOM Node, which are handled separately by `opts.serialProperties`)
 * @param {boolean} [opts.htmlOnly=`false`] Use `true` to only iterate through childNodes where nodeType = 1 (aka, instances of HTMLElement); irrelevant if `opts.deep` is `true`
 * @param {boolean} [opts.metadata=`false`] Output a special object of the domJSON class, which includes metadata about this operation
 * @todo {boolean|FilterList} [opts.parse=`false`] a `FilterList` of properties that are DOM nodes, but will still be copied **PLANNED**
 * @param {boolean|FilterList} [opts.serialProperties=`true`] Use `true` to ignore the properties that store a serialized version of this DOM Node (ex: outerHTML, innerText, etc), or specify a `FilterList` of serial properties (no boolean search!)
 * @param {boolean} [opts.stringify=`false`] Output a JSON string, or just a JSON-ready javascript object?
 * @return {Object|string} A JSON-friendly object, or JSON string, of the DOM node -> JSON conversion output
 * @method
 * @memberof domJSON
 */
domJSON.toJSON = function(node: Node, opts: ToJSONOptions): Result | string {
  let output: IndexedObject = {};
  const timer = new Date().getTime();
  const requiring = required.slice();
  let ignoring = ignored.slice();

  //Update the default options w/ the user's custom settings
  const options = { ...defaultsForToJSON, ...opts };

  //Convert all options that accept FilterList type inputs into the shorthand notation
  options.absolutePaths = toShorthand(options.absolutePaths);
  options.attributes = toShorthand(options.attributes);
  options.computedStyle = toShorthand(options.computedStyle);
  options.domProperties = toShorthand(options.domProperties);
  options.serialProperties = toShorthand(options.serialProperties);

  //Make sure there is a base URL for absolute path conversions
  options.absoluteBase = window.location.origin + '/';

  //Make lists of which DOM properties to skip and/or which are absolutely necessary
  if (options.serialProperties !== true) {
    if (
      options.serialProperties instanceof Array &&
      options.serialProperties.length
    ) {
      if (options.serialProperties[0] === true) {
        ignoring = ignoring.concat(boolDiff(
          serials,
          options.serialProperties
        ) as any[]);
      } else {
        ignoring = ignoring.concat(
          boolInter(serials, options.serialProperties)
        );
      }
    } else {
      ignoring = ignoring.concat(serials);
    }
  }
  if (options.domProperties instanceof Array) {
    if (options.domProperties[0] === true) {
      options.domProperties = boolDiff(
        unique(options.domProperties, ignoring),
        requiring
      );
    } else {
      options.domProperties = boolDiff(
        unique(options.domProperties, requiring),
        ignoring
      );
    }
  } else {
    if (options.domProperties === false) {
      options.domProperties = requiring;
    } else {
      options.domProperties = ([true] as any[]).concat(ignoring);
    }
  }

  //Transform the node into an object literal
  const copy = toJSON(node, options, 0);

  //Wrap our copy object in a nice object of its own to save some metadata
  if (options.metadata) {
    output.meta = {
      ...metadata,
      clock: new Date().getTime() - timer,
      date: new Date().toISOString(),
      dimensions: {
        inner: {
          x: window.innerWidth,
          y: window.innerHeight
        },
        outer: {
          x: window.outerWidth,
          y: window.outerHeight
        }
      },
      options: options
    };
    output.node = copy;
  } else {
    output = copy as IndexedObject;
  }

  //If opts.stringify is true, turn the output object into a JSON string
  if (options.stringify) {
    return JSON.stringify(output);
  }
  return output;
};

/**
 * Create a node based on a given nodeType
 * @param {number} type The type of DOM Node (only the integers 1, 3, 7, 8, 9, 10, 11 are valid, see https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType); currently, only nodeTypes 1,3, and 11 have been tested and are officially supported
 * @param {DocumentFragment} doc The document fragment to which this newly created DOM Node will be added
 * @param {Object} data The saved DOM properties that are part of the JSON representation of this DOM Node
 * @private
 * @ignore
 */
function createNode(type: number, doc: Document, data: any): Node | boolean {
  if (doc instanceof DocumentFragment) {
    doc = doc.ownerDocument;
  }
  switch (type) {
    case 1: //HTMLElement
      if (typeof data.tagName === 'string') {
        return doc.createElement(data.tagName);
      }
      return false;

    case 3: //Text Node
      if (typeof data.nodeValue === 'string' && data.nodeValue.length) {
        return doc.createTextNode(data.nodeValue);
      }
      return doc.createTextNode('');

    case 7: //Processing Instruction
      if (data.hasOwnProperty('target') && data.hasOwnProperty('data')) {
        return doc.createProcessingInstruction(data.target, data.data);
      }
      return false;

    case 8: //Comment Node
      if (typeof data.nodeValue === 'string') {
        return doc.createComment(data.nodeValue);
      }
      return doc.createComment('');

    case 9: //HTML Document
      return doc.implementation.createHTMLDocument(data);

    case 11: //Document Fragment
      return doc;

    default:
      //Failed
      return false;
  }
}

//Recursively convert a JSON object generated by domJSON to a DOM Node
/**
 * Do the work of converting a JSON object/string generated by domJSON to a DOM Node
 * @param {Object} obj The JSON representation of the DOM Node we are about to create
 * @param {HTMLElement} parent The HTML Element to which this DOM Node will be appended
 * @param {DocumentFragment} doc The document fragment to which this newly created DOM Node will be added
 * @private
 * @ignore
 */
function toDOM(obj: Result, parent: Node, doc: Document): Node | boolean {
  //Create the node, if possible
  let node: any;
  if (obj.nodeType) {
    node = createNode(obj.nodeType, doc, obj) as Node;
    parent.appendChild(node);
  } else {
    return false;
  }

  //Copy all available properties that are not arrays or objects
  for (let x in obj) {
    if (
      typeof obj[x] !== 'object' &&
      x !== 'isContentEditable' &&
      x !== 'childNodes'
    ) {
      try {
        node[x] = obj[x];
      } catch (e) {
        continue;
      }
    }
  }

  //If this is an HTMLElement, set the attributes
  if (obj.nodeType === 1 && obj.tagName) {
    if (obj.attributes) {
      //Check for cross-origin
      /*src = obj.attributes.src ? 'src' : (obj.attributes.href ? 'href' : null);
      if (src) {
        obj.attributes[src] += ( (obj.attributes[src].indexOf('?') === -1) ? '?' : '&'+Math.random().toString(36).slice(-2)+'=' ) + Math.random().toString(36).slice(-4);
        obj.attributes.crossorigin = 'anonymous';
        //node.setAttribute('crossorigin', 'anonymous');
      }*/
      for (let a in obj.attributes) {
        node.setAttribute(a, obj.attributes[a]);
      }
    }
  }

  //Finally, if we have childNodes, recurse through them
  if (obj.childNodes && obj.childNodes.length) {
    for (let c in obj.childNodes) {
      toDOM(obj.childNodes[c], node, doc);
    }
  }
}

/**
 * Take the JSON-friendly object created by the `.toJSON()` method and rebuild it back into a DOM Node
 * @param {Object} obj A JSON friendly object, or even JSON string, of some DOM Node
 * @param {Object} [opts] A list of all method options
 * @param {boolean} [opts.noMeta=`false`] `true` means that this object is not wrapped in metadata, which it makes it somewhat more difficult to rebuild properly...
 * @return {DocumentFragment} A `DocumentFragment` (nodeType 11) containing the result of unpacking the input `obj`
 * @method
 * @memberof domJSON
 */
domJSON.toDOM = function(obj: Result, opts: ToDOMOptions): DocumentFragment {
  //Parse the JSON string if necessary
  if (typeof obj === 'string') {
    obj = JSON.parse(obj);
  }
  //Update the default options w/ the user's custom settings
  const options = { ...defaultsForToDOM, ...opts };

  //Create a document fragment, and away we go!
  const node = document.createDocumentFragment();
  if (options.noMeta) {
    toDOM(obj, node, node as Document);
  } else {
    toDOM(obj.node, node, node as Document);
  }
  return node;
};

export default domJSON;
