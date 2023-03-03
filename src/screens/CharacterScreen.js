import React, { useEffect, useState } from "react"
import { Button, Col, Container, Image, Row, Tabs, Tab } from "react-bootstrap"
import { Pencil } from "react-bootstrap-icons"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { LoginFirst } from "../components/LoginFirst"
import {
  getTasksOfTraderWithLevel,
  getCompletedObjectives,
  getObjectiveProgress,
  getCharacterData,
  updateCharacterData,
  getHideoutLevel,
  updateHideoutLevel,
  getTraderProgress,
  updateInventoryItem,
  getSkillProgress,
  updateSkillProgress,
  getUnlockedTrader,
} from "../reducers/CharacterSlice"
import { getLevelReqOfTrader, getTasksOfTrader } from "../reducers/TraderSlice"
import { getAllHideout } from "../reducers/HideoutSlice"
import { clearItems, searchItemByName } from "../reducers/FleamarketSlice"
import { PlayerDataSetup } from "../components/PlayerDataSetup"
import { EditValueModal } from "../components/EditValueModal"
import {
  getArrObjFieldBWhereFieldAEqualTo,
  getIndexOfObjArrWhereFieldEqualTo,
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
import { HideoutReqItems } from "../components/HideoutReqItems"
import { PlayerTaskProgress } from "../components/PlayerTaskProgress"
import leftArrow from "../../server/public/static/images/left_arrow.png"
import rightArrow from "../../server/public/static/images/icon_right_bracket.png"
import uniqueIdCrown from "../../server/public/static/images/icon_unique_id.png"

const CharacterScreen = () => {
  // router
  const [searchParams, setSearchParams] = useSearchParams({})

  //// hooks state
  // player basic data
  const [hideLevelPanel, setHideLevelPanel] = useState(false)
  const [levelIcon, setLevelIcon] = useState("/asset/rank5.png")
  const [openPlayerLevelModal, setOpenPlayerLevelModal] = useState(false)
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
  const { traders, tasks, traderLevels } = useSelector((state) => state.trader)
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

  //// effect
  /// in-game data
  // get player's character data
  useEffect(() => {
    if (Object.keys(user).length > 0 && !initSetup) {
      dispatch(getCharacterData())
    }
  }, [user])

  // get tasks of all traders
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

  // get all hideout station
  useEffect(() => {
    if (!hideout) {
      dispatch(getAllHideout())
    }
  }, [hideout])

  // get trader loyalty level stage data
  useEffect(() => {
    if (!traderLevels) {
      traders.forEach((trader) => {
        dispatch(getLevelReqOfTrader({ trader: trader.name }))
      })
    }
  }, [traderLevels])

  /// player data
  // get player's hideout station level
  useEffect(() => {
    if (initSetup && !playerHideoutLevel) {
      dispatch(getHideoutLevel())
    }
  }, [initSetup, playerHideoutLevel])

  // get player's completed objectives of task
  useEffect(() => {
    if (initSetup && !playerCompletedObjectives) {
      dispatch(getCompletedObjectives())
    }
  }, [initSetup, playerCompletedObjectives])

  // get player's objective progress of task
  useEffect(() => {
    if (initSetup && !playerObjectiveProgress) {
      dispatch(getObjectiveProgress())
    }
  }, [initSetup, playerObjectiveProgress])

  // get player's trader progress
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

  // get player's unlocked traders
  useEffect(() => {
    if (initSetup && !unlockedTraders) {
      dispatch(getUnlockedTrader())
    }
  }, [initSetup, unlockedTraders])

  // get player's skill progress
  useEffect(() => {
    if (initSetup && !playerSkill) {
      dispatch(getSkillProgress())
    }
  }, [initSetup, playerSkill])

  /// on data change need some update
  // update level icon on player's level changed
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

  // get hideout data of current selected station ID
  useEffect(() => {
    if (hideout && hideout.length > 0) {
      const index = getIndexOfObjArrWhereFieldEqualTo(
        hideout,
        "id",
        currentStationId
      )
      setCurrentStation(hideout[index])
    }
  }, [hideout, currentStationId])

  // set currently selected station's construct detail and craft detail
  useEffect(() => {
    if (playerHideoutLevel) {
      const index = getIndexOfObjArrWhereFieldEqualTo(
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

  //// handles
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
    const index = getIndexOfObjArrWhereFieldEqualTo(
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
            item: {
              id: item.id,
              name: item.name,
              backgroundColor: item.backgroundColor,
            },
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

  const hideShowCharacterLevelHandle = () => {
    setHideLevelPanel(!hideLevelPanel)
  }

  return (
    <>
      <div
        className="hide-level-sticky-btn"
        role="button"
        onClick={hideShowCharacterLevelHandle}
      >
        <Image src={hideLevelPanel ? rightArrow : leftArrow} />
      </div>
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
            {/* level panel part */}
            {!hideLevelPanel && (
              <Col lg={3} className="p-0 gray-rounded-40">
                <Row
                  className="p-0 m-0"
                  style={{
                    borderRadius: "40px 40px 0 0",
                    backgroundColor: "#292929",
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center">
                    {gameEdition === "edge of darkness" && (
                      <Image
                        src={uniqueIdCrown}
                        className="me-2"
                        style={{ width: "19px", height: "17px" }}
                      />
                    )}
                    <p
                      className={`my-3 text-center ${
                        gameEdition === "edge of darkness"
                          ? "eod-edition"
                          : "sandbeige"
                      }`}
                    >
                      {gameEdition && gameEdition}
                      {" edition"}
                    </p>
                  </div>
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
            )}
            {/* tab part */}
            <Col
              lg={hideLevelPanel ? 12 : 9}
              className={hideLevelPanel ? "px-5" : null}
            >
              <Tabs
                defaultActiveKey="task"
                className="mb-4 flex-column flex-lg-row"
                transition={false}
                justify
              >
                {/* TASK */}
                <Tab eventKey="task" title="Task">
                  <PlayerTaskProgress
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
                                      getArrObjFieldBWhereFieldAEqualTo(
                                        playerInventory,
                                        "item.id",
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
                                      getArrObjFieldBWhereFieldAEqualTo(
                                        playerInventory,
                                        "item.id",
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
                            key={item.item.id}
                            className="d-flex align-items-center gray-rounded-20 mb-1 px-3 py-2"
                          >
                            <div className="d-inline-block mx-3">
                              <ItemSingleGrid
                                itemId={item.item.id}
                                bgColor={item.item.backgroundColor}
                              />
                            </div>
                            <p className="mb-0 mx-3">{item.item.name}</p>
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
                                    id: item.item.id,
                                    name: item.item.name,
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
                      {Object.keys(playerTasksInfo).length ===
                        traders.length && (
                        <QuestItems playerTasksInfo={playerTasksInfo} />
                      )}
                    </div>
                  )}
                </Tab>

                {/* Hideout item */}
                <Tab eventKey="hideoutItem" title="Hideout item">
                  {Object.keys(playerTasksInfo).length > 0 && (
                    <div>
                      {Object.keys(playerTasksInfo).length ===
                        traders.length && <HideoutReqItems />}
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
