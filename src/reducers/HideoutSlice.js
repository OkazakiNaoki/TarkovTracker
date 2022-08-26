import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getAllHideout = createAsyncThunk(
  "hideout/getAllHideout",
  async (params) => {
    try {
      const { data } = await axios.get(`/api/hideout/levels/all`)
      return data
    } catch (error) {}
  }
)

const hideoutSlice = createSlice({
  name: "hideout",
  initialState: {
    isLoading: false,
    hideout: [],
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
  },
})

export default hideoutSlice.reducer
