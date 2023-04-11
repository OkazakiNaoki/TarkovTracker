import React, { useState, useEffect } from "react"
import { Row, Col, Tab, Tabs } from "react-bootstrap"
import { HideoutPanel } from "./HideoutPanel"
import { HideoutReqItems } from "./HideoutReqItems"
import { PlayerTaskPanel } from "./PlayerTaskPanel"
import { SkillPanel } from "./SkillPanel"
import { TraderPanel } from "./TraderPanel"
import { QuestItems } from "./QuestItems"
import { InventoryPanel } from "./InventoryPanel"
import { TraderOffers } from "./TraderOffers"

const PlayerCharacterPanel = ({
  traders,
  tasks,
  unlockedTraders,
  playerLevel,
  playerInventory,
  playerSkill,
  traderProgress,
  playerTasksInfo,
  playerHideoutLevel,
  playerUnlockedOffer,
}) => {
  // useEffect(() => {
  //   console.log("debug: player character panel rerendered")
  // })

  return (
    <Col>
      <Tabs
        defaultActiveKey="task"
        className="mb-4 flex-column flex-lg-row tarkov-tabs"
        transition={false}
        fill
      >
        {/* TASK */}
        <Tab eventKey="task" title="Task">
          <PlayerTaskPanel
            traders={traders}
            tasks={tasks}
            unlockedTraders={unlockedTraders}
            playerLevel={playerLevel}
            playerTasksInfo={playerTasksInfo}
            playerInventory={playerInventory}
            traderProgress={traderProgress}
          />
        </Tab>

        {/* Hideout */}
        <Tab eventKey="hideout" title="Hideout">
          <HideoutPanel
            playerHideoutLevel={playerHideoutLevel}
            playerInventory={playerInventory}
          />
        </Tab>

        {/* Skill */}
        <Tab eventKey="skill" title="Skill">
          <SkillPanel playerSkill={playerSkill} />
        </Tab>

        {/* Trader LL */}
        <Tab eventKey="trader" title="Trader">
          <TraderPanel traders={traders} traderProgress={traderProgress} />
        </Tab>

        {/* Inventory */}
        <Tab eventKey="inventory" title="Inventory">
          <InventoryPanel playerInventory={playerInventory} />
        </Tab>

        {/* Quest item */}
        <Tab eventKey="questItem" title="Quest item">
          {Object.keys(playerTasksInfo).length > 0 && (
            <div>
              {Object.keys(playerTasksInfo).length === traders.length && (
                <QuestItems playerTasksInfo={playerTasksInfo} />
              )}
            </div>
          )}
        </Tab>

        {/* Hideout item */}
        <Tab eventKey="hideoutItem" title="Hideout item">
          {Object.keys(playerTasksInfo).length > 0 && (
            <div>
              {Object.keys(playerTasksInfo).length === traders.length && (
                <HideoutReqItems />
              )}
            </div>
          )}
        </Tab>

        {/* Trader offer */}
        <Tab eventKey="traderoffer" title="Trader offer">
          <TraderOffers
            traders={traders}
            useTable={false}
            useRowCol={true}
            playerUnlockedOffer={playerUnlockedOffer}
          />
        </Tab>
      </Tabs>
    </Col>
  )
}

export { PlayerCharacterPanel }
