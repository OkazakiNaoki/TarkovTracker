import React from "react"
import { Image } from "react-bootstrap"
import timerIcon from "../../server/public/static/images/icon_timer.png"

const CraftTimeRequirement = ({ timeStr }) => {
  return (
    <div className="hideout-craft-time">
      <div className="d-flex align-items-center justify-content-center">
        <Image src={timerIcon} />
        <p className="mb-0 text-center">{timeStr}</p>
      </div>
    </div>
  )
}

export { CraftTimeRequirement }
