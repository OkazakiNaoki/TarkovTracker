import React from "react"
import { Row, Col, Image } from "react-bootstrap"
import { bgColors } from "../data/ItemBgColorMap"
import { TextStroke } from "./TextStroke"
import { nonExistItemIconList } from "../data/NonExistItemIconList"
import itemBack from "../../server/public/static/images/cell_full_border.png"
import placeholderImg from "../../server/public/static/images/m4a1_placeholder.png"

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
      className="h-100"
      style={{
        maxWidth: `${width * 64 * resize}px`,
        maxHeight: `${height * 64 * resize}px`,
      }}
    >
      {/* Background grids */}
      <div className="d-flex">
        <div className="position-relative">
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
            className="position-absolute w-100 h-100"
            style={{
              transform: "translateY(-100%)",
            }}
          >
            {itemId && !nonExistItemIconList.includes(itemId) && (
              <Image
                src={`/asset/${itemId}-icon${iconRes[resolution]}.png`}
                style={{
                  objectFit: "contain",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
            )}
            {nonExistItemIconList.includes(itemId) && (
              <div className="position-relative w-100 h-100">
                <div className="position-absolute top-50 start-50 translate-middle">
                  <Image src={placeholderImg} />
                </div>
              </div>
            )}
          </div>
          <div
            className="position-absolute h-100"
            style={{
              whiteSpace: "nowrap",
              letterSpacing: "0px",
              width: "calc(100% - 6px)",
              transform: "translateX(4px) translateY(calc(-100% + (-1 * 2px)))",
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

      {/* item icon & item shortname */}
    </div>
  )
}

export { ItemMultiGrid }
