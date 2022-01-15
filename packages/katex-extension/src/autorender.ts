// Modified after the auto-render.js extension in katex/contrib.

import katex from 'katex';

interface IParseData {
  type: 'text' | 'math' | 'string';
  data: string;
  display: boolean;
  rawData?: string;
}

function findEndOfMath(delimiter: string, text: string, startIndex: number) {
  // Adapted from
  // https://github.com/Khan/perseus/blob/master/src/perseus-markdown.jsx
  let index = startIndex;
  let braceLevel = 0;
  const delimLength = delimiter.length;

  while (index < text.length) {
    const character = text[index];
    if (
      braceLevel <= 0 &&
      text.slice(index, index + delimLength) === delimiter
    ) {
      return index;
    } else if (character === '\\') {
      index++;
    } else if (character === '{') {
      braceLevel++;
    } else if (character === '}') {
      braceLevel--;
    }
    index++;
  }
  return -1;
}

function splitAtDelimiters(
  startData: IParseData[],
  leftDelim: string,
  rightDelim: string,
  display: boolean
) {
  const finalData: IParseData[] = [];

  for (let i = 0; i < startData.length; i++) {
    if (startData[i].type === 'text') {
      const text = startData[i].data;

      let lookingForLeft = true;
      let currIndex = 0;
      let nextIndex;

      nextIndex = text.indexOf(leftDelim);
      if (nextIndex !== -1) {
        currIndex = nextIndex;
        finalData.push({
          type: 'text',
          data: text.slice(0, currIndex),
          display,
        });
        lookingForLeft = false;
      }

      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (lookingForLeft) {
          nextIndex = text.indexOf(leftDelim, currIndex);
          if (nextIndex === -1) {
            break;
          }

          finalData.push({
            type: 'text',
            data: text.slice(currIndex, nextIndex),
            display,
          });

          currIndex = nextIndex;
        } else {
          nextIndex = findEndOfMath(
            rightDelim,
            text,
            currIndex + leftDelim.length
          );
          if (nextIndex === -1) {
            break;
          }

          finalData.push({
            type: 'math',
            data: text.slice(currIndex + leftDelim.length, nextIndex),
            rawData: text.slice(currIndex, nextIndex + rightDelim.length),
            display: display,
          });

          currIndex = nextIndex + rightDelim.length;
        }

        lookingForLeft = !lookingForLeft;
      }

      finalData.push({
        type: 'text',
        data: text.slice(currIndex),
        display,
      });
    } else {
      finalData.push(startData[i]);
    }
  }
  return finalData;
}

function splitWithDelimiters(text: string, delimiters: IDelimiter[]) {
  let data: IParseData[] = [{ type: 'text', data: text, display: false }];
  for (let i = 0; i < delimiters.length; i++) {
    const delimiter = delimiters[i];
    data = splitAtDelimiters(
      data,
      delimiter.left,
      delimiter.right,
      delimiter.display || false
    );
  }
  return data;
}

/* Note: optionsCopy is mutated by this method. If it is ever exposed in the
 * API, we should copy it before mutating.
 */
function renderMathInText(text: string, optionsCopy: IAutoRenderOptions) {
  const data = splitWithDelimiters(text, optionsCopy.delimiters);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < data.length; i++) {
    if (data[i].type === 'text') {
      fragment.appendChild(document.createTextNode(data[i].data));
    } else {
      const span = document.createElement('span');
      const math = data[i].data;
      // Override any display mode defined in the settings with that
      // defined by the text itself
      optionsCopy.displayMode = data[i].display;
      try {
        katex.render(math, span, optionsCopy);
      } catch (err) {
        fragment.appendChild(document.createTextNode(data[i].rawData));
        continue;
      }
      fragment.appendChild(span);
    }
  }
  return fragment;
}

function renderElem(elem: Node, optionsCopy: IAutoRenderOptions) {
  for (let i = 0; i < elem.childNodes.length; i++) {
    const childNode = elem.childNodes[i];
    if (childNode.nodeType === 3) {
      // Text node
      const frag = renderMathInText(childNode.textContent, optionsCopy);
      i += frag.childNodes.length - 1;
      elem.replaceChild(frag, childNode);
    } else if (childNode.nodeType === 1) {
      // Element node
      const shouldRender =
        optionsCopy.ignoredTags.indexOf(childNode.nodeName.toLowerCase()) ===
        -1;

      if (shouldRender) {
        renderElem(childNode, optionsCopy);
      }
    }
    // Otherwise, it's something else, and ignore it.
  }
}

export interface IAutoRenderOptions extends katex.KatexOptions {
  readonly delimiters: IDelimiter[];
  readonly ignoredTags: string[];
  readonly throwOnError: boolean;
  macros?: IMacros;
}

export interface IDelimiter {
  left: string;
  right: string;
  display: boolean;
}

export interface IMacros {
  [s: string]: string;
}

const defaultAutoRenderOptions: IAutoRenderOptions = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false },
    { left: '$', right: '$', display: false },
    { left: '\\begin{equation}', right: '\\end{equation}', display: true },
  ],

  ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
  errorColor: '#CC0000',
  throwOnError: false,
};

export function renderMathInElement(
  elem: HTMLElement,
  options: Partial<IAutoRenderOptions> = {}
): void {
  if (!elem) {
    throw new Error('No element provided to render');
  }
  const fullOptions = { ...defaultAutoRenderOptions, ...options };
  renderElem(elem, fullOptions);
}
