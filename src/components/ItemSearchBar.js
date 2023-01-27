import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, Dropdown, Form, InputGroup, Image } from "react-bootstrap"
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
  XLg,
} from "react-bootstrap-icons"
import CheckboxTree from "react-checkbox-tree"
import { getItemHandbook, setHandbookTree } from "../reducers/FleamarketSlice"

const ItemSearchBar = ({ setSearchParams }) => {
  const dispatch = useDispatch()
  // redux state
  const { isLoading, handbook, handbookTree } = useSelector(
    (state) => state.fleamarket
  )

  // hooks state
  const [keyword, setKeyword] = useState("")
  const [showCategorySetting, setShowCategorySetting] = useState(false)
  const [treeExpand, setTreeExpand] = useState([])
  const [treeCheck, setTreeCheck] = useState([])
  const [copyHandbookTree, setCopyHandbookTree] = useState([])

  // hooks effects
  useEffect(() => {
    if (handbook.length === 0) {
      dispatch(getItemHandbook())
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

  // handle
  const enterPressHandle = (e) => {
    if (!isLoading && e.keyCode == 13) {
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
    setSearchParams({})
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

  return (
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
      {(keyword !== "" || treeCheck.length > 0) && (
        <Button variant="danger" onClick={resetSearchHandle}>
          <XLg />
        </Button>
      )}
      <Dropdown autoClose={false} show={showCategorySetting} align="end">
        <Dropdown.Toggle
          split
          align="end"
          variant="secondary"
          id="category-setting-dropdown-split-btn"
          onClick={() => {
            isLoading ? null : setShowCategorySetting(!showCategorySetting)
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
  )
}

export { ItemSearchBar }
