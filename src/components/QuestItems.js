import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap"
import classNames from "classnames"
import { getTaskItemRequirements } from "../reducers/TraderSlice"
import {
  getInventoryItem,
  setItemFilterKeyword,
  setItemFilterType,
} from "../reducers/CharacterSlice"
import { QuestItem } from "./QuestItem"
import { getIndexOfObjArrWhereFieldEqualTo } from "../helpers/LoopThrough"
import { DivLoading } from "./DivLoading"

const radios = [
  { name: "Fullname", value: "full" },
  { name: "Shortname", value: "short" },
]

const QuestItems = ({ playerTasksInfo }) => {
  //// hooks state
  const [typingItemFilterStr, setTypingItemFilterStr] = useState("")
  const [questItemList, setQuestItemList] = useState(null)
  const [updateItemFilterType, setUpdateItemFilterType] = useState("full")
  // preferences
  const [showCompleteTaskReq, setShowCompletedTaskReq] = useState(true)
  const [questItemFilterDelay, setQuestItemFilterDelay] = useState(1)

  //// redux
  const { taskItemRequirement } = useSelector((state) => state.trader)
  const { playerInventory, playerFaction, itemFilterKeyword, itemFilterType } =
    useSelector((state) => state.character)
  const { preference } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  //// hooks effect
  useEffect(() => {
    if (typingItemFilterStr !== itemFilterKeyword) {
      setTypingItemFilterStr(itemFilterKeyword)
    }
  }, [itemFilterKeyword])

  useEffect(() => {
    if (updateItemFilterType !== itemFilterType) {
      setUpdateItemFilterType(itemFilterType)
    }
  }, [itemFilterType])

  useEffect(() => {
    if (updateItemFilterType !== itemFilterType) {
      dispatch(setItemFilterType(updateItemFilterType))
    }
  }, [updateItemFilterType])

  useEffect(() => {
    if (preference) {
      setShowCompletedTaskReq(preference.showCompletedTaskItemReq)
      setQuestItemFilterDelay(preference.questItemsFilterDelay)
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
      dispatch(setItemFilterKeyword(typingItemFilterStr))
    }, questItemFilterDelay * 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [typingItemFilterStr])

  useEffect(() => {
    if (taskItemRequirement.length !== 0) {
      const questItems = taskItemRequirement.map((req) => {
        let completedTaskCount = 0
        if (!showCompleteTaskReq) {
          req.requiredByTask.forEach((task) => {
            if (
              getIndexOfObjArrWhereFieldEqualTo(
                playerTasksInfo[task.trader].complete,
                "id",
                task.id
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

  //// handles
  const changeFilterStringHandle = (e) => {
    setTypingItemFilterStr(e.target.value)
  }

  const showCompletedTaskReqHandle = (e) => {
    setShowCompletedTaskReq(e.target.checked)
  }

  const changeFilterTypeHandle = (value) => {
    setUpdateItemFilterType(value)
  }

  return [
    <InputGroup key="item_name_filter_method">
      {radios.map((radio, idx) => (
        <Button
          key={idx}
          id={`radio-${idx}`}
          variant={
            itemFilterType === radio.value ? "secondary" : "outline-secondary"
          }
          onClick={() => {
            changeFilterTypeHandle(radio.value)
          }}
          style={
            itemFilterType !== radio.value ? { "--bs-btn-bg": "white" } : null
          }
        >
          {radio.name}
        </Button>
      ))}
      <Form.Control
        type="text"
        placeholder="item name filter"
        className="text-center"
        value={typingItemFilterStr}
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
          (req.factionName === playerFaction || req.factionName === "Any")
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
              className={classNames(
                "d-flex",
                "justify-content-center",
                "align-items-stretch",
                {
                  "d-none":
                    (itemFilterType === "full" &&
                      !req.item.name
                        .toLowerCase()
                        .includes(itemFilterKeyword.toLowerCase())) ||
                    (itemFilterType === "short" &&
                      !req.item.shortName
                        .toLowerCase()
                        .includes(itemFilterKeyword.toLowerCase())),
                }
              )}
            >
              <QuestItem playerInventory={playerInventory} itemReq={req} />
            </Col>
          )
      })}
    </Row>,
  ]
}

export { QuestItems }
