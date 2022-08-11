import React, { useState, useEffect } from "react"
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { HeadMeta } from "../components/HeadMeta"
import { searchItemByName } from "../reducers/FleamarketSlice"
import ItemRow from "../components/ItemRow"

const FleamarketScreen = () => {
  // router
  const navigate = useNavigate()
  const { itemName } = useParams()

  // redux
  const dispatch = useDispatch()
  const { isLoading, error, success, items } = useSelector(
    (state) => state.fleamarket
  )

  // hooks
  const [keyword, setKeyword] = useState("")
  useEffect(() => {
    dispatch(searchItemByName(itemName))
  }, [dispatch, itemName])

  // handler
  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/fleamarket/${keyword}`)
    }
  }

  return (
    <>
      <HeadMeta title="Fleamarket" />
      <InputGroup size="lg" className="my-3">
        <Form.Control
          placeholder="Enter item name"
          aria-label="item's name"
          aria-describedby="button-search"
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
          className="text-center"
        />
        <Button variant="secondary" id="button-search" onClick={submitHandler}>
          Search
        </Button>
      </InputGroup>

      <Row>
        {items.map((item) => (
          <Col
            key={item._id}
            sm={12}
            md={6}
            lg={4}
            xl={3}
            className="d-flex align-items-stretch"
          >
            <ItemRow item={item} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export { FleamarketScreen }
