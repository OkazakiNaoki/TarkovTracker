import React from "react"
import { ItemSingleGrid } from "./ItemSingleGrid"
import itemFulfillIcon from "../../public/static/images/icon_requirement_fulfilled.png"
import itemLockedIcon from "../../public/static/images/icon_requirement_locked.png"
import { Image } from "react-bootstrap"

const ItemRequirement = ({
  itemId,
  itemName,
  bgColor,
  reqAmount,
  curAmount = null,
  showFulfill = false,
}) => {
  return (
    <div>
      <div className="w-100">
        <div className="d-flex justify-content-center">
          <ItemSingleGrid
            itemId={itemId}
            itemName={itemName}
            bgColor={bgColor}
            transparent={77}
            useBgImg={false}
            useNameBox={true}
          />
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <div className={`d-inline-block ${showFulfill ? "me-1" : ""}`}>
          {showFulfill && curAmount !== null && curAmount + "/"}
          {reqAmount}
        </div>
        {showFulfill &&
          (curAmount >= reqAmount ? (
            <Image src={itemFulfillIcon} style={{ margin: "0 -8px 0 -6px" }} />
          ) : (
            <Image src={itemLockedIcon} style={{ margin: "0 -8px 0 -6px" }} />
          ))}
      </div>
    </div>
  )
}

export { ItemRequirement }
