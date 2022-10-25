import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Col, Container, Image, Row } from "react-bootstrap"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { AddValueModal } from "../components/AddValueModal"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"
import blueCheck from "../../public/static/images/blue_check.png"
import expIcon from "../../public/static/images/icon_experience_big.png"
import standingIcon from "../../public/static/images/standing_icon.png"
import skillIcon from "../../public/static/images/tab_icon_skills.png"
import { ItemSingleGrid } from "./ItemSingleGrid"

const TaskDetail = ({
  task,
  showCount = false,
  completeable = false,
  finishClickHandles,
  taskCompleteHandle,
  disableTurnIn = false,
}) => {
  // hooks
  const [completeObjective, setCompleteObjective] = useState(null)
  const [objectiveProgress, setObjectiveProgress] = useState(null)
  const [closeAddValueModal, setCloseAddValueModal] = useState(null)

  // redux
  const { playerCompletedObjectives, playerObjectiveProgress } = useSelector(
    (state) => state.character
  )

  // effects
  useEffect(() => {
    if (completeable && playerCompletedObjectives) {
      const index = getIndexOfMatchFieldObjArr(
        playerCompletedObjectives,
        "taskId",
        task.id
      )
      if (index !== -1) {
        setCompleteObjective(playerCompletedObjectives[index]["objectives"])
      } else {
        setCompleteObjective([])
      }
    }
  }, [playerCompletedObjectives])

  useEffect(() => {
    if (completeObjective) {
      let allComplete = true
      for (let i = 0; i < task.objectives.length; i++) {
        if (!completeObjective.includes(task.objectives[i].id)) {
          allComplete = false
          break
        }
      }
      if (allComplete) {
        completeable = false
        taskCompleteHandle(task.id)
      }
    }
  }, [completeObjective])

  useEffect(() => {
    if (!closeAddValueModal && completeable) {
      const initModalOnOff = {}
      task.objectives.forEach((objective) => {
        if ("count" in objective) {
          initModalOnOff[objective.id] = false
        }
      })
      setCloseAddValueModal(initModalOnOff)
    }
  })

  useEffect(() => {
    if (completeable && playerObjectiveProgress) {
      const newProgress = {}
      task.objectives.forEach((objective) => {
        const index = getIndexOfMatchFieldObjArr(
          playerObjectiveProgress,
          "objectiveId",
          objective.id
        )
        if (index !== -1 && "count" in objective) {
          newProgress[objective.id] = playerObjectiveProgress[index]["progress"]
        } else if ("count" in objective) {
          newProgress[objective.id] = 0
        }
      })
      setObjectiveProgress(newProgress)
    }
  }, [playerObjectiveProgress])

  // handles
  const openCloseModal = (objectiveId) => {
    if (objectiveId in objectiveProgress) {
      const copy = { ...closeAddValueModal }
      copy[objectiveId] = !copy[objectiveId]
      setCloseAddValueModal(copy)
    }
  }

  const confirmTurnInHandle = (newValue, taskId, objectiveId, cap) => {
    if (newValue === cap) {
      finishClickHandles(taskId, objectiveId, newValue, true)
    } else {
      finishClickHandles(taskId, objectiveId, newValue)
    }
  }

  let colIndex = 0

  return (
    <div>
      {completeable &&
        objectiveProgress &&
        task.objectives.map((objective, i) => {
          return (
            objective.id in objectiveProgress && (
              <AddValueModal
                key={`${objective.id}_modal`}
                show={closeAddValueModal[objective.id]}
                value={objectiveProgress[objective.id]}
                valueCap={objective.count}
                setValueHandle={(v) => {
                  confirmTurnInHandle(v, task.id, objective.id, objective.count)
                  openCloseModal(objective.id)
                }}
                closeHandle={() => {
                  openCloseModal(objective.id)
                }}
              />
            )
          )
        })}
      <Container className="d-flex align-items-start p-3">
        <Image
          src={`/asset/${task.image}.png`}
          style={{ objectFit: "contain" }}
        />
        <p className="ps-3">{task.description}</p>
      </Container>
      <div className="px-4">Objective(s)</div>
      {task.objectives.map((objective, i) => {
        return (
          <div
            key={"objective-" + i}
            className="d-flex justify-content-center mb-2 p-2"
            style={{
              backgroundColor: completeable
                ? completeObjective &&
                  (completeObjective.includes(objective.id)
                    ? "#101d24"
                    : "#2a2c2e")
                : "#2a2c2e",
            }}
          >
            <div className="d-inline-block">{objective.description}</div>
            {objectiveProgress &&
            objective.id in objectiveProgress &&
            showCount &&
            "count" in objective ? (
              <div className="mx-3 fw-bold">{`${
                objectiveProgress[objective.id]
              }/${objective.count}`}</div>
            ) : null}
            {completeable &&
              completeObjective &&
              (completeObjective.includes(objective.id) ? (
                <Image src={blueCheck} className="ms-1" />
              ) : disableTurnIn ? null : (
                <div className="ms-1">
                  <TarkovStyleButton
                    text="TURN IN"
                    height={30}
                    clickHandle={() => {
                      openCloseModal(objective.id)
                    }}
                  />
                </div>
              ))}
          </div>
        )
      })}
      <div className="px-4">Rewards</div>
      <div className="p-2">
        <Row xs={4} className="g-2 px-5" style={{ backgroundColor: "#090a0b" }}>
          <Col style={{ marginTop: colIndex++ < 4 ? "0px" : "none" }}>
            <div className="d-flex align-items-center justify-content-center task-reward-bg h-100">
              <div className="text-center">
                <Image src={expIcon} />
                <div>{"+" + task.experience}</div>
              </div>
            </div>
          </Col>
          {task.finishRewards.traderStanding.map((finishStanding, i) => {
            return (
              <Col
                key={"standing_" + i}
                style={{ marginTop: colIndex++ < 4 ? "0px" : "none" }}
              >
                <div className="d-flex align-items-center justify-content-center task-reward-bg h-100">
                  <div className="text-center">
                    <Image src={standingIcon} />
                    <div>{finishStanding.trader.name}</div>
                    <div>
                      {(finishStanding.standing > 0 ? " +" : " ") +
                        finishStanding.standing}
                    </div>
                  </div>
                </div>
              </Col>
            )
          })}
          {task.finishRewards.items.map((finishItem, i) => {
            return (
              <Col
                key={"item_" + i}
                style={{ marginTop: colIndex++ < 4 ? "0px" : "none" }}
              >
                <div className="task-reward-bg p-1 h-100">
                  <div className="d-flex align-items-center justify-content-left h-100">
                    <div className="d-inline-block">
                      <ItemSingleGrid
                        itemId={finishItem.item.id}
                        amount={finishItem.count > 1 ? finishItem.count : null}
                        foundInRaid={true}
                      />
                    </div>
                    <p
                      className="d-inline-block mb-0 ps-2"
                      style={{ fontSize: "14px" }}
                    >
                      {finishItem.count > 1
                        ? finishItem.item.name + " (" + finishItem.count + ")"
                        : finishItem.item.name}
                    </p>
                  </div>
                </div>
              </Col>
            )
          })}
          {task.finishRewards.offerUnlock.map((finishOffer, i) => {
            return (
              <Col
                key={"offer_" + i}
                style={{ marginTop: colIndex++ < 4 ? "0px" : "none" }}
              >
                <div className="task-reward-bg p-1 h-100">
                  <div className="d-flex align-items-center justify-content-left h-100">
                    <div className="d-inline-block">
                      <ItemSingleGrid
                        itemId={finishOffer.item.id}
                        locked={true}
                      />
                    </div>
                    <p
                      className="d-inline-block mb-0 ps-2"
                      style={{ fontSize: "14px" }}
                      title={
                        finishOffer.trader.name + " LL" + finishOffer.level
                      }
                    >
                      {finishOffer.item.name}
                    </p>
                  </div>
                </div>
              </Col>
            )
          })}
          {task.finishRewards.skillLevelReward.map((finishSkill, i) => {
            return (
              <Col
                key={"skill_" + i}
                style={{ marginTop: colIndex++ < 4 ? "0px" : "none" }}
              >
                <div className="d-flex align-items-center justify-content-center task-reward-bg p-1 h-100">
                  <div className="text-center">
                    <Image src={skillIcon} />
                    <div>{finishSkill.name}</div>
                    <div>{"+" + finishSkill.level + " level(s)"}</div>
                  </div>
                </div>
              </Col>
            )
          })}
          {task.finishRewards.traderUnlock.map((finishTrader, i) => {
            return (
              <Col
                key={"trader_" + i}
                style={{ marginTop: colIndex++ < 4 ? "0px" : "none" }}
              >
                <div className="task-reward-bg p-1 h-100">
                  <div className="d-flex align-items-center justify-content-left h-100">
                    <Image
                      src={`/asset/${finishTrader.id}.png`}
                      style={{ width: "64px", height: "64px" }}
                    />
                    <p
                      className="d-inline-block mb-0 ps-2"
                      style={{ fontSize: "14px" }}
                    >
                      {finishTrader.name}
                    </p>
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      </div>
    </div>
  )
}

export { TaskDetail }
