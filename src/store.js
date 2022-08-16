import { configureStore } from "@reduxjs/toolkit"
import FleamarketReducer from "./reducers/FleamarketSlice"
import ItemReducer from "./reducers/ItemSlice"

const store = configureStore({
  reducer: { fleamarket: FleamarketReducer, item: ItemReducer },
  devTools: true,
})

export { store }
