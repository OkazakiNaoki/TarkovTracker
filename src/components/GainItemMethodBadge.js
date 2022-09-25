import React from "react"
import { Badge } from "react-bootstrap"

const GainItemMethodBadge = ({
  craft = false,
  reward = false,
  collect = false,
  badgeEnterHandle,
}) => {
  return craft || reward || collect ? (
    <>
      {craft && (
        <div
          className="d-inline me-2"
          onMouseEnter={badgeEnterHandle}
          onMouseLeave={badgeEnterHandle}
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
          onMouseLeave={badgeEnterHandle}
          style={{ width: "fit-content" }}
        >
          <Badge pill bg="success">
            reward
          </Badge>
        </div>
      )}
      {collect && (
        <div
          className="d-inline me-2"
          onMouseEnter={badgeEnterHandle}
          onMouseLeave={badgeEnterHandle}
          style={{ width: "fit-content" }}
        >
          <Badge pill bg="warning" text="dark">
            collect
          </Badge>
        </div>
      )}
    </>
  ) : null
}

export { GainItemMethodBadge }
