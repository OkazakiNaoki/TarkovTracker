import React from "react"

const FloatingMessageBox = ({
  posX,
  posY,
  display,
  content,
  lineLimit = 4,
}) => {
  return (
    <div
      className="floating-box"
      style={{
        left: posX,
        top: posY,
        display: display,
      }}
    >
      <div className="py-1 px-2">
        {Array.isArray(content) &&
          content.map((line, i) => {
            if (i <= lineLimit) {
              return line
            } else if (i === lineLimit + 1) {
              return "..."
            }
          })}
      </div>
    </div>
  )
}

export { FloatingMessageBox }
