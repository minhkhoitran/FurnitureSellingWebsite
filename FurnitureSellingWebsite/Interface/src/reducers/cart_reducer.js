import {
  THEM_VAO_GIO,
  XOA_HANG,
  DEM_TONG_HANG_TRONG_GIO,
  XOA_GIO_HANG,
  THAY_DOI_SO_LUONG_HANG,
} from "../actions";

const cart_reducer = (state, action) => {
  if (action.type === THEM_VAO_GIO) {
    const { id, amount, product } = action.payload;
    const tempItem = state.cart.find((i) => i.id === id);
    if (tempItem) {
      const tempCart = state.cart.map((cartItem) => {
        if (cartItem.id === id) {
          let newAmount = cartItem.amount + amount;
          if (newAmount > cartItem.max) {
            newAmount = cartItem.max;
          }
          return { ...cartItem, amount: newAmount };
        } else {
          return cartItem;
        }
      });

      return { ...state, cart: tempCart };
    } else {
      const newItem = {
        id: id,
        tensp: product.tensp,
        amount,
        hinhanh: product.hinhanh,
        dongianiemyet: product.dongianiemyet,
        max: product.stock,
      };
      return { ...state, cart: [...state.cart, newItem] };
    }
  }
  if (action.type === XOA_HANG) {
    const tempCart = state.cart.filter((item) => item.id !== action.payload);
    return { ...state, cart: tempCart };
  }

  if (action.type === XOA_GIO_HANG) {
    return { ...state, cart: [] };
  }

  if (action.type === THAY_DOI_SO_LUONG_HANG) {
    const { id, value } = action.payload;
    const tempCart = state.cart.map((item) => {
      if (item.id === id) {
        if (value === "inc") {
          let newAmount = item.amount + 1;
          if (newAmount > item.max) {
            newAmount = item.max;
          }
          return { ...item, amount: newAmount };
        }
        if (value === "dec") {
          let newAmount = item.amount - 1;
          if (newAmount < 1) {
            newAmount = 1;
          }
          return { ...item, amount: newAmount };
        }
      }
      return item;
    });
    return { ...state, cart: tempCart };
  }

  if (action.type === DEM_TONG_HANG_TRONG_GIO) {
    const { total_items, total_amount } = state.cart.reduce(
      (total, cartItem) => {
        const { amount, dongianiemyet } = cartItem;
        total.total_items += amount;
        total.total_amount += dongianiemyet * amount;
        return total;
      },
      {
        total_items: 0,
        total_amount: 0,
      }
    );
    return { ...state, total_amount, total_items };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
