import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getTraders = createAsyncThunk(
  "trader/getTraders",
  async (params) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
      const body = {
        query: `{
          traders(lang: en){
            id
            name
          }
        }`,
      }
      const gql = await axios.post(
        `https://api.tarkov.dev/graphql`,
        body,
        config
      )
      const gqlData = gql.data.data.traders
      return gqlData
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

const traderSlice = createSlice({
  name: "trader",
  initialState: {
    isLoading: false,
    traders: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTraders.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getTraders.fulfilled, (state, action) => {
        state.isLoading = false
        state.traders = action.payload
        console.log(action.payload)
      })
      .addCase(getTraders.rejected, (state, action) => {
        throw Error(action.payload)
      })
  },
})

export default traderSlice.reducer
