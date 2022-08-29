import React from "react"
import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavDropdown,
} from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import logo from "../../public/static/images/escape_from_tarkov_logo.png"

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <LinkContainer to="/">
            <NavbarBrand>
              <img src={logo} height="54px" />
            </NavbarBrand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <LinkContainer to="/character">
                <Nav.Link className="mx-3">Character</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/hideout">
                <Nav.Link className="mx-3">Hideout</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/task">
                <Nav.Link className="mx-3">Tasks</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/fleamarket">
                <Nav.Link className="mx-3">Flea market</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav className="ms-auto">
              <LinkContainer to="/login">
                <Nav.Link className="mx-3">Log in</Nav.Link>
              </LinkContainer>
              <NavDropdown menuVariant="dark" title="profile" id="username">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => {}}>Log out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export { Header }
