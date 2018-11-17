import { combineReducers, ReducersMapObject } from "redux";
import { IStatePages } from "./page/model";
import pageReducer from "./page/reducer";

export interface IState {
  pages: IStatePages;
}

const reducers: ReducersMapObject = {
  pages: pageReducer,
};

export default combineReducers(reducers);
