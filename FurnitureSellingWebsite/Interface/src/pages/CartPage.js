import React from 'react'
import styled from 'styled-components'
import { useCartContext } from '../context/cart_context'
import { Link } from 'react-router-dom'
import { CartContent, PageHero } from '../components'

const CartPage = () => {
  const {cart} = useCartContext();
  if(cart.length< 1){
    return <Wrapper className='page-100'>
      <div className='empty'>
        <h2>Giỏ hàng bạn còn trống</h2>
        <Link to='/SanPham' className='btn'>
          Hãy mua gì đó
        </Link>
      </div>
    </Wrapper>
  }
  return (
    <main>
      <PageHero title='GioHang'/>
      <Wrapper className='page'>
        <CartContent/>
      </Wrapper>
    </main>
  )
}

const Wrapper = styled.main`
  .empty {
    text-align: center;
    h2 {
      margin-bottom: 1rem;
      text-transform: none;
    }
  }
`

export default CartPage
