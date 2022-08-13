import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  ToggleButton,
} from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { HeadMeta } from "../components/HeadMeta"
import { searchItemByName } from "../reducers/FleamarketSlice"
import ItemRow from "../components/ItemRow"

const FleamarketScreen = () => {
  // router
  const navigate = useNavigate()
  const { itemCategory, itemName } = useParams()

  // redux
  const dispatch = useDispatch()
  const { isLoading, error, success, items } = useSelector(
    (state) => state.fleamarket
  )

  // hooks
  const [curCategory, setCurCategory] = useState("Drink")
  const [keyword, setKeyword] = useState("")
  const [categoryToggle, setCategoryToggle] = useState([
    { name: "Food", toggle: false },
  ])
  useEffect(() => {
    dispatch(searchItemByName({ category: itemCategory, keyword: itemName }))
  }, [dispatch, itemName])

  // handler
  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      if (curCategory) {
        navigate(`/fleamarket/${curCategory}/${keyword}`)
      } else {
        navigate(`/fleamarket/${keyword}`)
      }
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

      {/* TODO: procedure generate category toggle button */}
      <ToggleButton
        id="food-toggle"
        type="checkbox"
        variant="outline-primary"
        checked={categoryToggle[0].toggle}
        value="1"
        onClick={(e) => {
          let newArr = [...categoryToggle]
          newArr[0].toggle = !newArr[0].toggle

          setCategoryToggle(newArr)
        }}
        style={{ "--bs-btn-hover-bg": "none" }}
      >
        {categoryToggle[0].name}
      </ToggleButton>

      <Row>
        {items.map((item) => (
          <Col
            key={item.id}
            sm={12}
            md={6}
            lg={4}
            xl={3}
            xxl={2}
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
