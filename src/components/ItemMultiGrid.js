import React from "react"
import { Row, Col, Image } from "react-bootstrap"
import itemBack from "../../public/static/images/cell_full_border.png"
import firIcon from "../../public/static/images/icon_foundinraid_small.png"

const ItemMultiGrid = ({
  itemId,
  foundInRaid = false,
  shortName = null,
  bgColor,
  width = 1,
  height = 1,
  resize = 1,
}) => {
  const colors = {
    default: "#7f7f7f",
    blue: "#1c4156",
    yellow: "#686628",
    green: "#152d00",
    red: "#6d2318",
    violet: "#4c2a55",
    orange: "#3c1900",
    black: "#000",
  }

  return (
    <div
      className=""
      style={{
        maxWidth: `${width * 64 * resize}px`,
        maxHeight: `${height * 64 * resize}px`,
      }}
    >
      <Row
        sm={width}
        className="g-0"
        style={{ outline: "1px solid #495154", outlineOffset: "-1px" }}
      >
        {new Array(width * height).fill().map((grid, i) => {
          return (
            <Col
              key={`cell_${i}`}
              style={{
                aspectRatio: "1",
              }}
            >
              <div
                className="w-100 h-100"
                style={{
                  marginRight: "-1px",
                  marginBottom: "-1px",
                }}
              >
                <Image
                  src={itemBack}
                  style={{
                    backgroundColor: `${colors[bgColor]}`,
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                ></Image>
              </div>
            </Col>
          )
        })}
      </Row>

      <div
        className="position-relative"
        style={{
          transform: `translateY(-100%)`,
        }}
      >
        <div className="w-100">
          {itemId && (
            <Image
              src={`/asset/${itemId}-icon.png`}
              className="ms-auto me-auto"
              style={{
                objectFit: "contain",
                maxHeight: "100%",
                maxWidth: "100%",
              }}
            />
          )}
        </div>
        <div
          className="position-absolute top-0 start-50 text-shadow-10 text-end"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            fontSize: "12px",
            letterSpacing: "0px",
            width: "calc(100% - 6px)",
            transform: "translateX(-50%) translateY(-2px)",
          }}
        >
          {shortName && shortName}
        </div>
      </div>
    </div>
  )
}

export { ItemMultiGrid }
