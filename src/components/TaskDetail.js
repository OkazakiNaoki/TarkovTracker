import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Col, Container, Image, Row } from "react-bootstrap"
import { cloneDeep } from "lodash"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { EditValueModal } from "./EditValueModal"
import { getIndexOfObjArrWhereFieldEqualTo } from "../helpers/LoopThrough"
import { ItemSingleGrid } from "./ItemSingleGrid"
import { ConfirmModal } from "./ConfirmModal"
import {
  getTasksOfTraderWithLevel,
  updateCompletedObjectives,
  updateCompletedTasks,
  updateInventoryItem,
  updateObjectiveProgress,
  updateTraderProgress,
  updateUnlockedOffer,
  updateUnlockedTrader,
} from "../reducers/CharacterSlice"
import blueCheck from "../../server/public/static/images/blue_check.png"
import expIcon from "../../server/public/static/images/icon_experience_big.png"
import standingIcon from "../../server/public/static/images/standing_icon.png"
import skillIcon from "../../server/public/static/images/tab_icon_skills.png"
import classNames from "classnames"

const TaskDetail = ({
  traderName,
  task,
  needForTasks = null,
  completeable = false,
  disableTurnIn = false,
  playerInventory = null,
  playerLevel = 1,
  traderProgress = null,
  expandTaskDetailHandle = null,
}) => {
  //// state
  const [completeObjective, setCompleteObjective] = useState(null)
  const [objectiveProgress, setObjectiveProgress] = useState(null)
  const [closeAddValueModal, setCloseAddValueModal] = useState(null) // for each item requirement objective
  const [closeConfirmModal, setCloseConfirmModal] = useState(null) // for each simple target objective
  const [turnInAble, setTurnInAble] = useState(null) // every objective that is give item type
  const [ownCount, setOwnCount] = useState(null) // every objective that is give item type
  const [taskCompleteReward, setTaskCompleteReward] = useState(null)

  //// redux
  const { playerCompletedObjectives, playerObjectiveProgress } = useSelector(
    (state) => state.character
  )

  const dispatch = useDispatch()

  //// local variables
  const objectiveTypes = ["visit", "extract"]

  //// effect
  // get completed objectives of this task, if there's no record then init with empty array
  useEffect(() => {
    if (completeable && playerCompletedObjectives) {
      const index = getIndexOfObjArrWhereFieldEqualTo(
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
        completeTaskHandle(task.finishRewards)
      }
    }
  }, [completeObjective])

  // if objective modal on/off flag object is empty, init one
  useEffect(() => {
    if (
      completeable &&
      playerInventory &&
      !closeAddValueModal &&
      !closeConfirmModal &&
      !turnInAble
    ) {
      const initAddValueModal = {}
      const initConfirmModal = {}
      const initTurnInAble = {}
      const initOwnCount = {}
      task.objectives.forEach((objective) => {
        if (objective.hasOwnProperty("count")) {
          if (objective.type === "giveItem") {
            initConfirmModal[objective.id] = false
            initTurnInAble[objective.id] = false
            for (let i = 0; i < playerInventory.length; i++) {
              let playerOwnCount = null
              if (objective.item.id === playerInventory[i].item.id) {
                playerOwnCount = playerInventory[i].count
                initOwnCount[objective.id] = playerOwnCount
              }
              if (playerOwnCount && playerOwnCount >= objective.count) {
                initTurnInAble[objective.id] = true
                break
              }
            }
          } else {
            initAddValueModal[objective.id] = false
          }
        } else {
          initConfirmModal[objective.id] = false
        }
      })
      setCloseAddValueModal(initAddValueModal)
      setCloseConfirmModal(initConfirmModal)
      setTurnInAble(initTurnInAble)
      setOwnCount(initOwnCount)
    }
  }, [playerInventory])

  // on playerInventory change, update give item objective status
  useEffect(() => {
    if (completeable && playerInventory && turnInAble) {
      task.objectives.forEach((objective) => {
        if (
          objective.hasOwnProperty("count") &&
          objective.type === "giveItem"
        ) {
          let playerOwnCount = 0
          for (let i = 0; i < playerInventory.length; i++) {
            if (objective.item.id === playerInventory[i].item.id) {
              playerOwnCount = playerInventory[i].count
              if (ownCount[objective.id] !== playerOwnCount) {
                const copy = { ...ownCount }
                copy[objective.id] = playerOwnCount
                setOwnCount(copy)
              }
              break
            }
          }
          if (playerOwnCount >= objective.count && !turnInAble[objective.id]) {
            const copy = { ...turnInAble }
            copy[objective.id] = true
            setTurnInAble(copy)
          } else if (
            playerOwnCount < objective.count &&
            turnInAble[objective.id]
          ) {
            const copy = { ...turnInAble }
            copy[objective.id] = false
            setTurnInAble(copy)
          }
        }
      })
    }
  }, [playerInventory])

  // get player previous objective progress if there's one
  useEffect(() => {
    if (completeable && playerObjectiveProgress) {
      const newProgress = {}
      task.objectives.forEach((objective) => {
        if (objective.hasOwnProperty("count")) {
          const index = getIndexOfObjArrWhereFieldEqualTo(
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

  // on task complete flag is set
  useEffect(() => {
    if (taskCompleteReward) {
      const updateTaskStatus = async () => {
        const rewards = taskCompleteReward

        if (rewards) {
          //TODO
          // items
          const itemRewards = []
          rewards.items.forEach((item) => {
            itemRewards.push(item)
          })
          await dispatch(
            updateInventoryItem({
              items: itemRewards,
            })
          )
          // traderStanding
          for (const trader of rewards.traderStanding) {
            await dispatch(
              updateTraderProgress({
                traderName: trader.trader.name,
                traderRep:
                  traderProgress.traderRep[trader.trader.name] +
                  trader.standing,
                traderSpent: traderProgress.traderSpent[trader.trader.name],
              })
            )
          }
          // traderUnlock
          for (const trader of rewards.traderUnlock) {
            await dispatch(
              updateUnlockedTrader({
                name: trader.name,
                unlocked: true,
              })
            )
          }
          // offerUnlock
          const offers = []
          rewards.offerUnlock.forEach((offer) => {
            offers.push({
              trader: offer.trader.name,
              level: offer.level,
              itemId: offer.item.id,
            })
          })
          if (offers.length > 0) {
            await dispatch(
              updateUnlockedOffer({
                offers: offers,
              })
            )
          }
          // skillLevelReward
          /// name, level
        }
        await dispatch(updateCompletedTasks({ taskId: task.id }))
        // re-sort tasks of this trader
        dispatch(
          getTasksOfTraderWithLevel({
            trader: traderName,
            level: playerLevel,
          })
        )
        // re-sort tasks of other traders which require this task to be completed
        const needThisTaskTraders = []
        if (needForTasks) {
          needForTasks.forEach((need) => {
            if (!needThisTaskTraders.includes(need.trader.name)) {
              needThisTaskTraders.push(need.trader.name)
            }
          })
        } else {
          throw new Error("needForTasks is not given")
        }
        needThisTaskTraders.forEach((trader) => {
          if (trader !== traderName) {
            dispatch(
              getTasksOfTraderWithLevel({
                trader: trader,
                level: playerLevel,
              })
            )
          }
        })
        if (expandTaskDetailHandle) {
          expandTaskDetailHandle(traderName, task.id)
        }
      }

      updateTaskStatus()
      setTaskCompleteReward(null)
    }
  }, [taskCompleteReward])

  //// handle
  const openCloseAddValueModal = (objectiveId) => {
    if (closeAddValueModal.hasOwnProperty(objectiveId)) {
      const copy = { ...closeAddValueModal }
      copy[objectiveId] = !copy[objectiveId]
      setCloseAddValueModal(copy)
    }
  }

  const openCloseConfirmModal = (objectiveId) => {
    if (closeConfirmModal.hasOwnProperty(objectiveId)) {
      const copy = { ...closeConfirmModal }
      copy[objectiveId] = !copy[objectiveId]
      setCloseConfirmModal(copy)
    }
  }

  const confirmTurnInHandle = (newValue, taskId, objectiveId, cap) => {
    if (newValue === cap) {
      updateObjectiveStatusHandle(taskId, objectiveId, newValue, true)
    } else {
      updateObjectiveStatusHandle(taskId, objectiveId, newValue)
    }
  }

  const completeSimpleObjectiveHandle = (
    taskId,
    objectiveId,
    itemId = null,
    count
  ) => {
    if (itemId) {
      dispatch(
        updateInventoryItem({
          items: [
            {
              item: { id: itemId, name: "", backgroundColor: "" },
              count: count,
            },
          ],
        })
      )
    }
    updateObjectiveStatusHandle(taskId, objectiveId, null, true)
  }

  const updateObjectiveStatusHandle = (
    taskId,
    objectiveId,
    progress,
    completed = false
  ) => {
    if (completed) {
      dispatch(
        updateCompletedObjectives({
          taskId: taskId,
          objectiveId: objectiveId,
        })
      )
    }
    if (progress) {
      dispatch(
        updateObjectiveProgress({
          objectiveId: objectiveId,
          progress: Number(progress),
        })
      )
    }
  }

  const turnInHandle = (objectiveId) => {
    if (closeAddValueModal.hasOwnProperty(objectiveId)) {
      openCloseAddValueModal(objectiveId)
    } else if (closeConfirmModal.hasOwnProperty(objectiveId)) {
      openCloseConfirmModal(objectiveId)
    }
  }

  const completeTaskHandle = (rewards = null) => {
    setTaskCompleteReward(rewards)
  }

  return (
    <div className="task-detail">
      {/*
        objective progress modal
      */}
      {completeable &&
        closeAddValueModal &&
        task.objectives.map((objective, i) => {
          return (
            closeAddValueModal.hasOwnProperty(objective.id) && (
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

      {/*
        confirm complete objective modal
      */}
      {completeable &&
        closeConfirmModal &&
        task.objectives.map((objective, i) => {
          return (
            closeConfirmModal.hasOwnProperty(objective.id) && (
              <ConfirmModal
                key={`${objective.id}_modal`}
                show={closeConfirmModal[objective.id]}
                title="Objective completed?"
                content={objective.description}
                confirmHandle={(v) => {
                  if (objective.type === "giveItem") {
                    completeSimpleObjectiveHandle(
                      task.id,
                      objective.id,
                      objective.item.id,
                      ownCount[objective.id] - objective.count
                    )
                  } else {
                    completeSimpleObjectiveHandle(task.id, objective.id)
                  }
                  openCloseConfirmModal(objective.id)
                }}
                closeHandle={() => {
                  openCloseConfirmModal(objective.id)
                }}
              />
            )
          )
        })}

      {/*
        task image and task description
      */}
      <Container className="task-detail-image-description">
        <Image src={`/asset/${task.image}`} />
        <p>{task.description ? task.description : "MISSING DESCRIPTION"}</p>
      </Container>

      {/*
        task objectives
      */}
      <div className="task-detail-subheading">Objective(s)</div>
      {task.objectives.map((objective, i) => {
        return (
          <div
            key={"objective-" + i}
            className={classNames(
              {
                "task-detail-objective":
                  !completeable ||
                  (completeObjective &&
                    !completeObjective.includes(objective.id)),
              },
              {
                "task-detail-objective-complete":
                  completeable &&
                  completeObjective &&
                  completeObjective.includes(objective.id),
              }
            )}
          >
            {/* objective description */}
            <p>{objective.description}</p>
            {/* objective non-zero accomplish count */}
            {completeable &&
            objectiveProgress &&
            objectiveProgress.hasOwnProperty(objective.id) &&
            objective.hasOwnProperty("count") ? (
              <div className="task-detail-objective-count">
                {closeAddValueModal.hasOwnProperty(objective.id)
                  ? objectiveProgress[objective.id]
                  : ownCount[objective.id] ?? 0}
                {`/${objective.count}`}
              </div>
            ) : null}
            {/* objective zero accomplish count */}
            {!completeable && objective.count && (
              <div className="task-detail-objective-count">{`0/${objective.count}`}</div>
            )}
            {/* turn in button or completed blue check icon */}
            {completeable &&
              completeObjective &&
              (completeObjective.includes(objective.id) ? (
                <Image src={blueCheck} />
              ) : disableTurnIn ||
                (turnInAble.hasOwnProperty(objective.id) &&
                  !turnInAble[objective.id]) ? null : (
                <div className="task-detail-objective-turnin">
                  <TarkovStyleButton
                    text={objective.type === "giveItem" ? "TURN IN" : "DONE"}
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

      {/*
        task rewards
      */}
      <div className="task-detail-subheading">Rewards</div>
      <div className="task-detail-rewards">
        <Row xs={4}>
          {/* exp */}
          <Col className="task-detail-reward">
            <div className="task-detail-exp-reward">
              <div>
                <Image src={expIcon} />
                <div>{"+" + task.experience}</div>
              </div>
            </div>
          </Col>
          {/* rep standing */}
          {task.finishRewards.traderStanding.map((finishStanding, i) => {
            return (
              <Col className="task-detail-reward" key={"standing_" + i}>
                <div className="task-detail-rep-reward">
                  <div>
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
          {/* item */}
          {task.finishRewards.items.map((finishItem, i) => {
            return (
              <Col className="task-detail-reward" key={"item_" + i}>
                <div className="task-detail-item-reward">
                  <div>
                    <div>
                      <ItemSingleGrid
                        itemId={finishItem.item.id}
                        amount={finishItem.count > 1 ? finishItem.count : null}
                        foundInRaid={true}
                      />
                    </div>
                    <p>
                      {finishItem.count > 1
                        ? finishItem.item.name + " (" + finishItem.count + ")"
                        : finishItem.item.name}
                    </p>
                  </div>
                </div>
              </Col>
            )
          })}
          {/* offer unlock */}
          {task.finishRewards.offerUnlock.map((finishOffer, i) => {
            return (
              <Col className="task-detail-reward" key={"offer_" + i}>
                <div className="task-detail-offer-reward">
                  <div>
                    <div>
                      <ItemSingleGrid
                        itemId={finishOffer.item.id}
                        locked={true}
                      />
                    </div>
                    <p
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
          {/* skill level */}
          {task.finishRewards.skillLevelReward.map((finishSkill, i) => {
            return (
              <Col className="task-detail-reward" key={"skill_" + i}>
                <div className="task-detail-skill-reward">
                  <div>
                    <Image src={skillIcon} />
                    <div>{finishSkill.name}</div>
                    <div>{"+" + finishSkill.level + " level(s)"}</div>
                  </div>
                </div>
              </Col>
            )
          })}
          {/* trader unlock */}
          {task.finishRewards.traderUnlock.map((finishTrader, i) => {
            return (
              <Col className="task-detail-reward" key={"trader_" + i}>
                <div className="task-detail-trader-reward">
                  <div>
                    <Image src={`/asset/${finishTrader.id}.png`} />
                    <p>{finishTrader.name}</p>
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
