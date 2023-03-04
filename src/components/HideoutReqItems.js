import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap"
import classNames from "classnames"
import { getAllHideoutReqItem } from "../reducers/HideoutSlice"
import {
  getHideoutLevel,
  getInventoryItem,
  setItemFilterKeyword,
  setItemFilterType,
} from "../reducers/CharacterSlice"
import { getIndexOfObjArrWhereFieldEqualTo } from "../helpers/LoopThrough"
import { DivLoading } from "./DivLoading"
import { HideoutReqItem } from "./HideoutReqItem"

const radios = [
  { name: "Fullname", value: "full" },
  { name: "Shortname", value: "short" },
]

const HideoutReqItems = () => {
  //// hooks state
  const [typingItemFilterStr, setTypingItemFilterStr] = useState("")
  const [updateItemFilterType, setUpdateItemFilterType] = useState("full")
  const [showContructedHideoutItemReq, setShowContructedHideoutItemReq] =
    useState(false)
  const [hideoutItemList, setHideoutItemList] = useState(null)

  //// redux
  const { hideoutItemRequirement } = useSelector((state) => state.hideout)
  const {
    playerInventory,
    playerHideoutLevel,
    itemFilterKeyword,
    itemFilterType,
  } = useSelector((state) => state.character)
  const { preference } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  //// hooks effect
  useEffect(() => {
    if (typingItemFilterStr !== itemFilterKeyword) {
      setTypingItemFilterStr(itemFilterKeyword)
    }
  }, [itemFilterKeyword])

  useEffect(() => {
    if (updateItemFilterType !== itemFilterType) {
      setUpdateItemFilterType(itemFilterType)
    }
  }, [itemFilterType])

  useEffect(() => {
    if (updateItemFilterType !== itemFilterType) {
      dispatch(setItemFilterType(updateItemFilterType))
    }
  }, [updateItemFilterType])

  useEffect(() => {
    if (preference) {
    }
  }, [preference])

  useEffect(() => {
    if (!hideoutItemRequirement) {
      dispatch(getAllHideoutReqItem())
    }
  }, [hideoutItemRequirement])

  useEffect(() => {
    if (!playerInventory) {
      dispatch(getInventoryItem())
    }
  }, [playerInventory])

  useEffect(() => {
    if (!playerHideoutLevel) {
      dispatch(getHideoutLevel())
    }
  }, [playerHideoutLevel])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(setItemFilterKeyword(typingItemFilterStr))
    }, 1 * 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [typingItemFilterStr])

  // filter out item requirement that's for contructed/upgraded hideout station
  useEffect(() => {
    if (hideoutItemRequirement) {
      const hideoutItems = hideoutItemRequirement.map((req) => {
        let constructedStationCount = 0
        if (!showContructedHideoutItemReq) {
          req.levels.forEach((level) => {
            const index = getIndexOfObjArrWhereFieldEqualTo(
              playerHideoutLevel,
              "hideoutId",
              level.station.id
            )
            if (
              index !== -1 &&
              playerHideoutLevel[index].level + 1 >= level.level
            ) {
              constructedStationCount++
            }
          })
        }
        if (constructedStationCount !== req.levels.length) {
          return req.item.name
        }
      })
      setHideoutItemList(hideoutItems)
    }
  }, [hideoutItemRequirement, showContructedHideoutItemReq, playerHideoutLevel])

  //// handles
  const changeFilterStringHandle = (e) => {
    setTypingItemFilterStr(e.target.value)
  }

  const changeFilterTypeHandle = (value) => {
    setUpdateItemFilterType(value)
  }

  return [
    <InputGroup key="item_name_filter_method">
      {radios.map((radio, idx) => (
        <Button
          key={idx}
          id={`radio-${idx}`}
          variant={
            itemFilterType === radio.value ? "secondary" : "outline-secondary"
          }
          onClick={() => {
            changeFilterTypeHandle(radio.value)
          }}
          style={
            itemFilterType !== radio.value ? { "--bs-btn-bg": "white" } : null
          }
        >
          {radio.name}
        </Button>
      ))}
      <Form.Control
        type="text"
        placeholder="item name filter"
        className="text-center"
        value={typingItemFilterStr}
        onChange={changeFilterStringHandle}
      />
    </InputGroup>,
    <Row key="hideout_item_cols">
      {!hideoutItemRequirement && <DivLoading height={300} />}
      {hideoutItemRequirement &&
        hideoutItemRequirement.map((req) => {
          if (hideoutItemList && hideoutItemList.includes(req.item.name))
            return (
              <Col
                key={req.item.name}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                className={classNames(
                  "d-flex",
                  "justify-content-center",
                  "align-items-stretch",
                  {
                    "d-none":
                      (itemFilterType === "full" &&
                        !req.item.name
                          .toLowerCase()
                          .includes(itemFilterKeyword.toLowerCase())) ||
                      (itemFilterType === "short" &&
                        !req.item.shortName
                          .toLowerCase()
                          .includes(itemFilterKeyword.toLowerCase())),
                  }
                )}
              >
                <HideoutReqItem
                  playerInventory={playerInventory}
                  itemReq={req}
                />
              </Col>
            )
        })}
    </Row>,
  ]
}

export { HideoutReqItems }
