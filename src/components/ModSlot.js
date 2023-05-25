import React from "react"
import { Image } from "react-bootstrap"
import slotBorder from "../../server/public/static/images/cell_full_border.png"
import slotBackStrip from "../../server/public/static/images/slot-type/slot_empty_fill.png"
import { ItemSingleGrid } from "./ItemSingleGrid"

const ModSlot = ({ modType, image, installed = null }) => {
  return (
    <div className="square-64px position-relative overflow-hidden">
      {!installed && (
        <>
          <Image
            src={slotBackStrip}
            className="position-absolute top-50 start-50 translate-middle"
          />
          <Image
            src={slotBorder}
            className="position-absolute top-50 start-50 translate-middle"
          />
          <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex justify-content-center align-items-center">
            <Image className="mh-100 mw-100" src={image} title={modType} />
          </div>
          <div
            className="position-absolute"
            style={{
              whiteSpace: "nowrap",
              left: "50%",
              top: "10px",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div style={{ fontSize: "48px", transform: "scale(0.24)" }}>
              <span>{modType && modType.toUpperCase()}</span>
            </div>
          </div>
        </>
      )}
      {installed && (
        <ItemSingleGrid
          itemId={installed.id}
          shortName={installed.shortName}
          bgColor={installed.backgroundColor}
        />
      )}
    </div>
  )
}

export { ModSlot }
