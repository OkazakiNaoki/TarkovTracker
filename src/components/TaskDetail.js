import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Container, Image, Row } from "react-bootstrap"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { EditValueModal } from "./EditValueModal"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"
import blueCheck from "../../public/static/images/blue_check.png"
import expIcon from "../../public/static/images/icon_experience_big.png"
import standingIcon from "../../public/static/images/standing_icon.png"
import skillIcon from "../../public/static/images/tab_icon_skills.png"
import { ItemSingleGrid } from "./ItemSingleGrid"
import { ConfirmModal } from "./ConfirmModal"

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
  const [closeAddValueModal, setCloseAddValueModal] = useState(null) // for each item requirement objective
  const [closeConfirmModal, setCloseConfirmModal] = useState(null) // for each simple target objective

  // redux
  const { playerCompletedObjectives, playerObjectiveProgress } = useSelector(
    (state) => state.character
  )

  // local variables
  const objectiveTypes = ["visit", "extract"]

  /// effects
  // get completed objectives of this task, if there's no record then init with empty array
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

  // on completed objectives update, check if all objectives of this task have done
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

  // if objective modal on/off flag object is empty, init one
  useEffect(() => {
    if (!closeAddValueModal && !closeConfirmModal && completeable) {
      const initAddValueModal = {}
      const initConfirmModal = {}
      task.objectives.forEach((objective) => {
        if ("count" in objective) {
          initAddValueModal[objective.id] = false
        } /*if (objectiveTypes.includes(objective.type))*/ else {
          initConfirmModal[objective.id] = false
        }
      })
      setCloseAddValueModal(initAddValueModal)
      setCloseConfirmModal(initConfirmModal)
    }
  }, [closeAddValueModal, closeConfirmModal])

  // get player previous objective progress if there's one
  useEffect(() => {
    if (completeable && playerObjectiveProgress) {
      const newProgress = {}
      task.objectives.forEach((objective) => {
        if ("count" in objective) {
          const index = getIndexOfMatchFieldObjArr(
            playerObjectiveProgress,
            "objectiveId",
            objective.id
          )
          if (index !== -1) {
            newProgress[objective.id] =
              playerObjectiveProgress[index]["progress"]
          } else {
            newProgress[objective.id] = 0
          }
        }
      })
      setObjectiveProgress(newProgress)
    }
  }, [playerObjectiveProgress])

  // handles
  const openCloseAddValueModal = (objectiveId) => {
    if (objectiveId in closeAddValueModal) {
      const copy = { ...closeAddValueModal }
      copy[objectiveId] = !copy[objectiveId]
      setCloseAddValueModal(copy)
    }
  }

  const openCloseConfirmModal = (objectiveId) => {
    if (objectiveId in closeConfirmModal) {
      const copy = { ...closeConfirmModal }
      copy[objectiveId] = !copy[objectiveId]
      setCloseConfirmModal(copy)
    }
  }

  const confirmTurnInHandle = (newValue, taskId, objectiveId, cap) => {
    if (newValue === cap) {
      finishClickHandles(taskId, objectiveId, newValue, true)
    } else {
      finishClickHandles(taskId, objectiveId, newValue)
    }
  }

  const completeSimpleObjectiveHandle = (taskId, objectiveId) => {
    finishClickHandles(taskId, objectiveId, null, true)
  }

  const turnInHandle = (objectiveId) => {
    if (objectiveId in closeAddValueModal) {
      openCloseAddValueModal(objectiveId)
    } else if (objectiveId in closeConfirmModal) {
      openCloseConfirmModal(objectiveId)
    }
  }

  let colIndex = 0

  return (
    <div>
      {completeable &&
        closeAddValueModal &&
        task.objectives.map((objective, i) => {
          return (
            objective.id in closeAddValueModal && (
              <EditValueModal
                key={`${objective.id}_modal`}
                show={closeAddValueModal[objective.id]}
                value={objectiveProgress[objective.id]}
                maxValue={objective.count}
                setValueHandle={(v) => {
                  confirmTurnInHandle(v, task.id, objective.id, objective.count)
                  openCloseAddValueModal(objective.id)
                }}
                closeHandle={() => {
                  openCloseAddValueModal(objective.id)
                }}
              />
            )
          )
        })}
      {completeable &&
        closeConfirmModal &&
        task.objectives.map((objective, i) => {
          return (
            objective.id in closeConfirmModal && (
              <ConfirmModal
                key={`${objective.id}_modal`}
                show={closeConfirmModal[objective.id]}
                title="Objective completed?"
                content={objective.description}
                confirmHandle={(v) => {
                  completeSimpleObjectiveHandle(task.id, objective.id)
                  openCloseConfirmModal(objective.id)
                }}
                closeHandle={() => {
                  openCloseConfirmModal(objective.id)
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
            className="d-flex align-items-center justify-content-center mb-2 p-2"
            style={{
              backgroundColor: completeable
                ? completeObjective &&
                  (completeObjective.includes(objective.id)
                    ? "#101d24"
                    : "#2a2c2e")
                : "#2a2c2e",
            }}
          >
            <p className="mb-0">{objective.description}</p>
            {objectiveProgress &&
            objectiveProgress.hasOwnProperty(objective.id) &&
            showCount &&
            objective.hasOwnProperty("count") ? (
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
                    text={
                      objective.hasOwnProperty("count") ? "TURN IN" : "DONE"
                    }
                    height={30}
                    clickHandle={() => {
                      turnInHandle(objective.id)
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
