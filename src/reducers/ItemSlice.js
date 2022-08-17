import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const searchItem = createAsyncThunk(
  "item/searchItem",
  async (params) => {
    const { name } = params
    try {
      const mainData = await axios.get(`/api/item?name=${name}`)
      const category =
        mainData.data[0].categories[mainData.data[0].categories.length - 1]
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      console.log(mainData.data[0].id)
      const body = {
        query: `{
                items(ids: "${mainData.data[0].id}") {
                  weight
                  properties {
                    ... on ItemProperties${category.name} {
                        caliber
                        effectiveDistance
                        ergonomics
                        defaultErgonomics
                        recoilVertical
                        defaultRecoilVertical
                        recoilHorizontal
                        defaultRecoilHorizontal
                        fireModes
                        fireRate
                        sightingRange
                        repairCost
                        defaultWeight
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
      mainData.data[0].weight = gql.data.data.items[0].weight
      mainData.data[0].properties = gql.data.data.items[0].properties
      return mainData.data[0]
      //   return Promise.all([
      //     await axios.get(`/api/item?name=${name}`),
      //     await axios.post(`https://api.tarkov.dev/graphql`, body, config),
      //   ]).then((v) => {
      //     v[0].data[0].weight = v[1].data.data.items[0].weight
      //     return v[0].data[0]
      //   })
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
