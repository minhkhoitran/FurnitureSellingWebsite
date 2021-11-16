import React, { useState } from "react";
import styled from "styled-components";
import { Filters, ProductList, Sort, PageHero } from "../components";
import { ButtonGroup, Button } from "react-bootstrap";
import { useProductsContext } from "../context/products_context";
const ProductsPage = () => {
  const {paging} = useProductsContext();
  // const [prev, setPrev] = useState(false);
  // const [next, setNext] = useState(false);
 
  return (
    <main>
      <PageHero title="SanPham" />
      <Wrapper className="page">
        <div className="section-center products">
          <Filters />
          <div>
            <Sort />
            <ProductList />
            {/* <ButtonGroup>
              <Button variant="info" onClick ={()=> paging(-1)} disabled={!prev}>
                &lt;&lt;
              </Button>
              <Button variant="info" onClick ={()=> paging(1)} disabled={!next}>
                &gt;&gt;
              </Button>
            </ButtonGroup> */}
          </div>
        </div>
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.div`
  .products {
    display: grid;
    gap: 3rem 1.5rem;
    margin: 4rem auto;
  }
  @media (min-width: 768px) {
    .products {
      grid-template-columns: 200px 1fr;
    }
  }
`;

export default ProductsPage;
