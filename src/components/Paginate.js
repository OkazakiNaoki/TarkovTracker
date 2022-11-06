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
      <Pagination.Item
        key={`page_${pageNum}`}
        active={pageNum === page}
        onClick={() => {
          setSearchParams({
            handbook:
              handbook && handbook.length > 0 ? JSON.stringify(handbook) : "",
            keyword: keyword,
            page: pageNum,
          })
        }}
      >
        {pageNum}
      </Pagination.Item>
    ) : null
  }

  return (
    pages > 1 && (
      <Pagination
        style={{
          "--bs-pagination-padding-x": "1rem",
          "--bs-pagination-color": "#b7ad9c",
          "--bs-pagination-bg": "#212529",
          "--bs-pagination-border-color": "#495154",
          "--bs-pagination-active-color": "black",
          "--bs-pagination-active-bg": "#b7ad9c",
          "--bs-pagination-active-border-color": "#b7ad9c",
          "--bs-pagination-hover-color": "black",
        }}
      >
        <Pagination.First
          onClick={() => {
            setSearchParams({
              handbook: handbook.length > 0 ? JSON.stringify(handbook) : "",
              keyword: keyword,
              page: 1,
            })
          }}
        />
        {[...Array(pages).keys()].map((x) => {
          return GetRange(x + 1)
        })}
        <Pagination.Last
          onClick={() => {
            setSearchParams({
              handbook: handbook.length > 0 ? JSON.stringify(handbook) : "",
              keyword: keyword,
              page: pages,
            })
          }}
        />
      </Pagination>
    )
  )
}

export default Paginate
