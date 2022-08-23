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
} from "react-bootstrap"
import { getTraders } from "../reducers/TraderSlice"
import placeholderImg from "../../public/static/images/default_avatar.png"
import { Link } from "react-router-dom"

const TaskScreen = () => {
  // hooks
  const [imgSrc, setImgSrc] = useState([])
  const [curTrader, setCurTrader] = useState("Prapor")

  // redux
  const { traders } = useSelector((state) => state.trader)
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
                      <th>{el.name}</th>
                      <th>1</th>
                      <th>1</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                    </tr>
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
