import tinyhtml from "tiny-html-lexer";
import { NodeMutable, PageContentMutable } from "../model";
import { getNewlineFormat } from "./tree";

const tags = {
  html: "html",
  head: "head",
  title: "title",
  meta: "meta",
};

export default function parser(content: string): void {
  const page: PageContentMutable = {
    buffers: [],
    newlineFormat: getNewlineFormat(content),
    nodes: [],
    root: -1,
    previouslyInsertedNodeIndex: null,
    previouslyInsertedNodeOffset: null,
  };

  const stream = tinyhtml.chunks(content);

  let lastAttribute = "";
  let metaFirstAttribute = "";
  let node: NodeMutable = {};
  const tagStack: string[] = [];

  for (const [type, chunk] of stream) {
    let currentTag = tagStack[tagStack.length - 1];
    switch (type) {
      case tinyhtml.tokens.T_startTag_start:
        currentTag = chunk.slice(1);
        tagStack.push(currentTag);
        if (currentTag === tags.meta) {
          metaFirstAttribute = "";
        }
        if (!tags.hasOwnProperty(currentTag)) {
          console.log({ lastTag: currentTag });
        }
        break;
      case tinyhtml.tokens.T_endTag_start:
        if (currentTag === chunk.slice(2)) {
          tagStack.pop();
          lastAttribute = "";
          metaFirstAttribute = "";
        }
        break;
      case tinyhtml.tokens.T_tag_end_close:
        tagStack.pop();
        lastAttribute = "";
        metaFirstAttribute = "";
        break;
      case tinyhtml.tokens.T_att_name:
        if (currentTag === tags.meta && !metaFirstAttribute) {
          metaFirstAttribute = lastAttribute;
        }
        lastAttribute = chunk;
        if (currentTag !== tags.html && currentTag !== tags.meta) {
          console.log({ lastAttribute });
        }
        break;
      case tinyhtml.tokens.T_att_value_data:
        if (currentTag === tags.html && lastAttribute === "lang") {
          page.language = chunk;
        } else if (currentTag === tags.meta && lastAttribute === "content") {
          if (metaFirstAttribute === "http-equiv") {
            page.charset = chunk.split("=").pop();
          } else if (metaFirstAttribute === "name") {
            page.created = chunk;
          }
        } else if (currentTag !== tags.html && currentTag !== tags.meta) {
          console.log({ type, chunk });
        }
        break;
      case tinyhtml.tokens.T_rcdata:
        if (currentTag === tags.title) {
          page.title = chunk;
        } else {
          console.log({ type, chunk });
        }
        break;
      case tinyhtml.tokens.T_tag_end:
        if (!tags.hasOwnProperty(currentTag)) {
          console.log({ type, chunk });
        }
        break;
      case tinyhtml.tokens.T_data:
        if (!tags.hasOwnProperty(currentTag)) {
          console.log({ type, chunk });
        }
        break;
      case tinyhtml.tokens.T_space:
      case tinyhtml.tokens.T_att_value_start:
      case tinyhtml.tokens.T_att_equals:
      case tinyhtml.tokens.T_att_value_end:
        break;
      default:
        console.log({ type, chunk });
        break;
    }
  }

  console.log("\n\nPage: ");
  for (const key in page) {
    if (page.hasOwnProperty(key)) {
      const element = page[key];
      console.log({ [key]: element });
    }
  }
}
