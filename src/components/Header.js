import React, { useState, useEffect } from "react"
import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavDropdown,
} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { resetUser } from "../reducers/UserSlice"
import { resetCharacter } from "../reducers/CharacterSlice"
import { resetItem } from "../reducers/ItemSlice"
import { resetTrader } from "../reducers/TraderSlice"
import { resetFleamarket } from "../reducers/FleamarketSlice"
import { resetHideout } from "../reducers/HideoutSlice"
import logo from "../../server/public/static/images/escape_from_tarkov_logo.png"

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
    dispatch(resetCharacter())
    dispatch(resetItem())
    dispatch(resetTrader())
    dispatch(resetFleamarket())
    dispatch(resetHideout())
    dispatch(resetUser())
    navigate("/")
  }

  return (
    <header>
      <Navbar variant="dark" expand="lg" className="tarkov-header">
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
                  align="end"
                  menuVariant="dark"
                  title={userName !== "" && userName}
                  id="username"
                >
                  <LinkContainer to="/setting">
                    <NavDropdown.Item className="fs-20px">
                      setting
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandle} className="fs-20px">
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
