import React from "react"
import { useNavigate } from "react-router-dom"
import { TarkovGuideButton } from "./TarkovGuideButton"

const PresetSlotButton = ({ index, name }) => {
  // router
  const navigate = useNavigate()

  return (
    <TarkovGuideButton
      onClick={() => {
        navigate(`/preset/${index}`)
      }}
    >
      <div className="d-table">
        <div
          className="d-table-cell me-2 px-3 py-1 tarkov-bold"
          style={{ backgroundColor: "#444", color: "#ccc" }}
        >
          {index + 1}
        </div>
        <div className="d-table-cell px-3">{name}</div>
      </div>
    </TarkovGuideButton>
  )
}

export { PresetSlotButton }
