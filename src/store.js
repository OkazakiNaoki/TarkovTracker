import { configureStore } from "@reduxjs/toolkit"
import FleamarketReducer from "./reducers/FleamarketSlice"
import ItemReducer from "./reducers/ItemSlice"
import TraderReducer from "./reducers/TraderSlice"

const store = configureStore({
  reducer: {
    fleamarket: FleamarketReducer,
    item: ItemReducer,
    trader: TraderReducer,
  },
  devTools: true,
})

export { store }
