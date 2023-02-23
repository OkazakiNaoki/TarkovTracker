import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Button, Card } from "react-bootstrap"
import { useDispatch } from "react-redux"
import {
  getArrObjFieldBWhereFieldAEqualTo,
  getIndexOfObjArrWhereFieldEqualTo,
} from "../helpers/LoopThrough"
import { updateInventoryItem } from "../reducers/CharacterSlice"
import { EditValueModal } from "./EditValueModal"
import { FloatingHideoutIcons } from "./FloatingHideoutIcons"
import { FloatingMessageBox } from "./FloatingMessageBox"
import { FloatingTaskSimpleInfo } from "./FloatingTaskSimpleInfo"
import { GainItemMethodBadge } from "./GainItemMethodBadge"
import { ItemSingleGrid } from "./ItemSingleGrid"

const QuestItem = ({ playerInventory, itemReq }) => {
  const [mainX, setMainX] = useState(0)
  const [mainY, setMainY] = useState(0)
  const [displayGainItemDetail, setDisplayGainItemDetail] = useState("none")
  const [displayTaskReqInfo, setDisplayTaskReqInfo] = useState("none")
  const [displayCraftInfo, setDisplayCraftInfo] = useState("none")
  const [displayTaskRewardInfo, setDisplayTaskRewardInfo] = useState("none")

  const [currentInfo, setCurrentInfo] = useState([])
  const [itemCount, setItemCount] = useState(null)
  const [itemNeedTotalCount, setItemNeedTotalCount] = useState(0)
  const [itemModalOnOff, setItemModalOnOff] = useState(false)

  //// redux
  const dispatch = useDispatch()

  //// effect
  useEffect(() => {
    // calculate total requirement amount of quest item
    if (itemNeedTotalCount === 0) {
      setItemNeedTotalCount(
        itemReq.requiredByTask.reduce((pre, cur) => {
          return pre + cur.count
        }, 0)
      )
    }
  }, [itemNeedTotalCount])

  useEffect(() => {
    if (playerInventory) {
      const count = getArrObjFieldBWhereFieldAEqualTo(
        playerInventory,
        "item.id",
        itemReq.item.id,
        "count"
      )
      if (count !== itemCount) setItemCount(count)
    }
  }, [playerInventory])

  useEffect(() => {
    // update player's inventory once own amount of quest item changed
    if (playerInventory && itemCount !== null) {
      const newInventory = JSON.parse(JSON.stringify(playerInventory))
      const index = getIndexOfObjArrWhereFieldEqualTo(
        newInventory,
        "id",
        itemReq.item.id
      )
      if (index === -1 || newInventory[index].count !== itemCount) {
        dispatch(
          updateInventoryItem({
            items: [
              {
                item: {
                  id: itemReq.item.id,
                  name: itemReq.item.name,
                  backgroundColor: itemReq.item.backgroundColor,
                },
                count: itemCount,
              },
            ],
          })
        )
      }
    }
  }, [itemCount])

  //// handle
  const mouseMoveHandle = (e) => {
    const { clientX, clientY } = e
    setMainX(clientX)
    setMainY(clientY)
  }

  // set text box text
  const setTextBoxTextHandle = (text) => {
    setCurrentInfo(text)
  }

  // item icon mouse enter/leave
  const itemIconEnterHandle = () => {
    setDisplayTaskReqInfo("block")
  }

  const itemIconLeaveHandle = () => {
    setDisplayTaskReqInfo("none")
  }

  // text badge mouse enter/leave
  const textBadgeEnterHandle = () => {
    setDisplayGainItemDetail("block")
  }

  const textBadgeLeaveHandle = () => {
    setDisplayGainItemDetail("none")
  }

  // craft badge mouse enter/leave
  const craftBadgeEnterHandle = () => {
    setDisplayCraftInfo("block")
  }

  const craftBadgeLeaveHandle = () => {
    setDisplayCraftInfo("none")
  }

  // task reward badge mouse enter/leave
  const rewardBadgeEnterHandle = () => {
    setDisplayTaskRewardInfo("block")
  }

  const rewardBadgeLeaveHandle = () => {
    setDisplayTaskRewardInfo("none")
  }

  // on/off modal
  const openItemCountModal = () => {
    setItemModalOnOff(!itemModalOnOff)
  }

  if (itemNeedTotalCount > 0) {
    return [
      <FloatingMessageBox
        key="msg_box"
        posX={mainX}
        posY={mainY}
        display={displayGainItemDetail}
        content={currentInfo}
      />,
      <FloatingHideoutIcons
        key="craftable_stations"
        posX={mainX}
        posY={mainY}
        display={displayCraftInfo}
        colSize={5}
        stations={itemReq.craftableStations}
      />,
      <FloatingTaskSimpleInfo
        key="item_rew_task_info"
        posX={mainX}
        posY={mainY}
        display={displayTaskRewardInfo}
        taskInfo={itemReq.rewardTasks}
        scale={0.5}
      />,
      <FloatingTaskSimpleInfo
        key="item_req_task_info"
        posX={mainX}
        posY={mainY}
        display={displayTaskReqInfo}
        taskInfo={itemReq.requiredByTask}
        scale={0.5}
      />,
      <EditValueModal
        title={itemReq.item.name}
        key="modal_of_item_count"
        show={itemModalOnOff}
        value={itemCount ?? 0}
        maxValue={itemNeedTotalCount}
        setValueHandle={(v) => {
          setItemCount(v)
          openItemCountModal()
        }}
        closeHandle={openItemCountModal}
      />,
      <Card
        key="quest_item_card"
        className="bg-dark text-white my-3 rounded w-100 ls-1"
      >
        <Card.Title
          className="p-3 two-line-text-trunc sandbeige"
          style={{ height: "68px" }}
          title={itemReq.item.name}
        >
          <strong>{itemReq.item.name}</strong>
        </Card.Title>
        <div className="px-3" style={{ fontSize: "8px" }}>
          {itemReq.item.shortName}
        </div>
        <div className="d-flex position-relative my-3 justify-content-center">
          <div
            onMouseEnter={() => {
              setTextBoxTextHandle("needed")
              itemIconEnterHandle()
            }}
            onMouseLeave={itemIconLeaveHandle}
            onMouseMove={mouseMoveHandle}
            style={{ width: "64px", height: "64px" }}
          >
            <ItemSingleGrid
              itemId={itemReq.item.id}
              foundInRaid={itemReq.item.foundInRaid}
              bgColor={itemReq.item.backgroundColor}
              shortName={
                itemReq.item.dogTagLevel ? itemReq.item.dogTagLevel : null
              }
            />
          </div>
        </div>
        <div onMouseMove={itemReq ? mouseMoveHandle : null} className="px-3">
          <GainItemMethodBadge
            craftableStations={itemReq.craftableStations}
            questRewards={itemReq.rewardTasks}
            collection={itemReq.requiredByTask}
            setTextBoxTextHandle={setTextBoxTextHandle}
            textBadgeEnterHandle={textBadgeEnterHandle}
            textBadgeLeaveHandle={textBadgeLeaveHandle}
            craftBadgeEnterHandle={craftBadgeEnterHandle}
            craftBadgeLeaveHandle={craftBadgeLeaveHandle}
            rewardBadgeEnterHandle={rewardBadgeEnterHandle}
            rewardBadgeLeaveHandle={rewardBadgeLeaveHandle}
          />
        </div>
        <Card.Text className="text-center my-3">
          {(itemCount ?? 0) + " / " + itemNeedTotalCount}
        </Card.Text>
        <div className="d-flex flex-grow-1 justify-content-center">
          {playerInventory && (
            <Button
              variant="secondary"
              onClick={openItemCountModal}
              className="align-self-end w-100"
              style={{ borderRadius: "0 0 0.374rem 0.374rem" }}
            >
              +
            </Button>
          )}
        </div>
      </Card>,
    ]
  }
}

export { QuestItem }
