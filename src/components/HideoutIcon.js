import React from "react"
import { Image } from "react-bootstrap"

const HideoutIcon = ({ iconName }) => {
  return (
    <div
      className="position-relative"
      style={{ width: "104px", height: "110px" }}
    >
      <Image
        src="/asset/hideout-icon-background.png"
        className="d-block w-100"
      />
      <Image
        src={`/asset/${iconName}.png`}
        className="position-absolute top-50 start-50 translate-middle"
      />
    </div>
  )
}

export { HideoutIcon }
