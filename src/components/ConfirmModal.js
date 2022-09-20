import React from "react"
import { Modal, Button } from "react-bootstrap"

const ConfirmModal = ({
  show,
  title = null,
  content = null,
  confirmHandle,
  closeHandle,
}) => {
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
        {title && (
          <Modal.Title className="sandbeige" id={`${title}`}>
            {title}
          </Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>
        <div style={{ whiteSpace: "break-spaces" }}>{content}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            confirmHandle()
            closeHandle()
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

export { ConfirmModal }
