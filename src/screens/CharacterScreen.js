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
  setPlayerLevel,
  getTasksOfTraderWithLevel,
  initPlayerTasks,
  initializePlayerData,
  getCompletedObjectives,
} from "../reducers/CharacterSlice"
import { getTraders, getTaskDetail } from "../reducers/TraderSlice"
import { TaskDetail } from "../components/TaskDetail"
import { TarkovStyleButton } from "../components/TarkovStyleButton"

const CharacterScreen = () => {
  // hooks
  const [playerTaskFetched, setPlayerTaskFetched] = useState({})
  const [showCompleteTask, setShowCompleteTask] = useState(false)
  const [showOngoingTask, setShowOngoingTask] = useState(true)
  const [showNotQualifyTask, setShowNotQualifyTask] = useState(false)
  const [collapseDetail, setCollapseDetail] = useState({})

  // redux
  const { user } = useSelector((state) => state.user)
  const { traders, tasksDetail, tasksDetailFetched } = useSelector(
    (state) => state.trader
  )
  const {
    isLoading,
    initSetup,
    playerLevel,
    playerFaction,
    playerTasksInfo,
    unlockedJaeger,
    traderLoyaltyLevel,
    playerCompletedObjectives,
  } = useSelector((state) => state.character)
  const dispatch = useDispatch()

  // redux debug
  const charState = useSelector((state) => state.character)

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
    if (!playerCompletedObjectives) {
      dispatch(getCompletedObjectives())
    }
  }, [playerCompletedObjectives])

  const setupHandle = () => {}

  const openLevelSettingPanelHandle = () => {
    console.log("open!")
  }

  const expandTaskDetailHandle = (trader, taskId) => {
    if (!tasksDetailFetched[trader].includes(taskId)) {
      dispatch(getTaskDetail({ id: taskId, traderName: trader }))
    }
    const newCollapse = { ...collapseDetail }
    newCollapse[taskId] = !newCollapse[taskId]
    setCollapseDetail(newCollapse)
  }

  const setLevelHandle = (e) => {
    if (initSetup) {
      dispatch(setPlayerLevel(e.target.value))
    }
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

  return (
    <>
      <Button
        onClick={() => {
          dispatch(
            initializePlayerData({
              traderNames: traders.map((trader) => trader.name),
            })
          )
        }}
      >
        Initial player test
      </Button>
      <Button
        onClick={() => {
          console.log(charState)
        }}
      >
        Redux State
      </Button>
      {Object.keys(user).length === 0 && <LoginFirst />}
      {Object.keys(user).length > 0 && (
        <Container>
          <Row className="my-5 gx-5 align-items-start">
            <Col lg={3} style={{ border: "1px solid white" }}>
              <Row className="my-3" align="center">
                <Col>
                  <div
                    className="sandbeige"
                    role="button"
                    style={{ fontSize: "90px" }}
                    onClick={openLevelSettingPanelHandle}
                  >
                    <Image
                      src={`/asset/rank5.png`}
                      className="d-inline me-3"
                      style={{ height: "100px" }}
                    />
                    {playerLevel}
                  </div>
                </Col>
              </Row>
              <Row className="my-5">
                <Col>
                  {playerFaction ? (
                    <Image
                      src={`/asset/icon-${playerFaction}.png`}
                      className="px-5"
                    />
                  ) : (
                    <TarkovStyleButton
                      text="Setup character"
                      clickHandle={setupHandle}
                      fs={24}
                    />
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
                                                                  true
                                                                }
                                                                showCount={true}
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
                  <div></div>
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
