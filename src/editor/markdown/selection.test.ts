/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import getEditorSelection from "./selection";
import { STRUCTURE_NODE_INDEX, CONTENT_OFFSET, IS_BREAK } from "../editorBase";

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

interface ShowItems {
  [IS_BREAK]?: boolean;
  [CONTENT_OFFSET]?: boolean;
  [STRUCTURE_NODE_INDEX]?: boolean;
}

const checkProperty = (
  show: ShowItems | undefined,
  name: keyof ShowItems,
): boolean => {
  if (show === undefined) {
    return true;
  } else if (show[name] === undefined) {
    return true;
  } else {
    return show[name] || false;
  }
};

const createElement = (show?: ShowItems) => {
  const attributes = new NamedNodeMapMock();

  if (checkProperty(show, CONTENT_OFFSET)) {
    const contentoffset = document.createAttribute(CONTENT_OFFSET);
    contentoffset.value = "10";
    attributes.setNamedItem(contentoffset);
  }

  if (checkProperty(show, STRUCTURE_NODE_INDEX)) {
    const structurenodeindex = document.createAttribute(STRUCTURE_NODE_INDEX);
    structurenodeindex.value = "2";
    attributes.setNamedItem(structurenodeindex);
  }

  if (checkProperty(show, IS_BREAK)) {
    const isbreak = document.createAttribute(IS_BREAK);
    isbreak.value = "true";
    attributes.setNamedItem(isbreak);
  }

  return { attributes };
};

describe("markdown selection", (): void => {
  test("empty selection", (): void => {
    window.getSelection = jest.fn().mockReturnValue(null);
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with null anchorNode", (): void => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: null,
      focusNode: null,
    });
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with null focusNode", (): void => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement(),
      focusNode: null,
    });
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with elements which have break indicators", (): void => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement(),
      anchorOffset: 10,
      focusNode: createElement(),
      focusOffset: 11,
    });
    expect(getEditorSelection()).toEqual({
      end: {
        contentOffset: 10,
        isBreak: true,
        localOffset: 11,
        structureNodeIndex: 2,
      },
      start: {
        contentOffset: 10,
        isBreak: true,
        localOffset: 10,
        structureNodeIndex: 2,
      },
    });
  });

  test("selection with elements which don't have break indicators", (): void => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement({ isbreak: false }),
      anchorOffset: 10,
      focusNode: createElement({ isbreak: false }),
      focusOffset: 11,
    });
    expect(getEditorSelection()).toEqual({
      end: {
        contentOffset: 10,
        isBreak: false,
        localOffset: 11,
        structureNodeIndex: 2,
      },
      start: {
        contentOffset: 10,
        isBreak: false,
        localOffset: 10,
        structureNodeIndex: 2,
      },
    });
  });

  test("selection with elements which don't have contentoffset", (): void => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement({ [CONTENT_OFFSET]: false }),
      anchorOffset: 10,
      focusNode: createElement({ [CONTENT_OFFSET]: false }),
      focusOffset: 11,
    });
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with elements which don't have structurenodeindex", (): void => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement({ [STRUCTURE_NODE_INDEX]: false }),
      anchorOffset: 10,
      focusNode: createElement({ [STRUCTURE_NODE_INDEX]: false }),
      focusOffset: 11,
    });
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with no parent nodes", (): void => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: { parentElement: null },
      anchorOffset: 10,
      focusNode: { parentElement: null },
      focusOffset: 11,
    });
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with nodes", (): void => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: { parentElement: createElement() },
      anchorOffset: 10,
      focusNode: { parentElement: createElement() },
      focusOffset: 11,
    });
    expect(getEditorSelection()).toEqual({
      end: {
        contentOffset: 10,
        isBreak: true,
        localOffset: 11,
        structureNodeIndex: 2,
      },
      start: {
        contentOffset: 10,
        isBreak: true,
        localOffset: 10,
        structureNodeIndex: 2,
      },
    });
  });
});
