import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import reducer from "../reducers/products_reducer";
import { products_url as url } from "../utils/constants";
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
import { useLocation } from "react-router";

const initialState = {
  isSidebarOpen: false,
  products_loading: false,
  products_error: false,
  products: [],
  featured_products: [],
  single_product_loading: false,
  single_product_error: false,
  single_product: {},
};
const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [page, setPage] = useState(1);

  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN });
  };
  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE });
  };
  // const location = useLocation();
  const laySanPham = async (url) => {
    dispatch({ type: BAT_DAU_LAY_SAN_PHAM });

    // const query = location.search;
    // if (query === "") {
    //   query = `?page = {page}`;
    // } else {
    //   query += `&page = {page}`;
    // }
    try {
      // const response = await axios.get(`${url}${query}`);
      const response = await axios.get(url);
      const products = response.data.results;

      dispatch({ type: LAY_SAN_PHAM_THANH_CONG, payload: products });
    } catch (error) {
      dispatch({ type: LAY_SAN_PHAM_THAT_BAI });
    }
  };
  useEffect(() => {
    laySanPham(url);
  }, []);
  const paging = (inc) => {
    setPage(page + inc);
  };
  const layChiTietSanPham = async (id) => {
    dispatch({ type: BAT_DAU_LAY_CHI_TIET_SAN_PHAM });
    try {
      const response = await axios.get(`${url}${id}/`);
      const singleProduct = response.data;
      dispatch({
        type: LAY_CHI_TIET_SAN_PHAM_THANH_CONG,
        payload: singleProduct,
      });
    } catch (error) {
      dispatch({ type: LOI_LAY_CHI_TIET_SAN_PHAM });
    }
  };

  // const layDanhGiaSanPham = async (id,rate) => {
  //   dispatch({ type: BAT_DAU_DANH_GIA_CHI_TIET_SAN_PHAM });
  //   try {
  //     const response = await axios.get(
  //       `${url}${id}/rating/`,
  //       {
  //         "rating": rate,
  //       },
  //       {
  //         headers: {
  //          "Authorization": `Bearer ${cookies.load("access_token")}`,
  //         },
  //       }
  //     );
  //     const rate_product = response.data;
  //     dispatch({
  //       type: DANH_GIA_CHI_TIET_SAN_PHAM_THANH_CONG,
  //       payload: rate_product,
  //     });
  //   } catch (error) {
  //     dispatch({ type: LOI_DANH_GIA_CHI_TIET_SAN_PHAM});
  //   }
  // };

  return (
    <ProductsContext.Provider
      value={{
        ...state,
        openSidebar,
        closeSidebar,
        layChiTietSanPham,
        paging,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
// make sure use
export const useProductsContext = () => {
  return useContext(ProductsContext);
};
