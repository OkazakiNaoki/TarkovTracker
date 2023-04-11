import React, { useEffect } from "react"
import { Row, Col, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { getTraderOffers } from "../reducers/TraderSlice"
import { ItemSingleGrid } from "./ItemSingleGrid"
import { TraderIcon } from "./TraderIcon"
import { TraderIconLevel } from "./TraderIconLevel"

const TraderOffers = ({
  traders,
  playerUnlockedOffer,
  useTable = true,
  useRowCol = false,
}) => {
  // redux
  const dispatch = useDispatch()
  const { traderOffers } = useSelector((state) => state.trader)

  // effect
  useEffect(() => {
    if (!traderOffers) {
      dispatch(getTraderOffers())
    }
  }, [])

  return (
    <div>
      {traders &&
        traders.map((trader) => {
          return (
            <div key={`${trader.name}_offers`}>
              <div className="px-3 py-2 mb-1 bg-black2">
                <div className="d-inline me-3">
                  <TraderIcon
                    trader={trader}
                    showStanding={false}
                    scale={0.5}
                    useInline={true}
                  />
                </div>
                <span className="fs-20px">{trader.name}</span>
              </div>

              {useTable && (
                <Table hover variant="dark" className="h-100">
                  <thead>
                    <tr>
                      <th className="bs-table-bg-black3">Level</th>
                      <th className="bs-table-bg-black3">Item</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traderOffers &&
                      Array.isArray(traderOffers[trader.name]) &&
                      traderOffers[trader.name].map((offer, i) => {
                        return (
                          <tr key={`${trader.name}_offer_${i}`}>
                            <td>
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <TraderIconLevel
                                  traderName={trader.name}
                                  level={offer.offerTraderLevel}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center h-100">
                                <div className="me-3">
                                  <ItemSingleGrid
                                    itemId={offer.offerItem.id}
                                    bgColor={offer.offerItem.backgroundColor}
                                  />
                                </div>
                                <span>{offer.offerItem.name}</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </Table>
              )}

              {/* none for this trader */}
              {useRowCol &&
                traderOffers &&
                !traderOffers.hasOwnProperty(trader.name) && (
                  <div className="d-flex justify-content-center align-items-center fs-20px bg-dark py-2">
                    <span>{"None"}</span>
                  </div>
                )}
              {/* ssome for this trader */}
              {useRowCol && (
                <Row xs={2} md={4} lg={6} className="g-1 mb-5">
                  {traderOffers &&
                    Array.isArray(traderOffers[trader.name]) &&
                    traderOffers[trader.name].map((offer, i) => {
                      return (
                        <Col key={`${trader.name}_offer_${i}`}>
                          <div className="bg-dark p-2">
                            <div className="d-flex justify-content-center align-items-center">
                              <TraderIconLevel
                                traderName={trader.name}
                                level={offer.offerTraderLevel}
                              />
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                              <ItemSingleGrid
                                itemId={offer.offerItem.id}
                                itemName={offer.offerItem.name}
                                bgColor={offer.offerItem.backgroundColor}
                                useNameBox={true}
                                locked={
                                  !playerUnlockedOffer[
                                    `${trader.name}-${offer.offerTraderLevel}-${offer.offerItem.id}`
                                  ]
                                }
                              />
                            </div>
                          </div>
                        </Col>
                      )
                    })}
                </Row>
              )}
            </div>
          )
        })}
    </div>
  )
}

export { TraderOffers }
