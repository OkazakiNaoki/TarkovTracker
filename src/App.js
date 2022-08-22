import React from "react"
import { Routes, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { createBrowserHistory } from "history"
import { CustomRouter } from "./routers/CustomRouter"
import { HomeScreen } from "./screens/HomeScreen"
import { FleamarketScreen } from "./screens/FleamarketScreen"
import { ItemScreen } from "./screens/ItemScreen"
import { Header } from "./components/Header"
import stripedBg from "../public/static/images/striped_background.png"
import CharacterScreen from "./screens/CharacterScreen"
import TaskScreen from "./screens/TaskScreen"

const history = createBrowserHistory({ window })

function App() {
  return (
    <CustomRouter history={history}>
      <Header />
      <main
        className="py-3"
        style={{
          backgroundImage: `url(${stripedBg})`,
          backgroundRepeat: "repeat",
          backgroundSize: "130px 130px",
        }}
      >
        <Container>
          <Routes>
            <Route path="/item/:itemId" element={<ItemScreen />} exact />
            <Route path="/fleamarket/*" element={<FleamarketScreen />} />
            <Route path="/task" element={<TaskScreen />} />
            <Route path="/character" element={<CharacterScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </Container>
      </main>
    </CustomRouter>
  )
}

export default App
