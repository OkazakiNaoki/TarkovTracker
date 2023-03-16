import React, { useEffect, useState, useRef } from "react"
import { Col, Image, Row } from "react-bootstrap"
import { CSSTransition } from "react-transition-group"
import classNames from "classnames"
import { DivLoading } from "./DivLoading"
import uniqueIdCrown from "../../server/public/static/images/icon_unique_id.png"
import { useLayoutEffect } from "react"

const PlayerLevelPanel = ({
  hide,
  initSetup,
  gameEdition,
  playerLevel,
  playerFaction,
  openCloseLevelModalHandle,
}) => {
  // useEffect(() => {
  //   console.log("debug: player level panel rerendered")
  // })

  //// ref
  // element ref
  const colRef = useRef(null)
  const contentRef = useRef(null)
  // var ref
  const isResized = useRef(false)
  const latestContentWidth = useRef("0px")
  const enteredHide = useRef(false)

  //// state
  const [levelIcon, setLevelIcon] = useState("/asset/rank5.png")
  const [fixedContentWidth, setFixedContentWidth] = useState(true)

  //// effect
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

  // get initial content div width by getting parent Col's width
  useEffect(() => {
    latestContentWidth.current = colRef.current.getBoundingClientRect().width
  }, [])

  // observe Col, update content div width, and hide related flag
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width

        if (!hide && isResized.current) {
          // pre-calculate the transitioned Col width to know the final width
          const colElement = colRef.current
          const copyColElement = colElement.cloneNode(true)
          copyColElement.style.transition = "none"
          copyColElement.style.visibility = "hidden"
          copyColElement.style.position = "absolute"
          colElement.parentNode.style.position =
            colElement.parentNode.style.position || "relative"
          colElement.parentNode.appendChild(copyColElement)
          const finalWidth = copyColElement.offsetWidth
          copyColElement.parentNode.removeChild(copyColElement)
          latestContentWidth.current = finalWidth
          isResized.current = false
        } else if (hide && isResized.current) {
          isResized.current = false
        }

        if (hide) {
          enteredHide.current = true
        } else if (!hide && latestContentWidth.current === newWidth) {
          enteredHide.current = false
        }

        const useFixedWidth = enteredHide.current || hide
        if (useFixedWidth !== fixedContentWidth) {
          setFixedContentWidth(useFixedWidth)
        }
      }
    })

    observer.observe(colRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hide])

  // listen to window resize event
  useLayoutEffect(() => {
    const handleResize = () => {
      isResized.current = true
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <CSSTransition in={false} timeout={3000} classNames="max-width-transition">
      <Col
        ref={colRef}
        lg={3}
        className={classNames(
          "p-0",
          "gray-rounded-40",
          "overflow-hidden",
          { "transition-width": !hide },
          { "transition-w-mw": hide },
          { "max-width-0": hide },
          { "width-0": hide }
        )}
      >
        <div
          ref={contentRef}
          className="transition-width"
          style={
            fixedContentWidth
              ? { width: `${latestContentWidth.current}px` }
              : {
                  width: "auto",
                }
          }
        >
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
                className={classNames(
                  "my-3",
                  "text-center",
                  { "eod-edition": gameEdition === "edge of darkness" },
                  { sandbeige: gameEdition !== "edge of darkness" }
                )}
              >
                {gameEdition && `${gameEdition} edition`}
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
                  levelIcon && playerLevel ? openCloseLevelModalHandle : null
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
        </div>
      </Col>
    </CSSTransition>
  )
}

export { PlayerLevelPanel }
