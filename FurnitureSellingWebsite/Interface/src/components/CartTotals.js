import React from 'react'
import styled from 'styled-components'
import { useCartContext } from '../context/cart_context'
import { formatPrice } from '../utils/helpers'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";
const CartTotals = () => {
  const { total_amount, shipping_fee } = useCartContext()
  const user = useSelector((state) => state.user.user);
  return (
    <Wrapper>
      <div>
        <article>
          <h5>
            Tiền sản phẩm : <span>{formatPrice(total_amount)}</span>
          </h5>
          <p>
            Phí Giao Hàng : <span>{formatPrice(shipping_fee)}</span>
          </p>
          <hr />
          <h4>
            Tổng :{' '}
            <span>{formatPrice(total_amount + shipping_fee)}</span>
          </h4>
        </article>
        {user ? (
          <Link to='/ThanhToan' className='btn'>
            Thanh toán
          </Link>
        ) : (
          <Link type='button' className='btn' to='/DangNhap'  >
           Đăng nhập để thanh toán
          </Link>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  article {
    border: 1px solid var(--clr-grey-8);
    border-radius: var(--radius);
    padding: 1.5rem 3rem;
  }
  h4,
  h5,
  p {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
  p {
    text-transform: capitalize;
  }
  h4 {
    margin-top: 2rem;
  }
  @media (min-width: 776px) {
    justify-content: flex-end;
  }
  .btn {
    width: 100%;
    margin-top: 1rem;
    text-align: center;
    font-weight: 700;
  }
`

export default CartTotals
