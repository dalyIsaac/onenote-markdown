import { PageContent, PageContentMutable } from "./pageModel";
import { SENTINEL_CONTENT } from "./contentTree/tree";
import { SENTINEL_STRUCTURE } from "./structureTree/tree";
import { chunks } from "tiny-html-lexer";
import { KeyValuePair } from "@microsoft/microsoft-graph-types";

export default class Parser {
  private static page: PageContentMutable;
  private static tags: Array<{ tag: string; id?: string }> = [];
  private static attributes: KeyValuePair[] = [];

  public static parse(content: string): PageContent {
    Parser.resetPage();

    const stream = chunks(content);
    for (const [type, chunk] of stream) {
      switch (type) {
        case "startTag-start": {
          Parser.startTagStart(chunk);
          break;
        }
        case "endTag-start": {
          Parser.endTagStart(chunk);
          break;
        }
        case "tag-end-autoclose": {
          Parser.autoCloseTag();
          break;
        }
        case "attribute-name": {
          Parser.attributeName(chunk);
          break;
        }
        case "attribute-value-data": {
          Parser.attributeData(chunk);
          break;
        }
        case "rcdata": {
          Parser.rcData(chunk);
          break;
        }
        case "attribute-assign":
        case "attribute-value-start":
        case "attribute-value-end":
        case "tag-end":
        case "space":
          break;
        default: {
          console.log({ chunk, type });
          break;
        }
      }
    }
    return Parser.page as PageContent;
  }

  private static resetPage(): void {
    Parser.page = {
      buffers: [],
      content: {
        nodes: [SENTINEL_CONTENT],
        root: -1,
      },
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [SENTINEL_STRUCTURE],
        root: -1,
      },
    };
  }

  private static startTagStart(chunk: string): void {
    Parser.tags.push({ tag: chunk.slice(1) });
  }

  private static endTagStart(chunk: string): void {
    const tag = chunk.slice(2);
    if (Parser.tags[Parser.tags.length - 1].tag === tag) {
      Parser.tags.pop();
    } else {
      throw new Error("Unexpected tag");
    }
  }

  private static autoCloseTag(): void {
    Parser.tags.pop();
  }

  private static attributeName(chunk: string): void {
    Parser.attributes.push({ name: chunk });
  }

  private static attributeData(chunk: string): void {
    if (
      Parser.attributes[Parser.attributes.length - 1].name === "lang" &&
      Parser.tags[Parser.tags.length - 1].tag === "html"
    ) {
      Parser.page.language = chunk;
    } else if (Parser.metaAttributes(chunk)) {
      return;
    } else {
      Parser.attributes[Parser.attributes.length - 1].value = chunk;
    }
  }

  private static metaAttributes(chunk: string): boolean {
    if (
      Parser.attributes.length < 2 ||
      Parser.tags[Parser.tags.length - 1].tag !== "meta"
    ) {
      return false;
    }

    const prevAttr = Parser.attributes[Parser.attributes.length - 2];
    if (prevAttr.name === "http-equiv" && prevAttr.value === "Content-Type") {
      // charset
      Parser.page.charset = chunk.split(";")[1].trim();
      Parser.attributes.pop();
      Parser.attributes.pop();
      return true;
    } else if (prevAttr.name === "name" && prevAttr.value === "created") {
      Parser.page.created = chunk;
      return true;
    }
    return false;
  }

  private static rcData(chunk: string): void {
    if (Parser.tags[Parser.tags.length - 1].tag === "title") {
      Parser.page.title = chunk;
    } else {
      throw new Error("Unknown tag");
    }
  }
}
