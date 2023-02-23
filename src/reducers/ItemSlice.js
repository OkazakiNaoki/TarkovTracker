import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { Placeholder } from "react-bootstrap"
import {
  isArrayAndEmpty,
  isArrayAndNotEmpty,
  isStringArray,
  isObjectArray,
  isNumArrayArray,
} from "../helpers/CheckIsArrayOf"
import { getIndexOfObjArrWhereFieldEqualTo } from "../helpers/LoopThrough"

export const searchItem = createAsyncThunk(
  "item/searchItem",
  async (params) => {
    const { id } = params
    try {
      // name, ID, category of item
      const itemData = await axios.get(`/api/item?id=${id}`)
      const category = itemData.data[0].categories[0].name
      const mainData = itemData.data[0]

      // property union of item
      const propRevDataGet = await axios.get(
        `/api/item/properties?category=${category}`
      )
      const propRevData = propRevDataGet.data[0]
      const addtionalFieldStr = propRevData
        ? propRevData.additionalProperty.join(", ")
        : ""
      const propertiesStr = propRevData
        ? `properties {... on ${
            propRevData.propertyUnion
          }{${propRevData.properties.join(" ")}}}`
        : ""

      // properties of item
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      const body = {
        query: `{
                  items(ids: "${id}") {
                    ${addtionalFieldStr}
                    ${propertiesStr}
                    sellFor{
                      vendor{name}
                      price
                      currencyItem{id name}
                    }
                    buyFor{
                      vendor{
                        name
                        ... on TraderOffer{
                          minTraderLevel
                        }
                      }
                      price
                      currencyItem{name id}
                    }
                    bartersFor{
                      trader{name}
                      requiredItems{item{name id backgroundColor} count}
                      rewardItems{item{name id backgroundColor} count}
                      level
                    }
                    craftsFor{
                      station{
                        id
                        name
                      }
                      level
                      duration
                      requiredItems{
                        item{id name}
                        count
                      }
                      rewardItems{
                        item{id name}
                        count
                      }
                    }
                    usedInTasks{
                      id
                      name
                      trader{name}
                      objectives{
                        ... on TaskObjectiveItem {
                          type
                          item{name id}
                          count
                        }
                      }
                    }
                    receivedFromTasks{
                        id
                        name
                        trader{name}
                        finishRewards{
                          items{
                            item{id name}
                            count
                          }
                        }
                      }
                  }
              }`,
      }
      const gql = await axios.post(
        `https://api.tarkov.dev/graphql`,
        body,
        config
      )
      const gqlData = gql.data.data.items[0]
      const revProperties = {}
      // main processing part of properties
      for (let key in gqlData.properties) {
        if (gqlData.properties[key] === null) {
          continue
        } else if (isArrayAndEmpty(gqlData.properties[key])) {
          revProperties[propRevData.propertyRename[key]] = "None"
        } else if (
          isNumArrayArray(gqlData.properties[key]) &&
          key === "zoomLevels"
        ) {
          revProperties[propRevData.propertyRename[key]] = getZoomLevelsString(
            gqlData.properties[key]
          )
        } else if (isStringArray(gqlData.properties[key])) {
          revProperties[propRevData.propertyRename[key]] =
            gqlData.properties[key].join(", ")
        } else if (
          isObjectArray(gqlData.properties[key]) &&
          key === "stimEffects"
        ) {
          revProperties[propRevData.propertyRename[key]] = getStimEffectsString(
            gqlData.properties[key]
          )
        } else if (isObjectArray(gqlData.properties[key]) && key === "grids") {
          revProperties[propRevData.propertyRename[key]] = getPouchesString(
            gqlData.properties[key]
          )
        } else if (
          typeof gqlData.properties[key] === "object" &&
          key === "material"
        ) {
          revProperties[propRevData.propertyRename[key]] =
            gqlData.properties[key].name
        } else if (isObjectArray(gqlData.properties[key]) && key === "slots") {
          revProperties[propRevData.propertyRename[key]] = getSlotsString(
            gqlData.properties[key]
          )
        } else if (
          isObjectArray(gqlData.properties[key]) &&
          key === "presets"
        ) {
          revProperties[propRevData.propertyRename[key]] = getPresetsString(
            gqlData.properties[key]
          )
        } else {
          revProperties[propRevData.propertyRename[key]] =
            gqlData.properties[key]
        }
      }
      const dontRename = [
        "sellFor",
        "buyFor",
        "bartersFor",
        "usedInTasks",
        "receivedFromTasks",
        "craftsFor",
      ]
      // add addtional field into properties
      for (let key in gqlData) {
        if (dontRename.includes(key)) {
          mainData[key] = gqlData[key]
        } else if (key !== "properties") {
          revProperties[propRevData.propertyRename[key]] = gqlData[key]
        }
      }
      // rematch value of property fields
      if (revProperties.hasOwnProperty("Ammunition")) {
        const formatedCaliber = await axios.get(
          `/api/item/caliber?caliber=${revProperties.Ammunition}`
        )
        revProperties.Ammunition = formatedCaliber.data[0].ammunition
      }
      mainData.properties = revProperties

      return mainData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

const getZoomLevelsString = (zoomLevels) => {
  let zoomLevelsStr = ""
  for (let i = 0; i < zoomLevels[0].length; i++) {
    zoomLevelsStr +=
      zoomLevels[0][i] + "x" + (i !== zoomLevels[0].length - 1 ? ", " : "")
  }
  return zoomLevelsStr
}

const getStimEffectsString = (stimEffects) => {
  let stimEffectStr = ""
  for (let i = 0; i < stimEffects.length; i++) {
    stimEffectStr +=
      (stimEffects[i].type === "Skill"
        ? stimEffects[i].skillName
        : stimEffects[i].type) +
      " " +
      (stimEffects[i].value > 0
        ? "+" + stimEffects[i].value + " "
        : stimEffects[i].value !== 0
        ? stimEffects[i].value + " "
        : "") +
      stimEffects[i].duration +
      (i !== stimEffects.length - 1 ? "s,\n" : "s")
  }
  return stimEffectStr
}

const getPouchesString = (pouches) => {
  let pouchesStr = ""
  for (let i = 0; i < pouches.length; i++) {
    pouchesStr +=
      pouches[i].width +
      "X" +
      pouches[i].height +
      (i !== pouches.length - 1 ? ", " : "")
  }
  return pouchesStr
}

const getSlotsString = (slots) => {
  let slotsStr = ""
  for (let i = 0; i < slots.length; i++) {
    slotsStr += slots[i].name + (i !== slots.length - 1 ? ", " : "")
  }
  return slotsStr
}

const getPresetsString = (presets) => {
  let presetsStr = ""
  for (let i = 0; i < presets.length; i++) {
    presetsStr += presets[i].name + (i !== presets.length - 1 ? ", " : "")
  }
  return presetsStr
}

export const searchHideoutItemReq = createAsyncThunk(
  "item/searchHideoutItemReq",
  async (params) => {
    const { itemId = "", itemName = "" } = params
    try {
      const hideoutLevelData = await axios.get(
        `/api/hideout/levels?itemName=${itemName}&itemId=${itemId}`
      )
      return hideoutLevelData.data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

const ItemSlice = createSlice({
  name: "item",
  initialState: {
    isLoading: false,
    item: { properties: [] },
    searchedItemId: [],
    searchedItem: [],
    hideout: [],
    loadingQueue: 0,
  },
  reducers: {
    recoverItem: (state, action) => {
      const index = getIndexOfObjArrWhereFieldEqualTo(
        state.searchedItem,
        "id",
        action.payload
      )
      state.item = state.searchedItem[index]
    },
    resetItem: (state, action) => {
      state.isLoading = false
      state.item = { properties: [] }
      state.hideout = []
      state.loadingQueue = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItem.pending, (state, action) => {
        state.loadingQueue += 1
        state.isLoading = true
      })
      .addCase(searchItem.fulfilled, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        if (state.item.hasOwnProperty("id")) {
          state.searchedItemId.push(state.item.id)
          state.searchedItem.push(state.item)
        }
        state.item = action.payload
      })
      .addCase(searchItem.rejected, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.error = action.payload
      })
      .addCase(searchHideoutItemReq.pending, (state, action) => {
        state.loadingQueue += 1
        state.isLoading = true
      })
      .addCase(searchHideoutItemReq.fulfilled, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.hideout = action.payload
      })
      .addCase(searchHideoutItemReq.rejected, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.error = action.payload
      })
  },
})

export default ItemSlice.reducer
export const { resetItem, recoverItem } = ItemSlice.actions
