import React from "react"
import { Image } from "react-bootstrap"
import { CountdownTimer } from "./CountdownTimer"
import { TraderIcon } from "./TraderIcon"
import standingIcon from "../../server/public/static/images/icon_standing_small.png"
import updateIcon from "../../server/public/static/images/icon_update_time.png"

const TraderCard = ({ trader, standing = 1, rep = 0.2, resetTime = null }) => {
  return (
    <div className="trader-card">
      <div className="pt-3 px-3 pb-1">
        <TraderIcon trader={trader} standing={standing} />
        <div className="trader-card-name">{trader.name}</div>
        <div className="mt-2 ">
          <Image src={standingIcon} className="trader-card-stand-icon" />
          <div className="d-inline-block trader-card-rep">{rep.toFixed(2)}</div>
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
