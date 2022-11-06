import React, { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { HeadMeta } from "../components/HeadMeta"
import { searchItemByName } from "../reducers/FleamarketSlice"
import ItemRow from "../components/ItemRow"
import Paginate from "../components/Paginate"
import { ItemSearchBar } from "../components/ItemSearchBar"

const FleamarketScreen = () => {
  // router
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams({})

  // redux
  const dispatch = useDispatch()
  const {
    isLoading,
    items,
    page: statePage,
    pages: statePages,
  } = useSelector((state) => state.fleamarket)

  // hooks effect
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
  }, [searchParams])

  // handle
  const onResetSearch = () => {
    navigate("/fleamarket")
  }

  return (
    <>
      <HeadMeta title="Fleamarket" />
      <Container className="py-5">
        <ItemSearchBar
          onResetSearch={onResetSearch}
          setSearchParams={setSearchParams}
        />

        <Row className="mb-3">
          {isLoading
            ? new Array(12).fill().map((el, i) => {
                return (
                  <Col
                    key={`dummy_col_${i}`}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                    className="d-flex align-items-stretch"
                  >
                    <ItemRow loading={true} />
                  </Col>
                )
              })
            : items.map((item) => (
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

        <div className="d-flex justify-content-center">
          <Paginate
            page={statePage}
            pages={statePages}
            keyword={searchParams.get("keyword")}
            handbook={
              searchParams.get("handbook")
                ? JSON.parse(searchParams.get("handbook"))
                : null
            }
            setSearchParams={setSearchParams}
          />
        </div>
      </Container>
    </>
  )
}

export { FleamarketScreen }
