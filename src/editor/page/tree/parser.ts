import { chunks, TokenStream } from "tiny-html-lexer";
import { KeyValue } from "../../../common";
import {
  BufferMutable,
  Color,
  NodeType,
  NodeUnionMutable,
  PageContent,
  PageContentMutable,
  TagNodeMutable,
} from "../model";
import {
  ContentInsert,
  createNodeAppendToBuffer,
  createNodeCreateBuffer,
  fixInsert,
  insertNode,
} from "./insert";
import { getNewlineFormat, MAX_BUFFER_LENGTH, SENTINEL } from "./tree";

const STYLE = "style";
const ID = "id";

/**
 * Tags which reside inside the body of the HTML content.
 */
const bodyTags = {
  span: "span",
  p: "p",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h5",
  h6: "h6",
  cite: "cite",
  sup: "sup",
};

/**
 * Tags which do not reside inside the body of the HTML content.
 */
const exteriorTags = {
  html: "html",
  head: "head",
  title: "title",
  meta: "meta",
  body: "body",
};

export default class Parser {
  private page: PageContentMutable;
  private stream: TokenStream;
  private content: string;
  private lastAttribute = "";
  private metaFirstAttribute = "";
  private node: NodeUnionMutable | {} = {};
  private tagStack: Array<{ tag: string; id?: string }> = [];
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
      switch (type) {
        case "startTag-start":
          this.startTag(chunk);
          break;
        case "endTag-start":
          if (this.tagStack[this.tagStack.length - 1].tag === chunk.slice(2)) {
            this.endTag();
          }
          break;
        case "tag-end-autoclose":
          this.endTag();
          break;
        case "attribute-name":
          this.attributeName(chunk);
          break;
        case "attribute-value-data":
          this.attributeValue(chunk);
          break;
        case "rcdata":
          if ((this.node as TagNodeMutable).tag === exteriorTags.title) {
            this.page.title = chunk;
          } else {
            console.log({ type, chunk });
          }
          break;
        case "data":
          this.data(chunk);
          break;
        case "space":
        case "attribute-value-start":
        case "attribute-assign":
        case "attribute-value-end":
        case "tag-end":
          break;
        default:
          console.log({ type, chunk });
          break;
      }
    }
    return this.page as PageContent;
  }

  private startTag(chunk: string): void {
    this.insertPreviousNode();
    (this.node as TagNodeMutable).tag = chunk.slice(1);
    (this.node as TagNodeMutable).nodeType = NodeType.StartTag;
    this.tagStack.push({ tag: (this.node as TagNodeMutable).tag });
    if ((this.node as TagNodeMutable).tag === exteriorTags.meta) {
      this.metaFirstAttribute = "";
    }
    if (
      !exteriorTags.hasOwnProperty((this.node as TagNodeMutable).tag) &&
      !bodyTags.hasOwnProperty((this.node as TagNodeMutable).tag)
    ) {
      console.log({ lastTag: (this.node as TagNodeMutable).tag });
    }
  }

  private endTag(): void {
    this.insertPreviousNode();
    const currentTag = this.tagStack.pop();
    this.lastAttribute = "";
    this.metaFirstAttribute = "";
    if (currentTag && bodyTags.hasOwnProperty(currentTag.tag)) {
      const newNode: TagNodeMutable = {
        tag: currentTag.tag,
        parent: 0,
        left: 0,
        right: 0,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 0,
        lineFeedCount: 0,
        nodeType: NodeType.EndTag,
        color: Color.Red,
      };
      if (currentTag.id) {
        newNode.id = currentTag.id;
      }
      insertNode(this.page, newNode, this.length, this.page.nodes.length - 1);
      fixInsert(this.page, this.page.nodes.length - 1);
    }
  }

  private attributeName(chunk: string): void {
    if (
      (this.node as TagNodeMutable).tag === exteriorTags.meta &&
      !this.metaFirstAttribute
    ) {
      this.metaFirstAttribute = this.lastAttribute;
    }
    this.lastAttribute = chunk;
    if (
      !exteriorTags.hasOwnProperty((this.node as TagNodeMutable)
        .tag as string) &&
      !bodyTags.hasOwnProperty((this.node as TagNodeMutable).tag as string)
    ) {
      console.log({ lastAttribute: this.lastAttribute });
    }
  }

  private attributeValue(chunk: string): void {
    const node = this.node as TagNodeMutable;
    switch (node.tag) {
      case exteriorTags.html:
        if (this.lastAttribute === "lang") {
          this.page.language = chunk;
        }
        break;
      case exteriorTags.meta:
        if (this.lastAttribute === "content") {
          if (this.metaFirstAttribute === "http-equiv") {
            this.page.charset = chunk.split("=").pop();
          } else if (this.metaFirstAttribute === "name") {
            this.page.created = chunk;
          }
        }
        break;
      case exteriorTags.body:
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
          node.style = chunk
            .split(";")
            .reduce((acc: KeyValue, curr: string) => {
              const [key, value] = curr.trim().split(":");
              acc[this.getAttributeName(key)] = value;
              return acc;
            }, {});
        } else if (this.lastAttribute === ID) {
          node.id = chunk;
          this.tagStack[this.tagStack.length - 1].id = chunk;
        } else {
          if (!node.properties) {
            node.properties = {};
          }
          node.properties[this.getAttributeName(this.lastAttribute)] = chunk;
        }
        break;
    }
  }

  private data(chunk: string): void {
    const lastTag = this.tagStack[this.tagStack.length - 1];
    if (lastTag && bodyTags.hasOwnProperty(lastTag.tag)) {
      this.insertPreviousNode();
      const contentInsert: ContentInsert = {
        content: chunk,
        offset: this.length,
      };
      this.length += chunk.length;
      if (
        this.page.buffers.length === 0 ||
        this.page.buffers[this.page.buffers.length - 1].content.length +
          chunk.length >=
          MAX_BUFFER_LENGTH
      ) {
        createNodeCreateBuffer(
          contentInsert,
          this.page,
          this.page.nodes.length - 1,
        );
      } else {
        createNodeAppendToBuffer(
          contentInsert,
          this.page,
          this.page.nodes.length - 1,
        );
      }
      fixInsert(this.page, this.page.nodes.length - 1);
      (this.page.buffers[
        this.page.buffers.length - 1
      ] as BufferMutable).isReadOnly = true;
      this.node = {};
    } else {
      const t = this.tagStack[this.tagStack.length - 1];
      if (
        t &&
        !bodyTags.hasOwnProperty(t.tag) &&
        !exteriorTags.hasOwnProperty(t.tag)
      ) {
        console.log({
          type: "data",
          chunk,
          tag: this.tagStack[this.tagStack.length - 1].tag,
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

  private insertPreviousNode(): void {
    const node = this.node as Node;
    if (
      node.nodeType === NodeType.StartTag ||
      node.nodeType === NodeType.EndTag
    ) {
      this.insertTag();
    }
  }

  private insertTag(): void {
    const node = this.node as TagNodeMutable;
    if (bodyTags.hasOwnProperty(node.tag as string)) {
      node.length = 0;
      node.lineFeedCount = 0;
      node.leftCharCount = 0;
      node.leftLineFeedCount = 0;
      node.left = 0;
      node.right = 0;
      node.parent = 0;
      node.color = Color.Red;
      insertNode(this.page, node, this.length, this.page.nodes.length - 1);
      fixInsert(this.page, this.page.nodes.length - 1);
      this.node = {};
    }
  }
}