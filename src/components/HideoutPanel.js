import React, { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { find, cloneDeep } from "lodash"
import { HideoutIcon } from "./HideoutIcon"
import { DivLoading } from "./DivLoading"
import { HideoutStationDetail } from "./HideoutStationDetail"
import { ConfirmModal } from "./ConfirmModal"
import {
  updateHideoutLevel,
  updateInventoryItem,
} from "../reducers/CharacterSlice"
import { getAllHideout } from "../reducers/HideoutSlice"

const HideoutPanel = ({ playerHideoutLevel, playerInventory }) => {
  //// state
  const [currentStationId, setCurrentStationId] = useState(
    "5d388e97081959000a123acf"
  )
  const [currentStation, setCurrentStation] = useState(null)
  const [levelInfoOfCurrentStation, setLevelInfoOfCurrentStation] =
    useState(null)
  // modal
  const [modalStatus, setModalStatus] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalContent, setModalContent] = useState("")
  const [confirmFunc, setConfirmFunc] = useState(() => () => {})

  //// redux
  const dispatch = useDispatch()

  //// redux state
  const { hideout } = useSelector((state) => state.hideout)

  //// effect
  // get all hideout station
  useEffect(() => {
    if (!hideout) {
      dispatch(getAllHideout())
    }
  }, [hideout])

  // set construct detail and craft detail of currently selected station
  useEffect(() => {
    if (playerHideoutLevel) {
      const stationInfo = find(playerHideoutLevel, {
        hideoutId: currentStationId,
      })
      setLevelInfoOfCurrentStation(stationInfo)
    }
  }, [currentStationId, playerHideoutLevel])

  // get hideout data of current selected station ID
  useEffect(() => {
    if (hideout && hideout.length > 0) {
      const station = find(hideout, { id: currentStationId })
      setCurrentStation(station)
    }
  }, [hideout, currentStationId])

  //// handle
  // set current station
  const setCurrentStationHandle = (id) => {
    setCurrentStationId(id)
  }

  // station level increase
  const increaseStationLevelHandle = (hideoutId, levelIndex) => {
    const newHideoutLevel = cloneDeep(playerHideoutLevel)
    const targetStation = find(newHideoutLevel, { hideoutId: hideoutId })
    targetStation.level = levelIndex
    dispatch(updateHideoutLevel({ hideoutLevel: newHideoutLevel }))
  }

  // remove construct material
  const removeHideoutUpgradeCostHandle = (itemRequirements) => {
    const items = []
    itemRequirements.forEach((itemReq) => {
      playerInventory.some((item) => {
        if (item.item.id === itemReq.item.id) {
          const newItem = {
            item: {
              id: item.item.id,
              name: item.item.name,
              backgroundColor: item.item.backgroundColor,
            },
            count: item.count - itemReq.count,
          }
          items.push(newItem)
          return true
        }
      })
    })
    if (items.length > 0) {
      dispatch(updateInventoryItem({ items }))
    }
  }

  // construct
  const constructHandle = () => {
    if (currentStation.levels?.[0]) {
      setModalTitle(
        `${currentStation.name} Level ${currentStation.levels[0].level}`
      )
      setModalContent("Are you sure you are going to construct?")
      setConfirmFunc(() => () => {
        removeHideoutUpgradeCostHandle(
          currentStation.levels[0].itemRequirements
        )
        increaseStationLevelHandle(currentStation.id, 0)
      })
      closeModalHandle()
    }
  }

  // upgrade
  const upgradeHandle = () => {
    if (currentStation.levels?.[levelInfoOfCurrentStation.level + 1]) {
      setModalTitle(
        `${currentStation.name} Level ${
          currentStation.levels[levelInfoOfCurrentStation.level].level
        } > ${currentStation.levels[levelInfoOfCurrentStation.level + 1].level}`
      )
      setModalContent("Are you sure you are going to upgrade?")
      setConfirmFunc(() => () => {
        modalConfirmHandle(
          currentStation.id,
          levelInfoOfCurrentStation.level + 1
        )
      })
      closeModalHandle()
    }
  }

  // close modal
  const closeModalHandle = useCallback(() => {
    setModalStatus(!modalStatus)
  }, [modalStatus])

  // modal confirm
  const modalConfirmHandle = (stationId, targetLevelIndex) => {
    removeHideoutUpgradeCostHandle(
      currentStation.levels[targetLevelIndex].itemRequirements
    )
    increaseStationLevelHandle(stationId, targetLevelIndex)
  }

  return (
    <>
      <ConfirmModal
        show={modalStatus}
        title={modalTitle}
        content={modalContent}
        confirmHandle={confirmFunc}
        closeHandle={closeModalHandle}
      />
      <div>
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {hideout &&
            hideout.map((station) => {
              return (
                <div
                  key={station.id}
                  role="button"
                  onClick={setCurrentStationHandle.bind(null, station.id)}
                >
                  <HideoutIcon
                    iconName={station.id}
                    stationName={station.name}
                    selected={currentStationId === station.id}
                    useNameBox={true}
                  />
                </div>
              )
            })}
        </div>

        {/* station info not yet loaded */}
        {!levelInfoOfCurrentStation && <DivLoading height={300} />}
        {/* not yet construct case */}
        {levelInfoOfCurrentStation &&
          levelInfoOfCurrentStation.level === -1 &&
          currentStation && (
            <HideoutStationDetail
              station={currentStation}
              curLevelIndex={-1}
              increaseLevelHandle={constructHandle}
            />
          )}
        {/* constructed case */}
        {levelInfoOfCurrentStation &&
          levelInfoOfCurrentStation.level > -1 &&
          currentStation && (
            <HideoutStationDetail
              station={currentStation}
              curLevelIndex={levelInfoOfCurrentStation.level}
              increaseLevelHandle={upgradeHandle}
            />
          )}
      </div>
    </>
  )
}

export { HideoutPanel }
