import React, { useState, useEffect } from "react"
import { Container, Image } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { AddValueModal } from "../components/AddValueModal"
import {
  setInitSetup,
  addCharacterData,
  addObjectiveProgress,
  addCompletedObjectives,
  addCompletedTasks,
  addHideoutLevel,
  addHideoutProgress,
} from "../reducers/CharacterSlice"
import { getAllHideout } from "../reducers/HideoutSlice"
import bearIcon from "../../public/static/images/icon_bear.png"
import usecIcon from "../../public/static/images/icon_usec.png"

const PlayerDataSetup = () => {
  // hooks
  const [localPlayerLevel, setLocalPlayerLevel] = useState(1)
  const [hoverPlayerLvl, setHoverPlayerLvl] = useState(false)
  const [openCloseLevelModal, setOpenCloseLevelModal] = useState(false)
  const [hoverBearIcon, setHoverBearIcon] = useState(false)
  const [hoverUsecIcon, setHoverUsecIcon] = useState(false)
  const [factionPick, setFactionPick] = useState(null)
  const [levelIcon, setLevelIcon] = useState("/asset/rank5.png")

  // redux
  const { hideout } = useSelector((state) => state.hideout)
  const dispatch = useDispatch()

  // effects
  useEffect(() => {
    if (hideout.length === 0) {
      dispatch(getAllHideout())
    }
  }, [hideout])

  // handles
  const hoverOnLevelSetupBtn = () => {
    setHoverPlayerLvl(!hoverPlayerLvl)
  }
  const openLevelModalHandle = () => {
    setOpenCloseLevelModal(!openCloseLevelModal)
  }
  const setLevelIconHandle = (lvl) => {
    for (let i = 1; i <= 16; i++) {
      if (lvl >= 5 * i) {
        continue
      } else {
        setLevelIcon(`/asset/rank${5 * i}.png`)
        break
      }
    }
  }
  const hoverOnBearBtn = () => {
    setHoverBearIcon(!hoverBearIcon)
  }
  const hoverOnUsecBtn = () => {
    setHoverUsecIcon(!hoverUsecIcon)
  }
  const finishSetupHandle = () => {
    if (factionPick) {
      const initHideoutLevel = hideout.map((station) => {
        return {
          hideoutId: station.id,
          level: station.id === "5d484fc0654e76006657e0ab" ? 0 : -1,
          maxed: false,
        }
      })
      const initHideoutProgress = hideout.map((station) => {
        return {
          hideoutId: station.id,
          progress: [],
        }
      })
      dispatch(addHideoutLevel({ hideoutLevel: initHideoutLevel }))
      dispatch(addHideoutProgress({ hideoutProgress: initHideoutProgress }))
      dispatch(
        addCharacterData({
          characterLevel: localPlayerLevel,
          characterFaction: factionPick,
        })
      )
      dispatch(addCompletedTasks({ completeTasks: [] }))
      dispatch(addCompletedObjectives({ completeObjectives: [] }))
      dispatch(addObjectiveProgress({ objectiveProgress: [] }))
      dispatch(setInitSetup())
    }
  }

  return [
    <AddValueModal
      key="modal_of_level"
      show={openCloseLevelModal}
      value={1}
      valueCap={79}
      setValueHandle={(v) => {
        setLevelIconHandle(v)
        setLocalPlayerLevel(v)
        openLevelModalHandle()
      }}
      closeHandle={openLevelModalHandle}
    />,
    <Container
      key="setup_panel"
      className="h-100 d-flex align-content-center justify-content-center align-items-center flex-wrap"
    >
      <div className="w-100 d-flex justify-content-center mb-5 fs-1 sandbeige">
        Initial setup
      </div>
      <div
        className="px-2 py-1 fs-3"
        style={{
          width: "60%",
          borderBottom: "1px solid #b7ad9c",
          borderTop: "1px solid #b7ad9c",
        }}
      >
        Character level
      </div>
      <div className="w-100 d-flex justify-content-center mt-3 mb-5">
        <div
          className="sandbeige px-5 pb-3"
          role="button"
          style={{
            fontSize: "90px",
            border: hoverPlayerLvl ? "1px solid #9a8866" : "1px solid #b7ad9c",
            boxShadow: hoverPlayerLvl ? "0 0 20px 5px #9a8866" : null,
            borderRadius: "15px",
          }}
          onMouseEnter={hoverOnLevelSetupBtn}
          onMouseLeave={hoverOnLevelSetupBtn}
          onClick={() => {
            setOpenCloseLevelModal(!openCloseLevelModal)
          }}
        >
          <Image
            src={levelIcon}
            className="d-inline me-3"
            style={{ height: "100px" }}
          />
          {localPlayerLevel}
        </div>
      </div>
      <div
        className="px-2 py-1 fs-3"
        style={{
          width: "60%",
          borderBottom: "1px solid #b7ad9c",
          borderTop: "1px solid #b7ad9c",
        }}
      >
        Faction
      </div>
      <div className="w-100 d-flex justify-content-center my-3">
        <div
          className=""
          role="button"
          style={{
            boxShadow:
              hoverBearIcon || factionPick === "bear"
                ? "0 0 20px 5px #9a8866"
                : null,
            borderRadius: "15px",
          }}
          onMouseEnter={hoverOnBearBtn}
          onMouseLeave={hoverOnBearBtn}
          onClick={() => {
            setFactionPick("bear")
          }}
        >
          <Image src={bearIcon} />
        </div>
        <div
          className=""
          role="button"
          style={{
            boxShadow:
              hoverUsecIcon || factionPick === "usec"
                ? "0 0 20px 5px #9a8866"
                : null,
            borderRadius: "15px",
          }}
          onMouseEnter={hoverOnUsecBtn}
          onMouseLeave={hoverOnUsecBtn}
          onClick={() => {
            setFactionPick("usec")
          }}
        >
          <Image src={usecIcon} />
        </div>
      </div>
      <div className="w-100 d-flex justify-content-center my-3">
        <TarkovStyleButton
          text="Finish"
          clickHandle={finishSetupHandle}
          fs={24}
          height={60}
        />
      </div>
    </Container>,
  ]
}

export { PlayerDataSetup }
