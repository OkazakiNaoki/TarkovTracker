import React from "react"
import { Image } from "react-bootstrap"
import { TraderIcon } from "./TraderIcon"
import itemFulfillIcon from "../../server/public/static/images/icon_requirement_fulfilled.png"
import itemLockedIcon from "../../server/public/static/images/icon_requirement_locked.png"

const TraderRequirement = ({
  trader,
  standing,
  fulfill = false,
  showFulfill = false,
}) => {
  return (
    <div>
      <div className="d-flex justify-content-center">
        <TraderIcon trader={trader} standing={standing} />
      </div>
      <div className="d-flex justify-content-center">
        {showFulfill &&
          (fulfill ? (
            <Image src={itemFulfillIcon} />
          ) : (
            <Image src={itemLockedIcon} />
          ))}
      </div>
    </div>
  )
}

export { TraderRequirement }
