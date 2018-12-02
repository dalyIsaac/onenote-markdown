import { Color, Node, PageContent } from "../model";
import { leftRotate, rightRotate } from "./rotate";
import { resetSentinel } from "./tree";

export function fixDelete(page: PageContent, xIndex: number): PageContent {
  let wIndex: number;
  let w: Node;
  let x = { ...page.nodes[xIndex] };
  page.nodes[xIndex] = x;
  while (xIndex !== page.root && x.color === Color.Black) {
    if (xIndex === page.nodes[x.parent].left) {
      wIndex = page.nodes[x.parent].right;
      w = { ...page.nodes[wIndex] };
      page.nodes[wIndex] = w;

      if (w.color === Color.Red) {
        w.color = Color.Black;
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Red,
        };
        page = leftRotate(page, x.parent);
        wIndex = page.nodes[x.parent].right;
        w = page.nodes[wIndex];
      }

      if (
        page.nodes[w.left].color === Color.Black &&
        page.nodes[w.right].color === Color.Black
      ) {
        w.color = Color.Red;
        xIndex = x.parent;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      } else {
        if (page.nodes[w.right].color === Color.Black) {
          page.nodes[w.left] = {
            ...page.nodes[w.left],
            color: Color.Black,
          };
          w.color = Color.Red;
          page = rightRotate(page, wIndex);
          wIndex = page.nodes[x.parent].right;
          w = { ...page.nodes[wIndex] };
          page.nodes[wIndex] = w;
        }

        w.color = page.nodes[x.parent].color;
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Black,
        };
        page.nodes[w.right] = {
          ...page.nodes[w.right],
          color: Color.Black,
        };
        page = leftRotate(page, x.parent);
        xIndex = page.root;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      }
    } else {
      wIndex = page.nodes[x.parent].left;
      w = page.nodes[wIndex];

      if (w.color === Color.Red) {
        w.color = Color.Black;
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Red,
        };
        page = rightRotate(page, x.parent);
        wIndex = page.nodes[x.parent].left;
        w = { ...page.nodes[wIndex] };
        page.nodes[wIndex] = w;
      }

      if (
        page.nodes[w.left].color === Color.Black &&
        page.nodes[w.right].color === Color.Black
      ) {
        w.color = Color.Red;
        xIndex = x.parent;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      } else {
        if (page.nodes[w.left].color === Color.Black) {
          page.nodes[w.right] = {
            ...page.nodes[w.right],
            color: Color.Black,
          };
          w.color = Color.Red;
          page = leftRotate(page, wIndex);
          wIndex = page.nodes[x.parent].left;
          w = page.nodes[wIndex];
        }

        w.color = page.nodes[x.parent].color;
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Black,
        };
        page.nodes[w.left] = {
          ...page.nodes[w.left],
          color: Color.Black,
        };
        page = rightRotate(page, x.parent);
        xIndex = page.root;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      }
    }
  }
  x.color = Color.Black;
  resetSentinel();

  return page;
}
