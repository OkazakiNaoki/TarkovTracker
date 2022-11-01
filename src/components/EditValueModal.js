import React, { useEffect, useState } from "react"
import { Modal, Button, Row, Col } from "react-bootstrap"
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
  const [localValue, setLocalValue] = useState(0)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const fiddleValue = (step) => {
    if (localValue + step < minValue || localValue + step > maxValue) {
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
      <Modal.Header closeButton className="sandbeige">
        {title && <Modal.Title id={`${title}`}>{title}</Modal.Title>}
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#191919" }}>
        <Row>
          <Col xs={4}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ aspectRatio: "1" }}
            >
              <Button
                className="d-flex justify-content-center align-items-center"
                variant="danger"
                onClick={() => {
                  fiddleValue(-1)
                }}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "20px",
                  fontSize: "40px",
                  verticalAlign: "middle",
                }}
              >
                <Dash />
              </Button>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ aspectRatio: "1" }}
            >
              <span style={{ fontSize: "70px" }}>{localValue}</span>
            </div>
          </Col>
          <Col xs={4}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ aspectRatio: "1" }}
            >
              <Button
                className="d-flex justify-content-center align-items-center"
                variant="success"
                onClick={() => {
                  fiddleValue(1)
                }}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "20px",
                  fontSize: "40px",
                }}
              >
                <Plus />
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

export { EditValueModal }
