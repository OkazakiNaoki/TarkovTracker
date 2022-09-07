import React from "react"
import buttonImg from "../../public/static/images/button.png"

const TarkovStyleButton = ({ text, clickHandle, height = "auto", fs = 16 }) => {
  return (
    <div
      role="button"
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${buttonImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        height: `${height}px`,
        aspectRatio: `${232 / 51}`,
        fontSize: `${fs}px`,
      }}
      onClick={clickHandle}
    >
      <span className="text-dark fw-bold">{text}</span>
    </div>
  )
}

export { TarkovStyleButton }
