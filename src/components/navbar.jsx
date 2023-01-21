import React from "react";
import { NavLink, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

const Navbarr = ({ user }) => {
  return (
    <Navbar
      collapseOnSelect
      expand="sm"
      bg="light"
      variant="light"
      className="mb-3 w-100"
    >
      <Container>
        <Navbar.Brand>
          <Link to="/" style={{ textDecoration: "none" }}>
            Vidly
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Container>
            <Nav as="ul">
              <NavLink className="nav-item nav-link" to="/movies">
                Movies
              </NavLink>
              { user && 
              <>
                <NavLink className="nav-item nav-link" to="/customers">
                  Customers
                </NavLink>
                <NavLink className="nav-item nav-link" to="/rentals">
                  Rentals
                </NavLink>
              </>
              }
            </Nav>
          </Container>
          <Container>
            {user ? (
              <Nav className="justify-content-end" as="ul">
                <NavLink className="nav-item nav-link" to="/profile">
                  Hi! {user.name}
                </NavLink>
                <NavLink className="nav-item nav-link" to="/logOut">
                  LogOut
                </NavLink>
              </Nav>
            ) : (
              <Nav className="justify-content-end" as="ul">
                <NavLink className="nav-item nav-link" to="/login">
                  LogIn
                </NavLink>
                <NavLink className="nav-item nav-link" to="/register">
                  Register
                </NavLink>
              </Nav>
            )}
          </Container>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbarr;
