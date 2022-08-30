import React from "react"
import { Link } from "react-router-dom"
import { Image } from "react-bootstrap"
import buttonImg from "../../public/static/images/button.png"

const TarkovButton = ({ useLink, to, clickHandle, text }) => {
  return useLink ? (
    <div className="position-relative my-3">
      <Link to={to}>
        <Image src={buttonImg} />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-dark fs-2 fw-bold">
          {text}
        </div>
      </Link>
    </div>
  ) : (
    <div className="position-relative my-3">
      <a onClick={clickHandle} role="button">
        <Image src={buttonImg} />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-dark fs-2 fw-bold">
          {text}
        </div>
      </a>
    </div>
  )
}

export { TarkovButton }
