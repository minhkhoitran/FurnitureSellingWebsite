import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css";
import App from "./App";
import { ProductsProvider } from "./context/products_context";
import { FilterProvider } from "./context/filter_context";
import { CartProvider } from "./context/cart_context";
import mainReducer from "./reducers/root_reducer";
import { Provider } from "react-redux";
import {createStore} from "redux"
const store = createStore(mainReducer);
ReactDOM.render(
  <Provider store={store}>
    <ProductsProvider>
      <FilterProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FilterProvider>
    </ProductsProvider>
  </Provider>,

  document.getElementById("root")
);
