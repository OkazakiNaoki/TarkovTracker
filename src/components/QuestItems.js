import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Row,
  Col,
  InputGroup,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap"
import { getTaskItemRequirements } from "../reducers/TraderSlice"
import { QuestItem } from "./QuestItem"
import {
  getIndexOfMatchFieldObjArr,
  haveAdditionalElementFromCompareArr,
} from "../helpers/LoopThrough"
import { getInventoryItem } from "../reducers/CharacterSlice"
import { useState } from "react"
import { DivLoading } from "./DivLoading"

const excludeQuest = [
  "61e6e60223374d168a4576a6",
  "61e6e621bfeab00251576265",
  "61e6e5e0f5b9633f6719ed95",
]

const QuestItems = ({ playerTasksInfo }) => {
  // hooks state
  const [itemFilterMethod, setItemFilterMethod] = useState("Fullname")
  const [itemFilterString, setItemFilterString] = useState("")
  const [questItemList, setQuestItemList] = useState(null)
  const [showCompleteTaskReq, setShowCompletedTaskReq] = useState(true)

  // redux
  const { taskItemRequirement } = useSelector((state) => state.trader)
  const { playerInventory } = useSelector((state) => state.character)
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
    if (taskItemRequirement.length !== 0) {
      const questItems = taskItemRequirement.map((req) => {
        const haveNormalQuest = haveAdditionalElementFromCompareArr(
          req.requiredByTask,
          "taskId",
          excludeQuest
        )
        let show = true
        if (!showCompleteTaskReq) {
          let completeCount = 0
          req.requiredByTask.forEach((req) => {
            if (
              getIndexOfMatchFieldObjArr(
                playerTasksInfo[req.trader].complete,
                "id",
                req.taskId
              ) !== -1
            ) {
              completeCount++
            }
          })
          if (completeCount === req.requiredByTask.length) {
            show = false
          }
        }
        if (haveNormalQuest && show) {
          return req.item.itemName
        }
      })
      setQuestItemList(questItems)
    }
  }, [taskItemRequirement, showCompleteTaskReq])

  // handles
  const selectFilterMethodHandle = (e) => {
    setItemFilterMethod(e)
  }

  const changeFilterStringHandle = (e) => {
    setItemFilterString(e.target.value)
  }

  const showCompletedTaskReqHandle = (e) => {
    setShowCompletedTaskReq(e.target.checked)
  }

  return [
    <InputGroup key="item_name_filter_method">
      <DropdownButton
        variant="secondary"
        title={itemFilterMethod}
        id="item-filter-type-dropdown"
        onSelect={selectFilterMethodHandle}
      >
        <Dropdown.Item href="#" eventKey="Fullname">
          Fullname
        </Dropdown.Item>
        <Dropdown.Item href="#" eventKey="Shortname">
          Shortname
        </Dropdown.Item>
      </DropdownButton>
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
          questItemList.includes(req.item.itemName) &&
          ((itemFilterMethod === "Fullname" &&
            req.item.itemName
              .toLowerCase()
              .includes(itemFilterString.toLowerCase())) ||
            (itemFilterMethod === "Shortname" &&
              req.item.shortName
                .toLowerCase()
                .includes(itemFilterString.toLowerCase())))
        )
          return (
            <Col
              key={
                req.item.itemName + req.item.foundInRaid + req.item.dogTagLevel
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
