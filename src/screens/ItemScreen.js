import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Image,
  Tab,
  Tabs,
  Table,
  Button,
  Placeholder,
} from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { searchItem, searchHideoutItemReq } from "../reducers/ItemSlice"
import {
  titleCase,
  insertSpaceIntoCamelCase,
} from "../helpers/StringCasesFormat"
import { getHMSfromS, formatInHoursMINsec } from "../helpers/TimeFormat"
import placeholderImg from "../../public/static/images/m4a1_placeholder.png"
import { TarkovSpinner } from "../components/TarkovSpinner"
import { TableRowLoading } from "../components/TableRowLoading"

const ItemScreen = ({}) => {
  // router
  const params = useParams()

  // redux
  const dispatch = useDispatch()
  const { item, hideout, isLoading } = useSelector((state) => state.item)

  // hooks state
  const [imgSrc, setImgSrc] = useState("")
  const [itemPropertyRow, setItemPropertyRow] = useState([])

  // hooks effect
  useEffect(() => {
    dispatch(searchItem({ id: params.itemId }))
    dispatch(searchHideoutItemReq({ itemId: params.itemId }))
  }, [params.itemId])

  useEffect(() => {
    if (item) {
      setImgSrc(`/asset/${item.id}-icon-128.png`)
      calcPropertyPerRow()
    }
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
      <Container className="py-5">
        <h1 className="pb-3 sandbeige">
          {isLoading ? (
            <Placeholder animation="wave">
              <Placeholder xs={8} size="lg" />
            </Placeholder>
          ) : (
            item.name
          )}
        </h1>
        <h6>
          {isLoading ? (
            <Placeholder animation="wave">
              <Placeholder xs={2} size="lg" />
            </Placeholder>
          ) : (
            item.shortName
          )}
        </h6>
        <h6>
          ID:{" "}
          {isLoading ? (
            <Placeholder animation="wave">
              <Placeholder xs={4} size="lg" />
            </Placeholder>
          ) : (
            item.id
          )}
        </h6>

        <Row className="gx-5 mb-5">
          <Col
            sm={6}
            className="d-flex align-items-center justify-content-center p-3 gray-rounded-20"
            style={{
              height: "300px",
            }}
          >
            {isLoading ? (
              <TarkovSpinner />
            ) : (
              <Image
                src={imgSrc}
                alt={params.itemId}
                onError={imgLoadErrHandle}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              ></Image>
            )}
          </Col>

          <Col sm={6}>
            {isLoading && (
              <Row className="g-2 mb-2">
                {new Array(6).fill().map((el, i) => (
                  <Col key={`dummp_col_${i}`} sm={12} md={6}>
                    <div className="py-2 h-100 gray-rounded-20">
                      <div className="text-center">
                        <Placeholder animation="wave">
                          <Placeholder xs={2} size="lg" />
                        </Placeholder>
                      </div>
                      <div
                        className="px-3"
                        style={{ whiteSpace: "break-spaces" }}
                      >
                        <Placeholder animation="wave">
                          <Placeholder xs={4} size="lg" />
                        </Placeholder>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
            {!isLoading &&
              itemPropertyRow.map((el, i) => {
                if (el.length === 2)
                  return (
                    <Row key={i} className="g-2 mb-2">
                      <Col sm={12} md={6}>
                        <div className="py-2 h-100 gray-rounded-20">
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
                        <div className="py-2 h-100 gray-rounded-20">
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
                        <div className="py-2 h-100 gray-rounded-20">
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

        <Tabs
          defaultActiveKey="buyFrom"
          className="mb-4 flex-column flex-md-row"
          transition={false}
          justify
        >
          <Tab eventKey="buyFrom" title="Buy from">
            <Table hover variant="dark" className="round-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#121212" }}>Vendor</th>
                  <th style={{ backgroundColor: "#121212" }}>Price</th>
                  <th style={{ backgroundColor: "#121212" }}>Currency</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <TableRowLoading colSize={3} />}
                {!isLoading &&
                  item.buyFor &&
                  item.buyFor.map((el, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          {el.vendor.name !== "Flea Market"
                            ? el.vendor.name + " LL" + el.vendor.minTraderLevel
                            : el.vendor.name}
                        </td>
                        <td>{el.price}</td>
                        <td>{el.currencyItem.name}</td>
                      </tr>
                    )
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ backgroundColor: "#121212" }}></td>
                </tr>
              </tfoot>
            </Table>
          </Tab>
          <Tab eventKey="sellTo" title="Sell to">
            <Table hover variant="dark" className="round-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#121212" }}>Vendor</th>
                  <th style={{ backgroundColor: "#121212" }}>Price</th>
                  <th style={{ backgroundColor: "#121212" }}>Currency</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <TableRowLoading colSize={3} />}
                {!isLoading &&
                  item.sellFor &&
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
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ backgroundColor: "#121212" }}></td>
                </tr>
              </tfoot>
            </Table>
          </Tab>
          <Tab eventKey="barterFrom" title="Barter from">
            <Table hover variant="dark" className="round-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#121212" }}>Vendor</th>
                  <th style={{ backgroundColor: "#121212" }}>Give</th>
                  <th style={{ backgroundColor: "#121212" }}>Get</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <TableRowLoading colSize={3} />}
                {!isLoading &&
                  item.bartersFor &&
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
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ backgroundColor: "#121212" }}></td>
                </tr>
              </tfoot>
            </Table>
          </Tab>
          <Tab eventKey="craft" title="Craft">
            <Table hover variant="dark" className="round-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#121212" }}>Module</th>
                  <th style={{ backgroundColor: "#121212" }}>Give</th>
                  <th style={{ backgroundColor: "#121212" }}>Duration</th>
                  <th style={{ backgroundColor: "#121212" }}>Get</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <TableRowLoading colSize={4} />}
                {!isLoading &&
                  item.craftsFor &&
                  item.craftsFor.map((el, i) => {
                    return (
                      <tr key={i}>
                        <td>{el.station.name + " Level " + el.level}</td>
                        <td style={{ whiteSpace: "break-spaces" }}>
                          {el.requiredItems.reduce((prev, el) => {
                            return prev + el.item.name + "  x" + el.count + "\n"
                          }, "")}
                        </td>
                        <td>{formatInHoursMINsec(getHMSfromS(el.duration))}</td>
                        <td style={{ whiteSpace: "break-spaces" }}>
                          {el.rewardItems.reduce((prev, el) => {
                            return prev + el.item.name + "  x" + el.count + "\n"
                          }, "")}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ backgroundColor: "#121212" }}></td>
                </tr>
              </tfoot>
            </Table>
          </Tab>
          <Tab eventKey="hideout" title="Hideout">
            <Table hover variant="dark" className="round-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#121212" }}>Module</th>
                  <th style={{ backgroundColor: "#121212" }}>Requirement</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <TableRowLoading colSize={2} />}
                {!isLoading &&
                  hideout &&
                  hideout.map((el, i) => {
                    return (
                      <tr key={i}>
                        <td>{el.name + " Level " + el.levels.level}</td>
                        <td style={{ whiteSpace: "break-spaces" }}>
                          {el.levels.itemRequirements.reduce((prev, el) => {
                            return prev + el.item.name + "  x" + el.count + "\n"
                          }, "")}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ backgroundColor: "#121212" }}></td>
                </tr>
              </tfoot>
            </Table>
          </Tab>
          <Tab eventKey="taskNeed" title="Task need">
            <Table hover variant="dark" className="round-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#121212" }}>Task</th>
                  <th style={{ backgroundColor: "#121212" }}>Vendor</th>
                  <th style={{ backgroundColor: "#121212" }}>Requirement</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <TableRowLoading colSize={3} />}
                {!isLoading &&
                  item.usedInTasks &&
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
                                (el.item.name === item.name
                                  ? titleCase(
                                      insertSpaceIntoCamelCase(el.type)
                                    ) +
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
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ backgroundColor: "#121212" }}></td>
                </tr>
              </tfoot>
            </Table>
          </Tab>
          <Tab eventKey="taskReward" title="Task reward">
            <Table hover variant="dark" className="round-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#121212" }}>Task</th>
                  <th style={{ backgroundColor: "#121212" }}>Vendor</th>
                  <th style={{ backgroundColor: "#121212" }}>Reward</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <TableRowLoading colSize={3} />}
                {!isLoading &&
                  item.receivedFromTasks &&
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
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ backgroundColor: "#121212" }}></td>
                </tr>
              </tfoot>
            </Table>
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}

export { ItemScreen }
