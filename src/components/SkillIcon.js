import React, { useState } from "react"
import { Image } from "react-bootstrap"
import { skillIconMap } from "../data/SkillIconMap"
import { FloatingMessageBox } from "./FloatingMessageBox"
import skillBorder from "../../server/public/static/images/skill_border.png"
import levelBadge from "../../server/public/static/images/skill_level_panel.png"
import maxStandIcon from "../../server/public/static/images/loyalty_king.png"

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
      <div
        className="position-relative"
        style={{
          backgroundImage: `url(${skillBorder})`,
          backgroundSize: "102px",
          width: "102px",
          height: "102px",
        }}
      >
        <div
          className="position-absolute top-50 start-50"
          style={{ transform: "translateX(-50%) translateY(-50%)" }}
        >
          <Image
            src={`/asset/${skillIconMap[skillName]}`}
            style={{ width: "90px", height: "90px" }}
          />
          <Image
            src={levelBadge}
            className="position-absolute bottom-0 start-0"
            style={{
              transform: "translateX(-3px) translateY(3px)",
            }}
          />
          {level < 51 ? (
            <p
              className="position-absolute bottom-0 start-0 mb-0"
              style={{
                fontSize: "12px",
                color: "black",
                transform: level < 9 ? "translateX(6px)" : "translateX(2px)",
                userSelect: "none",
              }}
            >
              {level}
            </p>
          ) : (
            <Image
              src={maxStandIcon}
              className="position-absolute bottom-0 start-0"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export { SkillIcon }
