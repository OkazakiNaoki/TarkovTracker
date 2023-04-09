import React from "react"

const TarkovSpinner = ({ loading = true }) => {
  return (
    <div className="spin-spinner">
      <div
        style={{
          animationPlayState: loading ? "running" : "paused",
        }}
      ></div>
    </div>
  )
}

export { TarkovSpinner }
