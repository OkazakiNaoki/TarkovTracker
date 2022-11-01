import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getAllHideout = createAsyncThunk(
  "hideout/getAllHideout",
  async (params) => {
    try {
      const { data } = await axios.get(`/api/hideout/levels/all`)

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].levels.length; j++) {
          for (let k = 0; k < data[i].levels[j].crafts.length; k++) {
            const craftData = await axios.get(
              `/api/hideout/crafts?craftId=${data[i].levels[j].crafts[k].id}`
            )
            data[i].levels[j].crafts[k] = {
              ...data[i].levels[j].crafts[k],
              ...craftData.data[0],
            }
          }
        }
      }
      return data
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
    hideout: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllHideout.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getAllHideout.fulfilled, (state, action) => {
        state.isLoading = false
        state.hideout = action.payload
      })
      .addCase(getAllHideout.rejected, (state, action) => {
        state.isLoading = false
        throw Error(action.payload)
      })
  },
})

export default hideoutSlice.reducer
