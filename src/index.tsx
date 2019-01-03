import { FluentCustomizations } from "@uifabric/fluent-theme";
import { Customizer } from "office-ui-fabric-react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import App from "./App";
import "./index.css";
import rootReducer from "./reducer";

const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <Customizer {...FluentCustomizations}>
      <App />
    </Customizer>
  </Provider>,
  document.getElementById("root"),
);
