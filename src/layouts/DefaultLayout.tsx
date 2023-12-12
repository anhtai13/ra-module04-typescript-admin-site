import { Outlet, useNavigate } from "react-router-dom";

import { Container, Row, Col } from "react-bootstrap";

import Header from "../components/partials/Header";
import Footer from "../components/partials/Footer";
import Sidebar from "../components/partials/Sidebar";
import authApi from "../apis/auth/auth";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logoutAction, setAuthAction } from "../store/actions/auth.action";

function DefaultLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [auth, setAuth] = useState<any>({});

  useEffect(() => {
    authApi
      .getAuth()
      .then((response) => {
        if (response.role == "1") {
          setAuth(response);
          dispatch(setAuthAction(response));
        } else {
          dispatch(logoutAction());
          navigate("/login");
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert(error.response.statusText);
          dispatch(logoutAction());
          navigate("/login");
        } else {
          alert(error.response.statusText);
        }
      });
  }, []);

  return (
    <Container>
      <header>
        <Header />
      </header>
      <Row>
        <Col md={2}>
          <Sidebar auth={auth} />
        </Col>
        <Col md={10}>
          <div className="m-4">
            <Outlet />
          </div>
          <footer style={{ padding: "20px 0 0 0 " }}>
            <Footer />
          </footer>
        </Col>
      </Row>
    </Container>
  );
}

export default DefaultLayout;
