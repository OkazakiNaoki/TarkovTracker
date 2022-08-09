import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const incrementThunk = createAsyncThunk(
  "counter/incrementThunk",
  async () => {
    const res = await fetch("https://httpbin.org/get")
    return res.json()
  }
)

export const FleamarketSlice = createSlice({
  name: "fleamarket",
  initialState: {
    counting: 0,
  },
  reducers: {
    increment: (state) => {
      state.counting += 1
    },
    decrement: (state) => {
      state.counting -= 1
    },
    incrementWithAmount: (state, action) => {
      state.counting += action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(incrementThunk.fulfilled, (state, action) => {
      console.log(action.payload)
      state.counting += 100
    })
  },
})

export const { increment, decrement, incrementWithAmount } =
  FleamarketSlice.actions

export const incrementWithAmountAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementWithAmount(amount))
  }, 1000)
}

export const selectCount = (state) => state.fleamarket.counting

export default FleamarketSlice.reducer
