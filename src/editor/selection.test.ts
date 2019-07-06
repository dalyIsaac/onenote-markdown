/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import getEditorSelection from "./selection";
import { STRUCTURE_NODE_INDEX } from "./render";

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

  if (checkProperty(show, STRUCTURE_NODE_INDEX)) {
    const structurenodeindex = document.createAttribute(STRUCTURE_NODE_INDEX);
    structurenodeindex.value = "2";
    attributes.setNamedItem(structurenodeindex);
  }

  //   if (checkProperty(show, IS_BREAK)) {
  //     const isbreak = document.createAttribute(IS_BREAK);
  //     isbreak.value = "true";
  //     attributes.setNamedItem(isbreak);
  //   }

  return { attributes };
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

  //   test("selection with elements which have break indicators", (): void => {
  //     shadowRoot.getSelection = jest.fn().mockReturnValue({
  //       anchorNode: createElement(),
  //       anchorOffset: 10,
  //       focusNode: createElement(),
  //       focusOffset: 11,
  //     });
  //     expect(getEditorSelection(shadowRoot)).toEqual({
  //       end: {
  //         isBreak: true,
  //         localOffset: 11,
  //         nodeOffset: 10,
  //         structureNodeIndex: 2,
  //       },
  //       start: {
  //         isBreak: true,
  //         localOffset: 10,
  //         nodeOffset: 10,
  //         structureNodeIndex: 2,
  //       },
  //     });
  //   });

  //   test("selection with elements which don't have break indicators", (): void => {
  //     shadowRoot.getSelection = jest.fn().mockReturnValue({
  //       anchorNode: createElement({ isbreak: false }),
  //       anchorOffset: 10,
  //       focusNode: createElement({ isbreak: false }),
  //       focusOffset: 11,
  //     });
  //     expect(getEditorSelection(shadowRoot)).toEqual({
  //       end: {
  //         isBreak: false,
  //         localOffset: 11,
  //         nodeOffset: 10,
  //         structureNodeIndex: 2,
  //       },
  //       start: {
  //         isBreak: false,
  //         localOffset: 10,
  //         nodeOffset: 10,
  //         structureNodeIndex: 2,
  //       },
  //     });
  //   });

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
      end: {
        // isBreak: true,
        localOffset: 11,
        structureNodeIndex: 2,
      },
      start: {
        // isBreak: true,
        localOffset: 10,
        structureNodeIndex: 2,
      },
    });
  });
});
