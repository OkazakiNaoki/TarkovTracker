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
import { useNavigate, useSearchParams } from "react-router-dom"
import { HeadMeta } from "../components/HeadMeta"
import { searchItemByName, getItemCategory } from "../reducers/FleamarketSlice"
import ItemRow from "../components/ItemRow"
import Paginate from "../components/Paginate"

const FleamarketScreen = () => {
  // router
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams({})

  // redux
  const dispatch = useDispatch()
  const {
    isLoading,
    error,
    success,
    items,
    categories,
    page: statePage,
    pages: statePages,
  } = useSelector((state) => state.fleamarket)

  // hooks state
  const [curCategory, setCurCategory] = useState("")
  const [keyword, setKeyword] = useState("")
  const [categoryToggle, setCategoryToggle] = useState([])
  const [expandCategory, setExpandCategory] = useState(false)

  // hooks effects
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
  }, [categories, categoryToggle])
  useEffect(() => {
    dispatch(
      searchItemByName({
        category: searchParams.get("category")
          ? searchParams.get("category")
          : undefined,
        keyword: searchParams.get("keyword")
          ? searchParams.get("keyword")
          : undefined,
        page: searchParams.get("page") ? searchParams.get("page") : undefined,
      })
    )
  }, [dispatch, searchParams])

  // handler
  const submitHandler = (e) => {
    e.preventDefault()
    if (curCategory.trim()) {
      navigate(`/fleamarket?category=${curCategory}&keyword=${keyword}`)
    } else {
      navigate(`/fleamarket?keyword=${keyword}`)
    }
  }

  return (
    <>
      <HeadMeta title="Fleamarket" />
      <InputGroup size="lg" className="my-3 tarkov-font">
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
            className="d-flex align-items-stretch"
          >
            <ItemRow item={item} />
          </Col>
        ))}
      </Row>

      <Paginate
        page={statePage}
        pages={statePages}
        keyword={keyword}
        category={curCategory}
        setSearchParams={setSearchParams}
      />
    </>
  )
}

export { FleamarketScreen }
