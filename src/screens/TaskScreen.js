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
  getTasksOfTrader,
  getTaskDetail,
  initializeTasks,
} from "../reducers/TraderSlice"
import placeholderImg from "../../public/static/images/default_avatar.png"
import { TaskDetail } from "../components/TaskDetail"
import { TarkovSpinner } from "../components/TarkovSpinner"
import { TableRowLoading } from "../components/TableRowLoading"
import { TraderButton } from "../components/TraderButton"

const TaskScreen = () => {
  // hooks
  const [curTrader, setCurTrader] = useState(null)
  const [collapseDetail, setCollapseDetail] = useState({})

  // redux
  const {
    initTasks,
    isLoadingTasks,
    traders,
    tasks,
    tasksDetail,
    tasksDetailFetched,
  } = useSelector((state) => state.trader)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!initTasks) {
      dispatch(initializeTasks())
    }
  }, [initTasks])

  useEffect(() => {
    if (curTrader) {
      if (!tasks[curTrader]) {
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

  const imgLoadErrHandle = (e) => {
    e.target.src = placeholderImg
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
          <div style={{ width: "696px" }}>
            <Row xs={4} className="g-3">
              {traders.length !== 0 &&
                traders.map((trader, i) => {
                  return (
                    <Col key={i}>
                      <div
                        role="button"
                        onClick={() => {
                          setCurTrader(trader.name)
                        }}
                      >
                        <TraderButton trader={trader} />
                      </div>
                    </Col>
                  )
                })}
            </Row>
          </div>
        </div>

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
                    <Table bordered hover variant="dark" className="p-4">
                      <thead>
                        <tr
                          style={{
                            "--bs-table-bg": "black",
                          }}
                        >
                          <th>Task name</th>
                          <th>Level requirement</th>
                          <th>Previous task</th>
                          <th>Trader level requirement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks[trader.name] &&
                          tasks[trader.name].map((task, j) => {
                            return [
                              <tr
                                key={task.id}
                                onClick={() => {
                                  if (
                                    !tasksDetailFetched[trader.name].includes(
                                      task.id
                                    )
                                  ) {
                                    dispatch(
                                      getTaskDetail({
                                        id: task.id,
                                        traderName: trader.name,
                                      })
                                    )
                                  }
                                  collapseExpandTaskDetail(task.id)
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
                                      return prev + taskReq.task.name + "\n"
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

export default TaskScreen
