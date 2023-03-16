import React, { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { find, get } from "lodash"
import { Pencil } from "react-bootstrap-icons"
import { convertKiloMega } from "../helpers/NumberFormat"
import { ItemSearchBar } from "./ItemSearchBar"
import { Paginate } from "./Paginate"
import { clearItems, searchItemByName } from "../reducers/FleamarketSlice"
import { EditValueModal } from "./EditValueModal"
import { ItemSingleGrid } from "./ItemSingleGrid"
import { Button } from "react-bootstrap"
import { updateInventoryItem } from "../reducers/CharacterSlice"

const InventoryPanel = ({ playerInventory }) => {
  //// router
  const [searchParams, setSearchParams] = useSearchParams({})

  //// state
  const [modalStatus, setModalStatus] = useState(false)
  const [curInventoryItem, setCurInventoryItem] = useState(null)
  const [curInventoryItemCount, setCurInventoryItemCount] = useState(null)

  //// redux
  const dispatch = useDispatch()

  //// redux state
  const {
    items,
    page: statePage,
    pages: statePages,
  } = useSelector((state) => state.fleamarket)

  //// effect
  // on search params change
  useEffect(() => {
    if (
      searchParams.get("handbook") ||
      searchParams.get("keyword") ||
      searchParams.get("page")
    ) {
      dispatch(
        searchItemByName({
          handbook: searchParams.get("handbook")
            ? searchParams.get("handbook")
            : undefined,
          keyword: searchParams.get("keyword")
            ? searchParams.get("keyword")
            : undefined,
          page: searchParams.get("page") ? searchParams.get("page") : undefined,
          limit: 10,
        })
      )
    }
    if (
      !searchParams.get("handbook") &&
      !searchParams.get("keyword") &&
      !searchParams.get("page")
    ) {
      dispatch(clearItems())
    }
  }, [searchParams])

  //// handle
  // get item amount in inventory
  const findItemAmount = (inventory, itemId) => {
    return get(
      find(inventory, (item) => {
        return get(item, "item.id") === itemId
      }),
      "count",
      0
    )
  }

  // close modal
  const closeModalHandle = useCallback(() => {
    setModalStatus(!modalStatus)
  }, [modalStatus])

  // modal confirm and set value
  const modalSetValueHandle = (value) => {
    addItemToInventoryHandle(curInventoryItem, value)
    closeModalHandle()
  }

  // set target item
  const setCurrentItemHandle = (item) => {
    setCurInventoryItem(item)
    setCurInventoryItemCount(findItemAmount(playerInventory, item.id))
    closeModalHandle()
  }

  // add item
  const addItemToInventoryHandle = (item, count) => {
    dispatch(
      updateInventoryItem({
        items: [
          {
            item: {
              id: item.id,
              name: item.name,
              backgroundColor: item.backgroundColor,
            },
            count: count,
          },
        ],
      })
    )
  }

  const setEditingTargetInventoryItemHandle = (item) => {
    setCurInventoryItem({
      id: item.item.id,
      name: item.item.name,
    })
    setCurInventoryItemCount(item.count)
    closeModalHandle()
  }

  return (
    <>
      <EditValueModal
        title={curInventoryItem && curInventoryItem.name}
        show={modalStatus}
        value={curInventoryItemCount && curInventoryItemCount}
        setValueHandle={modalSetValueHandle}
        closeHandle={closeModalHandle}
      />

      {/*
        Search item part
      */}
      <ItemSearchBar setSearchParams={setSearchParams} />
      {items && items.length > 0 && (
        <>
          <h2 className="sandbeige">
            {`Search result ${statePage}/${statePages}`}
          </h2>
          <div className="d-flex justify-content-center">
            {(searchParams.get("handbook") ||
              searchParams.get("keyword") ||
              searchParams.get("page")) && (
              <Paginate
                page={statePage}
                pages={statePages}
                keyword={searchParams.get("keyword")}
                handbook={
                  searchParams.get("handbook")
                    ? JSON.parse(searchParams.get("handbook"))
                    : null
                }
                setSearchParams={setSearchParams}
                usePrevNext={true}
              />
            )}
          </div>
          <div className="mb-5 white">
            <div>
              {items.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="d-flex align-items-center gray-rounded-20 mb-1 px-3 py-2"
                  >
                    <div className="d-inline-block mx-3">
                      <ItemSingleGrid
                        itemId={item.id}
                        bgColor={item.backgroundColor}
                      />
                    </div>
                    <p className="mb-0 mx-3">{item.name}</p>
                    <p className="mb-0 me-4 fs-32px ma-left-auto">
                      {"x " +
                        convertKiloMega(
                          findItemAmount(playerInventory, item.id)
                        )}
                    </p>
                    <Button
                      variant="success"
                      className="mx-2 wh-square-32"
                      onClick={setCurrentItemHandle.bind(null, item)}
                    >
                      <div className="position-relative">
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <Pencil size={20} />
                        </div>
                      </div>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/*
        Inventory item part
      */}
      <h2 className="sandbeige">Inventory</h2>
      <div className="white">
        {playerInventory &&
          playerInventory.map((item) => {
            return (
              <div
                key={item.item.id}
                className="d-flex align-items-center gray-rounded-20 mb-1 px-3 py-2"
              >
                <div className="d-inline-block mx-3">
                  <ItemSingleGrid
                    itemId={item.item.id}
                    bgColor={item.item.backgroundColor}
                  />
                </div>
                <p className="mb-0 mx-3">{item.item.name}</p>
                <p className="mb-0 me-4 ma-left-auto fs-32px">
                  {"x " + convertKiloMega(item.count)}
                </p>
                <div>
                  <Button
                    variant="success"
                    className="mx-2 wh-square-32"
                    onClick={setEditingTargetInventoryItemHandle.bind(
                      null,
                      item
                    )}
                  >
                    <div className="position-relative">
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <Pencil size={20} />
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export { InventoryPanel }
