import React, { useState, useEffect } from "react"
import { Container, Row, Col, Image, Tab, Tabs, Table } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { searchItem } from "../reducers/ItemSlice"
import placeholderImg from "../../public/static/images/m4a1_placeholder.png"

const ItemScreen = ({}) => {
  // router
  const params = useParams()

  // redux
  const dispatch = useDispatch()
  const { data } = useSelector((state) => state.item)

  // hooks state
  const [imgSrc, setImgSrc] = useState("")

  // hooks effect
  useEffect(() => {
    dispatch(searchItem({ name: params.itemName }))
  }, [dispatch, params.itemName])
  useEffect(() => {
    setImgSrc(`/asset/${data.id}-icon.png`)
  }, [data])

  // handler
  const imgLoadErrHandle = () => {
    setImgSrc(placeholderImg)
  }

  return (
    <>
      <h1 className="pt-5 pb-3 text-light tarkov-font">{params.itemName}</h1>
      <h6 className="text-light tarkov-font">{data.shortName}</h6>
      <h6 className="text-light tarkov-font">ID: {data.id}</h6>
      <Container className="mb-5">
        <Row className="gx-5">
          <Col
            sm={6}
            className="d-flex align-items-center justify-content-center border border-light"
            style={{
              height: "300px",
            }}
          >
            <Image
              src={imgSrc}
              alt={params.itemName}
              onError={imgLoadErrHandle}
            ></Image>
          </Col>

          <Col sm={6}>
            <Row className="g-2 mb-2">
              <Col sm={12} md={6}>
                <div className="text-light border border-light">property 1</div>
              </Col>
              <Col sm={12} md={6}>
                <div className="text-light border border-light">property 2</div>
              </Col>
            </Row>
            <Row className="g-2 mb-2">
              <Col sm={12} md={6}>
                <div className="text-light border border-light">property 3</div>
              </Col>
              <Col sm={12} md={6}>
                <div className="text-light border border-light">property 4</div>
              </Col>
            </Row>
            <Row className="g-2 mb-2">
              <Col sm={12} md={6}>
                <div className="text-light border border-light">property 5</div>
              </Col>
              <Col sm={12} md={6}>
                <div className="text-light border border-light">property 6</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Tabs
        defaultActiveKey="buyFrom"
        id="justify-tab-example"
        className="mb-4"
        transition={false}
        justify
      >
        <Tab eventKey="buyFrom" title="Buy from">
          <Table bordered hover variant="dark" className="p-4">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Price</th>
                <th>Currency</th>
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
        </Tab>
        <Tab eventKey="sellTo" title="Sell to">
          <Table bordered hover variant="dark" className="p-4">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Price</th>
                <th>Currency</th>
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
        </Tab>
        <Tab eventKey="barterFrom" title="Barter from">
          <Table bordered hover variant="dark" className="p-4">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Item list</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
              </tr>
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="craft" title="Craft">
          <Table bordered hover variant="dark" className="p-4">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Requirement</th>
                <th>Duration</th>
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
        </Tab>
        <Tab eventKey="hideout" title="Hideout">
          <Table bordered hover variant="dark" className="p-4">
            <thead>
              <tr>
                <th>Module</th>
                <th>Requirement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
              </tr>
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="taskNeed" title="Task need">
          <Table bordered hover variant="dark" className="p-4">
            <thead>
              <tr>
                <th>Task</th>
                <th>Vendor</th>
                <th>Requirement</th>
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
        </Tab>
        <Tab eventKey="taskReward" title="Task reward">
          <Table bordered hover variant="dark" className="p-4">
            <thead>
              <tr>
                <th>Task</th>
                <th>Vendor</th>
                <th>Reward</th>
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
        </Tab>
      </Tabs>
    </>
  )
}

export { ItemScreen }
