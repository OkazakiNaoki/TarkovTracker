import React from "react"
import { Image } from "react-bootstrap"
import { SkillIcon } from "./SkillIcon"
import itemFulfillIcon from "../../public/static/images/icon_requirement_fulfilled.png"
import itemLockedIcon from "../../public/static/images/icon_requirement_locked.png"

const SkillRequirement = ({
  skillName,
  level,
  fulfill = false,
  showFulfill = false,
  useNameBox = false,
}) => {
  return (
    <div>
      <div
        className="d-flex justify-content-center"
        style={{ marginBottom: "-4px" }}
      >
        <SkillIcon
          skillName={skillName}
          level={level}
          useNameBox={useNameBox}
        />
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

export { SkillRequirement }
