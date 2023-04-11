import classNames from "classnames"
import React from "react"
import { Image } from "react-bootstrap"
import { TraderIconLevel } from "./TraderIconLevel"

const TraderIcon = ({
  trader,
  standing = 1,
  scale = 1,
  showStanding = true,
  useInline = false,
}) => {
  return (
    <div
      className={classNames(
        { "d-inline-block": useInline },
        "position-relative",
        "trader-icon"
      )}
    >
      <div>
        <Image
          src={`/asset/${trader.id}.png`}
          style={{ width: `${130 * scale}px`, height: `${130 * scale}px` }}
        />
      </div>
      {showStanding && scale === 1 && (
        <div className="position-absolute top-0 start-0">
          <TraderIconLevel traderName={trader.name} level={standing} />
        </div>
      )}
    </div>
  )
}

export { TraderIcon }
