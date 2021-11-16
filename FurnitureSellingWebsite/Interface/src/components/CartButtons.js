import React from "react";
import { FaShoppingCart, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useProductsContext } from "../context/products_context";
import { useCartContext } from "../context/cart_context";
import { useSelector } from "react-redux";
import cookies from "react-cookies";
import { logoutUser } from "../ActionCreators/UserCreators";
import { useDispatch } from "react-redux";

const CartButtons = () => {
  const { closeSideBar } = useProductsContext();
  const { total_items, xoaGioHang } = useCartContext();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const logout = (event) => {
    // event.preventDefault()
    cookies.remove("access_token");
    cookies.remove("user");
    dispatch(logoutUser());
  };
  let path = (
    <>
      <Link to="/DangNhap" className="cart-btn" onClick={closeSideBar}>
        Login
        <span className="cart-container">
          <FaUserPlus />
        </span>
      </Link>
    </>
  );
  if (user !== null && user !== undefined) {
    path = (
      <>
        <Link
          to="/"
          className="cart-btn"
          onClick={() => {
            xoaGioHang();
            logout();
          }}
        >
          Logout
          <span className="cart-container">
            <FaUserMinus />
          </span>
        </Link>
      </>
    );
  }
  return (
    <Wrapper className="cart-btn-wrapper">
      <Link to="/GioHang" className="cart-btn" onClick={closeSideBar}>
        Giỏ
        <span className="cart-container">
          <FaShoppingCart />
          <span className="cart-value">{total_items}</span>
        </span>
      </Link>
      {path}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 225px;

  .cart-btn {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-1);
    display: flex;

    align-items: center;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    svg {
      height: 1.6rem;
      margin-left: 5px;
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: var(--clr-white);
    padding: 12px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }
`;
export default CartButtons;
