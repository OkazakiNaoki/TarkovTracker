import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { HomeScreen } from "./screens/HomeScreen"
import { FleamarketScreen } from "./screens/FleamarketScreen"
import { Header } from "./components/Header"
import stripedBg from "../public/static/images/striped_background.png"

function App() {
  return (
    <Router>
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
            <Route
              path="/fleamarket/:itemName"
              element={<FleamarketScreen />}
            />
            <Route
              path="/fleamarket/:itemCategory/:itemName"
              element={<FleamarketScreen />}
            />
            <Route path="/fleamarket" element={<FleamarketScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </Container>
      </main>
    </Router>
  )
}

export default App
