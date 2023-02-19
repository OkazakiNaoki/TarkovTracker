import React, { useState, useEffect } from "react"
import { Container, Tabs, TabPane, Placeholder } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { ConstructRequirements } from "../components/ConstructRequirements"
import { CraftTimeRequirement } from "../components/CraftTimeRequirement"
import { HideoutIcon } from "../components/HideoutIcon"
import { ItemRequirement } from "../components/ItemRequirement"
import { TarkovSpinner } from "../components/TarkovSpinner"
import { TextStroke } from "../components/TextStroke"
import { formatInHoursMINsec, getHMSfromS } from "../helpers/TimeFormat"
import { getAllHideout } from "../reducers/HideoutSlice"

const HideoutScreen = () => {
  // redux
  const { hideout, isLoading } = useSelector((state) => state.hideout)
  const dispatch = useDispatch()

  // hooks
  const [curStation, setCurStation] = useState("5d388e97081959000a123acf")

  useEffect(() => {
    if (!hideout) {
      dispatch(getAllHideout())
    }
  }, [hideout])

  return (
    <>
      <Container className="py-5">
        <div className="d-flex flex-wrap mb-5">
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ width: "100%", height: "200px" }}
            >
              <TarkovSpinner />
            </div>
          ) : (
            hideout &&
            hideout.map((station) => {
              return (
                <a
                  key={station.id}
                  onClick={() => {
                    setCurStation(station.id)
                  }}
                >
                  <HideoutIcon
                    asButton={true}
                    iconName={station.id}
                    stationName={station.name}
                    selected={curStation === station.id}
                    useNameBox={true}
                  />
                </a>
              )
            })
          )}
        </div>
        <Tabs activeKey={curStation}>
          {isLoading && (
            <TabPane eventKey={curStation}>
              <h1 className="sandbeige">
                <Placeholder animation="wave">
                  <Placeholder xs={4} size="lg" />
                </Placeholder>
              </h1>
              <div className="my-3 p-2" style={{ border: "1px solid white" }}>
                <h2 className="text-center">
                  Level{" "}
                  <Placeholder animation="wave">
                    <Placeholder xs={1} size="lg" />
                  </Placeholder>
                </h2>
                <p className="text-center pb-4">
                  <Placeholder animation="wave">
                    <Placeholder xs={12} size="lg" />
                  </Placeholder>
                </p>
                <p className="text-center fs-3">CONSTRUCTION REQUIREMENTS</p>
                <div className="text-center mb-5 w-100">
                  <Placeholder animation="wave">
                    <Placeholder xs={4} size="lg" />
                  </Placeholder>
                </div>
                <p className="text-center fs-3">PRODUCTION</p>
                <div className="text-center  w-100">
                  <Placeholder animation="wave">
                    <Placeholder xs={4} size="lg" />
                  </Placeholder>
                </div>
              </div>
            </TabPane>
          )}
          {hideout &&
            hideout.map((el, i) => {
              return (
                <TabPane eventKey={el.id} key={el.name}>
                  <h1 className="sandbeige">{el.name}</h1>
                  {el.levels.map((level, i) => {
                    return (
                      <div
                        key={el.name + level.level}
                        className="my-3"
                        style={{ border: "1px solid white" }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center py-1"
                          style={{ backgroundColor: "#191919" }}
                        >
                          <TextStroke
                            fontSize={40}
                            strokeWidth={6}
                            content={"Level " + level.level}
                            color="#edebd6"
                          />
                        </div>
                        <div
                          className="d-flex justify-content-center mx-3 mt-3 mb-5"
                          style={{
                            fontFamily: "TarkovItalic",
                            color: "#9ea8ad",
                            lineHeight: "1.2",
                            flexWrap: "wrap",
                          }}
                        >
                          <p>{level.description}</p>
                        </div>
                        {(level.stationLevelRequirements.length > 0 ||
                          level.itemRequirements.length > 0 ||
                          level.traderRequirements.length > 0 ||
                          level.skillRequirements.length > 0) && (
                          <p
                            className="text-center fs-3 mb-0"
                            style={{ color: "#edebd6" }}
                          >
                            CONSTRUCTION REQUIREMENTS
                          </p>
                        )}
                        {/* all kind of requirement bundle */}
                        {(level.stationLevelRequirements.length > 0 ||
                          level.itemRequirements.length > 0 ||
                          level.traderRequirements.length > 0 ||
                          level.skillRequirements.length > 0) && (
                          <ConstructRequirements level={level} />
                        )}
                        {level.crafts.length > 0 && (
                          <p
                            className="text-center fs-3 mb-0"
                            style={{ color: "#edebd6" }}
                          >
                            PRODUCTION
                          </p>
                        )}
                        <div key="craft_list">
                          {level.crafts.map((craft, i) => {
                            return (
                              <div
                                key={el.name + craft.level + "craft_" + i}
                                className="d-flex justify-content-center my-3"
                              >
                                {Array.isArray(craft.requiredItems) &&
                                  craft.requiredItems.map((itemReq, i) => {
                                    return (
                                      <div
                                        key={`itemRequire_${i}`}
                                        className="px-1"
                                      >
                                        <ItemRequirement
                                          itemId={itemReq.item.id}
                                          itemName={itemReq.item.name}
                                          bgColor={itemReq.item.backgroundColor}
                                          reqAmount={itemReq.count}
                                        />
                                      </div>
                                    )
                                  })}
                                <div
                                  className="px-1"
                                  style={{ paddingTop: "5px" }}
                                >
                                  <CraftTimeRequirement
                                    timeStr={formatInHoursMINsec(
                                      getHMSfromS(craft.duration)
                                    )}
                                  />
                                </div>

                                {Array.isArray(craft.rewardItems) &&
                                  craft.rewardItems.map((itemRew) => {
                                    return (
                                      <div
                                        key={`itemReward_${i}`}
                                        className="px-1"
                                      >
                                        <ItemRequirement
                                          itemId={itemRew.item.id}
                                          itemName={itemRew.item.name}
                                          bgColor={itemRew.item.backgroundColor}
                                          reqAmount={itemRew.count}
                                        />
                                      </div>
                                    )
                                  })}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </TabPane>
              )
            })}
        </Tabs>
      </Container>
    </>
  )
}

export { HideoutScreen }
