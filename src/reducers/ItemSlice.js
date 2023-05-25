import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import qs from "qs"
import {
  isArrayAndEmpty,
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
                        item{id name backgroundColor}
                        count
                      }
                      rewardItems{
                        item{id name backgroundColor}
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
                          item{name id backgroundColor}
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
                            item{id name backgroundColor}
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

export const refectchFleaMarketBuyPrice = createAsyncThunk(
  "item/refectchFleaMarketBuyPrice",
  async (params) => {
    const { id } = params
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      const body = {
        query: `{
                  items(ids: "${id}") {
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
                  }
              }`,
      }
      const gql = await axios.post(
        `https://api.tarkov.dev/graphql`,
        body,
        config
      )
      const gqlData = gql.data.data.items[0]
      return gqlData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const refectchFleaMarketSellPrice = createAsyncThunk(
  "item/refectchFleaMarketSellPrice",
  async (params) => {
    const { id } = params
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      const body = {
        query: `{
                  items(ids: "${id}") {
                    sellFor{
                      vendor{name}
                      price
                      currencyItem{id name}
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
      return gqlData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getWeaponList = createAsyncThunk(
  "item/getWeaponList",
  async (params) => {
    try {
      const weapons = await axios.get("/api/items/weapons")

      return weapons.data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().item.requests["getWeaponList"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const getWeapon = createAsyncThunk(
  "item/getWeapon",
  async (params) => {
    try {
      const weapon = await axios.get(`/api/item/weapon?id=${params.id}`)

      return weapon.data[0]
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().item.requests[`getWeaponList.${params.id}`]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const getFilterModIds = createAsyncThunk(
  "item/getFilterModIds",
  async (params, { getState }) => {
    const { handbook = "All", keyword = null, page = 1, limit = 20 } = params
    const { fetchedMods, fetchedModFilter } = getState().item
    try {
      // find out if the filter was fetched before
      const ownHandbook = fetchedModFilter.hasOwnProperty(handbook)
      const ownPage = ownHandbook
        ? fetchedModFilter[handbook].hasOwnProperty(page)
        : false
      let wereFetched = ownHandbook && ownPage
      let hasKeyword = keyword !== null

      // fetch filtered mod id list if it's not yet fetch before, or if keyword is given
      let modIds
      let pages
      let mods
      if (!wereFetched || hasKeyword) {
        const parameters = {
          ...(handbook !== "All" && { handbook }),
          keyword,
          page,
          limit,
        }

        const filterResult = await axios.get("/api/items/modIds", {
          params: parameters,
          paramsSerializer: (params) => {
            return qs.stringify(params)
          },
        })
        modIds = filterResult.data.modIds
        pages = filterResult.data.pages

        // read mod id list of filter result, find out mod data that is not yet fetch
        const notFetched = []
        modIds.forEach((id) => {
          if (!fetchedMods.hasOwnProperty(id)) {
            notFetched.push(id)
          }
        })

        // fetch mod data that is not yet fetch
        if (notFetched.length > 0) {
          const modsResult = await axios.get("/api/items/mods", {
            params: { ids: notFetched },
            paramsSerializer: (params) => {
              return qs.stringify(params)
            },
          })
          mods = modsResult.data.mods
        } else {
          mods = []
        }
      }

      return {
        ...((!wereFetched || hasKeyword) && { pages }),
        ...((!wereFetched || hasKeyword) && { modIds }),
        ...((!wereFetched || hasKeyword) && { mods }),
        wereFetched,
        hasKeyword,
      }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getModByIds = createAsyncThunk(
  "item/getModByIds",
  async (params, { getState }) => {
    const { modIds } = params
    const { fetchedMods } = getState().item
    try {
      const notFetched = []
      modIds.forEach((id) => {
        if (!fetchedMods.hasOwnProperty(id)) {
          notFetched.push(id)
        }
      })

      if (notFetched.length > 0) {
        console.log("thunk", notFetched)
        const modsResult = await axios.get("/api/items/mods", {
          params: { ids: notFetched },
          paramsSerializer: (params) => {
            return qs.stringify(params)
          },
        })
        const mods = modsResult.data.mods

        return mods
      } else return []
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
      return { hideout: hideoutLevelData.data, itemId: itemId }
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
    requests: {},
    isLoading: false,
    item: { properties: [], hideout: null },
    searchedItemId: [],
    searchedItem: [],
    loadingQueue: 0,
    weaponList: null,
    weapons: {},
    currentModFilter: [],
    fetchedModFilter: {},
    fetchedMods: {},
    modCategories: {
      "Gear mods": {
        Magazines: {},
        "Charging handles": {},
        Mounts: {},
        "Stocks & chassis": {},
        Launchers: {},
      },
      "Functional mods": {
        "Light & laser devices": {
          "Tactical combo devices": {},
          Flashlights: {},
          "Laser target pointers": {},
        },
        "Muzzle devices": {
          "Flashhiders & brakes": {},
          Suppressors: {},
          "Muzzle adapters": {},
        },
        Sights: {
          "Assault scopes": {},
          Collimators: {},
          "Iron sights": {},
          Optics: {},
          "Compact collimators": {},
          "Special purpose sights": {},
        },
        Foregrips: {},
        "Auxiliary parts": {},
        Bipods: {},
      },
      "Vital parts": {
        Barrels: {},
        "Pistol grips": {},
        "Receivers & slides": {},
        Handguards: {},
        "Gas blocks": {},
      },
    },
    modCategoriesLayer: [
      ["Gear mods", "Functional mods", "Vital parts"],
      [
        "Magazines",
        "Charging handles",
        "Mounts",
        "Stocks & chassis",
        "Launchers",
        "Light & laser devices",
        "Muzzle devices",
        "Sights",
        "Foregrips",
        "Auxiliary parts",
        "Bipods",
        "Barrels",
        "Pistol grips",
        "Receivers & slides",
        "Handguards",
        "Gas blocks",
      ],
      [
        "Tactical combo devices",
        "Flashlights",
        "Laser target pointers",
        "Flashhiders & brakes",
        "Suppressors",
        "Muzzle adapters",
        "Assault scopes",
        "Collimators",
        "Iron sights",
        "Optics",
        "Compact collimators",
        "Special purpose sights",
      ],
    ],
    draggingMod: null,
    draggingModIndex: null,
  },
  reducers: {
    recoverItem: (state, action) => {
      // backup current item
      if (
        state.item.hasOwnProperty("id") &&
        !state.searchedItemId.includes(state.item.id)
      ) {
        state.searchedItemId.push(state.item.id)
        state.searchedItem.push(state.item)
      }
      // then recover
      const index = getIndexOfObjArrWhereFieldEqualTo(
        state.searchedItem,
        "id",
        action.payload
      )
      state.item = state.searchedItem[index]
    },
    resetItem: (state, action) => {
      state.requests = {}
      state.isLoading = false
      state.item = { properties: [], hideout: null }
      state.loadingQueue = 0
      state.weaponList = null
      state.weapons = {}
    },
    clearFetchedMods: (state, action) => {
      state.fetchedMods = {}
      state.fetchedModFilter = {}
    },
    setDraggingMod: (state, action) => {
      state.draggingMod = action.payload.mod
      state.draggingModIndex = action.payload.index
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
        if (
          state.item.hasOwnProperty("id") &&
          !state.searchedItemId.includes(state.item.id)
        ) {
          state.searchedItemId.push(state.item.id)
          state.searchedItem.push(state.item)
        }
        state.item = { ...action.payload, hideout: null }
      })
      .addCase(searchItem.rejected, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.error = action.payload
      })
      .addCase(refectchFleaMarketBuyPrice.pending, (state, action) => {
        state.loadingQueue += 1
        state.isLoading = true
      })
      .addCase(refectchFleaMarketBuyPrice.fulfilled, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.item.buyFor = action.payload.buyFor
        if (state.searchedItemId.includes(state.item.id)) {
          const index = getIndexOfObjArrWhereFieldEqualTo(
            state.searchedItem,
            "id",
            state.item.id
          )
          state.searchedItem[index] = state.item
        }
      })
      .addCase(refectchFleaMarketBuyPrice.rejected, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.error = action.payload
      })
      .addCase(refectchFleaMarketSellPrice.pending, (state, action) => {
        state.loadingQueue += 1
        state.isLoading = true
      })
      .addCase(refectchFleaMarketSellPrice.fulfilled, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.item.sellFor = action.payload.sellFor
        if (state.searchedItemId.includes(state.item.id)) {
          const index = getIndexOfObjArrWhereFieldEqualTo(
            state.searchedItem,
            "id",
            state.item.id
          )
          state.searchedItem[index] = state.item
        }
      })
      .addCase(refectchFleaMarketSellPrice.rejected, (state, action) => {
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
        state.item.hideout = action.payload.hideout
      })
      .addCase(searchHideoutItemReq.rejected, (state, action) => {
        state.loadingQueue -= 1
        if (state.loadingQueue === 0) {
          state.isLoading = false
        }
        state.error = action.payload
      })
      .addCase(getWeaponList.pending, (state, action) => {
        state.requests["getWeaponList"] = "pending"
      })
      .addCase(getWeaponList.fulfilled, (state, action) => {
        const weaponList = {}
        action.payload.forEach((weapon) => {
          if (weaponList.hasOwnProperty(weapon.handbook)) {
            weaponList[weapon.handbook].push({
              name: weapon.shortName,
              id: weapon.id,
              default: weapon.default,
            })
          } else {
            weaponList[weapon.handbook] = [
              {
                name: weapon.shortName,
                id: weapon.id,
                default: weapon.default,
              },
            ]
          }
        })

        state.weaponList = weaponList
        state.requests["getWeaponList"] = "fulfilled"
      })
      .addCase(getWeaponList.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getWeapon.pending, (state, action) => {
        state.requests[`getWeapon.${action.meta.arg.id}`] = "pending"
      })
      .addCase(getWeapon.fulfilled, (state, action) => {
        state.weapons[action.payload.id] = action.payload
        state.requests[`getWeapon.${action.meta.arg.id}`] = "fulfilled"
      })
      .addCase(getWeapon.rejected, (state, action) => {
        state.requests[`getWeapon.${action.meta.arg.id}`] = "rejected"
        throw Error(action.payload)
      })
      .addCase(getFilterModIds.pending, (state, action) => {})
      .addCase(getFilterModIds.fulfilled, (state, action) => {
        if (action.payload.wereFetched && !action.payload.hasKeyword) {
          // filter mods have been fetched before
          state.modHandbook = action.meta.arg.handbook
          state.modPage = action.meta.arg.page
          state.modPages =
            state.fetchedModFilter[action.meta.arg.handbook]["pages"]
          state.currentModFilter =
            state.fetchedModFilter[action.meta.arg.handbook][
              action.meta.arg.page
            ]
        } else {
          // save new fetched filter mod ids into fetchedModFilter
          if (!action.payload.wereFetched) {
            if (
              !state.fetchedModFilter.hasOwnProperty(action.meta.arg.handbook)
            ) {
              const newHandbookObj = {}
              newHandbookObj["pages"] = action.payload.pages
              newHandbookObj[action.meta.arg.page] = action.payload.modIds
              state.fetchedModFilter[action.meta.arg.handbook] = newHandbookObj
            } else {
              state.fetchedModFilter[action.meta.arg.handbook][
                action.meta.arg.page
              ] = action.payload.modIds
            }
          }
          // add the new mod data
          action.payload.mods.forEach((mod) => {
            state.fetchedMods[mod.id] = mod
          })
          state.modPage = action.meta.arg.page
          state.modPages = action.payload.pages
          state.modHandbook = action.meta.arg.handbook
          state.currentModFilter = action.payload.modIds
        }
      })
      .addCase(getFilterModIds.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(getModByIds.pending, (state, action) => {})
      .addCase(getModByIds.fulfilled, (state, action) => {
        action.payload.forEach((mod) => {
          state.fetchedMods[mod.id] = mod
        })
      })
      .addCase(getModByIds.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default ItemSlice.reducer
export const { resetItem, recoverItem, clearFetchedMods, setDraggingMod } =
  ItemSlice.actions
