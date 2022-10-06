import React, { useState, useEffect } from "react"
import { Card, Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import placeholderImg from "../../public/static/images/m4a1_placeholder.png"
import { ItemMultiGrid } from "./ItemMultiGrid"

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
      <Card className="bg-dark text-white my-3 p-3 rounded w-100 ls-1">
        <Link
          to={`/item/${props.item.id}`}
          style={{ color: "inherit", textDecoration: "inherit" }}
        >
          <Card.Title
            className="two-line-text-trunc sandbeige"
            style={{ height: "50px" }}
            title={props.item.name}
          >
            <strong>{props.item.name}</strong>
          </Card.Title>
        </Link>
        <div className="d-flex position-relative my-3 justify-content-center">
          <Link
            to={`/item/${props.item.id}`}
            style={{
              "--bs-link-color": "none",
              "--bs-link-hover-color": "none",
            }}
          >
            <ItemMultiGrid
              itemId={props.item.id}
              shortName={props.item.shortName}
              bgColor={props.item.backgroundColor}
              width={props.item.width}
              height={props.item.height}
              resize={1}
            />
          </Link>
        </div>
      </Card>
    </>
  )
}

export default ItemRow
