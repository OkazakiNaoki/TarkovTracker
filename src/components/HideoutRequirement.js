import React from "react"
import { Image } from "react-bootstrap"
import { HideoutIcon } from "./HideoutIcon"
import itemLockedIcon from "../../public/static/images/icon_requirement_locked.png"

const HideoutRequirement = ({ hideoutId, hideoutName, level }) => {
  return (
    <div className="d-flex align-items-center mx-3">
      <div className="d-inline-block" style={{ marginRight: "-10px" }}>
        <HideoutIcon
          iconName={hideoutId}
          level={level}
          redOutlined={true}
          noHover={true}
        />
      </div>
      <div className="d-inline-block me-2" style={{ color: "#c40000" }}>
        {hideoutName}
      </div>
      <Image src={itemLockedIcon} style={{ margin: "0 -8px 0 -6px" }} />
    </div>
  )
}

export { HideoutRequirement }
