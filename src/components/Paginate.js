import React from "react"
import { Pagination } from "react-bootstrap"

const Paginate = ({ page, pages, keyword, handbook, setSearchParams }) => {
  const GetRange = (pageNum) => {
    let limit = 10
    let half = 5
    let frontSlot = page - 1
    let rearSlot = pages - page
    let willRender = false

    if (pages <= 11) {
      willRender = true
    } else if (frontSlot < half) {
      if (
        pageNum >= page - frontSlot &&
        pageNum <= page + (limit - frontSlot)
      ) {
        willRender = true
      }
    } else if (frontSlot >= half && rearSlot >= half) {
      if (pageNum >= page - half && pageNum <= page + half) {
        willRender = true
      }
    } else if (frontSlot >= half && rearSlot < half) {
      if (pageNum >= page - (limit - rearSlot) && pageNum <= page + rearSlot) {
        willRender = true
      }
    }
    return willRender ? (
      <div
        key={pageNum}
        onClick={() => {
          setSearchParams({
            handbook: handbook.length > 0 ? JSON.stringify(handbook) : "",
            keyword: keyword,
            page: pageNum,
          })
        }}
      >
        <Pagination.Item active={pageNum === page}>{pageNum}</Pagination.Item>
      </div>
    ) : null
  }

  return (
    pages > 1 && (
      <Pagination>
        <div
          key="most-forward"
          onClick={() => {
            setSearchParams({
              handbook: handbook.length > 0 ? JSON.stringify(handbook) : "",
              keyword: keyword,
              page: 1,
            })
          }}
        >
          <Pagination.Item>{"<<"}</Pagination.Item>
        </div>
        {[...Array(pages).keys()].map((x) => {
          return GetRange(x + 1)
        })}
        <div
          key="most-back"
          onClick={() => {
            setSearchParams({
              handbook: handbook.length > 0 ? JSON.stringify(handbook) : "",
              keyword: keyword,
              page: pages,
            })
          }}
        >
          <Pagination.Item>{">>"}</Pagination.Item>
        </div>
      </Pagination>
    )
  )
}

export default Paginate
