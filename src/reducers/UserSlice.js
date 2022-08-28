import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const login = createAsyncThunk("user/login", async (params) => {
  const { email, password } = params
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }
    const { data } = await axios.post(
      "/api/user/login",
      { email, password },
      config
    )
    return data
  } catch (error) {
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    user: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        throw new Error(action.payload)
      })
  },
})

export default userSlice.reducer
