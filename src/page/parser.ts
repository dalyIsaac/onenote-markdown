import { PageContent, PageContentMutable } from "./pageModel";
import { SENTINEL_CONTENT } from "./contentTree/tree";
import { SENTINEL_STRUCTURE } from "./structureTree/tree";
import { chunks, TokenStream, TokenType } from "tiny-html-lexer";
import { EMPTY_TREE_ROOT } from "./tree/tree";

export default class Parser {
  private static page: PageContentMutable;
  private static stream: TokenStream;

  public static parse(content: string): PageContent {
    Parser.resetPage();

    Parser.stream = chunks(content);
    while (!Parser.stream.done) {
      Parser.start();
    }
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
      case "/head": {
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
      default: {
        console.log(Parser.page);
        if (Parser.stream.next().done) {
          return;
        }
        throw new TypeError("Unexpected type");
      }
    }
  }

  private static consumeUpToType(targetType: TokenType): void {
    let [type] = Parser.stream.next().value;
    while (type !== targetType) {
      [type] = Parser.stream.next().value;
    }
  }

  private static html(): void {
    let [type, chunk] = Parser.stream.next().value;
    while (type !== "attribute-name") {
      [type, chunk] = Parser.stream.next().value;
    }

    if (chunk !== "lang") {
      throw new TypeError(
        "Unexpected attribute name. Expected `lang` attribute name.",
      );
    }

    while (type !== "attribute-value-data") {
      [type, chunk] = Parser.stream.next().value;
    }
    Parser.page.language = chunk;
    Parser.consumeUpToType("tag-end");
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
    Parser.consumeUpToType("space");
    let [type, chunk] = Parser.stream.next().value;
    if (type !== "attribute-name") {
      Parser.expectedAttributeNameError();
    }

    if (chunk === "http-equiv") {
      Parser.page.charset = Parser.getMetaInfo().split("=")[1];
    } else if (chunk === "name") {
      Parser.page.created = Parser.getMetaInfo();
    }
    Parser.consumeUpToType("tag-end-autoclose");
  }

  private static getMetaInfo(): string {
    Parser.consumeUpToType("space");

    let [type, chunk] = Parser.stream.next().value;
    if (type !== "attribute-name") {
      Parser.expectedAttributeNameError();
    } else if (chunk !== "content") {
      throw new Error(`Unexpected chunk. Expected \`content\`, got ${chunk}`);
    }

    Parser.consumeUpToType("attribute-value-start");

    [type, chunk] = Parser.stream.next().value;
    return chunk;
  }

  private static expectedAttributeNameError(): void {
    throw new Error("Unexpected type. Expected `attribute-name`");
  }
}
