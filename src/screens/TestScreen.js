import React, { useState, useEffect } from "react"
import { cloneDeep } from "lodash"
import { DndProvider, useDrag, useDragLayer, useDrop } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import lockIcon from "../../server/public/static/images/icon_lock.png"
import { Image } from "react-bootstrap"

const itemType = { Burger: "burger", Ingredient: "ingredient" }

const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  top: 0,
  left: 0,
}

function getItemStyles(initialOffset, currentOffset, size, clientOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    }
  }
  //   let { x, y } = currentOffset

  const dx = clientOffset.x
  const dy = clientOffset.y
  const x = dx - 50 // subtract half of drag item width
  const y = dy - 50 // subtract half of drag item height

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

const CustomDragLayer = () => {
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

  //   console.log(item)

  if (!isDragging) {
    return null
  } else {
    return (
      <div style={{ ...layerStyles }} className="drag-layer">
        <div
          style={getItemStyles(
            initialOffset,
            currentOffset,
            item.size,
            clientOffset
          )}
        >
          <Image src={lockIcon} />
        </div>
      </div>
    )
  }
}

const Ingredient = ({ ingredient }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: itemType.Ingredient,
    options: { touchFollowCursor: true },
    item: {
      name: ingredient.name,
      object: ingredient,
      size: { width: 100, height: 100 },
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        if (dropResult.type === itemType.Burger) {
          //   console.log("DAYUM")
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  let ccc = isDragging ? "white" : ingredient.color

  useEffect(() => {
    if (isDragging) {
      console.log("dragging")
      document.body.style.setProperty("cursor", "none", "important")
    } else {
      console.log("stop draggin")
      document.body.style.removeProperty("cursor")
    }
  }, [isDragging])

  return (
    <>
      <div
        ref={drag}
        style={{
          backgroundColor: ccc,
          width: "100px",
          height: "100px",
          color: "black",
        }}
        className="text-center"
      >
        {ingredient.name}
      </div>
    </>
  )
}

const Burger = ({ name, updateMethod, children, countMethod, count }) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: itemType.Ingredient,
      // options: { touchFollowCursor: true },
      drop: (item) => {
        console.log(count)
        countMethod()
        updateMethod(name, item.object)
        return { name: "Burger", type: itemType.Burger }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [countMethod]
  )

  const isActive = canDrop && isOver
  let backgroundColor = "#222"
  if (isActive) {
    backgroundColor = "darkgreen"
  } else if (canDrop) {
    backgroundColor = "darkkhaki"
  }

  console.log("isOver", isOver)

  return (
    <div
      ref={drop}
      style={{
        backgroundColor,
        width: "100px",
        height: "100px",
        color: "white",
      }}
      className="text-center"
    >
      {children ? children : name}
    </div>
  )
}

const TestScreen = () => {
  const [count, setCount] = useState(0)
  const increaseCount = () => {
    setCount(count + 1)
  }

  const [burgerIngredients, setBurgerIngredients] = useState([
    { id: "cheese", name: "起司", color: "yellow" },
    { id: "tomato", name: "番茄", color: "red" },
    { id: "lettuce", name: "生菜", color: "green" },
  ])

  const [burgers, setBurgers] = useState([
    { id: "漢堡1", ingredients: null },
    { id: "漢堡2", ingredients: null },
    { id: "漢堡3", ingredients: null },
  ])

  useEffect(() => {
    // console.dir(burgers)
  }, [burgers])

  useEffect(() => {
    console.log("count", count)
  }, [count])

  const updateBurgerIngredients = (burgerId, ingredients) => {
    const copyBurgers = cloneDeep(burgers)
    for (let i = 0; i < copyBurgers.length; i++) {
      if (copyBurgers[i].id === burgerId) {
        copyBurgers[i].ingredients = ingredients
        break
      }
    }
    setBurgers(copyBurgers)
  }

  return (
    <div>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <div>
          <Burger
            name="漢堡1"
            updateMethod={updateBurgerIngredients}
            countMethod={increaseCount}
          >
            {burgers[0].ingredients && (
              <Ingredient ingredient={burgers[0].ingredients} />
            )}
          </Burger>
        </div>
        <div className="d-flex">
          {burgerIngredients.map((ing) => {
            return <Ingredient key={ing.id} ingredient={ing} />
          })}
        </div>
        <CustomDragLayer />
      </DndProvider>
    </div>
  )
}

export { TestScreen }
