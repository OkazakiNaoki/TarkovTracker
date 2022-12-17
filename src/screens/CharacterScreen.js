import React, { useEffect, useState } from "react"
import {
  Button,
  Col,
  Container,
  Image,
  Row,
  Tabs,
  Tab,
  Accordion,
  Table,
  ToggleButton,
  Collapse,
} from "react-bootstrap"
import { Pencil } from "react-bootstrap-icons"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { LoginFirst } from "../components/LoginFirst"
import {
  getTasksOfTraderWithLevel,
  updateCompletedTasks,
  getCompletedObjectives,
  getObjectiveProgress,
  updateCompletedObjectives,
  updateObjectiveProgress,
  getCharacterData,
  updateCharacterData,
  getHideoutLevel,
  updateHideoutLevel,
  getTraderProgress,
  updateInventoryItem,
  getSkillProgress,
  updateSkillProgress,
  getUnlockedTrader,
  updateUnlockedTrader,
  updateTraderProgress,
} from "../reducers/CharacterSlice"
import {
  getLevelReqOfTrader,
  getTaskDetail,
  getTasksOfTrader,
  initializeTasks,
} from "../reducers/TraderSlice"
import { getAllHideout } from "../reducers/HideoutSlice"
import { clearItems, searchItemByName } from "../reducers/FleamarketSlice"
import { TaskDetail } from "../components/TaskDetail"
import { PlayerDataSetup } from "../components/PlayerDataSetup"
import { EditValueModal } from "../components/EditValueModal"
import {
  getAnotherFieldOfMatchFieldObjArr,
  getIndexOfMatchFieldObjArr,
  haveZeroPropertyEqualTo,
} from "../helpers/LoopThrough"
import { HideoutIcon } from "../components/HideoutIcon"
import { HideoutStationDetail } from "../components/HideoutStationDetail"
import { ConfirmModal } from "../components/ConfirmModal"
import { QuestItems } from "../components/QuestItems"
import { TarkovSpinner } from "../components/TarkovSpinner"
import { DivLoading } from "../components/DivLoading"
import { TraderCard } from "../components/TraderCard"
import { TraderRelationModal } from "../components/TraderRelationModal"
import { ItemSearchBar } from "../components/ItemSearchBar"
import Paginate from "../components/Paginate"
import { ItemSingleGrid } from "../components/ItemSingleGrid"
import { SkillIcon } from "../components/SkillIcon"
import { convertKiloMega } from "../helpers/NumberFormat"
import { safeGet } from "../helpers/ObjectExt"

const CharacterScreen = () => {
  // router
  const [searchParams, setSearchParams] = useSearchParams({})

  //// hooks state
  // player basic data
  const [levelIcon, setLevelIcon] = useState("/asset/rank5.png")
  const [openPlayerLevelModal, setOpenPlayerLevelModal] = useState(false)
  // player task
  const [taskInitialized, setTaskInitialized] = useState(false)
  const [showCompleteTask, setShowCompleteTask] = useState(false)
  const [showOngoingTask, setShowOngoingTask] = useState(true)
  const [showNotQualifyTask, setShowNotQualifyTask] = useState(false)
  const [collapseDetail, setCollapseDetail] = useState({})
  const [curShowingTaskLen, setCurShowingTaskLen] = useState(null)
  const [taskTotalLen, setTaskTotalLen] = useState(null)
  const [taskNeedToUpdateStatus, setTaskNeedToUpdateStatus] = useState(null)
  // player trader
  const [openTraderSettingModal, setOpenTraderSettingModal] = useState(false)
  const [traderSettingTarget, setTraderSettingTarget] = useState("")
  // player hideout
  const [currentStationId, setCurrentStationId] = useState(
    "5d388e97081959000a123acf"
  )
  const [currentStation, setCurrentStation] = useState(null)
  const [levelInfoOfCurrentStation, setLevelInfoOfCurrentStation] =
    useState(null)
  const [hideoutModalTitle, setHideoutModalTitle] = useState("")
  const [confirmModalContent, setConfirmModalContent] = useState("")
  const [openHideoutModal, setOpenHideoutModal] = useState(false)
  const [confirmFunc, setConfirmFunc] = useState(() => () => {})
  // player inventory
  const [openItemModal, setOpenItemModal] = useState(false)
  const [curInventoryItem, setCurInventoryItem] = useState(null)
  const [curInventoryItemCount, setCurInventoryItemCount] = useState(null)
  // player skill
  const [openSkillSettingModal, setOpenSkillSettingModal] = useState(false)
  const [skillSettingTarget, setSkillSettingTarget] = useState(null)

  //// redux state
  const { user } = useSelector((state) => state.user)
  const {
    initTasks,
    traders,
    tasks,
    tasksDetail,
    tasksDetailFetched,
    traderLevels,
  } = useSelector((state) => state.trader)
  const { hideout } = useSelector((state) => state.hideout)
  const {
    initSetup,
    loadingInitSetup,
    playerLevel,
    playerFaction,
    gameEdition,
    playerTasksInfo,
    unlockedTraders,
    traderProgress,
    playerCompletedObjectives,
    playerObjectiveProgress,
    playerHideoutLevel,
    playerInventory,
    playerSkill,
  } = useSelector((state) => state.character)
  const {
    items,
    page: statePage,
    pages: statePages,
  } = useSelector((state) => state.fleamarket)
  const dispatch = useDispatch()

  // redux debug
  const charState = useSelector((state) => state.character)

  //// hooks effects
  /// initialization type effects
  // get character data for the first time
  useEffect(() => {
    if (!initSetup) {
      dispatch(getCharacterData())
    }
  })

  // initialize player task data
  useEffect(() => {
    if (!initTasks) {
      dispatch(initializeTasks())
    }
  }, [initTasks])

  // initialize task list, get all traders' tasks
  useEffect(() => {
    if (traders.length !== 0 && Object.keys(tasks).length !== traders.length) {
      for (let i = 0; i < traders.length; i++) {
        if (!tasks.hasOwnProperty(traders[i].name)) {
          dispatch(
            getTasksOfTrader({
              trader: traders[i].name,
            })
          )
        } else {
          continue
        }
      }
    }
  }, [traders, tasks])

  // get player hideout station level
  useEffect(() => {
    if (initSetup && !playerHideoutLevel) {
      dispatch(getHideoutLevel())
    }
  }, [initSetup, playerHideoutLevel])

  // get player task completed objectives
  useEffect(() => {
    if (initSetup && !playerCompletedObjectives) {
      dispatch(getCompletedObjectives())
    }
  }, [initSetup, playerCompletedObjectives])

  // get player task objectives progress
  useEffect(() => {
    if (initSetup && !playerObjectiveProgress) {
      dispatch(getObjectiveProgress())
    }
  }, [initSetup, playerObjectiveProgress])

  // get all hideout station
  useEffect(() => {
    if (!hideout) {
      dispatch(getAllHideout())
    }
  }, [hideout])

  // get trader level stage data before getting player's trader progress data
  useEffect(() => {
    if (!traderLevels) {
      traders.forEach((trader) => {
        dispatch(getLevelReqOfTrader({ trader: trader.name }))
      })
    }
  }, [traderLevels])

  // get player trader progress
  useEffect(() => {
    if (
      initSetup &&
      traderLevels &&
      Object.keys(traderLevels).length === traders.length &&
      !traderProgress
    ) {
      dispatch(getTraderProgress())
    }
  }, [initSetup, traderLevels, traderProgress])

  // get player unlocked traders
  useEffect(() => {
    if (initSetup && !unlockedTraders) {
      dispatch(getUnlockedTrader())
    }
  }, [initSetup, unlockedTraders])

  // get player skill progress
  useEffect(() => {
    if (initSetup && !playerSkill) {
      dispatch(getSkillProgress())
    }
  }, [initSetup, playerSkill])

  // initialize length of task showing inside each trader's table
  useEffect(() => {
    if (Object.keys(playerTasksInfo).length === traders.length) {
      const newShowingTaskLen = {}
      const newTaskTotalLen = {}
      traders.forEach((trader) => {
        newShowingTaskLen[trader.name] =
          (showCompleteTask && playerTasksInfo[trader.name].complete.length) +
          (showOngoingTask && playerTasksInfo[trader.name].ongoing.length) +
          (showNotQualifyTask && playerTasksInfo[trader.name].notQualify.length)
        newTaskTotalLen[trader.name] =
          playerTasksInfo[trader.name].complete.length +
          playerTasksInfo[trader.name].ongoing.length +
          playerTasksInfo[trader.name].notQualify.length
      })
      setCurShowingTaskLen(newShowingTaskLen)
      setTaskTotalLen(newTaskTotalLen)
    }
  }, [playerTasksInfo, showCompleteTask, showOngoingTask, showNotQualifyTask])

  /// on data change need some update
  // pick level icon for player's level on level change
  useEffect(() => {
    if (initSetup) {
      for (let i = 1; i <= 16; i++) {
        if (playerLevel >= 5 * i) {
          continue
        } else {
          setLevelIcon(`/asset/rank${5 * i}.png`)
          break
        }
      }
    }
  }, [initSetup, playerLevel])

  // sort traders' tasks into completed/ongoing/not yet available
  useEffect(() => {
    if (
      initSetup &&
      traderProgress &&
      unlockedTraders &&
      Object.keys(traderProgress.traderLL).length === traders.length &&
      Object.keys(tasks).length === traders.length &&
      haveZeroPropertyEqualTo(tasks, null) &&
      !taskInitialized
    ) {
      traders.forEach((trader) => {
        dispatch(
          getTasksOfTraderWithLevel({
            trader: trader.name,
            level: playerLevel,
          })
        )
      })
      setTaskInitialized(true)
    }
  }, [initSetup, traders, tasks, unlockedTraders, traderProgress])

  // get hideout data of current selected station ID
  useEffect(() => {
    if (hideout && hideout.length > 0) {
      const index = getIndexOfMatchFieldObjArr(hideout, "id", currentStationId)
      setCurrentStation(hideout[index])
    }
  }, [hideout, currentStationId])

  // set currently selected station's construct detail and craft detail
  useEffect(() => {
    if (playerHideoutLevel) {
      const index = getIndexOfMatchFieldObjArr(
        playerHideoutLevel,
        "hideoutId",
        currentStationId
      )
      setLevelInfoOfCurrentStation(playerHideoutLevel[index])
    }
  }, [currentStationId, playerHideoutLevel])

  // on search params change
  useEffect(() => {
    if (
      searchParams.get("handbook") ||
      searchParams.get("keyword") ||
      searchParams.get("page")
    ) {
      dispatch(
        searchItemByName({
          handbook: searchParams.get("handbook")
            ? searchParams.get("handbook")
            : undefined,
          keyword: searchParams.get("keyword")
            ? searchParams.get("keyword")
            : undefined,
          page: searchParams.get("page") ? searchParams.get("page") : undefined,
          limit: 10,
        })
      )
    }
    if (
      !searchParams.get("handbook") &&
      !searchParams.get("keyword") &&
      !searchParams.get("page")
    ) {
      dispatch(clearItems())
    }
  }, [searchParams])

  // on task complete flag is set
  useEffect(() => {
    if (taskNeedToUpdateStatus) {
      const updateTaskStatus = async () => {
        const { traderName, task, rewards } = taskNeedToUpdateStatus
        const newCompleteTasks = []
        playerTasksInfo[traderName]["complete"].forEach((task) => {
          newCompleteTasks.push(task.id)
        })
        newCompleteTasks.push(task.id)
        if (rewards) {
          //TODO
          // items
          const itemRewards = []
          rewards.items.forEach((item) => {
            itemRewards.push({
              itemId: item.item.id,
              itemName: item.item.name,
              bgColor: item.item.backgroundColor,
              count: item.count,
            })
          })
          await dispatch(
            updateInventoryItem({
              items: itemRewards,
            })
          )
          // traderStanding
          for (const trader of rewards.traderStanding) {
            await dispatch(
              updateTraderProgress({
                traderName: trader.trader.name,
                traderRep:
                  traderProgress.traderRep[trader.trader.name] +
                  trader.standing,
                traderSpent: traderProgress.traderSpent[trader.trader.name],
              })
            )
          }
          // traderUnlock
          for (const trader of rewards.traderUnlock) {
            await dispatch(
              updateUnlockedTrader({
                name: trader.name,
                unlocked: true,
              })
            )
          }
          // offerUnlock
          /// trader.name, level, item.id, item.name
          // skillLevelReward
          /// name, level
        }
        await dispatch(
          updateCompletedTasks({ completeTasks: newCompleteTasks })
        )
        // re-sort tasks of this trader
        dispatch(
          getTasksOfTraderWithLevel({
            trader: traderName,
            level: playerLevel,
          })
        )
        // re-sort tasks of other traders which require this task to be completed
        const needThisTaskTraders = []
        console.log(task)
        task.needForTasks.forEach((need) => {
          needThisTaskTraders.push(need.task.trader.name)
        })
        const uniqueNeedThisTaskTraders = [...new Set(needThisTaskTraders)]
        uniqueNeedThisTaskTraders.forEach((trader) => {
          if (trader !== traderName) {
            dispatch(
              getTasksOfTraderWithLevel({
                trader: trader,
                level: playerLevel,
              })
            )
          }
        })
        expandTaskDetailHandle(traderName, task.id)
      }

      updateTaskStatus()
      setTaskNeedToUpdateStatus(null)
    }
  }, [taskNeedToUpdateStatus])

  //// handles
  const expandTaskDetailHandle = (trader, taskId) => {
    if (!tasksDetailFetched[trader].includes(taskId)) {
      dispatch(getTaskDetail({ id: taskId, traderName: trader }))
    }
    const newCollapse = { ...collapseDetail }
    newCollapse[taskId] = !newCollapse[taskId]
    setCollapseDetail(newCollapse)
  }

  const updateObjectiveStatusHandle = (
    taskId,
    objectiveId,
    progress,
    completed = false
  ) => {
    if (completed) {
      const newCompleteObjectives = JSON.parse(
        JSON.stringify(playerCompletedObjectives)
      )
      const index = getIndexOfMatchFieldObjArr(
        newCompleteObjectives,
        "taskId",
        taskId
      )
      if (index !== -1) {
        newCompleteObjectives[index]["objectives"].push(objectiveId)
      } else {
        newCompleteObjectives.push({ taskId, objectives: [objectiveId] })
      }
      dispatch(
        updateCompletedObjectives({
          completeObjectives: newCompleteObjectives,
        })
      )
    }
    if (progress) {
      const newProgress = JSON.parse(JSON.stringify(playerObjectiveProgress))
      const index = getIndexOfMatchFieldObjArr(
        newProgress,
        "objectiveId",
        objectiveId
      )
      if (index !== -1) {
        newProgress[index]["progress"] = Number(progress)
      } else {
        newProgress.push({ objectiveId, progress })
      }
      dispatch(
        updateObjectiveProgress({
          objectiveProgress: newProgress,
        })
      )
    }
  }

  const completeTaskHandle = (traderName, task, rewards = null) => {
    setTaskNeedToUpdateStatus({ traderName, task, rewards })
  }

  const adjustPlayerLevelHandle = (level) => {
    dispatch(updateCharacterData({ characterLevel: level }))
    traders.forEach((trader) => {
      dispatch(
        getTasksOfTraderWithLevel({
          trader: trader.name,
          level: level,
        })
      )
    })
  }

  const openCloseLevelModalHandle = () => {
    setOpenPlayerLevelModal(!openPlayerLevelModal)
  }

  const openCloseTraderSettingModalHandle = () => {
    setOpenTraderSettingModal(!openTraderSettingModal)
  }

  const increaseStationLevelHandle = (hideoutId, levelIndex) => {
    const newHideoutLevel = JSON.parse(JSON.stringify(playerHideoutLevel))
    const index = getIndexOfMatchFieldObjArr(
      newHideoutLevel,
      "hideoutId",
      hideoutId
    )
    newHideoutLevel[index].level = levelIndex
    dispatch(updateHideoutLevel({ hideoutLevel: newHideoutLevel }))
  }

  const openCloseConfirmModalHandle = () => {
    setOpenHideoutModal(!openHideoutModal)
  }

  const openCloseItemModalHandle = () => {
    setOpenItemModal(!openItemModal)
  }

  const addItemToInventoryHandle = (item, count) => {
    dispatch(
      updateInventoryItem({
        items: [
          {
            itemId: item.id,
            itemName: item.name,
            bgColor: item.backgroundColor,
            count: count,
          },
        ],
      })
    )
  }

  const openCloseSkillSettingModalHandle = () => {
    setOpenSkillSettingModal(!openSkillSettingModal)
  }

  const modifySkillLevelHandle = (skillName, level) => {
    dispatch(updateSkillProgress({ skillName, level }))
  }

  const removeHideoutUpgradeCostItems = (itemRequirements) => {
    const items = []
    itemRequirements.forEach((itemReq) => {
      playerInventory.some((item) => {
        if (item.itemId === itemReq.item.id) {
          const newItem = {
            itemId: item.itemId,
            itemName: item.itemName,
            bgColor: item.bgColor,
            count: item.count - itemReq.count,
          }
          items.push(newItem)
          return true
        }
      })
    })
    dispatch(updateInventoryItem({ items }))
  }

  return (
    <>
      <EditValueModal
        title="Player level"
        show={openPlayerLevelModal}
        value={playerLevel}
        maxValue={79}
        setValueHandle={(v) => {
          adjustPlayerLevelHandle(v)
          openCloseLevelModalHandle()
        }}
        closeHandle={openCloseLevelModalHandle}
      />
      <TraderRelationModal
        show={openTraderSettingModal}
        traderName={traderSettingTarget}
        setValueHandle={(v) => {
          openCloseTraderSettingModalHandle
        }}
        closeHandle={openCloseTraderSettingModalHandle}
      />
      <ConfirmModal
        show={openHideoutModal}
        title={hideoutModalTitle}
        content={confirmModalContent}
        confirmHandle={confirmFunc}
        closeHandle={openCloseConfirmModalHandle}
      />
      <EditValueModal
        title={curInventoryItem && curInventoryItem.name}
        show={openItemModal}
        value={curInventoryItemCount && curInventoryItemCount}
        setValueHandle={(v) => {
          addItemToInventoryHandle(curInventoryItem, v)
          openCloseItemModalHandle()
        }}
        closeHandle={openCloseItemModalHandle}
      />
      <EditValueModal
        title={skillSettingTarget && skillSettingTarget.skillName}
        show={openSkillSettingModal}
        value={skillSettingTarget && skillSettingTarget.level}
        maxValue={51}
        setValueHandle={(v) => {
          modifySkillLevelHandle(skillSettingTarget.skillName, v)
          openCloseSkillSettingModalHandle()
        }}
        closeHandle={openCloseSkillSettingModalHandle}
      />
      {Object.keys(user).length === 0 && <LoginFirst />}
      {Object.keys(user).length > 0 && !initSetup && !loadingInitSetup && (
        <PlayerDataSetup />
      )}
      {Object.keys(user).length > 0 && initSetup && (
        <Container>
          <Row className="my-5 gx-5 align-items-start">
            <Col lg={3} className="p-0 gray-rounded-40">
              <Row
                className="p-0 m-0"
                style={{
                  borderRadius: "40px 40px 0 0",
                  backgroundColor: "#292929",
                }}
              >
                <p className="my-3 text-center sandbeige">
                  {gameEdition && gameEdition}
                  {" edition"}
                </p>
              </Row>
              <Row className="my-3" align="center">
                <Col>
                  <div
                    className="sandbeige"
                    role="button"
                    style={{ fontSize: "90px" }}
                    onClick={
                      levelIcon && playerLevel
                        ? openCloseLevelModalHandle
                        : null
                    }
                  >
                    {levelIcon && playerLevel ? (
                      [
                        <Image
                          key="level_icon"
                          src={levelIcon}
                          className="d-inline me-3"
                          style={{ height: "100px" }}
                        />,
                        playerLevel,
                      ]
                    ) : (
                      <DivLoading />
                    )}
                  </div>
                </Col>
              </Row>
              <Row className="my-3" align="center">
                <Col>
                  {playerFaction ? (
                    <Image src={`/asset/icon_${playerFaction}.png`} />
                  ) : (
                    <DivLoading />
                  )}
                </Col>
              </Row>
            </Col>
            <Col lg={9}>
              <Tabs
                defaultActiveKey="task"
                className="mb-4 flex-column flex-lg-row"
                transition={false}
                justify
              >
                {/* TASK */}
                <Tab eventKey="task" title="Task">
                  <div>
                    <ToggleButton
                      type="checkbox"
                      variant="outline-primary"
                      checked={showCompleteTask}
                      value="1"
                      onClick={(e) => {
                        setShowCompleteTask(!showCompleteTask)
                      }}
                      style={{ "--bs-btn-hover-bg": "none" }}
                      className="btn-sm mx-2 mb-3"
                    >
                      Completed
                    </ToggleButton>
                    <ToggleButton
                      type="checkbox"
                      variant="outline-success"
                      checked={showOngoingTask}
                      value="1"
                      onClick={(e) => {
                        setShowOngoingTask(!showOngoingTask)
                      }}
                      style={{ "--bs-btn-hover-bg": "none" }}
                      className="btn-sm mx-2 mb-3"
                    >
                      Available
                    </ToggleButton>
                    <ToggleButton
                      type="checkbox"
                      variant="outline-dark"
                      checked={showNotQualifyTask}
                      value="1"
                      onClick={(e) => {
                        setShowNotQualifyTask(!showNotQualifyTask)
                      }}
                      style={{ "--bs-btn-hover-bg": "none" }}
                      className="btn-sm mx-2 mb-3"
                    >
                      Not unlock
                    </ToggleButton>
                  </div>
                  <Accordion
                    alwaysOpen
                    style={{
                      "--bs-accordion-bg": "black",
                      "--bs-accordion-color": "white",
                      "--bs-accordion-btn-color": "white",
                      "--bs-accordion-active-bg": "#1c1c1c",
                      "--bs-accordion-active-color": "#b7ad9c",
                    }}
                  >
                    {traders.map((trader, i) => {
                      return (
                        <Accordion.Item
                          eventKey={`${i}`}
                          key={`${trader.name}_task`}
                        >
                          <Accordion.Header>
                            <div className="d-flex align-items-center fs-4">
                              <Image
                                src={`/asset/${trader.id}.png`}
                                className="me-3"
                                style={{ height: "64px", width: "64px" }}
                              />
                              <div className="mx-3">{trader.name}</div>

                              <div
                                className="d-inline mx-3"
                                style={{ fontSize: "16px" }}
                              >
                                <span style={{ color: "white" }}>
                                  {"available: "}
                                </span>
                                <span
                                  style={{
                                    color:
                                      safeGet(playerTasksInfo, trader.name) &&
                                      playerTasksInfo[trader.name].ongoing
                                        .length > 0
                                        ? "#198754"
                                        : "#212529",
                                  }}
                                >
                                  {safeGet(playerTasksInfo, trader.name) &&
                                    playerTasksInfo[trader.name].ongoing.length}
                                </span>
                              </div>

                              <div
                                className="d-inline mx-3"
                                style={{ fontSize: "16px" }}
                              >
                                <span style={{ color: "white" }}>
                                  {"completed: "}
                                </span>
                                <span style={{ color: "#0d6efd" }}>
                                  {safeGet(playerTasksInfo, trader.name) &&
                                    playerTasksInfo[trader.name].complete
                                      .length}
                                  {"/"}
                                  {taskTotalLen && taskTotalLen[trader.name]}
                                </span>
                              </div>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body className="p-0">
                            <Table
                              variant="dark"
                              className="m-0"
                              style={{ "--bs-table-bg": "black" }}
                            >
                              <tbody>
                                {curShowingTaskLen &&
                                  curShowingTaskLen[trader.name] === 0 && (
                                    <tr>
                                      <td>
                                        <div className="p-3 fs-4 text-center">
                                          Empty
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                {Object.keys(playerTasksInfo).length > 0 &&
                                  playerTasksInfo[trader.name] &&
                                  Object.keys(playerTasksInfo[trader.name])
                                    .map((status) => {
                                      if (
                                        (status === "complete" &&
                                          showCompleteTask) ||
                                        (status === "ongoing" &&
                                          showOngoingTask) ||
                                        (status === "notQualify" &&
                                          showNotQualifyTask)
                                      ) {
                                        return playerTasksInfo[trader.name][
                                          status
                                        ].map((task) => {
                                          return [
                                            <tr
                                              key={task.id}
                                              onClick={() => {
                                                expandTaskDetailHandle(
                                                  trader.name,
                                                  task.id
                                                )
                                              }}
                                            >
                                              <td
                                                className="px-5"
                                                style={{
                                                  "--bs-table-bg":
                                                    status === "complete"
                                                      ? "#0d6efd"
                                                      : status === "ongoing"
                                                      ? "#198754"
                                                      : "#1c1c1c",
                                                }}
                                              >
                                                {task.name}
                                              </td>
                                            </tr>,
                                            <tr key={task.id + "_collapse"}>
                                              <td className="p-0">
                                                <Collapse
                                                  in={
                                                    (trader.name,
                                                    collapseDetail[task.id])
                                                  }
                                                >
                                                  <div>
                                                    <div>
                                                      {Object.keys(
                                                        tasksDetailFetched
                                                      ).length > 0 &&
                                                        !tasksDetailFetched[
                                                          trader.name
                                                        ].includes(task.id) && (
                                                          <DivLoading
                                                            height={100}
                                                          />
                                                        )}
                                                      {Object.keys(
                                                        tasksDetailFetched
                                                      ).length > 0 &&
                                                        tasksDetailFetched[
                                                          trader.name
                                                        ].includes(task.id) && (
                                                          <TaskDetail
                                                            task={
                                                              tasksDetail[
                                                                trader.name
                                                              ][task.id]
                                                            }
                                                            completeable={
                                                              status ===
                                                              "complete"
                                                                ? false
                                                                : true
                                                            }
                                                            finishClickHandles={
                                                              updateObjectiveStatusHandle
                                                            }
                                                            taskCompleteHandle={(
                                                              taskId,
                                                              rewards
                                                            ) => {
                                                              completeTaskHandle(
                                                                trader.name,
                                                                task,
                                                                rewards
                                                              )
                                                            }}
                                                            disableTurnIn={
                                                              status ===
                                                              "notQualify"
                                                            }
                                                            playerInventory={
                                                              playerInventory
                                                            }
                                                          />
                                                        )}
                                                    </div>
                                                  </div>
                                                </Collapse>
                                              </td>
                                            </tr>,
                                          ]
                                        })
                                      }
                                    })
                                    .flat(1)}
                              </tbody>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      )
                    })}
                  </Accordion>
                </Tab>

                {/* Hideout */}
                <Tab eventKey="hideout" title="Hideout">
                  <div>
                    <div className="d-flex justify-content-center flex-wrap mb-5">
                      {hideout &&
                        hideout.map((station) => {
                          return (
                            <div
                              key={station.id}
                              role="button"
                              onClick={() => {
                                setCurrentStationId(station.id)
                              }}
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

                    {!levelInfoOfCurrentStation && <DivLoading height={300} />}
                    {/* not yet construct case */}
                    {levelInfoOfCurrentStation &&
                      levelInfoOfCurrentStation.level === -1 &&
                      currentStation && (
                        <HideoutStationDetail
                          station={currentStation}
                          curLevelIndex={-1}
                          increaseLevelHandle={() => {
                            if (currentStation.levels?.[0]) {
                              setHideoutModalTitle(
                                `${currentStation.name} Level ${currentStation.levels[0].level}`
                              )
                              setConfirmModalContent(
                                "Are you sure you are going to construct?"
                              )
                              setConfirmFunc(() => () => {
                                removeHideoutUpgradeCostItems(
                                  currentStation.levels[0].itemRequirements
                                )
                                increaseStationLevelHandle(currentStation.id, 0)
                              })
                              openCloseConfirmModalHandle()
                            }
                          }}
                        />
                      )}
                    {/* constructed case */}
                    {levelInfoOfCurrentStation &&
                      levelInfoOfCurrentStation.level > -1 &&
                      currentStation && (
                        <HideoutStationDetail
                          station={currentStation}
                          curLevelIndex={levelInfoOfCurrentStation.level}
                          increaseLevelHandle={() => {
                            if (
                              currentStation.levels?.[
                                levelInfoOfCurrentStation.level + 1
                              ]
                            ) {
                              setHideoutModalTitle(
                                `${currentStation.name} Level ${
                                  currentStation.levels[
                                    levelInfoOfCurrentStation.level
                                  ].level
                                } > ${
                                  currentStation.levels[
                                    levelInfoOfCurrentStation.level + 1
                                  ].level
                                }`
                              )
                              setConfirmModalContent(
                                "Are you sure you are going to upgrade?"
                              )
                              setConfirmFunc(() => () => {
                                removeHideoutUpgradeCostItems(
                                  currentStation.levels[
                                    levelInfoOfCurrentStation.level + 1
                                  ].itemRequirements
                                )
                                increaseStationLevelHandle(
                                  currentStation.id,
                                  levelInfoOfCurrentStation.level + 1
                                )
                              })
                              openCloseConfirmModalHandle()
                            }
                          }}
                        />
                      )}
                  </div>
                </Tab>

                {/* Skill */}
                <Tab eventKey="skill" title="Skill">
                  <Row xs={2} sm={3} md={4} className="g-3">
                    {playerSkill &&
                      playerSkill.skills &&
                      playerSkill.skills.map((skill) => {
                        return (
                          <Col key={skill.skillName}>
                            <div className="d-flex justify-content-center">
                              <div
                                className="d-flex"
                                role="button"
                                onClick={() => {
                                  setSkillSettingTarget(skill)
                                  openCloseSkillSettingModalHandle()
                                }}
                              >
                                <SkillIcon
                                  skillName={skill.skillName}
                                  level={skill.level}
                                  useNameBox={true}
                                />
                              </div>
                            </div>
                          </Col>
                        )
                      })}
                  </Row>
                </Tab>

                {/* Trader LL */}
                <Tab eventKey="trader" title="Trader">
                  <Row xs={2} sm={3} md={4} className="g-3">
                    {traders.length !== 0 &&
                      traderProgress &&
                      traders.map((trader, i) => {
                        return (
                          <Col key={i}>
                            <div className="d-flex justify-content-center">
                              <div
                                className="d-flex"
                                role="button"
                                onClick={() => {
                                  setTraderSettingTarget(trader.name)
                                  openCloseTraderSettingModalHandle()
                                }}
                              >
                                <TraderCard
                                  trader={trader}
                                  standing={
                                    traderProgress &&
                                    traderProgress.traderLL[trader.name]
                                  }
                                  rep={
                                    traderProgress.traderRep &&
                                    traderProgress.traderRep[trader.name]
                                  }
                                />
                              </div>
                            </div>
                          </Col>
                        )
                      })}
                  </Row>
                </Tab>

                {/* Inventory */}
                <Tab eventKey="inventory" title="Inventory">
                  <ItemSearchBar setSearchParams={setSearchParams} />

                  {items &&
                    items.length > 0 && [
                      <h2 key="item_search_title" className="sandbeige">
                        {`Search result ${statePage}/${statePages}`}
                      </h2>,
                      <div
                        key="search_pagination"
                        className="d-flex justify-content-center"
                      >
                        {(searchParams.get("handbook") ||
                          searchParams.get("keyword") ||
                          searchParams.get("page")) && (
                          <Paginate
                            page={statePage}
                            pages={statePages}
                            keyword={searchParams.get("keyword")}
                            handbook={
                              searchParams.get("handbook")
                                ? JSON.parse(searchParams.get("handbook"))
                                : null
                            }
                            setSearchParams={setSearchParams}
                            usePrevNext={true}
                          />
                        )}
                      </div>,
                      <div
                        key="item_search_results"
                        className="mb-5"
                        style={{ color: "white" }}
                      >
                        <div>
                          {items.map((item) => {
                            return (
                              <div
                                key={item.id}
                                className="d-flex align-items-center gray-rounded-20 mb-1 px-3 py-2"
                              >
                                <div className="d-inline-block mx-3">
                                  <ItemSingleGrid
                                    itemId={item.id}
                                    bgColor={item.backgroundColor}
                                  />
                                </div>
                                <p className="mb-0 mx-3">{item.name}</p>
                                <p
                                  className="mb-0 me-4"
                                  style={{
                                    marginLeft: "auto",
                                    fontSize: "32px",
                                  }}
                                >
                                  {"x " +
                                    convertKiloMega(
                                      getAnotherFieldOfMatchFieldObjArr(
                                        playerInventory,
                                        "itemId",
                                        item.id,
                                        "count"
                                      ) ?? 0
                                    )}
                                </p>
                                <Button
                                  variant="success"
                                  className="mx-2"
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                  }}
                                  onClick={() => {
                                    setCurInventoryItem(item)
                                    setCurInventoryItemCount(
                                      getAnotherFieldOfMatchFieldObjArr(
                                        playerInventory,
                                        "itemId",
                                        item.id,
                                        "count"
                                      ) ?? 0
                                    )
                                    openCloseItemModalHandle()
                                  }}
                                >
                                  <div className="position-relative">
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                      <Pencil size={20} />
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      </div>,
                    ]}
                  <h2 className="sandbeige">Inventory</h2>
                  <div style={{ color: "white" }}>
                    {playerInventory &&
                      playerInventory.map((item) => {
                        return (
                          <div
                            key={item.itemId}
                            className="d-flex align-items-center gray-rounded-20 mb-1 px-3 py-2"
                          >
                            <div className="d-inline-block mx-3">
                              <ItemSingleGrid
                                itemId={item.itemId}
                                bgColor={item.bgColor}
                              />
                            </div>
                            <p className="mb-0 mx-3">{item.itemName}</p>
                            <p
                              className="mb-0 me-4"
                              style={{
                                marginLeft: "auto",
                                fontSize: "32px",
                              }}
                            >
                              {"x " + convertKiloMega(item.count)}
                            </p>
                            <div>
                              <Button
                                variant="success"
                                className="mx-2"
                                style={{ width: "32px", height: "32px" }}
                                onClick={() => {
                                  setCurInventoryItem({
                                    id: item.itemId,
                                    name: item.itemName,
                                  })
                                  setCurInventoryItemCount(item.count)
                                  openCloseItemModalHandle()
                                }}
                              >
                                <div className="position-relative">
                                  <div className="position-absolute top-50 start-50 translate-middle">
                                    <Pencil size={20} />
                                  </div>
                                </div>
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </Tab>

                {/* Quest item */}
                <Tab eventKey="questItem" title="Quest item">
                  {Object.keys(playerTasksInfo).length > 0 && (
                    <div>
                      <QuestItems playerTasksInfo={playerTasksInfo} />
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      )}
    </>
  )
}

export { CharacterScreen }
