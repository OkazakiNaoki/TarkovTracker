import React from "react"
import { useSelector } from "react-redux"
import { Image } from "react-bootstrap"
import { getArrObjFieldBWhereFieldAEqualTo } from "../helpers/LoopThrough"

const FloatingTaskSimpleInfo = ({
  posX,
  posY,
  display,
  taskInfo,
  scale = 0.6,
  lineLimit = 5,
}) => {
  //// redux state
  const { traders } = useSelector((state) => state.trader)

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
        {taskInfo.map((task, i) => {
          if (i < lineLimit) {
            return (
              <div
                key={`trade_no_${i}`}
                className="d-flex align-items-center m-1"
              >
                <Image
                  src={`/asset/${getArrObjFieldBWhereFieldAEqualTo(
                    traders,
                    "name",
                    task.trader,
                    "id"
                  )}.png`}
                  className="me-1"
                  style={{ width: `${64 * scale}px` }}
                />
                {task.name}
                {` (x${task.count})`}
              </div>
            )
          }
        })}
        {taskInfo.length > lineLimit ? "..." : null}
      </div>
    </div>
  )
}

export { FloatingTaskSimpleInfo }
