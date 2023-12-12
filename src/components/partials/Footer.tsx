import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <>
      <footer className="bg-dark text-white mt-5">
        <Container>
          <Row>
            <Col md={6}>
              <h5>Thông tin liên hệ</h5>
              <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
              <p>Email: example@example.com</p>
              <p>Điện thoại: (123) 456-7890</p>
            </Col>
            <Col md={6}>
              <h5>Liên kết nhanh</h5>
              <ul>
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/about">Về chúng tôi</a>
                </li>
                <li>
                  <a href="/contact">Liên hệ</a>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
        <div className="text-center p-3">
          © {new Date().getFullYear()} Rikkei Academy.
        </div>
      </footer>
    </>
  );
}

export default Footer;
