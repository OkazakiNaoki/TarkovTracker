import React from "react"
import { Image } from "react-bootstrap"
import { HideoutIcon } from "./HideoutIcon"
import itemFulfillIcon from "../../server/public/static/images/icon_requirement_fulfilled.png"
import itemLockedIcon from "../../server/public/static/images/icon_requirement_locked.png"

const HideoutRequirement = ({
  hideoutId,
  hideoutName,
  level,
  showFulfill = false,
  fulfill = false,
}) => {
  return (
    <div className="d-flex align-items-center mx-3">
      <div className="d-inline-block" style={{ marginRight: "-10px" }}>
        <HideoutIcon
          iconName={hideoutId}
          level={level}
          redOutlined={!fulfill}
          noHover={true}
        />
      </div>
      <div
        className="d-inline-block me-2"
        style={{ color: fulfill ? "white" : "#c40000" }}
      >
        {hideoutName}
      </div>
      {showFulfill &&
        (fulfill ? (
          <Image src={itemFulfillIcon} style={{ margin: "0 -8px 0 -6px" }} />
        ) : (
          <Image src={itemLockedIcon} style={{ margin: "0 -8px 0 -6px" }} />
        ))}
    </div>
  )
}

export { HideoutRequirement }
