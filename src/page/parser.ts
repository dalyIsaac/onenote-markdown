import { PageContent, PageContentMutable } from "./pageModel";
import { SENTINEL_CONTENT, MAX_BUFFER_LENGTH } from "./contentTree/tree";
import { SENTINEL_STRUCTURE } from "./structureTree/tree";
import { chunks, TokenType } from "tiny-html-lexer";
import { EMPTY_TREE_ROOT } from "./tree/tree";
import { KeyValueStr, TagType } from "./structureTree/structureModel";
import { InsertStructureProps } from "./structureTree/actions";
import he from "he";
import { insertContent } from "./contentTree/insert";
import { insertStructureNode } from "./structureTree/insert";
import { BufferMutable } from "./contentTree/contentModel";

interface Attributes {
  [key: string]: string;
}

export default function parse(content: string): PageContent {
  const page: PageContentMutable = {
    buffers: [],
    content: {
      nodes: [SENTINEL_CONTENT],
      root: EMPTY_TREE_ROOT,
    },
    previouslyInsertedContentNodeIndex: null,
    previouslyInsertedContentNodeOffset: null,
    structure: {
      nodes: [SENTINEL_STRUCTURE],
      root: EMPTY_TREE_ROOT,
    },
  };
  const stream = chunks(content);
  let lastTextNode: InsertStructureProps;
  let structureNodeOffset = 1;
  let contentOffset = 0;
  let markdownStack: string[][] = [];
  const charRef: Set<TokenType> = new Set([
    "charRef-decimal",
    "charRef-hex",
    "charRef-named",
  ] as TokenType[]);
  const tags: KeyValueStr = {
    cite: "{<cite}",
    h1: "# ",
    h2: "## ",
    h3: "### ",
    h4: "#### ",
    h5: "##### ",
    h6: "###### ",
    sub: "{<sub}",
    sup: "{<sup}",
  };

  function consumeUpToType(...targetTypes: TokenType[]): TokenType {
    let [type] = stream.next().value;
    const target = new Set(targetTypes);
    while (!target.has(type)) {
      [type] = stream.next().value;
    }
    return type;
  }

  function getNextAttribute(key: string): { key: string; value: string } {
    consumeUpToType("attribute-value-start");
    const [, value] = stream.next().value;
    consumeUpToType("attribute-value-end");
    return { key, value };
  }

  function getAttributeName(name: string, isStyleProperty = false): string {
    const newName = name.split("-").reduce((acc: string, curr: string) => {
      if (isStyleProperty) {
        if (acc) {
          acc += curr[0].toUpperCase() + curr.slice(1);
        } else {
          acc = curr;
        }
        return acc;
      } else {
        return acc + curr;
      }
    }, "");
    return newName;
  }

  function getStyle(text: string): KeyValueStr {
    return text
      .split(";")
      .reduce((acc: KeyValueStr, curr: string): KeyValueStr => {
        const [key, value] = curr.split(":");
        acc[getAttributeName(key, true)] = value;
        return acc;
      }, {});
  }

  function getAttributes(): Attributes {
    const attributes: Attributes = {};
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const terminatingType = consumeUpToType(
        "space",
        "tag-end",
        "tag-end-autoclose",
      );
      if (terminatingType === "space") {
        const [type, chunk] = stream.next().value;
        if (type === "tag-end" || type === "tag-end-autoclose") {
          return attributes;
        }
        attributes[chunk] = getNextAttribute(chunk).value;
      } else {
        return attributes;
      }
    }
  }

  function html(): void {
    const attributes = getAttributes();
    if (attributes.lang) {
      page.language = attributes.lang as string;
    }
  }

  function title(): void {
    consumeUpToType("tag-end");
    let [type, chunk] = stream.next().value;

    if (type !== "rcdata") {
      throw new TypeError("Expected `rcdata` type.");
    }

    page.title = chunk;
    consumeUpToType("tag-end");
  }

  function meta(): void {
    const attributes = getAttributes();
    if (attributes["http-equiv"] === "Content-Type" && attributes["content"]) {
      page.charset = (attributes["content"] as string).split("=")[1];
    } else if (attributes["name"] === "created" && attributes["content"]) {
      page.created = attributes["content"] as string;
    }
  }

  function body(): void {
    const attributes = getAttributes();
    if (attributes["data-absolute-enabled"]) {
      page.dataAbsoluteEnabled = Boolean(attributes["data-absolute-enabled"]);
    }
    if (attributes["style"]) {
      page.defaultStyle = getStyle(attributes["style"]);
    }
  }

  function span(): string {
    const style = getStyle(getAttributes().style);
    const markdown: string[] = [];
    if (style.fontWeight === "bold") {
      markdown.push("**");
    }
    if (style.fontStyle === "italic") {
      markdown.push("_");
    }
    if (style.textDecoration) {
      markdown.push(`{text-decoration:${style.textDecoration}}`);
    }
    if (style.backgroundColor) {
      markdown.push(`{background-color:${style.backgroundColor}}`);
    }
    if (style.color) {
      markdown.push(`{color:${style.color}}`);
    }
    markdownStack.push(markdown);
    return markdown.join("");
  }

  function spanEnd(): string {
    consumeUpToType("tag-end");
    const forwardsContent = markdownStack.pop()!;
    return forwardsContent.reduce((acc, curr) => {
      return curr + acc;
    }, "");
  }

  function textBody(tag: string): void {
    let [type, chunk] = stream.next().value;
    let content = "";

    if (tags[tag]) {
      content += tags[tag];
    }

    while (!(type === "endTag-start" && chunk.slice(2) === tag)) {
      if (type === "data") {
        content += chunk;
      } else if (charRef.has(type)) {
        const charRefContent = he.decode(chunk);
        content += charRefContent;
      } else if (type === "startTag-start") {
        switch (chunk) {
          case "<span":
            content += span();
            break;
          case "<sub":
          case "<sup":
            content += chunk + ">";
            break;
          default:
            break;
        }
      } else if (type === "endTag-start") {
        switch (chunk) {
          case "</span":
            content += spanEnd();
            break;
          case "</sub":
          case "</sup":
            content += chunk + ">";
            break;
          default:
            break;
        }
      }
      [type, chunk] = stream.next().value;
    }

    lastTextNode.length = content.length;
    insertStructureNode(page, { ...lastTextNode, offset: structureNodeOffset });
    structureNodeOffset += 1;
    insertStructureNode(page, {
      id: lastTextNode.id,
      length: 0,
      offset: structureNodeOffset,
      tag: lastTextNode.tag,
      tagType: TagType.EndTag,
    });
    structureNodeOffset += 1;

    insertContent(page, { content, offset: contentOffset }, MAX_BUFFER_LENGTH);
    contentOffset += content.length;
    consumeUpToType("tag-end");
  }

  function text(tag: string): void {
    const { id, style: styleStr, ...attributes } = getAttributes();
    lastTextNode = {
      id,
      length: 0,
      offset: 0,
      tag,
      tagType: TagType.StartTag,
    };
    if (styleStr) {
      lastTextNode.style = getStyle(styleStr);
    }
    if (Object.keys(attributes).length > 0) {
      const renamedKeyAttributes: KeyValueStr = {};
      for (const key in attributes) {
        renamedKeyAttributes[getAttributeName(key)] = attributes[key];
      }
      lastTextNode.attributes = renamedKeyAttributes;
    }
    textBody(tag);
  }

  function start(): void {
    let [, chunk] = stream.next().value;

    const tag = chunk.slice(1);
    switch (tag) {
      case "html": {
        html();
        break;
      }
      case "/html":
      case "head":
      case "/head":
      case "/body": {
        consumeUpToType("tag-end");
        break;
      }
      case "title": {
        title();
        break;
      }
      case "meta": {
        meta();
        break;
      }
      case "body": {
        body();
        break;
      }
      case "p":
      case "cite":
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        text(tag);
        break;
      }

      default: {
        if (stream.next().done) {
          return;
        }
        throw new TypeError("Unexpected type");
      }
    }
  }

  while (!stream.done) {
    start();
  }
  page.buffers.forEach((x) => {
    (x as BufferMutable).isReadOnly = true;
  });
  return page as PageContent;
}
