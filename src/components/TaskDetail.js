import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Container, Image } from "react-bootstrap"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"
import blueCheck from "../../public/static/images/blue_check.png"

const TaskDetail = ({
  task,
  showCount = false,
  completeable = false,
  finishClickHandles,
}) => {
  // hooks
  const [completeObjective, setCompleteObjective] = useState(null)

  // redux
  const { playerCompletedObjectives } = useSelector((state) => state.character)

  useEffect(() => {
    if (!completeObjective) {
      const index = getIndexOfMatchFieldObjArr(
        playerCompletedObjectives,
        "taskId",
        task.id
      )
      if (index !== -1) {
        setCompleteObjective(playerCompletedObjectives[index]["objectives"])
      } else {
        setCompleteObjective([])
      }
    }
  }, [task])

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
      {task.objectives.map((objective, i) => {
        return (
          <div
            key={"objective-" + i}
            className="d-flex justify-content-center my-2 p-2"
            style={{
              backgroundColor: "#2a2c2e",
            }}
          >
            <div className="d-inline-block">{objective.description}</div>
            {showCount && "count" in objective ? (
              <div className="mx-3 fw-bold">{"0/" + objective.count}</div>
            ) : null}
            {completeable &&
              completeObjective &&
              (completeObjective.includes(objective.id) ? (
                <Image src={blueCheck} className="ms-1" />
              ) : (
                <div className="ms-1">
                  <TarkovStyleButton text="TURN IN" height={30} />
                </div>
              ))}
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
        {task.finishRewards.traderStanding.map((finishStanding) => {
          return (
            finishStanding.trader.name +
            (finishStanding.standing > 0 ? " +" : " ") +
            finishStanding.standing +
            "\n"
          )
        })}
        {task.finishRewards.items.map((finishItem) => {
          return finishItem.item.name + " (" + finishItem.count + ")\n"
        })}
        {task.finishRewards.offerUnlock.map((finishOffer) => {
          return (
            "Unlock " +
            finishOffer.item.name +
            " at " +
            finishOffer.trader.name +
            "@Lv." +
            finishOffer.level +
            "\n"
          )
        })}
        {task.finishRewards.skillLevelReward.map((finishSkill) => {
          return "+" + finishSkill.level + " " + finishSkill.name + " level\n"
        })}
        {task.finishRewards.traderUnlock.map((finishTrader) => {
          return "Unlock trader " + finishTrader.name + "\n"
        })}
      </div>
    </>
  )
}

export { TaskDetail }
