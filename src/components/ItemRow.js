import React from "react"
import { useSelector } from "react-redux"
import { Card, Placeholder } from "react-bootstrap"
import { Link } from "react-router-dom"
import { ItemMultiGrid } from "./ItemMultiGrid"
import { TarkovSpinner } from "./TarkovSpinner"

const ItemRow = ({ item, loading = false }) => {
  //// redux state
  const { preference } = useSelector((state) => state.user)

  return (
    <>
      <Card className="bg-dark text-white my-3 p-3 rounded w-100 ls-1px">
        {loading ? (
          <Placeholder className="sand1" as={Card.Title} animation="wave">
            <Placeholder xs={12} size="lg" />
          </Placeholder>
        ) : (
          <Link to={`/item/${item.id}`} className="text-deco-line-none">
            <Card.Title
              className="trunc-2-line sand1 height-50px"
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
            <Link to={`/item/${item.id}`}>
              <ItemMultiGrid
                itemId={item.id}
                shortName={item.shortName}
                bgColor={item.backgroundColor}
                width={item.width}
                height={item.height}
                scale={1}
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
