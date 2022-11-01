import React, { useEffect, useState } from "react"
import { Modal, Button, Row, Col, Form } from "react-bootstrap"
import RangeSlider from "react-bootstrap-range-slider"

const TraderRelationModal = ({
  show,
  title,
  playerRep,
  playerSpent,
  setRepHandle,
  setSpentHandle,
  closeHandle,
}) => {
  const [rep, setRep] = useState(0)
  const [spent, setSpent] = useState(0)

  useEffect(() => {
    setRep(playerRep)
  }, [playerRep])

  useEffect(() => {
    setSpent(playerSpent)
  }, [playerSpent])

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
        <Form>
          <Form.Group as={Row} className="align-items-end">
            <Col xs="10">
              <Form.Label>Reputation</Form.Label>
              <RangeSlider
                min={0}
                max={1}
                step={0.01}
                variant="secondary"
                tooltipPlacement="top"
                value={rep}
                onChange={(e) => setRep(e.target.value)}
              />
            </Col>
            <Col xs="2">
              <Form.Control
                value={rep}
                onChange={(e) => setRep(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-end">
            <Col xs="10">
              <Form.Label>Money spent</Form.Label>
              <RangeSlider
                min={0}
                max={500}
                step={10}
                variant="secondary"
                tooltipPlacement="top"
                tooltipLabel={(currentValue) => `${currentValue}K`}
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
              />
            </Col>
            <Col xs="2">
              <Form.Control
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setRepHandle(rep)
            setSpentHandle(spent)
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

export { TraderRelationModal }
