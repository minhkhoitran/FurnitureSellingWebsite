import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/cart_reducer";
import cookies from "react-cookies";
import {
  THEM_VAO_GIO,
  XOA_GIO_HANG,
  THAY_DOI_SO_LUONG_HANG,
  XOA_HANG,
  DEM_TONG_HANG_TRONG_GIO,
} from "../actions";

const getLocalStorage = ()=>{
  let cart = localStorage.getItem('cart')
  if(cart){
    return JSON.parse(localStorage.getItem('cart'))
  }
  else{
    return []
  }
}
// const getCookies = () => {
//   let cart = cookies.save("cart");
//   if (cart) {
//     return JSON.parse(cookies.save("cart"));
//   } else {
//     return [];
//   }
// };
const initialState = {
  cart: getLocalStorage(),
  total_items: 0,
  total_amount: 0,
  shipping_fee: 534,
};

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //add to cart
  const themVaoGio = (id, amount, product) => {
    dispatch({
      type: THEM_VAO_GIO,
      payload: { id, amount, product },
    });
  };
  //remove item
  const xoaHang = (id) => {
    dispatch({
      type: XOA_HANG,
      payload: id,
    });
  };
  //toggle amount
  const thayDoiSoLuong = (id, value) => {
    dispatch({
      type: THAY_DOI_SO_LUONG_HANG,
      payload: { id, value },
    });
  };
  //clear cart
  const xoaGioHang = () => {
    dispatch({
      type: XOA_GIO_HANG,
    });
  };

  useEffect(() => {
    dispatch({
      type: DEM_TONG_HANG_TRONG_GIO,
    });
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        themVaoGio,
        xoaHang,
        thayDoiSoLuong,
        xoaGioHang,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
// make sure use
export const useCartContext = () => {
  return useContext(CartContext);
};
