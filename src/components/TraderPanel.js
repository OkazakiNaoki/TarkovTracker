import React, { useState } from "react"
import { Col, Row } from "react-bootstrap"
import { TraderCard } from "./TraderCard"
import { TraderRelationModal } from "./TraderRelationModal"

const TraderPanel = ({ traders, traderProgress }) => {
  //// state
  const [modalStatus, setModalStatus] = useState(false)
  const [targetTrader, setTargetTrader] = useState("")

  ////handle
  const clickTraderCardHandle = (traderName) => {
    setTargetTrader(traderName)
    closeModalHandle()
  }

  const closeModalHandle = () => {
    setModalStatus(!modalStatus)
  }

  return (
    <>
      <TraderRelationModal
        show={modalStatus}
        traderName={targetTrader}
        closeHandle={closeModalHandle}
      />
      <Row xs={2} sm={3} md={4} className="g-3">
        {traders.length !== 0 &&
          traderProgress &&
          traders.map((trader, i) => {
            return (
              <Col key={i}>
                <div className="d-flex justify-content-center">
                  <div
                    className="d-flex"
                    role="button"
                    onClick={clickTraderCardHandle.bind(null, trader.name)}
                  >
                    <TraderCard
                      trader={trader}
                      standing={
                        traderProgress && traderProgress.traderLL[trader.name]
                      }
                      rep={
                        traderProgress.traderRep &&
                        traderProgress.traderRep[trader.name]
                      }
                    />
                  </div>
                </div>
              </Col>
            )
          })}
      </Row>
    </>
  )
}

export { TraderPanel }
