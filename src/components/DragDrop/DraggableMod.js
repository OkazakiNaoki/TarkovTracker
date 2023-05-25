import React, { useEffect } from "react"
import classNames from "classnames"
import { useDrag } from "react-dnd"

const DraggableMod = ({
  children,
  type,
  mod,
  modIndex,
  moveMod,
  removeMod,
}) => {
  //// Drag hook
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: type,
      item: {
        mod,
        modIndex,
        moveMod,
        removeMod,
      },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult()
        if (dropResult) {
          if (type === "mod" && dropResult.type === "sorting table") {
            // handbook => sorting table
            dropResult.placeMethod()
          } else if (
            type === "installed mod" &&
            dropResult.type === "sorting table"
          ) {
            // mod slot => sorting table
            dropResult.placeMethod()
            removeMod(modIndex)
          } else if (
            type === "spare mod" &&
            dropResult.type === "sorting table"
          ) {
            // sorting table => sorting table
            moveMod()
          } else if (
            (type === "mod" || type === "spare mod") &&
            dropResult.type === "mod slot"
          ) {
            // handbook, sorting table => mod slot
            dropResult.installMethod(dropResult.slotIndex, dropResult.mod)
            if (type === "spare mod") removeMod()
          } else if (
            type === "installed mod" &&
            dropResult.type === "mod slot"
          ) {
            // mod slot => mod slot
            moveMod(dropResult.fromSlotIndex, dropResult.slotIndex)
          } else if (
            (type === "spare mod" || type === "installed mod") &&
            dropResult.type === "trash can"
          ) {
            // sorting table, mod slot => trash can
            removeMod(item.modIndex)
          }
        }

        // force to remove grabbing cursor if it's not removed
        document.body.style.removeProperty("cursor")
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [mod, modIndex, moveMod, removeMod]
  )

  //// effect
  // grabbing cursor on drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.setProperty("cursor", "grabbing", "important")
    } else {
      document.body.style.removeProperty("cursor")
    }
  }, [isDragging])

  return (
    <div
      ref={drag}
      className={classNames({ "cursor-grab": !isDragging })}
      style={{
        height: "fit-content",
      }}
    >
      {children}
    </div>
  )
}

export { DraggableMod }
