import classNames from "classnames"
import React from "react"

const TextStroke = ({
  fontSize,
  bold = false,
  content,
  strokeWidth = 1,
  selectable = true,
  color = "white",
}) => {
  return (
    <div
      className={classNames(
        "d-flex",
        "position-relative",
        {
          "tarkov-text-stroke": !bold,
        },
        {
          "tarkov-bold-text-stroke": bold,
        }
      )}
      style={{
        fontSize: `${fontSize}px`,
      }}
    >
      <div className="tarkov-text-stroke-content">{content}</div>
      <div
        className="position-absolute tarkov-text-stroke-back"
        style={
          strokeWidth !== 1
            ? {
                WebkitTextStroke: `${strokeWidth}px black`,
              }
            : null
        }
      >
        {content}
      </div>
      <div
        className="position-absolute tarkov-text-stroke-front"
        style={{ color: color, userSelect: selectable ? "text" : "none" }}
      >
        {content}
      </div>
    </div>
  )
}

export { TextStroke }
