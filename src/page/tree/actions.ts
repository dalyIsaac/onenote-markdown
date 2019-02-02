import { PageActionPartial } from "../actions";

//#region Store OneNote page
export const STORE_PAGE = "STORE_PAGE";

export interface StorePageAction extends PageActionPartial {
  readonly content: string;
  readonly pageId: string;
}

export const storePage = (
  pageId: string,
  content: string,
): StorePageAction => ({
  content,
  pageId,
  type: STORE_PAGE,
});
//#endregion
