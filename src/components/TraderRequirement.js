import React from "react"
import { Image } from "react-bootstrap"
import { TraderIcon } from "./TraderIcon"
import itemFulfillIcon from "../../public/static/images/icon_requirement_fulfilled.png"
import itemLockedIcon from "../../public/static/images/icon_requirement_locked.png"

const TraderRequirement = ({ trader, standing, fulfill = false }) => {
  return (
    <div>
      <div className="d-flex justify-content-center">
        <TraderIcon trader={trader} standing={standing} />
      </div>
      <div className="d-flex justify-content-center">
        {fulfill ? (
          <Image src={itemFulfillIcon} />
        ) : (
          <Image src={itemLockedIcon} />
        )}
      </div>
    </div>
  )
}

export { TraderRequirement }
