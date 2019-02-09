import MarkdownIt from "markdown-it";
import customSyntaxPlugin from "./customSyntaxPlugin";
import { PageContent } from "../pageModel";
import { inorderTreeTraversal } from "../tree/tree";
import { getContentBetweenOffsets } from "../contentTree/tree";
import { StructureNode } from "../structureTree/structureModel";

const md = new MarkdownIt("commonmark").use(customSyntaxPlugin);

export function* getHtmlContentFromPage(
  page: PageContent,
): IterableIterator<{ node: StructureNode; content: string }> {
  let startOffset = 0;
  for (const { node } of inorderTreeTraversal(page.structure)) {
    const content = getContentBetweenOffsets(
      page,
      startOffset,
      startOffset + node.length,
    );
    yield { content, node };
    startOffset += node.length;
  }
}

export function compile(content: string): string {
  return md.render(content).trim();
}
