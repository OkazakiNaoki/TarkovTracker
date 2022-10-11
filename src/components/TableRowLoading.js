import React from "react"
import { DivLoading } from "./DivLoading"
import { TarkovSpinner } from "./TarkovSpinner"

const TableRowLoading = ({ colSize, height = 100 }) => {
  return (
    <tr>
      <td colSpan={colSize}>
        <DivLoading height={height} />
      </td>
    </tr>
  )
}

export { TableRowLoading }
