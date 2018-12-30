import { chunks, TokenizeResult, tokens } from "tiny-html-lexer";
import { KeyValue } from "../../common";
import {
  NodeMutable,
  PageContent,
  PageContentMutable,
  BufferMutable,
} from "../model";
import { getNewlineFormat, MAX_BUFFER_LENGTH, SENTINEL } from "./tree";
// tslint:disable-next-line:ordered-imports
import {
  ContentInsert,
  createNodeCreateBuffer,
  createNodeAppendToBuffer,
  insertNode,
} from "./insert";

const STYLE = "style";

export default class Parser {
  /**
   * Tags which reside inside the body of the HTML content.
   */
  private bodyTags = {
    span: "span",
  };

  /**
   * Tags which do not reside inside the body of the HTML content.
   */
  private exteriorTags = {
    html: "html",
    head: "head",
    title: "title",
    meta: "meta",
    body: "body",
    span: "span",
  };

  private page: PageContentMutable;
  private stream: TokenizeResult;
  private content: string;
  private lastAttribute = "";
  private metaFirstAttribute = "";
  private node: NodeMutable = {};
  private tagStack: string[] = [];
  private length = 0;
  private writtenTo = false;

  constructor(content: string) {
    this.content = content;
    this.page = {
      buffers: [],
      newlineFormat: getNewlineFormat(content),
      nodes: [SENTINEL],
      root: -1,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    this.stream = chunks(this.content);
  }

  public parse(): PageContent {
    if (this.writtenTo) {
      return this.page as PageContent;
    }
    for (const [type, chunk] of this.stream) {
      this.node.tag = this.tagStack[this.tagStack.length - 1];
      switch (type) {
        case tokens.T_startTag_start:
          this.startTagStart(chunk);
          break;
        case tokens.T_endTag_start:
          if (this.node.tag === chunk.slice(2)) {
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
          if (this.node.tag === this.exteriorTags.title) {
            this.page.title = chunk;
          } else {
            console.log({ type, chunk });
          }
          break;
        case tokens.T_tag_end:
          if (
            !this.exteriorTags.hasOwnProperty(this.node.tag) &&
            this.bodyTags.hasOwnProperty(this.node.tag)
          ) {
            console.log({ type, chunk });
          }
          break;
        case tokens.T_data:
          this.data(chunk);
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
    return this.page as PageContent;
  }

  private startTagStart(chunk: string): void {
    this.node.tag = chunk.slice(1);
    this.tagStack.push(this.node.tag);
    if (this.node.tag === this.exteriorTags.meta) {
      this.metaFirstAttribute = "";
    }
    if (
      !this.exteriorTags.hasOwnProperty(this.node.tag) &&
      this.bodyTags.hasOwnProperty(this.node.tag)
    ) {
      console.log({ lastTag: this.node.tag });
    }
  }

  private endTag(): void {
    const currentTag = this.tagStack.pop();
    this.lastAttribute = "";
    this.metaFirstAttribute = "";

    if (
      currentTag &&
      this.bodyTags.hasOwnProperty(currentTag) &&
      this.node.tag
    ) {
      insertNode(
        this.page,
        {
          tag: currentTag,
          parent: 0,
          left: 0,
          right: 0,
        },
        this.length,
      );
    }
  }

  private attributeName(chunk: string): void {
    if (this.node.tag === this.exteriorTags.meta && !this.metaFirstAttribute) {
      this.metaFirstAttribute = this.lastAttribute;
    }
    this.lastAttribute = chunk;
    if (
      !this.exteriorTags.hasOwnProperty(this.node.tag as string) &&
      this.bodyTags.hasOwnProperty(this.node.tag as string)
    ) {
      console.log({ lastAttribute: this.lastAttribute });
    }
  }

  private attributeValue(chunk: string): void {
    switch (this.node.tag) {
      case this.exteriorTags.html:
        if (this.lastAttribute === "lang") {
          this.page.language = chunk;
        }
        break;
      case this.exteriorTags.meta:
        if (this.lastAttribute === "content") {
          if (this.metaFirstAttribute === "http-equiv") {
            this.page.charset = chunk.split("=").pop();
          } else if (this.metaFirstAttribute === "name") {
            this.page.created = chunk;
          }
        }
        break;
      case this.exteriorTags.body:
        if (this.lastAttribute === STYLE) {
          const items = chunk.split(";");
          const attributes: KeyValue = items.reduce(
            (acc: KeyValue, curr: string) => {
              const [key, value] = curr.split(":");
              acc[key] = value;
              return acc;
            },
            {},
          );
          this.page.fontFamily = attributes["font-family"];
          this.page.fontSize = attributes["font-size"];
        }
        break;
      default:
        if (this.lastAttribute === STYLE) {
          this.node.styles = chunk
            .split(";")
            .reduce((acc: KeyValue, curr: string) => {
              const [key, value] = curr.trim().split(":");
              acc[this.getAttributeName(key)] = value;
              return acc;
            }, {});
        } else {
          if (!this.node.properties) {
            this.node.properties = {};
          }
          this.node.properties[
            this.getAttributeName(this.lastAttribute)
          ] = chunk;
        }
        break;
    }
  }

  private data(chunk: string): void {
    if (
      this.bodyTags.hasOwnProperty(this.node.tag as string) &&
      this.tagStack[this.tagStack.length - 1] === this.node.tag
    ) {
      const contentInsert: ContentInsert = {
        content: chunk,
        offset: this.length,
      };
      this.length += chunk.length;
      if (
        this.page.buffers.length === 0 ||
        this.page.buffers[this.page.buffers.length - 1].content.length >=
          MAX_BUFFER_LENGTH
      ) {
        createNodeCreateBuffer(contentInsert, this.page, this.node);
      } else {
        createNodeAppendToBuffer(contentInsert, this.page, this.node);
      }
      (this.page.buffers[
        this.page.buffers.length - 1
      ] as BufferMutable).isReadOnly = true;
    } else {
      const t = this.tagStack[this.tagStack.length - 1];
      if (
        !this.bodyTags.hasOwnProperty(t) &&
        !this.exteriorTags.hasOwnProperty(t)
      ) {
        console.log({
          type: "data",
          chunk,
          tag: this.tagStack[this.tagStack.length - 1],
        });
      }
    }
  }

  private getAttributeName(name: string): string {
    const newName = name.split("-").reduce((acc: string, curr: string) => {
      if (acc) {
        acc += curr[0].toUpperCase() + curr.slice(1);
      } else {
        acc = curr;
      }
      return acc;
    }, "");
    return newName;
  }
}
