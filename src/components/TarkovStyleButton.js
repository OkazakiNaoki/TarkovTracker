import React, { useState } from "react"
import { Image } from "react-bootstrap"
import buttonImg from "../../server/public/static/images/button.png"

const TarkovStyleButton = ({
  text,
  color,
  clickHandle,
  height = 20,
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
      className="tarkov-style-button"
      style={{
        height: `${height}px`,
        fontSize: `${fs}px`,
      }}
      onClick={lockButton ? null : clickHandle}
      onMouseEnter={useAnim && !lockButton ? mouseEnterHandle : null}
      onMouseLeave={useAnim && !lockButton ? mouseLeaveHandle : null}
    >
      <div>
        <Image
          src={buttonImg}
          style={{
            height: `${height}px`,
            opacity: useAnim || lockButton ? "0" : "1",
            animationName:
              useAnim && isHover && !lockButton ? "tarkov-btn-fade-in" : "none",
          }}
        />
        <div
          className="position-absolute top-50 start-50"
          style={{
            color: useAnim ? color : "black",
            animationName:
              useAnim && isHover && !lockButton
                ? "tarkov-btn-alter-color"
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
