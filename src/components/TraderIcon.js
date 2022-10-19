import React from "react"
import { Image } from "react-bootstrap"
import levelBadgeIcon from "../../public/static/images/bind_label.png"
import maxStandIcon from "../../public/static/images/loyalty_king.png"

const TraderIcon = ({ trader, standing = 1 }) => {
  const getRomanNumber = (num) => {
    return "".padStart(num, "I")
  }

  return (
    <div className="position-relative">
      <div
        style={{
          width: "130px",
          height: "130px",
          border: "1px solid white",
        }}
      >
        <Image src={`/asset/${trader.id}.png`} fluid />
      </div>
      <div
        className="position-absolute top-0 start-0"
        style={{
          transform: "translateX(-1px) translateY(-2px)",
        }}
      >
        <Image src={levelBadgeIcon} />
        {standing < 4 ? (
          <div
            className="position-absolute top-50 start-50"
            style={{
              fontSize: "14px",
              letterSpacing: "-1px",
              color: "black",
              transform: "translateX(calc(-50% - 1px)) translateY(-50%)",
            }}
          >
            {getRomanNumber(standing)}
          </div>
        ) : (
          <Image
            src={maxStandIcon}
            className="position-absolute top-50 start-50"
            style={{
              transform: "translateX(calc(-50% - 1px)) translateY(-50%)",
            }}
          />
        )}
      </div>
    </div>
  )
}

export { TraderIcon }
