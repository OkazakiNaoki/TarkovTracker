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
        <div className="position-absolute top-50 start-50 trader-level">
          {convertRomanNumeral(level)}
        </div>
      ) : (
        <Image
          src={maxStandIcon}
          className="position-absolute top-50 start-50 trader-max-level"
        />
      )}
    </div>
  )
}

export { TraderIconLevel }
