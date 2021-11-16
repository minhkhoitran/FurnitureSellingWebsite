import React, { useState } from "react";
import styled from "styled-components";
import { PageHero } from "../components";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router";
import { Form, Input } from "antd";
import { GoogleLogout, GoogleLogin } from "react-google-login";
import { loginUser } from "../ActionCreators/UserCreators";
import cookies from "react-cookies";

export default function LoginPage() {
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [username, setUserName] = useState();
  const [password, setPassWord] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const login = async () => {
    // event.preventDefault();
    try {
      let info = await axios.get("http://127.0.0.1:8000/oauth2-info/");
      let res = await axios.post("http://127.0.0.1:8000/o/token/", {
        client_id: info.data.client_id,
        client_secret: info.data.client_secret,
        username: username,
        password: password,
        grant_type: "password",
      });
      cookies.save("access_token", res.data.access_token);
      let user = await axios.get("http://127.0.0.1:8000/User/current-user/", {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      cookies.save("user", user.data);
      dispatch(loginUser(user.data));
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  const clientId =
    "186010178630-par2nss6ndqu5603kiqtbvn6305tu5ja.apps.googleusercontent.com";
  const onFailureSuccess = (res) => {
    console.log("Login Failed:", res);
  };
  const onLoginSuccess = (res) => {
    console.log("Login Success:", res.profileObj);

    setShowLoginButton(false);
    setShowLogoutButton(true);
  };
  const onSignOutSuccess = () => {
    alert("You have been signed out successfully");
    setShowLoginButton(true);
    setShowLogoutButton(false);
  };
  return (
    <main>
      <PageHero title="DangNhap" />
      <Wrapper className="content">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={login}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            className="information"
            label="Tài khoản"
            name="TenTaiKhoan"
            rules={[{ required: true, message: "Hãy nhập Tên tài khoản !" }]}
          >
            <Input
              className="input"
              value={username}
              onChange={(event) => setUserName(event.target.value)}
            />
          </Form.Item>

          <Form.Item
            className="information"
            label="Mật Khẩu"
            name="MatKhau"
            rules={[{ required: true, message: "Hãy nhập mật khẩu !" }]}
          >
            <Input.Password
              className="input"
              value={password}
              onChange={(event) => setPassWord(event.target.value)}
            />
          </Form.Item>
          <button type="submit" className="submit-btn" onSubmit={login}>
            Đăng nhập
          </button>
          <h5 className="google-btn">Hoặc đăng nhập bằng</h5>
          <div>
            {showLoginButton ? (
              <GoogleLogin
                clientId={clientId}
                buttonText="Đăng nhập"
                onSuccess={onLoginSuccess}
                onFailure={onFailureSuccess}
                cookiePolicy={"single_host_origin"}
                className="google-btn"
              />
            ) : null}
            {showLogoutButton ? (
              <GoogleLogout
                clientId={clientId}
                buttonText="Đăng xuất"
                onLogoutSuccess={onSignOutSuccess}
              ></GoogleLogout>
            ) : null}
          </div>
        </Form>
      </Wrapper>
    </main>
  );
}

const Wrapper = styled.div`
  padding: 50px;
  margin: auto;
  .information {
    letter-spacing: var(--spacing);
  }
  .input {
    padding: 0.2rem;
    border-radius: var(--radius);
    border-color: var(--clr-black);
  }
  .submit-btn {
    border-radius: var(--radius);
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border: 2px solid var(--clr-black);
    margin-left: 45%;
    background: var(--clr-primary-10);
    text-transform: capitalize;
    letter-spacing: var(--spacing);
    cursor: pointer;
    transition: var(--transition);
    color: var(--clr-black);
  }
  .google-btn {
    margin-top: 10px;
    margin-left: 45%;
  }
`;
