import { Action } from "../common";

export const UPDATE_SELECTED_PAGE = "UPDATE_SELECTED_PAGE";

export interface UpdateSelectedPageAction extends Action {
  pageId: string;
}

export const updateSelectedPage = (
  pageId: string,
): UpdateSelectedPageAction => ({
  pageId,
  type: UPDATE_SELECTED_PAGE,
});
