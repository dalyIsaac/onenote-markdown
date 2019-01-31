import { combineReducers } from "redux";
import { StatePages } from "./page/pageModel";
import pageReducer from "./page/reducer";
import selectedPageReducer from "./selectedPage/reducer";

export interface State {
  readonly pages: StatePages;
  readonly selectedPage: string;
}

export default combineReducers({
  pages: pageReducer,
  selectedPage: selectedPageReducer,
});
