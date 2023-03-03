import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Container,
  Row,
  Col,
  Image,
  Tabs,
  Table,
  TabPane,
  Collapse,
} from "react-bootstrap"
import {
  getTradeResetTime,
  getTasksOfTrader,
  getTaskDetail,
  initializeTasks,
} from "../reducers/TraderSlice"
import { TaskDetail } from "../components/TaskDetail"
import { TarkovSpinner } from "../components/TarkovSpinner"
import { TableRowLoading } from "../components/TableRowLoading"
import { TraderCard } from "../components/TraderCard"
import placeholderImg from "../../server/public/static/images/default_avatar.png"
import refreshIcon from "../../server/public/static/images/icon_refresh.png"

const TaskScreen = () => {
  //// state
  const [curTrader, setCurTrader] = useState(null)
  const [collapseDetail, setCollapseDetail] = useState({})

  //// redux state
  const {
    initTasksDetail,
    tradeResetTime,
    isLoadingTasks,
    traders,
    tasks,
    tasksDetail,
    tasksDetailFetched,
  } = useSelector((state) => state.trader)
  const dispatch = useDispatch()

  //// effect
  useEffect(() => {
    if (!initTasksDetail) {
      dispatch(initializeTasks())
    }
  }, [initTasksDetail])

  useEffect(() => {
    if (curTrader) {
      if (!tasks.hasOwnProperty(curTrader)) {
        dispatch(getTasksOfTrader({ trader: curTrader }))
      }
    }
  }, [traders, curTrader])

  useEffect(() => {
    if (tasks[curTrader]) {
      const collapse = {}
      tasks[curTrader].forEach((task) => {
        collapse[`${task.id}`] = false
      })
      setCollapseDetail({ ...collapseDetail, ...collapse })
    }
  }, [tasks])

  //// handle
  const imgLoadErrHandle = (e) => {
    e.target.src = placeholderImg
  }

  const taskTableClickHandle = (traderName, taskId) => {
    if (!tasksDetailFetched[traderName].includes(taskId)) {
      dispatch(
        getTaskDetail({
          id: taskId,
          traderName: traderName,
        })
      )
    }
    collapseExpandTaskDetail(taskId)
  }

  const collapseExpandTaskDetail = (taskId) => {
    const collapse = { ...collapseDetail }
    collapse[`${taskId}`] = !collapse[`${taskId}`]
    setCollapseDetail(collapse)
  }

  return (
    <>
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          {/* Trader icons */}
          <div style={{ width: "696px" }}>
            <Row xs={2} sm={3} md={4} className="g-3">
              {traders.length !== 0 &&
                traders.map((trader, i) => {
                  return (
                    <Col key={i}>
                      <div
                        role="button"
                        className="d-flex justify-content-center"
                        onClick={() => {
                          setCurTrader(trader.name)
                        }}
                      >
                        <TraderCard
                          trader={trader}
                          resetTime={
                            Object.keys(tradeResetTime).length > 0
                              ? tradeResetTime[trader.name]
                              : null
                          }
                        />
                      </div>
                    </Col>
                  )
                })}
            </Row>
          </div>
          <Image
            role="button"
            className="ms-2"
            src={refreshIcon}
            title="get trade reset time"
            style={{ width: "20px", height: "20px" }}
            onClick={() => {
              dispatch(getTradeResetTime())
            }}
          />
        </div>

        {/* Task table of active trader */}
        {curTrader && (
          <Tabs activeKey={curTrader} className="py-3">
            {isLoadingTasks && (
              <TabPane eventKey={curTrader}>
                <Table bordered hover variant="dark" className="p-4 w-100">
                  <thead>
                    <tr>
                      <th>Task name</th>
                      <th>Level requirement</th>
                      <th>Previous task</th>
                      <th>Trader level requirement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableRowLoading colSize={4} height={300} />
                  </tbody>
                </Table>
              </TabPane>
            )}
            {!isLoadingTasks &&
              traders.length !== 0 &&
              traders.map((trader, i) => {
                return (
                  <TabPane eventKey={trader.name} key={trader.id}>
                    <Table className="round-table" hover variant="dark">
                      <thead>
                        <tr>
                          <th style={{ backgroundColor: "#121212" }}>
                            Task name
                          </th>
                          <th style={{ backgroundColor: "#121212" }}>
                            Level requirement
                          </th>
                          <th style={{ backgroundColor: "#121212" }}>
                            Previous task
                          </th>
                          <th style={{ backgroundColor: "#121212" }}>
                            Trader level requirement
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks[trader.name] &&
                          tasks[trader.name].map((task) => {
                            return [
                              /* task button */
                              <tr
                                key={task.id}
                                onClick={() => {
                                  taskTableClickHandle(trader.name, task.id)
                                }}
                                style={{
                                  color: "var(--bs-table-color)",
                                  "--bs-table-bg": collapseDetail[`${task.id}`]
                                    ? "#8a887d"
                                    : "#181917",
                                  "--bs-table-color": collapseDetail[
                                    `${task.id}`
                                  ]
                                    ? "black"
                                    : "white",
                                  "--bs-table-active-color": "black",
                                  "--bs-table-hover-bg": "#8a887d",
                                  "--bs-table-hover-color": "black",
                                }}
                              >
                                <td>{task.name}</td>
                                <td>{task.minPlayerLevel}</td>
                                <td style={{ whiteSpace: "break-spaces" }}>
                                  {task.taskRequirements.reduce(
                                    (prev, taskReq) => {
                                      return prev + taskReq.name + "\n"
                                    },
                                    ""
                                  )}
                                </td>
                                <td>
                                  {task.traderLevelRequirements.reduce(
                                    (prev, lvlReq) => {
                                      return (
                                        prev +
                                        lvlReq.trader.name +
                                        " LL" +
                                        lvlReq.level +
                                        "\n"
                                      )
                                    },
                                    ""
                                  )}
                                </td>
                              </tr>,

                              /* task detail area */
                              <tr
                                key={task.id + "_collapse"}
                                style={{ "--bs-table-hover-bg": "none" }}
                              >
                                <td colSpan="4" style={{ padding: "0" }}>
                                  <Collapse in={collapseDetail[`${task.id}`]}>
                                    <div>
                                      <div style={{ backgroundColor: "black" }}>
                                        {!tasksDetailFetched[
                                          trader.name
                                        ].includes(task.id) && (
                                          <div
                                            className="d-flex justify-content-center align-items-center"
                                            style={{ height: "100px" }}
                                          >
                                            <TarkovSpinner />
                                          </div>
                                        )}
                                        {tasksDetailFetched[
                                          trader.name
                                        ].includes(task.id) && (
                                          <TaskDetail
                                            task={
                                              tasksDetail[trader.name][task.id]
                                            }
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </Collapse>
                                </td>
                              </tr>,
                            ]
                          })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            colSpan={4}
                            style={{ backgroundColor: "#121212" }}
                          ></td>
                        </tr>
                      </tfoot>
                    </Table>
                  </TabPane>
                )
              })}
          </Tabs>
        )}
      </Container>
    </>
  )
}

export { TaskScreen }
