import React, { useState, useEffect } from "react"
import { useCallback } from "react"
import {
  Accordion,
  Collapse,
  Image,
  Table,
  ToggleButton,
} from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { get } from "lodash"
import classNames from "classnames"
import { haveZeroPropertyEqualTo } from "../helpers/LoopThrough"
import { getTasksOfTraderWithLevel } from "../reducers/CharacterSlice"
import { getTaskDetail, initializeTasks } from "../reducers/TraderSlice"
import { DivLoading } from "./DivLoading"
import { TaskDetail } from "./TaskDetail"

const PlayerTaskPanel = ({
  traders,
  tasks,
  unlockedTraders,
  playerLevel,
  playerInventory,
  playerTasksInfo,
  traderProgress,
}) => {
  //// state
  const [showCompleteTask, setShowCompleteTask] = useState(false)
  const [showOngoingTask, setShowOngoingTask] = useState(true)
  const [showNotQualifyTask, setShowNotQualifyTask] = useState(false)

  const [taskTotalLen, setTaskTotalLen] = useState(null)
  const [curShowingTaskLen, setCurShowingTaskLen] = useState(null)

  const [collapseDetail, setCollapseDetail] = useState({})
  const [taskInitialized, setTaskInitialized] = useState(false)

  //// redux
  const dispatch = useDispatch()

  //// redux state
  const { initSetup } = useSelector((state) => state.character)
  const { initTasksDetail, tasksDetail, tasksDetailFetched } = useSelector(
    (state) => state.trader
  )

  //// effect
  // initialize task detail empty container
  useEffect(() => {
    if (!initTasksDetail) {
      dispatch(initializeTasks())
    }
  }, [initTasksDetail])

  // set total task amount of each trader
  useEffect(() => {
    if (
      !taskTotalLen &&
      Object.keys(playerTasksInfo).length === traders.length
    ) {
      const newTaskTotalLen = {}
      traders.forEach((trader) => {
        newTaskTotalLen[trader.name] =
          playerTasksInfo[trader.name].complete.length +
          playerTasksInfo[trader.name].ongoing.length +
          playerTasksInfo[trader.name].notQualify.length
      })
      setTaskTotalLen(newTaskTotalLen)
    }
  }, [traders, playerTasksInfo])

  // set each trader's task amount of each status
  useEffect(() => {
    if (Object.keys(playerTasksInfo).length === traders.length) {
      const newShowingTaskLen = {}
      traders.forEach((trader) => {
        newShowingTaskLen[trader.name] =
          (showCompleteTask && playerTasksInfo[trader.name].complete.length) +
          (showOngoingTask && playerTasksInfo[trader.name].ongoing.length) +
          (showNotQualifyTask && playerTasksInfo[trader.name].notQualify.length)
      })
      setCurShowingTaskLen(newShowingTaskLen)
    }
  }, [
    traders,
    playerTasksInfo,
    showCompleteTask,
    showOngoingTask,
    showNotQualifyTask,
  ])

  // sort traders' tasks into completed/ongoing/not yet available
  useEffect(() => {
    if (
      initSetup &&
      traderProgress &&
      unlockedTraders &&
      Object.keys(traderProgress.traderLL).length === traders.length &&
      Object.keys(tasks).length === traders.length &&
      haveZeroPropertyEqualTo(tasks, null) &&
      !taskInitialized
    ) {
      traders.forEach((trader) => {
        dispatch(
          getTasksOfTraderWithLevel({
            trader: trader.name,
            level: playerLevel,
          })
        )
      })
      setTaskInitialized(true)
    }
  }, [
    initSetup,
    traders,
    tasks,
    unlockedTraders,
    traderProgress,
    taskInitialized,
  ])

  //// handle
  const expandTaskDetailHandle = (trader, taskId) => {
    if (!tasksDetailFetched[trader].includes(taskId)) {
      dispatch(getTaskDetail({ id: taskId, traderName: trader }))
    }
    const newCollapse = { ...collapseDetail }
    newCollapse[taskId] = !newCollapse[taskId]
    setCollapseDetail(newCollapse)
  }

  const toggleCompleteTasks = useCallback(() => {
    setShowCompleteTask(!showCompleteTask)
  }, [showCompleteTask])

  const toggleOngoingTasks = useCallback(() => {
    setShowOngoingTask(!showOngoingTask)
  }, [showOngoingTask])

  const toggleNotQualifyTasks = useCallback(() => {
    setShowNotQualifyTask(!showNotQualifyTask)
  }, [showNotQualifyTask])

  return (
    <div>
      <div>
        <ToggleButton
          type="checkbox"
          variant="outline-primary"
          checked={showCompleteTask}
          className="btn-sm mx-2 mb-3 bs-btn-hover-bg-none"
          onClick={toggleCompleteTasks}
        >
          Completed
        </ToggleButton>
        <ToggleButton
          type="checkbox"
          variant="outline-success"
          checked={showOngoingTask}
          className="btn-sm mx-2 mb-3 bs-btn-hover-bg-none"
          onClick={toggleOngoingTasks}
        >
          Available
        </ToggleButton>
        <ToggleButton
          type="checkbox"
          variant="outline-danger"
          checked={showNotQualifyTask}
          className="btn-sm mx-2 mb-3 bs-btn-hover-bg-none"
          onClick={toggleNotQualifyTasks}
        >
          Not available
        </ToggleButton>
      </div>
      <Accordion alwaysOpen className="task-accordion">
        {traders.map((trader, i) => {
          return (
            <Accordion.Item eventKey={`${i}`} key={`${trader.name}_task`}>
              <Accordion.Header>
                <div className="d-flex align-items-center fs-4">
                  <Image
                    src={`/asset/${trader.id}.png`}
                    className="me-3 wh-square-64"
                  />
                  <div className="mx-3">{trader.name}</div>

                  <div className="d-inline mx-3 white fs-6">
                    <span>{"available: "}</span>
                    <span
                      className={classNames(
                        {
                          "bs-green":
                            get(playerTasksInfo, trader.name, null) &&
                            playerTasksInfo[trader.name].ongoing.length > 0,
                        },
                        {
                          "bs-dark":
                            get(playerTasksInfo, trader.name, null) &&
                            playerTasksInfo[trader.name].ongoing.length === 0,
                        }
                      )}
                    >
                      {get(playerTasksInfo, trader.name, null) &&
                        playerTasksInfo[trader.name].ongoing.length}
                    </span>
                  </div>

                  <div className="d-inline mx-3 fs-6">
                    <span>{"completed: "}</span>
                    <span className="bs-blue">
                      {get(playerTasksInfo, trader.name, null) &&
                        playerTasksInfo[trader.name].complete.length}
                      {"/"}
                      {taskTotalLen && taskTotalLen[trader.name]}
                    </span>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body className="p-0">
                <Table variant="dark" className="m-0 bs-table-bg-black">
                  <tbody>
                    {curShowingTaskLen &&
                      curShowingTaskLen[trader.name] === 0 && (
                        <tr>
                          <td>
                            <div className="p-3 fs-4 text-center">Empty</div>
                          </td>
                        </tr>
                      )}
                    {Object.keys(playerTasksInfo).length > 0 &&
                      playerTasksInfo[trader.name] &&
                      Object.keys(playerTasksInfo[trader.name])
                        .map((status) => {
                          if (
                            (status === "complete" && showCompleteTask) ||
                            (status === "ongoing" && showOngoingTask) ||
                            (status === "notQualify" && showNotQualifyTask)
                          ) {
                            return playerTasksInfo[trader.name][status].map(
                              (task) => {
                                return [
                                  <tr
                                    key={task.id}
                                    onClick={expandTaskDetailHandle.bind(
                                      null,
                                      trader.name,
                                      task.id
                                    )}
                                  >
                                    <td
                                      className={classNames(
                                        "px-5",
                                        {
                                          "bs-table-bg-blue":
                                            status === "complete",
                                        },
                                        {
                                          "bs-table-bg-green":
                                            status === "ongoing",
                                        },
                                        {
                                          "bs-table-bg-red":
                                            status === "notQualify",
                                        }
                                      )}
                                    >
                                      {task.name}
                                    </td>
                                  </tr>,
                                  <tr key={task.id + "_collapse"}>
                                    <td className="p-0">
                                      <Collapse
                                        in={
                                          (trader.name, collapseDetail[task.id])
                                        }
                                      >
                                        <div>
                                          <div>
                                            {Object.keys(tasksDetailFetched)
                                              .length > 0 &&
                                              !tasksDetailFetched[
                                                trader.name
                                              ].includes(task.id) && (
                                                <DivLoading height={100} />
                                              )}
                                            {Object.keys(tasksDetailFetched)
                                              .length > 0 &&
                                              tasksDetailFetched[
                                                trader.name
                                              ].includes(task.id) && (
                                                <TaskDetail
                                                  traderName={trader.name}
                                                  task={
                                                    tasksDetail[trader.name][
                                                      task.id
                                                    ]
                                                  }
                                                  needForTasks={
                                                    task.needForTasks
                                                  }
                                                  completeable={
                                                    status === "ongoing"
                                                  }
                                                  disableTurnIn={
                                                    status === "notQualify"
                                                  }
                                                  playerInventory={
                                                    playerInventory
                                                  }
                                                  playerLevel={playerLevel}
                                                  traderProgress={
                                                    traderProgress
                                                  }
                                                  expandTaskDetailHandle={
                                                    expandTaskDetailHandle
                                                  }
                                                />
                                              )}
                                          </div>
                                        </div>
                                      </Collapse>
                                    </td>
                                  </tr>,
                                ]
                              }
                            )
                          }
                        })
                        .flat(1)}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </div>
  )
}

export { PlayerTaskPanel }
