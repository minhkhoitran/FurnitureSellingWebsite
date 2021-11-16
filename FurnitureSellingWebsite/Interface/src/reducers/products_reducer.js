import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  BAT_DAU_LAY_SAN_PHAM,
  LAY_SAN_PHAM_THANH_CONG,
  LAY_SAN_PHAM_THAT_BAI,
  BAT_DAU_LAY_CHI_TIET_SAN_PHAM,
  LAY_CHI_TIET_SAN_PHAM_THANH_CONG,
  LOI_LAY_CHI_TIET_SAN_PHAM,
} from "../actions";

const products_reducer = (state, action) => {
  if (action.type === SIDEBAR_OPEN) {
    return { ...state, isSidebarOpen: true };
  }
  if (action.type === SIDEBAR_CLOSE) {
    return { ...state, isSidebarOpen: false };
  }
  if (action.type === BAT_DAU_LAY_SAN_PHAM) {
    return { ...state, products_loading: true };
  }
  if (action.type === LAY_SAN_PHAM_THANH_CONG) {
    const featured_products = action.payload.filter(
      (product) => product.noibat === true
    );
    return {
      ...state,
      products_loading: false,
      products: action.payload,
      featured_products,
    };
  }
  if (action.type === LAY_SAN_PHAM_THAT_BAI) {
    return { ...state, products_loading: false, products_error: true };
  }
  if (action.type === BAT_DAU_LAY_CHI_TIET_SAN_PHAM) {
    return {
      ...state,
      single_product_loading: true,
      single_product_error: false,
    };
  }
  if (action.type === LAY_CHI_TIET_SAN_PHAM_THANH_CONG) {
    return {
      ...state,
      single_product_loading: false,
      single_product: action.payload,
    };
  }
  if (action.type === LOI_LAY_CHI_TIET_SAN_PHAM) {
    return {
      ...state,
      single_product_loading: false,
      single_product_error: true,
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default products_reducer;
