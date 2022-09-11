import React, { useEffect, useState } from "react"
import { Modal, Button, Row, Col } from "react-bootstrap"

const AddValueModal = ({
  show,
  title = null,
  value,
  valueCap,
  setValueHandle,
  closeHandle,
}) => {
  const [localValue, setLocalValue] = useState(0)

  useEffect(() => {
    if (value !== 0) {
      setLocalValue(value)
    }
  }, [value])

  const fiddleValue = (step) => {
    if (localValue + step < 0 || localValue + step > valueCap) {
      return
    }
    setLocalValue(localValue + step)
  }

  return (
    <Modal
      show={show}
      onHide={closeHandle}
      aria-labelledby={`${title}`}
      centered
      backdrop="static"
      style={{ "--bs-modal-bg": "#080605" }}
    >
      <Modal.Header closeButton>
        {title && <Modal.Title id={`${title}`}>{title}</Modal.Title>}
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={4}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ aspectRatio: "1" }}
            >
              <Button
                variant="danger"
                className="fs-1 rounded-circle"
                onClick={() => {
                  fiddleValue(-1)
                }}
                style={{ width: "60%", height: "60%" }}
              >
                -
              </Button>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ aspectRatio: "1" }}
            >
              <span className="fs-1">{localValue}</span>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ aspectRatio: "1" }}
            >
              <Button
                variant="success"
                className="fs-1 rounded-circle"
                onClick={() => {
                  fiddleValue(1)
                }}
                style={{ width: "60%", height: "60%" }}
              >
                +
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setValueHandle(localValue)
          }}
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

export { AddValueModal }
