/* eslint-disable @typescript-eslint/camelcase */
import { PageContent } from "../pageModel";
import { inorderTreeTraversal } from "../tree/tree";
import { getContentBetweenOffsets } from "../contentTree/tree";
import { StructureNode } from "../structureTree/structureModel";
import MarkdownIt from "markdown-it";
import {
  Element,
  getElements,
  colorRenderer,
  textDecorationRenderer,
  backgroundColorRenderer,
  supRenderer,
  subRenderer,
  strong_open,
  strong_close,
  em_open,
  em_close,
  paragraph_open,
  paragraph_close,
  heading_open,
  heading_close,
  text,
} from "./renderers";
import { rule } from "./parser";

/**
 * markdown-it extension for the custom syntax.
 */
function customSyntaxPlugin(md: MarkdownIt): void {
  md.renderer.rules.color = colorRenderer;
  md.renderer.rules.textDecoration = textDecorationRenderer;
  md.renderer.rules.backgroundColor = backgroundColorRenderer;
  md.renderer.rules.sup = supRenderer;
  md.renderer.rules.sub = subRenderer;
  md.renderer.rules.strong_open = strong_open;
  md.renderer.rules.strong_close = strong_close;
  md.renderer.rules.em_open = em_open;
  md.renderer.rules.em_close = em_close;
  md.renderer.rules.paragraph_open = paragraph_open;
  md.renderer.rules.paragraph_close = paragraph_close;
  md.renderer.rules.heading_open = heading_open;
  md.renderer.rules.heading_close = heading_close;
  md.renderer.rules.text = text;
  md.core.ruler.push("customSyntaxRule", rule);
}

/**
 * markdown-it instance.
 */
export const markdownCompiler = new MarkdownIt("commonmark").use(
  customSyntaxPlugin,
);

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
