import React from "react"
import { Badge } from "react-bootstrap"

const GainItemMethodBadge = ({
  craft = false,
  reward = false,
  collect = false,
  badgeEnterHandle,
  badgeLeaveHandle,
  badgeHoverHandle,
}) => {
  return craft || reward || collect ? (
    <>
      {craft && (
        <div
          className="d-inline me-2"
          onMouseEnter={badgeEnterHandle}
          onMouseLeave={badgeLeaveHandle}
          onMouseOver={() => badgeHoverHandle("craft")}
          style={{ width: "fit-content" }}
        >
          <Badge pill bg="primary" style={{ userSelect: "none" }}>
            craft
          </Badge>
        </div>
      )}
      {reward && (
        <div
          className="d-inline me-2"
          onMouseEnter={badgeEnterHandle}
          onMouseLeave={badgeLeaveHandle}
          onMouseOver={() => badgeHoverHandle("reward")}
          style={{ width: "fit-content" }}
        >
          <Badge pill bg="success" style={{ userSelect: "none" }}>
            reward
          </Badge>
        </div>
      )}
      {collect && (
        <div
          className="d-inline me-2"
          onMouseEnter={badgeEnterHandle}
          onMouseLeave={badgeLeaveHandle}
          onMouseOver={() => badgeHoverHandle("collect")}
          style={{ width: "fit-content" }}
        >
          <Badge pill bg="warning" text="dark" style={{ userSelect: "none" }}>
            collect
          </Badge>
        </div>
      )}
    </>
  ) : null
}

export { GainItemMethodBadge }
