import React from "react"
import { TarkovSpinner } from "./TarkovSpinner"

const TableRowLoading = ({ colSize, height = 100 }) => {
  return (
    <tr>
      <td colSpan={colSize}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: `${height}px` }}
        >
          <TarkovSpinner />
        </div>
      </td>
    </tr>
  )
}

export { TableRowLoading }
