import React from "react"
import { Image } from "react-bootstrap"
import { TraderIconLevel } from "./TraderIconLevel"

const TraderIcon = ({ trader, standing = 1 }) => {
  return (
    <div className="position-relative trader-icon">
      <div>
        <Image src={`/asset/${trader.id}.png`} fluid />
      </div>
      <div className="position-absolute top-0 start-0">
        <TraderIconLevel level={standing} />
      </div>
    </div>
  )
}

export { TraderIcon }
