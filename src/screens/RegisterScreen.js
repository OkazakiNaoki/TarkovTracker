import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Row, Col, InputGroup, Form, Alert } from "react-bootstrap"
import { TarkovStyleButton } from "../components/TarkovStyleButton"
import { useNavigate } from "react-router-dom"
import { register } from "../reducers/UserSlice"

const RegisterScreen = () => {
  // redux
  const { user, errorMsg } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // hooks
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [usernameInvalidMsg, setUsernameInvalidMsg] = useState("")
  const [emailInvalidMsg, setEmailInvalidMsg] = useState("")
  const [passwordInvalidMsg, setPasswordInvalidMsg] = useState("")
  const [confirmPasswordInvalidMsg, setConfirmPasswordInvalidMsg] = useState("")

  // route
  const navigate = useNavigate()

  const submitHandle = (e) => {
    e.preventDefault()
    if (
      username.length > 0 &&
      email.length > 0 &&
      password.length >= 8 &&
      confirmPassword.length > 0 &&
      password === confirmPassword
    ) {
      dispatch(register({ username, email, password }))
    } else {
      username.length === 0
        ? setUsernameInvalidMsg("please fill the column")
        : setUsernameInvalidMsg("")
      email.length === 0
        ? setEmailInvalidMsg("please fill the column")
        : setEmailInvalidMsg("")
      password.length < 8
        ? setPasswordInvalidMsg("length of password too short")
        : setPasswordInvalidMsg("")
      confirmPassword !== password
        ? setConfirmPasswordInvalidMsg("password not match")
        : setConfirmPasswordInvalidMsg("")
    }
  }

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      navigate("/")
    }
  }, [user])

  return (
    <Container className="h-100">
      <Row className="d-flex align-items-center justify-content-center height-90">
        <Col md={6} align="center">
          <h1 className="mb-5 sand1">Create new account</h1>
          {errorMsg.length > 0 && <Alert variant="secondary">{errorMsg}</Alert>}
          <Form>
            <InputGroup className="mb-5" hasValidation>
              <InputGroup.Text id="name-input">Name</InputGroup.Text>
              <Form.Control
                placeholder="Enter user name"
                aria-label="name"
                aria-describedby="name-input"
                isInvalid={usernameInvalidMsg.length > 0}
                onChange={(e) => {
                  setUsername(e.target.value)
                }}
              />
              <Form.Control.Feedback type="invalid">
                {usernameInvalidMsg}
              </Form.Control.Feedback>
            </InputGroup>
            <InputGroup className="mb-5" hasValidation>
              <InputGroup.Text id="email-input">E-mail</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Enter e-mail"
                aria-label="email"
                aria-describedby="email-input"
                isInvalid={emailInvalidMsg.length > 0}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
              <Form.Control.Feedback type="invalid">
                {emailInvalidMsg}
              </Form.Control.Feedback>
            </InputGroup>
            <InputGroup className="mb-5" hasValidation>
              <InputGroup.Text id="password-input">Password</InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Enter password"
                aria-label="password"
                aria-describedby="password-input"
                isInvalid={passwordInvalidMsg.length > 0}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
              <Form.Control.Feedback type="invalid">
                {passwordInvalidMsg}
              </Form.Control.Feedback>
            </InputGroup>
            <InputGroup className="mb-5" hasValidation>
              <InputGroup.Text id="confirmpassword-input">
                Confirm password
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Enter password again"
                aria-label="confirmpassword"
                aria-describedby="confirmpassword-input"
                isInvalid={confirmPasswordInvalidMsg.length > 0}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                }}
              />
              <Form.Control.Feedback type="invalid">
                {confirmPasswordInvalidMsg}
              </Form.Control.Feedback>
            </InputGroup>
            <div className="d-flex justify-content-center">
              <TarkovStyleButton
                text="Register"
                clickHandle={submitHandle}
                height={60}
                fs={28}
              />
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export { RegisterScreen }
