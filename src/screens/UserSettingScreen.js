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
import { changePassword, resetMsg } from "../reducers/UserSlice"
import { TarkovStyleButton } from "../components/TarkovStyleButton"
import { SettingOptions } from "../components/SettingOptions"

const UserSettingScreen = () => {
  // hooks
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordInvalidMsg, setPasswordInvalidMsg] = useState("")
  const [confirmPasswordInvalidMsg, setConfirmPasswordInvalidMsg] = useState("")
  const [resetAlertMsgFlag, setResetMsgFlag] = useState(false)
  const [localMsg, setLocalMsg] = useState("")

  // redux
  const { errorMsg, successMsg } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // hooks effect
  useEffect(() => {
    if (resetAlertMsgFlag) {
      dispatch(resetMsg())
      setLocalMsg("")
      setResetMsgFlag(false)
    }
  }, [resetAlertMsgFlag])

  // handles
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

  const resetAlertMsgHandle = () => {
    setResetMsgFlag(true)
  }

  return (
    <>
      <Container className="py-5">
        <h1 className="sand1 mb-5">Setting</h1>
        <Tab.Container
          id="user-settings"
          defaultActiveKey="user-data"
          onSelect={resetAlertMsgHandle}
        >
          <Row className="gx-5">
            <Col sm={4}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item className="mb-1">
                  <Nav.Link eventKey="user-data">Change password</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="preference">
                    Tarkov guide preference
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={8}>
              <Tab.Content>
                <Tab.Pane eventKey="user-data">
                  <div className="px-5">
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
                    <Form>
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
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="preference">
                  <div className="px-5">
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
                    {localMsg.length > 0 && (
                      <Alert variant="secondary" className="text-center">
                        {localMsg}
                      </Alert>
                    )}
                    <SettingOptions setMessage={setLocalMsg} />
                  </div>
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
