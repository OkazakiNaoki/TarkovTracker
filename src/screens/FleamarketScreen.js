import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  ToggleButton,
  Collapse,
  Dropdown,
} from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { HeadMeta } from "../components/HeadMeta"
import {
  searchItemByName,
  getItemCategory,
  getItemHandbook,
} from "../reducers/FleamarketSlice"
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
    handbook,
    page: statePage,
    pages: statePages,
  } = useSelector((state) => state.fleamarket)

  // hooks state
  const [curCategory, setCurCategory] = useState("")
  const [keyword, setKeyword] = useState("")
  const [handbookToggle, setHandbookToggle] = useState([])
  const [expandHandbook, setExpandHandbook] = useState(false)
  const [showCategorySetting, setShowCategorySetting] = useState(false)

  // hooks effects
  useEffect(() => {
    if (handbook.length === 0) {
      dispatch(getItemHandbook({ type: "all" }))
    }
  }, [handbook])

  useEffect(() => {
    if (handbookToggle.length === 0 && handbook.length !== 0) {
      initializeHandbookToggle()
    }
  }, [handbook, handbookToggle])

  useEffect(() => {
    dispatch(
      searchItemByName({
        handbook: searchParams.get("handbook")
          ? searchParams.get("handbook")
          : undefined,
        keyword: searchParams.get("keyword")
          ? searchParams.get("keyword")
          : undefined,
        page: searchParams.get("page") ? searchParams.get("page") : undefined,
      })
    )
    searchParams.get("handbook")
      ? toggleHandbookHandle(searchParams.get("handbook"), true)
      : initializeHandbookToggle()

    searchParams.get("keyword")
      ? setKeyword(searchParams.get("keyword"))
      : setKeyword("")
  }, [dispatch, searchParams])

  // handle
  const toggleHandbookHandle = (categoryName, onOff) => {
    if (handbookToggle.length > 0) {
      const index = handbookToggle.findIndex((category) => {
        return category.categoryName === categoryName
      })
      let newToggleArr = handbookToggle.map((category) => {
        category.toggle = false
        return category
      })
      newToggleArr[index].toggle = onOff
      newToggleArr[index].toggle
        ? setCurCategory(categoryName)
        : setCurCategory("")

      setHandbookToggle(newToggleArr)
    }
  }

  const initializeHandbookToggle = () => {
    const toggleCat = handbook.map((category) => {
      return { categoryName: category.handbookCategoryName, toggle: false }
    })
    setHandbookToggle(toggleCat)
    setCurCategory("")
  }

  const enterPressHandle = (e) => {
    if (e.keyCode == 13) {
      if (curCategory.trim()) {
        navigate(
          `/fleamarket?handbook=${encodeURIComponent(
            curCategory
          )}&keyword=${encodeURIComponent(keyword)}`
        )
      } else {
        navigate(`/fleamarket?keyword=${encodeURIComponent(keyword)}`)
      }
    }
  }

  return (
    <>
      <HeadMeta title="Fleamarket" />
      <Container className="py-5">
        <InputGroup size="lg" className="py-3">
          <Form.Control
            placeholder="Enter item name"
            aria-label="item's name"
            aria-describedby="button-search"
            onChange={(e) => {
              setKeyword(e.target.value)
            }}
            onKeyDown={enterPressHandle}
            value={keyword}
            className="text-center"
          />
          {keyword !== "" && (
            <Button
              variant="secondary"
              onClick={() => {
                setKeyword("")
                navigate(`/fleamarket`)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
              </svg>
            </Button>
          )}
          <Dropdown autoClose={false} show={showCategorySetting} align="end">
            <Dropdown.Toggle
              split
              align="end"
              variant="secondary"
              id="category-setting-dropdown-split-btn"
              onClick={() => {
                setShowCategorySetting(!showCategorySetting)
              }}
            />
            <Dropdown.Menu>
              <Form className="m-3">
                <Form.Group className="mb-3" controlId="Handbook 1">
                  <Form.Label>Email address</Form.Label>
                  <Form.Check type="checkbox" label="Handbook 1" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="Handbook 2">
                  <Form.Check type="checkbox" label="Handbook 2" />
                </Form.Group>
                <hr />
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>

        <Button
          onClick={() => setExpandHandbook(!expandHandbook)}
          aria-controls="collapse-handbook-button"
          aria-expanded={expandHandbook}
          className="mb-1"
        >
          Handbook filter
        </Button>
        <Collapse in={expandHandbook}>
          <div id="collapse-handbook-button">
            {handbookToggle.map((category) => {
              return (
                <ToggleButton
                  key={category.categoryName}
                  type="checkbox"
                  variant="outline-primary"
                  checked={category.toggle}
                  value="1"
                  onClick={(e) => {
                    toggleHandbookHandle(
                      category.categoryName,
                      !category.toggle
                    )
                  }}
                  style={{ "--bs-btn-hover-bg": "none" }}
                  className="mx-1 mb-1"
                >
                  {category.categoryName}
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
          handbook={curCategory}
          setSearchParams={setSearchParams}
        />
      </Container>
    </>
  )
}

export { FleamarketScreen }
