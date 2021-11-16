import React, { useState, useRef } from "react";
import { Form, Input, Upload, Button, Avatar } from "antd";
import styled from "styled-components";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
// import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useHistory } from "react-router";
const Register = () => {
  const [userName, setUserName] = useState();
  const [password, setPassWord] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  // const avatar = useRef()
  const history = useHistory();
  const Register = () => {
    // event.preventDefault();

    const RegisterUser = async () => {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("username", userName);
      formData.append("password", password);
      // formData.append("avatar",avatar.current);

      try {
        await axios.post("http://127.0.0.1:8000/User/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        history.push("/DangNhap");
      } catch (err) {
        console.log(err);
      }
    };
    RegisterUser();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    // windowconsole.info("Bạn nhập sai thông tin");
  };

  // const normFile = (e) => {
  //   console.log("Upload event:", e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };
  return (
    <Wrapper className="content">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={Register}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <RegisterForm
          name="Ho"
          label="Họ"
          type="text"
          value={firstName}
          change={(event) => setFirstName(event.target.value)}
        />

        <RegisterForm
          name="Ten"
          label="Tên"
          type="text"
          value={lastName}
          change={(event) => setLastName(event.target.value)}
        />
        <RegisterForm
          name="TenTaiKhoan"
          label="Tài khoản"
          type="text"
          value={userName}
          change={(event) => setUserName(event.target.value)}
        />

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            className="input"
            value={password}
            onChange={(event) => setPassWord(event.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            className="input"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Form.Item>

        <RegisterForm
          name="Email"
          label="Email"
          type="text"
          value={email}
          change={(event) => setEmail(event.target.value)}
        />

        <Form.Item
          className="information"
          label="Số điện thoại"
          name="Phone"
          rules={[{ required: true, message: "Hãy nhập thông tin!" }]}
        >
          <PhoneInput className="input" value={phone} onChange={setPhone} />
        </Form.Item>

        <RegisterForm
          name="DiaChi"
          label="Địa chỉ"
          type="text"
          value={address}
          change={(event) => setAddress(event.target.value)}
        />
        {/* <Form.Item
          name="avatar"
          label="avatar"
          value={avatar}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="upload avatar của bạn"
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item> */}
        <button type="submit" className="submit-btn">
          Đăng ký
        </button>
      </Form>
    </Wrapper>
  );
};

function RegisterForm(props) {
  return (
    <Form.Item
      className="information"
      label={props.label}
      name={props.name}
      rules={[{ required: true, message: "Hãy nhập Tên tài khoản !" }]}
    >
      <Input
        type={props.type}
        className="input"
        value={props.value}
        onChange={props.change}
      />
    </Form.Item>
  );
}

export default Register;
const Wrapper = styled.section`
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
`;
