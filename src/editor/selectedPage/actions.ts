import { Action } from "../../common";

export const UPDATE_SELECTED_PAGE = "UPDATE_SELECTED_PAGE";

export interface UpdateSelectedPageAction extends Action {
  readonly pageId: string;
}

export const updateSelectedPage = (
  pageId: string,
): UpdateSelectedPageAction => ({
  type: UPDATE_SELECTED_PAGE,
  pageId,
});
