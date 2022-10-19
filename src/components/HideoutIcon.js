import React, { useState } from "react"
import { Image } from "react-bootstrap"
import hideoutSelectIcon from "../../public/static/images/hideout_selected.png"
import hideoutSelectedIcon from "../../public/static/images/selected_border.png"
import { TextStroke } from "./TextStroke"

const HideoutIcon = ({
  iconName,
  selected = false,
  level = null,
  greenOutlined = false,
  redOutlined = false,
  noHover = false,
  isElite = false,
  isProducing = false,
  asButton = false,
}) => {
  const [hoverHidden, setHoverHidden] = useState(true)

  return (
    <div
      className="position-relative"
      style={{ width: "104px", height: "110px" }}
      role={asButton ? "button" : null}
      onMouseEnter={() => {
        if (!selected && !noHover) setHoverHidden(false)
      }}
      onMouseLeave={() => {
        if (!selected && !noHover) setHoverHidden(true)
      }}
    >
      {!greenOutlined && !redOutlined && (
        <Image
          src="/asset/hideout-icon-background.png"
          className="d-block w-100"
        />
      )}
      {greenOutlined && (
        <Image
          src="/asset/area_icon_default_back_green.png"
          className="d-block w-100"
        />
      )}
      {redOutlined && (
        <Image
          src="/asset/area_icon_locked_back.png"
          className="d-block w-100"
        />
      )}
      <Image
        src={`/asset/area_icon_elite_back.png`}
        className="position-absolute top-50 start-50 translate-middle"
        hidden={!isElite}
      />
      <Image
        src={`/asset/area_producing_icon.png`}
        className="position-absolute top-50 start-50 translate-middle"
        hidden={!isProducing}
      />
      <Image
        src={`/asset/${iconName}.png`}
        className="position-absolute top-50 start-50 translate-middle"
      />
      <Image
        src={hideoutSelectIcon}
        className="position-absolute top-50 start-50 translate-middle"
        hidden={!selected && hoverHidden}
      />
      <Image
        src={hideoutSelectedIcon}
        className="position-absolute top-50 start-50 translate-middle"
        hidden={!selected}
      />
      {level && (
        <div
          className="position-absolute start-50 top-50 tarkov-bold-700"
          style={{
            transform:
              "translateX(calc(-50% + 25px)) translateY(calc(-50% + 26px))",
          }}
        >
          <TextStroke
            fontSize={18}
            bold={true}
            content={String(level).padStart(2, "0")}
            strokeWidth={4}
            selectable={false}
          />
        </div>
      )}
    </div>
  )
}

export { HideoutIcon }
