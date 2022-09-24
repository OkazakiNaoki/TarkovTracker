import React from "react"
import { Card } from "react-bootstrap"
import { ItemSingleGrid } from "./ItemSingleGrid"

const excludeQuest = [
  "61e6e60223374d168a4576a6",
  "61e6e621bfeab00251576265",
  "61e6e5e0f5b9633f6719ed95",
]

const QuestItem = ({ itemReq }) => {
  return (
    <Card className="bg-dark text-white my-3 p-3 rounded w-100 ls-1">
      <Card.Title
        className="two-line-text-trunc sandbeige"
        style={{ height: "50px" }}
        title={itemReq.item.itemName}
      >
        <strong>{itemReq.item.itemName}</strong>
      </Card.Title>
      <div className="d-flex position-relative my-3 justify-content-center">
        <ItemSingleGrid
          itemId={itemReq.item.itemId}
          foundInRaid={itemReq.item.foundInRaid}
          bgColor={itemReq.item.bgColor}
          shortName={itemReq.item.dogTagLevel ? itemReq.item.dogTagLevel : null}
        />
      </div>
      <Card.Text className="text-center">
        {"- / " +
          itemReq.requiredByTask.reduce((pre, cur) => {
            if (!excludeQuest.includes(cur.taskId)) {
              return pre + cur.count
            } else return pre
          }, 0)}
      </Card.Text>
      <Card.Text>
        {itemReq.requiredByTask.map((req) => {
          if (!excludeQuest.includes(req.taskId)) return req.taskName + " *** "
        })}
      </Card.Text>
      <Card.Text>{itemReq.item.itemId}</Card.Text>
    </Card>
  )
}

export { QuestItem }
