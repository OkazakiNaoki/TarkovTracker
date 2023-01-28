import React, { useState } from "react"
import { Image } from "react-bootstrap"
import { TextStroke } from "./TextStroke"
import { FloatingMessageBox } from "./FloatingMessageBox"
import hideoutSelectIcon from "../../server/public/static/images/hideout_selected.png"
import hideoutSelectedIcon from "../../server/public/static/images/selected_border.png"
import hideoutLockIcon from "../../server/public/static/images/icon_lock.png"
import hideoutUnlockIcon from "../../server/public/static/images/icon_status_unlocked.png"

const HideoutIcon = ({
  iconName,
  stationName = null,
  selected = false,
  level = null,
  greenOutlined = false,
  redOutlined = false,
  noHover = false,
  isElite = false,
  isProducing = false,
  asButton = false,
  useNameBox = false,
  constructUnlock = false,
}) => {
  // hooks state
  const [hoverHidden, setHoverHidden] = useState(true)
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
    if (useNameBox) setMsgBoxDisplay("block")
    if (!selected) setHoverHidden(false)
  }
  const mouseLeaveHandle = () => {
    if (useNameBox) setMsgBoxDisplay("none")
    if (!selected) setHoverHidden(true)
  }

  return (
    <div
      className="position-relative"
      style={{ width: "104px", height: "110px" }}
      role={asButton ? "button" : null}
      onMouseEnter={noHover ? null : mouseEnterHandle}
      onMouseLeave={noHover ? null : mouseLeaveHandle}
      onMouseMove={noHover ? null : mouseMoveHandle}
    >
      {useNameBox && (
        <FloatingMessageBox
          posX={mainX}
          posY={mainY}
          display={msgBoxDisplay}
          content={stationName}
        />
      )}
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
      {level !== null && level === 0 && !constructUnlock && (
        <Image
          src={hideoutLockIcon}
          className="position-absolute end-0 bottom-0"
          style={{
            transform: "translateX(-12px) translateY(-9px)",
          }}
        />
      )}
      {level !== null && level === 0 && constructUnlock && (
        <Image
          src={hideoutUnlockIcon}
          className="position-absolute end-0 bottom-0"
          style={{
            transform: "translateX(-6px) translateY(-9px)",
          }}
        />
      )}
      {level !== null && level > 0 && (
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
