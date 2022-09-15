import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Image } from "react-bootstrap"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { AddValueModal } from "../components/AddValueModal"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"
import blueCheck from "../../public/static/images/blue_check.png"

const TaskDetail = ({
  task,
  showCount = false,
  completeable = false,
  finishClickHandles,
  taskCompleteHandle,
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

  return (
    <>
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
            className="d-flex justify-content-center my-2 p-2"
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
              ) : (
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
      <div
        className="text-center m-2 px-5"
        style={{
          backgroundColor: "#090a0b",
          whiteSpace: "break-spaces",
        }}
      >
        {"+" + task.experience + "EXP\n"}
        {task.finishRewards.traderStanding.map((finishStanding) => {
          return (
            finishStanding.trader.name +
            (finishStanding.standing > 0 ? " +" : " ") +
            finishStanding.standing +
            "\n"
          )
        })}
        {task.finishRewards.items.map((finishItem) => {
          return finishItem.item.name + " (" + finishItem.count + ")\n"
        })}
        {task.finishRewards.offerUnlock.map((finishOffer) => {
          return (
            "Unlock " +
            finishOffer.item.name +
            " at " +
            finishOffer.trader.name +
            "@Lv." +
            finishOffer.level +
            "\n"
          )
        })}
        {task.finishRewards.skillLevelReward.map((finishSkill) => {
          return "+" + finishSkill.level + " " + finishSkill.name + " level\n"
        })}
        {task.finishRewards.traderUnlock.map((finishTrader) => {
          return "Unlock trader " + finishTrader.name + "\n"
        })}
      </div>
    </>
  )
}

export { TaskDetail }
