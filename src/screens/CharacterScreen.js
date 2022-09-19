import React, { useEffect, useState } from "react"
import {
  Button,
  Col,
  Container,
  Image,
  Row,
  Tabs,
  Tab,
  Accordion,
  Table,
  ToggleButton,
  Collapse,
} from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { LoginFirst } from "../components/LoginFirst"
import {
  getTasksOfTraderWithLevel,
  updateCompletedTasks,
  initPlayerTasks,
  getCompletedObjectives,
  getObjectiveProgress,
  updateCompletedObjectives,
  updateObjectiveProgress,
  addCompletedObjectives,
  addObjectiveProgress,
  getCharacterData,
  updateCharacterData,
  getHideoutLevel,
} from "../reducers/CharacterSlice"
import { getTraders, getTaskDetail } from "../reducers/TraderSlice"
import { getAllHideout } from "../reducers/HideoutSlice"
import { TaskDetail } from "../components/TaskDetail"
import { PlayerDataSetup } from "../components/PlayerDataSetup"
import { AddValueModal } from "../components/AddValueModal"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"
import { HideoutIcon } from "../components/HideoutIcon"
import { HideoutStationDetail } from "../components/HideoutStationDetail"

const CharacterScreen = () => {
  // hooks
  const [levelIcon, setLevelIcon] = useState("/asset/rank5.png")
  const [playerTaskFetched, setPlayerTaskFetched] = useState({})
  const [showCompleteTask, setShowCompleteTask] = useState(false)
  const [showOngoingTask, setShowOngoingTask] = useState(true)
  const [showNotQualifyTask, setShowNotQualifyTask] = useState(false)
  const [collapseDetail, setCollapseDetail] = useState({})
  const [openPlayerLevelModal, setOpenPlayerLevelModal] = useState(false)
  const [currentStationId, setCurrentStationId] = useState(
    "5d388e97081959000a123acf"
  )
  const [currentStation, setCurrentStation] = useState(null)
  const [levelInfoOfCurrentStation, setLevelInfoOfCurrentStation] =
    useState(null)

  // redux
  const { user } = useSelector((state) => state.user)
  const { traders, tasksDetail, tasksDetailFetched } = useSelector(
    (state) => state.trader
  )
  const { hideout } = useSelector((state) => state.hideout)
  const {
    isLoading,
    initSetup,
    playerLevel,
    playerFaction,
    playerTasksInfo,
    unlockedJaeger,
    traderLoyaltyLevel,
    playerCompletedObjectives,
    playerObjectiveProgress,
    playerHideoutLevel,
  } = useSelector((state) => state.character)
  const dispatch = useDispatch()

  // redux debug
  const charState = useSelector((state) => state.character)

  // effects
  useEffect(() => {
    if (initSetup === null) {
      dispatch(getCharacterData())
    }
    if (initSetup) {
      for (let i = 1; i <= 16; i++) {
        if (playerLevel >= 5 * i) {
          continue
        } else {
          setLevelIcon(`/asset/rank${5 * i}.png`)
          break
        }
      }
    }
  }, [initSetup, playerLevel])

  useEffect(() => {
    if (traders.length === 0) {
      dispatch(getTraders())
    }
  }, [traders])

  useEffect(() => {
    if (traders.length !== 0 && Object.keys(playerTaskFetched).length === 0) {
      const needRefresh = {}
      for (let i = 0; i < traders.length; i++) {
        needRefresh[`${traders[i].name}`] = null
      }
      setPlayerTaskFetched(needRefresh)
    }
  }, [traders])

  useEffect(() => {
    if (traders.length !== 0 && Object.keys(playerTasksInfo).length === 0) {
      dispatch(initPlayerTasks(traders.map((trader) => trader.name)))
    }
    if (traders.length !== 0 && Object.keys(traderLoyaltyLevel).length === 0) {
      dispatch(initPlayerTasks(traders.map((trader) => trader.name)))
    }
  }, [traders])

  useEffect(() => {
    const newCollapse = { ...collapseDetail }
    for (const trader in playerTaskFetched) {
      if (playerTaskFetched[trader] === null) {
        for (const status in playerTasksInfo[trader]) {
          playerTasksInfo[trader][status].forEach((task) => {
            newCollapse[`${task.id}`] = false
          })
        }
      }
    }
    setCollapseDetail(newCollapse)
  }, [traders, playerTaskFetched])

  useEffect(() => {
    if (initSetup && !playerCompletedObjectives) {
      dispatch(getCompletedObjectives())
    }
  }, [initSetup, playerCompletedObjectives])

  useEffect(() => {
    if (initSetup && !playerObjectiveProgress) {
      dispatch(getObjectiveProgress())
    }
  }, [initSetup, playerObjectiveProgress])

  useEffect(() => {
    if (hideout.length === 0) {
      dispatch(getAllHideout())
    }
  }, [hideout])

  useEffect(() => {
    if (hideout.length > 0) {
      const index = getIndexOfMatchFieldObjArr(hideout, "id", currentStationId)
      setCurrentStation(hideout[index])
    }
  }, [hideout, currentStationId])

  useEffect(() => {
    if (!playerHideoutLevel) {
      dispatch(getHideoutLevel())
    }
  }, [playerHideoutLevel])

  useEffect(() => {
    if (playerHideoutLevel) {
      const index = getIndexOfMatchFieldObjArr(
        playerHideoutLevel,
        "hideoutId",
        currentStationId
      )
      setLevelInfoOfCurrentStation(playerHideoutLevel[index])
    }
  }, [currentStationId, playerHideoutLevel])

  // handles
  const expandTaskDetailHandle = (trader, taskId) => {
    if (!tasksDetailFetched[trader].includes(taskId)) {
      dispatch(getTaskDetail({ id: taskId, traderName: trader }))
    }
    const newCollapse = { ...collapseDetail }
    newCollapse[taskId] = !newCollapse[taskId]
    setCollapseDetail(newCollapse)
  }

  const getTaskOfTraderHandle = (traderName) => {
    if (!playerTaskFetched[`${traderName}`])
      dispatch(
        getTasksOfTraderWithLevel({
          trader: traderName,
          playerLvl: playerLevel,
        })
      )
    const newFetched = { ...playerTaskFetched }
    newFetched[`${traderName}`] = true
    setPlayerTaskFetched(newFetched)
  }

  const updateObjectiveStatusHandle = (
    taskId,
    objectiveId,
    progress,
    completed = false
  ) => {
    if (completed) {
      const newCompleteObjectives = JSON.parse(
        JSON.stringify(playerCompletedObjectives)
      )
      const index = getIndexOfMatchFieldObjArr(
        newCompleteObjectives,
        "taskId",
        taskId
      )
      if (index !== -1) {
        newCompleteObjectives[index]["objectives"].push(objectiveId)
      } else {
        newCompleteObjectives.push({ taskId, objectives: [objectiveId] })
      }
      dispatch(
        updateCompletedObjectives({
          completeObjectives: newCompleteObjectives,
        })
      )
    }
    const newProgress = JSON.parse(JSON.stringify(playerObjectiveProgress))
    const index = getIndexOfMatchFieldObjArr(
      newProgress,
      "objectiveId",
      objectiveId
    )
    if (index !== -1) {
      newProgress[index]["progress"] = Number(progress)
    } else {
      newProgress.push({ objectiveId, progress })
    }
    dispatch(
      updateObjectiveProgress({
        objectiveProgress: newProgress,
      })
    )
  }

  const completeTaskHandle = (traderName, taskId) => {
    const newCompleteTasks = []
    playerTasksInfo[traderName]["complete"].forEach((task) => {
      newCompleteTasks.push(task.id)
    })
    newCompleteTasks.push(taskId)
    dispatch(updateCompletedTasks({ completeTasks: newCompleteTasks }))
    dispatch(
      getTasksOfTraderWithLevel({
        trader: traderName,
        playerLvl: playerLevel,
      })
    )
    expandTaskDetailHandle(traderName, taskId)
  }

  const adjustPlayerLevelHandle = (level) => {
    dispatch(updateCharacterData({ characterLevel: level }))
    traders.forEach((trader) => {
      dispatch(
        getTasksOfTraderWithLevel({
          trader: trader.name,
          playerLvl: level,
        })
      )
    })
  }

  const openCloseLevelModalHandle = () => {
    setOpenPlayerLevelModal(!openPlayerLevelModal)
  }

  return (
    <>
      <Button
        onClick={() => {
          console.log(levelInfoOfCurrentStation)
        }}
      >
        local State
      </Button>
      <Button
        onClick={() => {
          console.log(charState)
        }}
      >
        Redux State
      </Button>
      <AddValueModal
        show={openPlayerLevelModal}
        value={playerLevel}
        valueCap={79}
        setValueHandle={(v) => {
          adjustPlayerLevelHandle(v)
          openCloseLevelModalHandle()
        }}
        closeHandle={openCloseLevelModalHandle}
      />
      {Object.keys(user).length === 0 && <LoginFirst />}
      {Object.keys(user).length > 0 && initSetup !== null && !initSetup && (
        <PlayerDataSetup />
      )}
      {Object.keys(user).length > 0 && initSetup && (
        <Container>
          <Row className="my-5 gx-5 align-items-start">
            <Col lg={3} style={{ border: "1px solid white" }}>
              <Row className="my-3" align="center">
                <Col>
                  <div
                    className="sandbeige"
                    role="button"
                    style={{ fontSize: "90px" }}
                    onClick={openCloseLevelModalHandle}
                  >
                    <Image
                      src={levelIcon}
                      className="d-inline me-3"
                      style={{ height: "100px" }}
                    />
                    {playerLevel}
                  </div>
                </Col>
              </Row>
              <Row className="my-3" align="center">
                <Col>
                  {playerFaction && (
                    <Image src={`/asset/icon_${playerFaction}.png`} />
                  )}
                </Col>
              </Row>
            </Col>
            <Col>
              <Tabs
                defaultActiveKey="task"
                className="mb-4 flex-column flex-lg-row"
                transition={false}
                justify
              >
                <Tab eventKey="task" title="Task">
                  <div>
                    <ToggleButton
                      type="checkbox"
                      variant="outline-primary"
                      checked={showCompleteTask}
                      value="1"
                      onClick={(e) => {
                        setShowCompleteTask(!showCompleteTask)
                      }}
                      style={{ "--bs-btn-hover-bg": "none" }}
                      className="btn-sm mx-2 mb-3"
                    >
                      Finished
                    </ToggleButton>
                    <ToggleButton
                      type="checkbox"
                      variant="outline-success"
                      checked={showOngoingTask}
                      value="1"
                      onClick={(e) => {
                        setShowOngoingTask(!showOngoingTask)
                      }}
                      style={{ "--bs-btn-hover-bg": "none" }}
                      className="btn-sm mx-2 mb-3"
                    >
                      Active
                    </ToggleButton>
                    <ToggleButton
                      type="checkbox"
                      variant="outline-dark"
                      checked={showNotQualifyTask}
                      value="1"
                      onClick={(e) => {
                        setShowNotQualifyTask(!showNotQualifyTask)
                      }}
                      style={{ "--bs-btn-hover-bg": "none" }}
                      className="btn-sm mx-2 mb-3"
                    >
                      Not unlock
                    </ToggleButton>
                  </div>
                  <Accordion
                    alwaysOpen
                    style={{
                      "--bs-accordion-bg": "black",
                      "--bs-accordion-color": "white",
                      "--bs-accordion-btn-color": "white",
                      "--bs-accordion-active-bg": "#1c1c1c",
                      "--bs-accordion-active-color": "#b7ad9c",
                    }}
                  >
                    {traders.length !== 0 &&
                      traders.map((trader, i) => {
                        return (
                          <Accordion.Item
                            eventKey={`${i}`}
                            key={`${trader.name}_task`}
                          >
                            <Accordion.Header
                              onClick={() => getTaskOfTraderHandle(trader.name)}
                            >
                              <Image
                                src={`/asset/${trader.id}.png`}
                                className="me-3"
                                style={{ height: "64px", width: "64px" }}
                              />
                              <div className="fs-4">{trader.name}</div>
                            </Accordion.Header>
                            <Accordion.Body className="p-0">
                              <Table variant="dark" className="m-0">
                                <tbody>
                                  {Object.keys(playerTasksInfo).length > 0 &&
                                    playerTasksInfo[`${trader.name}`] &&
                                    Object.keys(
                                      playerTasksInfo[`${trader.name}`]
                                    )
                                      .map((status) => {
                                        if (
                                          (status === "complete" &&
                                            showCompleteTask) ||
                                          (status === "ongoing" &&
                                            showOngoingTask) ||
                                          (status === "notQualify" &&
                                            showNotQualifyTask)
                                        )
                                          return playerTasksInfo[
                                            `${trader.name}`
                                          ][`${status}`].map((task) => {
                                            if (
                                              (trader.name === "Jaeger" &&
                                                unlockedJaeger) ||
                                              trader.name !== "Jaeger"
                                            )
                                              return [
                                                <tr
                                                  key={task.id}
                                                  onClick={() => {
                                                    expandTaskDetailHandle(
                                                      trader.name,
                                                      task.id
                                                    )
                                                  }}
                                                >
                                                  <td
                                                    className="px-5"
                                                    style={{
                                                      "--bs-table-bg":
                                                        status === "complete"
                                                          ? "#0d6efd"
                                                          : status === "ongoing"
                                                          ? "#198754"
                                                          : "#1c1c1c",
                                                    }}
                                                  >
                                                    {task.name}
                                                  </td>
                                                </tr>,
                                                <tr key={task.id + "_collapse"}>
                                                  <td
                                                    colSpan={1}
                                                    style={{ padding: "0" }}
                                                  >
                                                    <Collapse
                                                      in={
                                                        (trader.name,
                                                        collapseDetail[task.id])
                                                      }
                                                    >
                                                      <div>
                                                        <div
                                                          style={{
                                                            minHeight: "200px",
                                                          }}
                                                        >
                                                          {Object.keys(
                                                            tasksDetailFetched
                                                          ).length > 0 &&
                                                            tasksDetailFetched[
                                                              trader.name
                                                            ].includes(
                                                              task.id
                                                            ) && (
                                                              <TaskDetail
                                                                task={
                                                                  tasksDetail[
                                                                    trader.name
                                                                  ][task.id]
                                                                }
                                                                completeable={
                                                                  status ===
                                                                  "complete"
                                                                    ? false
                                                                    : true
                                                                }
                                                                showCount={true}
                                                                finishClickHandles={
                                                                  updateObjectiveStatusHandle
                                                                }
                                                                taskCompleteHandle={(
                                                                  taskId
                                                                ) => {
                                                                  completeTaskHandle(
                                                                    trader.name,
                                                                    taskId
                                                                  )
                                                                }}
                                                              />
                                                            )}
                                                        </div>
                                                      </div>
                                                    </Collapse>
                                                  </td>
                                                </tr>,
                                              ]
                                          })
                                      })
                                      .flat(1)}
                                </tbody>
                              </Table>
                            </Accordion.Body>
                          </Accordion.Item>
                        )
                      })}
                  </Accordion>
                </Tab>
                <Tab eventKey="hideout" title="Hideout">
                  <div>
                    <div className="d-flex justify-content-center flex-wrap mb-5">
                      {hideout.map((station) => {
                        return (
                          <a
                            key={station.id}
                            onClick={() => {
                              setCurrentStationId(station.id)
                            }}
                          >
                            <HideoutIcon iconName={station.id} />
                          </a>
                        )
                      })}
                    </div>
                    <h1 className="sandbeige">
                      {currentStation && currentStation.name}
                    </h1>
                    {levelInfoOfCurrentStation &&
                      levelInfoOfCurrentStation.level === -1 &&
                      currentStation &&
                      currentStation.levels.map((level, i) => {
                        if (i === 0) {
                          return (
                            <HideoutStationDetail
                              key={currentStation.name + level.level}
                              station={currentStation}
                              level={level}
                              nextLevel={currentStation.levels?.[i + 1]}
                              canConstruct={true}
                            />
                          )
                        }
                      })}
                    {levelInfoOfCurrentStation &&
                      levelInfoOfCurrentStation.level !== -1 &&
                      currentStation &&
                      currentStation.levels.map((level, i) => {
                        if (
                          level.level ===
                          levelInfoOfCurrentStation.level + 1
                        ) {
                          return (
                            <HideoutStationDetail
                              key={currentStation.name + level.level}
                              station={currentStation}
                              level={level}
                              nextLevel={currentStation.levels?.[i + 1]}
                            />
                          )
                        }
                      })}
                  </div>
                </Tab>
                <Tab eventKey="inventory" title="Inventory">
                  <div></div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      )}
    </>
  )
}

export { CharacterScreen }
