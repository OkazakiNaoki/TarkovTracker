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
  setTaskCollapse,
  getTaskDetail,
} from "../reducers/TraderSlice"
import placeholderImg from "../../public/static/images/default_avatar.png"
import { Link } from "react-router-dom"
import { TaskDetail } from "../components/TaskDetail"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"

const TaskScreen = () => {
  // hooks
  const [imgSrc, setImgSrc] = useState([])
  const [curTrader, setCurTrader] = useState("Prapor")

  // redux
  const { traders, tasks, tasksDetail } = useSelector((state) => state.trader)
  const dispatch = useDispatch()

  useEffect(() => {
    if (traders.length === 0) {
      dispatch(getTraders())
    }
    if (traders.length !== 0 && imgSrc.length === 0) {
      const init = []
      traders.forEach((el) => {
        init.push(`/asset/${el.id}.png`)
      })
      setImgSrc(init)
    }
  }, [traders])

  useEffect(() => {
    if (traders.length !== 0) {
      let index = getIndexOfMatchFieldObjArr(traders, "name", curTrader)
      if (curTrader.length > 0 && Object.keys(tasks[index]).length === 0) {
        dispatch(getTasksOfTrader({ trader: curTrader }))
      }
    }
  }, [traders, curTrader])

  const imgLoadErrHandle = (e) => {
    e.target.src = placeholderImg
  }

  return (
    <>
      <Container className="mb-5">
        <Row className="justify-content-center">
          {imgSrc.length !== 0 &&
            imgSrc.map((el, i) => {
              if (i < imgSrc.length / 2)
                return (
                  <Col
                    key={i}
                    className="col-auto"
                    style={{ border: "1px solid white" }}
                  >
                    <a
                      onClick={() => {
                        setCurTrader(traders[i].name)
                      }}
                    >
                      <Image
                        src={imgSrc[i]}
                        onError={(e) => imgLoadErrHandle(e)}
                        style={{ width: "130px", height: "130px" }}
                      />
                    </a>
                  </Col>
                )
            })}
        </Row>
        <Row className="justify-content-center">
          {imgSrc.length !== 0 &&
            imgSrc.map((el, i) => {
              if (i >= imgSrc.length / 2)
                return (
                  <Col
                    key={i}
                    className="col-auto"
                    style={{ border: "1px solid white" }}
                  >
                    <a
                      onClick={() => {
                        setCurTrader(traders[i].name)
                      }}
                    >
                      <Image
                        src={imgSrc[i]}
                        onError={(e) => imgLoadErrHandle(e)}
                        style={{ width: "130px", height: "130px" }}
                      />
                    </a>
                  </Col>
                )
            })}
        </Row>
      </Container>

      <Tabs activeKey={curTrader}>
        {traders.length !== 0 &&
          traders.map((el, i) => {
            return (
              <TabPane eventKey={el.name} key={el.id}>
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
                    {tasks[i].length !== 0 &&
                      tasks[i].map((el, j) => {
                        return [
                          <tr
                            key={el.id}
                            onClick={() => {
                              if (tasksDetail[i][j] === null)
                                dispatch(getTaskDetail({ id: el.id, i, j }))
                              dispatch(setTaskCollapse({ i, j }))
                            }}
                          >
                            <td>{el.name}</td>
                            <td>{el.minPlayerLevel}</td>
                            <td style={{ whiteSpace: "break-spaces" }}>
                              {el.taskRequirements.reduce((prev, el) => {
                                return prev + el.task.name + "\n"
                              }, "")}
                            </td>
                            <td>
                              {el.traderLevelRequirements.reduce((prev, el) => {
                                return (
                                  prev +
                                  el.trader.name +
                                  " @Lv." +
                                  el.level +
                                  "\n"
                                )
                              }, "")}
                            </td>
                          </tr>,

                          <tr key={el.id + "_collapse"}>
                            <td colSpan="4" style={{ padding: "0" }}>
                              <Collapse in={el.collapse}>
                                <div>
                                  <div style={{ minHeight: "200px" }}>
                                    {tasksDetail[i][j] && (
                                      <TaskDetail task={tasksDetail[i][j]} />
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
    </>
  )
}

export default TaskScreen
