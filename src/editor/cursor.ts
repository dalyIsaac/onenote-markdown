import React from "react";
import { StructureNode } from "../page/structureTree/structureModel";

interface CursorBoundary {
  globalOffset: number | null;
  localOffset: number | null;
  ref: React.RefObject<unknown> | null;
}

interface FirstChild {
  node: ChildNode;
  localOffset: number;
}

export class Cursor {
  public start: CursorBoundary | null = null;

  public end: CursorBoundary | null = null;

  public setStartOffset(globalOffset: number | null): Cursor {
    this.start = { globalOffset, localOffset: null, ref: null };
    this.end = null;
    return this;
  }

  public setEndOffset(globalOffset: number | null): Cursor {
    this.end = { globalOffset, localOffset: null, ref: null };
    return this;
  }

  public getStartFirstChild(): FirstChild | null {
    if (!!this.start && !!this.start.ref && !!this.start.localOffset) {
      const node = (this.start.ref.current as HTMLSpanElement).firstChild;
      if (node !== null) {
        return { localOffset: this.start.localOffset, node };
      }
    }
    return null;
  }

  public getEndFirstChild(): FirstChild | null {
    if (!!this.end && !!this.end.ref && !!this.end.localOffset) {
      const node = (this.end.ref.current as HTMLSpanElement).firstChild;
      if (node !== null) {
        return { localOffset: this.end.localOffset, node };
      }
    }
    return null;
  }

  public createRef(
    node: StructureNode,
    contentOffset: number,
  ): React.RefObject<unknown> | null {
    if (
      !!this.start &&
      !!this.start.globalOffset &&
      contentOffset < this.start.globalOffset
    ) {
      this.start.ref = React.createRef();
      this.start.localOffset = this.start.globalOffset - contentOffset;
      return this.start.ref;
    } else if (
      !!this.end &&
      !!this.end.globalOffset &&
      this.end.globalOffset < contentOffset + node.length
    ) {
      if (this.end.ref === null) {
        this.end.ref = React.createRef();
        this.end.localOffset =
          this.end.globalOffset - contentOffset - node.length;
      }
      return this.end.ref;
    }
    return null;
  }
}
