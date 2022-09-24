import React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col } from "react-bootstrap"
import { getTaskItemRequirements } from "../reducers/TraderSlice"
import { QuestItem } from "./QuestItem"
import { haveAdditionalElementFromCompareArr } from "../helpers/LoopThrough"

const excludeQuest = [
  "61e6e60223374d168a4576a6",
  "61e6e621bfeab00251576265",
  "61e6e5e0f5b9633f6719ed95",
]

const QuestItems = () => {
  // redux
  const { taskItemRequirement } = useSelector((state) => state.trader)
  const dispatch = useDispatch()

  // effects
  useEffect(() => {
    if (taskItemRequirement.length === 0) {
      dispatch(getTaskItemRequirements())
    }
  }, [taskItemRequirement])

  return (
    <Row>
      {taskItemRequirement.map((req) => {
        if (
          haveAdditionalElementFromCompareArr(
            req.requiredByTask,
            "taskId",
            excludeQuest
          )
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
              className="d-flex align-items-stretch"
            >
              <QuestItem itemReq={req} />
            </Col>
          )
      })}
    </Row>
  )
}

export { QuestItems }
