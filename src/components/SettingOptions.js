import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Form, InputGroup } from "react-bootstrap"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { updateUserPreference } from "../reducers/UserSlice"

const SettingOptions = ({ setMessage }) => {
  //// hooks state
  const [showCompletedTaskItemReq, setShowCompletedTaskItemReq] = useState(true)
  const [questItemsFilterDelay, setQuestItemsFilterDelay] = useState(1)
  const [fleaMarketItemIconResolution, setFleaMarketItemIconResolution] =
    useState(64)
  const [saveTriggerFlag, setSaveTriggerFlag] = useState(false)

  //// redux
  const { preference } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  //// hooks effect
  // fetch preference value from redux state
  useEffect(() => {
    if (preference) {
      setShowCompletedTaskItemReq(preference.showCompletedTaskItemReq)
      setQuestItemsFilterDelay(preference.questItemsFilterDelay)
      setFleaMarketItemIconResolution(preference.fleaMarketItemIconResolution)
    }
  }, [preference])

  // save action
  useEffect(() => {
    if (saveTriggerFlag) {
      const newPreference = { ...preference }
      newPreference.showCompletedTaskItemReq = showCompletedTaskItemReq
      newPreference.questItemsFilterDelay = questItemsFilterDelay
      newPreference.fleaMarketItemIconResolution = fleaMarketItemIconResolution

      let modified = false
      for (const key in preference) {
        if (preference[key] !== newPreference[key]) {
          modified = true
          break
        }
      }

      if (modified) {
        dispatch(updateUserPreference({ preference: newPreference }))
        setMessage("")
      } else {
        setMessage("Preference did not change")
      }
      setSaveTriggerFlag(false)
    }
  }, [saveTriggerFlag])

  //// handle
  const showCompletedTaskItemHandle = (e) => {
    if (e.target.value === "show") {
      setShowCompletedTaskItemReq(true)
    } else if (e.target.value === "hide") {
      setShowCompletedTaskItemReq(false)
    }
  }

  const delayFilterQuestItemHandle = (e) => {
    setQuestItemsFilterDelay(e.target.value)
  }

  const fleaMarketItemIconResolutionHandle = (e) => {
    setFleaMarketItemIconResolution(e.target.value)
  }

  const savePreferenceHandle = () => {
    let allowSave = true
    // [Quest item] Filter delay of quest item
    if (isNaN(questItemsFilterDelay)) {
      setMessage(
        "[quest item] Filter delay value of quest item is not a number"
      )
      allowSave = false
    } else if (questItemsFilterDelay < 0 || questItemsFilterDelay > 2) {
      setMessage(
        "[quest item] Filter delay value of quest item should range at 0-2 seconds"
      )
      allowSave = false
    } else {
      setQuestItemsFilterDelay(Number(Number(questItemsFilterDelay).toFixed(2)))
    }

    if (allowSave) {
      // setMessage("good to go")
      setSaveTriggerFlag(true)
    }
  }

  return (
    <Form>
      <div className="border-radius-20px bg-black2 py-3 px-5 mb-3">
        <h2 className="sand1">Flea market</h2>
        <div className="my-1 py-3">
          <Form.Label className="fw-bold">
            Item icon resolution at item searching page
          </Form.Label>
          <Form.Select
            onChange={fleaMarketItemIconResolutionHandle}
            value={fleaMarketItemIconResolution}
          >
            <option value={64}>64px per item grid</option>
            <option value={128}>128px per item grid</option>
          </Form.Select>
        </div>
        <h2 className="sand1">Quest item</h2>
        <div className="my-1 py-3">
          <Form.Label className="fw-bold">
            Default show required item of completed task
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
        <div className="my-1 py-3">
          <Form.Label className="fw-bold">Filter delay after input</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="0-2 seconds"
              value={questItemsFilterDelay}
              onChange={delayFilterQuestItemHandle}
            />
            <InputGroup.Text>seconds</InputGroup.Text>
          </InputGroup>
        </div>
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
