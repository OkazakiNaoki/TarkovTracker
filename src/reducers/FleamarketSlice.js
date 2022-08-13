import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const searchItemByName = createAsyncThunk(
  "fleamarket/searchItemByName",
  async (params) => {
    const { category, keyword } = params
    try {
      if (keyword) {
        if (category) {
          const { data } = await axios.get(
            `/api/items?category=${category}&keyword=${keyword}`
          )
          return data
        } else {
          const { data } = await axios.get(`/api/items?keyword=${keyword}`)
          return data
        }
      } else {
        if (category) {
          const { data } = await axios.get(`/api/items?category=${category}`)
          return data
        } else {
          const { data } = await axios.get(`/api/items`)
          return data
        }
      }
    } catch (error) {
      console.log(error)
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const FleamarketSlice = createSlice({
  name: "fleamarket",
  initialState: {
    isLoading: false,
    items: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchItemByName.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(searchItemByName.fulfilled, (state, action) => {
        state.success = true
        state.isLoading = false
        state.items = action.payload.items
      })
      .addCase(searchItemByName.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export default FleamarketSlice.reducer
