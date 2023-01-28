import React from "react"
import { Image } from "react-bootstrap"
import { CountdownTimer } from "./CountdownTimer"
import { TraderIcon } from "./TraderIcon"
import traderBg from "../../server/public/static/images/image_diagonal_trader.png"
import standingIcon from "../../server/public/static/images/icon_standing_small.png"
import updateIcon from "../../server/public/static/images/icon_update_time.png"

const TraderCard = ({ trader, standing = 1, rep = 0.2, resetTime = null }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${traderBg})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "black",
      }}
    >
      <div className="pt-3 px-3 pb-1">
        <TraderIcon trader={trader} standing={standing} />
        <div
          className="text-center"
          style={{
            color: "#c6c4b2",
            backgroundColor: "#282925",
            marginTop: "3px",
          }}
        >
          {trader.name}
        </div>
        <div className="mt-2">
          <Image src={standingIcon} style={{ marginRight: "3px" }} />
          <div
            className="d-inline-block"
            style={{ fontSize: "12px", marginRight: "7px" }}
          >
            {rep.toFixed(2)}
          </div>
          {resetTime && (
            <>
              <Image src={updateIcon} />
              <CountdownTimer targetDate={Date.parse(resetTime)} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { TraderCard }
