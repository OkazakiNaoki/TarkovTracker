import React from "react"
import { Image } from "react-bootstrap"
import { SkillIcon } from "./SkillIcon"
import itemFulfillIcon from "../../server/public/static/images/icon_requirement_fulfilled.png"
import itemLockedIcon from "../../server/public/static/images/icon_requirement_locked.png"

const SkillRequirement = ({
  skillName,
  level,
  fulfill = false,
  showFulfill = false,
  useNameBox = false,
}) => {
  return (
    <div className="hideout-skill-req">
      <div>
        <SkillIcon
          skillName={skillName}
          level={level}
          useNameBox={useNameBox}
        />
      </div>
      <div>
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

export { SkillRequirement }
