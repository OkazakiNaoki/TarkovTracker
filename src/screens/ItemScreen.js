import React, { useState, useEffect } from "react"
import { Container, Row, Col, Image, Tab, Tabs, Table } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { searchItem, searchHideoutItemReq } from "../reducers/ItemSlice"
import {
  titleCase,
  insertSpaceIntoCamelCase,
} from "../helpers/StringCasesFormat"
import placeholderImg from "../../public/static/images/m4a1_placeholder.png"

const ItemScreen = ({}) => {
  // router
  const params = useParams()

  // redux
  const dispatch = useDispatch()
  const { item, hideout } = useSelector((state) => state.item)

  // hooks state
  const [imgSrc, setImgSrc] = useState("")
  const [itemPropertyRow, setItemPropertyRow] = useState([])

  // hooks effect
  useEffect(() => {
    dispatch(searchItem({ name: params.itemName }))
    dispatch(searchHideoutItemReq({ itemName: params.itemName }))
  }, [dispatch, params.itemName])
  useEffect(() => {
    setImgSrc(`/asset/${item.id}-icon.png`)
    calcPropertyPerRow()
  }, [item])

  // handler
  const imgLoadErrHandle = () => {
    setImgSrc(placeholderImg)
  }

  const calcPropertyPerRow = () => {
    const properties = []
    const propertyKeys = Object.keys(item.properties)
    for (let i = 0; i < propertyKeys.length; i += 2) {
      const propertyRow = []
      propertyRow.push({
        key: propertyKeys[i],
        value: item.properties[propertyKeys[i]],
      })
      if (i + 1 < propertyKeys.length) {
        propertyRow.push({
          key: propertyKeys[i + 1],
          value: item.properties[propertyKeys[i + 1]],
        })
      }
      properties.push(propertyRow)
    }
    setItemPropertyRow(properties)
  }

  return (
    <>
      <h1 className="pt-5 pb-3 text-light tarkov-font">{params.itemName}</h1>
      <h6 className="text-light tarkov-font">{item.shortName}</h6>
      <h6 className="text-light tarkov-font">ID: {item.id}</h6>
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
            {itemPropertyRow.map((el, i) => {
              if (el.length === 2)
                return (
                  <Row key={i} className="g-2 mb-2">
                    <Col sm={12} md={6}>
                      <div className="text-light border border-light py-2 h-100">
                        <div className="text-center">{el[0].key}</div>
                        <div
                          className="px-3"
                          style={{ whiteSpace: "break-spaces" }}
                        >
                          {el[0].value}
                        </div>
                      </div>
                    </Col>
                    <Col sm={12} md={6}>
                      <div className="text-light border border-light py-2 h-100">
                        <div className="text-center">{el[1].key}</div>
                        <div
                          className="px-3"
                          style={{ whiteSpace: "break-spaces" }}
                        >
                          {el[1].value}
                        </div>
                      </div>
                    </Col>
                  </Row>
                )
              else
                return (
                  <Row key={i} className="g-2 mb-2">
                    <Col sm={12} md={6}>
                      <div className="text-light border border-light py-2 h-100">
                        <div className="text-center">{el[0].key}</div>
                        <div
                          className="px-3"
                          style={{ whiteSpace: "break-spaces" }}
                        >
                          {el[0].value}
                        </div>
                      </div>
                    </Col>
                  </Row>
                )
            })}
          </Col>
        </Row>
      </Container>

      <Tabs
        defaultActiveKey="buyFrom"
        id="justify-tab-example"
        className="mb-4 flex-column flex-md-row"
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
              {item.buyFor &&
                item.buyFor.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        {el.vendor.name !== "Flea Market"
                          ? el.vendor.name + " @Lv." + el.vendor.minTraderLevel
                          : el.vendor.name}
                      </td>
                      <td>{el.price}</td>
                      <td>{el.currencyItem.name}</td>
                    </tr>
                  )
                })}
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
              {item.sellFor &&
                item.sellFor.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{el.vendor.name}</td>
                      <td>{el.price}</td>
                      <td>{el.currencyItem.name}</td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="barterFrom" title="Barter from">
          <Table bordered hover variant="dark" className="p-4">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Give</th>
                <th>Get</th>
              </tr>
            </thead>
            <tbody>
              {item.bartersFor &&
                item.bartersFor.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{el.trader.name}</td>
                      <td style={{ whiteSpace: "break-spaces" }}>
                        {el.requiredItems.reduce((prev, el) => {
                          return prev + el.item.name + "  x" + el.count + "\n"
                        }, "")}
                      </td>
                      <td style={{ whiteSpace: "break-spaces" }}>
                        {el.rewardItems.reduce((prev, el) => {
                          return prev + el.item.name + "  x" + el.count + "\n"
                        }, "")}
                      </td>
                    </tr>
                  )
                })}
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
              {hideout &&
                hideout.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{el.name + " @Lv." + el.levels.level}</td>
                      <td style={{ whiteSpace: "break-spaces" }}>
                        {el.levels.itemRequirements.reduce((prev, el) => {
                          return prev + el.item.name + "  x" + el.count + "\n"
                        }, "")}
                      </td>
                    </tr>
                  )
                })}
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
              {item.usedInTasks &&
                item.usedInTasks.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{el.name}</td>
                      <td>{el.trader.name}</td>
                      <td style={{ whiteSpace: "break-spaces" }}>
                        {el.objectives.reduce((prev, el) => {
                          if (Object.keys(el).length !== 0) {
                            return (
                              prev +
                              (el.item.name === params.itemName
                                ? titleCase(insertSpaceIntoCamelCase(el.type)) +
                                  " " +
                                  el.item.name +
                                  "  x" +
                                  el.count +
                                  "\n"
                                : "")
                            )
                          } else return prev
                        }, "")}
                      </td>
                    </tr>
                  )
                })}
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
              {item.receivedFromTasks &&
                item.receivedFromTasks.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{el.name}</td>
                      <td>{el.trader.name}</td>
                      <td style={{ whiteSpace: "break-spaces" }}>
                        {el.finishRewards.items.reduce((prev, el) => {
                          return prev + el.item.name + "  x" + el.count + "\n"
                        }, "")}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </>
  )
}

export { ItemScreen }
