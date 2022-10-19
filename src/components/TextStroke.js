import React from "react"

const TextStroke = ({
  fontSize,
  bold = false,
  content,
  strokeWidth = 1,
  selectable = true,
}) => {
  return (
    <div
      className="d-flex position-relative"
      style={{
        fontSize: `${fontSize}px`,
        fontFamily: bold ? "TarkovBold" : "Tarkov",
        userSelect: "none",
      }}
    >
      <div style={{ visibility: "hidden" }}>{content}</div>
      <div
        className="position-absolute"
        style={{
          WebkitTextStroke: `${strokeWidth}px black`,
          color: "black",
          userSelect: "none",
        }}
      >
        {content}
      </div>
      <div
        className="position-absolute"
        style={{ color: "white", userSelect: selectable ? "text" : "none" }}
      >
        {content}
      </div>
    </div>
  )
}

export { TextStroke }
