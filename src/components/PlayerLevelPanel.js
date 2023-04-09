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
          "player-level-panel",
          { "player-level-panel-res-adj": !hide },
          { "player-level-panel-hide": hide }
        )}
      >
        <div
          ref={contentRef}
          className="player-level-panel-res-adj"
          style={
            fixedContentWidth
              ? { width: `${latestContentWidth.current}px` }
              : {
                  width: "auto",
                }
          }
        >
          <Row>
            <div>
              {gameEdition === "edge of darkness" && (
                <Image src={uniqueIdCrown} />
              )}
              <p
                className={classNames(
                  { orange1: gameEdition === "edge of darkness" },
                  { sand1: gameEdition !== "edge of darkness" }
                )}
              >
                {gameEdition && `${gameEdition} edition`}
              </p>
            </div>
          </Row>
          <Row>
            <Col>
              <div
                role="button"
                onClick={
                  levelIcon && playerLevel ? openCloseLevelModalHandle : null
                }
              >
                {levelIcon && playerLevel ? (
                  [
                    <Image
                      key="level_icon"
                      src={levelIcon}
                      className="player-level-icon"
                    />,
                    playerLevel,
                  ]
                ) : (
                  <DivLoading />
                )}
              </div>
            </Col>
          </Row>
          <Row>
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
