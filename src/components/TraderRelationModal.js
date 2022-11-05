import React, { useEffect, useState } from "react"
import { Modal, Button, Row, Col, Form, Image } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import RangeSlider from "react-bootstrap-range-slider"
import {
  getCharacterData,
  getTraderProgress,
  updateTraderProgress,
} from "../reducers/CharacterSlice"
import { getLevelReqOfTrader } from "../reducers/TraderSlice"
import maxLoyalty from "../../public/static/images/loyalty_king.png"
import maxLoyaltyWhite from "../../public/static/images/loyalty_king_new.png"

const TraderRelationModal = ({ show, traderName, closeHandle }) => {
  const [rep, setRep] = useState(null)
  const [spent, setSpent] = useState(null)
  const [LL, setLL] = useState(null)
  const [LLprogressbar, setLLprogressbar] = useState(0)

  // redux
  const dispatch = useDispatch()
  const { initSetup, playerLevel, traderProgress } = useSelector(
    (state) => state.character
  )
  const { traderLevels } = useSelector((state) => state.trader)

  //// hooks effect
  // get player level if it is not fetch yet
  useEffect(() => {
    if (!initSetup) {
      dispatch(getCharacterData())
    }
  }, [initSetup])

  // get player's trader progress
  useEffect(() => {
    if (!traderProgress) {
      dispatch(getTraderProgress())
    }
  }, [traderProgress])

  // initialize current trader's reputation and money spent record once trader progress fetched
  useEffect(() => {
    if (traderProgress && traderName) {
      setRep(traderProgress.traderRep[traderName])
      setSpent(traderProgress.traderSpent[traderName])
    }
  }, [traderProgress, traderName])

  // get current trader loyalty level information if it's not fetch yet
  useEffect(() => {
    if (
      traderName &&
      (traderLevels === null || !(traderName in traderLevels))
    ) {
      dispatch(getLevelReqOfTrader({ trader: traderName }))
    }
  }, [traderName, traderLevels])

  // get trader loyalty level depend on updated reputation and money spent
  useEffect(() => {
    if (initSetup && traderName && traderLevels) {
      for (let i = 1; i < traderLevels[traderName].length; i++) {
        if (
          // traderLevels[traderName][i].requiredPlayerLevel <= playerLevel &&
          traderLevels[traderName][i].requiredReputation <= rep &&
          traderLevels[traderName][i].requiredCommerce <= spent * 1000000
        ) {
          setLL(i + 1)
        } else if (
          // traderLevels[traderName][i].requiredPlayerLevel > playerLevel ||
          traderLevels[traderName][i].requiredReputation > rep ||
          traderLevels[traderName][i].requiredCommerce > spent * 1000000
        ) {
          setLL(i)
          break
        }
      }
    }
  }, [initSetup, traderName, traderLevels, rep, spent])

  // update loyalty level progress bar
  useEffect(() => {
    if (LL) {
      setLLprogressbar(((LL - 1) / 3) * 100)
    }
  }, [LL])

  //// handles
  // on confirm sent behavior
  const updateTraderProgressHandle = () => {
    if (
      rep !== traderProgress.traderRep[traderName] ||
      spent !== traderProgress.traderSpent[traderName]
    ) {
      const newTraderLL = JSON.parse(JSON.stringify(traderProgress.traderLL))
      newTraderLL[traderName] = LL
      const newTraderRep = JSON.parse(JSON.stringify(traderProgress.traderRep))
      newTraderRep[traderName] = rep
      const newTraderSpent = JSON.parse(
        JSON.stringify(traderProgress.traderSpent)
      )
      newTraderSpent[traderName] = spent
      dispatch(
        updateTraderProgress({
          traderLL: newTraderLL,
          traderRep: newTraderRep,
          traderSpent: newTraderSpent,
        })
      )
    }
  }

  // loyalty level button click behavior
  const clickLLbtn = (ll) => {
    if (LL !== ll && traderLevels) {
      setRep(traderLevels[traderName][ll - 1].requiredReputation)
      setSpent(traderLevels[traderName][ll - 1].requiredCommerce / 1000000)
    }
  }

  return (
    <Modal
      show={show}
      onHide={closeHandle}
      aria-labelledby={`${traderName}`}
      centered
      backdrop="static"
      style={{ "--bs-modal-bg": "#080605" }}
    >
      <Modal.Header closeButton className="sandbeige">
        {traderName && (
          <Modal.Title id={`${traderName}`}>{traderName}</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#191919" }}>
        <div className="p-3 m-3">
          <div className="position-relative">
            <div
              className="progress"
              style={{
                height: "6px",
                transform: "translateY(-3px)",
                "--bs-progress-bg": "black",
              }}
            >
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${LLprogressbar}%`,
                  "--bs-progress-bar-bg": "#b7ad9c",
                }}
              ></div>
            </div>
            <Button
              type="button"
              className="position-absolute btn btn-sm rounded-pill"
              style={{
                width: "2rem",
                height: "2rem",
                transform: "translateX(-50%) translateY(-50%)",
                top: "0%",
                left: "0%",
                "--bs-btn-border-width": "0px",
                "--bs-btn-bg": LL >= 1 ? "#b7ad9c" : "black",
                "--bs-btn-color": LL >= 1 ? "#191919" : "#d7cdbc",
                "--bs-btn-hover-bg": "#d7cdbc",
                "--bs-btn-hover-color": "#191919",
                "--bs-btn-active-bg": "#d7cdbc",
                "--bs-btn-active-color": "#191919",
                "--bs-btn-focus-shadow-rgb": "183,173,156",
              }}
              onClick={() => {
                clickLLbtn(1)
              }}
            >
              I
            </Button>
            <Button
              type="button"
              className="position-absolute btn btn-sm rounded-pill"
              style={{
                width: "2rem",
                height: "2rem",
                transform: "translateX(-50%) translateY(-50%)",
                top: "0%",
                left: "33.3333%",
                "--bs-btn-border-width": "0px",
                "--bs-btn-bg": LL >= 2 ? "#b7ad9c" : "black",
                "--bs-btn-color": LL >= 2 ? "#191919" : "#d7cdbc",
                "--bs-btn-hover-bg": "#d7cdbc",
                "--bs-btn-hover-color": "#191919",
                "--bs-btn-active-bg": "#d7cdbc",
                "--bs-btn-active-color": "#191919",
                "--bs-btn-focus-shadow-rgb": "183,173,156",
              }}
              onClick={() => {
                clickLLbtn(2)
              }}
            >
              II
            </Button>
            <Button
              type="button"
              className="position-absolute btn btn-sm rounded-pill"
              style={{
                width: "2rem",
                height: "2rem",
                transform: "translateX(-50%) translateY(-50%)",
                top: "0%",
                left: "66.6666%",
                "--bs-btn-border-width": "0px",
                "--bs-btn-bg": LL >= 3 ? "#b7ad9c" : "black",
                "--bs-btn-color": LL >= 3 ? "#191919" : "#d7cdbc",
                "--bs-btn-hover-bg": "#d7cdbc",
                "--bs-btn-hover-color": "#191919",
                "--bs-btn-active-bg": "#d7cdbc",
                "--bs-btn-active-color": "#191919",
                "--bs-btn-focus-shadow-rgb": "183,173,156",
              }}
              onClick={() => {
                clickLLbtn(3)
              }}
            >
              III
            </Button>
            <Button
              type="button"
              className="position-absolute btn btn-sm rounded-pill"
              style={{
                width: "2rem",
                height: "2rem",
                transform: "translateX(-50%) translateY(-50%)",
                top: "0%",
                left: "100%",
                "--bs-btn-border-width": "0px",
                "--bs-btn-bg": LL >= 4 ? "#b7ad9c" : "black",
                "--bs-btn-color": LL >= 4 ? "#191919" : "#d7cdbc",
                "--bs-btn-hover-bg": "#d7cdbc",
                "--bs-btn-hover-color": "#191919",
                "--bs-btn-active-bg": "#d7cdbc",
                "--bs-btn-active-color": "#191919",
                "--bs-btn-focus-shadow-rgb": "183,173,156",
                backgroundImage: `url(${
                  LL >= 4 ? maxLoyalty : maxLoyaltyWhite
                })`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              onClick={() => {
                clickLLbtn(4)
              }}
            ></Button>
          </div>
        </div>
        <Form>
          <Form.Group as={Row} className="align-items-end">
            <Col xs="10">
              <Form.Label>Reputation</Form.Label>
              <RangeSlider
                min={0}
                max={1}
                step={0.01}
                variant="secondary"
                tooltipPlacement="top"
                value={rep === null ? 0 : rep}
                onChange={(e) => setRep(Number(e.target.value))}
              />
            </Col>
            <Col xs="2">
              <Form.Control
                value={rep === null ? 0 : rep}
                onChange={(e) => setRep(Number(e.target.value))}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="align-items-end">
            <Col xs="10">
              <Form.Label>Money spent (million)</Form.Label>
              <RangeSlider
                min={0}
                max={10}
                step={0.01}
                variant="secondary"
                tooltipPlacement="top"
                tooltipLabel={(currentValue) => `${currentValue}M`}
                value={spent === null ? 0 : spent}
                onChange={(e) => setSpent(Number(e.target.value))}
              />
            </Col>
            <Col xs="2">
              <Form.Control
                value={spent === null ? 0 : spent}
                onChange={(e) => setSpent(Number(e.target.value))}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            updateTraderProgressHandle()
            closeHandle()
          }}
          variant="primary"
        >
          Confirm
        </Button>
        <Button onClick={closeHandle} variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { TraderRelationModal }
