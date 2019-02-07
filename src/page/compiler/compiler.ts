import MarkdownIt from "markdown-it";
import { customSyntaxPlugin } from "./customSyntaxPlugin";

const md = new MarkdownIt("commonmark").use(customSyntaxPlugin);

export function compile(content: string): string {
  return md.render(content).trim();
}
