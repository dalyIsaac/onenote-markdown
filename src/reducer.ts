import { combineReducers } from "redux";
import { StatePages } from "./editor/page/model";
import pageReducer from "./editor/page/reducer";

export interface State {
  readonly pages: StatePages;
}

export default combineReducers({
  pages: pageReducer,
});
