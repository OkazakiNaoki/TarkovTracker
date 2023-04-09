import React from "react"
import { Image } from "react-bootstrap"
import classNames from "classnames"
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
    <div className="hideout-hideout-req">
      <div>
        <HideoutIcon
          iconName={hideoutId}
          level={level}
          redOutlined={!fulfill}
          noHover={true}
        />
      </div>
      <div
        className={classNames(
          { "hideout-req-unqualified": !fulfill },
          { "hideout-req-qualified": fulfill }
        )}
      >
        {hideoutName}
      </div>
      {showFulfill &&
        (fulfill ? (
          <Image src={itemFulfillIcon} />
        ) : (
          <Image src={itemLockedIcon} />
        ))}
    </div>
  )
}

export { HideoutRequirement }
