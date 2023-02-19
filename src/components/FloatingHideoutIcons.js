import React from "react"
import { HideoutIcon } from "./HideoutIcon"

const FloatingHideoutIcons = ({
  posX,
  posY,
  display,
  colSize,
  stations,
  scale = 0.6,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        left: posX,
        top: posY,
        display: display,
        userSelect: "none",
        backgroundColor: "#fff",
        zIndex: "100001",
        transform: `scale(${scale},${scale}) translateX(10px) translateY(-100%)`,
        transformOrigin: "top left",
      }}
    >
      <div
        className="py-1 px-2"
        style={{
          backgroundColor: "#000",
          border: `${2 / scale}px solid #585d60`,
          whiteSpace: "break-spaces",
        }}
      >
        {stations
          .reduce((stationGroup, c, i) => {
            if (i % colSize === 0) {
              stationGroup.push([])
            }
            stationGroup[stationGroup.length - 1].push(c)
            return stationGroup
          }, [])
          .map((stationGroup, i) => (
            <div key={`station_icon_line_${i}`} className="d-flex">
              {stationGroup.map((station, j) => (
                <HideoutIcon
                  key={station.station.id + station.level + j}
                  iconName={station.station.id}
                  level={station.level}
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}

export { FloatingHideoutIcons }
