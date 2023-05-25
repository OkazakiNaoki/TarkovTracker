import { configureStore, combineReducers } from "@reduxjs/toolkit"
import thunk from "redux-thunk"
import storage from "redux-persist/lib/storage"
import session from "redux-persist/lib/storage/session"
import { persistReducer, persistStore } from "redux-persist"
import FleamarketReducer from "./reducers/FleamarketSlice"
import ItemReducer from "./reducers/ItemSlice"
import TraderReducer from "./reducers/TraderSlice"
import HideoutReducer from "./reducers/HideoutSlice"
import UserReducer from "./reducers/UserSlice"
import CharacterReducer from "./reducers/CharacterSlice"
import CustomizationReducer from "./reducers/CustomizationSlice"
import SocialMediaReducer from "./reducers/MediaSlice"

const gameDataPersistConfig = {
  key: "game-data",
  storage,
}

const userDataPersistConfig = {
  key: "user-data",
  storage: session,
}

const combinedReducer = combineReducers({
  fleamarket: persistReducer(
    {
      key: "game-fleamarket",
      storage,
    },
    FleamarketReducer
  ),
  item: persistReducer(
    {
      key: "game-item",
      storage,
    },
    ItemReducer
  ),
  trader: persistReducer(
    {
      key: "game-trader",
      storage,
    },
    TraderReducer
  ),
  hideout: persistReducer(
    {
      key: "game-hideout",
      storage,
    },
    HideoutReducer
  ),
  user: persistReducer(
    {
      key: "user-account",
      storage: session,
    },
    UserReducer
  ),
  character: persistReducer(
    {
      key: "user-character",
      storage: session,
    },
    CharacterReducer
  ),
  customization: persistReducer(
    {
      key: "user-customization",
      storage: session,
    },
    CustomizationReducer
  ),
  socialMedia: persistReducer(
    {
      key: "game-socialmedia",
      storage,
    },
    SocialMediaReducer
  ),
})

const persistedReducer = persistReducer(gameDataPersistConfig, combinedReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: [thunk],
})

export const persistor = persistStore(store)

export const purgePersistStore = () => {
  persistor.purge().then(() => {
    window.location.reload()
  })
}
