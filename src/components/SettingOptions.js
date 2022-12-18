import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Form } from "react-bootstrap"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { updateUserPreference } from "../reducers/UserSlice"

const SettingOptions = ({ setMessage }) => {
  // hooks state
  const [showCompletedTaskItemReq, setShowCompletedTaskItemReq] = useState(true)
  const [saveTriggerFlag, setSaveTriggerFlag] = useState(false)

  // redux
  const { preference } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // hooks effect
  useEffect(() => {
    if (preference) {
      setShowCompletedTaskItemReq(preference.showCompletedTaskItemReq)
    }
  }, [preference])

  useEffect(() => {
    if (saveTriggerFlag) {
      const newPreference = { ...preference }
      newPreference.showCompletedTaskItemReq = showCompletedTaskItemReq

      const modified = false
      for (const key in preference) {
        if (preference[key] !== newPreference[key]) {
          modified = true
          break
        }
      }

      if (modified) {
        dispatch(updateUserPreference({ preference: newPreference }))
      } else {
        setMessage("Preference did not change")
      }
      setSaveTriggerFlag(false)
    }
  }, [saveTriggerFlag])

  // handle
  const showCompletedTaskItemHandle = (e) => {
    if (e.target.value === "show") {
      setShowCompletedTaskItemReq(true)
    } else if (e.target.value === "hide") {
      setShowCompletedTaskItemReq(false)
    }
  }

  const savePreferenceHandle = () => {
    setSaveTriggerFlag(true)
  }

  return (
    <Form>
      <div className="gray-rounded-20 py-3 px-5 mb-3">
        <Form.Label>
          [Quest item] Show required item of completed task
        </Form.Label>
        <Form.Check
          type="radio"
          name="completedTaskItem"
          label="show"
          value="show"
          checked={showCompletedTaskItemReq}
          onChange={showCompletedTaskItemHandle}
        />
        <Form.Check
          type="radio"
          name="completedTaskItem"
          label="hide"
          value="hide"
          checked={!showCompletedTaskItemReq}
          onChange={showCompletedTaskItemHandle}
        />
      </div>
      <div className="d-flex justify-content-center">
        <TarkovStyleButton
          text="SAVE"
          clickHandle={savePreferenceHandle}
          height={40}
          fs={20}
        />
      </div>
    </Form>
  )
}

export { SettingOptions }
