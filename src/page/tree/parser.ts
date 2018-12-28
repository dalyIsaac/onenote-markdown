import { chunks, TokenizeResult, tokens } from "tiny-html-lexer";
import { NodeMutable, PageContent, PageContentMutable } from "../model";
import { getNewlineFormat } from "./tree";

const STYLE = "style";

export default class Parser {
  private tags = {
    html: "html",
    head: "head",
    title: "title",
    meta: "meta",
    body: "body",
  };

  private page: PageContentMutable;
  private stream: TokenizeResult;
  private content: string;
  private lastAttribute = "";
  private metaFirstAttribute = "";
  private node: NodeMutable;
  private tagStack: string[] = [];
  private currentTag = "";

  constructor(content: string) {
    this.content = content;
    this.page = {
      buffers: [],
      newlineFormat: getNewlineFormat(content),
      nodes: [],
      root: -1,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    this.stream = chunks(this.content);
  }

  public parse(): PageContent {
    for (const [type, chunk] of this.stream) {
      this.currentTag = this.tagStack[this.tagStack.length - 1];
      switch (type) {
        case tokens.T_startTag_start:
          this.startTagStart(chunk);
          break;
        case tokens.T_endTag_start:
          if (this.currentTag === chunk.slice(2)) {
            this.endTag();
          }
          break;
        case tokens.T_tag_end_close:
          this.endTag();
          break;
        case tokens.T_att_name:
          this.attributeName(chunk);
          break;
        case tokens.T_att_value_data:
          this.attributeValue(chunk);
          break;
        case tokens.T_rcdata:
          if (this.currentTag === this.tags.title) {
            this.page.title = chunk;
          } else {
            console.log({ type, chunk });
          }
          break;
        case tokens.T_tag_end:
          if (!this.tags.hasOwnProperty(this.currentTag)) {
            console.log({ type, chunk });
          }
          break;
        case tokens.T_data:
          if (!this.tags.hasOwnProperty(this.currentTag)) {
            console.log({ type, chunk });
          }
          break;
        case tokens.T_space:
        case tokens.T_att_value_start:
        case tokens.T_att_equals:
        case tokens.T_att_value_end:
          break;
        default:
          console.log({ type, chunk });
          break;
      }
    }

    console.log("\n\nPage: ");
    for (const key in this.page) {
      if (this.page.hasOwnProperty(key)) {
        const element = this.page[key];
        console.log({ [key]: element });
      }
    }
  }

  private startTagStart(chunk: string): void {
    this.currentTag = chunk.slice(1);
    this.tagStack.push(this.currentTag);
    if (this.currentTag === this.tags.meta) {
      this.metaFirstAttribute = "";
    }
    if (!this.tags.hasOwnProperty(this.currentTag)) {
      console.log({ lastTag: this.currentTag });
    }
  }

  private endTag(): void {
    this.tagStack.pop();
    this.lastAttribute = "";
    this.metaFirstAttribute = "";
  }

  private attributeName(chunk: string): void {
    if (this.currentTag === this.tags.meta && !this.metaFirstAttribute) {
      this.metaFirstAttribute = this.lastAttribute;
    }
    this.lastAttribute = chunk;
    if (!this.tags.hasOwnProperty(this.currentTag)) {
      console.log({ lastAttribute: this.lastAttribute });
    }
  }

  private attributeValue(chunk: string): void {
    switch (this.currentTag) {
      case this.tags.html:
        if (this.lastAttribute === "lang") {
          this.page.language = chunk;
        }
        break;
      case this.tags.meta:
        if (this.lastAttribute === "content") {
          if (this.metaFirstAttribute === "http-equiv") {
            this.page.charset = chunk.split("=").pop();
          } else if (this.metaFirstAttribute === "name") {
            this.page.created = chunk;
          }
        }
        break;
      case this.tags.body:
        if (this.lastAttribute === STYLE) {
          const items = chunk.split(";");
          const properties: { [key: string]: string } = items.reduce(
            (acc: { [key: string]: string }, curr: string) => {
              const [key, value] = curr.split(":");
              acc[key] = value;
              return acc;
            },
            {},
          );
          this.page.fontFamily = properties["font-family"];
          this.page.fontSize = properties["font-size"];
        }
        break;
      default:
        console.log({ type: "attribute-value", chunk });
        break;
    }
  }
}
