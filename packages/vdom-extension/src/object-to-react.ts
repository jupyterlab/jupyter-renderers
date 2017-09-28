import * as React from 'react';

export type VDOMNode = VDOMElement | string;

export type VDOMNodeArray = VDOMNode | Array<VDOMNode>

export type VDOMElement = {
  tagName: string, // Could be an enum honestly
  children: Array<VDOMNodeArray>,
  attributes: Object,
  key: number | string | null
};

export type ReactArray = Array<React.ReactElement<any> | string>;

/**
 * Convert an object to React element(s).
 *
 * The object schema should be similar to React element's.
 * Note: The object passed in this function will be mutated.
 *
 * @param  {Object}       obj - The element object.
 * @return {ReactElement}
 */
export function objectToReactElement(obj: VDOMElement): React.ReactElement<any> {
  // Pack args for React.createElement
  var args = [];
  if (!obj.tagName || typeof obj.tagName !== "string") {
    throw new Error(`Invalid tagName on ${JSON.stringify(obj, null, 2)}`);
  }
  if (!obj.attributes || typeof obj.attributes !== "object") {
    throw new Error(`Attributes must exist on a VDOM Object`);
  }
  // `React.createElement` 1st argument: type
  args[0] = obj.tagName;
  args[1] = obj.attributes;
  const children = obj.children;
  if (children) {
    if (Array.isArray(children)) {
      // to be safe (although this should never happen)
      if (args[1] === undefined) {
        args[1] = null;
      }
      args = args.concat(arrayToReactChildren(children));
    } else if (typeof children === "string") {
      args[2] = children;
    } else if (typeof children === "object") {
      args[2] = objectToReactElement(children);
    } else {
      console.warn("invalid vdom data passed", children);
    }
  }
  return React.createElement.apply({}, args);
}

/**
 * Convert an array of items to React children.
 *
 * @param  {Array} arr - The array.
 * @return {Array}     - The array of mixed values.
 */
function arrayToReactChildren(arr: Array<VDOMNodeArray>): Array<React.ReactElement<any> | string | Array<any>> {
  // similar to `props.children`
  var result = [];
  // child of `props.children`
  // iterate through the `children`
  for (var i = 0, len = arr.length; i < len; i++) {
    // child can have mixed values: text, React element, or array
    const item = arr[i];
    if (Array.isArray(item)) {
      result.push(arrayToReactChildren(item));
    } else if (typeof item === "string") {
      result.push(item);
    } else if (typeof item === "object") {
      const keyedItem = item;
      item.key = i;
      result.push(objectToReactElement(keyedItem));
    } else {
      console.warn("invalid vdom data passed", item);
    }
  }
  return result;
}
