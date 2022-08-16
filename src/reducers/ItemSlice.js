import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const searchItem = createAsyncThunk(
  "item/searchItem",
  async (params) => {
    const { name } = params
    try {
      const { data } = await axios.get(`/api/item?name=${name}`)
      return data
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
    data: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchItem.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(searchItem.fulfilled, (state, action) => {
        state.data = action.payload[0]
        console.log("payload: ", action.payload[0])
      })
      .addCase(searchItem.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default ItemSlice.reducer
