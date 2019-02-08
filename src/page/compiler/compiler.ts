import MarkdownIt from "markdown-it";
import { customSyntaxPlugin } from "./customSyntaxPlugin";
import { PageContent } from "../pageModel";
import { inorderTreeTraversal } from "../tree/tree";
import { getContentBetweenOffsets } from "../contentTree/tree";

const md = new MarkdownIt("commonmark").use(customSyntaxPlugin);

export function* getMarkdownFromPage(
  page: PageContent,
): IterableIterator<string> {
  let startOffset = 0;
  for (const { node } of inorderTreeTraversal(page.structure)) {
    yield getContentBetweenOffsets(
      page,
      startOffset,
      startOffset + node.length,
    );
    startOffset += node.length;
  }
}

export function compile(content: string): string {
  return md.render(content).trim();
}
