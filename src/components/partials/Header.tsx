import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

import { useDispatch } from "react-redux";
import { Link, useNavigate, NavigateFunction } from "react-router-dom";

import { logoutAction } from "../../store/actions/auth.action";
import { AppDispatch } from "../../store";
import auth from "../../apis/auth/auth";

function Header() {
  const dispatch: AppDispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  const handleLogout = (): void => {
    navigate("/login");
    localStorage.removeItem("X-API-Key");
    localStorage.removeItem("reduxState");
  };

  return (
    <>
      <Navbar expand="lg" className="bg-info border-bottom border-secondary">
        <Container>
          <Navbar.Brand as={Link} to="/admin">
            Trang quản trị viên
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="float-end">
              <NavDropdown title="Thông tin tài khoản" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Thông tin tài khoản
                </NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
