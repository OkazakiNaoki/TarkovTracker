import { configureStore } from "@reduxjs/toolkit"
import FleamarketReducer from "./reducers/FleamarketSlice"

const store = configureStore({
  reducer: { fleamarket: FleamarketReducer },
  devTools: true,
})

export { store }
