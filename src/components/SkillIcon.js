import React from "react"
import { Image } from "react-bootstrap"
import { skillIconMap } from "../data/SkillIconMap"
import skillBorder from "../../public/static/images/skill_border.png"
import levelBadge from "../../public/static/images/skill_level_panel.png"

const SkillIcon = ({ skillName, level = null }) => {
  return (
    <div>
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
          <p
            className="position-absolute bottom-0 start-0 mb-0"
            style={{
              fontSize: "12px",
              color: "black",
              transform: "translateX(6px)",
              userSelect: "none",
            }}
          >
            {level}
          </p>
        </div>
      </div>
    </div>
  )
}

export { SkillIcon }
