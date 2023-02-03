import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap"
import { getTaskItemRequirements } from "../reducers/TraderSlice"
import { QuestItem } from "./QuestItem"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"
import { getInventoryItem } from "../reducers/CharacterSlice"
import { useState } from "react"
import { DivLoading } from "./DivLoading"

const radios = [
  { name: "Fullname", value: "full" },
  { name: "Shortname", value: "short" },
]

const QuestItems = ({ playerTasksInfo }) => {
  // hooks state
  const [typingItemFilterStr, setTypingItemFilterStr] = useState("")
  const [itemFilterString, setItemFilterString] = useState("")
  const [questItemList, setQuestItemList] = useState(null)
  const [showCompleteTaskReq, setShowCompletedTaskReq] = useState(true)
  const [searchFullShort, setSearchFullShort] = useState("full")

  // redux
  const { taskItemRequirement } = useSelector((state) => state.trader)
  const { playerInventory, playerFaction } = useSelector(
    (state) => state.character
  )
  const { preference } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // hooks effect
  useEffect(() => {
    if (preference) {
      setShowCompletedTaskReq(preference.showCompletedTaskItemReq)
    }
  }, [preference])

  useEffect(() => {
    if (taskItemRequirement.length === 0) {
      dispatch(getTaskItemRequirements())
    }
  }, [taskItemRequirement])

  useEffect(() => {
    if (!playerInventory) {
      dispatch(getInventoryItem())
    }
  }, [playerInventory])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      setItemFilterString(typingItemFilterStr)
    }, 1500)

    return () => clearTimeout(delayDebounceFn)
  }, [typingItemFilterStr])

  useEffect(() => {
    if (taskItemRequirement.length !== 0) {
      const questItems = taskItemRequirement.map((req) => {
        let completedTaskCount = 0
        if (!showCompleteTaskReq) {
          req.requiredByTask.forEach((req) => {
            if (
              getIndexOfMatchFieldObjArr(
                playerTasksInfo[req.trader].complete,
                "id",
                req.taskId
              ) !== -1
            ) {
              completedTaskCount++
            }
          })
        }
        if (completedTaskCount !== req.requiredByTask.length) {
          return req.item.name
        }
      })
      setQuestItemList(questItems)
    }
  }, [taskItemRequirement, showCompleteTaskReq, playerTasksInfo])

  // handles
  const changeFilterStringHandle = (e) => {
    setTypingItemFilterStr(e.target.value)
  }

  const showCompletedTaskReqHandle = (e) => {
    setShowCompletedTaskReq(e.target.checked)
  }

  return [
    <InputGroup key="item_name_filter_method">
      {radios.map((radio, idx) => (
        <Button
          key={idx}
          id={`radio-${idx}`}
          variant={
            searchFullShort === radio.value ? "secondary" : "outline-secondary"
          }
          onClick={() => {
            setSearchFullShort(radio.value)
          }}
          style={
            searchFullShort !== radio.value ? { "--bs-btn-bg": "white" } : null
          }
        >
          {radio.name}
        </Button>
      ))}
      <Form.Control
        type="text"
        placeholder="item name filter"
        className="text-center"
        onChange={changeFilterStringHandle}
      />
    </InputGroup>,
    <Form.Switch
      key="show_completed_switch"
      label="show completed task req"
      className="my-1 ms-2"
      checked={showCompleteTaskReq}
      onChange={showCompletedTaskReqHandle}
    />,
    <Row key="quest_item_cols">
      {taskItemRequirement.length === 0 && <DivLoading height={300} />}
      {taskItemRequirement.map((req) => {
        if (
          questItemList &&
          questItemList.includes(req.item.name) &&
          (req.factionName === playerFaction || req.factionName === "Any") &&
          ((searchFullShort === "full" &&
            req.item.name
              .toLowerCase()
              .includes(itemFilterString.toLowerCase())) ||
            (searchFullShort === "short" &&
              req.item.shortName
                .toLowerCase()
                .includes(itemFilterString.toLowerCase())))
        )
          return (
            <Col
              key={
                req.factionName +
                req.item.name +
                req.item.foundInRaid +
                req.item.dogTagLevel
              }
              sm={12}
              md={6}
              lg={4}
              xl={3}
              className="d-flex justify-content-center align-items-stretch"
            >
              <QuestItem playerInventory={playerInventory} itemReq={req} />
            </Col>
          )
      })}
    </Row>,
  ]
}

export { QuestItems }
