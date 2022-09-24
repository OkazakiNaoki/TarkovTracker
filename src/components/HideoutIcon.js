import React, { useState } from "react"
import { Image } from "react-bootstrap"
import hideoutSelectIcon from "../../public/static/images/hideout_selected.png"
import hideoutSelectedIcon from "../../public/static/images/selected_border.png"

const HideoutIcon = ({ iconName, selected = false }) => {
  const [hoverHidden, setHoverHidden] = useState(true)

  return (
    <div
      className="position-relative"
      style={{ width: "104px", height: "110px" }}
      role="button"
      onMouseEnter={() => {
        if (!selected) setHoverHidden(false)
      }}
      onMouseLeave={() => {
        if (!selected) setHoverHidden(true)
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
        hidden={!selected && hoverHidden}
      />
      <Image
        src={hideoutSelectedIcon}
        className="position-absolute top-50 start-50 translate-middle"
        hidden={!selected}
      />
    </div>
  )
}

export { HideoutIcon }
