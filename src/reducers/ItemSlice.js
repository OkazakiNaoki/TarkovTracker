import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { Placeholder } from "react-bootstrap"

export const searchItem = createAsyncThunk(
  "item/searchItem",
  async (params) => {
    const { name } = params
    try {
      // name, ID, category of item
      const itemData = await axios.get(`/api/item?name=${name}`)
      const category = itemData.data[0].categories[0].name
      const id = itemData.data[0].id
      const mainData = itemData.data[0]

      // property union of item
      const propRevDataGet = await axios.get(
        `/api/item/properties?category=${category}`
      )
      const propRevData = propRevDataGet.data[0]

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
                    ${propRevData.additionalProperty.join(", ")}
                    properties {
                      ... on ${propRevData.propertyUnion} {
                          ${propRevData.properties.join(" ")}
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
      for (let key in gqlData.properties) {
        if (
          Array.isArray(gqlData.properties[key]) &&
          gqlData.properties[key].length > 0 &&
          typeof gqlData.properties[key][0] === "string"
        ) {
          revProperties[propRevData.propertyRename[key]] =
            gqlData.properties[key].join(", ")
        } else {
          revProperties[propRevData.propertyRename[key]] =
            gqlData.properties[key]
        }
      }
      for (let key in gqlData) {
        if (key !== "properties") {
          revProperties[propRevData.propertyRename[key]] = gqlData[key]
        }
      }
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

const ItemSlice = createSlice({
  name: "item",
  initialState: {
    isLoading: false,
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchItem.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(searchItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
        console.log("payload: ", action.payload)
      })
      .addCase(searchItem.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default ItemSlice.reducer
