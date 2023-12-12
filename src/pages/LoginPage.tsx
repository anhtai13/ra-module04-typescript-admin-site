import { useDispatch } from "react-redux";
import { Button, Form, Row, Col } from "react-bootstrap";
import LoginApiFormData from "../models/LoginApiFormData";
import React, { useState } from "react";
import auth from ".././apis/auth/auth";
import { AppDispatch } from "../store";
import { loginAction } from "../store/actions/auth.action";
import { NavigateFunction, useNavigate } from "react-router-dom";

function LoginPage() {
  const dispatch: AppDispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  const [formData, setFormData] = useState<LoginApiFormData>({
    username: "",
    password: "",
    type: "admin",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // TODO: Validate

    auth
      .loginApi({
        username: formData.username,
        password: formData.password,
        type: "admin",
      })
      .then((response) => {
        dispatch(loginAction(response.token));

        navigate("/");
      })
      .catch((error) => {
        alert(error.response.statusText);
      });
  };

  return (
    <Row>
      <Col md={4}></Col>
      <Col md={4}>
        <h1 className="text-center my-5">Đăng nhập quản trị viên</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tên đăng nhập"
              name="username"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event)
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Mật khẩu"
              name="password"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event)
              }
            />
          </Form.Group>
          <Form.Group className="mb-3 text-center">
            <Button type="submit" variant="primary">
              Đăng nhập
            </Button>
          </Form.Group>
        </Form>
      </Col>
      <Col md={4}></Col>
    </Row>
  );
}

export default LoginPage;
