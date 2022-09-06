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
  getTraders,
  getTasksOfTrader,
  getTaskDetail,
} from "../reducers/TraderSlice"
import placeholderImg from "../../public/static/images/default_avatar.png"
import { TaskDetail } from "../components/TaskDetail"

const TaskScreen = () => {
  // hooks
  const [curTrader, setCurTrader] = useState("Prapor")
  const [collapseDetail, setCollapseDetail] = useState({})

  // redux
  const { isLoading, traders, tasks, tasksDetail, tasksDetailFetched } =
    useSelector((state) => state.trader)
  const dispatch = useDispatch()

  useEffect(() => {
    if (traders.length === 0) {
      dispatch(getTraders())
    }
  }, [traders])

  useEffect(() => {
    if (traders.length !== 0) {
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
        <Row className="justify-content-center">
          {traders.length !== 0 &&
            traders.map((el, i) => {
              if (i < traders.length / 2)
                return (
                  <Col
                    key={i}
                    className="col-auto"
                    style={{ border: "1px solid white" }}
                  >
                    <a
                      onClick={() => {
                        setCurTrader(el.name)
                      }}
                    >
                      <Image
                        src={`/asset/${el.id}.png`}
                        onError={(e) => imgLoadErrHandle(e)}
                        style={{ width: "130px", height: "130px" }}
                      />
                    </a>
                  </Col>
                )
            })}
        </Row>
        <Row className="justify-content-center">
          {traders.length !== 0 &&
            traders.map((el, i) => {
              if (i >= traders.length / 2)
                return (
                  <Col
                    key={i}
                    className="col-auto"
                    style={{ border: "1px solid white" }}
                  >
                    <a
                      onClick={() => {
                        setCurTrader(el.name)
                      }}
                    >
                      <Image
                        src={`/asset/${el.id}.png`}
                        onError={(e) => imgLoadErrHandle(e)}
                        style={{ width: "130px", height: "130px" }}
                      />
                    </a>
                  </Col>
                )
            })}
        </Row>

        <Tabs activeKey={curTrader} className="py-3">
          {traders.length !== 0 &&
            traders.map((trader, i) => {
              return (
                <TabPane eventKey={trader.name} key={trader.id}>
                  <Table bordered hover variant="dark" className="p-4">
                    <thead>
                      <tr>
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
                                  ) &&
                                  !isLoading
                                )
                                  dispatch(
                                    getTaskDetail({
                                      id: task.id,
                                      traderName: trader.name,
                                    })
                                  )
                                collapseExpandTaskDetail(task.id)
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
                                      " @Lv." +
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
                                    <div style={{ minHeight: "200px" }}>
                                      {tasksDetailFetched[trader.name].includes(
                                        task.id
                                      ) && (
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
      </Container>
    </>
  )
}

export default TaskScreen
