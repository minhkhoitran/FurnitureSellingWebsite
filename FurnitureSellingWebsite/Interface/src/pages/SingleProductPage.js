/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useProductsContext } from "../context/products_context";
import { formatPrice } from "../utils/helpers";
import Rating from "react-rating";
import { products_url as url } from "../utils/constants";
import axios from "axios";
import cookies from "react-cookies";
import { Col, Row, Form, Button } from "react-bootstrap";
import Moment from "react-moment";
import {
  Loading,
  Error,
  ProductImages,
  AddToCart,
  PageHero,
} from "../components";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SingleProductPage = () => {
  const [rating, setRating] = useState(0);
  const [view, setView] = useState(0);
  const [comments, setComments] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [commentContent, setCommentContent] = useState(null);
  const [changed, setChanged] = useState(1);
  const { id } = useParams();
  const history = useHistory();
  const {
    single_product_loading: loading,
    single_product_error: error,
    single_product: product,
    layChiTietSanPham,
  } = useProductsContext();

  const saveRating = async (rate) => {
    try {
      let res = await axios.post(
        `${url}${id}/rating/`,
        {
          danhgia: rate,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.load("access_token")}`,
          },
        }
      );
      console.info(res);
    } catch (err) {
      console.log(err);
    }
  };
  const loadComments = async () => {
    try {
      let res = await axios.get(`${url}${id}/comments/`, {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const saveViews = async (view) => {
    try {
      let res = await axios.get(
        `${url}${id}/views/`,
        {
          views: view,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.load("access_token")}`,
          },
        }
      );
      saveViews(res.data.view);
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async () => {
    try {
      let res = await axios.post(
        `${url}${id}/add-comment/`,
        {
          noidung: commentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.load("access_token")}`,
          },
        }
      );
      console.info(res.data);
      comments.push(res.data);
      setComments(comments);
      setChanged(comments.length);
    } catch (err) {
      console.info(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    layChiTietSanPham(id);
    setRating(id);
    setView(id);
    addComment(id);
    loadComments(id);
  }, [id, changed]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        history.push("/");
      }, 3000);
    }
    // eslint-disable-next-line
  }, [error]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }
  const {
    tensp = "",
    dongianiemyet,
    mota,
    stock,
    masp: sku,
    hinhanh,
  } = product;

  let danhgia = "";
  if (user !== null && user !== undefined) {
    danhgia = (
      <>
        <Rating initialRating={rating} onClick={saveRating} />
      </>
    );
  }

  let comment = "";
  if (user !== null && user !== undefined) {
    comment = (
      <>
        <div className="form-cmt">
          <Form onSubmit={addComment}>
            <Form.Group controlId="commentContent">
              <Form.Control
                className="comment"
                as="textarea"
                placeholder="Nhập bình luận"
                rows={3}
                value={commentContent}
                onChange={(event) => setCommentContent(event.target.value)}
              />
            </Form.Group>
            <Button className="cmt-btn" type="submit">
              Thêm bình luận
            </Button>
          </Form>
          <section className="show-cmt">
            {comments.map((c) => (
              <Row className="cmt">
                <Col md={11} xs={9}>
                  <h5>
                    <em>{c.noidung}</em>
                  </h5>
                  <p>Bình luận bởi: {c.nguoinhanxet.username}</p>
                  <p>
                    Vào lúc: <Moment fromNow>{c.created_date}</Moment>
                  </p>
                </Col>
              </Row>
            ))}
          </section>
        </div>
      </>
    );
  }
  return (
    <Wrapper>
      <PageHero title={tensp} product />
      <div className="section section-center page">
        <Link to="/SanPham" className="btn">
          Trở về trang sản phẩm
        </Link>
        <div className=" product-center">
          <ProductImages images={hinhanh} />
          <section className="content">
            <h2>{tensp}</h2>
            <div>{danhgia}</div>
            <h5 className="price"> {formatPrice(dongianiemyet)}</h5>
            <p className="desc"> {mota}</p>
            <p className="info">
              <span>Có sẵn : </span>
              {stock > 0 ? "In stock" : "out of stock"}
            </p>
            <p className="info">
              <span>Mã kho: </span>
              {sku}
            </p>
            <p className="info">
              <span>View: </span>
              {view}
            </p>
            <hr />
            {stock > 0 && <AddToCart product={product} />}
          </section>
        </div>
        {comment}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  .form-cmt {
    display:flex;
    padding: 1rem;
  }
  .cmt-btn {
    margin-left: 2rem;
  }
  .show-cmt {
    padding: 1rem;
  }
  .cmt{
    padding: 1rem;
    margin 0.5rem 1rem;
  }
  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
    span {
      font-weight: 700;
    }
  }
  .comment {
    margin: 2rem 2rem;
    padding: 1rem;
    width: 30rem;
    height: 5rem;
  }
  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }
`;

export default SingleProductPage;
