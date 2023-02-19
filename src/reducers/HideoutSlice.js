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
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().hideout.requests["getAllHideout"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const getAllHideoutReqItem = createAsyncThunk(
  "hideout/getAllHideoutReqItem",
  async (params) => {
    try {
      const { data } = await axios.get("/api/hideout/itemreq")

      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().hideout.requests["getAllHideoutReqItem"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

const hideoutSlice = createSlice({
  name: "hideout",
  initialState: {
    requests: {},
    isLoading: false,
    hideout: null,
    hideoutItemRequirement: null,
  },
  reducers: {
    resetHideout: (state, action) => {
      state.requests = {}
      state.isLoading = false
      state.hideout = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllHideout.pending, (state, action) => {
        state.isLoading = true
        state.requests["getAllHideout"] = "pending"
      })
      .addCase(getAllHideout.fulfilled, (state, action) => {
        state.isLoading = false
        state.hideout = action.payload
        state.requests["getAllHideout"] = "fulfilled"
      })
      .addCase(getAllHideout.rejected, (state, action) => {
        state.isLoading = false
        throw Error(action.payload)
      })
      .addCase(getAllHideoutReqItem.pending, (state, action) => {
        state.isLoading = true
        state.requests["getAllHideoutReqItem"] = "pending"
      })
      .addCase(getAllHideoutReqItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.hideoutItemRequirement = action.payload
        state.requests["getAllHideoutReqItem"] = "fulfilled"
      })
      .addCase(getAllHideoutReqItem.rejected, (state, action) => {
        state.isLoading = false
        throw Error(action.payload)
      })
  },
})

export default hideoutSlice.reducer
export const { resetHideout } = hideoutSlice.actions
