import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const searchItemByName = createAsyncThunk(
  "fleamarket/searchItemByName",
  async (params) => {
    const { handbook = "", keyword = "", page = "" } = params
    try {
      const { data } = await axios.get(
        `/api/items?handbook=${encodeURIComponent(
          handbook
        )}&keyword=${encodeURIComponent(keyword)}&page=${page}`
      )
      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getItemCategory = createAsyncThunk(
  "fleamarket/getItemCategory",
  async (params) => {
    const { type } = params
    try {
      const { data } = await axios.get(`/api/items/categories?type=${type}`)
      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getItemHandbook = createAsyncThunk(
  "fleamarket/getItemHandbook",
  async (params) => {
    const { type } = params
    try {
      const { data } = await axios.get(`/api/items/handbook?type=${type}`)
      return data
    } catch (error) {
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
    categories: [],
    handbook: [],
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
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(searchItemByName.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(getItemCategory.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getItemCategory.fulfilled, (state, action) => {
        state.success = true
        state.isLoading = false
        state.categories = action.payload.categories
      })
      .addCase(getItemCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(getItemHandbook.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getItemHandbook.fulfilled, (state, action) => {
        state.success = true
        state.isLoading = false
        state.handbook = action.payload.handbook
      })
      .addCase(getItemHandbook.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export default FleamarketSlice.reducer
