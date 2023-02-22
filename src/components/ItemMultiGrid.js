import React from "react"
import { Row, Col, Image } from "react-bootstrap"
import { bgColors } from "../data/ItemBgColorMap"
import { TextStroke } from "./TextStroke"
import itemBack from "../../server/public/static/images/cell_full_border.png"

const iconRes = {
  64: "",
  128: "-128",
}

const ItemMultiGrid = ({
  itemId,
  foundInRaid = false,
  shortName = null,
  bgColor,
  width = 1,
  height = 1,
  resize = 1,
  resolution,
}) => {
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
                    backgroundColor: `${bgColors[bgColor]}`,
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
              src={`/asset/${itemId}-icon${iconRes[resolution]}.png`}
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
          className="position-absolute top-0 start-50"
          style={{
            whiteSpace: "nowrap",
            letterSpacing: "0px",
            width: "calc(100% - 6px)",
            transform: "translateX(-50%) translateY(-2px)",
          }}
        >
          {shortName && (
            <div
              className=""
              style={{
                height: "64px",
                overflow: "hidden",
              }}
            >
              <div style={{ width: "fit-content", marginLeft: "auto" }}>
                <TextStroke
                  fontSize={12}
                  content={shortName}
                  selectable={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { ItemMultiGrid }
