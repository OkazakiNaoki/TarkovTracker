import React, { useState } from "react"
import { Image } from "react-bootstrap"
import { useImageSize } from "react-image-size"
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
  scale = 1,
}) => {
  // hooks state
  const [hoverHidden, setHoverHidden] = useState(true)
  const [mainX, setMainX] = useState(0)
  const [mainY, setMainY] = useState(0)
  const [msgBoxDisplay, setMsgBoxDisplay] = useState("none")

  const [hideoutIconImgSize, { loading, error }] = useImageSize(
    `/asset/${iconName}.png`
  )

  // handles
  const mouseMoveHandle = (e) => {
    const { clientX, clientY } = e
    setMainX(clientX)
    setMainY(clientY)
  }
  const mouseEnterHandle = () => {
    if (useNameBox) setMsgBoxDisplay("block")
    setHoverHidden(false)
  }
  const mouseLeaveHandle = () => {
    if (useNameBox) setMsgBoxDisplay("none")
    setHoverHidden(true)
  }

  return (
    <div
      className="position-relative"
      style={{ width: `${104 * scale}px`, height: `${110 * scale}px` }}
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
          content={[stationName]}
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
        style={{
          width: `${hideoutIconImgSize && hideoutIconImgSize.width * scale}px`,
          height: `${
            hideoutIconImgSize && hideoutIconImgSize.height * scale
          }px`,
        }}
      />
      <Image
        src={hideoutSelectIcon}
        className="position-absolute top-50 start-50 translate-middle"
        hidden={selected || hoverHidden}
      />
      <Image
        src={hideoutSelectedIcon}
        className="position-absolute top-50 start-50 translate-middle"
        hidden={!selected}
      />
      {scale === 1 && level !== null && level === 0 && !constructUnlock && (
        <Image
          src={hideoutLockIcon}
          className="position-absolute end-0 bottom-0"
          style={{
            transform: "translateX(-12px) translateY(-9px)",
          }}
        />
      )}
      {scale === 1 && level !== null && level === 0 && constructUnlock && (
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
            transform: `translateX(calc(-50% + ${
              25 * scale
            }px)) translateY(calc(-50% + ${26 * scale}px))`,
          }}
        >
          <TextStroke
            fontSize={18 * scale}
            bold={true}
            content={String(level).padStart(2, "0")}
            strokeWidth={scale >= 1 ? 4 : 0}
            selectable={false}
          />
        </div>
      )}
    </div>
  )
}

export { HideoutIcon }
