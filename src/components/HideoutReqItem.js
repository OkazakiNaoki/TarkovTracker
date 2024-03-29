import React, { useState, useEffect } from "react"
import { Button, Card } from "react-bootstrap"
import { Plus } from "react-bootstrap-icons"
import { useDispatch } from "react-redux"
import { find, get } from "lodash"
import { updateInventoryItem } from "../reducers/CharacterSlice"
import { EditValueModal } from "./EditValueModal"
import { GainItemMethodBadge } from "./GainItemMethodBadge"
import { ItemSingleGrid } from "./ItemSingleGrid"
import { FloatingHideoutIcons } from "./FloatingHideoutIcons"
import { FloatingMessageBox } from "./FloatingMessageBox"
import { FloatingTraderTraderInfo } from "./FloatingTraderTradeInfo"
import { FloatingTaskSimpleInfo } from "./FloatingTaskSimpleInfo"

const HideoutReqItem = ({ playerInventory, itemReq }) => {
  //// state
  const [mainX, setMainX] = useState(0)
  const [mainY, setMainY] = useState(0)
  const [displayGainItemDetail, setDisplayGainItemDetail] = useState("none")
  const [displayHideoutIcons, setDisplayHideoutIcons] = useState("none")
  const [displayBuyTrades, setDisplayBuyTrades] = useState("none")
  const [displayBarterTrades, setDisplayBarterTrades] = useState("none")
  const [displayCraftInfo, setDisplayCraftInfo] = useState("none")
  const [displayTaskRewardInfo, setDisplayTaskRewardInfo] = useState("none")

  const [currentInfo, setCurrentInfo] = useState([])
  const [itemCount, setItemCount] = useState(null)
  const [itemModalOnOff, setItemModalOnOff] = useState(false)

  //// redux
  const dispatch = useDispatch()

  //// effect
  useEffect(() => {
    if (playerInventory) {
      const count = findItemAmount(playerInventory, itemReq.item.id)
      if (count !== itemCount) setItemCount(count)
    }
  }, [playerInventory])

  useEffect(() => {
    // update player's inventory once own amount of quest item changed
    if (playerInventory) {
      const count = findItemAmount(playerInventory, itemReq.item.id)
      if (itemCount !== null && itemCount !== count) {
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
  // get item amount in inventory
  const findItemAmount = (inventory, itemId) => {
    return get(
      find(inventory, (item) => {
        return get(item, "item.id") === itemId
      }),
      "count",
      0
    )
  }

  // mouse position update
  const mouseMoveHandle = (e) => {
    const { clientX, clientY } = e
    setMainX(clientX)
    setMainY(clientY)
  }

  // set text box text
  const setTextBoxTextHandle = (text) => {
    setCurrentInfo(text)
  }

  // text box badge hover
  const badgeEnterHandle = () => {
    setDisplayGainItemDetail("block")
  }

  const badgeLeaveHandle = () => {
    setDisplayGainItemDetail("none")
  }

  // trade badge hover
  const tradeBadgeEnterHandle = (badge) => {
    if (badge === "buy") {
      setDisplayBuyTrades("block")
    } else if (badge === "barter") {
      setDisplayBarterTrades("block")
    }
  }

  const tradeBadgeLeaveHandle = (badge) => {
    if (badge === "buy") {
      setDisplayBuyTrades("none")
    } else if (badge === "barter") {
      setDisplayBarterTrades("none")
    }
  }

  // item icon hover
  const itemIconEnterHandle = () => {
    setDisplayHideoutIcons("block")
  }

  const itemIconLeaveHandle = () => {
    setDisplayHideoutIcons("none")
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

  // item count modal
  const openItemCountModal = () => {
    setItemModalOnOff(!itemModalOnOff)
  }

  return [
    <FloatingHideoutIcons
      key="hideout_icons"
      posX={mainX}
      posY={mainY}
      display={displayHideoutIcons}
      colSize={5}
      stations={itemReq.levels}
    />,
    <FloatingHideoutIcons
      key="craftable_stations"
      posX={mainX}
      posY={mainY}
      display={displayCraftInfo}
      colSize={5}
      stations={itemReq.item.craftableStations}
    />,
    <FloatingTaskSimpleInfo
      key="task_reward"
      posX={mainX}
      posY={mainY}
      display={displayTaskRewardInfo}
      taskInfo={itemReq.item.rewardTasks}
      scale={0.5}
    />,
    <FloatingMessageBox
      key="msg_box"
      posX={mainX}
      posY={mainY}
      display={displayGainItemDetail}
      content={currentInfo}
    />,
    <FloatingTraderTraderInfo
      key="trader_trades_buy"
      posX={mainX}
      posY={mainY}
      display={displayBuyTrades}
      type="buy"
      tradeInfo={itemReq.item.buyable}
      scale={0.5}
    />,
    <FloatingTraderTraderInfo
      key="trader_trades_barter"
      posX={mainX}
      posY={mainY}
      display={displayBarterTrades}
      type="barter"
      tradeInfo={itemReq.item.barterable}
      scale={0.5}
    />,
    <EditValueModal
      title={itemReq.item.name}
      key="modal_of_item_count"
      show={itemModalOnOff}
      value={itemCount ?? 0}
      maxValue={itemReq.count}
      setValueHandle={(v) => {
        setItemCount(v)
        openItemCountModal()
      }}
      closeHandle={openItemCountModal}
    />,
    <Card key="hideout_item_card" className="hideout-item-card">
      <Card.Title className="hideout-item-card-title" title={itemReq.item.name}>
        <strong>{itemReq.item.name}</strong>
      </Card.Title>
      <div className="hideout-item-card-shortname">
        {itemReq.item.shortName}
      </div>
      <div className="hideout-item-card-icon">
        <div
          className="square-64px"
          onMouseEnter={itemIconEnterHandle}
          onMouseLeave={itemIconLeaveHandle}
          onMouseMove={mouseMoveHandle}
        >
          <ItemSingleGrid
            itemId={itemReq.item.id}
            foundInRaid={false}
            bgColor={itemReq.item.backgroundColor}
            shortName={null}
          />
        </div>
      </div>
      <div
        onMouseMove={itemReq ? mouseMoveHandle : null}
        className="hideout-item-acquire-badge"
      >
        <GainItemMethodBadge
          craftableStations={itemReq.item.craftableStations}
          questRewards={itemReq.item.rewardTasks}
          buyables={itemReq.item.buyable}
          barterables={itemReq.item.barterable}
          setTextBoxTextHandle={setTextBoxTextHandle}
          textBadgeEnterHandle={badgeEnterHandle}
          textBadgeLeaveHandle={badgeLeaveHandle}
          tradeBadgeEnterHandle={tradeBadgeEnterHandle}
          tradeBadgeLeaveHandle={tradeBadgeLeaveHandle}
          craftBadgeEnterHandle={craftBadgeEnterHandle}
          craftBadgeLeaveHandle={craftBadgeLeaveHandle}
          rewardBadgeEnterHandle={rewardBadgeEnterHandle}
          rewardBadgeLeaveHandle={rewardBadgeLeaveHandle}
        />
      </div>
      <Card.Text className="hideout-item-card-count">
        {(itemCount ?? 0) + " / " + itemReq.count}
      </Card.Text>
      <div className="hideout-item-card-btn">
        {playerInventory && (
          <Button variant="secondary" onClick={openItemCountModal}>
            <Plus size={24} />
          </Button>
        )}
      </div>
    </Card>,
  ]
}

export { HideoutReqItem }
