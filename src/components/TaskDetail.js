import React from "react"
import { Container, Image } from "react-bootstrap"

const TaskDetail = ({ task }) => {
  return (
    <>
      <Container className="d-flex align-items-start p-3">
        <Image
          src={`/asset/${task.image}.png`}
          style={{ objectFit: "contain" }}
        />
        <p className="ps-3">{task.description}</p>
      </Container>
      <div className="px-4">Objective(s)</div>
      {task.objectives.map((el, i) => {
        return (
          <div
            key={"objective-" + i}
            className="text-center my-2 p-2"
            style={{
              backgroundColor: "#2a2c2e",
            }}
          >
            {el.description}
          </div>
        )
      })}
      <div className="px-4">Rewards</div>
      <div
        className="text-center m-2 px-5"
        style={{
          backgroundColor: "#090a0b",
          whiteSpace: "break-spaces",
        }}
      >
        {"+" + task.experience + "EXP\n"}
        {task.finishRewards.traderStanding.map((el) => {
          return (
            el.trader.name + (el.standing > 0 ? " +" : " ") + el.standing + "\n"
          )
        })}
        {task.finishRewards.items.map((el) => {
          return el.item.name + " (" + el.count + ")\n"
        })}
        {task.finishRewards.offerUnlock.map((el) => {
          return (
            "Unlock " +
            el.item.name +
            " at " +
            el.trader.name +
            "@Lv." +
            el.level +
            "\n"
          )
        })}
        {task.finishRewards.skillLevelReward.map((el) => {
          return "+" + el.level + " " + el.name + " level\n"
        })}
        {task.finishRewards.traderUnlock.map((el) => {
          return "Unlock trader " + el.name + "\n"
        })}
      </div>
    </>
  )
}

export { TaskDetail }
