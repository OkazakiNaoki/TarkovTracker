import { configureStore } from "@reduxjs/toolkit"
import FleamarketReducer from "./reducers/FleamarketSlice"
import ItemReducer from "./reducers/ItemSlice"
import TraderReducer from "./reducers/TraderSlice"
import HideoutReducer from "./reducers/HideoutSlice"
import UserReducer from "./reducers/UserSlice"

const store = configureStore({
  reducer: {
    fleamarket: FleamarketReducer,
    item: ItemReducer,
    trader: TraderReducer,
    hideout: HideoutReducer,
    user: UserReducer,
  },
  devTools: true,
})

export { store }
