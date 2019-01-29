import { PageContent, PageContentMutable } from "./pageModel";
import { SENTINEL_CONTENT, MAX_BUFFER_LENGTH } from "./contentTree/tree";
import { SENTINEL_STRUCTURE } from "./structureTree/tree";
import { chunks, TokenStream, TokenType } from "tiny-html-lexer";
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

export default class Parser {
  private static page: PageContentMutable;
  private static stream: TokenStream;
  private static lastTextNode: InsertStructureProps;
  private static structureNodeOffset = 1;
  private static contentOffset = 0;
  private static markdownStack: string[][] = [];
  private static readonly charRef: Set<TokenType> = new Set([
    "charRef-decimal",
    "charRef-hex",
    "charRef-named",
  ] as TokenType[]);

  public static parse(content: string): PageContent {
    Parser.resetPage();

    Parser.stream = chunks(content);
    while (!Parser.stream.done) {
      Parser.start();
    }
    Parser.page.buffers.forEach((x) => {
      (x as BufferMutable).isReadOnly = true;
    });
    return Parser.page as PageContent;
  }

  private static resetPage(): void {
    Parser.page = {
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
  }

  private static start(): void {
    let [, chunk] = Parser.stream.next().value;

    const tag = chunk.slice(1);
    switch (tag) {
      case "html": {
        Parser.html();
        break;
      }
      case "/html":
      case "head":
      case "/head":
      case "/body": {
        Parser.consumeUpToType("tag-end");
        break;
      }
      case "title": {
        Parser.title();
        break;
      }
      case "meta": {
        Parser.meta();
        break;
      }
      case "body": {
        Parser.body();
        break;
      }
      case "p": {
        Parser.text("p");
        break;
      }
      default: {
        if (Parser.stream.next().done) {
          return;
        }
        throw new TypeError("Unexpected type");
      }
    }
  }

  private static consumeUpToType(...targetTypes: TokenType[]): TokenType {
    let [type] = Parser.stream.next().value;
    const target = new Set(targetTypes);
    while (!target.has(type)) {
      [type] = Parser.stream.next().value;
    }
    return type;
  }

  private static getNextAttribute(key: string): { key: string; value: string } {
    Parser.consumeUpToType("attribute-value-start");
    const [, value] = Parser.stream.next().value;
    Parser.consumeUpToType("attribute-value-end");
    return { key, value };
  }

  private static getAttributeName(
    name: string,
    isStyleProperty = false,
  ): string {
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

  private static getStyle(text: string): KeyValueStr {
    return text
      .split(";")
      .reduce((acc: KeyValueStr, curr: string): KeyValueStr => {
        const [key, value] = curr.split(":");
        acc[Parser.getAttributeName(key, true)] = value;
        return acc;
      }, {});
  }

  private static getAttributes(): Attributes {
    const attributes: Attributes = {};
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const terminatingType = Parser.consumeUpToType(
        "space",
        "tag-end",
        "tag-end-autoclose",
      );
      if (terminatingType === "space") {
        const [type, chunk] = Parser.stream.next().value;
        if (type === "tag-end" || type === "tag-end-autoclose") {
          return attributes;
        }
        attributes[chunk] = Parser.getNextAttribute(chunk).value;
      } else {
        return attributes;
      }
    }
  }

  private static html(): void {
    const attributes = this.getAttributes();
    if (attributes.lang) {
      Parser.page.language = attributes.lang as string;
    }
  }

  private static title(): void {
    Parser.consumeUpToType("tag-end");
    let [type, chunk] = Parser.stream.next().value;

    if (type !== "rcdata") {
      throw new TypeError("Expected `rcdata` type.");
    }

    Parser.page.title = chunk;
    Parser.consumeUpToType("tag-end");
  }

  private static meta(): void {
    const attributes = Parser.getAttributes();
    if (attributes["http-equiv"] === "Content-Type" && attributes["content"]) {
      Parser.page.charset = (attributes["content"] as string).split("=")[1];
    } else if (attributes["name"] === "created" && attributes["content"]) {
      Parser.page.created = attributes["content"] as string;
    }
  }

  private static body(): void {
    const attributes = Parser.getAttributes();
    if (attributes["data-absolute-enabled"]) {
      Parser.page.dataAbsoluteEnabled = Boolean(
        attributes["data-absolute-enabled"],
      );
    }
    if (attributes["style"]) {
      Parser.page.defaultStyle = Parser.getStyle(attributes["style"]);
    }
  }

  private static text(tag: string): void {
    const { id, style: styleStr, ...attributes } = Parser.getAttributes();
    Parser.lastTextNode = {
      id,
      length: 0,
      offset: 0,
      tag,
      tagType: TagType.StartTag,
    };

    if (styleStr) {
      Parser.lastTextNode.style = Parser.getStyle(styleStr);
    }
    if (Object.keys(attributes).length > 0) {
      const renamedKeyAttributes: KeyValueStr = {};
      for (const key in attributes) {
        renamedKeyAttributes[Parser.getAttributeName(key)] = attributes[key];
      }
      Parser.lastTextNode.attributes = renamedKeyAttributes;
    }
    Parser.textBody(tag);
  }

  private static textBody(tag: string): void {
    let [type, chunk] = Parser.stream.next().value;
    let content = "";
    while (!(type === "endTag-start" && chunk.slice(2) === tag)) {
      if (type === "data") {
        content += chunk;
      } else if (Parser.charRef.has(type)) {
        const charRefContent = he.decode(chunk);
        content += charRefContent;
      } else if (type === "startTag-start" && chunk === "<span") {
        content += Parser.span();
      } else if (type === "endTag-start" && chunk === "</span") {
        content += Parser.spanEnd();
      }
      [type, chunk] = Parser.stream.next().value;
    }

    Parser.lastTextNode.length = content.length;
    insertStructureNode(Parser.page, Parser.lastTextNode);
    Parser.structureNodeOffset += 1;
    insertStructureNode(Parser.page, {
      id: Parser.lastTextNode.id,
      length: 0,
      offset: Parser.structureNodeOffset,
      tag: Parser.lastTextNode.tag,
      tagType: TagType.EndTag,
    });
    Parser.structureNodeOffset += 1;

    insertContent(
      Parser.page,
      { content, offset: Parser.contentOffset },
      MAX_BUFFER_LENGTH,
    );
    Parser.contentOffset += content.length;
    Parser.consumeUpToType("tag-end");
  }

  private static span(): string {
    const style = Parser.getStyle(Parser.getAttributes().style);
    const markdown: string[] = [];
    if (style.fontStyle === "italic") {
      markdown.push("_");
    }
    if (style.fontWeight === "bold") {
      markdown.push("**");
    }
    if (style.textDecoration === "underline") {
      markdown.push("{text-decoration:underline}");
    }
    Parser.markdownStack.push(markdown);
    return markdown.join();
  }

  private static spanEnd(): string {
    Parser.consumeUpToType("tag-end");
    const forwardsContent = Parser.markdownStack.pop()!;
    return forwardsContent.reduce((acc, curr) => {
      return curr + acc;
    }, "");
  }
}
