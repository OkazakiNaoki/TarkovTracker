import React from "react"
import { Pagination } from "react-bootstrap"

const Paginate = ({
  page,
  pages = 0,
  keyword,
  handbook,
  setSearchParams,
  usePageNum = false,
  usePrevNext = false,
  useFirstLast = false,
}) => {
  const GetRange = (pageNum) => {
    let limit = 10 // page button range
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
            keyword: keyword ?? "",
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
        {useFirstLast && (
          <Pagination.First
            onClick={() => {
              setSearchParams({
                handbook:
                  handbook && handbook.length > 0
                    ? JSON.stringify(handbook)
                    : "",
                keyword: keyword ?? "",
                page: 1,
              })
            }}
          />
        )}
        {usePrevNext && (
          <Pagination.Prev
            onClick={() => {
              setSearchParams({
                handbook:
                  handbook && handbook.length > 0
                    ? JSON.stringify(handbook)
                    : "",
                keyword: keyword ?? "",
                page: page - 1,
              })
            }}
            disabled={page === 1}
          />
        )}
        {usePageNum &&
          [...Array(pages).keys()].map((x) => {
            return GetRange(x + 1)
          })}
        {usePrevNext && (
          <Pagination.Next
            onClick={() => {
              setSearchParams({
                handbook:
                  handbook && handbook.length > 0
                    ? JSON.stringify(handbook)
                    : "",
                keyword: keyword ?? "",
                page: page + 1,
              })
            }}
            disabled={page === pages}
          />
        )}
        {useFirstLast && (
          <Pagination.Last
            onClick={() => {
              setSearchParams({
                handbook:
                  handbook && handbook.length > 0
                    ? JSON.stringify(handbook)
                    : "",
                keyword: keyword ?? "",
                page: pages,
              })
            }}
          />
        )}
      </Pagination>
    )
  )
}

export { Paginate }
