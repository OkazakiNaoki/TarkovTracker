import React from "react"

const FloatingMessageBox = ({ posX, posY, display, content }) => {
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
        {content}
      </div>
    </div>
  )
}

export { FloatingMessageBox }
