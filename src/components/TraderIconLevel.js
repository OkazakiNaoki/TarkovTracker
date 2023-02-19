import React from "react"
import { Image } from "react-bootstrap"
import levelBadgeIcon from "../../server/public/static/images/bind_label.png"
import maxStandIcon from "../../server/public/static/images/loyalty_king.png"
import { convertRomanNumeral } from "../helpers/NumberFormat"

const TraderIconLevel = ({ level }) => {
  return (
    <div className="position-relative">
      <Image src={levelBadgeIcon} />
      {level < 4 ? (
        <div
          className="position-absolute top-50 start-50"
          style={{
            fontSize: "14px",
            letterSpacing: "-1px",
            color: "black",
            transform: "translateX(calc(-50% - 1px)) translateY(-50%)",
          }}
        >
          {convertRomanNumeral(level)}
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
  )
}

export { TraderIconLevel }
