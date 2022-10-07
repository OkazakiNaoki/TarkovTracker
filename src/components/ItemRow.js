import React, { useState, useEffect } from "react"
import { Card, Container, Placeholder } from "react-bootstrap"
import { Link } from "react-router-dom"
import placeholderImg from "../../public/static/images/m4a1_placeholder.png"
import { ItemMultiGrid } from "./ItemMultiGrid"
import { TarkovSpinner } from "./TarkovSpinner"

const ItemRow = ({ item, loading = false }) => {
  const [imgSrc, setImgSrc] = useState("")

  useEffect(() => {
    if (!loading) {
      setImgSrc(`/asset/${item.id}-icon.png`)
    }
  }, [])

  const imgLoadErrHandle = () => {
    setImgSrc(placeholderImg)
  }

  return (
    <>
      <Card className="bg-dark text-white my-3 p-3 rounded w-100 ls-1">
        {loading ? (
          <Placeholder className="sandbeige" as={Card.Title} animation="wave">
            <Placeholder xs={12} size="lg" />
          </Placeholder>
        ) : (
          <Link
            to={`/item/${item.id}`}
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <Card.Title
              className="two-line-text-trunc sandbeige"
              style={{ height: "50px" }}
              title={item.name}
            >
              <strong>{item.name}</strong>
            </Card.Title>
          </Link>
        )}
        <div className="d-flex position-relative my-3 justify-content-center">
          {loading ? (
            <TarkovSpinner />
          ) : (
            <Link
              to={`/item/${item.id}`}
              style={{
                "--bs-link-color": "none",
                "--bs-link-hover-color": "none",
              }}
            >
              <ItemMultiGrid
                itemId={item.id}
                shortName={item.shortName}
                bgColor={item.backgroundColor}
                width={item.width}
                height={item.height}
                resize={1}
              />
            </Link>
          )}
        </div>
      </Card>
    </>
  )
}

export default ItemRow
