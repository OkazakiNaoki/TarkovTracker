import React, { useState, useEffect } from "react"
import { Container, Row, Col, InputGroup, Form, Alert } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login, getUserPreference } from "../reducers/UserSlice"
import { TarkovStyleButton } from "../components/TarkovStyleButton"

const LoginScreen = () => {
  // redux
  const { user, errorMsg } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // hooks
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // route
  const navigate = useNavigate()

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      dispatch(getUserPreference())
      setEmail("")
      setPassword("")
      navigate("/")
    }
  }, [user])

  const submitHandle = (e) => {
    e.preventDefault()
    if (email.length > 0 && password.length > 0)
      dispatch(login({ email, password }))
  }

  return (
    <>
      <Container className="h-100">
        <Row className="d-flex align-items-center justify-content-center height-90">
          <Col md={6} align="center">
            <h1 className="mb-5 sand1">Log in</h1>
            {errorMsg.length > 0 && (
              <Alert variant="secondary" className="text-center">
                {errorMsg}
              </Alert>
            )}
            <Form>
              <InputGroup className="mb-5">
                <InputGroup.Text id="email-input">E-mail</InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter your e-mail"
                  aria-label="email"
                  aria-describedby="email-input"
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                />
              </InputGroup>
              <InputGroup className="mb-5">
                <InputGroup.Text id="password-input">Password</InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  aria-label="password"
                  aria-describedby="password-input"
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                />
              </InputGroup>
              <div className="d-flex justify-content-center">
                <TarkovStyleButton
                  text="Log in"
                  clickHandle={submitHandle}
                  height={60}
                  fs={28}
                />
              </div>
            </Form>
          </Col>
        </Row>
        <Row className="d-flex align-items-center justify-content-center height-10">
          <Col md={6} className="text-center">
            New user? <Link to="/register">Register</Link>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export { LoginScreen }
