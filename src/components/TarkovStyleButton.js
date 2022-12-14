import React, { useState } from "react"
import { Image } from "react-bootstrap"
import buttonImg from "../../public/static/images/button.png"

const TarkovStyleButton = ({
  text,
  color,
  clickHandle,
  height = "auto",
  fs = 16,
  useAnim = false,
  lockButton = false,
}) => {
  const [isHover, setIsHover] = useState(false)

  const mouseEnterHandle = () => {
    setIsHover(true)
  }
  const mouseLeaveHandle = () => {
    setIsHover(false)
  }

  return (
    <div
      role={lockButton ? null : "button"}
      className="d-flex justify-content-center align-items-center"
      style={{
        height: `${height}px`,
        aspectRatio: `${232 / 51}`,
        fontSize: `${fs}px`,
        color: "black",
      }}
      onClick={lockButton ? null : clickHandle}
      onMouseEnter={useAnim && !lockButton ? mouseEnterHandle : null}
      onMouseLeave={useAnim && !lockButton ? mouseLeaveHandle : null}
    >
      <div className="position-relative">
        <Image
          className="position-absolute top-50 start-50"
          src={buttonImg}
          style={{
            height: `${height}px`,
            aspectRatio: `${232 / 51}`,
            animation:
              useAnim && isHover && !lockButton
                ? "tarkovBtnFadeIn 0.2s ease-out forwards"
                : "none",
            transform: `translateX(-50%) translateY(-50%)`,
            opacity: useAnim || lockButton ? "0" : "1",
          }}
        />
        <div
          className="position-absolute top-50 start-50"
          style={{
            color: useAnim ? color : "black",
            transform: `translateX(-50%) translateY(-50%)`,
            whiteSpace: "nowrap",
            animation:
              useAnim && isHover && !lockButton
                ? "tarkovBtnColorAlter 0.2s ease-out forwards"
                : "none",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

export { TarkovStyleButton }
