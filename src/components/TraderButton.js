import React from "react"
import { Image } from "react-bootstrap"
import traderBg from "../../public/static/images/image_diagonal_trader.png"
import levelBadgeIcon from "../../public/static/images/bind_label.png"
import maxStandIcon from "../../public/static/images/loyalty_king.png"
import standingIcon from "../../public/static/images/icon_standing_small.png"

const TraderButton = ({ trader, standing = 1, rep = 0.2 }) => {
  const getRomanNumber = (num) => {
    return "".padStart(num, "I")
  }

  return (
    <div
      style={{
        backgroundImage: `url(${traderBg})`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "black",
      }}
    >
      <div className="pt-3 px-3 pb-1" style={{ width: "fit-content" }}>
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
        <div
          className="text-center"
          style={{
            color: "#c6c4b2",
            backgroundColor: "#282925",
            marginTop: "3px",
          }}
        >
          {trader.name}
        </div>
        <div className="mt-2">
          <Image src={standingIcon} className="me-1" />
          {rep}
        </div>
      </div>
    </div>
  )
}

export { TraderButton }
