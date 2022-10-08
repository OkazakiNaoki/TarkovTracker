import React, { useState, useEffect } from "react"
import { Container, Tabs, TabPane, Placeholder } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { HideoutIcon } from "../components/HideoutIcon"
import { TarkovSpinner } from "../components/TarkovSpinner"
import { getAllHideout } from "../reducers/HideoutSlice"

const HideoutScreen = () => {
  // redux
  const { hideout, isLoading } = useSelector((state) => state.hideout)
  const dispatch = useDispatch()

  // hooks
  const [curStation, setCurStation] = useState("5d388e97081959000a123acf")

  useEffect(() => {
    if (hideout.length === 0) {
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
            hideout.map((el) => {
              return (
                <a
                  key={el.id}
                  onClick={() => {
                    setCurStation(el.id)
                  }}
                >
                  <HideoutIcon iconName={el.id} />
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
          {hideout.length !== 0 &&
            hideout.map((el, i) => {
              return (
                <TabPane eventKey={el.id} key={el.name}>
                  <h1 className="sandbeige">{el.name}</h1>
                  {el.levels.map((level, i) => {
                    return (
                      <div
                        key={el.name + level.level}
                        className="my-3 p-2"
                        style={{ border: "1px solid white" }}
                      >
                        <h2 className="text-center">
                          {"Level " + level.level}
                        </h2>
                        <p className="text-center pb-4">{level.description}</p>
                        <p className="text-center fs-3">
                          CONSTRUCTION REQUIREMENTS
                        </p>
                        <div className="d-flex justify-content-center mb-5">
                          {level.itemRequirements.map((itemReq) => {
                            return (
                              itemReq.item.name + "  x" + itemReq.count + "\n"
                            )
                          })}
                          {level.skillRequirements.map((skillReq) => {
                            return (
                              skillReq.name + " level " + skillReq.level + "\n"
                            )
                          })}
                          {level.stationLevelRequirements.map((stationReq) => {
                            return (
                              stationReq.station.name +
                              " level " +
                              stationReq.level +
                              "\n"
                            )
                          })}
                          {level.traderRequirements.map((traderReq) => {
                            return (
                              traderReq.trader.name +
                              " level " +
                              traderReq.level +
                              "\n"
                            )
                          })}
                        </div>
                        {level.crafts.length > 0 && (
                          <p className="text-center fs-3">PRODUCTION</p>
                        )}
                        <div>
                          {level.crafts.map((c, i) => {
                            return (
                              <div
                                key={el.name + c.level + "craft-" + i}
                                className="text-center"
                              >
                                {c.duration}
                                {c.requiredItems.map((itemReq, i) => {
                                  return (
                                    <div key={"itemReq-" + i}>
                                      {itemReq.item.name +
                                        "  x" +
                                        itemReq.count +
                                        "\n"}
                                    </div>
                                  )
                                })}
                                {c.rewardItems.map((itemRew) => {
                                  return (
                                    <div key={"itemRew-" + i}>
                                      {itemRew.item.name +
                                        "  x" +
                                        itemRew.count +
                                        "\n"}
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
