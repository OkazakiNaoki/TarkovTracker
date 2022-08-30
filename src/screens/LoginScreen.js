import React, { useState, useEffect } from "react"
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../reducers/UserSlice"
import { TarkovButton } from "../components/TarkovButton"

const LoginScreen = () => {
  // redux
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // hooks
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // route
  const navigate = useNavigate()

  useEffect(() => {
    if (Object.keys(user).length > 0) {
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
        <Row
          className="d-flex align-items-center justify-content-center"
          style={{ height: "90%" }}
        >
          <Col md={6} align="center">
            <h1 className="mb-5 sandbeige">Log in</h1>
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
              <TarkovButton
                useLink={false}
                text="Log in"
                clickHandle={submitHandle}
              />
            </Form>
          </Col>
        </Row>
        <Row
          className="d-flex align-items-center justify-content-center"
          style={{ height: "10%" }}
        >
          <Col md={6} className="text-center">
            New user? <Link to="/register">Register</Link>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export { LoginScreen }
