import React from 'react'
import styled from 'styled-components'
import { PageHero } from '../components'
import aboutImg from '../assets/hero-bcg.jpeg'

const ArticlePage = () => {
  return (
    <main>
      <PageHero title='VeChungToi' />
      <Wrapper className='page section section-center'>
        <img src={aboutImg} alt='nice desk' />
        <article>
          <div className='title'>
            <h2>Câu chuyện của chúng tôi</h2>
            <div className='underline'></div>
          </div>
          <p>
            Comfy Sloth là một trang bán hàng nội thất do hai sinh viên 
            <br/> Trần Trung Kiên 
            <br/> MSSV : 1851050070
            <br/>Và bạn đồng hành 
            <br/> Trần Minh Khôi 
            <br/> MSSV : 1851050066
            <br/> Đã lên ý tưởng sẽ cùng nhau bắt tay hợp tác và xây dựng nên để cùng nhau hoàn thành tốt môn đồ án ngành của khoa Công Nghệ Thông Tin khóa 2018
          </p>
        </article>
      </Wrapper>
    </main>
  )
}

const Wrapper = styled.section`
  display: grid;
  gap: 4rem;
  img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    height: 500px;
    object-fit: cover;
  }
  p {
    line-height: 2;
    max-width: 45em;
    margin: 0 auto;
    margin-top: 2rem;
    color: var(--clr-grey-5);
  }
  .title {
    text-align: left;
  }
  .underline {
    margin-left: 1;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`
export default ArticlePage
