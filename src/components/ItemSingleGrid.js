import React from "react"
import { Image } from "react-bootstrap"
import itemBack from "../../public/static/images/cell_full_border.png"

const ItemSingleGrid = ({ itemId, shortName, bgColor }) => {
  const colors = {
    default: "#7f7f7f",
    blue: "#1c4156",
    yellow: "#686628",
    green: "#152d00",
    red: "#6d2318",
    violet: "#4c2a55",
    orange: "#3c1900",
  }

  return (
    <div
      style={{
        width: "64px",
        height: "64px",
        backgroundImage: `url(${itemBack})`,
        backgroundColor: `${colors[bgColor]}`,
        boxShadow: "inset 0px 0px 0px 1px #495154",
        marginRight: "-1px",
        marginBottom: "-1px",
      }}
    >
      <div className="position-relative">
        {itemId && (
          <Image src={`/asset/${itemId}-icon.png`} className="img-fluid" />
        )}
        <div
          className="position-absolute top-0 end-0"
          style={{
            fontSize: "8px",
            transform: "translateX(-1px) translateY(-2px)",
          }}
        >
          {shortName}
        </div>
      </div>
    </div>
  )
}

export { ItemSingleGrid }
