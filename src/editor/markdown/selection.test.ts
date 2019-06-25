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

const createElement = (includeBreak = true) => {
  const attributes = new NamedNodeMapMock();

  const contentoffset = document.createAttribute(CONTENT_OFFSET);
  contentoffset.value = "10";
  attributes.setNamedItem(contentoffset);

  const structurenodeindex = document.createAttribute(STRUCTURE_NODE_INDEX);
  structurenodeindex.value = "2";
  attributes.setNamedItem(structurenodeindex);

  if (includeBreak) {
    const isbreak = document.createAttribute(IS_BREAK);
    isbreak.value = "true";
    attributes.setNamedItem(isbreak);
  }

  return { attributes };
};

describe("markdown selection", () => {
  test("empty selection", () => {
    window.getSelection = jest.fn().mockReturnValue(null);
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with null anchorNode", () => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: null,
      focusNode: null,
    });
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with null focusNode", () => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement(),
      focusNode: null,
    });
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with elements which have break indicators", () => {
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

  test("selection with elements which don't have break indicators", () => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: createElement(false),
      anchorOffset: 10,
      focusNode: createElement(false),
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

  test("selection with no parent nodes", () => {
    window.getSelection = jest.fn().mockReturnValue({
      anchorNode: { parentElement: null },
      anchorOffset: 10,
      focusNode: { parentElement: null },
      focusOffset: 11,
    });
    expect(getEditorSelection()).toEqual(null);
  });

  test("selection with nodes", () => {
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
