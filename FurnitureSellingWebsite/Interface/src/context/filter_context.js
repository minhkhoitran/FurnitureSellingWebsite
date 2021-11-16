import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/filter_reducer";
import {
  LOAD_SAN_PHAM,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SAP_XEP_SAN_PHAM,
  UPDATE_BO_LOC,
  LOC_SAN_PHAM,
  XOA_BO_LOC,
} from "../actions";
import { useProductsContext } from "./products_context";

const initialState = {
  filtered_products: [],
  all_products: [],
  grid_view: true,
  sort: "price-lowest",
  filters: {
    text: "",
    loaihang: "all",
    mausac: "all",
    min_price: 0,
    max_price: 0,
    donggianiemyet: 0,
    shipping: false,
  },
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const { products } = useProductsContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: LOAD_SAN_PHAM, payload: products });
  }, [products]);

  useEffect(() => {
    dispatch({ type: LOC_SAN_PHAM });
    dispatch({ type: SAP_XEP_SAN_PHAM });
  }, [products, state.sort, state.filters]);

  const setGridView = () => {
    dispatch({ type: SET_GRIDVIEW });
  };
  const setListView = () => {
    dispatch({ type: SET_LISTVIEW });
  };
  const updateSort = (e) => {
    // for demonstration
    // const name = e.target.name
    const value = e.target.value;
    dispatch({ type: UPDATE_SORT, payload: value });
  };
  const updateBoLoc = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "mausac") {
      value = e.target.dataset.mausac;
    }
    if (name === "price") {
      value = Number(value);
    }
    if (name === "shipping") {
      value = e.target.checked;
    }
    dispatch({ type: UPDATE_BO_LOC, payload: { name, value } });
  };
  const clearFilters = () => {
    dispatch({ type: XOA_BO_LOC });
  };
  return (
    <FilterContext.Provider
      value={{
        ...state,
        setGridView,
        setListView,
        updateSort,
        updateBoLoc,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext);
};
