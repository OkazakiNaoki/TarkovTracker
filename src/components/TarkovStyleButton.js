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
      role="button"
      className="d-flex justify-content-center align-items-center"
      style={{
        height: `${height}px`,
        aspectRatio: `${232 / 51}`,
        fontSize: `${fs}px`,
        color: "black",
      }}
      onClick={clickHandle}
      onMouseEnter={useAnim ? mouseEnterHandle : null}
      onMouseLeave={useAnim ? mouseLeaveHandle : null}
    >
      <div className="position-relative">
        <Image
          className="position-absolute top-50 start-50"
          src={buttonImg}
          style={{
            height: `${height}px`,
            aspectRatio: `${232 / 51}`,
            animation:
              useAnim && isHover
                ? "tarkovBtnFadeIn 0.2s ease-out forwards"
                : "none",
            transform: `translateX(-50%) translateY(-50%)`,
            opacity: useAnim ? "0" : "1",
          }}
        />
        <div
          className="position-absolute top-50 start-50"
          style={{
            color: useAnim ? color : "black",
            transform: `translateX(-50%) translateY(-50%)`,
            whiteSpace: "nowrap",
            animation:
              useAnim && isHover
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
