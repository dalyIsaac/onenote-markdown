import { PageContent } from "../pageModel";
import { inorderTreeTraversal } from "../tree/tree";
import { getContentBetweenOffsets } from "../contentTree/tree";
import { StructureNode } from "../structureTree/structureModel";
import { Element, markdownCompiler, getElements } from "./customSyntaxPlugin";

/**
 * Compiles and returns the given HTML content into markdown.
 * @param content The markdown to compile into HTML.
 */
export function compile(content: string): string {
  return markdownCompiler.render(content).trim();
}

/**
 * Returns the HTML content of a `StructureNode` as a string.
 * @param page The page to get the HTML content from.
 */
export function* getHtmlContentFromPage(
  page: PageContent,
): IterableIterator<{ node: StructureNode; content: string }> {
  let startOffset = 0;
  for (const { node } of inorderTreeTraversal(page.structure)) {
    yield {
      content: compile(
        getContentBetweenOffsets(page, startOffset, startOffset + node.length),
      ),
      node,
    };
    startOffset += node.length;
  }
}

/**
 * Iterates over the page, and yields a `StructureNode`, and the associated
 * children. The children are either a string, or contain an object which
 * contains the data needed for markdown styling.
 * @param page The page to get the HTML elements from.
 */
export function* getHtmlContentElementsFromPage(
  page: PageContent,
): IterableIterator<{ node: StructureNode; children: Element[] }> {
  let startOffset = 0;
  for (const { node } of inorderTreeTraversal(page.structure)) {
    const content = getContentBetweenOffsets(
      page,
      startOffset,
      startOffset + node.length,
    );
    const children = getElements(content);
    yield { children, node };
    startOffset += node.length;
  }
}
