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
      style={{
        position: "fixed",
        left: posX,
        top: posY,
        display: display,
        userSelect: "none",
        transform: "translateX(10px) translateY(-100%)",
        backgroundColor: "#fff",
        zIndex: "100001",
      }}
    >
      <div
        className="py-1 px-2"
        style={{
          backgroundColor: "#000",
          border: "2px solid #585d60",
          whiteSpace: "break-spaces",
        }}
      >
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
