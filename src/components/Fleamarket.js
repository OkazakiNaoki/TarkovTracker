import React, { useState } from "react"
import { Button } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import {
  decrement,
  increment,
  incrementWithAmount,
  incrementWithAmountAsync,
  selectCount,
  incrementThunk,
} from "../reducers/FleamarketSlice"

const Fleamarket = () => {
  const count = useSelector(selectCount)
  const dispatch = useDispatch()
  const [steps, setSteps] = useState(1)

  return (
    <div>
      <div>
        <Button
          aria-label="Increment value"
          onClick={() => {
            dispatch(increment())
          }}
        >
          +
        </Button>
        <span>{count}</span>
        <Button
          aria-label="Decrement value"
          onClick={() => {
            dispatch(decrement())
          }}
        >
          -
        </Button>
      </div>
      <div>
        <input
          aria-label="Set increment steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
        <Button
          onClick={() => {
            console.log(incrementWithAmount(steps))
            dispatch(incrementWithAmount(Number(steps)))
          }}
        >
          Step
        </Button>
        <Button
          onClick={() => {
            dispatch(incrementWithAmountAsync(Number(steps)))
          }}
        >
          Async Step
        </Button>
        <Button
          onClick={() => {
            dispatch(incrementThunk())
          }}
        >
          Thunk +100
        </Button>
      </div>
    </div>
  )
}

export { Fleamarket }
