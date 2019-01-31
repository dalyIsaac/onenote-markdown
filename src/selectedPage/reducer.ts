import { UPDATE_SELECTED_PAGE, UpdateSelectedPageAction } from "./actions";

export default function selectedPageReducer(
  state: string = "",
  action: UpdateSelectedPageAction,
): string {
  switch (action.type) {
    case UPDATE_SELECTED_PAGE:
      return action.pageId;
    default:
      return state;
  }
}
