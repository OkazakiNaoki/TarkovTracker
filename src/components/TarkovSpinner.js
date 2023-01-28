import React from "react"
import spinnerBack from "../../server/public/static/images/progress_spinner_back.png"
import spinner from "../../server/public/static/images/spinner_big.png"

const TarkovSpinner = ({ loading = true }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${spinnerBack})`,
        width: "51px",
        height: "51px",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${spinner})`,
          width: "43px",
          height: "43px",
          transformOrigin: "center",
          transform: "translateX(-1px) translateY(-1px)",
          animation: loading ? "spinnerSpin 2s linear infinite" : "none",
        }}
      ></div>
    </div>
  )
}

export { TarkovSpinner }
