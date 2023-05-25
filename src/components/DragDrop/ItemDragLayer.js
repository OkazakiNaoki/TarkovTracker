import React from "react"
import { useDragLayer } from "react-dnd"
import { ItemMultiGrid } from "../ItemMultiGrid"

function getItemStyles(
  initialOffset,
  currentOffset,
  clientOffset,
  itemWidth,
  itemHeight
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    }
  }

  const x = clientOffset.x - itemWidth / 2
  const y = clientOffset.y - itemHeight / 2

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

const ItemDragLayer = ({ pixPerGrid = 64 }) => {
  //// Drag layer hook
  const {
    item,
    itemType,
    initialOffset,
    currentOffset,
    isDragging,
    clientOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
  }))

  //// handle function
  const wheelEventHandle = (e) => {
    let node = e.target

    while (node) {
      // already reach body then stop seeking
      if (node === document.body) {
        break
      }

      // check if scrollable, if so add the scroll delta Y value to it
      const style = window.getComputedStyle(node)
      if (style.overflowY === "scroll" || style.overflowY === "auto") {
        node.scrollTop += e.deltaY
        return
      }

      // did not find current node scrollable, go to next parent
      node = node.parentNode
    }
  }

  if (!isDragging) {
    return null
  } else {
    return (
      <>
        {/* mask to stop mouse event from below (z-index) */}
        <div
          onWheel={wheelEventHandle}
          style={{
            position: "fixed",
            zIndex: 999,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        ></div>
        {/* drag layer */}
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 1500,
            top: 0,
            left: 0,
          }}
        >
          {(itemType === "mod" ||
            itemType === "spare mod" ||
            itemType === "installed mod") && (
            <div
              style={getItemStyles(
                initialOffset,
                currentOffset,
                clientOffset,
                item.mod.width * pixPerGrid,
                item.mod.height * pixPerGrid
              )}
            >
              <ItemMultiGrid
                itemId={item.mod.id}
                resolution={pixPerGrid}
                width={item.mod.width}
                height={item.mod.height}
                hideGrid={true}
              />
            </div>
          )}
        </div>
      </>
    )
  }
}

export { ItemDragLayer }
