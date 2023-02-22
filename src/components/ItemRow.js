import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, Placeholder } from "react-bootstrap"
import { Link } from "react-router-dom"
import { ItemMultiGrid } from "./ItemMultiGrid"
import { TarkovSpinner } from "./TarkovSpinner"
import placeholderImg from "../../server/public/static/images/m4a1_placeholder.png"

const ItemRow = ({ item, loading = false }) => {
  //// state
  const [imgSrc, setImgSrc] = useState("")

  //// redux state
  const { preference } = useSelector((state) => state.user)

  //// effect
  useEffect(() => {
    if (!loading) {
      setImgSrc(`/asset/${item.id}-icon.png`)
    }
  }, [])

  //// handle
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
                resolution={
                  preference && preference.fleaMarketItemIconResolution
                }
              />
            </Link>
          )}
        </div>
      </Card>
    </>
  )
}

export default ItemRow
