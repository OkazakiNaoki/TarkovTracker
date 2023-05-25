import React, { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { Col, Row } from "react-bootstrap"
import classNames from "classnames"
import { ContainableGrid } from "../ContainableGrid"
import { cloneDeep } from "lodash"

const DroppableSortingTable = ({ width, height }) => {
  //// state
  const [curGridCoord, setCurGridCoord] = useState(null)
  const [highlightRange, setHighlightRange] = useState(null)
  const [isOutOfRange, setIsOutOfRange] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [placeTargetGrid, setPlaceTargetGrid] = useState(null)
  const [storedMods, setStoredMods] = useState([])
  const [occupiedArr, setOccupiedArr] = useState(null)
  const [isPlacing, setIsPlacing] = useState(false)
  const [moveTarget, setMoveTarget] = useState(null)
  const [removeTarget, setRemoveTarget] = useState(null)

  //// redux
  const { draggingMod, draggingModIndex } = useSelector((state) => state.item)

  //// effect
  // initialize sorting table occupation status array
  useEffect(() => {
    if (!occupiedArr) {
      const newOccupiedArr = new Array(height)
        .fill(0)
        .map(() => new Array(width).fill(-1))
      setOccupiedArr(newOccupiedArr)
    }
  }, [occupiedArr])

  // update highlight range
  useEffect(() => {
    if (curGridCoord && draggingMod) {
      // calculate width range
      const { start: wStart, end: wEnd } = getHighlightRange(
        curGridCoord.x,
        draggingMod.width
      )

      // calculate height range
      const { start: hTop, end: hBottom } = getHighlightRange(
        curGridCoord.y,
        draggingMod.height
      )

      // out of range case
      let out = false
      if (wStart < 0 || hTop < 0 || wEnd >= width || hBottom >= height) {
        out = true
      }

      // blocked by other placed mod
      let avail
      if (!out) {
        avail = checkGridAvailable(
          { hTop, hBottom, wStart, wEnd },
          occupiedArr,
          [-1, ...(draggingModIndex >= 0 ? [draggingModIndex] : [])]
        )
      }

      setIsOutOfRange(out)
      setIsBlocked(!avail)
      if (
        !placeTargetGrid ||
        placeTargetGrid.x !== wStart ||
        placeTargetGrid.y !== hTop
      ) {
        setPlaceTargetGrid({ x: wStart, y: hTop })
      }

      if (
        !highlightRange ||
        highlightRange.wStart !== wStart ||
        highlightRange.wEnd !== wEnd ||
        highlightRange.hTop !== hTop ||
        highlightRange.hBottom !== hBottom
      ) {
        setHighlightRange({ wStart, wEnd, hTop, hBottom })
      }
    }
  }, [curGridCoord, draggingMod, draggingModIndex, occupiedArr, storedMods])

  // receive place flag
  useEffect(() => {
    if (occupiedArr && isPlacing) {
      tryPlaceMod(placeTargetGrid, draggingMod, occupiedArr)
      setIsPlacing(false)
    }
  }, [isPlacing, occupiedArr, placeTargetGrid, draggingMod])

  // receive move flag
  useEffect(() => {
    if (moveTarget !== null && occupiedArr) {
      tryMoveMod(
        placeTargetGrid,
        draggingMod,
        moveTarget,
        occupiedArr,
        storedMods
      )
      setMoveTarget(null)
    }
  }, [moveTarget, occupiedArr, storedMods, placeTargetGrid, draggingMod])

  // on remove target index set, remove it from stored mods array
  useEffect(() => {
    if (removeTarget !== null) {
      const newStoredMods = cloneDeep(storedMods)
      newStoredMods[removeTarget] = null
      setStoredMods(newStoredMods)
      const newOccuArr = cloneDeep(occupiedArr)
      removeFromTable(
        getModGridRange(
          {
            x: storedMods[removeTarget].x,
            y: storedMods[removeTarget].y,
          },
          storedMods[removeTarget].mod
        ),
        newOccuArr
      )
      setOccupiedArr(newOccuArr)
      setRemoveTarget(null)
    }
  }, [removeTarget, occupiedArr, storedMods])

  //// handle function
  // sorting table highlight range of an axis
  const getHighlightRange = (curCoordPos, rangeValue) => {
    const pointedIndex = Math.trunc(curCoordPos)
    const isOdd = Boolean(rangeValue % 2)

    let start, end

    if (isOdd) {
      const paddingSize = Math.trunc(rangeValue / 2)
      start = pointedIndex - paddingSize
      end = pointedIndex + paddingSize
    } else {
      const paddingSize = rangeValue / 2
      const alongLeft = curCoordPos % 1 < 0.5
      if (alongLeft) {
        start = pointedIndex - paddingSize
        end = pointedIndex + (paddingSize - 1)
      } else {
        start = pointedIndex - (paddingSize - 1)
        end = pointedIndex + paddingSize
      }
    }

    return { start, end }
  }

  // mouse leave
  const mouseLeaveHandle = () => {
    setHighlightRange(null)
    setPlaceTargetGrid(null)
    setIsBlocked(false)
    setIsOutOfRange(false)
    setCurGridCoord(null)
  }

  const tryPlaceMod = (topLeftGrid, mod, occuArr) => {
    // mod going to place at these grids
    const placeRange = getModGridRange(topLeftGrid, mod)

    // mod try to place at outside of sorting table
    if (isOutOfRange) {
      return
    }
    // check if all grids mod going to take are still available
    if (!checkGridAvailable(placeRange, occuArr, [-1])) return

    // clear all installed mod under it if there's any
    const copyMod = cloneDeep(mod)
    if (copyMod.hasOwnProperty("slots")) {
      copyMod.slots.forEach((slot) => {
        slot.installed = null
      })
    }

    // save into current mod array of sorting table
    const newStoredMods = cloneDeep(storedMods)
    newStoredMods.push({
      mod: copyMod,
      x: topLeftGrid.x,
      y: topLeftGrid.y,
    })
    setStoredMods(newStoredMods)

    // save into current mod array of sorting table
    const index = newStoredMods.length - 1
    const newOccuArr = cloneDeep(occupiedArr)
    placeIntoTable(placeRange, newOccuArr, index)
    setOccupiedArr(newOccuArr)
  }

  const tryMoveMod = (topLeftGrid, mod, modIndex, occuArr, storedMods) => {
    // previous range
    const prevRange = getModGridRange(
      { x: storedMods[modIndex].x, y: storedMods[modIndex].y },
      mod
    )
    // mod going to place at these grids
    const placeRange = getModGridRange(topLeftGrid, mod)

    // mod try to place at outside of sorting table
    if (isOutOfRange) {
      return
    }
    // check if all grids mod going to take are still available
    if (!checkGridAvailable(placeRange, occuArr, [-1, modIndex])) return

    const newOccuArr = cloneDeep(occupiedArr)
    // remove the previous occupation grids
    removeFromTable(prevRange, newOccuArr)

    // save into current mod array of sorting table
    placeIntoTable(placeRange, newOccuArr, modIndex)
    setOccupiedArr(newOccuArr)

    const newStoredMods = cloneDeep(storedMods)
    newStoredMods[modIndex].x = placeRange.wStart
    newStoredMods[modIndex].y = placeRange.hTop
    setStoredMods(newStoredMods)
  }

  // set flag for start placing a mod
  const startPlacing = () => {
    setIsPlacing(true)
  }

  // mod grid range of x & y
  const getModGridRange = (topLeftPos, mod) => {
    return {
      wStart: topLeftPos.x,
      wEnd: topLeftPos.x + mod.width - 1,
      hTop: topLeftPos.y,
      hBottom: topLeftPos.y + mod.height - 1,
    }
  }

  const checkGridAvailable = (modRange, occuArr, targetIndices) => {
    let atLeastOneNewGrid = false
    for (let i = modRange.hTop; i <= modRange.hBottom; i++) {
      for (let j = modRange.wStart; j <= modRange.wEnd; j++) {
        if (!targetIndices.includes(occuArr[i][j])) {
          return false
        } else if (occuArr[i][j] === -1) {
          atLeastOneNewGrid = true
        }
      }
    }
    return atLeastOneNewGrid
  }

  const placeIntoTable = (modRange, newOccuArr, targetIndex) => {
    for (let i = modRange.hTop; i <= modRange.hBottom; i++) {
      for (let j = modRange.wStart; j <= modRange.wEnd; j++) {
        newOccuArr[i][j] = targetIndex
      }
    }
  }

  const removeFromTable = (modRange, newOccuArr) => {
    for (let i = modRange.hTop; i <= modRange.hBottom; i++) {
      for (let j = modRange.wStart; j <= modRange.wEnd; j++) {
        newOccuArr[i][j] = -1
      }
    }
  }

  // set index of target mod that going to get removed
  const removeMod = (modIndex) => {
    setRemoveTarget(modIndex)
  }

  // set index of target mod that going to get removed
  const moveMod = (modIndex) => {
    setMoveTarget(modIndex)
  }

  // check if grid inside range of highlight
  const checkInsideHighlightRange = (highlightRange, gridPos) => {
    const colInHighlightRange =
      gridPos.x >= highlightRange.wStart && gridPos.x <= highlightRange.wEnd
    const rowInHighlightRange =
      gridPos.y >= highlightRange.hTop && gridPos.y <= highlightRange.hBottom
    return colInHighlightRange && rowInHighlightRange
  }

  return (
    <div
      className="h-100"
      style={{
        maxWidth: `${width * 64}px`,
        maxHeight: `${height * 64}px`,
      }}
    >
      <div className="d-flex">
        <div className="position-relative multi-grid-item">
          {/* item grids */}
          <Row
            sm={width}
            className={classNames("g-0")}
            onMouseLeave={mouseLeaveHandle}
          >
            {occupiedArr &&
              occupiedArr.map((colArr, i) => {
                return colArr.map((col, j) => {
                  let colIndex = j
                  let rowIndex = i
                  const shouldHighlight = highlightRange
                    ? checkInsideHighlightRange(highlightRange, {
                        x: colIndex,
                        y: rowIndex,
                      })
                    : false

                  return (
                    <Col key={`cell_${i}_${j}`} className="aspect-ratio-1-1">
                      <ContainableGrid
                        colIndex={colIndex}
                        rowIndex={rowIndex}
                        setCurGridCoord={setCurGridCoord}
                        isHighlightGreen={!isOutOfRange && shouldHighlight}
                        isHighlightRed={
                          (isOutOfRange || isBlocked) && shouldHighlight
                        }
                        placedMod={
                          storedMods[col] &&
                          storedMods[col].x === j &&
                          storedMods[col].y === i &&
                          storedMods[col].mod
                        }
                        placedModIndex={col}
                        placeMod={startPlacing}
                        moveMod={moveMod.bind(null, col)}
                        removeMod={removeMod.bind(null, col)}
                      />
                    </Col>
                  )
                })
              })}
          </Row>
        </div>
      </div>
    </div>
  )
}

export { DroppableSortingTable }
