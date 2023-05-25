import React, { useState } from "react"
import { Image } from "react-bootstrap"
import normalBtn from "../../server/public/static/images/button/button_itemtype_idle.png"
import hoverBtn from "../../server/public/static/images/button/button_itemtype_over.png"
import selectedBtn from "../../server/public/static/images/button/button_itemtype_selected_idle.png"

const LeftSideButton = ({
  icon,
  clickMethod,
  active,
  translateX,
  translateY,
}) => {
  //// state
  const [hover, setHover] = useState(false)

  //// handle function
  const mouseEnterHandle = (state) => {
    setHover(true)
  }

  const mouseleaveHandle = (state) => {
    setHover(false)
  }

  return (
    <div
      className="position-relative"
      onClick={clickMethod}
      onMouseEnter={mouseEnterHandle}
      onMouseLeave={mouseleaveHandle}
      role="button"
    >
      <Image
        className="position-absolute"
        src={active ? selectedBtn : hover ? hoverBtn : normalBtn}
      />
      <Image
        className="position-absolute"
        src={icon}
        style={{
          transform: `translate(${translateX}px, ${translateY}px)`,
        }}
      />
    </div>
  )
}

export { LeftSideButton }
