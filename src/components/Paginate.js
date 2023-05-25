import React from "react"
import { Pagination } from "react-bootstrap"

const Paginate = ({
  page,
  pages = 0,
  usePageNum = false,
  usePrevNext = false,
  useFirstLast = false,
  setPageNum,
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
        onClick={setPageNum.bind(null, pageNum)}
      >
        {pageNum}
      </Pagination.Item>
    ) : null
  }

  return (
    pages > 1 && (
      <Pagination>
        {useFirstLast && (
          <Pagination.First
            onClick={setPageNum.bind(null, 1)}
            disabled={page === 1}
          />
        )}
        {usePrevNext && (
          <Pagination.Prev
            onClick={setPageNum.bind(null, page - 1)}
            disabled={page === 1}
          />
        )}
        {usePageNum &&
          [...Array(pages).keys()].map((x) => {
            return GetRange(x + 1)
          })}
        {usePrevNext && (
          <Pagination.Next
            onClick={setPageNum.bind(null, page + 1)}
            disabled={page === pages}
          />
        )}
        {useFirstLast && (
          <Pagination.Last
            onClick={setPageNum.bind(null, pages)}
            disabled={page === pages}
          />
        )}
      </Pagination>
    )
  )
}

export { Paginate }
