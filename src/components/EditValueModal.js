import React, { useEffect, useState } from "react"
import {
  Modal,
  Button,
  Row,
  Col,
  InputGroup,
  Form,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap"
import { Plus, Dash } from "react-bootstrap-icons"

const EditValueModal = ({
  show,
  title = null,
  value,
  minValue = 0,
  maxValue,
  setValueHandle,
  closeHandle,
}) => {
  const [localValue, setLocalValue] = useState(value)
  const [prestep, setPrestep] = useState(1)
  const [step, setStep] = useState(1)
  const [stepUnit, setStepUnit] = useState("1")

  useEffect(() => {
    setLocalValue(value)
  }, [value, title])

  useEffect(() => {
    if (stepUnit === "K") {
      setStep(prestep * 1000)
    } else if (stepUnit === "M") {
      setStep(prestep * 1000000)
    } else {
      setStep(prestep)
    }
  }, [prestep, stepUnit])

  const fiddleValue = (direction) => {
    if (
      localValue + step * direction < minValue ||
      localValue + step * direction > maxValue
    ) {
      return
    }
    setLocalValue(localValue + step * direction)
  }

  const prestepValueChangeHandle = (e) => {
    setPrestep(e.target.value)
  }

  return (
    <Modal
      show={show}
      onHide={closeHandle}
      aria-labelledby={`${title}`}
      centered
      backdrop="static"
      className="bs-modal-bg-black1"
    >
      <Modal.Header closeButton className="sand1">
        {title && <Modal.Title id={`${title}`}>{title}</Modal.Title>}
      </Modal.Header>
      <Modal.Body className="bg-black2">
        <Row>
          <Col xs={2}>
            <div className="d-flex justify-content-center align-items-center h-100">
              <Button
                className="d-flex justify-content-center align-items-center square-60px fs-40px border-radius-20px"
                variant="danger"
                onClick={() => {
                  fiddleValue(-1)
                }}
              >
                <Dash />
              </Button>
            </div>
          </Col>
          <Col xs={8}>
            <div className="d-flex justify-content-center align-items-center">
              <span className="fs-70px">{localValue}</span>
            </div>
          </Col>
          <Col xs={2}>
            <div className="d-flex justify-content-center align-items-center h-100">
              <Button
                className="d-flex justify-content-center align-items-center square-60px fs-40px border-radius-20px"
                variant="success"
                onClick={() => {
                  fiddleValue(1)
                }}
              >
                <Plus />
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup>
              <InputGroup.Text id="step-text">Steps</InputGroup.Text>
              <Form.Control
                aria-label="step of value increment"
                aria-describedby="step-text"
                onChange={prestepValueChangeHandle}
                value={prestep}
                className="text-center"
              />
              <ToggleButton
                type="radio"
                id="step-1"
                variant="dark"
                checked={stepUnit === "1"}
                onChange={(e) => {
                  setStepUnit("1")
                }}
              >
                {"1"}
              </ToggleButton>
              <ToggleButton
                type="radio"
                id="step-K"
                variant="dark"
                checked={stepUnit === "K"}
                onChange={(e) => {
                  setStepUnit("K")
                }}
              >
                {"K"}
              </ToggleButton>
              <ToggleButton
                type="radio"
                id="step-M"
                variant="dark"
                checked={stepUnit === "M"}
                onChange={(e) => {
                  setStepUnit("M")
                }}
              >
                {"M"}
              </ToggleButton>
            </InputGroup>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={setValueHandle.bind(null, localValue)}
          variant="primary"
        >
          Confirm
        </Button>
        <Button onClick={closeHandle} variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { EditValueModal }
