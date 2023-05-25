import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import qs from "qs"

export const initializePreset = createAsyncThunk(
  "customization/initializePreset",
  async (params, { getState }) => {
    const { user } = getState().user

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    }

    try {
      const { data } = await axios.post("/api/player/preset", {}, config)

      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

export const getPreset = createAsyncThunk(
  "customization/getPreset",
  async (params, { getState }) => {
    const { user } = getState().user

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    }

    try {
      const { data } = await axios.get("/api/player/preset", config)

      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().customization.requests["getPreset"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const updatePreset = createAsyncThunk(
  "customization/updatePreset",
  async (params, { getState }) => {
    const { user } = getState().user
    const { preset, isNew, index } = params

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    }

    console.log(isNew, index)

    try {
      const res = await axios.put(
        "/api/player/preset",
        { new: isNew, preset, ...(!isNew && { index }) },
        config
      )

      return res.status === 200
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  }
)

const CustomizationSlice = createSlice({
  name: "customization",
  initialState: {
    requests: {},
    presets: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializePreset.pending, (state, action) => {})
      .addCase(initializePreset.fulfilled, (state, action) => {
        state.presets = action.payload
      })
      .addCase(initializePreset.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(getPreset.pending, (state, action) => {})
      .addCase(getPreset.fulfilled, (state, action) => {
        state.presets = action.payload
      })
      .addCase(getPreset.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updatePreset.pending, (state, action) => {})
      .addCase(updatePreset.fulfilled, (state, action) => {
        if (action.meta.arg.isNew) {
          console.log("new")
          state.presets.push(action.meta.arg.preset)
        } else {
          console.log("old")
          const index = action.meta.arg.index
          state.presets[index] = action.meta.arg.preset
        }
      })
      .addCase(updatePreset.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default CustomizationSlice.reducer
