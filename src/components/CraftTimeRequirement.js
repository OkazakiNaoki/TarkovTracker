import React from "react"
import { Image } from "react-bootstrap"
import arrowRight from "../../public/static/images/arrow_right.png"
import timerIcon from "../../public/static/images/icon_timer.png"

const CraftTimeRequirement = ({ timeStr }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${arrowRight})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "54px",
        width: "110px",
      }}
    >
      <Image src={timerIcon} style={{ paddingRight: "10px" }} />
      <p
        className="mb-0 text-center"
        style={{ fontSize: "12px", lineHeight: "14px" }}
      >
        {timeStr}
      </p>
    </div>
  )
}

export { CraftTimeRequirement }
