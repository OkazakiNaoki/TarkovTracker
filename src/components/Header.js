import React, { useState, useEffect } from "react"
import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavDropdown,
} from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { resetUser } from "../reducers/UserSlice"
import logo from "../../public/static/images/escape_from_tarkov_logo.png"
import { useNavigate } from "react-router-dom"

const Header = () => {
  // redux
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // hooks
  const [userName, setUserName] = useState("")
  useEffect(() => {
    if ("name" in user) {
      setUserName(user.name)
    }
  }, [user])

  // route
  const navigate = useNavigate()

  const logoutHandle = () => {
    dispatch(resetUser())
    navigate("/")
  }

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
            {Object.keys(user).length > 0 ? (
              <Nav className="ms-auto">
                <NavDropdown
                  menuVariant="dark"
                  title={userName !== "" && userName}
                  id="username"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandle}>
                    Log out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <LinkContainer to="/login">
                  <Nav.Link className="mx-3">Log in</Nav.Link>
                </LinkContainer>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export { Header }
