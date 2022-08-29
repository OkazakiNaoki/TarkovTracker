import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const characterSlice = createSlice({
  name: "character",
  initialState: {
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {},
})

export default characterSlice.reducer
