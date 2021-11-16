import React from "react";
import styled from "styled-components";
import { useFilterContext } from "../context/filter_context";
import {
  getUniqueValues,
  formatPrice,
  getUniqueLoaiHang,
} from "../utils/helpers";
import { FaCheck } from "react-icons/fa";

const Filters = () => {
  const {
    filters: {
      text,
      loaihang,
      mausac,
      min_price,
      dongianiemyet,
      max_price,
      shipping,
    },
    updateBoLoc,
    clearFilters,
    all_products,
  } = useFilterContext();
  const cacLoaiHang = getUniqueLoaiHang(all_products, "loaihang");

  const colors = getUniqueValues(all_products, "mausac");
  return (
    <Wrapper>
      <div className="content">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* search input */}
          <div className="form-control">
            <input
              type="text"
              name="text"
              placeholder="tìm kiếm"
              className="search-input"
              value={text}
              onChange={updateBoLoc}
            />
          </div>
          {/* end search input */}

          {/* {loai hang} */}
          <div className=" form-control">
            <h5>Loại hàng</h5>
            <select
              name="loaihang"
              value={loaihang}
              onChange={updateBoLoc}
              className="company"
            >
              {cacLoaiHang.map((c, index) => {
                return (
                  <option key={index} value={c}>
                    {c}
                  </option>
                );
              })}
            </select>
          </div>
          {/* {end of loaihang} */}

          {/* {mau sac} */}
          <div className="form-control">
            <h5>Màu sắc</h5>
            <div className="colors">
              {colors.map((c, index) => {
                if (c === "all") {
                  return (
                    <button
                      name="mausac"
                      onClick={updateBoLoc}
                      data-mausac="all"
                      className={`${
                        mausac === "all" ? "all-btn active" : "all-btn"
                      }`}
                    >
                      tất cả
                    </button>
                  );
                }
                return (
                  <button
                    key={index}
                    name="mausac"
                    style={{ background: c }}
                    className={`${
                      mausac === c ? "color-btn active" : "color-btn"
                    }`}
                    data-mausac={c}
                    onClick={updateBoLoc}
                  >
                    {mausac === c ? <FaCheck /> : null}
                  </button>
                );
              })}
            </div>
          </div>
          {/* {end of mausac} */}

          {/* {price} */}
          <div className="form-control">
            <h5>Giá</h5>
            <p className="price">{formatPrice(dongianiemyet)}</p>
            <input
              type="range"
              name="dongianiemyet"
              onChange={updateBoLoc}
              min={min_price}
              max={max_price}
              value={dongianiemyet}
            ></input>
          </div>
          {/* {end of price} */}

          {/* {shipping} */}
          <div className="form-control shipping">
            <label htmlFor="shipping">free shipping</label>
            <input
              type="checkbox"
              name="shipping"
              id="shipping"
              onChange={updateBoLoc}
              checked={shipping}
            />
          </div>
          {/* {end of shipping} */}
        </form>
        <button type="button" className="clear-btn" onClick={clearFilters}>
          {""}
          Xóa Bộ Lọc
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .form-control {
    margin-bottom: 1.25rem;
    h5 {
      margin-bottom: 0.5rem;
    }
  }
  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: var(--spacing);
  }
  .search-input::placeholder {
    text-transform: capitalize;
  }

  button {
    display: block;
    margin: 0.25em 0;
    padding: 0.25rem 0;
    text-transform: capitalize;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
  .active {
    border-color: var(--clr-grey-5);
  }
  .company {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .colors {
    display: flex;
    align-items: center;
  }
  .color-btn {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #222;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 0.5rem;
      color: var(--clr-white);
    }
  }
  .all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    opacity: 0.5;
  }
  .active {
    opacity: 1;
  }
  .all-btn .active {
    text-decoration: underline;
  }
  .price {
    margin-bottom: 0.25rem;
  }
  .shipping {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    text-transform: capitalize;
    column-gap: 0.5rem;
    font-size: 1rem;
  }
  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }
  @media (min-width: 768px) {
    .content {
      position: sticky;
      top: 1rem;
    }
  }
`;

export default Filters;
