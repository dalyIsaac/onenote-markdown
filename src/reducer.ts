import { combineReducers, ReducersMapObject } from "redux";
import { StatePages } from "./page/model";
import pageReducer from "./page/reducer";

export interface State {
  pages: StatePages;
}

const reducers: ReducersMapObject = {
  pages: pageReducer,
};

export default combineReducers(reducers);
