import React, { useState } from "react"
import { Image } from "react-bootstrap"
import { skillIconMap } from "../data/SkillIconMap"
import { FloatingMessageBox } from "./FloatingMessageBox"
import skillBorder from "../../server/public/static/images/skill_border.png"
import levelBadge from "../../server/public/static/images/skill_level_panel.png"
import maxStandIcon from "../../server/public/static/images/loyalty_king.png"
import classNames from "classnames"

const SkillIcon = ({ skillName, level = null, useNameBox = false }) => {
  // hooks state
  const [mainX, setMainX] = useState(0)
  const [mainY, setMainY] = useState(0)
  const [msgBoxDisplay, setMsgBoxDisplay] = useState("none")

  // handles
  const mouseMoveHandle = (e) => {
    const { clientX, clientY } = e
    setMainX(clientX)
    setMainY(clientY)
  }
  const mouseEnterHandle = () => {
    setMsgBoxDisplay("block")
  }
  const mouseLeaveHandle = () => {
    setMsgBoxDisplay("none")
  }

  return (
    <div
      onMouseEnter={useNameBox ? mouseEnterHandle : null}
      onMouseLeave={useNameBox ? mouseLeaveHandle : null}
      onMouseMove={useNameBox ? mouseMoveHandle : null}
    >
      {useNameBox && (
        <FloatingMessageBox
          posX={mainX}
          posY={mainY}
          display={msgBoxDisplay}
          content={[skillName]}
        />
      )}
      <div className="skill-icon">
        <div>
          <Image src={`/asset/${skillIconMap[skillName]}`} />
          <Image src={levelBadge} className="skill-icon-badge" />
          {level < 51 ? (
            <p
              className={classNames(
                { "skill-icon-level-1d": level < 10 },
                { "skill-icon-level-2d": level >= 10 }
              )}
            >
              {level}
            </p>
          ) : (
            <Image src={maxStandIcon} className="skill-icon-max-level" />
          )}
        </div>
      </div>
    </div>
  )
}

export { SkillIcon }
