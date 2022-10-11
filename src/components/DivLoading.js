import React from "react"
import { TarkovSpinner } from "./TarkovSpinner"

const DivLoading = ({ height = 100 }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: `${height}px` }}
    >
      <TarkovSpinner />
    </div>
  )
}

export { DivLoading }
