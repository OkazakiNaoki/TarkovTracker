import React, { useEffect } from "react"
import { Image } from "react-bootstrap"
import classNames from "classnames"
import { useDrop } from "react-dnd"
import itemGrid from "../../server/public/static/images/cell_full_border.png"
import { ItemMultiGrid } from "./ItemMultiGrid"
import { DraggableMod } from "./DragDrop/DraggableMod"
import { useDispatch, useSelector } from "react-redux"
import { setDraggingMod } from "../reducers/ItemSlice"

const ContainableGrid = ({
  rowIndex,
  colIndex,
  setCurGridCoord,
  isHighlightGreen = false,
  isHighlightRed = false,
  placedMod = null,
  placedModIndex = null,
  placeMod,
  moveMod,
  removeMod,
}) => {
  //// state

  //// redux
  const { draggingMod, draggingModIndex } = useSelector((state) => state.item)
  const dispatch = useDispatch()

  //// drop
  const [{ canDrop, isOver, item, itemType, didDrop }, drop] = useDrop(() => {
    return {
      accept: ["mod", "spare mod", "installed mod"],
      drop: (item, monitor) => {
        const placeTaken = placedModIndex !== -1

        if (monitor.getItemType() === "mod" && !placeTaken) {
          // handbook => sorting table
          return { type: "sorting table", placeMethod: placeMod }
        } else if (monitor.getItemType() === "installed mod" && !placeTaken) {
          // mod slot => sorting table
          return { type: "sorting table", placeMethod: placeMod }
        } else if (monitor.getItemType() === "spare mod") {
          // sorting table => sorting table
          return { type: "sorting table" }
        }
      },
      collect: (monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }
  }, [rowIndex, colIndex, moveMod, placedModIndex, placeMod])

  // effect
  useEffect(() => {
    if (
      canDrop &&
      rowIndex === 0 &&
      colIndex === 0 &&
      item.mod &&
      (!draggingModIndex || draggingModIndex !== item.modIndex)
    ) {
      dispatch(setDraggingMod({ mod: item.mod, index: item.modIndex }))
    }
  }, [canDrop])

  //// handle function
  const handleMouseMove = (event) => {
    if (isOver) {
      let rect = event.currentTarget.getBoundingClientRect()
      const localX = Number(
        ((event.clientX - rect.left) / 64 + colIndex).toFixed(2)
      )
      const localY = Number(
        ((event.clientY - rect.top) / 64 + rowIndex).toFixed(2)
      )

      setCurGridCoord({ x: localX, y: localY })
    }
  }

  return (
    <div
      ref={drop}
      className="position-relative w-100 h-100"
      onMouseMove={handleMouseMove}
      style={{ zIndex: 1499 - colIndex - rowIndex }}
    >
      <Image
        src={itemGrid}
        className={classNames("mw-100", "mh-100", "bg-black")}
        //   style={{
        //     backgroundColor: bgColors["default"],
        //   }}
      />

      <div
        className={classNames(
          "position-absolute",
          "top-50",
          "start-50",
          "translate-middle",
          "w-100",
          "h-100",
          {
            "bg-green": canDrop && isHighlightGreen && !isHighlightRed,
          },
          { "bg-red": canDrop && isHighlightRed }
        )}
        style={{ opacity: "0.5" }}
      />
      {placedMod && (
        <div
          className="position-absolute top-0 start-0"
          style={{ ...(canDrop && { pointerEvents: "none" }) }}
        >
          <DraggableMod
            mod={placedMod}
            type="spare mod"
            modIndex={placedModIndex}
            moveMod={moveMod}
            removeMod={removeMod}
          >
            <ItemMultiGrid
              itemId={placedMod.id}
              resolution={64}
              width={placedMod.width}
              height={placedMod.height}
              shortName={
                canDrop &&
                draggingModIndex === placedModIndex &&
                itemType === "spare mod"
                  ? null
                  : placedMod.shortName
              }
              bgColor={placedMod.backgroundColor}
              hideGrid={
                canDrop &&
                draggingModIndex === placedModIndex &&
                itemType === "spare mod"
              }
              fitParent={false}
            />
          </DraggableMod>
        </div>
      )}
    </div>
  )
}

export { ContainableGrid }
