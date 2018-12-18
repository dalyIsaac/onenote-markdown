import { combineReducers } from "redux";
import { StatePages } from "./page/model";
import pageReducer from "./page/reducer";

export interface State {
  readonly pages: StatePages;
}

export default combineReducers({
  pages: pageReducer,
});
