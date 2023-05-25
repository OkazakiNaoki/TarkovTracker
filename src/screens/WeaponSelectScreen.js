import React, { useEffect } from "react"
import { Container, Tabs, Tab, Row, Col, Image, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { DivLoading } from "../components/DivLoading"
import { PresetSlotButton } from "../components/PresetSlotButton"
import { getPreset } from "../reducers/CustomizationSlice"
import { getWeaponList } from "../reducers/ItemSlice"

const WeaponSelectScreen = () => {
  // router
  const navigate = useNavigate()

  //// redux
  const dispatch = useDispatch()
  const { weaponList } = useSelector((state) => state.item)
  const { user } = useSelector((state) => state.user)
  const { presets } = useSelector((state) => state.customization)

  //// effect
  useEffect(() => {
    if (!weaponList) {
      dispatch(getWeaponList())
    }
  }, [weaponList])

  useEffect(() => {
    if (Object.keys(user).length > 0 && !presets) {
      dispatch(getPreset())
    }
  }, [user, presets])

  return (
    <Container className="my-5">
      <h2 className="sand1 mb-5">Your presets</h2>
      <div className="d-flex mb-5">
        {presets &&
          presets.map((preset, i) => {
            return (
              <div className="mx-2" key={`preset_btn_${i}`}>
                <PresetSlotButton index={i} name={preset.presetName} />
              </div>
            )
          })}
        {Object.keys(user).length === 0 && (
          <div>Please login first to see your presets.</div>
        )}
      </div>
      <h2 className="sand1 mb-5">Weapons</h2>
      {weaponList && (
        <Tabs className="mb-4 flex-column flex-lg-row tarkov-tabs" fill>
          {Object.keys(weaponList).map((handbook) => {
            return (
              <Tab key={handbook} eventKey={handbook} title={handbook}>
                <Row xs={1} md={3} lg={6} className="gx-3 gy-5 my-5">
                  {weaponList[handbook].map((weapon) => {
                    return (
                      <Col
                        key={weapon.id}
                        className="d-flex align-items-stretch"
                      >
                        <div
                          className="p-2 d-flex w-100"
                          style={{ flexDirection: "column" }}
                        >
                          <div className="d-flex justify-content-center mb-2">
                            <Link
                              to={`/build/${weapon.id}`}
                              className="text-deco-line-none"
                              style={{ color: "none" }}
                            >
                              <Image
                                className="mw-100 mh-100 object-fit-contain"
                                src={`/asset/${weapon.default}-icon.png`}
                              />
                            </Link>
                          </div>
                          <div
                            className="text-center"
                            style={{ marginTop: "auto" }}
                          >
                            {weapon.name}
                          </div>
                        </div>
                      </Col>
                    )
                  })}
                </Row>
              </Tab>
            )
          })}
        </Tabs>
      )}
      {!weaponList && <DivLoading height={300} />}
    </Container>
  )
}

export { WeaponSelectScreen }
