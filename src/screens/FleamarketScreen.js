import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  ToggleButton,
  Collapse,
} from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { HeadMeta } from "../components/HeadMeta"
import { searchItemByName, getItemCategory } from "../reducers/FleamarketSlice"
import ItemRow from "../components/ItemRow"

const FleamarketScreen = () => {
  // router
  const navigate = useNavigate()
  const { itemCategory, itemName } = useParams()

  // redux
  const dispatch = useDispatch()
  const { isLoading, error, success, items, categories } = useSelector(
    (state) => state.fleamarket
  )

  // hooks state
  const [curCategory, setCurCategory] = useState("")
  const [keyword, setKeyword] = useState("")
  const [categoryToggle, setCategoryToggle] = useState([])
  const [expandCategory, setExpandCategory] = useState(false)

  // hooks effect
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getItemCategory({ type: "all" }))
    }
    if (categoryToggle.length === 0 && categories.length !== 0) {
      const toggleCat = categories.map((el) => {
        return { ...el, toggle: false }
      })
      setCategoryToggle(toggleCat)
    }
    dispatch(searchItemByName({ category: itemCategory, keyword: itemName }))
  }, [dispatch, itemCategory, itemName, categories, categoryToggle])

  // handler
  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      if (curCategory.trim()) {
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

      <Button
        onClick={() => setExpandCategory(!expandCategory)}
        aria-controls="collapse-category-button"
        aria-expanded={expandCategory}
        className="mb-1"
      >
        Category filter
      </Button>
      <Collapse in={expandCategory}>
        <div id="collapse-category-button">
          {categoryToggle.map((el, i) => {
            return (
              <ToggleButton
                key={el.name}
                type="checkbox"
                variant="outline-primary"
                checked={categoryToggle[i].toggle}
                value="1"
                onClick={(e) => {
                  let toggle = el.toggle
                  let newArr = categoryToggle.map((el) => {
                    el.toggle = false
                    return el
                  })
                  newArr[i].toggle = !toggle
                  if (newArr[i].toggle) {
                    setCurCategory(newArr[i].name)
                  } else {
                    setCurCategory("")
                  }

                  setCategoryToggle(newArr)
                }}
                style={{ "--bs-btn-hover-bg": "none" }}
                className="mx-1 mb-1"
              >
                {categoryToggle[i].name}
              </ToggleButton>
            )
          })}
        </div>
      </Collapse>

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
