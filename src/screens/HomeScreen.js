import React from "react"
import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"
import { HeadMeta } from "../components/HeadMeta"

const HomeScreen = () => {
  return (
    <>
      <HeadMeta title="Home page" />
      <div className="h-100"></div>
    </>
  )
}

export { HomeScreen }
