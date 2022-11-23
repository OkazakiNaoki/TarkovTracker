import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getLatestVideo = createAsyncThunk(
  "socialMedia/getLatestVideo",
  async (params) => {
    try {
      const { data } = await axios.get(`/api/socialmedia/yt/latest`)

      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().socialMedia.requests["getLatestVideo"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

export const getLatestUpdateNews = createAsyncThunk(
  "socialMedia/getLatestUpdateNews",
  async (params) => {
    try {
      const { data } = await axios.get(`/api/socialmedia/news/update`)

      return data
    } catch (error) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    }
  },
  {
    condition: (params, { getState }) => {
      const fetchStatus = getState().socialMedia.requests["getLatestUpdateNews"]
      if (fetchStatus === "pending" || fetchStatus === "fulfilled") {
        return false
      }
    },
  }
)

const mediaSlice = createSlice({
  name: "socialMedia",
  initialState: {
    requests: {},
    lastestVideoFetched: false,
    lastestVideoId: null,
    lastestUpdateNewsFetched: false,
    latestUpdateNews: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLatestVideo.pending, (state, action) => {
        state.requests["getLatestVideo"] = "pending"
      })
      .addCase(getLatestVideo.fulfilled, (state, action) => {
        state.lastestVideoId = action.payload.videoData.items[0].id.videoId
        state.lastestVideoFetched = true
        state.requests["getLatestVideo"] = "fulfilled"
      })
      .addCase(getLatestVideo.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getLatestUpdateNews.pending, (state, action) => {
        state.requests["getLatestUpdateNews"] = "pending"
      })
      .addCase(getLatestUpdateNews.fulfilled, (state, action) => {
        state.latestUpdateNews = action.payload.updateNews
        state.lastestUpdateNewsFetched = true
        state.requests["getLatestUpdateNews"] = "fulfilled"
      })
      .addCase(getLatestUpdateNews.rejected, (state, action) => {
        throw Error(action.payload)
      })
  },
})

export default mediaSlice.reducer
