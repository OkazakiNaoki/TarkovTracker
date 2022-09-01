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
} from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { LoginFirst } from "../components/LoginFirst"
import { TarkovButton } from "../components/TarkovButton"
import { setPlayerLevel } from "../reducers/CharacterSlice"
import { getTraders } from "../reducers/TraderSlice"
import defaultAvatar from "../../public/static/images/default_avatar.png"

const CharacterScreen = () => {
  // redux
  const { user } = useSelector((state) => state.user)
  const { traders } = useSelector((state) => state.trader)
  const { initSetup, playerLevel, faction } = useSelector(
    (state) => state.character
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (traders.length === 0) {
      dispatch(getTraders())
    }
  }, [traders])

  useEffect(() => {
    console.log(playerLevel)
  }, [playerLevel])

  const setupHandle = () => {}

  const openLevelSettingPanelHandle = () => {
    console.log("open!")
  }

  const setLevelHandle = (e) => {
    if (initSetup) {
      dispatch(setPlayerLevel(e.target.value))
    }
  }

  return (
    <>
      {Object.keys(user).length === 0 && <LoginFirst />}
      {Object.keys(user).length > 0 && (
        <Container>
          <Row className="my-5 gx-5 align-items-start">
            <Col md={3} style={{ border: "1px solid white" }}>
              <Row className="my-3" align="center">
                <Col>
                  <div
                    className="sandbeige"
                    role="button"
                    style={{ fontSize: "90px" }}
                    onClick={openLevelSettingPanelHandle}
                  >
                    <Image
                      src={`/asset/rank5.png`}
                      className="d-inline me-3"
                      style={{ height: "100px" }}
                    />
                    {playerLevel}
                  </div>
                </Col>
              </Row>
              <Row className="my-5">
                <Col>
                  {faction ? (
                    <Image
                      src={`/asset/icon-${faction}.png`}
                      className="px-5"
                    />
                  ) : (
                    <TarkovButton
                      useLink={false}
                      text="Setup character"
                      clickHandle={setupHandle}
                      fs="6"
                    />
                  )}
                </Col>
              </Row>
            </Col>
            <Col>
              <Tabs
                defaultActiveKey="task"
                className="mb-4 flex-column flex-lg-row"
                transition={false}
                justify
              >
                <Tab eventKey="task" title="Task">
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
                    {traders.length !== 0 &&
                      traders.map((el, i) => {
                        return (
                          <Accordion.Item
                            eventKey={`${i}`}
                            key={`${el.name}-task`}
                          >
                            <Accordion.Header>
                              <Image
                                src={`/asset/${el.id}.png`}
                                className="me-3"
                                style={{ height: "64px", width: "64px" }}
                              />
                              <div className="fs-4">{el.name}</div>
                            </Accordion.Header>
                            <Accordion.Body>TEST TEST</Accordion.Body>
                          </Accordion.Item>
                        )
                      })}
                  </Accordion>
                </Tab>
                <Tab eventKey="hideout" title="Hideout">
                  <div></div>
                </Tab>
                <Tab eventKey="inventory" title="Inventory">
                  <div></div>
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
