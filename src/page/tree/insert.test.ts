// import { OnenotePage } from "@microsoft/microsoft-graph-types";
// import { createNewPage } from "../createNewPage";
// import { Color } from "../model";
// import { SENTINEL_INDEX } from "../reducer";
// import { IContentInsert, insertContent } from "./insert";

// describe("page/tree/insert", () => {
//   test("Insert content at the end of the original content", () => {
//     const constructOnenotePage = (): OnenotePage => ({
//       id: "test1",
//       content:
//         "Do not go gentle into that good night,\nOld age should burn and rave at close of day;",
//     });

//     const expectedPage = createNewPage(constructOnenotePage());
//     expectedPage.buffers.push({
//       isReadOnly: false,
//       lineStarts: [0],
//       content: "\nRage, rage against the dying of the light.",
//     });
//     expectedPage.nodes.push({
//       bufferIndex: 1,
//       start: { line: 0, column: 0 },
//       end: { line: 0, column: 43 },
//       leftCharCount: 0,
//       leftLineFeedCount: 0,
//       lineFeedCount: 1,
//       length: 43,
//       color: Color.Red,
//       parent: 0,
//       left: SENTINEL_INDEX,
//       right: SENTINEL_INDEX,
//     });
//     expectedPage.nodes[0].right = 1;

//     const page = createNewPage(constructOnenotePage());
//     const insertedContent: IContentInsert = {
//       content: "\nRage, rage against the dying of the light.",
//       offset: 84,
//     };
//     const acquiredPage = insertContent(insertedContent, page);
//     expect(acquiredPage).toEqual(expectedPage);
//   });
// });
