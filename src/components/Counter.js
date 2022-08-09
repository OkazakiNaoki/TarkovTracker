import React, { useState } from "react"
import { Button } from "react-bootstrap"

const Counter = () => {
  const [count, setCount] = useState(0)
  const [incrementAmount, setIncrementAmount] = useState(1)

  const increment = () => {
    setCount(count + 1)
  }

  const decrement = () => {
    setCount(count - 1)
  }

  const incrementByAmount = (amount) => {
    setCount(count + amount)
  }

  return (
    <div>
      <div>
        <Button aria-label="Increment value" onClick={increment}>
          +
        </Button>
        <span>{count}</span>
        <Button aria-label="Decrement value" onClick={decrement}>
          -
        </Button>
      </div>
      <div>
        <input
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <Button onClick={() => incrementByAmount(Number(incrementAmount) || 0)}>
          Add Amount
        </Button>
      </div>
    </div>
  )
}

export { Counter }
