/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import getEditorSelection from "./selection";
import {
  STRUCTURE_NODE_INDEX,
  CONTENT_NODE_START_INDEX,
  CONTENT_NODE_START_OFFSET,
  CONTENT_NODE_END_INDEX,
  CONTENT_NODE_END_OFFSET,
} from "./render";

class NamedNodeMapMock {
  private dict: { [name: string]: Attr } = {};

  public setNamedItem(attr: Attr): Attr | null {
    this.dict[attr.name] = attr;
    return attr;
  }

  public getNamedItem(name: string): Attr {
    const attr = this.dict[name];
    return attr || null;
  }
}

interface StructureNodeAttributes {
  [STRUCTURE_NODE_INDEX]?: boolean;
  [CONTENT_NODE_START_INDEX]?: boolean;
  [CONTENT_NODE_START_OFFSET]?: boolean;
  [CONTENT_NODE_END_INDEX]?: boolean;
  [CONTENT_NODE_END_OFFSET]?: boolean;
}

const checkProperty = (
  show: StructureNodeAttributes | undefined,
  name: keyof StructureNodeAttributes,
): boolean => {
  if (show === undefined) {
    return true;
  } else if (show[name] === undefined) {
    return true;
  } else {
    return show[name] || false;
  }
};

const createAttribute = (
  map: NamedNodeMapMock,
  name: string,
  value: string,
) => {
  const attr = document.createAttribute(name);
  attr.value = value;
  map.setNamedItem(attr);
};

const createElement = (show?: StructureNodeAttributes) => {
  const map = new NamedNodeMapMock();

  if (checkProperty(show, STRUCTURE_NODE_INDEX)) {
    createAttribute(map, STRUCTURE_NODE_INDEX, "2");
  }

  if (checkProperty(show, CONTENT_NODE_START_INDEX)) {
    createAttribute(map, CONTENT_NODE_START_INDEX, "3");
  }

  if (checkProperty(show, CONTENT_NODE_START_OFFSET)) {
    createAttribute(map, CONTENT_NODE_START_OFFSET, "4");
  }

  if (checkProperty(show, CONTENT_NODE_END_INDEX)) {
    createAttribute(map, CONTENT_NODE_END_INDEX, "5");
  }

  if (checkProperty(show, CONTENT_NODE_END_OFFSET)) {
    createAttribute(map, CONTENT_NODE_END_OFFSET, "6");
  }

  return { attributes: map };
};

describe("markdown selection", (): void => {
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  const shadowRoot = {} as ShadowRoot;

  test("empty selection", (): void => {
    shadowRoot.getSelection = jest.fn().mockReturnValue(null);
    expect(getEditorSelection(shadowRoot)).toEqual(null);
  });

  test("selection with null anchorNode", (): void => {
    shadowRoot.getSelection = jest.fn().mockReturnValue({
      anchorNode: null,
      focusNode: null,
    });
    expect(getEditorSelection(shadowRoot)).toEqual(null);
  });

  test("selection with null focusNode", (): void => {
    shadowRoot.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement(),
      focusNode: null,
    });
    expect(getEditorSelection(shadowRoot)).toEqual(null);
  });

  test("selection with elements which don't have structurenodeindex", (): void => {
    shadowRoot.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement({ [STRUCTURE_NODE_INDEX]: false }),
      anchorOffset: 10,
      focusNode: createElement({ [STRUCTURE_NODE_INDEX]: false }),
      focusOffset: 11,
    });
    expect(getEditorSelection(shadowRoot)).toEqual(null);
  });

  test("selection with no parent nodes", (): void => {
    shadowRoot.getSelection = jest.fn().mockReturnValue({
      anchorNode: { parentElement: null },
      anchorOffset: 10,
      focusNode: { parentElement: null },
      focusOffset: 11,
    });
    expect(getEditorSelection(shadowRoot)).toEqual(null);
  });

  test("selection with nodes", (): void => {
    shadowRoot.getSelection = jest.fn().mockReturnValue({
      anchorNode: { parentElement: createElement() },
      anchorOffset: 10,
      focusNode: { parentElement: createElement() },
      focusOffset: 11,
    });
    expect(getEditorSelection(shadowRoot)).toEqual({
      anchor: {
        end: { nodeIndex: 5, nodeStartOffset: 6 },
        localOffset: 10,
        start: { nodeIndex: 3, nodeStartOffset: 4 },
        structureNodeIndex: 2,
      },
      focus: {
        end: {
          nodeIndex: 5,
          nodeStartOffset: 6,
        },
        localOffset: 11,
        start: { nodeIndex: 3, nodeStartOffset: 4 },
        structureNodeIndex: 2,
      },
    });
  });
});
