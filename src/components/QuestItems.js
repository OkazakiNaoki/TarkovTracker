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
import { haveAdditionalElementFromCompareArr } from "../helpers/LoopThrough"
import { getInventoryItem } from "../reducers/CharacterSlice"
import { useState } from "react"
import { DivLoading } from "./DivLoading"

const excludeQuest = [
  "61e6e60223374d168a4576a6",
  "61e6e621bfeab00251576265",
  "61e6e5e0f5b9633f6719ed95",
]

const QuestItems = () => {
  // hooks state
  const [itemFilterMethod, setItemFilterMethod] = useState("Fullname")
  const [itemFilterString, setItemFilterString] = useState("")
  const [questItemList, setQuestItemList] = useState(null)

  // redux
  const { taskItemRequirement } = useSelector((state) => state.trader)
  const { playerInventory } = useSelector((state) => state.character)
  const dispatch = useDispatch()

  // effects
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
    if (taskItemRequirement.length !== 0 && !questItemList) {
      const questItems = taskItemRequirement.map((req) => {
        if (
          haveAdditionalElementFromCompareArr(
            req.requiredByTask,
            "taskId",
            excludeQuest
          )
        ) {
          return req.item.itemName
        }
      })
      setQuestItemList(questItems)
    }
  }, [taskItemRequirement])

  // handles
  const selectFilterMethodHandle = (e) => {
    setItemFilterMethod(e)
  }

  const changeFilterStringHandle = (e) => {
    setItemFilterString(e.target.value)
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
