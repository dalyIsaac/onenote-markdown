import { combineReducers } from "redux";
import { StatePages } from "./editor/page/model";
import pageReducer from "./editor/page/reducer";
import selectedPageReducer from "./editor/selectedPage/reducer";

export interface State {
  readonly pages: StatePages;
  readonly selectedPage: string;
}

export default combineReducers({
  pages: pageReducer,
  selectedPage: selectedPageReducer,
});
