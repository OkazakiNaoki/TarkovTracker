import React from "react"
import { Image } from "react-bootstrap"
import { bgColors } from "../data/ItemBgColorMap"
import itemBack from "../../public/static/images/cell_full_border.png"
import firIcon from "../../public/static/images/icon_foundinraid_small.png"
import lockIcon from "../../public/static/images/marker_locked.png"

const ItemSingleGrid = ({
  itemId,
  foundInRaid = false,
  shortName = null,
  bgColor,
  amount = null,
  locked = false,
  transparent = 255,
  useBgImg = true,
}) => {
  return (
    <div
      style={{
        width: "64px",
        height: "64px",
        backgroundImage: useBgImg ? `url(${itemBack})` : "none",
        backgroundColor: `${bgColors[bgColor]}${transparent.toString(16)}`,
        boxShadow: "inset 0px 0px 0px 1px #495154",
        marginRight: "-1px",
        marginBottom: "-1px",
      }}
    >
      <div className="position-relative">
        <div
          className="d-flex justify-content-center"
          style={{
            width: "64px",
            height: "64px",
          }}
        >
          {itemId && (
            <Image
              src={`/asset/${itemId}-icon.png`}
              style={{
                objectFit: "contain",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            />
          )}
        </div>
        <div
          className="position-absolute top-0 end-0"
          style={{
            fontSize: "8px",
            transform: "translateX(-1px) translateY(-2px)",
          }}
        >
          {shortName && shortName}
        </div>
        {foundInRaid && (
          <Image
            src={firIcon}
            className="position-absolute bottom-0 end-0"
            style={{
              transform: `translateX(-3px) translateY(${
                amount ? "-20px" : "-4px"
              })`,
            }}
          />
        )}
        {amount && (
          <p
            src={firIcon}
            className="position-absolute bottom-0 end-0 mb-0"
            style={{
              fontSize: "14px",
              color: "#6ca767",
              transform: "translateX(-4px)",
            }}
          >
            {amount}
          </p>
        )}
        {locked && (
          <Image
            src={lockIcon}
            className="position-absolute bottom-0 start-0"
            style={{
              transform: "translateX(-6px) translateY(4px)",
            }}
          />
        )}
      </div>
    </div>
  )
}

export { ItemSingleGrid }
