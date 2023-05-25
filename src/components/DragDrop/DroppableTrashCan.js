import React from "react"
import classNames from "classnames"
import { Trash3 } from "react-bootstrap-icons"
import { useDrop } from "react-dnd"

const DroppableTrashCan = () => {
  const [{ canDrop, isOver, item }, drop] = useDrop(() => {
    return {
      accept: ["spare mod", "installed mod"],
      drop: (item) => {
        return { type: "trash can" }
      },
      collect: (monitor) => ({
        item: monitor.getItem(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }
  })

  return (
    <div
      ref={drop}
      className={classNames(
        "position-relative",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "square-64px",
        "bg-black4",
        { "bg-red": isOver }
      )}
      // style={{ zIndex: 1000 }}
    >
      <Trash3
        size={26}
        className={classNames({ sand1: !isOver }, { black: isOver })}
      />
    </div>
  )
}

export { DroppableTrashCan }
