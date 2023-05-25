import React, { useState, useEffect } from "react"
import {
  Modal,
  Button,
  ToggleButton,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap"
import { Plus } from "react-bootstrap-icons"

const SavePresetModal = ({ show, confirmHandle, closeHandle, presets }) => {
  //// state
  const [isPresetSlotFull, setIsPresetSlotFull] = useState(false)
  const [overrideTargetObjects, setOverrideTargetObjects] = useState([])
  const [selectedOverrideTarget, setSelectedOverrideTarget] = useState(0)
  const [editPresetName, setEditPresetName] = useState("")
  const [warningText, setWarningText] = useState("")

  //// effect
  useEffect(() => {
    if (presets) {
      setIsPresetSlotFull(presets.length >= 5)

      const overrideTarget = []
      presets.forEach((preset, i) => {
        const slotObject = { name: preset.presetName, index: i }
        overrideTarget.push(slotObject)
      })
      setOverrideTargetObjects(overrideTarget)

      if (presets.length >= 5) {
        // default index 0
        setSelectedOverrideTarget(0)
        setEditPresetName(presets[0].presetName)
      } else {
        // default add new push
        setSelectedOverrideTarget(-1)
        setEditPresetName("")
      }
    }
  }, [presets])

  useEffect(() => {
    removeWarning()
  }, [selectedOverrideTarget])

  useEffect(() => {
    if (editPresetName.length > 0) {
      removeWarning()
    }
  }, [editPresetName])

  //// handle function
  const confirmExtendFunction = () => {
    if (editPresetName.length > 0) {
      if (presets && selectedOverrideTarget !== -1) {
        confirmHandle(editPresetName, selectedOverrideTarget)
      } else {
        confirmHandle(editPresetName)
      }
      closeHandle()
    } else {
      setWarningText("Preset name length must larger than 1 character!")
    }
  }

  const removeWarning = () => {
    if (warningText.length > 0) {
      setWarningText("")
    }
  }

  return (
    <Modal
      show={show}
      onHide={closeHandle}
      aria-labelledby="save-preset"
      centered
      backdrop="static"
      className="bs-modal-bg-black1"
    >
      <Modal.Header closeButton>
        <Modal.Title className="sand1" id="save-preset-title">
          {presets && isPresetSlotFull ? "Override preset" : "Save preset"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-black2">
        {presets && (
          <>
            {/* preset slot index selection */}
            <div className="mb-3">
              {selectedOverrideTarget === -1
                ? `Save into new slot. ${
                    5 - presets.length
                  } empty slot(s) remain.`
                : "Select one preset slot to override"}
            </div>
            <div className="d-flex justify-content-center mb-3">
              <ButtonGroup>
                {overrideTargetObjects.map((overrideTarget, i) => (
                  <ToggleButton
                    className="px-4"
                    key={`preset_slot_${i}`}
                    id={`override-target-${i}`}
                    type="radio"
                    variant="outline-secondary"
                    name="radio"
                    checked={selectedOverrideTarget === overrideTarget.index}
                    onChange={() => {
                      setSelectedOverrideTarget(overrideTarget.index)
                      setEditPresetName(overrideTarget.name)
                    }}
                  >
                    {overrideTarget.index + 1}
                  </ToggleButton>
                ))}
                {!isPresetSlotFull && (
                  <ToggleButton
                    className="px-3"
                    id="add-new-preset"
                    type="radio"
                    variant="outline-secondary"
                    name="radio"
                    checked={selectedOverrideTarget === -1}
                    onChange={() => {
                      setSelectedOverrideTarget(-1)
                      setEditPresetName("")
                    }}
                  >
                    <Plus size={24} />
                  </ToggleButton>
                )}
              </ButtonGroup>
            </div>

            {/* existed preset name dropdown selection */}
            {presets.length > 0 &&
              overrideTargetObjects.length > 0 &&
              selectedOverrideTarget !== -1 && (
                <>
                  <div className="mb-3">Select by existed preset name</div>
                  <div className="d-flex justify-content-center mb-3">
                    <DropdownButton
                      variant="secondary"
                      menuVariant="dark"
                      title={overrideTargetObjects[selectedOverrideTarget].name}
                    >
                      {overrideTargetObjects &&
                        overrideTargetObjects.map((overrideTarget, i) => {
                          return (
                            <Dropdown.Item
                              key={`preset_name_dropdown_${i}`}
                              eventKey={String(i + 1)}
                              active={
                                overrideTarget.index === selectedOverrideTarget
                              }
                              onClick={() => {
                                setSelectedOverrideTarget(overrideTarget.index)
                                setEditPresetName(overrideTarget.name)
                              }}
                            >
                              {overrideTarget.name}
                            </Dropdown.Item>
                          )
                        })}
                    </DropdownButton>
                  </div>
                </>
              )}

            {/* edit preset name */}
            <>
              <div className="mb-3">
                {selectedOverrideTarget === -1
                  ? "Set preset name"
                  : "Modify preset name"}
              </div>
              <Form.Control
                className="mb-3 text-center"
                type="text"
                value={editPresetName}
                onChange={(e) => {
                  setEditPresetName(e.currentTarget.value)
                }}
              />
            </>

            {/* warning info */}
            {warningText.length > 0 && <div className="red">{warningText}</div>}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={confirmExtendFunction} variant="primary">
          Confirm
        </Button>
        <Button onClick={closeHandle} variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { SavePresetModal }
