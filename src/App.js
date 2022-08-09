import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { HomeScreen } from "./screens/HomeScreen"
import { CounterScreen } from "./screens/CounterScreen"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/counter" element={<CounterScreen />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
