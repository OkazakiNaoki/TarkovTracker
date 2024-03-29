import React from "react"
import { useSelector } from "react-redux"
import { Image } from "react-bootstrap"
import { getArrObjFieldBWhereFieldAEqualTo } from "../helpers/LoopThrough"
import { TraderIconLevel } from "./TraderIconLevel"

const FloatingTraderTraderInfo = ({
  posX,
  posY,
  display,
  type,
  tradeInfo,
  scale = 0.6,
}) => {
  //// redux state
  const { traders } = useSelector((state) => state.trader)

  return (
    <div
      className="floating-box"
      style={{
        left: posX,
        top: posY,
        display: display,
      }}
    >
      <div className="py-1 px-2">
        {tradeInfo.map((trade, i) => (
          <div key={`trade_no_${i}`} className="d-flex align-items-center m-1">
            {trade.trader === "Flea Market"
              ? null
              : [
                  <Image
                    src={`/asset/${getArrObjFieldBWhereFieldAEqualTo(
                      traders,
                      "name",
                      trade.trader,
                      "id"
                    )}.png`}
                    className="me-1"
                    style={{ width: `${64 * scale}px` }}
                    key={trade.trader}
                  />,
                  <div className="me-1" key={trade.trader + "_" + trade.level}>
                    <TraderIconLevel level={trade.level} />
                  </div>,
                ]}
            {type === "buy" && trade.trader !== "Flea Market" ? (
              <div className="me-1">{`${trade.price} ${trade.currency}`}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export { FloatingTraderTraderInfo }
