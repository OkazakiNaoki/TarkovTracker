import React, { useEffect } from "react"
import { Container, Row, Col, Image, Table, Collapse } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { HideoutIcon } from "../components/HideoutIcon"
import { getAllHideout } from "../reducers/HideoutSlice"

const HideoutScreen = () => {
  // redux
  const { hideout } = useSelector((state) => state.hideout)
  const dispatch = useDispatch()

  // hooks
  useEffect(() => {
    if (hideout.length === 0) {
      dispatch(getAllHideout())
    }
  }, [hideout])

  return (
    <>
      <Container className="d-flex flex-wrap">
        {hideout.map((el) => {
          return <HideoutIcon iconName={el.id} />
        })}
      </Container>
    </>
  )
}

export { HideoutScreen }
