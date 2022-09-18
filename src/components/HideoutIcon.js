import React, { useState } from "react"
import { Image } from "react-bootstrap"
import hideoutSelectIcon from "../../public/static/images/hideout_selected.png"

const HideoutIcon = ({ iconName }) => {
  const [hoverHidden, setHoverHidden] = useState(true)

  return (
    <div
      className="position-relative"
      style={{ width: "104px", height: "110px" }}
      role="button"
      onMouseEnter={() => {
        setHoverHidden(false)
      }}
      onMouseLeave={() => {
        setHoverHidden(true)
      }}
    >
      <Image
        src="/asset/hideout-icon-background.png"
        className="d-block w-100"
      />
      <Image
        src={`/asset/${iconName}.png`}
        className="position-absolute top-50 start-50 translate-middle"
      />
      <Image
        src={hideoutSelectIcon}
        className="position-absolute top-50 start-50 translate-middle"
        hidden={hoverHidden}
      />
    </div>
  )
}

export { HideoutIcon }
