import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const characterSlice = createSlice({
  name: "character",
  initialState: {
    isLoading: false,
    initSetup: false,
    playerLevel: 40,
    faction: null,
  },
  reducers: {
    setPlayerLevel: (state, action) => {
      state.playerLevel = action.payload
    },
  },
  extraReducers: (builder) => {},
})

export default characterSlice.reducer
export const { setPlayerLevel } = characterSlice.actions
