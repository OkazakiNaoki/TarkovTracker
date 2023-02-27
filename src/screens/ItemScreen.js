import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Image,
  Tab,
  Tabs,
  Table,
  Placeholder,
} from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { CheckLg, XLg } from "react-bootstrap-icons"
import {
  searchItem,
  searchHideoutItemReq,
  recoverItem,
  refectchFleaMarketBuyPrice,
  refectchFleaMarketSellPrice,
} from "../reducers/ItemSlice"
import {
  titleCase,
  insertSpaceIntoCamelCase,
} from "../helpers/StringCasesFormat"
import { getHMSfromS, formatInHoursMINsec } from "../helpers/TimeFormat"
import { TarkovSpinner } from "../components/TarkovSpinner"
import { TableRowLoading } from "../components/TableRowLoading"
import placeholderImg from "../../server/public/static/images/m4a1_placeholder.png"
import { getArrObjFieldBWhereFieldAEqualTo } from "../helpers/LoopThrough"
import { TraderIconLevel } from "../components/TraderIconLevel"
import { ItemSingleGrid } from "../components/ItemSingleGrid"
import { HideoutIcon } from "../components/HideoutIcon"
import { safeGet } from "../helpers/ObjectExt"
import { nonExistItemIconList } from "../data/NonExistItemIconList"
import defaultAvatar from "../../server/public/images/trader-icons/default_avatar.png"
import refreshIcon from "../../server/public/static/images/icon_refresh.png"

const ItemScreen = ({}) => {
  //// router
  const params = useParams()

  //// redux
  const dispatch = useDispatch()

  //// redux state
  const { item, isLoading, searchedItemId } = useSelector((state) => state.item)
  const { traders } = useSelector((state) => state.trader)

  //// state
  const [mainItemIconSrc, setMainItemIconSrc] = useState("")
  const [itemPropertyRow, setItemPropertyRow] = useState([])

  //// effect
  useEffect(() => {
    if (safeGet(item, "id") === params.itemId) {
      // current item is the target item, do nothing
    } else if (searchedItemId.includes(params.itemId)) {
      dispatch(recoverItem(params.itemId))
    } else {
      dispatch(searchItem({ id: params.itemId }))
      dispatch(searchHideoutItemReq({ itemId: params.itemId }))
    }
  }, [params.itemId])

  useEffect(() => {
    if (item) {
      if (!nonExistItemIconList.includes(item.id)) {
        setMainItemIconSrc(`/asset/${item.id}-icon-128.png`)
      } else {
        setMainItemIconSrc(placeholderImg)
      }
      calcPropertyPerRow()
    }
  }, [item])

  //// handle
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

  const refetchFleaMarketBuyPriceHandle = () => {
    dispatch(refectchFleaMarketBuyPrice({ id: params.itemId }))
  }

  const refetchFleaMarketSellPriceHandle = () => {
    dispatch(refectchFleaMarketSellPrice({ id: params.itemId }))
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
                src={mainItemIconSrc}
                alt={params.itemId}
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
                            {typeof el[0].value === "boolean" ? (
                              el[0].value ? (
                                <CheckLg />
                              ) : (
                                <XLg />
                              )
                            ) : (
                              el[0].value
                            )}
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
                            {typeof el[1].value === "boolean" ? (
                              el[1].value ? (
                                <CheckLg />
                              ) : (
                                <XLg />
                              )
                            ) : (
                              el[1].value
                            )}
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
                            {typeof el[0].value === "boolean" ? (
                              el[0].value ? (
                                <CheckLg />
                              ) : (
                                <XLg />
                              )
                            ) : (
                              el[0].value
                            )}
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
                  (item.buyFor.length > 0 ? (
                    item.buyFor.map((buy, i) => {
                      return (
                        <tr key={i}>
                          <td className="px-3">
                            <div className="d-flex align-items-center">
                              <Image
                                src={
                                  buy.vendor.name === "Flea Market"
                                    ? defaultAvatar
                                    : `/asset/${getArrObjFieldBWhereFieldAEqualTo(
                                        traders,
                                        "name",
                                        buy.vendor.name,
                                        "id"
                                      )}.png`
                                }
                                className="me-2"
                                style={{ width: "32px" }}
                              />
                              {buy.vendor.name}
                              {buy.vendor.name !== "Flea Market" && (
                                <TraderIconLevel
                                  level={buy.vendor.minTraderLevel}
                                />
                              )}
                              {buy.vendor.name === "Flea Market" && (
                                <Image
                                  src={refreshIcon}
                                  onClick={refetchFleaMarketBuyPriceHandle}
                                  role="button"
                                />
                              )}
                            </div>
                          </td>
                          <td>{buy.price}</td>
                          <td>{buy.currencyItem.name}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        <XLg color="red" size={40} />
                      </td>
                    </tr>
                  ))}
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
                  (item.sellFor.length > 0 ? (
                    item.sellFor.map((sell, i) => {
                      return (
                        <tr key={i}>
                          <td className="px-3">
                            <Image
                              src={
                                sell.vendor.name === "Flea Market"
                                  ? defaultAvatar
                                  : `/asset/${getArrObjFieldBWhereFieldAEqualTo(
                                      traders,
                                      "name",
                                      sell.vendor.name,
                                      "id"
                                    )}.png`
                              }
                              className="me-2"
                              style={{ width: `${64 * 0.5}px` }}
                            />
                            {sell.vendor.name}
                            {sell.vendor.name === "Flea Market" && (
                              <Image
                                src={refreshIcon}
                                onClick={refetchFleaMarketSellPriceHandle}
                                role="button"
                              />
                            )}
                          </td>
                          <td>{sell.price}</td>
                          <td>{sell.currencyItem.name}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        <XLg color="red" size={40} />
                      </td>
                    </tr>
                  ))}
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
                  (item.bartersFor.length > 0 ? (
                    item.bartersFor.map((barter, i) => {
                      return (
                        <tr key={i}>
                          <td className="px-3">
                            <Image
                              src={`/asset/${getArrObjFieldBWhereFieldAEqualTo(
                                traders,
                                "name",
                                barter.trader.name,
                                "id"
                              )}.png`}
                              className="me-2"
                              style={{ width: `${64 * 0.5}px` }}
                            />
                            {barter.trader.name}
                          </td>
                          <td style={{ whiteSpace: "break-spaces" }}>
                            {barter.requiredItems.reduce((prev, req, i) => {
                              prev.push(
                                <div
                                  className="d-flex align-items-center"
                                  key={`batter_require_item_${i}`}
                                >
                                  <div className="me-2">
                                    <ItemSingleGrid
                                      itemId={req.item.id}
                                      bgColor={req.item.backgroundColor}
                                      scale={0.5}
                                    />
                                  </div>
                                  {req.item.name + "  x" + req.count}
                                </div>
                              )
                              return prev
                            }, [])}
                          </td>
                          <td style={{ whiteSpace: "break-spaces" }}>
                            {barter.rewardItems.reduce((prev, rew, i) => {
                              prev.push(
                                <div
                                  className="d-flex align-items-center"
                                  key={`reward_item_${i}`}
                                >
                                  <div className="me-2">
                                    <ItemSingleGrid
                                      itemId={rew.item.id}
                                      bgColor={rew.item.backgroundColor}
                                      scale={0.5}
                                    />
                                  </div>
                                  {rew.item.name + "  x" + rew.count}
                                </div>
                              )
                              return prev
                            }, [])}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        <XLg color="red" size={40} />
                      </td>
                    </tr>
                  ))}
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
                  (item.craftsFor.length > 0 ? (
                    item.craftsFor.map((el, i) => {
                      return (
                        <tr key={i}>
                          <td className="px-3">
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                <HideoutIcon
                                  iconName={el.station.id}
                                  level={el.level}
                                  noHover={true}
                                  scale={0.5}
                                />
                              </div>
                              {el.station.name + " Level " + el.level}
                            </div>
                          </td>
                          <td style={{ whiteSpace: "break-spaces" }}>
                            {el.requiredItems.reduce((prev, req, i) => {
                              prev.push(
                                <div
                                  className="d-flex align-items-center"
                                  key={`craft_require_item_${i}`}
                                >
                                  <div className="me-2">
                                    <ItemSingleGrid
                                      itemId={req.item.id}
                                      bgColor={req.item.backgroundColor}
                                      scale={0.5}
                                    />
                                  </div>
                                  {req.item.name + "  x" + req.count}
                                </div>
                              )
                              return prev
                            }, [])}
                          </td>
                          <td>
                            {formatInHoursMINsec(getHMSfromS(el.duration))}
                          </td>
                          <td style={{ whiteSpace: "break-spaces" }}>
                            <div className="h-100">
                              {el.rewardItems.reduce((prev, rew, i) => {
                                prev.push(
                                  <div
                                    className="d-flex align-items-center"
                                    key={`reward_item_${i}`}
                                  >
                                    <div className="me-2">
                                      <ItemSingleGrid
                                        itemId={rew.item.id}
                                        bgColor={rew.item.backgroundColor}
                                        scale={0.5}
                                      />
                                    </div>
                                    {rew.item.name + "  x" + rew.count}
                                  </div>
                                )
                                return prev
                              }, [])}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        <XLg color="red" size={40} />
                      </td>
                    </tr>
                  ))}
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
                item &&
                item.hideout &&
                item.hideout.length > 0 ? (
                  item.hideout.map((station, i) => {
                    return (
                      <tr key={i}>
                        <td className="px-3">
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <HideoutIcon
                                iconName={station.id}
                                level={station.levels.level}
                                noHover={true}
                                scale={0.5}
                              />
                            </div>
                            {station.name + " Level " + station.levels.level}
                          </div>
                        </td>
                        <td style={{ whiteSpace: "break-spaces" }}>
                          {station.levels.itemRequirements.reduce(
                            (prev, req, i) => {
                              prev.push(
                                <div
                                  className="d-flex align-items-center"
                                  key={`hideout_require_item_${i}`}
                                >
                                  <div className="me-2">
                                    <ItemSingleGrid
                                      itemId={req.item.id}
                                      bgColor={req.item.backgroundColor}
                                      scale={0.5}
                                    />
                                  </div>
                                  {req.item.name + "  x" + req.count}
                                </div>
                              )
                              return prev
                            },
                            []
                          )}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <XLg color="red" size={40} />
                    </td>
                  </tr>
                )}
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
                  (item.usedInTasks.length > 0 ? (
                    item.usedInTasks.map((task, i) => {
                      return (
                        <tr key={i}>
                          <td className="px-3">{task.name}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Image
                                src={`/asset/${getArrObjFieldBWhereFieldAEqualTo(
                                  traders,
                                  "name",
                                  task.trader.name,
                                  "id"
                                )}.png`}
                                className="me-2"
                                style={{ width: `${64 * 0.5}px` }}
                              />
                              {task.trader.name}
                            </div>
                          </td>
                          <td style={{ whiteSpace: "break-spaces" }}>
                            {task.objectives.reduce((prev, objectives, i) => {
                              if (Object.keys(objectives).length !== 0) {
                                if (objectives.item.name === item.name) {
                                  prev.push(
                                    <div
                                      className="d-flex align-items-center"
                                      key={`task_obj_${i}`}
                                    >
                                      <div className="me-2">
                                        {titleCase(
                                          insertSpaceIntoCamelCase(
                                            objectives.type
                                          )
                                        )}
                                      </div>
                                      <div className="me-2">
                                        <ItemSingleGrid
                                          itemId={objectives.item.id}
                                          bgColor={
                                            objectives.item.backgroundColor
                                          }
                                          scale={0.5}
                                        />
                                      </div>
                                      {objectives.item.name +
                                        "  x" +
                                        objectives.count}
                                    </div>
                                  )
                                }
                                return prev
                              }
                            }, [])}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        <XLg color="red" size={40} />
                      </td>
                    </tr>
                  ))}
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
                  (item.receivedFromTasks.length > 0 ? (
                    item.receivedFromTasks.map((task, i) => {
                      return (
                        <tr key={i}>
                          <td className="px-3">{task.name}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Image
                                src={`/asset/${getArrObjFieldBWhereFieldAEqualTo(
                                  traders,
                                  "name",
                                  task.trader.name,
                                  "id"
                                )}.png`}
                                className="me-2"
                                style={{ width: `${64 * 0.5}px` }}
                              />
                              {task.trader.name}
                            </div>
                          </td>
                          <td style={{ whiteSpace: "break-spaces" }}>
                            {task.finishRewards.items.reduce((prev, rew, i) => {
                              prev.push(
                                <div
                                  className="d-flex align-items-center"
                                  key={`task_rew_${i}`}
                                >
                                  <div className="me-2">
                                    <ItemSingleGrid
                                      itemId={rew.item.id}
                                      bgColor={rew.item.backgroundColor}
                                      scale={0.5}
                                    />
                                  </div>
                                  {rew.item.name + "  x" + rew.count}
                                </div>
                              )
                              return prev
                            }, [])}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        <XLg color="red" size={40} />
                      </td>
                    </tr>
                  ))}
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
