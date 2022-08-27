import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getAllHideout = createAsyncThunk(
  "hideout/getAllHideout",
  async (params) => {
    try {
      const { data } = await axios.get(`/api/hideout/levels/all`)
      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getHideoutCraftById = createAsyncThunk(
  "hideout/getHideoutCraftById",
  async (params) => {
    const { id } = params
    try {
      const { data } = await axios.get(`/api/hideout/crafts?craftId=${id}`)
      return { id, data }
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

const hideoutSlice = createSlice({
  name: "hideout",
  initialState: {
    isLoading: false,
    hideout: [],
    craft: {},
    craftLoading: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllHideout.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getAllHideout.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.hideout = action.payload
      })
      .addCase(getAllHideout.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getHideoutCraftById.pending, (state, action) => {
        state.craftLoading[`${action.meta.arg.id}`] = true
      })
      .addCase(getHideoutCraftById.fulfilled, (state, action) => {
        console.log(action.payload)
        state.craftLoading[`${action.payload.id}`] = false
        state.craft[`${action.payload.id}`] = action.payload.data
      })
      .addCase(getHideoutCraftById.rejected, (state, action) => {
        throw Error(action.payload)
      })
  },
})

export default hideoutSlice.reducer
