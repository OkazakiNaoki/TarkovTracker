import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  Dropdown,
  Image,
} from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  CheckSquareFill,
  Square,
  CheckSquare,
  ChevronRight,
  ChevronDown,
  PlusSquare,
  DashSquare,
  Folder2,
  Folder2Open,
  FileEarmark,
} from "react-bootstrap-icons"
import CheckboxTree from "react-checkbox-tree"
import { HeadMeta } from "../components/HeadMeta"
import {
  searchItemByName,
  getItemHandbook,
  setHandbookTree,
} from "../reducers/FleamarketSlice"
import ItemRow from "../components/ItemRow"
import Paginate from "../components/Paginate"
import { ItemMultiGrid } from "../components/ItemMultiGrid"

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
    handbookTree,
    page: statePage,
    pages: statePages,
  } = useSelector((state) => state.fleamarket)

  // hooks state
  const [keyword, setKeyword] = useState("")
  const [showCategorySetting, setShowCategorySetting] = useState(false)
  const [treeExpand, setTreeExpand] = useState([])
  const [treeCheck, setTreeCheck] = useState([])
  const [copyHandbookTree, setCopyHandbookTree] = useState([])

  // hooks effects
  useEffect(() => {
    if (handbook.length === 0) {
      dispatch(getItemHandbook({ type: "all" }))
    }
  }, [handbook])

  useEffect(() => {
    if (handbook.length !== 0 && handbookTree.length === 0) {
      dispatch(setHandbookTree())
    }
  }, [handbook])

  useEffect(() => {
    if (handbookTree.length !== 0 && copyHandbookTree.length === 0) {
      const copyTree = JSON.parse(JSON.stringify(handbookTree))
      const newTree = copyTree.map((tree) => {
        return setIconCompInHandbookNodes(tree)
      })
      setCopyHandbookTree(newTree)
    }
  }, [handbookTree])

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

    searchParams.get("keyword")
      ? setKeyword(searchParams.get("keyword"))
      : setKeyword("")
  }, [dispatch, searchParams])

  // handle
  const enterPressHandle = (e) => {
    if (e.keyCode == 13) {
      if (treeCheck.length > 0) {
        setSearchParams({
          handbook: JSON.stringify(treeCheck),
          keyword: keyword,
        })
      } else {
        setSearchParams({
          keyword: keyword,
        })
      }
    }
  }

  const setIconCompInHandbookNodes = (node) => {
    const copyNode = {
      ...node,
      icon: node.icon ? <Image src={`/asset/${node.icon}`} /> : <div></div>,
    }
    if (copyNode.children.length > 0) {
      copyNode.children = copyNode.children.map((child) => {
        return setIconCompInHandbookNodes(child)
      })
    } else {
      delete copyNode.children
    }
    return copyNode
  }

  const clickCheckboxTreeOkHandle = () => {
    setSearchParams({
      handbook: treeCheck.length > 0 ? JSON.stringify(treeCheck) : "",
      keyword: keyword,
    })
    setShowCategorySetting(!showCategorySetting)
  }

  const resetSearchHandle = () => {
    setTreeCheck([])
    setKeyword("")
    navigate(`/fleamarket`)
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
            <Button variant="secondary" onClick={resetSearchHandle}>
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
            <Dropdown.Menu variant="dark">
              <div className="m-3">
                <div className="pe-5">
                  <CheckboxTree
                    nodes={copyHandbookTree}
                    checked={treeCheck}
                    expanded={treeExpand}
                    onCheck={(checked) => setTreeCheck(checked)}
                    onExpand={(expanded) => setTreeExpand(expanded)}
                    showExpandAll={true}
                    icons={{
                      check: <CheckSquareFill />,
                      uncheck: <Square />,
                      halfCheck: <CheckSquare />,
                      expandClose: <ChevronRight />,
                      expandOpen: <ChevronDown />,
                      expandAll: <PlusSquare />,
                      collapseAll: <DashSquare />,
                      parentClose: <Folder2 />,
                      parentOpen: <Folder2Open />,
                      leaf: <FileEarmark />,
                    }}
                  />
                </div>
                <hr />
                <Button
                  variant="primary"
                  type="submit"
                  onClick={clickCheckboxTreeOkHandle}
                >
                  OK
                </Button>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup>

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
          handbook={treeCheck}
          setSearchParams={setSearchParams}
        />
      </Container>
    </>
  )
}

export { FleamarketScreen }
