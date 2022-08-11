import React from "react"
import { Card, Container } from "react-bootstrap"
import placeholderImg from "../../public/static/images/m4a1_placeholder.png"

const ItemRow = (props) => {
  return (
    <>
      <Card className="bg-dark text-white my-3 p-3 rounded">
        <Card.Title>
          <strong>{props.item.name}</strong>
        </Card.Title>
        <div className="position-relative my-3">
          <Card.Img src={placeholderImg} alt="Card image" />
          <Card.Text className="position-absolute top-0 end-0 item-shortname">
            {props.item.shortName}
          </Card.Text>
        </div>
        <Card.Text>I am the content</Card.Text>
      </Card>
    </>
  )
}

export default ItemRow
