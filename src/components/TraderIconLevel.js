import React, { useEffect } from "react"
import { Image } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import levelBadgeIcon from "../../server/public/static/images/bind_label.png"
import maxStandIcon from "../../server/public/static/images/loyalty_king.png"
import { convertRomanNumeral } from "../helpers/NumberFormat"

const TraderIconLevel = ({ traderName = null, level, justCrown = false }) => {
  // redux
  const dispatch = useDispatch()
  const { traderLevels } = useSelector((state) => state.trader)

  // effect
  useEffect(() => {
    if (
      traderName &&
      traderLevels &&
      !traderLevels.hasOwnProperty(traderName)
    ) {
      dispatch(getLevelReqOfTrader({ trader: traderName }))
    }
  }, [])

  return (
    <div className="position-relative">
      <Image src={levelBadgeIcon} />
      {/* if trader name is given */}
      {traderName &&
        traderLevels &&
        level < traderLevels[traderName].length && (
          <div className="position-absolute top-50 start-50 trader-level">
            {convertRomanNumeral(level)}
          </div>
        )}
      {traderName &&
        !justCrown &&
        traderLevels &&
        level === traderLevels[traderName].length && (
          <Image
            src={maxStandIcon}
            className="position-absolute top-50 start-50 trader-max-level"
          />
        )}
      {/* trader name not given */}
      {!traderName && (
        <div className="position-absolute top-50 start-50 trader-level">
          {convertRomanNumeral(level)}
        </div>
      )}
      {!traderName && justCrown && (
        <Image
          src={maxStandIcon}
          className="position-absolute top-50 start-50 trader-max-level"
        />
      )}
    </div>
  )
}

export { TraderIconLevel }
