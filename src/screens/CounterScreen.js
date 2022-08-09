import React from "react"
import { Counter } from "../components/Counter.js"
import { Link } from "react-router-dom"
import { HeadMeta } from "../components/HeadMeta"

const CounterScreen = () => {
  return (
    <>
      <HeadMeta title="Counter component" />
      <Counter />
      <Link to="/">Home</Link>
    </>
  )
}

export { CounterScreen }
