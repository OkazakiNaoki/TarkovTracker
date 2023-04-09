import React from "react"
import { Routes, Route } from "react-router-dom"
import { createBrowserHistory } from "history"
import { CustomRouter } from "./routers/CustomRouter"
import { HomeScreen } from "./screens/HomeScreen"
import { FleamarketScreen } from "./screens/FleamarketScreen"
import { ItemScreen } from "./screens/ItemScreen"
import { Header } from "./components/Header"
import { CharacterScreen } from "./screens/CharacterScreen"
import { TaskScreen } from "./screens/TaskScreen"
import { HideoutScreen } from "./screens/HideoutScreen"
import { LoginScreen } from "./screens/LoginScreen"
import { RegisterScreen } from "./screens/RegisterScreen"
import { UserSettingScreen } from "./screens/UserSettingScreen"

const history = createBrowserHistory({ window })

function App() {
  return (
    <CustomRouter history={history}>
      <Header />
      <main>
        <Routes>
          <Route path="/item/:itemId" element={<ItemScreen />} />
          <Route path="/fleamarket/*" element={<FleamarketScreen />} />
          <Route path="/task" element={<TaskScreen />} />
          <Route path="/hideout" element={<HideoutScreen />} />
          <Route path="/character" element={<CharacterScreen />} />
          <Route path="/setting" element={<UserSettingScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </main>
    </CustomRouter>
  )
}

export default App
