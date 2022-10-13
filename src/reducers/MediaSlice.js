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
  }
)

const mediaSlice = createSlice({
  name: "socialMedia",
  initialState: {
    lastestVideoFetched: false,
    lastestVideoId: null,
    lastestUpdateNewsFetched: false,
    latestUpdateNews: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLatestVideo.pending, (state, action) => {})
      .addCase(getLatestVideo.fulfilled, (state, action) => {
        state.lastestVideoId = action.payload.videoData.items[0].id.videoId
        state.lastestVideoFetched = true
      })
      .addCase(getLatestVideo.rejected, (state, action) => {
        throw Error(action.payload)
      })
      .addCase(getLatestUpdateNews.pending, (state, action) => {})
      .addCase(getLatestUpdateNews.fulfilled, (state, action) => {
        state.latestUpdateNews = action.payload.updateNews
        state.lastestUpdateNewsFetched = true
      })
      .addCase(getLatestUpdateNews.rejected, (state, action) => {
        throw Error(action.payload)
      })
  },
})

export default mediaSlice.reducer
