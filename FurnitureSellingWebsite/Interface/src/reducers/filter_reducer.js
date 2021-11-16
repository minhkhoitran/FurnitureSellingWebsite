import {
  LOAD_SAN_PHAM,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SAP_XEP_SAN_PHAM,
  UPDATE_BO_LOC,
  LOC_SAN_PHAM,
  XOA_BO_LOC,
} from "../actions";

const filter_reducer = (state, action) => {
  if (action.type === LOAD_SAN_PHAM) {
    let maxPrice = action.payload.map((p) => p.dongianiemyet);
    maxPrice = Math.max(...maxPrice);
    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: {
        ...state.filters,
        max_price: maxPrice,
        dongianiemyet: maxPrice,
      },
    };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }
  if (action.type === SAP_XEP_SAN_PHAM) {
    const { sort, filtered_products } = state;
    let tempProducts = [...filtered_products];
    if (sort === "price-lowest") {
      tempProducts = tempProducts.sort((a, b) => {
        if (a.dongianiemyet < b.dongianiemyet) {
          return -1;
        }
        if (a.dongianiemyet > b.dongianiemyet) {
          return 1;
        }
        return 0;
      });
    }
    if (sort === "price-highest") {
      tempProducts = tempProducts.sort(
        (a, b) => b.dongianiemyet - a.dongianiemyet
      );
    }
    if (sort === "name-a") {
      tempProducts = tempProducts.sort((a, b) => {
        return a.tensp.localeCompare(b.tensp);
      });
    }
    if (sort === "name-z") {
      tempProducts = tempProducts.sort((a, b) => {
        return b.tensp.localeCompare(a.tensp);
      });
    }
    return { ...state, filtered_products: tempProducts };
  }
  if (action.type === UPDATE_BO_LOC) {
    const { name, value } = action.payload;
    return { ...state, filters: { ...state.filters, [name]: value } };
  }
  if (action.type === LOC_SAN_PHAM) {
    const { all_products } = state;
    const { text, loaihang, dongianiemyet, mausac, shipping } = state.filters;

    let tempProducts = [...all_products];
    // filtering
    // text
    if (text) {
      tempProducts = tempProducts.filter((product) => {
        return product.tensp.toLowerCase().startsWith(text);
      });
    }

    // loaiHang
    if (loaihang !== "all") {
      tempProducts = tempProducts.filter(
        (product) => product.loaihang === +loaihang
      );
    }
    // colors
    if (mausac !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.mausac.some((item) => item.name === mausac);
      });
    }
    // price
    tempProducts = tempProducts.filter(
      (product) => product.dongianiemyet <= dongianiemyet
    );
    // shipping
    if (shipping) {
      tempProducts = tempProducts.filter(
        (product) => product.shipping === true
      );
    }
    return { ...state, filtered_products: tempProducts };
  }
  if (action.type === XOA_BO_LOC) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        loaihang: "all",
        mausac: "all",
        dongianiemyet: state.filters.max_price,
        shipping: false,
      },
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
