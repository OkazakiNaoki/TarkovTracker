import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Container,
  Row,
  Col,
  Nav,
  Tab,
  Form,
  InputGroup,
  Alert,
} from "react-bootstrap"
import { changePassword } from "../reducers/UserSlice"
import { TarkovStyleButton } from "../components/TarkovStyleButton"

const UserSettingScreen = () => {
  // hooks
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordInvalidMsg, setPasswordInvalidMsg] = useState("")
  const [confirmPasswordInvalidMsg, setConfirmPasswordInvalidMsg] = useState("")

  // redux
  const { errorMsg, successMsg } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // handle
  const submitHandle = (e) => {
    e.preventDefault()
    if (password.length >= 8 && password === confirmPassword) {
      dispatch(changePassword({ password }))
      setPasswordInvalidMsg("")
      setConfirmPasswordInvalidMsg("")
      setPassword("")
      setConfirmPassword("")
    } else {
      password.length < 8
        ? setPasswordInvalidMsg("length of password too short")
        : setPasswordInvalidMsg("")
      confirmPassword !== password
        ? setConfirmPasswordInvalidMsg("password not match")
        : setConfirmPasswordInvalidMsg("")
    }
  }

  return (
    <>
      <Container className="py-5">
        <h1 className="sandbeige mb-5">Setting</h1>
        <Tab.Container id="user-settings" defaultActiveKey="user-data">
          <Row className="gx-5">
            <Col sm={4}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item className="mb-1">
                  <Nav.Link
                    eventKey="user-data"
                    style={{
                      "--bs-nav-pills-link-active-bg": "#191919",
                      "--bs-nav-pills-link-active-color": "#b7ad9c",
                      "--bs-nav-link-hover-color": "#555",
                      "--bs-nav-link-color": "white",
                    }}
                  >
                    Change password
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="preference"
                    style={{
                      "--bs-nav-pills-link-active-bg": "#191919",
                      "--bs-nav-pills-link-active-color": "#b7ad9c",
                      "--bs-nav-link-hover-color": "#555",
                      "--bs-nav-link-color": "white",
                    }}
                  >
                    Helper preference
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                <Tab.Pane eventKey="user-data">
                  {errorMsg.length > 0 && (
                    <Alert variant="secondary" className="text-center">
                      {errorMsg}
                    </Alert>
                  )}
                  {successMsg.length > 0 && (
                    <Alert variant="secondary" className="text-center">
                      {successMsg}
                    </Alert>
                  )}
                  <Form className="px-5">
                    <InputGroup className="mb-4" hasValidation>
                      <InputGroup.Text id="password-input">
                        Password
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        aria-label="password"
                        aria-describedby="password-input"
                        isInvalid={passwordInvalidMsg.length > 0}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {passwordInvalidMsg}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup className="mb-4" hasValidation>
                      <InputGroup.Text id="confirmpassword-input">
                        Confirm password
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        placeholder="Enter password again"
                        aria-label="confirmpassword"
                        aria-describedby="confirmpassword-input"
                        isInvalid={confirmPasswordInvalidMsg.length > 0}
                        value={confirmPassword}
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
                        text="Change"
                        clickHandle={submitHandle}
                        height={40}
                        fs={20}
                      />
                    </div>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey="preference">
                  <div className="px-5">preference option placeholder</div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  )
}

export { UserSettingScreen }
