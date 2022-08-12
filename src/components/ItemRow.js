import React, { useState, useEffect } from "react"
import { Card, Container } from "react-bootstrap"
import placeholderImg from "../../public/static/images/m4a1_placeholder.png"

const ItemRow = (props) => {
  const [imgSrc, setImgSrc] = useState("")

  useEffect(() => {
    setImgSrc(`/asset/${props.item.id}-icon.png`)
  }, [])

  const imgLoadErrHandle = () => {
    setImgSrc(placeholderImg)
  }

  return (
    <>
      <Card className="bg-dark text-white my-3 p-3 rounded">
        <Card.Title className="two-line-text-trunc" style={{ height: "50px" }}>
          <strong>{props.item.name}</strong>
        </Card.Title>
        <div className="d-flex position-relative my-3 justify-content-center">
          <img
            src={imgSrc}
            onError={imgLoadErrHandle}
            alt="item icon"
            className="img-fluid"
          />
          <Card.Text className="position-absolute top-0 end-0 item-shortname">
            {props.item.shortName}
          </Card.Text>
        </div>
        <Card.Text>{props.item.id}</Card.Text>
      </Card>
    </>
  )
}

export default ItemRow
