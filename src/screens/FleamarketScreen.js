import React from "react"
import { Link } from "react-router-dom"
import { Fleamarket } from "../components/Fleamarket"
import { HeadMeta } from "../components/HeadMeta"

const FleamarketScreen = () => {
  return (
    <>
      <HeadMeta title="Fleamarket" />
      <Fleamarket />
    </>
  )
}

export { FleamarketScreen }
