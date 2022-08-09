import React from "react"
import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"
import { HeadMeta } from "../components/HeadMeta"

const HomeScreen = () => {
  return (
    <>
      <div className="position-absolute top-50 start-50 translate-middle">
        <HeadMeta title="Home page" />
        <Link to="/counter">
          <Button variant="primary" className="mx-3 mt-3">
            Counter
          </Button>
        </Link>
      </div>
    </>
  )
}

export { HomeScreen }
