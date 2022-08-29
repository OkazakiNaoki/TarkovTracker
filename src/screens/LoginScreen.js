import React, { useState } from "react"
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const LoginScreen = () => {
  const submitHandle = () => {}

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
                  required
                />
              </InputGroup>
              <InputGroup className="mb-5">
                <InputGroup.Text id="password-input">Password</InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  aria-label="password"
                  aria-describedby="password-input"
                  required
                />
              </InputGroup>
              <Button
                variant="secondary"
                type="submit"
                className="btn-lg"
                onClick={submitHandle}
              >
                Log in
              </Button>
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
