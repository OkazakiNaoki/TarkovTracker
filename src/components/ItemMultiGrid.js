import React from "react"
import { Row, Col, Image } from "react-bootstrap"
import { bgColors } from "../data/ItemBgColorMap"
import { TextStroke } from "./TextStroke"
import { nonExistItemIconList } from "../data/NonExistItemIconList"
import itemGrid from "../../server/public/static/images/cell_full_border.png"
import placeholderImg from "../../server/public/static/images/m4a1_placeholder.png"
import classNames from "classnames"

const iconRes = {
  64: "",
  128: "-128",
}

const ItemMultiGrid = ({
  itemId,
  foundInRaid = false,
  shortName = null,
  bgColor = null,
  width = 1,
  height = 1,
  resolution,
  scale = 1,
  hideGrid = false,
  fitParent = true,
}) => {
  return (
    <div
      className={classNames({ "h-100": fitParent })}
      style={{
        ...(!fitParent && { width: `${width * 64 * scale}px` }),
        ...(!fitParent && { height: `${height * 64 * scale}px` }),
        ...(fitParent && { maxWidth: `${width * 64 * scale}px` }),
        ...(fitParent && { maxHeight: `${height * 64 * scale}px` }),
      }}
    >
      <div className="d-flex">
        <div className="position-relative multi-grid-item">
          {/* item grids */}
          <Row
            sm={width}
            className={classNames("g-0", {
              "multi-grid-item-grid": !hideGrid,
            })}
          >
            {new Array(width * height).fill().map((grid, i) => {
              return (
                <Col key={`cell_${i}`} className="aspect-ratio-1-1">
                  <div
                    className={classNames(
                      { "w-100": fitParent },
                      { "h-100": fitParent }
                    )}
                  >
                    <Image
                      src={itemGrid}
                      className={classNames("mw-100", "mh-100", {
                        invisible: hideGrid,
                      })}
                      style={{
                        backgroundColor: `${bgColor && bgColors[bgColor]}`,
                      }}
                    ></Image>
                  </div>
                </Col>
              )
            })}
          </Row>
          {/* item image or placeholder */}
          <div className="position-absolute w-100 h-100 translate-yn100">
            {itemId && !nonExistItemIconList.includes(itemId) && (
              <Image
                src={`/asset/${itemId}-icon${iconRes[resolution]}.png`}
                className="position-absolute object-fit-contain mh-100 mw-100"
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
          {/* item name text */}
          <div className="position-absolute h-100 multi-grid-item-text">
            {shortName && (
              <div className="overflow-hidden height-64px">
                <div className="margin-l-auto width-fit-content">
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
