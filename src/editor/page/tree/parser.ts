import he from "he";
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
enum BodyTags {
  span = "span",
  p = "p",
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h5",
  h6 = "h6",
  cite = "cite",
  sup = "sup",
  sub = "sub",
}

/**
 * Tags which do not reside inside the body of the HTML content.
 */
enum ExteriorTags {
  html = "html",
  head = "head",
  title = "title",
  meta = "meta",
  body = "body",
}

export default class Parser {
  /**
   * The page being created from the HTML content.
   */
  private page: PageContentMutable;

  /**
   * The stream of tokens from the HTML lexer.
   */
  private stream: TokenStream;

  /**
   * The HTML content passed to the parser.
   */
  private content: string;

  /**
   * The name of the last attribute.
   */
  private lastAttribute = "";

  /**
   * The first meta attribute.
   */
  private metaFirstAttribute = "";

  /**
   * The latest tag or node found.
   */
  private tagNode: NodeUnionMutable | {} = {};

  /**
   * The stack of tags.
   */
  private tagStack: Array<{ tag: string; id?: string }> = [];

  /**
   * The length of the content so far, in terms of content characters (not HTML length).
   */
  private length = 0;

  /**
   * Prevents unnecessary processing. If `.parse()` is called more than once, it returns the previously acquired page.
   */
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
          if ((this.tagNode as TagNodeMutable).tag === ExteriorTags.title) {
            this.page.title = chunk;
          } else {
            console.log({ type, chunk });
          }
          break;
        case "data":
          if (chunk !== "") {
            this.data(chunk);
          }
          break;
        case "charRef-decimal":
        case "charRef-hex":
        case "charRef-named":
          this.charRef(chunk);
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
    (this.tagNode as TagNodeMutable).tag = chunk.slice(1);
    (this.tagNode as TagNodeMutable).nodeType = NodeType.StartTag;
    this.tagStack.push({ tag: (this.tagNode as TagNodeMutable).tag });
    if ((this.tagNode as TagNodeMutable).tag === ExteriorTags.meta) {
      this.metaFirstAttribute = "";
    }
    if (
      !ExteriorTags.hasOwnProperty((this.tagNode as TagNodeMutable).tag) &&
      !BodyTags.hasOwnProperty((this.tagNode as TagNodeMutable).tag)
    ) {
      console.log({ lastTag: (this.tagNode as TagNodeMutable).tag });
    }
  }

  private endTag(): void {
    this.insertPreviousNode();
    const currentTag = this.tagStack.pop();
    this.lastAttribute = "";
    this.metaFirstAttribute = "";
    if (currentTag && BodyTags.hasOwnProperty(currentTag.tag)) {
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
      (this.tagNode as TagNodeMutable).tag === ExteriorTags.meta &&
      !this.metaFirstAttribute
    ) {
      this.metaFirstAttribute = this.lastAttribute;
    }
    this.lastAttribute = chunk;
    if (
      !ExteriorTags.hasOwnProperty((this.tagNode as TagNodeMutable)
        .tag as string) &&
      !BodyTags.hasOwnProperty((this.tagNode as TagNodeMutable).tag as string)
    ) {
      console.log({ lastAttribute: this.lastAttribute });
    }
  }

  private attributeValue(chunk: string): void {
    const node = this.tagNode as TagNodeMutable;
    switch (node.tag) {
      case ExteriorTags.html:
        if (this.lastAttribute === "lang") {
          this.page.language = chunk;
        }
        break;
      case ExteriorTags.meta:
        if (this.lastAttribute === "content") {
          if (this.metaFirstAttribute === "http-equiv") {
            this.page.charset = chunk.split("=").pop();
          } else if (this.metaFirstAttribute === "name") {
            this.page.created = chunk;
          }
        }
        break;
      case ExteriorTags.body:
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
              acc[this.getAttributeName(key, true)] = value;
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
    if (lastTag && BodyTags.hasOwnProperty(lastTag.tag)) {
      this.insertPreviousNode();
      const contentInsert: ContentInsert = {
        content: chunk,
        offset: this.length,
      };
      this.length += chunk.length;
      this.insertContent(contentInsert);
    } else {
      const t = this.tagStack[this.tagStack.length - 1];
      if (
        t &&
        !BodyTags.hasOwnProperty(t.tag) &&
        !ExteriorTags.hasOwnProperty(t.tag)
      ) {
        console.log({
          type: "data",
          chunk,
          tag: t.tag,
        });
      }
    }
  }

  private insertContent(contentInsert: ContentInsert): void {
    if (
      this.page.buffers.length === 0 ||
      this.page.buffers[this.page.buffers.length - 1].content.length +
        contentInsert.content.length >=
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
    this.tagNode = {};
  }

  private getAttributeName(name: string, isStyleProperty = false): string {
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

  private insertPreviousNode(): void {
    const node = this.tagNode as TagNodeMutable;
    if (
      node.nodeType === NodeType.StartTag ||
      node.nodeType === NodeType.EndTag
    ) {
      this.insertTag();
    }
  }

  private insertTag(): void {
    const node = this.tagNode as TagNodeMutable;
    if (BodyTags.hasOwnProperty(node.tag as string)) {
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
      this.tagNode = {};
    }
  }

  private charRef(chunk: string): void {
    this.insertPreviousNode();
    const contentInsert: ContentInsert = {
      content: he.decode(chunk),
      offset: this.length,
    };
    this.insertContent(contentInsert);
  }
}
